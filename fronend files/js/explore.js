/* =========================================================
   RIDEMATE — EXPLORE PAGE
   Search + category filtering
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("destinationSearch");
    const searchButton = document.getElementById("searchButton");

    const categoryButtons = document.querySelectorAll(".category-btn");
    const destinationCards = document.querySelectorAll(".destination-card");

    const resultCount = document.getElementById("resultCount");
    const noResults = document.getElementById("noResults");
    const destinationGrid = document.getElementById("destinationGrid");

    let activeCategory = "all";
    let searchTerm = "";


    /* =====================================================
       FILTER DESTINATIONS
       ===================================================== */

    function filterDestinations() {

        let visibleCount = 0;

        destinationCards.forEach((card) => {

            const name =
                card.dataset.name?.toLowerCase() || "";

            const categories =
                card.dataset.category?.toLowerCase() || "";

            const description =
                card.querySelector("p")?.textContent.toLowerCase() || "";

            const matchesSearch =
                searchTerm === "" ||
                name.includes(searchTerm) ||
                categories.includes(searchTerm) ||
                description.includes(searchTerm);

            const matchesCategory =
                activeCategory === "all" ||
                categories.includes(activeCategory);

            if (matchesSearch && matchesCategory) {

                card.classList.remove("hidden");

                card.classList.remove("filter-in");

                /* Re-trigger animation */
                void card.offsetWidth;

                card.classList.add("filter-in");

                visibleCount++;

            } else {

                card.classList.add("hidden");
            }
        });


        /* =================================================
           RESULT COUNT
           ================================================= */

        if (resultCount) {

            resultCount.innerHTML =
                `<strong>${visibleCount}</strong> destination${visibleCount !== 1 ? "s" : ""} found`;
        }


        /* =================================================
           NO RESULTS
           ================================================= */

        if (noResults) {

            if (visibleCount === 0) {
                noResults.classList.add("show");
            } else {
                noResults.classList.remove("show");
            }
        }


        /* =================================================
           GRID VISIBILITY
           ================================================= */

        if (destinationGrid) {

            destinationGrid.style.display =
                visibleCount === 0 ? "none" : "grid";
        }
    }


    /* =====================================================
       CATEGORY BUTTONS
       ===================================================== */

    categoryButtons.forEach((button) => {

        button.addEventListener("click", () => {

            categoryButtons.forEach((btn) => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            activeCategory =
                button.dataset.category?.toLowerCase() || "all";

            filterDestinations();
        });
    });


    /* =====================================================
       SEARCH INPUT
       ===================================================== */

    if (searchInput) {

        searchInput.addEventListener("input", () => {

            searchTerm =
                searchInput.value.trim().toLowerCase();

            filterDestinations();
        });


        /* Enter key */

        searchInput.addEventListener("keydown", (event) => {

            if (event.key === "Enter") {

                event.preventDefault();

                searchTerm =
                    searchInput.value.trim().toLowerCase();

                filterDestinations();

                scrollToResults();
            }
        });
    }


    /* =====================================================
       SEARCH BUTTON
       ===================================================== */

    if (searchButton) {

        searchButton.addEventListener("click", () => {

            searchTerm =
                searchInput?.value.trim().toLowerCase() || "";

            filterDestinations();

            scrollToResults();
        });
    }


    /* =====================================================
       SCROLL TO RESULTS
       ===================================================== */

    function scrollToResults() {

        const resultsSection =
            document.querySelector(".explore-section");

        if (!resultsSection) {
            return;
        }

        setTimeout(() => {

            resultsSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 100);
    }


    /* =====================================================
       PLAN THIS RIDE LINKS
       ===================================================== */

    const planLinks =
        document.querySelectorAll(".plan-link");

    planLinks.forEach((link) => {

        link.addEventListener("click", () => {

            const destination =
                link.dataset.destination;

            if (destination) {

                localStorage.setItem(
                    "rideMateSelectedDestination",
                    destination
                );
            }
        });
    });


    /* =====================================================
       INITIAL FILTER
       ===================================================== */

    filterDestinations();

});