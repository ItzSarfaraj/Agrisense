import json
import os
import subprocess
import sys
import urllib.request


def load_ecs_credentials():
    relative_uri = os.getenv("AWS_CONTAINER_CREDENTIALS_RELATIVE_URI")

    if not relative_uri:
        print("AWS_CONTAINER_CREDENTIALS_RELATIVE_URI not found.")
        print("Starting application without ECS credential bridge.")
        return

    endpoint = f"http://169.254.170.2{relative_uri}"

    with urllib.request.urlopen(endpoint, timeout=5) as response:
        credentials = json.loads(response.read().decode())

    os.environ["AWS_ACCESS_KEY_ID"] = credentials["AccessKeyId"]
    os.environ["AWS_SECRET_ACCESS_KEY"] = credentials["SecretAccessKey"]
    os.environ["AWS_SESSION_TOKEN"] = credentials["Token"]

    if not os.getenv("AWS_REGION"):
        os.environ["AWS_REGION"] = os.getenv(
            "AWS_DEFAULT_REGION",
            "ap-south-1"
        )

    print("ECS task credentials loaded for Google WIF.")


if __name__ == "__main__":
    try:
        load_ecs_credentials()
    except Exception as exc:
        print(f"Failed to load ECS task credentials: {exc}")
        sys.exit(1)

    subprocess.run(
        [
            "uvicorn",
            "app.main:app",
            "--host",
            "0.0.0.0",
            "--port",
            "8000",
        ],
        check=True,
    )