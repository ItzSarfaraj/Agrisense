from app.services.genai_service import generate_json


def generate_weather_advisory(weather: dict) -> list[str]:

    prompt = f"""
You are an agricultural advisor for the AgriSense application.

Analyze the current weather conditions below and provide practical
agricultural advice for a farmer.

Weather conditions:

Temperature: {weather.get("temperature", "Not available")} °C
Humidity: {weather.get("humidity", "Not available")} %
Condition: {weather.get("condition", "Not available")}
Wind speed: {weather.get("windSpeed", "Not available")} km/h
Rainfall: {weather.get("rainfall", "Not available")} mm

Return ONLY valid JSON using exactly this structure:

{{
    "advisory": [
        "advice 1",
        "advice 2",
        "advice 3"
    ]
}}

Requirements:

- Provide 2 to 4 practical advisories.
- Consider irrigation and crop water requirements.
- Consider heat or cold stress when relevant.
- Consider fungal disease risk when relevant.
- Consider rainfall and drainage when relevant.
- Consider whether current conditions are suitable for field operations.
- Do not invent weather information.
- Do not recommend a specific crop because the crop is not provided.
- Keep each advisory concise and useful to a farmer.
"""

    result = generate_json(prompt)

    advisory = result.get("advisory")

    if not isinstance(advisory, list):
        raise ValueError(
            "Invalid advisory format returned by GenAI"
        )

    return advisory