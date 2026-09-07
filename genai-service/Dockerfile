FROM python:3.13-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY google-aws-credentials.json ./google-aws-credentials.json
COPY entrypoint.py ./entrypoint.py

EXPOSE 8000

CMD ["python", "entrypoint.py"]