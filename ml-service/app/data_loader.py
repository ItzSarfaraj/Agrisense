import pandas as pd
import difflib
import re

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

_known_districts = {}
for _s, _d in crops_df[["state", "district"]].drop_duplicates().itertuples(index=False):
    _known_districts.setdefault(str(_s).strip().lower(), set()).add(str(_d).strip().lower())


def _clean_state(state):
    return re.sub(r"\s*\((ut|nct)\)\s*$", "", str(state).strip().lower())


def _clean_district(district):
    text = re.sub(r"\(.*?\)", "", str(district).lower())
    text = re.sub(r"[^a-z0-9 ]", "", text)
    return " ".join(text.split())


def resolve_location(state, district):
    state_key = _clean_state(state)
    district_key = str(district).strip().lower()
    candidates = _known_districts.get(state_key)
    if not candidates:
        return state_key, district_key
    if district_key in candidates:
        return state_key, district_key
    by_clean = {_clean_district(n): n for n in candidates}
    match = difflib.get_close_matches(_clean_district(district), list(by_clean), n=1, cutoff=0.82)
    return state_key, (by_clean[match[0]] if match else district_key)

