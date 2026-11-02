from abc import ABC, abstractmethod
from functools import lru_cache

from app import config


class LLMProvider(ABC):
    """
    Every provider only has to implement chat().

    images is a list of dicts: {"data": bytes, "mime_type": "image/jpeg"}.
    The caller has already resized and limited them.
    """

    name = "base"

    @abstractmethod
    def chat(
        self,
        prompt: str,
        *,
        temperature: float,
        json_mode: bool = False,
        images: list[dict] | None = None,
        max_tokens: int | None = None,
    ) -> str:
        """Return the raw text answer of the model."""


@lru_cache(maxsize=1)
def get_provider() -> LLMProvider:
    provider = config.LLM_PROVIDER

    if provider == "ollama":
        from app.llm.ollama_provider import OllamaProvider

        return OllamaProvider()

    if provider in {"openai", "openai_compatible", "openai-compatible"}:
        from app.llm.openai_provider import OpenAICompatProvider

        return OpenAICompatProvider()

    if provider in {"gemini", "vertex", "vertexai"}:
        from app.llm.gemini_provider import GeminiProvider

        return GeminiProvider()

    raise ValueError(
        f"Unknown LLM_PROVIDER '{provider}'. "
        "Use ollama, openai or gemini."
    )