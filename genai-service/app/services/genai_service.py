import json

from app.config import client, GOOGLE_GENAI_MODEL, GENERATION_CONFIG


def generate_text(prompt: str) -> str:
    response = client.models.generate_content(
        model=GOOGLE_GENAI_MODEL,
        contents=prompt,
        config=GENERATION_CONFIG,
    )

    if not response.text:
        raise ValueError("Empty response received from Vertex AI")

    return response.text


def generate_json(prompt: str) -> dict:
    response = client.models.generate_content(
        model=GOOGLE_GENAI_MODEL,
        contents=prompt,
        config={
            "temperature": 0.3,
            "response_mime_type": "application/json",
        },
    )

    if not response.text:
        raise ValueError("Empty response received from Vertex AI")

    try:
        return json.loads(response.text)
    except json.JSONDecodeError as error:
        raise ValueError(
            "Vertex AI returned invalid JSON"
        ) from error