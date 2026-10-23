from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from routing import get_route
from calculations import calculate_trip_cost
from calculations import calculate_trip_cost
from models import TripRequest
from pydantic import BaseModel, EmailStr
from auth import register_user, login_user

from ai import chat_with_ollama


app = FastAPI(
    title="RideMate API",
    description="Backend API for the RideMate motorcycle travel platform",
    version="1.0.0"
)


# -----------------------------------
# CORS
# -----------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------------
# Request model
# -----------------------------------

class AIRequest(BaseModel):
    message: str


# -----------------------------------
# Root
# -----------------------------------

@app.get("/")
def root():
    return {
        "message": "RideMate API is running",
        "status": "success"
    }


# -----------------------------------
# Health check
# -----------------------------------

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "RideMate Backend"
    }


# -----------------------------------
# AI Chat
# -----------------------------------

@app.post("/api/ai/chat")
def ai_chat(request: AIRequest):

    answer = chat_with_ollama(request.message)

    return {
        "success": True,
        "response": answer
    }

@app.get("/api/route")
def calculate_route(
    start: str,
    destination: str
):

    route = get_route(
        start,
        destination
    )

    return {
        "success": True,
        "route": route
    }

@app.get("/api/trip-cost")
def trip_cost(
    distance_km: float,
    mileage_kmpl: float,
    petrol_price: float
):

    result = calculate_trip_cost(
        distance_km,
        mileage_kmpl,
        petrol_price
    )

    return {
        "success": True,
        "trip": result
    }

@app.get("/api/trip-plan")
def trip_plan(
    start: str,
    destination: str,
    mileage_kmpl: float,
    petrol_price: float
):

    # Get real road route
    route = get_route(
        start,
        destination
    )

    # Calculate fuel and fuel cost
    cost = calculate_trip_cost(
        route["distance_km"],
        mileage_kmpl,
        petrol_price
    )

    return {
        "success": True,

        "trip": {
            "start": start,
            "destination": destination
        },

        "route": {
            "distance_km": route["distance_km"],
            "duration_minutes": route["duration_minutes"]
        },

        "fuel": {
            "mileage_kmpl": mileage_kmpl,
            "fuel_litres": cost["fuel_litres"],
            "petrol_price": petrol_price,
            "fuel_cost": cost["fuel_cost"]
        }
    }
@app.post("/api/trip/create")
def create_trip(request: TripRequest):

    route = get_route(
        request.start,
        request.destination
    )

    cost = calculate_trip_cost(
        route["distance_km"],
        request.mileage_kmpl,
        request.petrol_price
    )

    return {
        "success": True,

        "trip": {
            "start": request.start,
            "destination": request.destination,
            "days": request.days,
            "riders": request.riders,
            "budget": request.budget,
            "interests": request.interests,
            "places": request.places
        },

        "route": {
            "distance_km": route["distance_km"],
            "duration_minutes": route["duration_minutes"]
        },

        "fuel": {
            "mileage_kmpl": request.mileage_kmpl,
            "fuel_litres": cost["fuel_litres"],
            "petrol_price": request.petrol_price,
            "fuel_cost": cost["fuel_cost"]
        }
    }

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

@app.post("/api/auth/register")
def register(request: RegisterRequest):

    return register_user(
        request.name,
        request.email,
        request.phone,
        request.password
    )


@app.post("/api/auth/login")
def login(request: LoginRequest):

    return login_user(
        request.email,
        request.password
    )