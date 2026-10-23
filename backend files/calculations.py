def calculate_fuel(distance_km: float, mileage_kmpl: float):
    if mileage_kmpl <= 0:
        raise ValueError("Bike mileage must be greater than 0.")

    fuel_litres = distance_km / mileage_kmpl

    return round(fuel_litres, 2)


def calculate_fuel_cost(
    fuel_litres: float,
    petrol_price: float
):
    if petrol_price <= 0:
        raise ValueError(
            "Petrol price must be greater than 0."
        )

    return round(
        fuel_litres * petrol_price,
        2
    )


def calculate_trip_cost(
    distance_km: float,
    mileage_kmpl: float,
    petrol_price: float
):

    fuel_litres = calculate_fuel(
        distance_km,
        mileage_kmpl
    )

    fuel_cost = calculate_fuel_cost(
        fuel_litres,
        petrol_price
    )

    return {
        "distance_km": distance_km,
        "mileage_kmpl": mileage_kmpl,
        "fuel_litres": fuel_litres,
        "petrol_price": petrol_price,
        "fuel_cost": fuel_cost
    }