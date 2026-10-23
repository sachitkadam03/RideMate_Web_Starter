document.addEventListener("DOMContentLoaded", () => {

    const API_BASE = "http://127.0.0.1:8000";


    // =========================================================
    // PASSWORD SHOW / HIDE
    // =========================================================

    document.querySelectorAll(".password-toggle").forEach(button => {

        button.addEventListener("click", () => {

            const targetId = button.getAttribute("data-target");
            const input = document.getElementById(targetId);

            if (!input) return;

            if (input.type === "password") {
                input.type = "text";
                button.textContent = "HIDE";
            } else {
                input.type = "password";
                button.textContent = "SHOW";
            }

        });

    });


    // =========================================================
    // REGISTER
    // =========================================================

    const registerForm = document.getElementById("registerForm");

    if (registerForm) {

        registerForm.addEventListener("submit", async (event) => {

            event.preventDefault();

            clearErrors();

            const name = document
                .getElementById("registerName")
                .value
                .trim();

            const email = document
                .getElementById("registerEmail")
                .value
                .trim()
                .toLowerCase();

            const phone = document
                .getElementById("registerPhone")
                .value
                .trim();

            const password = document
                .getElementById("registerPassword")
                .value;

            const confirmPassword = document
                .getElementById("confirmPassword")
                .value;

            const terms = document
                .getElementById("termsCheckbox")
                .checked;


            let valid = true;


            // -------------------------------------------------
            // NAME
            // -------------------------------------------------

            if (!name) {

                showError(
                    "nameError",
                    "Please enter your full name."
                );

                valid = false;

            } else if (name.length < 2) {

                showError(
                    "nameError",
                    "Name must contain at least 2 characters."
                );

                valid = false;
            }


            // -------------------------------------------------
            // EMAIL
            // -------------------------------------------------

            if (!email) {

                showError(
                    "emailError",
                    "Please enter your email address."
                );

                valid = false;

            } else if (!isValidEmail(email)) {

                showError(
                    "emailError",
                    "Please enter a valid email address."
                );

                valid = false;
            }


            // -------------------------------------------------
            // PHONE
            // -------------------------------------------------

            if (phone) {

                const phonePattern =
                    /^[0-9+\-\s()]{7,20}$/;

                if (!phonePattern.test(phone)) {

                    showError(
                        "phoneError",
                        "Please enter a valid phone number."
                    );

                    valid = false;
                }
            }


            // -------------------------------------------------
            // PASSWORD
            // -------------------------------------------------

            if (!password) {

                showError(
                    "passwordError",
                    "Please create a password."
                );

                valid = false;

            } else if (password.length < 6) {

                showError(
                    "passwordError",
                    "Password must contain at least 6 characters."
                );

                valid = false;

            } else if (
                new TextEncoder()
                    .encode(password)
                    .length > 72
            ) {

                showError(
                    "passwordError",
                    "Password must be 72 bytes or less."
                );

                valid = false;
            }


            // -------------------------------------------------
            // CONFIRM PASSWORD
            // -------------------------------------------------

            if (!confirmPassword) {

                showError(
                    "confirmPasswordError",
                    "Please confirm your password."
                );

                valid = false;

            } else if (password !== confirmPassword) {

                showError(
                    "confirmPasswordError",
                    "Passwords do not match."
                );

                valid = false;
            }


            // -------------------------------------------------
            // TERMS
            // -------------------------------------------------

            if (!terms) {

                showError(
                    "termsError",
                    "Please accept the Terms of Use and Privacy Policy."
                );

                valid = false;
            }


            if (!valid) {
                return;
            }


            // -------------------------------------------------
            // REGISTER BUTTON
            // -------------------------------------------------

            const button =
                document.getElementById("registerButton");

            const originalHTML =
                button.innerHTML;

            button.disabled = true;

            button.innerHTML = `
                <span>CREATING ACCOUNT...</span>
                <strong>•</strong>
            `;


            try {

                // =================================================
                // SEND REGISTER REQUEST TO FASTAPI
                // =================================================

                const response = await fetch(
                    `${API_BASE}/api/auth/register`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            name: name,
                            email: email,
                            phone: phone || null,
                            password: password
                        })
                    }
                );


                const data = await response.json();


                console.log(
                    "REGISTER RESPONSE:",
                    data
                );


                // -------------------------------------------------
                // REGISTRATION FAILED
                // -------------------------------------------------

                if (!response.ok || !data.success) {

                    showError(
                        "emailError",
                        data.message ||
                        "Registration failed."
                    );

                    return;
                }


                // -------------------------------------------------
                // REGISTRATION SUCCESS
                // -------------------------------------------------

                alert(
                    "Account created successfully. Please login."
                );


                // IMPORTANT:
                // Do NOT save password.
                // Do NOT create rideMateUsers.
                // Do NOT automatically login.

                window.location.replace("login.html");


            } catch (error) {

                console.error(
                    "REGISTER ERROR:",
                    error
                );


                showError(
                    "emailError",
                    "Cannot connect to RideMate server. Make sure FastAPI is running."
                );


            } finally {

                button.disabled = false;
                button.innerHTML = originalHTML;

            }

        });

    }


    // =========================================================
    // LOGIN
    // =========================================================

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {

        loginForm.addEventListener("submit", async (event) => {

            // VERY IMPORTANT
            // Prevent normal HTML GET submission.
            event.preventDefault();

            clearErrors();


            const email = document
                .getElementById("loginEmail")
                .value
                .trim()
                .toLowerCase();

            const password = document
                .getElementById("loginPassword")
                .value;


            let valid = true;


            // -------------------------------------------------
            // EMAIL
            // -------------------------------------------------

            if (!email) {

                showError(
                    "loginEmailError",
                    "Please enter your email address."
                );

                valid = false;

            } else if (!isValidEmail(email)) {

                showError(
                    "loginEmailError",
                    "Please enter a valid email address."
                );

                valid = false;
            }


            // -------------------------------------------------
            // PASSWORD
            // -------------------------------------------------

            if (!password) {

                showError(
                    "loginPasswordError",
                    "Please enter your password."
                );

                valid = false;
            }


            if (!valid) {
                return;
            }


            // -------------------------------------------------
            // LOGIN BUTTON
            // -------------------------------------------------

            const button =
                document.getElementById("loginButton");

            const originalHTML =
                button.innerHTML;

            button.disabled = true;

            button.innerHTML = `
                <span>LOGGING IN...</span>
                <span class="submit-arrow">•</span>
            `;


            try {

                // =================================================
                // SEND LOGIN REQUEST TO FASTAPI
                // =================================================

                const response = await fetch(
                    `${API_BASE}/api/auth/login`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            email: email,
                            password: password
                        })
                    }
                );


                const data = await response.json();


                console.log(
                    "LOGIN RESPONSE:",
                    data
                );


                // -------------------------------------------------
                // LOGIN FAILED
                // -------------------------------------------------

                if (!response.ok || !data.success) {

                    showError(
                        "loginPasswordError",
                        data.message ||
                        "Invalid email or password."
                    );

                    return;
                }


                // =================================================
                // LOGIN SUCCESS
                // =================================================

                console.log(
                    "LOGIN SUCCESS:",
                    data.user
                );


                // -------------------------------------------------
                // SAVE JWT
                // -------------------------------------------------

                localStorage.setItem(
                    "rideMateToken",
                    data.token
                );


                // -------------------------------------------------
                // SAVE LOGIN STATUS
                // -------------------------------------------------

                localStorage.setItem(
                    "rideMateLoggedIn",
                    "true"
                );


                // -------------------------------------------------
                // SAVE CURRENT DATABASE USER
                // -------------------------------------------------

                localStorage.setItem(
                    "rideMateCurrentUser",
                    JSON.stringify(data.user)
                );


                // -------------------------------------------------
                // SAVE PROFILE
                // -------------------------------------------------

                localStorage.setItem(
                    "rideMateProfile",
                    JSON.stringify({
                        id: data.user.id,
                        name: data.user.name,
                        email: data.user.email,
                        phone: data.user.phone || ""
                    })
                );


                // -------------------------------------------------
                // LOGIN SUCCESS UI
                // -------------------------------------------------

                button.innerHTML = `
                    <span>WELCOME BACK ✓</span>
                    <span class="submit-arrow">→</span>
                `;


                // -------------------------------------------------
                // GO TO DASHBOARD
                // -------------------------------------------------

                setTimeout(() => {

                    window.location.replace(
                        "dashboard.html"
                    );

                }, 500);


            } catch (error) {

                console.error(
                    "LOGIN ERROR:",
                    error
                );


                showError(
                    "loginPasswordError",
                    "Cannot connect to RideMate server. Make sure FastAPI is running."
                );


            } finally {

                setTimeout(() => {

                    button.disabled = false;

                    if (
                        !button.innerHTML.includes(
                            "WELCOME BACK"
                        )
                    ) {
                        button.innerHTML =
                            originalHTML;
                    }

                }, 600);

            }

        });

    }


    // =========================================================
    // FORGOT PASSWORD
    // =========================================================

    const forgotPassword =
        document.getElementById("forgotPassword");

    if (forgotPassword) {

        forgotPassword.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                alert(
                    "Forgot password functionality will be added later."
                );

            }
        );

    }


    // =========================================================
    // HELPER FUNCTIONS
    // =========================================================

    function isValidEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email);

    }


    function showError(elementId, message) {

        const element =
            document.getElementById(elementId);

        if (!element) return;

        element.textContent = message;

        element.classList.add("show");

    }


    function clearErrors() {

        document
            .querySelectorAll(".field-error")
            .forEach(element => {

                element.textContent = "";

                element.classList.remove("show");

            });

    }

});