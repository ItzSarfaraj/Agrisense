FROM python:3.13-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt requirements-gemini.txt ./

RUN pip install --no-cache-dir -r requirements.txt

# Google libraries are only needed for LLM_PROVIDER=gemini.
# Build with:  docker build --build-arg INSTALL_GEMINI=true ...
ARG INSTALL_GEMINI=false
RUN if [ "$INSTALL_GEMINI" = "true" ]; then \
      pip install --no-cache-dir -r requirements-gemini.txt; \
    fi

COPY app ./app

# google-aws-credentials.json* matches zero or one file, so the build also
# works when the file does not exist (Ollama / OpenAI-compatible setups).
COPY entrypoint.py google-aws-credentials.json* ./

EXPOSE 8000

CMD ["python", "entrypoint.py"]