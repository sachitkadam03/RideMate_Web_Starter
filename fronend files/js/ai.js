document.addEventListener("DOMContentLoaded", () => {

    const chatMessages = document.getElementById("chatMessages");
    const aiInput = document.getElementById("aiInput");
    const sendButton = document.getElementById("sendAiButton");
    const aiResult = document.getElementById("aiResult");

    const API_URL = "http://127.0.0.1:8000/api/ai/chat";

    // Keep the current conversation in the browser
    const conversationHistory = [];


    // ==========================================
    // HTML escape
    // ==========================================

    function escapeHTML(value) {

        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    // ==========================================
    // Add user message
    // ==========================================

    function addUserMessage(message) {

        if (!chatMessages) return;

        const messageElement = document.createElement("div");

        messageElement.className = "chat-message user";

        messageElement.innerHTML = `
            <div class="chat-message-content">
                ${escapeHTML(message).replace(/\n/g, "<br>")}
            </div>
        `;

        chatMessages.appendChild(messageElement);

        requestAnimationFrame(() => {
            chatMessages.scrollTo({
                top: chatMessages.scrollHeight,
                behavior: "smooth"
            });
        });
    }


    // ==========================================
    // Add AI message
    // ==========================================

    function addAIMessage(message) {

        if (!chatMessages) return;

        const messageElement = document.createElement("div");

        messageElement.className = "chat-message ai";

        messageElement.innerHTML = `
            <div class="chat-message-content">

                <div class="chat-ai-name">
                    RideMate AI
                </div>

                <div class="chat-ai-text">
                    ${escapeHTML(message).replace(/\n/g, "<br>")}
                </div>

            </div>
        `;

        chatMessages.appendChild(messageElement);

        requestAnimationFrame(() => {
            chatMessages.scrollTo({
                top: chatMessages.scrollHeight,
                behavior: "smooth"
            });
        });
    }


    // ==========================================
    // Loading / typing indicator
    // ==========================================

    function showLoading() {

        if (!chatMessages) return;

        const loading = document.createElement("div");

        loading.id = "aiLoading";
        loading.className = "chat-message ai";

        loading.innerHTML = `
            <div class="chat-message-content">

                <div class="chat-ai-name">
                    RideMate AI
                </div>

                <div class="typing-indicator">

                    <span></span>
                    <span></span>
                    <span></span>

                </div>

            </div>
        `;

        chatMessages.appendChild(loading);

        chatMessages.scrollTop =
            chatMessages.scrollHeight;
    }


    function hideLoading() {

        const loading =
            document.getElementById("aiLoading");

        if (loading) {
            loading.remove();
        }
    }


    // ==========================================
    // Parse structured AI response
    // ==========================================

    function parseAIResponse(response) {

        if (!response) {
            throw new Error("Empty AI response.");
        }

        let text = String(response)
            .trim()
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();


        try {

            const plan = JSON.parse(text);


            if (!plan || typeof plan !== "object") {

                throw new Error(
                    "AI response is not a valid plan object."
                );

            }


            return {

                title:
                    plan.title ||
                    "Your Ride Plan",

                route:
                    plan.route ||
                    "",

                duration:
                    plan.duration ||
                    "As requested",

                distance:
                    plan.distance ||
                    "Estimated",

                fuel:
                    plan.fuel ||
                    "Estimated",

                fuelCost:
                    plan.fuelCost ||
                    "Estimated",

                stay:
                    plan.stay ||
                    "Estimated",

                food:
                    plan.food ||
                    "Estimated",

                activities:
                    plan.activities ||
                    "Estimated",

                total:
                    plan.total ||
                    "Estimated",

                days:
                    Array.isArray(plan.days)
                        ? plan.days
                        : [],

                places:
                    Array.isArray(plan.places)
                        ? plan.places
                        : [],

                tips:
                    Array.isArray(plan.tips)
                        ? plan.tips
                        : []

            };

        }

        catch (error) {

            console.error(
                "AI JSON parsing error:",
                error
            );

            console.error(
                "AI response:",
                response
            );

            throw new Error(
                "RideMate AI returned an invalid trip plan."
            );
        }
    }


    // ==========================================
    // Render trip plan
    // ==========================================

    function renderTripPlan(plan) {

        if (!aiResult) return;


        // ==========================================
        // Remove duplicate days
        // ==========================================

        const uniqueDays = [];

        const seenDays =
            new Set();


        if (Array.isArray(plan.days)) {

            plan.days.forEach(day => {

                if (!day) return;


                const dayNumber =
                    String(
                        day.day || ""
                    )
                    .trim()
                    .toUpperCase();


                if (
                    !dayNumber ||
                    seenDays.has(dayNumber)
                ) {

                    return;

                }


                seenDays.add(dayNumber);

                uniqueDays.push(day);

            });
        }


        // ==========================================
        // Days HTML
        // ==========================================

        const daysHTML =
            uniqueDays.map(day => `

                <div class="ai-day-card">

                    <div class="ai-day-number">

                        ${escapeHTML(day.day)}

                    </div>


                    <div class="ai-day-content">

                        <h4>

                            ${escapeHTML(
                                day.title ||
                                "Ride Day"
                            )}

                        </h4>


                        <p>

                            ${escapeHTML(
                                day.description ||
                                "Explore the route and enjoy the ride."
                            )}

                        </p>

                    </div>

                </div>

            `).join("");


        // ==========================================
        // Places
        // ==========================================

        const placesHTML =
            Array.isArray(plan.places)

                ? plan.places.map(place => `

                    <span class="ai-place-tag">

                        ${escapeHTML(place)}

                    </span>

                `).join("")

                : "";


        // ==========================================
        // Tips
        // ==========================================

        const tipsHTML =
            Array.isArray(plan.tips)

                ? plan.tips.map(tip => `

                    <li>
                        ${escapeHTML(tip)}
                    </li>

                `).join("")

                : "";


        // ==========================================
        // Render complete plan
        // ==========================================

        aiResult.innerHTML = `

            <div class="ai-result-header">

                <div>

                    <span class="ai-result-label">
                        RIDEMATE AI PLAN
                    </span>


                    <h2>

                        ${escapeHTML(
                            plan.title ||
                            "Your Ride Plan"
                        )}

                    </h2>


                    <p class="ai-route">

                        ${escapeHTML(
                            plan.route || ""
                        )}

                    </p>

                </div>


                <div class="ai-result-status">

                    <span></span>

                    READY

                </div>

            </div>


            <!-- QUICK STATS -->

            <div class="ai-stats-grid">


                <div class="ai-stat">

                    <span>
                        Duration
                    </span>

                    <strong>
                        ${escapeHTML(
                            plan.duration
                        )}
                    </strong>

                </div>


                <div class="ai-stat">

                    <span>
                        Distance
                    </span>

                    <strong>
                        ${escapeHTML(
                            plan.distance
                        )}
                    </strong>

                </div>


                <div class="ai-stat">

                    <span>
                        Fuel
                    </span>

                    <strong>
                        ${escapeHTML(
                            plan.fuel
                        )}
                    </strong>

                </div>


                <div class="ai-stat">

                    <span>
                        Fuel Cost
                    </span>

                    <strong>
                        ${escapeHTML(
                            plan.fuelCost
                        )}
                    </strong>

                </div>

            </div>


            <!-- ITINERARY -->

            <div class="ai-section">

                <div class="ai-section-title">

                    <span>
                        01
                    </span>

                    ITINERARY

                </div>


                <div class="ai-days">

                    ${daysHTML}

                </div>

            </div>


            <!-- PLACES -->

            <div class="ai-section">

                <div class="ai-section-title">

                    <span>
                        02
                    </span>

                    PLACES TO VISIT

                </div>


                <div class="ai-place-list">

                    ${placesHTML}

                </div>

            </div>


            <!-- BUDGET -->

            <div class="ai-section">

                <div class="ai-section-title">

                    <span>
                        03
                    </span>

                    ESTIMATED BUDGET

                </div>


                <div class="ai-budget-grid">


                    <div>

                        <span>
                            Stay
                        </span>

                        <strong>
                            ${escapeHTML(
                                plan.stay
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Food
                        </span>

                        <strong>
                            ${escapeHTML(
                                plan.food
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Activities
                        </span>

                        <strong>
                            ${escapeHTML(
                                plan.activities
                            )}
                        </strong>

                    </div>


                    <div class="ai-total">

                        <span>
                            Estimated Total
                        </span>

                        <strong>
                            ${escapeHTML(
                                plan.total
                            )}
                        </strong>

                    </div>


                </div>

            </div>


            <!-- RIDING TIPS -->

            <div class="ai-section">

                <div class="ai-section-title">

                    <span>
                        04
                    </span>

                    RIDING TIPS

                </div>


                <ul class="ai-tips">

                    ${tipsHTML}

                </ul>

            </div>

        `;
    }


    // ==========================================
    // Send message
    // ==========================================

    async function sendMessage(message) {

        if (
            !message ||
            !message.trim()
        ) {

            return;

        }


        const cleanMessage =
            message.trim();


        // ==========================================
        // Show user message
        // ==========================================

        addUserMessage(
            cleanMessage
        );


        // ==========================================
        // Save conversation
        // ==========================================

        conversationHistory.push({

            role: "user",

            content:
                cleanMessage

        });


        // Clear input

        aiInput.value = "";


        // Disable button

        sendButton.disabled =
            true;

        sendButton.innerText =
            "Thinking...";


        // Show AI typing

        showLoading();


        try {


            // ==========================================
            // FastAPI request
            // ==========================================

            const response =
                await fetch(
                    API_URL,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                message:
                                    cleanMessage

                            })

                    }
                );


            // ==========================================
            // HTTP error
            // ==========================================

            if (!response.ok) {

                throw new Error(

                    `FastAPI returned ${response.status}`

                );

            }


            // ==========================================
            // Read response
            // ==========================================

            const data =
                await response.json();


            hideLoading();


            // ==========================================
            // Check success
            // ==========================================

            if (!data.success) {

                throw new Error(

                    data.message ||
                    "RideMate AI returned an unsuccessful response."

                );

            }


            // ==========================================
            // Get AI response
            // ==========================================

            const aiResponse =

                typeof data.response === "string"

                    ? data.response

                    : JSON.stringify(
                        data.response
                    );


            console.log(
                "RideMate AI response:",
                aiResponse
            );


            // ==========================================
            // Save AI response
            // ==========================================

            conversationHistory.push({

                role:
                    "assistant",

                content:
                    aiResponse

            });


            // ==========================================
            // Try to parse trip plan
            // ==========================================

            let plan = null;


            try {

                plan =
                    parseAIResponse(
                        aiResponse
                    );

            }

            catch (parseError) {

                console.log(
                    "Response is conversational text:",
                    parseError.message
                );

            }


            // ==========================================
            // Trip plan response
            // ==========================================

            if (
                plan &&
                plan.days &&
                plan.days.length > 0
            ) {


                addAIMessage(

                    "I've prepared the ride plan for you. You can ask me to change the route, budget, number of days, places, or riding style."

                );


                renderTripPlan(
                    plan
                );

            }


            // ==========================================
            // Normal AI conversation
            // ==========================================

            else {

                addAIMessage(
                    aiResponse
                );

            }


        }

        catch (error) {

            console.error(
                "RideMate AI Error:",
                error
            );


            hideLoading();


            addAIMessage(

                "I couldn't connect to RideMate AI right now. Please make sure FastAPI and Ollama are running."

            );

        }


        finally {

            sendButton.disabled =
                false;

            sendButton.innerText =
                "Send";


            aiInput.focus();

        }

    }


    // ==========================================
    // Send button
    // ==========================================

    if (sendButton) {

        sendButton.addEventListener(
            "click",
            () => {

                sendMessage(
                    aiInput.value
                );

            }
        );

    }


    // ==========================================
    // Enter key
    // ==========================================

    if (aiInput) {

        aiInput.addEventListener(
            "keydown",
            event => {

                if (

                    event.key === "Enter" &&

                    !event.shiftKey

                ) {

                    event.preventDefault();

                    sendMessage(
                        aiInput.value
                    );

                }

            }
        );

    }


    // ==========================================
    // New conversation
    // ==========================================

    function clearConversation() {

        conversationHistory.length =
            0;


        if (!chatMessages) {
            return;
        }


        chatMessages
            .querySelectorAll(
                ".chat-message.user, .chat-message.ai"
            )
            .forEach(
                message => message.remove()
            );


        addAIMessage(

            "Tell me where you want to ride. You can include your destination, number of days, budget and places you want to visit."

        );

    }


    // ==========================================
    // Double-click Ready = new conversation
    // ==========================================

    const aiStatus =
        document.querySelector(
            ".ai-status"
        );


    if (aiStatus) {

        aiStatus.title =
            "Double-click to start a new AI conversation";


        aiStatus.addEventListener(
            "dblclick",
            clearConversation
        );

    }


    // ==========================================
    // Quick prompts
    // ==========================================

    document
        .querySelectorAll(
            "[data-prompt]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const prompt =
                            button.getAttribute(
                                "data-prompt"
                            );


                        if (!prompt) {
                            return;
                        }


                        aiInput.value =
                            prompt;


                        sendMessage(
                            prompt
                        );

                    }
                );

            }
        );

});