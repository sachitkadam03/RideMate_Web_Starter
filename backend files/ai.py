import requests
import json
import re

OLLAMA_URL = "http://127.0.0.1:11434/api/chat"
MODEL = "qwen3:4b"


def clean_json_response(text):
    if not text:
        return None

    text = text.strip()

    # Remove thinking blocks if present
    text = re.sub(
        r"<think>.*?</think>",
        "",
        text,
        flags=re.DOTALL | re.IGNORECASE
    )

    # Handle escaped tags
    text = text.replace("\\u003c", "<")
    text = text.replace("\\u003e", ">")

    text = text.strip()

    # Try direct JSON
    try:
        return json.loads(text)
    except Exception:
        pass

    # Try extracting JSON object
    match = re.search(
        r"\{[\s\S]*\}",
        text
    )

    if match:
        try:
            return json.loads(match.group(0))
        except Exception:
            pass

    return None


def chat_with_ollama(message: str):

    system_prompt = """
You are RideMate AI, a professional motorcycle trip planning assistant for India.

Return ONLY valid JSON.

Do NOT return:
- reasoning
- thinking
- explanations
- markdown
- code fences
- comments
- duplicate itinerary days
- questions

Create a practical motorcycle trip plan based on the user's request.

The JSON must follow EXACTLY this structure:

{
  "title": "string",
  "route": "string",
  "duration": "string",
  "distance": "string",
  "fuel": "string",
  "fuelCost": "string",
  "stay": "string",
  "food": "string",
  "activities": "string",
  "total": "string",
  "days": [
    {
      "day": "DAY 1",
      "title": "string",
      "description": "string"
    }
  ],
  "places": [
    "string"
  ],
  "tips": [
    "string"
  ]
}

IMPORTANT RULES:

1. Return ONLY the JSON object.
2. No text before the JSON.
3. No text after the JSON.
4. Create exactly the number of itinerary days requested by the user.
5. Never repeat a day number.
6. Use realistic estimates.
7. Clearly use "Estimated" for uncertain costs.
8. Do not claim live hotel availability.
9. Do not claim live weather.
10. Do not claim live fuel prices.
11. Stay within the user's stated budget when possible.
12. If the requested trip is longer than necessary, use reasonable sightseeing/rest days.
13. Do not invent unnecessary reasoning.
14. Keep descriptions concise.
15. The "days" array must contain exactly one object for each day.

For example, for a 3-day trip:

"days": [
  {
    "day": "DAY 1",
    "title": "Ratnagiri to Satara",
    "description": "Ride to Satara with scenic stops and overnight stay."
  },
  {
    "day": "DAY 2",
    "title": "Satara to Pune",
    "description": "Ride towards Pune and explore nearby attractions."
  },
  {
    "day": "DAY 3",
    "title": "Pune to Mumbai",
    "description": "Ride to Mumbai and complete the trip."
  }
]

Do NOT create another DAY 1 after DAY 3.
"""

    payload = {
        "model": MODEL,
        "stream": False,
        "think": False,

        "format": {
            "type": "object",
            "properties": {
                "title": {
                    "type": "string"
                },
                "route": {
                    "type": "string"
                },
                "duration": {
                    "type": "string"
                },
                "distance": {
                    "type": "string"
                },
                "fuel": {
                    "type": "string"
                },
                "fuelCost": {
                    "type": "string"
                },
                "stay": {
                    "type": "string"
                },
                "food": {
                    "type": "string"
                },
                "activities": {
                    "type": "string"
                },
                "total": {
                    "type": "string"
                },
                "days": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "day": {
                                "type": "string"
                            },
                            "title": {
                                "type": "string"
                            },
                            "description": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "day",
                            "title",
                            "description"
                        ]
                    }
                },
                "places": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "tips": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            },
            "required": [
                "title",
                "route",
                "duration",
                "distance",
                "fuel",
                "fuelCost",
                "stay",
                "food",
                "activities",
                "total",
                "days",
                "places",
                "tips"
            ]
        },

        "messages": [
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": message
            }
        ],

        "options": {
            "temperature": 0.2,
            "num_predict": 1000,
            "num_ctx": 4096
        }
    }

    try:

        response = requests.post(
            OLLAMA_URL,
            json=payload,
            timeout=300
        )

        response.raise_for_status()

        data = response.json()

        content = data.get(
            "message",
            {}
        ).get(
            "content",
            ""
        )

        result = clean_json_response(content)

        if result is None:

            print("AI returned invalid JSON:")
            print(content)

            return json.dumps({
                "title": "RideMate AI Plan",
                "route": "",
                "duration": "",
                "distance": "Estimated",
                "fuel": "Estimated",
                "fuelCost": "Estimated",
                "stay": "Estimated",
                "food": "Estimated",
                "activities": "Estimated",
                "total": "Estimated",
                "days": [],
                "places": [],
                "tips": [
                    "Check your bike before starting.",
                    "Carry basic tools and documents.",
                    "Take regular breaks during long rides."
                ]
            })

        return json.dumps(result)

    except requests.exceptions.ConnectionError:

        return json.dumps({
            "error": "RideMate AI cannot connect to Ollama."
        })

    except requests.exceptions.Timeout:

        return json.dumps({
            "error": "RideMate AI took too long to respond."
        })

    except requests.exceptions.HTTPError as error:

        print("OLLAMA HTTP ERROR:", error)

        return json.dumps({
            "error": "Ollama returned an error."
        })

    except Exception as error:

        print("OLLAMA ERROR:", error)

        return json.dumps({
            "error": "RideMate AI encountered an unexpected error."
        })