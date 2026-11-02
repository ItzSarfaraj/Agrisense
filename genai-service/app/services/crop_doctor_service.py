from app.prompts.crop_doctor_prompt import build_crop_doctor_prompt
from app.services.genai_service import generate_vision_json


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

    return generate_vision_json(prompt, images, temperature=0.2)