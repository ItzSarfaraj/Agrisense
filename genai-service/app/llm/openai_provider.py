import base64

from app import config
from app.llm.base import LLMProvider


class OpenAICompatProvider(LLMProvider):
    """
    Any provider that offers the OpenAI chat-completions API:
    OpenAI itself, Groq, OpenRouter, Together, Mistral and more.

    Newer OpenAI models (the gpt-5 family) are reasoning models. They reject a
    custom temperature, and some reject reasoning_effort values. This provider
    drops the rejected setting, retries, and remembers it for the rest of the run.
    """

    name = "openai"

    def __init__(self) -> None:
        from openai import BadRequestError, OpenAI

        if not config.OPENAI_API_KEY:
            raise ValueError(
                "OPENAI_API_KEY is not configured for LLM_PROVIDER=openai"
            )

        self._bad_request_error = BadRequestError
        self._send_temperature = config.OPENAI_SEND_TEMPERATURE
        self._send_reasoning = bool(config.OPENAI_REASONING_EFFORT)

        self.client = OpenAI(
            base_url=config.OPENAI_BASE_URL,
            api_key=config.OPENAI_API_KEY,
            timeout=config.LLM_TIMEOUT,
        )

    def _content(self, prompt, images):
        if not images:
            return prompt

        content = [{"type": "text", "text": prompt}]

        for image in images:
            encoded = base64.b64encode(image["data"]).decode("ascii")
            content.append(
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:{image['mime_type']};base64,{encoded}"
                    },
                }
            )

        return content

    def chat(self, prompt, *, temperature, json_mode=False, images=None, max_tokens=None):
        kwargs = {
            "model": config.LLM_VISION_MODEL if images else config.LLM_MODEL,
            "messages": [
                {"role": "user", "content": self._content(prompt, images)}
            ],
        }

        if self._send_reasoning:
            kwargs["reasoning_effort"] = config.OPENAI_REASONING_EFFORT

        if json_mode and config.OPENAI_JSON_MODE:
            kwargs["response_format"] = {"type": "json_object"}

        if self._send_temperature:
            kwargs["temperature"] = temperature

        # Some models reject temperature or reasoning_effort. Drop the setting
        # the error complains about, remember it, and try again.
        for _ in range(3):
            try:
                response = self.client.chat.completions.create(**kwargs)
                break

            except self._bad_request_error as error:
                message = str(error).lower()
                removed = False

                for param in ("temperature", "reasoning_effort"):
                    if param in kwargs and param in message:
                        kwargs.pop(param)

                        if param == "temperature":
                            self._send_temperature = False
                        else:
                            self._send_reasoning = False

                        removed = True
                        break

                if not removed:
                    raise
        else:
            raise RuntimeError("The model rejected the request repeatedly")

        text = response.choices[0].message.content or ""

        if not text.strip():
            raise ValueError("Empty response received from the model")

        return text