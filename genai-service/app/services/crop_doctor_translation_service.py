import json

from google.genai import types

from app.config import (
    client,
    GOOGLE_GENAI_MODEL,
)
from app.prompts.crop_doctor_translation_prompt import (
    build_crop_doctor_translation_prompt,
)


def _parse_response(text: str) -> dict:
    cleaned = text.strip()

    if cleaned.startswith("```"):
        cleaned = (
            cleaned.removeprefix("```json")
            .removeprefix("```")
        )
        cleaned = cleaned.removesuffix("```").strip()

    try:
        return json.loads(cleaned)

    except json.JSONDecodeError as error:
        raise ValueError(
            "Gemini returned invalid Crop Doctor translation JSON"
        ) from error


def translate_crop_doctor_analysis(
    analysis: dict,
    language: str,
    language_code: str,
) -> dict:
    if not analysis:
        raise ValueError(
            "Crop Doctor analysis is required"
        )

    prompt = build_crop_doctor_translation_prompt(
        analysis=json.dumps(
            analysis,
            ensure_ascii=False,
            indent=2,
        ),
        language=language,
        language_code=language_code,
    )

    response = client.models.generate_content(
        model=GOOGLE_GENAI_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            temperature=0.1,
            response_mime_type="application/json",
        ),
    )

    if not response.text:
        raise ValueError(
            "Empty response received from Vertex AI"
        )

    return _parse_response(response.text)