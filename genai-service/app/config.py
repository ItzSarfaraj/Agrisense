import json
import os
import urllib.request

from dotenv import load_dotenv
from google import genai
from google.genai import types
from google.auth import aws


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
    Fetches AWS credentials directly from the ECS task metadata
    endpoint (169.254.170.2) at the exact moment Google's auth
    library needs to sign a request.

    This replaces the old approach of polling ECS every 5 minutes
    in a background thread and stuffing the result into
    os.environ. That approach had a race condition: AWS can
    rotate/invalidate the task role's session token on its own
    schedule, independent of the 5-minute timer, so a request could
    occasionally be signed with a token that AWS had already
    invalidated moments earlier ("ExpiredToken" errors).

    Fetching on demand, every time, eliminates that window
    entirely — there is no stale copy to accidentally use.
    """

    def get_aws_security_credentials(self, context, request):
        relative_uri = os.environ.get(
            "AWS_CONTAINER_CREDENTIALS_RELATIVE_URI"
        )

        if not relative_uri:
            raise RuntimeError(
                "AWS_CONTAINER_CREDENTIALS_RELATIVE_URI not set. "
                "This supplier only works inside an ECS task."
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


def _build_credentials():
    with open(GOOGLE_APPLICATION_CREDENTIALS) as f:
        info = json.load(f)

    return aws.Credentials(
        audience=info["audience"],
        subject_token_type=info["subject_token_type"],
        token_url=info["token_url"],
        service_account_impersonation_url=info.get(
            "service_account_impersonation_url"
        ),
        aws_security_credentials_supplier=ECSCredentialsSupplier(),
    )


client = genai.Client(
    vertexai=True,
    project=GOOGLE_CLOUD_PROJECT,
    location=GOOGLE_CLOUD_LOCATION,
    credentials=_build_credentials(),
)


GENERATION_CONFIG = types.GenerateContentConfig(
    temperature=0.3,
)