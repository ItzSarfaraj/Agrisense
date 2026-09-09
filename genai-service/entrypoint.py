import json
import os
import subprocess
import sys
import threading
import time
import urllib.request
from datetime import datetime, timezone


REFRESH_INTERVAL_SECONDS = 300


def fetch_ecs_credentials():
    relative_uri = os.getenv("AWS_CONTAINER_CREDENTIALS_RELATIVE_URI")

    if not relative_uri:
        raise RuntimeError(
            "AWS_CONTAINER_CREDENTIALS_RELATIVE_URI not found."
        )

    endpoint = f"http://169.254.170.2{relative_uri}"

    with urllib.request.urlopen(endpoint, timeout=5) as response:
        return json.loads(response.read().decode())


def apply_ecs_credentials(credentials):
    os.environ["AWS_ACCESS_KEY_ID"] = credentials["AccessKeyId"]
    os.environ["AWS_SECRET_ACCESS_KEY"] = credentials["SecretAccessKey"]
    os.environ["AWS_SESSION_TOKEN"] = credentials["Token"]

    if not os.getenv("AWS_REGION"):
        os.environ["AWS_REGION"] = os.getenv(
            "AWS_DEFAULT_REGION",
            "ap-south-1",
        )


def load_ecs_credentials():
    credentials = fetch_ecs_credentials()
    apply_ecs_credentials(credentials)

    expiration = credentials.get("Expiration", "unknown")

    print(
        f"ECS task credentials loaded. "
        f"Expiration: {expiration}"
    )


def refresh_ecs_credentials():
    while True:
        time.sleep(REFRESH_INTERVAL_SECONDS)

        try:
            credentials = fetch_ecs_credentials()
            apply_ecs_credentials(credentials)

            expiration = credentials.get("Expiration", "unknown")

            print(
                f"ECS task credentials refreshed. "
                f"Expiration: {expiration}"
            )

        except Exception as exc:
            print(
                f"Failed to refresh ECS task credentials: {exc}",
                flush=True,
            )


def start_credential_refresh():
    thread = threading.Thread(
        target=refresh_ecs_credentials,
        daemon=True,
    )

    thread.start()


if __name__ == "__main__":
    try:
        load_ecs_credentials()
        start_credential_refresh()

    except Exception as exc:
        print(
            f"Failed to load ECS task credentials: {exc}",
            flush=True,
        )
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