from app.services.genai_service import generate_json


def generate_recommendation_insights(
    data: dict,
) -> dict:

    recommendations = data.get("recommendations", [])

    if not recommendations:
        raise ValueError(
            "At least one recommendation is required"
        )

    state = data.get("state")
    district = data.get("district")
    season = data.get("season")

    weather = data.get("weather") or {}
    advisory = data.get("advisory") or []

    prompt = f"""
You are the agricultural intelligence engine for the AgriSense application.

Your task is to analyze existing crop recommendations and provide
clear, practical agricultural insights for a farmer.

IMPORTANT:

- The crop recommendations were produced by an existing ML model.
- DO NOT replace, modify, or recreate the ML prediction.
- Treat the supplied recommendations as the model's existing output.
- Analyze and explain the recommendations.
- Do not invent missing facts.
- Do not create fake confidence values.
- Do not create fake prices, yields, rainfall, weather measurements,
  or market statistics.
- If information is missing, acknowledge that it is unavailable.
- Do not claim certainty about future crop prices or profits.
- Keep the advice practical and understandable for a farmer.

LOCATION:

State: {state or "Not available"}
District: {district or "Not available"}
Season: {season or "Not available"}

ML RECOMMENDATIONS:

{recommendations}

CURRENT WEATHER:

{weather}

EXISTING WEATHER ADVISORY:

{advisory}

Analyze the supplied information.

Return ONLY valid JSON using exactly this structure:

{{
    "summary": "A concise overall explanation of the recommendations.",

    "reasoning": [
        "Reason explaining why the top recommendation is favorable.",
        "Another important factor affecting the recommendation."
    ],

    "strengths": [
        "Important strength of the top recommendation."
    ],

    "weaknesses": [
        "Important limitation or weakness."
    ],

    "opportunities": [
        "Practical opportunity identified from the supplied information."
    ],

    "risks": [
        "Important agricultural or decision-making risk."
    ],

    "comparison": [
        "Useful comparison between the top recommendation and another supplied recommendation."
    ],

    "action_plan": [
        "Practical action the farmer should consider.",
        "Another practical action.",
        "Another practical action."
    ],

    "verdict": "A concise final recommendation based only on the supplied data."
}}

Requirements:

- Focus primarily on the top recommended crop.
- Compare it with other supplied recommendations when useful.
- Use expected_profit only when it exists in the supplied recommendation.
- Explain trade-offs rather than blindly praising the first crop.
- Consider weather when weather data is available.
- Consider the existing weather advisory when relevant.
- Consider crop details when they are supplied inside the recommendations.
- Do not invent crop characteristics that are not supplied.
- Provide 2 to 5 reasoning points.
- Provide 1 to 4 strengths.
- Provide 1 to 4 weaknesses.
- Provide 1 to 4 opportunities.
- Provide 1 to 4 risks.
- Provide 1 to 4 comparison points when comparison is possible.
- Provide 2 to 5 practical action-plan items.
- Keep the language concise and farmer-friendly.
"""

    result = generate_json(prompt)

    required_fields = [
        "summary",
        "reasoning",
        "strengths",
        "weaknesses",
        "opportunities",
        "risks",
        "comparison",
        "action_plan",
        "verdict",
    ]

    for field in required_fields:
        if field not in result:
            raise ValueError(
                f"Missing field in GenAI response: {field}"
            )

    list_fields = [
        "reasoning",
        "strengths",
        "weaknesses",
        "opportunities",
        "risks",
        "comparison",
        "action_plan",
    ]

    for field in list_fields:
        if not isinstance(result[field], list):
            raise ValueError(
                f"Invalid format for GenAI field: {field}"
            )

    if not isinstance(result["summary"], str):
        raise ValueError(
            "Invalid summary returned by GenAI"
        )

    if not isinstance(result["verdict"], str):
        raise ValueError(
            "Invalid verdict returned by GenAI"
        )

    return result