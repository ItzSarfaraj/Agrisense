FROM python:3.13-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY models ./models

COPY data/district_season_lookup.csv ./data/district_season_lookup.csv
COPY data/crop_profit_reference.csv ./data/crop_profit_reference.csv
COPY data/india_crops_complete.csv ./data/india_crops_complete.csv
COPY data/processed/market_price_features_v2.csv ./data/processed/market_price_features_v2.csv

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]