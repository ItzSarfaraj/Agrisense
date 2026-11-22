"""
Central settings for the GenAI service.

AgriSense can talk to different language-model back ends. Pick one with
LLM_PROVIDER:

  ollama   (default) a model running locally through Ollama
  openai   any OpenAI-compatible API (Groq, OpenRouter, Together, Mistral,
           OpenAI, a LiteLLM proxy, ...)
  gemini   Google Gemini on Vertex AI (the original setup)

Only plain environment variables are read here. No heavy libraries are
imported, so the service starts even when a provider's SDK is not installed.
"""

import os

from dotenv import load_dotenv


load_dotenv()


def _int(name: str, default: int) -> int:
    try:
        return int(os.getenv(name, default))
    except (TypeError, ValueError):
        return default


def _float(name: str, default: float) -> float:
    try:
        return float(os.getenv(name, default))
    except (TypeError, ValueError):
        return default


def _bool(name: str, default: bool) -> bool:
    value = os.getenv(name)

    if value is None:
        return default

    return value.strip().lower() in {"1", "true", "yes", "on"}


LLM_PROVIDER = os.getenv("LLM_PROVIDER", "ollama").strip().lower()

# Model names. LLM_VISION_MODEL falls back to LLM_MODEL, which is right when
# one multimodal model (for example gemma4:e4b) does both text and images.
_DEFAULT_MODELS = {
    "ollama": "agrisense-llm",
    "openai": "gpt-4o-mini",
    "openai_compatible": "gpt-4o-mini",
    "openai-compatible": "gpt-4o-mini",
}
LLM_MODEL = os.getenv("LLM_MODEL") or _DEFAULT_MODELS.get(LLM_PROVIDER, "agrisense-llm")
LLM_VISION_MODEL = os.getenv("LLM_VISION_MODEL") or LLM_MODEL

# Seconds to wait for one model call. Local CPU models can be slow.
LLM_TIMEOUT = _float("LLM_TIMEOUT", 900.0 if LLM_PROVIDER == "ollama" else 120.0)

# Photos are shrunk before they reach the model. Phone photos are huge and a
# CPU-only machine would spend minutes encoding them. 0 disables resizing.
LLM_IMAGE_MAX_SIDE = _int("LLM_IMAGE_MAX_SIDE", 896)

# 0 means "send every uploaded image". On a slow machine set 2 or 3.
LLM_MAX_IMAGES = _int("LLM_MAX_IMAGES", 0)

# Extra retries when a JSON answer cannot be parsed.
LLM_JSON_RETRIES = _int("LLM_JSON_RETRIES", 1)

# ---- Chat prompt size (speed) --------------------------------------------
# "full" sends the long 3,000-token system prompt (best for Gemini/OpenAI).
# "lite" sends a compact prompt (about 400 tokens) so that a CPU-only machine
# answers in seconds instead of minutes. Default: lite for Ollama, full otherwise.
LLM_PROMPT_MODE = os.getenv(
    "LLM_PROMPT_MODE",
    "lite" if LLM_PROVIDER == "ollama" else "full",
).strip().lower()

# How many earlier chat messages go into the prompt (the full mode uses 10).
LLM_HISTORY_MESSAGES = _int("LLM_HISTORY_MESSAGES", 4 if LLM_PROMPT_MODE == "lite" else 10)

# Hard limit on the length of a chat answer in tokens. 0 = no limit.
# Only Ollama uses it. Try 300-500 on a slow machine.
LLM_CHAT_MAX_TOKENS = _int("LLM_CHAT_MAX_TOKENS", 0)

# ---- Ollama ---------------------------------------------------------------
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434").rstrip("/")
OLLAMA_NUM_CTX = _int("OLLAMA_NUM_CTX", 8192)
OLLAMA_KEEP_ALIVE = os.getenv("OLLAMA_KEEP_ALIVE", "30m")

# CPU threads. 0 = let Ollama decide. On an Intel laptop with performance and
# efficiency cores, try the number of performance cores (for an i7-13700H: 6).
OLLAMA_NUM_THREAD = _int("OLLAMA_NUM_THREAD", 0)

# Reasoning ("thinking") models spend many tokens thinking first, which is very
# slow on a CPU. false = ask Ollama not to think. unset/auto = do not send.
OLLAMA_THINK = os.getenv("OLLAMA_THINK", "false").strip().lower()

# ---- OpenAI-compatible hosted APIs ---------------------------------------
OPENAI_BASE_URL = (os.getenv("OPENAI_BASE_URL") or "https://api.openai.com/v1").rstrip("/")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
# Some providers do not support response_format=json_object. Set false for them.
OPENAI_JSON_MODE = _bool("OPENAI_JSON_MODE", True)
# Newer OpenAI reasoning models (gpt-5 family) only accept the default
# temperature. The provider retries without it automatically, but you can also
# switch it off up front.
OPENAI_SEND_TEMPERATURE = _bool("OPENAI_SEND_TEMPERATURE", True)
# Optional. For gpt-5 models "minimal" makes answers faster and cheaper
# (fewer hidden reasoning tokens). Leave empty if your model rejects it.
OPENAI_REASONING_EFFORT = os.getenv("OPENAI_REASONING_EFFORT", "").strip()

# ---- Gemini on Vertex AI (optional) --------------------------------------
GOOGLE_CLOUD_PROJECT = os.getenv("GOOGLE_CLOUD_PROJECT")
GOOGLE_CLOUD_LOCATION = os.getenv("GOOGLE_CLOUD_LOCATION", "global")
GOOGLE_GENAI_MODEL = os.getenv("GOOGLE_GENAI_MODEL", "gemini-2.5-flash")
GOOGLE_APPLICATION_CREDENTIALS = os.getenv(
    "GOOGLE_APPLICATION_CREDENTIALS",
    "/app/google-aws-credentials.json",
)