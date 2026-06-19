from pydantic import BaseModel


class CropInput(BaseModel):
    N: float
    P: float
    K: float
    pH: float
    humidity: float
    rainfall: float
    temperature: float

class RecommendationInput(BaseModel):
    state: str
    district: str
    season: str

class SoilRecommendationInput(BaseModel):
    state: str
    district: str
    season: str

    N: float
    P: float
    K: float
    pH: float    

class PricePredictionInput(BaseModel):
    crop: str
    state: str
    district: str
    month: int
  