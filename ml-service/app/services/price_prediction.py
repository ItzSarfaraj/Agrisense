from pathlib import Path
import joblib
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent.parent.parent
MODELS_DIR = BASE_DIR / "models"
DATA_DIR = BASE_DIR / "data" / "processed"

price_model = joblib.load( ## load the model
     MODELS_DIR / "price_model_v2.pkl"
)

preprocessor = joblib.load(## load OneHotEncoder + ColumnTransformer
     MODELS_DIR / "price_preprocessor_v2.pkl"
)

historical_df = pd.read_csv( ## load the dataset so that the user dont have to enter lag_1 lag_3 lag_6 rolling_3 and rolling_6
    DATA_DIR / "market_price_features_v2.csv"
)

historical_df["year_month"] = pd.to_datetime( ## when csv loads date become string so convert ot datetime
    historical_df["year_month"]
)

def get_latest_features(crop,state,district):
    """
    if user enters Rice, Up, Gkp -> this filters all Rice gkp records
    then takes newest available row then return lag_1 lag_2 ...
    """
    df = historical_df[
     (historical_df["crop"] == crop)
     &
     (historical_df["State"] == state)
     &
     (historical_df["District"] == district)
    ]


    if df.empty: ## if no data exist
     raise ValueError(
        f"No historical data found for {crop} in {district}"
    )
    
    df = df.sort_values("year_month")

    latest = df.iloc[-1]

    return {
    "lag_1": latest["lag_1"],
    "lag_3": latest["lag_3"],
    "lag_6": latest["lag_6"],
    "rolling_3": latest["rolling_3"],
    "rolling_6": latest["rolling_6"],
    }

def predict_price(crop,state,district,month): ## create model input and transform it
    history = get_latest_features(crop,state,district)

    input_df = pd.DataFrame([
      {
        "crop": crop,
        "State": state,
        "District": district,
        "month": month,

        "lag_1": history["lag_1"],
        "lag_3": history["lag_3"],
        "lag_6": history["lag_6"],
        "rolling_3": history["rolling_3"],
        "rolling_6": history["rolling_6"],
      }
    ])

    input_processed = preprocessor.transform(input_df)

    prediction = float(
    price_model.predict(input_processed)[0]
    )

    return round(prediction, 2)

print(
    predict_price(
        "Rice",
        "Uttar Pradesh",
        "Gorakhpur",
        11
    )
)


    
