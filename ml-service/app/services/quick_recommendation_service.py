from app.data_loader import crops_df

import joblib

profit_model = joblib.load("models/profit_model.pkl")

crop_encoder = joblib.load("models/crop_encoder.pkl")

state_encoder = joblib.load("models/state_encoder.pkl")

HECTARE_TO_ACRE = 2.471


def get_quick_recommendations(
    state,
    district,
    season
):

    candidate_rows = crops_df[
        (crops_df["state"].str.lower() == state.lower()) &
        (crops_df["district"].str.lower() == district.lower()) &
        (crops_df["season"].str.lower() == season.lower())
    ]

    if candidate_rows.empty:
        return None

    candidate_crops = (
        candidate_rows["crop"]
        .str.lower()
        .unique()
    )

    recommendations = []

    for crop in candidate_crops:

        crop_rows = candidate_rows[
            candidate_rows["crop"].str.lower() == crop
        ]

        N = crop_rows["N"].mean()
        P = crop_rows["P"].mean()
        K = crop_rows["K"].mean()
        pH = crop_rows["pH"].mean()
        humidity = crop_rows["humidity"].mean()
        rainfall = crop_rows["rainfall"].mean()
        temperature = crop_rows["temperature"].mean()

        crop_encoded = crop_encoder.transform(
            [crop]
        )[0]

        state_encoded = state_encoder.transform(
            [state.title()]
        )[0]

        features = [[
            N,
            P,
            K,
            pH,
            humidity,
            rainfall,
            temperature,
            crop_encoded,
            state_encoded
        ]]

        # ML predicted profit
        expected_profit = profit_model.predict(
            features
        )[0]

        # Historical risk range (P10-P90)
        min_profit = max(
            0,
            crop_rows["profit"].quantile(0.10)
        )

        max_profit = crop_rows["profit"].quantile(0.90)

        expected_profit_acre = (
            expected_profit / HECTARE_TO_ACRE
        )

        min_profit_acre = (
            min_profit / HECTARE_TO_ACRE
        )

        max_profit_acre = (
            max_profit / HECTARE_TO_ACRE
        )

        recommendations.append({
            "crop": crop,

            "expected_profit": round(
                expected_profit
            ),

            "profit_per_hectare": {
                "expected": round(
                    expected_profit
                ),
                "min": round(
                    min_profit
                ),
                "max": round(
                    max_profit
                )
            },

            "profit_per_acre": {
                "expected": round(
                    expected_profit_acre
                ),
                "min": round(
                    min_profit_acre
                ),
                "max": round(
                    max_profit_acre
                )
            }
        })

    recommendations.sort(
        key=lambda x: x["expected_profit"],
        reverse=True
    )

    return recommendations