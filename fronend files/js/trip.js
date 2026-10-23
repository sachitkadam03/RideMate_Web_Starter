/* =========================================================
   RIDEMATE — GENERATED TRIP
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       LOAD CURRENT TRIP
    ===================================================== */

    let trip = null;

    try {

        const stored =
            localStorage.getItem(
                "rideMateCurrentTrip"
            );

        if (stored) {

            trip = JSON.parse(stored);

        }

    } catch (error) {

        console.error(
            "Unable to load RideMate trip:",
            error
        );

        trip = null;

    }


    /* =====================================================
       CHECK TRIP
    ===================================================== */

    if (
        !trip ||
        typeof trip !== "object"
    ) {

        alert(
            "No generated trip found. Please create a new ride."
        );

        window.location.href =
            "planner.html";

        return;

    }


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const tripTitle =
        document.getElementById("tripTitle");

    const tripStart =
        document.getElementById("tripStart");

    const tripDestination =
        document.getElementById("tripDestination");

    const tripDate =
        document.getElementById("tripDate");

    const tripDays =
        document.getElementById("tripDays");

    const tripRiders =
        document.getElementById("tripRiders");

    const tripBudget =
        document.getElementById("tripBudget");

    const bikeName =
        document.getElementById("bikeName");

    const budgetTotal =
        document.getElementById("budgetTotal");

    const fuelAmount =
        document.getElementById("fuelAmount");

    const stayAmount =
        document.getElementById("stayAmount");

    const foodAmount =
        document.getElementById("foodAmount");

    const activityAmount =
        document.getElementById("activityAmount");

    const itinerary =
        document.getElementById("itinerary");

    const placesList =
        document.getElementById("placesList");

    const preferences =
        document.getElementById("preferences");

    const requestedPlaces =
        document.getElementById("requestedPlaces");

    const editTrip =
        document.getElementById("editTrip");

    const deleteTrip =
        document.getElementById("deleteTrip");

    const shareTrip =
        document.getElementById("shareTrip");


    /* =====================================================
       HELPERS
    ===================================================== */

    function formatCurrency(value) {

        return Number(value || 0)
            .toLocaleString("en-IN");

    }


    function formatDate(dateString) {

        if (!dateString) {
            return "Not selected";
        }

        const date =
            new Date(
                dateString + "T00:00:00"
            );

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "Not selected";

        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );

    }


    function escapeHTML(value) {

        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }


    function getPlaces() {

        if (
            Array.isArray(
                trip.specificPlaces
            )
        ) {

            return trip.specificPlaces
                .map(place => String(place).trim())
                .filter(Boolean);

        }

        return String(
            trip.specificPlaces || ""
        )
            .split(/,|\n/)
            .map(place => place.trim())
            .filter(Boolean);

    }


    /* =====================================================
       NORMALIZE TRIP
    ===================================================== */

    const start =
        String(
            trip.start ||
            trip.startLocation ||
            ""
        ).trim();

    const destination =
        String(
            trip.destination ||
            ""
        ).trim();

    const numberOfDays =
        Math.max(
            1,
            Math.min(
                Number(trip.days) || 1,
                30
            )
        );

    const numberOfRiders =
        Math.max(
            1,
            Number(trip.riders) || 1
        );

    const totalBudget =
        Math.max(
            0,
            Number(trip.budget) || 0
        );

    const bike =
        String(
            trip.bike || ""
        );

    const places =
        getPlaces();

    const experiences =
        Array.isArray(trip.experiences)
            ? trip.experiences
            : [];


    /* =====================================================
       BASIC TRIP INFORMATION
    ===================================================== */

    if (tripTitle) {

        tripTitle.textContent =
            `${start || "Your Start"} → ${
                destination || "Your Destination"
            }`;

    }


    if (tripStart) {
        tripStart.textContent =
            start || "Not selected";
    }


    if (tripDestination) {
        tripDestination.textContent =
            destination || "Not selected";
    }


    if (tripDate) {
        tripDate.textContent =
            formatDate(
                trip.travelDate
            );
    }


    if (tripDays) {
        tripDays.textContent =
            `${numberOfDays} Days`;
    }


    if (tripRiders) {

        tripRiders.textContent =
            `${numberOfRiders} Rider${
                numberOfRiders > 1
                    ? "s"
                    : ""
            }`;

    }


    if (tripBudget) {

        tripBudget.textContent =
            `₹${formatCurrency(
                totalBudget
            )}`;

    }


    if (budgetTotal) {

        budgetTotal.textContent =
            `₹${formatCurrency(
                totalBudget
            )}`;

    }


    if (bikeName) {

        bikeName.textContent =
            bike ||
            "Bike not selected";

    }


    /* =====================================================
       BUDGET BREAKDOWN
    ===================================================== */

    const fuel =
        Math.round(
            totalBudget * 0.35
        );

    const stay =
        Math.round(
            totalBudget * 0.30
        );

    const food =
        Math.round(
            totalBudget * 0.20
        );

    const activities =
        totalBudget -
        fuel -
        stay -
        food;


    if (fuelAmount) {

        fuelAmount.textContent =
            `₹${formatCurrency(fuel)}`;

    }

    if (stayAmount) {

        stayAmount.textContent =
            `₹${formatCurrency(stay)}`;

    }

    if (foodAmount) {

        foodAmount.textContent =
            `₹${formatCurrency(food)}`;

    }

    if (activityAmount) {

        activityAmount.textContent =
            `₹${formatCurrency(
                activities
            )}`;

    }


    /* =====================================================
       PREFERENCES
    ===================================================== */

    function renderPreferences() {

        if (!preferences) return;

        preferences.innerHTML = "";

        if (
            experiences.length === 0
        ) {

            preferences.innerHTML = `
                <span class="preference">
                    No preferences selected
                </span>
            `;

            return;

        }

        experiences.forEach(item => {

            const element =
                document.createElement(
                    "span"
                );

            element.className =
                "preference";

            element.textContent =
                item;

            preferences.appendChild(
                element
            );

        });

    }

    renderPreferences();


    /* =====================================================
       REQUESTED PLACES
    ===================================================== */

    function renderRequestedPlaces() {

        if (!requestedPlaces) return;

        requestedPlaces.innerHTML = "";

        if (
            places.length === 0
        ) {

            requestedPlaces.innerHTML = `
                <span class="empty-request">
                    No specific places added.
                </span>
            `;

            return;

        }

        places.forEach(place => {

            const element =
                document.createElement(
                    "span"
                );

            element.className =
                "requested-place";

            element.textContent =
                `📍 ${place}`;

            requestedPlaces.appendChild(
                element
            );

        });

    }

    renderRequestedPlaces();


    /* =====================================================
       ITINERARY
    ===================================================== */

    function generateItinerary() {

        if (!itinerary) return;

        itinerary.innerHTML = "";


        /*
         * Create a useful daily plan instead of
         * repeating "Explore Goa" every day.
         */

        const destinationName =
            destination || "your destination";

        const startName =
            start || "your starting point";


        const defaultActivities = [

            `Ride from ${startName} towards ${destinationName} with regular fuel and rest breaks.`,

            `Explore local roads and scenic viewpoints around ${destinationName}.`,

            `Discover popular attractions, local food and nearby experiences.`,

            `Take a relaxed exploration ride and visit places matching your interests.`,

            `Explore hidden spots and scenic roads around ${destinationName}.`,

            `Spend the day experiencing local culture, food and attractions.`,

            `Enjoy a scenic motorcycle ride around ${destinationName}.`,

            `Keep the final day flexible for places you missed and prepare for the return ride.`

        ];


        for (
            let day = 1;
            day <= numberOfDays;
            day++
        ) {

            let title = "";
            let description = "";
            let tags = [];


            /* ---------------------------------------------
               REQUESTED PLACE FIRST
            --------------------------------------------- */

            if (
                places.length > 0 &&
                day <= places.length
            ) {

                const place =
                    places[day - 1];

                title =
                    `Visit ${place}`;

                description =
                    `Spend part of Day ${day} exploring ${place}. Allow enough time for the ride, parking, food and the experience.`;

                tags.push(
                    "Requested Place"
                );

            }

            /* ---------------------------------------------
               DAY 1
            --------------------------------------------- */

            else if (day === 1) {

                title =
                    `Ride from ${startName} to ${destinationName}`;

                description =
                    defaultActivities[0];

                tags.push(
                    "Departure"
                );

            }

            /* ---------------------------------------------
               FINAL DAY
            --------------------------------------------- */

            else if (
                day === numberOfDays
            ) {

                title =
                    `Final exploration of ${destinationName}`;

                description =
                    defaultActivities[7];

                tags.push(
                    "Final Day"
                );

            }

            /* ---------------------------------------------
               OTHER DAYS
            --------------------------------------------- */

            else {

                const index =
                    (day - 2) %
                    6;

                title =
                    `${destinationName} — Day ${day}`;

                description =
                    defaultActivities[
                        index + 1
                    ];

            }


            /* ---------------------------------------------
               INTEREST
            --------------------------------------------- */

            if (
                experiences.length > 0
            ) {

                const interest =
                    experiences[
                        (day - 1) %
                        experiences.length
                    ];

                tags.push(
                    interest
                );

            }


            tags.push("Ride");


            /* ---------------------------------------------
               TAG HTML
            --------------------------------------------- */

            const tagHTML =
                tags
                    .map(tag => `
                        <span class="day-tag">
                            ${escapeHTML(tag)}
                        </span>
                    `)
                    .join("");


            /* ---------------------------------------------
               CREATE DAY
            --------------------------------------------- */

            const section =
                document.createElement(
                    "div"
                );

            section.className =
                "itinerary-day";


            section.innerHTML = `

                <div class="day-number">
                    D${String(day).padStart(2, "0")}
                </div>

                <div class="day-content">

                    <h3>
                        ${escapeHTML(title)}
                    </h3>

                    <p>
                        ${escapeHTML(description)}
                    </p>

                    <div class="day-tags">
                        ${tagHTML}
                    </div>

                </div>

            `;


            itinerary.appendChild(
                section
            );

        }

    }

    generateItinerary();


    /* =====================================================
       SUGGESTED PLACES
    ===================================================== */

    function renderSuggestedPlaces() {

        if (!placesList) return;

        placesList.innerHTML = "";


        const destinationLower =
            destination.toLowerCase();


        let suggestions = [];


        if (
            destinationLower.includes("goa")
        ) {

            suggestions = [

                {
                    name: "Dudhsagar Falls",
                    type: "Waterfall"
                },

                {
                    name: "Fort Aguada",
                    type: "Heritage"
                },

                {
                    name: "Palolem Beach",
                    type: "Beach"
                },

                {
                    name: "Baga Beach",
                    type: "Beach"
                }

            ];

        }

        else if (
            destinationLower.includes("ladakh")
        ) {

            suggestions = [

                {
                    name: "Pangong Lake",
                    type: "Lake"
                },

                {
                    name: "Nubra Valley",
                    type: "Valley"
                },

                {
                    name: "Khardung La",
                    type: "Mountain Pass"
                },

                {
                    name: "Leh Palace",
                    type: "Heritage"
                }

            ];

        }

        else if (
            destinationLower.includes("manali")
        ) {

            suggestions = [

                {
                    name: "Solang Valley",
                    type: "Adventure"
                },

                {
                    name: "Rohtang Pass",
                    type: "Mountain Pass"
                },

                {
                    name: "Old Manali",
                    type: "Local"
                },

                {
                    name: "Hidimba Temple",
                    type: "Culture"
                }

            ];

        }

        else {

            suggestions = [

                {
                    name:
                        `${destination || "Destination"} Viewpoint`,
                    type: "Scenic"
                },

                {
                    name:
                        "Popular Local Attraction",
                    type: "Explore"
                },

                {
                    name:
                        "Local Food Stop",
                    type: "Food"
                },

                {
                    name:
                        "Sunset Point",
                    type: "Scenic"
                }

            ];

        }


        suggestions.forEach(place => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "place-card";


            card.innerHTML = `

                <span>✦</span>

                <h3>
                    ${escapeHTML(
                        place.name
                    )}
                </h3>

                <p>
                    ${escapeHTML(
                        place.type
                    )}
                </p>

            `;


            placesList.appendChild(
                card
            );

        });

    }

    renderSuggestedPlaces();


    /* =====================================================
       EDIT
    ===================================================== */

    if (editTrip) {

        editTrip.addEventListener(
            "click",
            () => {

                window.location.href =
                    "planner.html";

            }
        );

    }


    /* =====================================================
       DELETE
    ===================================================== */

    if (deleteTrip) {

        deleteTrip.addEventListener(
            "click",
            () => {

                const confirmDelete =
                    confirm(
                        "Delete this saved RideMate trip?"
                    );

                if (!confirmDelete) {
                    return;
                }


                localStorage.removeItem(
                    "rideMateCurrentTrip"
                );


                window.location.href =
                    "planner.html";

            }
        );

    }


    /* =====================================================
       SHARE
    ===================================================== */

    if (shareTrip) {

        shareTrip.addEventListener(
            "click",
            async () => {

                const shareText =
                    `RideMate Journey\n\n` +
                    `${start} → ${destination}\n` +
                    `${numberOfDays} days • ` +
                    `${numberOfRiders} rider(s)\n` +
                    `Bike: ${bike}\n` +
                    `Budget: ₹${formatCurrency(
                        totalBudget
                    )}`;


                if (navigator.share) {

                    try {

                        await navigator.share({

                            title:
                                "My RideMate Journey",

                            text:
                                shareText

                        });

                    } catch {

                        /* User cancelled */

                    }

                }

                else {

                    try {

                        await navigator.clipboard
                            .writeText(
                                shareText
                            );

                        alert(
                            "Trip details copied to clipboard."
                        );

                    } catch {

                        alert(
                            shareText
                        );

                    }

                }

            }
        );

    }

});