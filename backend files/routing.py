import requests


# OpenStreetMap Nominatim
GEOCODING_URL = "https://nominatim.openstreetmap.org/search"

# OSRM routing
ROUTING_URL = "https://router.project-osrm.org/route/v1/driving"


def geocode_place(place: str):

    params = {
        "q": place + ", India",
        "format": "json",
        "limit": 1
    }

    headers = {
        "User-Agent": "RideMate/1.0"
    }

    response = requests.get(
        GEOCODING_URL,
        params=params,
        headers=headers,
        timeout=20
    )

    response.raise_for_status()

    results = response.json()

    if not results:
        raise ValueError(
            f"Could not find location: {place}"
        )

    return {
        "latitude": float(results[0]["lat"]),
        "longitude": float(results[0]["lon"]),
        "display_name": results[0]["display_name"]
    }


def get_route(start: str, destination: str):

    start_location = geocode_place(start)
    destination_location = geocode_place(destination)

    coordinates = (
        f"{start_location['longitude']},"
        f"{start_location['latitude']};"
        f"{destination_location['longitude']},"
        f"{destination_location['latitude']}"
    )

    params = {
        "overview": "full",
        "geometries": "geojson",
        "steps": "false"
    }

    response = requests.get(
        f"{ROUTING_URL}/{coordinates}",
        params=params,
        timeout=30
    )

    response.raise_for_status()

    data = response.json()

    if data.get("code") != "Ok":
        raise ValueError("Route could not be calculated.")

    route = data["routes"][0]

    return {
        "start": start_location,
        "destination": destination_location,

        "distance_km": round(
            route["distance"] / 1000,
            1
        ),

        "duration_minutes": round(
            route["duration"] / 60
        ),

        "geometry": route["geometry"]
    }