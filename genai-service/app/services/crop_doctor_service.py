import json

from google.genai import types

from app.config import client, GOOGLE_GENAI_MODEL, GENERATION_CONFIG
from app.prompts.crop_doctor_prompt import build_crop_doctor_prompt


def _parse_response(text: str) -> dict:
    cleaned = text.strip()

    if cleaned.startswith("```"):
        cleaned = cleaned.removeprefix("```json").removeprefix("```")
        cleaned = cleaned.removesuffix("```").strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError as error:
        raise ValueError("Gemini returned invalid Crop Doctor JSON") from error


def generate_crop_doctor_analysis(
    images: list[dict],
    crop: str | None,
    symptoms: str,
    language: str,
    language_code: str,
) -> dict:
    if not images:
        raise ValueError("At least one image is required")

    prompt = build_crop_doctor_prompt(
        crop=crop,
        symptoms=symptoms,
        language=language,
        language_code=language_code,
    )

    contents = [prompt]

    for image in images:
        contents.append(
            types.Part.from_bytes(
                data=image["data"],
                mime_type=image["mime_type"],
            )
        )

    response = client.models.generate_content(
        model=GOOGLE_GENAI_MODEL,
        contents=contents,
        config=types.GenerateContentConfig(
            temperature=0.2,
            response_mime_type="application/json",
        ),
    )

    if not response.text:
        raise ValueError("Empty response received from Vertex AI")

    return _parse_response(response.text)