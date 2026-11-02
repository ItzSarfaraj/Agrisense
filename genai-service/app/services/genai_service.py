"""
Shared entry points used by every GenAI feature.

The feature services (chatbot, advisory, insights, Crop Doctor ...) only call
generate_text, generate_json and generate_vision_json. Which model answers is
decided by LLM_PROVIDER in app/config.py.
"""

import io
import json

from app import config
from app.llm import get_provider


# ---------------------------------------------------------------------------
# JSON handling
# ---------------------------------------------------------------------------

def parse_json_response(text: str) -> dict:
    """
    Turn a model answer into a dict.

    Small local models sometimes wrap JSON in ```json fences or add a short
    sentence around it, so fences are removed and, if needed, the outermost
    {...} block is extracted.
    """
    cleaned = text.strip()

    if cleaned.startswith("```"):
        cleaned = cleaned.removeprefix("```json").removeprefix("```")
        cleaned = cleaned.removesuffix("```").strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    start = cleaned.find("{")
    end = cleaned.rfind("}")

    if start != -1 and end > start:
        try:
            return json.loads(cleaned[start:end + 1])
        except json.JSONDecodeError:
            pass

    raise ValueError("The model returned invalid JSON")


def _chat_json(prompt, temperature, images=None) -> dict:
    provider = get_provider()
    last_error = None

    for attempt in range(config.LLM_JSON_RETRIES + 1):
        text = provider.chat(
            prompt,
            temperature=temperature,
            json_mode=True,
            images=images,
        )

        try:
            return parse_json_response(text)
        except ValueError as error:
            last_error = error
            print(
                f"{provider.name}: invalid JSON on attempt "
                f"{attempt + 1}, retrying"
                if attempt < config.LLM_JSON_RETRIES
                else f"{provider.name}: invalid JSON, giving up"
            )

    raise ValueError(
        f"{provider.name} returned invalid JSON"
    ) from last_error


# ---------------------------------------------------------------------------
# Images
# ---------------------------------------------------------------------------

def prepare_images(images: list[dict]) -> tuple[list[dict], int]:
    """
    Limit and shrink uploaded photos.

    Returns (prepared_images, original_count). Shrinking keeps the disease
    details visible but makes CPU-only machines much faster.
    """
    original_count = len(images)
    selected = images

    if config.LLM_MAX_IMAGES and original_count > config.LLM_MAX_IMAGES:
        selected = images[:config.LLM_MAX_IMAGES]

    if not config.LLM_IMAGE_MAX_SIDE:
        return selected, original_count

    try:
        from PIL import Image
    except ImportError:
        return selected, original_count

    prepared = []

    for image in selected:
        try:
            with Image.open(io.BytesIO(image["data"])) as picture:
                picture = picture.convert("RGB")
                picture.thumbnail(
                    (config.LLM_IMAGE_MAX_SIDE, config.LLM_IMAGE_MAX_SIDE)
                )

                buffer = io.BytesIO()
                picture.save(buffer, format="JPEG", quality=88)

            prepared.append(
                {"data": buffer.getvalue(), "mime_type": "image/jpeg"}
            )

        except Exception:
            prepared.append(image)

    return prepared, original_count


# ---------------------------------------------------------------------------
# Public helpers
# ---------------------------------------------------------------------------

def generate_text(
    prompt: str,
    temperature: float = 0.3,
    max_tokens: int | None = None,
) -> str:
    return get_provider().chat(
        prompt,
        temperature=temperature,
        max_tokens=max_tokens,
    )


def generate_json(prompt: str, temperature: float = 0.3) -> dict:
    return _chat_json(prompt, temperature)


def generate_vision_json(
    prompt: str,
    images: list[dict],
    temperature: float = 0.2,
) -> dict:
    prepared, original_count = prepare_images(images)

    if len(prepared) < original_count:
        prompt += (
            f"\n\nNote: the farmer uploaded {original_count} photos, "
            f"but only the first {len(prepared)} are provided to you. "
            "Mention this limitation briefly in the summary."
        )

    return _chat_json(prompt, temperature, images=prepared)