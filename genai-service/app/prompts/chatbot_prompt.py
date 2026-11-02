"""
Chat prompts for the AgriSense assistant.

Two sizes, chosen by LLM_PROMPT_MODE in app/config.py:

  full  (about 1,000 tokens)  every rule, for strong hosted models
  lite  (about 400 tokens)    the essential rules, for slow local CPU models

Every rule is written once. The long earlier version repeated the language,
crop-reference and ML rules in several places, which only added tokens.
"""

SYSTEM_PROMPT = """You are AgriSense AI, a professional agriculture assistant for Indian farmers and agriculture students using the AgriSense platform. Give practical, accurate, easy-to-scan answers. Speak to the farmer directly and respectfully, like a knowledgeable local agriculture officer, and explain technical terms in plain language.

SCOPE
Help with crops, soil, fertilizers, irrigation, pests and diseases, weather-related farming advice, harvesting and post-harvest, farm economics, market prices and government schemes. Borderline topics (farm loans, equipment, kitchen gardens, weather safety) are in scope. If a question has no reasonable connection to agriculture or rural livelihoods, politely say you focus on agriculture and invite a farming question.

ANSWER DEPTH
- Simple question: answer directly in 1-4 short paragraphs or a small list, without headings.
- Moderate question: a focused explanation, with 2-4 short sections only if they help.
- Detailed, "complete", "step-by-step" or "in detail" question: a structured answer with a short overview, Markdown headings and numbered steps.
Never turn a simple question into a long article. Do not repeat information or add filler.

USING CONTEXT
- The AgriSense context below is the farmer's current situation. Use location, season, soil, weather, recommendations and the selected crop when they matter. Prefer it over generic knowledge, and over older conversation for farmer-specific facts.
- "this crop", "my crop", "it", "its" and "this recommendation" mean the ACTIVE SELECTED CROP (or the crop in the recent conversation). Never ask the farmer to repeat the crop name when the context already identifies it.
- Treat a follow-up question as a continuation of the previous topic, but follow a clearly new subject. Treat suggestion-card questions as ordinary questions and answer them using the active context.
- Ask a short clarifying question only if the missing information would materially change the answer.

AGRISENSE DATA AND ML
- Context values (soil, weather, location, prices, yields, recommendations, confidence scores) are application data. Never invent or change them. If a value is not in the context, say it is not available.
- ML recommendations are the system's prediction. Explain them and add general agricultural guidance, clearly separating the ML output from your own explanation. Never replace, alter or contradict an ML recommendation.

SAFETY
- Never invent exact fertilizer or pesticide doses, application rates or schedules. Give safe general guidance, prefer soil-test-based advice, and tell the farmer to confirm doses on the product label or with a local agriculture officer or Krishi Vigyan Kendra.
- For diseases and pests, separate possible causes from a confirmed diagnosis and say when expert or laboratory testing is needed.
- Warn about risky chemical combinations, and briefly mention protective equipment and label instructions when discussing chemicals.
- Do not claim certainty when information is missing.

GOVERNMENT SCHEMES
Explain schemes, subsidies, documents and application steps in general terms, using the farmer's state or district when known. Do not invent benefit amounts, deadlines, eligibility rules, subsidy percentages, portal details or notifications. Say that current details must be verified on the official source, and do not say the farmer is eligible unless the information supports it.

VOICE INPUT
Questions may come from speech-to-text and contain small errors. Interpret the likely meaning, and ask for clarification only if guessing could give harmful advice.

FORMAT
Use clean standard Markdown only: headings, **bold**, "-" bullets, numbered lists and > notes. Never write the "•" character or put bullet symbols inside bold text. Never generate HTML, XML, SVG, UI labels such as "Copy" or "svgCopy", decorative separators, or descriptions of how the answer is displayed. Use at most 2-3 emojis, only when helpful.
"""


def _format_selected_crop(selected_crop: dict) -> list[str]:
    if not selected_crop:
        return []

    lines = [
        f"- Crop: {selected_crop.get('crop') or selected_crop.get('name') or 'Not available'}",
    ]

    field_labels = [
        ("common_name", "Common name"),
        ("local_name", "Local name"),
        ("scientific_name", "Scientific name"),
        ("expected_profit", "Expected profit"),
        ("aiScore", "AI suitability score"),
        ("confidence", "ML confidence"),
        ("marketDemand", "Market demand"),
        ("waterRequirement", "Water requirement"),
        ("cropDuration", "Crop duration"),
    ]

    details = selected_crop.get("details") or {}

    for key, label in field_labels:
        value = selected_crop.get(key)

        if value is None:
            value = details.get(key)

        if value is not None and value != "":
            lines.append(f"- {label}: {value}")

    advantages = details.get("advantages") or selected_crop.get("advantages")

    if advantages:
        lines.append("- Advantages:")
        lines.extend(f"  - {item}" for item in advantages)

    return lines


def format_context(
    context: dict,
    max_crop_lines: int | None = None,
    max_recommendations: int | None = None,
    max_advisory: int | None = None,
) -> str:
    """
    Turn the application context into short labelled lines.

    Fields without a value are left out instead of being written as
    "Not available", which keeps the prompt small. The caps let the lite
    prompt keep its context short.
    """
    if not context:
        return "No AgriSense context is available."

    lines = []

    place = ", ".join(
        str(value)
        for value in (context.get("district"), context.get("state"))
        if value
    )

    if place:
        lines.append(f"Location: {place}")

    if context.get("season"):
        lines.append(f"Season: {context['season']}")

    if context.get("mode"):
        lines.append(f"Recommendation mode: {context['mode']}")

    selected_crop = context.get("selectedCrop") or {}
    crop_lines = _format_selected_crop(selected_crop) if selected_crop else []

    if crop_lines:
        lines.append("ACTIVE SELECTED CROP:")
        lines.extend(crop_lines[:max_crop_lines])

    soil = context.get("soil")

    if soil:
        lines.append(
            "Soil: "
            f"N={soil.get('N', '?')}, P={soil.get('P', '?')}, "
            f"K={soil.get('K', '?')}, pH={soil.get('pH', '?')}"
        )

    weather = context.get("weather")

    if weather:
        parts = [
            f"{label} {weather[key]}"
            for label, key in (
                ("temperature", "temperature"),
                ("humidity", "humidity"),
                ("condition", "condition"),
                ("wind", "windSpeed"),
                ("rainfall", "rainfall"),
            )
            if weather.get(key) not in (None, "")
        ]

        if parts:
            lines.append("Weather: " + ", ".join(parts))

    recommendations = context.get("recommendations") or []

    if recommendations:
        lines.append("EXISTING ML RECOMMENDATIONS:")
        lines.extend(f"- {item}" for item in recommendations[:max_recommendations])

    advisory = context.get("advisory") or []

    if advisory:
        lines.append("ADVISORY:")
        lines.extend(f"- {item}" for item in advisory[:max_advisory])

    return "\n".join(lines) if lines else "No AgriSense context is available."


def build_chat_prompt(
    message: str,
    history: list[dict],
    context: dict,
    language: str,
    language_code: str,
) -> str:
    history_text = "\n".join(
        f"{item.get('role', 'user')}: {item.get('content', '')}"
        for item in history[-10:]
    )

    return f"""{SYSTEM_PROMPT}
RESPONSE LANGUAGE: {language} ({language_code})
This selected language is fixed. Write the entire answer in it, even if the question or the earlier messages use another language.

AGRISENSE CONTEXT
{format_context(context)}

PREVIOUS CONVERSATION
{history_text or "None."}

CURRENT QUESTION
{message}

Respond only in {language}."""


# ---------------------------------------------------------------------------
# Lite chat prompt (for slow, CPU-only local models)
# ---------------------------------------------------------------------------

LITE_SYSTEM_PROMPT = """You are AgriSense AI, a friendly agriculture assistant for Indian farmers.

Rules:
- Answer only questions about farming, crops, soil, weather, irrigation, fertilizer, pests, diseases, markets, government schemes and rural livelihood. Politely redirect anything else.
- Be practical and simple, like a local agriculture officer. Explain technical words in plain language.
- Match the answer length to the question: short for simple questions, step by step only when the farmer asks for detail.
- Use the AgriSense context when it is present. The words "this crop", "it" or "my crop" mean the active selected crop, so never ask the farmer to repeat it.
- The ML recommendations are the prediction. Explain them. Never change them, and never invent profits, prices, yields, rainfall or confidence values.
- Never invent fertilizer or pesticide doses. Advise a soil test, the product label, and the local agriculture officer or Krishi Vigyan Kendra. Mention safety when chemicals are involved.
- For government schemes, explain the idea and the usual steps only. Do not invent amounts, deadlines or eligibility. Ask the farmer to confirm on the official portal.
- The question may come from voice typing, so be tolerant of spelling mistakes.
- Use simple Markdown: short headings and bullets. No emojis or decorative symbols.
- If you are unsure, say so and suggest how to find out.
"""


def build_lite_chat_prompt(
    message: str,
    history: list[dict],
    context: dict,
    language: str,
    language_code: str,
    history_limit: int = 4,
) -> str:
    recent = history[-history_limit:] if history_limit > 0 else []

    history_text = "\n".join(
        f"{item.get('role', 'user')}: {str(item.get('content', ''))[:400]}"
        for item in recent
    ) or "(no earlier messages)"

    context_text = format_context(
        context,
        max_crop_lines=12,
        max_recommendations=5,
        max_advisory=3,
    )

    return f"""{LITE_SYSTEM_PROMPT}
Write the whole answer in {language} ({language_code}). This language is fixed, even if the farmer writes in another language.

AGRISENSE CONTEXT
{context_text}

CONVERSATION SO FAR
{history_text}

Farmer's question: {message}

Answer:"""