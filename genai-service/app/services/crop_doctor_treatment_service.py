from app.prompts.crop_doctor_treatment_prompt import (
    build_crop_doctor_treatment_prompt,
)
from app.services.genai_service import generate_json


def generate_crop_doctor_treatment_report(
    analysis: dict,
    crop: str | None,
    symptoms: str,
    language: str,
    language_code: str,
) -> dict:
    if not analysis:
        raise ValueError("Crop Doctor analysis is required")

    prompt = build_crop_doctor_treatment_prompt(
        analysis=analysis,
        crop=crop,
        symptoms=symptoms,
        language=language,
        language_code=language_code,
    )

    return generate_json(prompt, temperature=0.2)