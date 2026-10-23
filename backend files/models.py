from pydantic import BaseModel, Field
from typing import List


class TripRequest(BaseModel):

    start: str
    destination: str

    days: int = Field(
        default=1,
        ge=1,
        le=30
    )

    riders: int = Field(
        default=1,
        ge=1,
        le=20
    )

    mileage_kmpl: float = Field(
        default=45,
        gt=0
    )

    petrol_price: float = Field(
        default=112,
        gt=0
    )

    budget: float = Field(
        default=0,
        ge=0
    )

    interests: List[str] = []

    places: List[str] = []