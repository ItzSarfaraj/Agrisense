import os

from dotenv import load_dotenv
from google import genai
from google.genai import types


load_dotenv()


GOOGLE_CLOUD_PROJECT = os.getenv("GOOGLE_CLOUD_PROJECT")
GOOGLE_CLOUD_LOCATION = os.getenv(
    "GOOGLE_CLOUD_LOCATION",
    "global",
)

GOOGLE_GENAI_MODEL = os.getenv(
    "GOOGLE_GENAI_MODEL",
    "gemini-2.5-flash",
)


if not GOOGLE_CLOUD_PROJECT:
    raise ValueError(
        "GOOGLE_CLOUD_PROJECT is not configured"
    )


client = genai.Client(
    vertexai=True,
    project=GOOGLE_CLOUD_PROJECT,
    location=GOOGLE_CLOUD_LOCATION,
)


GENERATION_CONFIG = types.GenerateContentConfig(
    temperature=0.3,
)