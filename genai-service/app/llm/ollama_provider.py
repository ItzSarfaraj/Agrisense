import base64

import httpx

from app import config
from app.llm.base import LLMProvider


class OllamaProvider(LLMProvider):
    """
    Talks to Ollama's native /api/chat endpoint.

    The native API is used (not the OpenAI-compatible one) because it lets us
    set the context size, keep the model loaded, ask reasoning models not to
    think, and request JSON mode in the same call.
    """

    name = "ollama"

    def __init__(self) -> None:
        self.base_url = config.OLLAMA_BASE_URL
        self.client = httpx.Client(
            timeout=httpx.Timeout(
                config.LLM_TIMEOUT,
                connect=10.0,
            )
        )

    def _payload(self, prompt, temperature, json_mode, images, with_think, max_tokens=None):
        message = {"role": "user", "content": prompt}

        if images:
            message["images"] = [
                base64.b64encode(image["data"]).decode("ascii")
                for image in images
            ]

        payload = {
            "model": (
                config.LLM_VISION_MODEL if images else config.LLM_MODEL
            ),
            "messages": [message],
            "stream": False,
            "keep_alive": config.OLLAMA_KEEP_ALIVE,
            "options": {
                "temperature": temperature,
                "num_ctx": config.OLLAMA_NUM_CTX,
            },
        }

        if max_tokens:
            payload["options"]["num_predict"] = max_tokens

        if config.OLLAMA_NUM_THREAD:
            payload["options"]["num_thread"] = config.OLLAMA_NUM_THREAD

        if json_mode:
            payload["format"] = "json"

        if with_think and config.OLLAMA_THINK in {"false", "0", "off", "no"}:
            payload["think"] = False

        return payload

    def chat(self, prompt, *, temperature, json_mode=False, images=None, max_tokens=None):
        url = f"{self.base_url}/api/chat"

        try:
            response = self.client.post(
                url,
                json=self._payload(
                    prompt, temperature, json_mode, images, True, max_tokens
                ),
            )

            # Some models reject the "think" field. Retry once without it.
            if response.status_code == 400 and "think" in response.text.lower():
                response = self.client.post(
                    url,
                    json=self._payload(
                        prompt, temperature, json_mode, images, False, max_tokens
                    ),
                )

            response.raise_for_status()

        except httpx.ConnectError as error:
            raise RuntimeError(
                f"Cannot reach Ollama at {self.base_url}. "
                "Is Ollama running and OLLAMA_BASE_URL correct?"
            ) from error

        except httpx.HTTPStatusError as error:
            raise RuntimeError(
                f"Ollama returned HTTP {error.response.status_code}: "
                f"{error.response.text[:300]}"
            ) from error

        text = (response.json().get("message") or {}).get("content") or ""

        if not text.strip():
            raise ValueError("Empty response received from Ollama")

        return text