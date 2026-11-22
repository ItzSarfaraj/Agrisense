from app.prompts.crop_doctor_prompt import build_crop_doctor_prompt
from app.services.genai_service import generate_vision_json

MAX_CROP_LENGTH = 60
MAX_SYMPTOMS_LENGTH = 500

_IMAGE_QUALITY = {"good", "fair", "poor"}
_SEVERITY = {"low", "moderate", "high", "unclear"}
_LIKELIHOOD = {"high", "moderate", "low"}

DEFAULT_DISCLAIMER = (
    "This is AI-based image analysis and should be confirmed by a "
    "qualified agricultural expert when necessary."
)


def _text(value, default=""):
    if value is None:
        return default
    if isinstance(value, str):
        return value.strip() or default
    return str(value)


def _text_list(value) -> list[str]:
    if value is None:
        return []
    if isinstance(value, str):
        value = [value]
    if not isinstance(value, list):
        return []
    result = []
    for item in value:
        if isinstance(item, dict):
            item = " - ".join(str(v) for v in item.values() if v)
        text = _text(item)
        if text:
            result.append(text)
    return result


def normalize_crop_doctor_analysis(raw) -> dict:
    if not isinstance(raw, dict):
        raise ValueError("The model returned an unexpected Crop Doctor format")

    conditions = []
    raw_conditions = raw.get("possible_conditions")

    if isinstance(raw_conditions, list):
        for item in raw_conditions:
            if isinstance(item, str):
                item = {"common_name": item}
            if not isinstance(item, dict):
                continue
            common = _text(item.get("common_name") or item.get("name"))
            if not common:
                continue
            likelihood = _text(item.get("likelihood")).lower()
            conditions.append({
                "common_name": common,
                "local_name": _text(item.get("local_name"), common),
                "scientific_name": _text(item.get("scientific_name"), "") or None,
                "likelihood": likelihood if likelihood in _LIKELIHOOD else "low",
                "reason": _text(item.get("reason")),
            })

    image_quality = _text(raw.get("image_quality")).lower()
    severity = _text(raw.get("severity")).lower()

    return {
        "summary": _text(raw.get("summary")),
        "image_quality": image_quality if image_quality in _IMAGE_QUALITY else "fair",
        "observations": _text_list(raw.get("observations")),
        "possible_conditions": conditions,
        "severity": severity if severity in _SEVERITY else "unclear",
        "immediate_actions": _text_list(raw.get("immediate_actions")),
        "treatment_guidance": _text_list(raw.get("treatment_guidance")),
        "prevention": _text_list(raw.get("prevention")),
        "expert_help": _text(raw.get("expert_help")),
        "disclaimer": _text(raw.get("disclaimer"), DEFAULT_DISCLAIMER),
    }


def generate_crop_doctor_analysis(images, crop, symptoms, language, language_code) -> dict:
    if not images:
        raise ValueError("At least one image is required")

    crop = (crop or "").strip()[:MAX_CROP_LENGTH] or None
    symptoms = (symptoms or "").strip()[:MAX_SYMPTOMS_LENGTH]

    prompt = build_crop_doctor_prompt(
        crop=crop, symptoms=symptoms,
        language=language, language_code=language_code,
    )

    raw = generate_vision_json(prompt, images, temperature=0.2)
    return normalize_crop_doctor_analysis(raw)