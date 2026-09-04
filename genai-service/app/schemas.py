from typing import Any

from pydantic import BaseModel, Field


class WeatherAdvisoryInput(BaseModel):
    temperature: float | None = None
    humidity: float | None = None
    condition: str | None = None
    windSpeed: float | None = None
    rainfall: float | None = None


class RecommendationInsightsInput(BaseModel):
    state: str | None = None
    district: str | None = None
    season: str | None = None
    recommendations: list[dict[str, Any]] = Field(
        default_factory=list
    )
    weather: dict[str, Any] | None = None
    advisory: list[str] = Field(
        default_factory=list
    )


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatInput(BaseModel):
    message: str
    history: list[ChatMessage] = Field(
        default_factory=list
    )
    context: dict[str, Any] = Field(
        default_factory=dict
    )
    language: str = "Auto"
    languageCode: str = "en-IN"