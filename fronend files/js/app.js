document.addEventListener("DOMContentLoaded", () => {

    const isLoggedIn =
        localStorage.getItem("rideMateLoggedIn") === "true";


    /* =====================================================
       HOME NAVIGATION
    ===================================================== */

    document
        .querySelectorAll('[data-nav="home"]')
        .forEach(link => {

            link.href = isLoggedIn
                ? "dashboard.html"
                : "index.html";

        });


    /* =====================================================
       RIDEMATE LOGO
    ===================================================== */

    const logo =
        document.querySelector(
            ".site-logo, .dashboard-logo, .planner-logo, .trip-logo, .ai-logo, .profile-logo, .explore-logo"
        );

    if (logo) {

        logo.style.cursor = "pointer";

        logo.addEventListener("click", (event) => {

            event.preventDefault();

            if (isLoggedIn) {

                window.location.href =
                    "dashboard.html";

            } else {

                window.location.href =
                    "index.html";

            }

        });

    }


    /* =====================================================
       ACTIVE NAVIGATION
    ===================================================== */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    document
        .querySelectorAll(".site-nav-links a[data-nav]")
        .forEach(link => {

            const navType =
                link.getAttribute("data-nav");

            const href =
                link.getAttribute("href");


            if (
                navType === "home" &&
                isLoggedIn
            ) {

                if (
                    currentPage ===
                    "dashboard.html"
                ) {

                    link.classList.add("active");

                }

                return;
            }


            if (
                href &&
                href.toLowerCase() === currentPage
            ) {

                link.classList.add("active");

            }

        });


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const menuButton =
        document.getElementById(
            "siteMenuButton"
        );

    const nav =
        document.querySelector(
            ".site-nav-links"
        );


    if (menuButton && nav) {

        menuButton.addEventListener(
            "click",
            () => {

                nav.classList.toggle(
                    "mobile-open"
                );

                menuButton.classList.toggle(
                    "active"
                );

            }
        );

    }


});