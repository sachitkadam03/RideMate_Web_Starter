/* =========================================================
   RIDEMATE DASHBOARD JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    
    /* -----------------------------------------------------
       USER-SPECIFIC LOCAL STORAGE
       ----------------------------------------------------- */

    function getStorage(key, fallback = null) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : fallback;
        } catch (error) {
            console.warn(`RideMate storage error: ${key}`, error);
            return fallback;
        }
    }

    const currentUser = getStorage("rideMateCurrentUser");

    // Never show previous-user data if no user is logged in.
    const userId = currentUser?.id;

    const userStorageKey = userId
        ? `rideMateUser_${userId}_`
        : null;

    const currentTrip = userStorageKey
        ? getStorage(`${userStorageKey}CurrentTrip`)
        : null;

    const trips = userStorageKey
        ? getStorage(`${userStorageKey}Trips`, [])
        : [];

    const bike = userStorageKey
        ? getStorage(`${userStorageKey}Bike`, {
            name: "My Motorcycle",
            model: "Not configured",
            average: 45
        })
        : {
            name: "My Motorcycle",
            model: "Not configured",
            average: 45
        };



    /* -----------------------------------------------------
       BASIC HELPERS
       ----------------------------------------------------- */

    function getStorage(key, fallback = null) {
        try {
            const value = localStorage.getItem(key);

            if (!value) {
                return fallback;
            }

            return JSON.parse(value);

        } catch (error) {
            console.warn(`RideMate storage error: ${key}`, error);
            return fallback;
        }
    }


    function formatCurrency(value) {
        const amount = Number(value) || 0;

        return "₹" + amount.toLocaleString("en-IN");
    }


    function formatNumber(value) {
        const amount = Number(value) || 0;

        return amount.toLocaleString("en-IN");
    }


    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function getTripDistance(trip) {
        return Number(
            trip.distance ||
            trip.routeDistance ||
            trip.km ||
            0
        );
    }


    function getTripBudget(trip) {
        return Number(
            trip.budget ||
            trip.totalBudget ||
            0
        );
    }


    function getTripDays(trip) {
        return Number(
            trip.days ||
            trip.duration ||
            1
        );
    }


    /* -----------------------------------------------------
       NORMALIZE TRIPS
       ----------------------------------------------------- */

    let allTrips = Array.isArray(trips)
        ? trips.filter(Boolean)
        : [];

    if (
        currentTrip &&
        typeof currentTrip === "object"
    ) {
        const currentExists = allTrips.some(trip => {

            return (
                trip.id &&
                currentTrip.id &&
                trip.id === currentTrip.id
            );
        });

        if (!currentExists) {
            allTrips.unshift(currentTrip);
        }
    }


    /* -----------------------------------------------------
       STATISTICS
       ----------------------------------------------------- */

    const totalRidesElement =
        document.getElementById("totalRides");

    const totalDistanceElement =
        document.getElementById("totalDistance");

    const totalBudgetElement =
        document.getElementById("totalBudget");

    const savedTripsElement =
        document.getElementById("savedTrips");


    const totalRides = allTrips.length;

    const totalDistance = allTrips.reduce(
        (total, trip) => {
            return total + getTripDistance(trip);
        },
        0
    );

    const totalBudget = allTrips.reduce(
        (total, trip) => {
            return total + getTripBudget(trip);
        },
        0
    );


    if (totalRidesElement) {
        totalRidesElement.textContent =
            formatNumber(totalRides);
    }

    if (totalDistanceElement) {
        totalDistanceElement.textContent =
            `${formatNumber(Math.round(totalDistance))} km`;
    }

    if (totalBudgetElement) {
        totalBudgetElement.textContent =
            formatCurrency(totalBudget);
    }

    if (savedTripsElement) {
        savedTripsElement.textContent =
            formatNumber(allTrips.length);
    }


    /* -----------------------------------------------------
       ACTIVE RIDE
       ----------------------------------------------------- */

    renderActiveRide(currentTrip);


    function renderActiveRide(trip) {

        const container =
            document.getElementById("activeRide");

        if (!container) {
            return;
        }


        if (!trip) {

            container.innerHTML = `
                <div class="active-ride-empty">

                    <div class="empty-ride-icon">
                        +
                    </div>

                    <h3>No active ride</h3>

                    <p>
                        Your next adventure starts with a route.
                        Build a ride and RideMate will organize
                        the journey for you.
                    </p>

                    <a href="planner.html">
                        PLAN YOUR FIRST RIDE →
                    </a>

                </div>
            `;

            return;
        }


        const start =
            trip.start ||
            trip.from ||
            "Your location";

        const destination =
            trip.destination ||
            trip.to ||
            "Destination";

        const days =
            getTripDays(trip);

        const riders =
            Number(trip.riders) || 1;

        const budget =
            getTripBudget(trip);


        container.innerHTML = `
            <div class="active-ride-content">

                <div>

                    <span class="active-ride-route-label">
                        CURRENT RIDE
                    </span>

                    <div class="active-ride-route">
                        <strong>
                            ${escapeHTML(start)}
                        </strong>

                        <span>→</span>

                        <strong>
                            ${escapeHTML(destination)}
                        </strong>
                    </div>

                    <div class="active-ride-details">

                        <div class="active-detail">
                            ${days} DAY${days !== 1 ? "S" : ""}
                        </div>

                        <div class="active-detail">
                            ${riders} RIDER${riders !== 1 ? "S" : ""}
                        </div>

                        <div class="active-detail">
                            ${formatCurrency(budget)} BUDGET
                        </div>

                    </div>

                </div>

                <a
                    href="trip.html"
                    class="active-ride-action"
                >
                    OPEN RIDE →
                </a>

            </div>
        `;
    }


    /* -----------------------------------------------------
       RECENT RIDES
       ----------------------------------------------------- */

    renderRecentTrips();


    function renderRecentTrips() {

        const container =
            document.getElementById("recentTrips");

        if (!container) {
            return;
        }


        if (allTrips.length === 0) {

            container.innerHTML = `
                <div class="panel-empty">

                    <span>
                        No rides yet
                    </span>

                    <p>
                        Your completed and saved rides
                        will appear here.
                    </p>

                </div>
            `;

            return;
        }


        const recentTrips =
            allTrips.slice(0, 5);


        container.innerHTML =
            recentTrips.map(trip => {

                const start =
                    trip.start ||
                    trip.from ||
                    "Start";

                const destination =
                    trip.destination ||
                    trip.to ||
                    "Destination";

                const days =
                    getTripDays(trip);

                const budget =
                    getTripBudget(trip);

                const distance =
                    getTripDistance(trip);


                return `
                    <a
                        href="trip.html"
                        class="recent-trip"
                    >

                        <div>

                            <div class="recent-trip-route">

                                ${escapeHTML(start)}

                                <span>→</span>

                                ${escapeHTML(destination)}

                            </div>

                            <div class="recent-trip-meta">

                                ${days} day${days !== 1 ? "s" : ""}

                                ${distance > 0
                                    ? ` · ${formatNumber(Math.round(distance))} km`
                                    : ""
                                }

                            </div>

                        </div>

                        <div class="recent-trip-budget">

                            ${formatCurrency(budget)}

                        </div>

                    </a>
                `;

            }).join("");
    }


    /* -----------------------------------------------------
       BIKE
       ----------------------------------------------------- */

    renderBike();


    function renderBike() {

        const bikeName =
            document.getElementById("bikeName");

        const bikeDetails =
            document.getElementById("bikeDetails");

        const bikeRides =
            document.getElementById("bikeRides");

        const bikeDistance =
            document.getElementById("bikeDistance");


        if (bikeName) {

            bikeName.textContent =
                bike.name ||
                "My Motorcycle";
        }


        if (bikeDetails) {

            bikeDetails.textContent =
                bike.model &&
                bike.model !== "Not configured"

                    ? bike.model

                    : "Add your motorcycle details";
        }


        if (bikeRides) {

            bikeRides.textContent =
                allTrips.length;
        }


        if (bikeDistance) {

            bikeDistance.textContent =
                `${formatNumber(
                    Math.round(totalDistance)
                )} km`;
        }
    }


    /* -----------------------------------------------------
       EDIT BIKE
       ----------------------------------------------------- */

    const editBike =
        document.getElementById("editBike");

    if (editBike) {

        editBike.addEventListener(
            "click",
            () => {

                const name =
                    prompt(
                        "Enter your bike name:",
                        bike.name || "My Motorcycle"
                    );

                if (!name) {
                    return;
                }


                const model =
                    prompt(
                        "Enter bike model:",
                        bike.model || ""
                    );


                const updatedBike = {

                    name: name.trim(),

                    model:
                        model
                            ? model.trim()
                            : "Not configured",

                    average:
                        bike.average || 45
                };


                localStorage.setItem(
                    "rideMateBike",
                    JSON.stringify(updatedBike)
                );


                renderBike();
            }
        );
    }


    /* -----------------------------------------------------
       EMERGENCY BUTTON
       ----------------------------------------------------- */

    const emergencyButton =
        document.getElementById("emergencyButton");

    if (emergencyButton) {

        emergencyButton.addEventListener(
            "click",
            () => {

                const confirmed =
                    confirm(
                        "Emergency assistance\n\n" +
                        "This will open your emergency options."
                    );

                if (!confirmed) {
                    return;
                }


                const emergencyNumber =
                    "112";


                window.location.href =
                    `tel:${emergencyNumber}`;
            }
        );
    }


    /* -----------------------------------------------------
       PLAN BUTTONS
       ----------------------------------------------------- */

    document
        .querySelectorAll(
            'a[href="planner.html"]'
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    localStorage.removeItem(
                        "rideMateSelectedDestination"
                    );
                }
            );
        });


    /* -----------------------------------------------------
       DASHBOARD REFRESH
       ----------------------------------------------------- */

    window.addEventListener(
        "storage",
        () => {

            location.reload();

        }
    );


    /* -----------------------------------------------------
       SMALL ENTRY ANIMATION
       ----------------------------------------------------- */

    const animatedElements =
        document.querySelectorAll(
            ".stat-card, .dashboard-panel, .active-ride-card, .dashboard-explore"
        );


    animatedElements.forEach(
        (element, index) => {

            element.style.opacity = "0";

            element.style.transform =
                "translateY(12px)";


            element.style.transition =
                `opacity .45s ease ${index * 0.05}s,
                 transform .45s ease ${index * 0.05}s`;


            requestAnimationFrame(() => {

                element.style.opacity = "1";

                element.style.transform =
                    "translateY(0)";
            });
        }
    );

});