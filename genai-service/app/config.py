import json
import os
import urllib.request

from dotenv import load_dotenv
from google import genai
from google.genai import types
from google.auth import aws
import google.auth


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

GOOGLE_APPLICATION_CREDENTIALS = os.getenv(
    "GOOGLE_APPLICATION_CREDENTIALS",
    "/app/google-aws-credentials.json",
)


if not GOOGLE_CLOUD_PROJECT:
    raise ValueError(
        "GOOGLE_CLOUD_PROJECT is not configured"
    )


class ECSCredentialsSupplier(aws.AwsSecurityCredentialsSupplier):
    """
    Fetch fresh AWS credentials directly from the ECS task
    metadata endpoint whenever Google authentication needs them.

    This prevents stale ECS task credentials from being reused
    during Google Workload Identity Federation.
    """

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
            creds = json.loads(
                response.read().decode()
            )

        return aws.AwsSecurityCredentials(
            creds["AccessKeyId"],
            creds["SecretAccessKey"],
            creds["Token"],
        )

    def get_aws_region(self, context, request):
        return os.environ.get(
            "AWS_REGION",
            os.environ.get(
                "AWS_DEFAULT_REGION",
                "ap-south-1",
            ),
        )


def _build_credentials():
    """
    Build credentials differently depending on where the
    GenAI service is running.

    AWS ECS:
        ECS task role → AWS WIF → Google Vertex AI

    Local Docker:
        Local Google ADC → Google Vertex AI
    """

    # ---------------------------------------------------------
    # AWS ECS / Fargate
    # ---------------------------------------------------------
    if os.getenv("AWS_CONTAINER_CREDENTIALS_RELATIVE_URI"):

        with open(GOOGLE_APPLICATION_CREDENTIALS) as f:
            info = json.load(f)

        return aws.Credentials(
            audience=info["audience"],
            subject_token_type=info["subject_token_type"],
            token_url=info["token_url"],
            service_account_impersonation_url=info.get(
                "service_account_impersonation_url"
            ),
            aws_security_credentials_supplier=(
                ECSCredentialsSupplier()
            ),
            scopes=[
                "https://www.googleapis.com/auth/cloud-platform"
            ],
        )

    # ---------------------------------------------------------
    # Local development / Docker
    # ---------------------------------------------------------
    credentials, project = google.auth.default(
        scopes=[
            "https://www.googleapis.com/auth/cloud-platform"
        ]
    )

    return credentials


credentials = _build_credentials()


client = genai.Client(
    vertexai=True,
    project=GOOGLE_CLOUD_PROJECT,
    location=GOOGLE_CLOUD_LOCATION,
    credentials=credentials,
)


GENERATION_CONFIG = types.GenerateContentConfig(
    temperature=0.3,
)