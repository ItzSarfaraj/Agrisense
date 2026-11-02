"""
Gemini on Google Vertex AI (the original AgriSense setup).

Google libraries are imported only when this provider is selected, so the
service runs without them when LLM_PROVIDER is ollama or openai.
Install them with:  pip install -r requirements-gemini.txt
"""

import json
import os
import urllib.request

from app import config
from app.llm.base import LLMProvider


def _build_credentials():
    """
    AWS ECS: ECS task role -> AWS Workload Identity Federation -> Google.
    Local:   Google Application Default Credentials.
    """
    import google.auth
    from google.auth import aws

    scopes = ["https://www.googleapis.com/auth/cloud-platform"]

    class ECSCredentialsSupplier(aws.AwsSecurityCredentialsSupplier):
        """Fetch fresh task credentials from the ECS metadata endpoint."""

        def get_aws_security_credentials(self, context, request):
            relative_uri = os.environ.get(
                "AWS_CONTAINER_CREDENTIALS_RELATIVE_URI"
            )

            if not relative_uri:
                raise RuntimeError(
                    "AWS_CONTAINER_CREDENTIALS_RELATIVE_URI not set."
                )

            endpoint = f"http://169.254.170.2{relative_uri}"

            with urllib.request.urlopen(endpoint, timeout=5) as response:
                creds = json.loads(response.read().decode())

            return aws.AwsSecurityCredentials(
                creds["AccessKeyId"],
                creds["SecretAccessKey"],
                creds["Token"],
            )

        def get_aws_region(self, context, request):
            return os.environ.get(
                "AWS_REGION",
                os.environ.get("AWS_DEFAULT_REGION", "ap-south-1"),
            )

    if os.getenv("AWS_CONTAINER_CREDENTIALS_RELATIVE_URI"):
        with open(config.GOOGLE_APPLICATION_CREDENTIALS) as f:
            info = json.load(f)

        return aws.Credentials(
            audience=info["audience"],
            subject_token_type=info["subject_token_type"],
            token_url=info["token_url"],
            service_account_impersonation_url=info.get(
                "service_account_impersonation_url"
            ),
            aws_security_credentials_supplier=ECSCredentialsSupplier(),
            scopes=scopes,
        )

    credentials, _ = google.auth.default(scopes=scopes)
    return credentials


class GeminiProvider(LLMProvider):
    name = "gemini"

    def __init__(self) -> None:
        from google import genai

        if not config.GOOGLE_CLOUD_PROJECT:
            raise ValueError("GOOGLE_CLOUD_PROJECT is not configured")

        self.client = genai.Client(
            vertexai=True,
            project=config.GOOGLE_CLOUD_PROJECT,
            location=config.GOOGLE_CLOUD_LOCATION,
            credentials=_build_credentials(),
        )

    def chat(self, prompt, *, temperature, json_mode=False, images=None, max_tokens=None):
        from google.genai import types

        contents = [prompt]

        for image in images or []:
            contents.append(
                types.Part.from_bytes(
                    data=image["data"],
                    mime_type=image["mime_type"],
                )
            )

        generation = {"temperature": temperature}

        if json_mode:
            generation["response_mime_type"] = "application/json"

        response = self.client.models.generate_content(
            model=config.GOOGLE_GENAI_MODEL,
            contents=contents if images else prompt,
            config=generation,
        )

        if not response.text:
            raise ValueError("Empty response received from Vertex AI")

        return response.text