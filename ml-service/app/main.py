from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import joblib
from fastapi.middleware.cors import CORSMiddleware
from app.services.price_prediction import historical_df


model = joblib.load("models/crop_model.pkl")
encoder = joblib.load("models/label_encoder.pkl")

from app.services.quick_recommendation_service import get_quick_recommendations
from app.services.soil_recommendation_service import (get_soil_recommendations)

from app.schemas import (
    CropInput,
    RecommendationInput,
    SoilRecommendationInput,
    PricePredictionInput
)

from app.services.price_prediction import predict_price

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", ## integrating with frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
 

@app.get("/")
def root():
    return {
        "message": "AgriSense ML API Running"
    }


@app.post("/predict")
def predict(data: CropInput):

    features = [[
        data.N,
        data.P,
        data.K,
        data.pH,
        data.humidity,
        data.rainfall,
        data.temperature
    ]]

    prediction = model.predict(features)

    crop = encoder.inverse_transform(prediction)

    return {
        "recommended_crop": crop[0]
    }


@app.post("/recommend/quick")
def quick_recommend(data: RecommendationInput):

    recommendations = get_quick_recommendations(
        data.state,
        data.district,
        data.season
    )

    if recommendations is None:
        return {
            "error": "No data found"
        }

    return {
        "recommendations": recommendations
    }

@app.post("/recommend/soil")
def soil_recommend(
    data: SoilRecommendationInput
):

    recommendations = get_soil_recommendations(
        data.state,
        data.district,
        data.season,
        data.N,
        data.P,
        data.K,
        data.pH
    )

    if recommendations is None:
        return {
            "error": "No data found"
        }

    return {
        "recommendations": recommendations
    }

@app.post("/price/predict")
def market_price_predict(
    data: PricePredictionInput
):

    try:

        price = predict_price(
            data.crop,
            data.state,
            data.district,
            data.month
        )

        return {
            "predicted_price": price
        }

    except Exception as e:

        return {
            "error": str(e)
        }
    

@app.get("/price/crops")
def get_price_crops():

    crops = sorted(
        historical_df["crop"]
        .dropna()
        .unique()
        .tolist()
    )

    return {
        "crops": crops
    }

@app.get("/price/states/{crop}")
def get_states(crop: str):

    states = sorted(
        historical_df[
            historical_df["crop"] == crop
        ]["State"]
        .dropna()
        .unique()
        .tolist()
    )

    return {
        "states": states
    }

@app.get(
    "/price/districts/{crop}/{state}"
)
def get_districts(
    crop: str,
    state: str
):

    districts = sorted(
        historical_df[
            (historical_df["crop"] == crop)
            &
            (historical_df["State"] == state)
        ]["District"]
        .dropna()
        .unique()
        .tolist()
    )

    return {
        "districts": districts
    }