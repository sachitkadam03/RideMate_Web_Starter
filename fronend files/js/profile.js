/* =========================================================
   RIDEMATE PROFILE JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       HELPERS
       ===================================================== */

    function getStorage(key, fallback = null) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : fallback;
        } catch {
            return fallback;
        }
    }

    function saveStorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function formatCurrency(value) {
        return "₹" + (Number(value) || 0).toLocaleString("en-IN");
    }

    function formatNumber(value) {
        return (Number(value) || 0).toLocaleString("en-IN");
    }


    /* =====================================================
       LOAD DATA
       ===================================================== */

    let profile = getStorage("rideMateProfile", {
        name: "Sachit",
        email: "rider@ridemate.in",
        phone: "",
        city: "Mumbai"
    });

    let bike = getStorage("rideMateBike", {
        name: "My Motorcycle",
        model: "Add your bike details",
        average: 45
    });

    let trips = getStorage("rideMateTrips", []);

    if (!Array.isArray(trips)) {
        trips = [];
    }


    /* =====================================================
       PROFILE ELEMENTS
       ===================================================== */

    const profileName =
        document.getElementById("profileName");

    const profileEmail =
        document.getElementById("profileEmail");

    const profileInitial =
        document.getElementById("profileInitial");

    const detailName =
        document.getElementById("detailName");

    const detailEmail =
        document.getElementById("detailEmail");

    const detailPhone =
        document.getElementById("detailPhone");

    const detailCity =
        document.getElementById("detailCity");


    function renderProfile() {

        const name =
            profile.name || "Rider";

        const email =
            profile.email || "rider@ridemate.in";

        const phone =
            profile.phone || "Not added";

        const city =
            profile.city || "Not added";


        if (profileName) {
            profileName.textContent = name;
        }

        if (profileEmail) {
            profileEmail.textContent = email;
        }

        if (profileInitial) {
            profileInitial.textContent =
                name.charAt(0).toUpperCase();
        }

        if (detailName) {
            detailName.textContent = name;
        }

        if (detailEmail) {
            detailEmail.textContent = email;
        }

        if (detailPhone) {
            detailPhone.textContent = phone;
        }

        if (detailCity) {
            detailCity.textContent = city;
        }
    }

    renderProfile();


    /* =====================================================
       EDIT PROFILE
       ===================================================== */

    const editProfile =
        document.getElementById("editProfile");

    if (editProfile) {

        editProfile.addEventListener(
            "click",
            () => {

                const name = prompt(
                    "Enter your full name:",
                    profile.name || ""
                );

                if (name === null) {
                    return;
                }

                const email = prompt(
                    "Enter your email:",
                    profile.email || ""
                );

                if (email === null) {
                    return;
                }

                const phone = prompt(
                    "Enter your phone number:",
                    profile.phone || ""
                );

                if (phone === null) {
                    return;
                }

                const city = prompt(
                    "Enter your home city:",
                    profile.city || ""
                );

                if (city === null) {
                    return;
                }


                profile = {
                    name:
                        name.trim() || "Rider",

                    email:
                        email.trim() ||
                        "rider@ridemate.in",

                    phone:
                        phone.trim(),

                    city:
                        city.trim() || "Not added"
                };


                saveStorage(
                    "rideMateProfile",
                    profile
                );

                renderProfile();
            }
        );
    }


    /* =====================================================
       BIKE
       ===================================================== */

    const bikeName =
        document.getElementById("bikeName");

    const bikeModel =
        document.getElementById("bikeModel");

    const bikeAverage =
        document.getElementById("bikeAverage");

    const bikeRides =
        document.getElementById("bikeRides");

    const bikeDistance =
        document.getElementById("bikeDistance");


    function renderBike() {

        if (bikeName) {
            bikeName.textContent =
                bike.name || "My Motorcycle";
        }

        if (bikeModel) {
            bikeModel.textContent =
                bike.model ||
                "Add your bike details";
        }

        if (bikeAverage) {
            bikeAverage.textContent =
                `${bike.average || 45} km/l`;
        }

        if (bikeRides) {
            bikeRides.textContent =
                trips.length;
        }

        const distance =
            trips.reduce(
                (total, trip) => {

                    return total +
                        Number(
                            trip.distance ||
                            trip.routeDistance ||
                            trip.km ||
                            0
                        );

                },
                0
            );

        if (bikeDistance) {
            bikeDistance.textContent =
                `${formatNumber(Math.round(distance))} km`;
        }
    }

    renderBike();


    /* =====================================================
       EDIT BIKE
       ===================================================== */

    const editBike =
        document.getElementById("editBike");

    if (editBike) {

        editBike.addEventListener(
            "click",
            () => {

                const name = prompt(
                    "Enter your bike name:",
                    bike.name || ""
                );

                if (name === null) {
                    return;
                }

                const model = prompt(
                    "Enter your bike model:",
                    bike.model || ""
                );

                if (model === null) {
                    return;
                }

                const average = prompt(
                    "Enter your bike average in km/l:",
                    bike.average || 45
                );

                if (average === null) {
                    return;
                }


                bike = {

                    name:
                        name.trim() ||
                        "My Motorcycle",

                    model:
                        model.trim() ||
                        "Add your bike details",

                    average:
                        Number(average) > 0
                            ? Number(average)
                            : 45
                };


                saveStorage(
                    "rideMateBike",
                    bike
                );

                renderBike();
            }
        );
    }


    /* =====================================================
       PREFERENCES
       ===================================================== */

    let preferences =
        getStorage(
            "rideMatePreferences",
            []
        );

    if (!Array.isArray(preferences)) {
        preferences = [];
    }


    const preferenceButtons =
        document.querySelectorAll(
            ".preference-item"
        );


    function renderPreferences() {

        preferenceButtons.forEach(button => {

            const preference =
                button.dataset.preference;

            const selected =
                preferences.includes(preference);

            button.classList.toggle(
                "selected",
                selected
            );

            const icon =
                button.querySelector("i");

            if (icon) {
                icon.textContent =
                    selected ? "✓" : "+";
            }
        });
    }

    renderPreferences();


    preferenceButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const preference =
                    button.dataset.preference;

                if (
                    preferences.includes(preference)
                ) {

                    preferences =
                        preferences.filter(
                            item =>
                                item !== preference
                        );

                } else {

                    preferences.push(
                        preference
                    );
                }


                saveStorage(
                    "rideMatePreferences",
                    preferences
                );

                renderPreferences();
            }
        );
    });


    /* =====================================================
       STATISTICS
       ===================================================== */

    const statRides =
        document.getElementById("statRides");

    const statDistance =
        document.getElementById("statDistance");

    const statBudget =
        document.getElementById("statBudget");

    const statFavourite =
        document.getElementById("statFavourite");


    function renderStatistics() {

        const totalRides =
            trips.length;


        const totalDistance =
            trips.reduce(
                (total, trip) => {

                    return total +
                        Number(
                            trip.distance ||
                            trip.routeDistance ||
                            trip.km ||
                            0
                        );

                },
                0
            );


        const totalBudget =
            trips.reduce(
                (total, trip) => {

                    return total +
                        Number(
                            trip.budget ||
                            trip.totalBudget ||
                            0
                        );

                },
                0
            );


        if (statRides) {
            statRides.textContent =
                formatNumber(totalRides);
        }

        if (statDistance) {
            statDistance.textContent =
                `${formatNumber(
                    Math.round(totalDistance)
                )} km`;
        }

        if (statBudget) {
            statBudget.textContent =
                formatCurrency(totalBudget);
        }


        /* ---------------------------------------------
           Favourite destination
           --------------------------------------------- */

        if (statFavourite) {

            const destinations = {};

            trips.forEach(trip => {

                const destination =
                    trip.destination ||
                    trip.to;

                if (!destination) {
                    return;
                }

                const key =
                    destination.trim();

                destinations[key] =
                    (destinations[key] || 0) + 1;
            });


            let favourite = "—";
            let highest = 0;

            Object.keys(destinations)
                .forEach(destination => {

                    if (
                        destinations[destination] >
                        highest
                    ) {

                        highest =
                            destinations[destination];

                        favourite =
                            destination;
                    }
                });


            statFavourite.textContent =
                favourite;
        }


        /* ---------------------------------------------
           Journey progress
           --------------------------------------------- */

        const journeyProgress =
            document.getElementById(
                "journeyProgress"
            );

        const journeyPercent =
            document.getElementById(
                "journeyPercent"
            );


        const percentage =
            Math.min(
                100,
                totalRides * 10
            );


        if (journeyProgress) {
            journeyProgress.style.width =
                `${percentage}%`;
        }

        if (journeyPercent) {
            journeyPercent.textContent =
                `${percentage}%`;
        }
    }

    renderStatistics();


    /* =====================================================
       NOTIFICATION SETTING
       ===================================================== */

    const notificationsSetting =
        document.getElementById(
            "notificationsSetting"
        );

    const notificationToggle =
        document.getElementById(
            "notificationToggle"
        );


    let notifications =
        localStorage.getItem(
            "rideMateNotifications"
        );

    if (notifications === null) {
        notifications = true;
    } else {
        notifications =
            notifications === "true";
    }


    function renderNotifications() {

        if (notificationToggle) {

            notificationToggle.classList.toggle(
                "active",
                notifications
            );
        }
    }

    renderNotifications();


    if (notificationsSetting) {

        notificationsSetting.addEventListener(
            "click",
            () => {

                notifications =
                    !notifications;

                localStorage.setItem(
                    "rideMateNotifications",
                    notifications
                );

                renderNotifications();
            }
        );
    }


    /* =====================================================
       LOCATION SETTING
       ===================================================== */

    const locationSetting =
        document.getElementById(
            "locationSetting"
        );

    const locationToggle =
        document.getElementById(
            "locationToggle"
        );


    let locationEnabled =
        localStorage.getItem(
            "rideMateLocation"
        ) === "true";


    function renderLocation() {

        if (locationToggle) {

            locationToggle.classList.toggle(
                "active",
                locationEnabled
            );
        }
    }

    renderLocation();


    if (locationSetting) {

        locationSetting.addEventListener(
            "click",
            () => {

                if (!navigator.geolocation) {

                    alert(
                        "Location is not supported by this browser."
                    );

                    return;
                }


                if (locationEnabled) {

                    locationEnabled = false;

                    localStorage.setItem(
                        "rideMateLocation",
                        "false"
                    );

                    renderLocation();

                    return;
                }


                navigator.geolocation.getCurrentPosition(

                    position => {

                        locationEnabled = true;

                        localStorage.setItem(
                            "rideMateLocation",
                            "true"
                        );

                        localStorage.setItem(
                            "rideMateLatitude",
                            position.coords.latitude
                        );

                        localStorage.setItem(
                            "rideMateLongitude",
                            position.coords.longitude
                        );

                        renderLocation();
                    },

                    () => {

                        alert(
                            "Location permission was not granted."
                        );
                    }
                );
            }
        );
    }


    /* =====================================================
       CLEAR DATA
       ===================================================== */

    const clearData =
        document.getElementById(
            "clearData"
        );


    if (clearData) {

        clearData.addEventListener(
            "click",
            () => {

                const confirmed =
                    confirm(
                        "Clear RideMate data?\n\n" +
                        "This will remove saved trips, " +
                        "profile information, bike details " +
                        "and preferences from this browser."
                    );


                if (!confirmed) {
                    return;
                }


                const keysToRemove = [

                    "rideMateTrips",
                    "rideMateCurrentTrip",
                    "rideMateProfile",
                    "rideMateBike",
                    "rideMatePreferences",
                    "rideMateSelectedDestination",
                    "rideMateAIPlan"

                ];


                keysToRemove.forEach(
                    key =>
                        localStorage.removeItem(key)
                );


                window.location.reload();
            }
        );
    }


    /* =====================================================
       LOGOUT
       ===================================================== */

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            () => {

                const confirmed =
                    confirm(
                        "Log out of RideMate?"
                    );


                if (!confirmed) {
                    return;
                }


                localStorage.setItem(
                    "rideMateLoggedOut",
                    "true"
                );


                window.location.href =
                    "index.html";
            }
        );
    }


    /* =====================================================
       ENTRY ANIMATION
       ===================================================== */

    const cards =
        document.querySelectorAll(
            ".profile-card, .profile-bottom-cta"
        );


    cards.forEach(
        (card, index) => {

            card.style.opacity = "0";

            card.style.transform =
                "translateY(14px)";

            card.style.transition =
                `opacity .45s ease ${index * .05}s,
                 transform .45s ease ${index * .05}s`;


            requestAnimationFrame(() => {

                card.style.opacity = "1";

                card.style.transform =
                    "translateY(0)";
            });
        }
    );

});