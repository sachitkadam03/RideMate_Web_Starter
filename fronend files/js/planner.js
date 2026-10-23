/* =========================================================
   RIDEMATE — TRIP PLANNER
   ROUTE → PREFERENCES → REVIEW
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const form = document.getElementById("plannerForm");

    const startLocation = document.getElementById("startLocation");
    const destination = document.getElementById("destination");
    const travelDate = document.getElementById("travelDate");
    const days = document.getElementById("days");

    const ridersInput = document.getElementById("riders");
    const riderCount = document.getElementById("riderCount");

    const decreaseRiders = document.getElementById("decreaseRiders");
    const increaseRiders = document.getElementById("increaseRiders");

    const bike = document.getElementById("bike");

    const budget = document.getElementById("budget");
    const budgetValue = document.getElementById("budgetValue");

    const specificPlaces =
        document.getElementById("requestedPlaces");

    const locationButton =
        document.getElementById("useLocationButton");

    const preferenceButtons =
        document.querySelectorAll(".preference-chip");


    /* =====================================================
       STEP PANELS
    ===================================================== */

    const stepRoute =
        document.getElementById("stepRoute");

    const stepPreferences =
        document.getElementById("stepPreferences");

    const stepReview =
        document.getElementById("stepReview");

    const indicators =
        document.querySelectorAll(".planner-step");


    let currentStep = 1;


    /* =====================================================
       RIDERS
    ===================================================== */

    let riders =
        Number(ridersInput?.value) || 1;


    function updateRiders() {

        if (riderCount) {
            riderCount.textContent = riders;
        }

        if (ridersInput) {
            ridersInput.value = riders;
        }

    }


    if (increaseRiders) {

        increaseRiders.addEventListener("click", () => {

            if (riders < 20) {
                riders++;
                updateRiders();
            }

        });

    }


    if (decreaseRiders) {

        decreaseRiders.addEventListener("click", () => {

            if (riders > 1) {
                riders--;
                updateRiders();
            }

        });

    }


    /* =====================================================
       BUDGET
    ===================================================== */

    function formatIndianCurrency(number) {

        return Number(number || 0)
            .toLocaleString("en-IN");

    }


    function updateBudget() {

        if (!budget || !budgetValue) {
            return;
        }

        const value =
            Number(budget.value);

        const min =
            Number(budget.min);

        const max =
            Number(budget.max);

        const percentage =
            ((value - min) / (max - min)) * 100;

        budgetValue.textContent =
            `₹${formatIndianCurrency(value)}`;

        budget.style.setProperty(
            "--budget-progress",
            `${percentage}%`
        );

    }


    if (budget) {
        budget.addEventListener(
            "input",
            updateBudget
        );
    }


    /* =====================================================
       PREFERENCES
    ===================================================== */

    preferenceButtons.forEach(button => {

        button.addEventListener("click", () => {

            button.classList.toggle("selected");

        });

    });


    /* =====================================================
       CURRENT LOCATION
    ===================================================== */

    if (locationButton) {

        locationButton.addEventListener("click", () => {

            if (!navigator.geolocation) {

                alert(
                    "Location services are not supported by this browser."
                );

                return;
            }

            locationButton.textContent = "…";

            navigator.geolocation.getCurrentPosition(

                position => {

                    const latitude =
                        position.coords.latitude.toFixed(5);

                    const longitude =
                        position.coords.longitude.toFixed(5);

                    startLocation.value =
                        `Current Location (${latitude}, ${longitude})`;

                    locationButton.textContent = "⌖";

                },

                () => {

                    locationButton.textContent = "⌖";

                    alert(
                        "Unable to access your location. Please enter your starting city manually."
                    );

                },

                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                }

            );

        });

    }


    /* =====================================================
       DATE
    ===================================================== */

    const today = new Date();

    const todayString =
        `${today.getFullYear()}-${String(
            today.getMonth() + 1
        ).padStart(2, "0")}-${String(
            today.getDate()
        ).padStart(2, "0")}`;

    if (travelDate) {
        travelDate.min = todayString;
    }


    /* =====================================================
       DESTINATION FROM URL
    ===================================================== */

    const urlParams =
        new URLSearchParams(window.location.search);

    const destinationFromURL =
        urlParams.get("destination");

    if (
        destinationFromURL &&
        destination
    ) {

        destination.value =
            destinationFromURL;

    }


    /* =====================================================
       STEP SWITCHING
    ===================================================== */

    function showStep(step) {

        currentStep = step;

        if (!stepRoute ||
            !stepPreferences ||
            !stepReview) {
            return;
        }

        stepRoute.classList.remove("active");
        stepPreferences.classList.remove("active");
        stepReview.classList.remove("active");


        if (step === 1) {

            stepRoute.classList.add("active");

        }

        if (step === 2) {

            stepPreferences.classList.add("active");

        }

        if (step === 3) {

            stepReview.classList.add("active");

            populateReview();

        }


        indicators.forEach(indicator => {

            const indicatorStep =
                Number(
                    indicator.dataset.stepIndicator
                );

            indicator.classList.remove("active");

            if (indicatorStep === step) {

                indicator.classList.add("active");

            }

        });


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    /* =====================================================
       ERROR MESSAGE
    ===================================================== */

    function showError(element, message) {

        if (!element) {
            alert(message);
            return;
        }

        element.classList.add("input-error");

        element.focus();

        let error =
            element.parentElement.querySelector(
                ".field-error"
            );

        if (!error) {

            error =
                document.createElement("div");

            error.className =
                "field-error";

            element.parentElement.appendChild(error);

        }

        error.textContent =
            message;

        error.style.display =
            "block";

        error.style.color =
            "#ff4545";

        error.style.marginTop =
            "7px";

        error.style.fontSize =
            "10px";

        setTimeout(() => {

            element.classList.remove(
                "input-error"
            );

            if (error) {
                error.textContent = "";
            }

        }, 3000);

    }


    /* =====================================================
       VALIDATE ROUTE
    ===================================================== */

    function validateRoute() {

        const start =
            startLocation.value.trim();

        const destinationValue =
            destination.value.trim();

        const date =
            travelDate.value;

        const duration =
            Number(days.value);

        const selectedBike =
            bike.value;


        /* START */

        if (!start) {

            showError(
                startLocation,
                "Please enter your starting location."
            );

            return false;

        }


        /* DESTINATION */

        if (!destinationValue) {

            showError(
                destination,
                "Please enter your destination."
            );

            return false;

        }


        /* DATE */

        if (!date) {

            showError(
                travelDate,
                "Please select your travel date."
            );

            return false;

        }


        /* DAYS */

        if (
            !duration ||
            duration < 1 ||
            duration > 30
        ) {

            showError(
                days,
                "Enter a duration between 1 and 30 days."
            );

            return false;

        }


        /* BIKE */

        if (!selectedBike) {

            showError(
                bike,
                "Please select your bike."
            );

            return false;

        }


        return true;

    }


    /* =====================================================
       ROUTE → PREFERENCES
    ===================================================== */

    const routeNextButton =
        document.getElementById(
            "routeNextButton"
        );


    if (routeNextButton) {

        routeNextButton.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                console.log(
                    "Continue to Preferences clicked"
                );

                if (validateRoute()) {

                    console.log(
                        "Route valid — opening preferences"
                    );

                    showStep(2);

                }

            }
        );

    }


    /* =====================================================
       PREFERENCES → REVIEW
    ===================================================== */

    const preferencesNextButton =
        document.getElementById(
            "preferencesNextButton"
        );


    if (preferencesNextButton) {

        preferencesNextButton.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                populateReview();

                showStep(3);

            }
        );

    }


    /* =====================================================
       PREFERENCES BACK
    ===================================================== */

    const preferencesBackButton =
        document.getElementById(
            "preferencesBackButton"
        );


    if (preferencesBackButton) {

        preferencesBackButton.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                showStep(1);

            }
        );

    }


    /* =====================================================
       REVIEW BACK
    ===================================================== */

    const reviewBackButton =
        document.getElementById(
            "reviewBackButton"
        );


    if (reviewBackButton) {

        reviewBackButton.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                showStep(2);

            }
        );

    }


    /* =====================================================
       GET SELECTED PREFERENCES
    ===================================================== */

    function getSelectedPreferences() {

        const selected = [];

        preferenceButtons.forEach(button => {

            if (
                button.classList.contains(
                    "selected"
                )
            ) {

                selected.push(
                    button.dataset.preference
                );

            }

        });

        return selected;

    }


    /* =====================================================
       POPULATE REVIEW
    ===================================================== */

    function populateReview() {

        const reviewStart =
            document.getElementById("reviewStart");

        const reviewDestination =
            document.getElementById("reviewDestination");

        const reviewDate =
            document.getElementById("reviewDate");

        const reviewDays =
            document.getElementById("reviewDays");

        const reviewRiders =
            document.getElementById("reviewRiders");

        const reviewBudget =
            document.getElementById("reviewBudget");

        const reviewBike =
            document.getElementById("reviewBike");

        const reviewPreferences =
            document.getElementById("reviewPreferences");

        const reviewRequestedPlaces =
            document.getElementById(
                "reviewRequestedPlaces"
            );


        /* ROUTE */

        reviewStart.textContent =
            startLocation.value || "—";

        reviewDestination.textContent =
            destination.value || "—";


        /* DATE */

        if (travelDate.value) {

            const date =
                new Date(
                    travelDate.value +
                    "T00:00:00"
                );

            reviewDate.textContent =
                date.toLocaleDateString(
                    "en-IN",
                    {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                    }
                );

        } else {

            reviewDate.textContent =
                "—";

        }


        /* DAYS */

        reviewDays.textContent =
            `${days.value || 0} Days`;


        /* RIDERS */

        reviewRiders.textContent =
            `${riders} Rider${
                riders > 1 ? "s" : ""
            }`;


        /* BUDGET */

        reviewBudget.textContent =
            `₹${formatIndianCurrency(
                budget.value
            )}`;


        /* BIKE */

        reviewBike.textContent =
            bike.value || "—";


        /* PREFERENCES */

        const selectedPreferences =
            getSelectedPreferences();

        reviewPreferences.innerHTML = "";


        if (
            selectedPreferences.length === 0
        ) {

            reviewPreferences.innerHTML = `
                <span class="review-empty">
                    No preferences selected
                </span>
            `;

        } else {

            selectedPreferences.forEach(
                preference => {

                    const tag =
                        document.createElement(
                            "span"
                        );

                    tag.className =
                        "review-tag";

                    tag.textContent =
                        preference;

                    reviewPreferences.appendChild(
                        tag
                    );

                }
            );

        }


        /* REQUESTED PLACES */

        reviewRequestedPlaces.innerHTML = "";

        const rawPlaces =
            specificPlaces.value.trim();


        if (!rawPlaces) {

            reviewRequestedPlaces.innerHTML = `
                <span class="review-empty">
                    No specific places added.
                </span>
            `;

        } else {

            const places =
                rawPlaces
                    .split(/,|\n/)
                    .map(place =>
                        place.trim()
                    )
                    .filter(Boolean);


            places.forEach(place => {

                const tag =
                    document.createElement(
                        "span"
                    );

                tag.className =
                    "review-requested-place";

                tag.textContent =
                    `📍 ${place}`;

                reviewRequestedPlaces.appendChild(
                    tag
                );

            });

        }

    }


    /* =====================================================
       FINAL CREATE TRIP
    ===================================================== */

    if (form) {

        form.addEventListener(
            "submit",
            function(event) {

                event.preventDefault();

                if (!validateRoute()) {

                    showStep(1);

                    return;

                }


                const selectedPreferences =
                    getSelectedPreferences();


                const places =
                    specificPlaces.value.trim();


                const trip = {

                    id:
                        "RM-" +
                        Date.now(),

                    start:
                        startLocation.value.trim(),

                    destination:
                        destination.value.trim(),

                    travelDate:
                        travelDate.value,

                    days:
                        Number(days.value),

                    riders:
                        riders,

                    bike:
                        bike.value,

                    budget:
                        Number(budget.value),

                    experiences:
                        selectedPreferences,

                    specificPlaces:
                        places,

                    createdAt:
                        new Date().toISOString()

                };


                /* CURRENT TRIP */

                const currentUser = JSON.parse(
    localStorage.getItem("rideMateCurrentUser") || "null"
);

if (!currentUser || currentUser.id == null) {
    alert("Please log in before saving a trip.");
    window.location.href = "login.html";
    return;
}

const userStorageKey = `rideMateUser_${currentUser.id}_`;

localStorage.setItem(
    `${userStorageKey}CurrentTrip`,
    JSON.stringify(trip)
);


                /* TRIP HISTORY */

                let trips = [];

                try {

                    trips =
                        JSON.parse(
                            localStorage.getItem(
                                "rideMateTrips"
                            )
                        ) || [];

                } catch {

                    trips = [];

                }


                trips.push(trip);


                localStorage.setItem(
                    "rideMateTrips",
                    JSON.stringify(trips)
                );


                /* BUTTON */

                const button =
                    document.getElementById(
                        "generateRideButton"
                    );


                if (button) {

                    button.disabled =
                        true;

                    button.innerHTML = `
                        <span>RIDE CREATED</span>
                        <strong>✓</strong>
                    `;

                    button.style.background =
                        "#35C759";

                }


                /* OPEN TRIP */

                setTimeout(() => {

                    window.location.href =
                        "trip.html";

                }, 700);

            }
        );

    }


    /* =====================================================
       REMOVE ERROR WHEN USER TYPES
    ===================================================== */

    [
        startLocation,
        destination,
        travelDate,
        days,
        bike
    ].forEach(element => {

        if (!element) return;

        element.addEventListener(
            "input",
            () => {

                element.classList.remove(
                    "input-error"
                );

            }
        );

        element.addEventListener(
            "change",
            () => {

                element.classList.remove(
                    "input-error"
                );

            }
        );

    });


    /* =====================================================
       DEFAULTS
    ===================================================== */

    updateRiders();
    updateBudget();

});