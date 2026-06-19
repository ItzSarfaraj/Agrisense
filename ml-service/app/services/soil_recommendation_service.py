import joblib
import numpy as np
from app.data_loader import get_conditions
from app.services.profit_service import (
    prepare_profit_features,
    predict_profit
)

crop_model = joblib.load(
    "models/crop_model.pkl"
)

crop_encoder = joblib.load(
    "models/label_encoder.pkl"
)

def get_soil_recommendations(state,district,season,N,P,K,pH):
    conditions = get_conditions(
    state,
    district,
    season
    )

    if conditions is None:
        return None
    
    humidity = conditions[4]
    rainfall = conditions[5]
    temperature = conditions[6]

    features = [[N,P,K,pH,humidity,rainfall,temperature]]

    probabilities = crop_model.predict_proba(features)[0]

    top_indices = np.argsort(probabilities)[::-1][:6]

    top_crops = crop_encoder.inverse_transform(top_indices)

    recommendations = []
    for crop in top_crops:
        confidence = round(probabilities[crop_encoder.transform([crop])[0]] * 100,2)

        profit_features = prepare_profit_features(conditions,crop,state)

        profit_data = predict_profit(profit_features)
        

        recommendations.append({
         "crop": crop,
            "confidence": confidence,
            **profit_data
        })

    return recommendations