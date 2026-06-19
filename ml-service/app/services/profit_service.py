import joblib

profit_model = joblib.load("models/profit_model.pkl")

crop_encoder = joblib.load("models/crop_encoder.pkl")

state_encoder = joblib.load("models/state_encoder.pkl")

MAE = 26943

def prepare_profit_features(
    conditions,
    crop,
    state
):

    crop_encoded = crop_encoder.transform([crop])[0]

    state_encoded = state_encoder.transform([state.title()])[0]

    return [
        conditions[0],  # N
        conditions[1],  # P
        conditions[2],  # K
        conditions[3],  # pH
        conditions[4],  # humidity
        conditions[5],  # rainfall
        conditions[6],  # temperature
        crop_encoded,
        state_encoded
    ]

HECTARE_TO_ACRE = 2.471

def predict_profit(features):

    predicted_profit = profit_model.predict([features])[0]

    min_profit = max(
        0,
        round(predicted_profit - MAE)
    )

    max_profit = round(
        predicted_profit + MAE
    )

    return {

        "expected_profit": round(predicted_profit),

        "profit_per_hectare": {
            "expected": round(predicted_profit),
            "min": min_profit,
            "max": max_profit
        },

        "profit_per_acre": {
            "expected": round(predicted_profit / HECTARE_TO_ACRE),
            "min": round(min_profit / HECTARE_TO_ACRE),
            "max": round(max_profit / HECTARE_TO_ACRE)
        }
    }