from app.prompts.chatbot_prompt import build_chat_prompt
from app.services.genai_service import generate_text


def generate_chat_response(data: dict) -> str:
    history = data.get("history", [])
    message = data.get("message", "").strip()
    context = data.get("context") or {}

    language = (data.get("language") or "Auto").strip()
    language_code = (data.get("languageCode") or "en-IN").strip()

    if not message:
        raise ValueError("Message cannot be empty")

    prompt = build_chat_prompt(
        message=message,
        history=history,
        context=context,
        language=language,
        language_code=language_code,
    )

    return generate_text(prompt)