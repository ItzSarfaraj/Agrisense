import json

from app.prompts.crop_doctor_translation_prompt import (
    build_crop_doctor_translation_prompt,
)
from app.services.genai_service import generate_json


def translate_crop_doctor_analysis(
    analysis: dict,
    language: str,
    language_code: str,
) -> dict:
    if not analysis:
        raise ValueError("Crop Doctor analysis is required")

    prompt = build_crop_doctor_translation_prompt(
        analysis=json.dumps(
            analysis,
            ensure_ascii=False,
            indent=2,
        ),
        language=language,
        language_code=language_code,
    )

    return generate_json(prompt, temperature=0.1)