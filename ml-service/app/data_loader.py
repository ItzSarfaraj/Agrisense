import pandas as pd

lookup_df = pd.read_csv("data/district_season_lookup.csv")

profit_df = pd.read_csv("data/crop_profit_reference.csv")

crops_df = pd.read_csv("data/india_crops_complete.csv")


def get_conditions(
    state,
    district,
    season
):

    row = lookup_df[
        (lookup_df["state"].str.lower() == state.lower()) &
        (lookup_df["district"].str.lower() == district.lower()) &
        (lookup_df["season"].str.lower() == season.lower())
    ]

    if row.empty:
        return None

    row = row.iloc[0]

    return [
        row["N"],
        row["P"],
        row["K"],
        row["pH"],
        row["humidity"],
        row["rainfall"],
        row["temperature"]
    ]

