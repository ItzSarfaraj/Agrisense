from fastapi import FastAPI, File, Form, HTTPException, UploadFile

from app.schemas import (
    ChatInput,
    RecommendationInsightsInput,
    WeatherAdvisoryInput,
)
from app.services.chatbot_service import generate_chat_response
from app.services.crop_doctor_service import generate_crop_doctor_analysis
from app.services.crop_doctor_translation_service import (
    translate_crop_doctor_analysis,
)
from app.services.crop_doctor_treatment_service import (
    generate_crop_doctor_treatment_report,
)
from app.services.recommendation_insights_service import (
    generate_recommendation_insights,
)
from app.services.weather_advisory_service import generate_weather_advisory


app = FastAPI(title="AgriSense GenAI API", version="1.0.0")


@app.get("/")
def root():
    return {"message": "AgriSense GenAI API Running"}


@app.post("/advisory/weather")
def weather_advisory(data: WeatherAdvisoryInput):
    try:
        weather = data.model_dump()
        advisory = generate_weather_advisory(weather)

        return {"advisory": advisory}

    except Exception as error:
        print(f"GenAI error: {error}")

        raise HTTPException(
            status_code=500,
            detail="Failed to generate weather advisory",
        )


@app.post("/insights/recommendations")
def recommendation_insights(data: RecommendationInsightsInput):
    try:
        request_data = data.model_dump()
        insights = generate_recommendation_insights(request_data)

        return insights

    except Exception as error:
        print(f"GenAI insights error: {error}")

        raise HTTPException(
            status_code=500,
            detail="Failed to generate recommendation insights",
        )


@app.post("/chat")
def chat(data: ChatInput):
    try:
        response = generate_chat_response(data.model_dump())

        return {
            "response": response,
        }

    except Exception as error:
        print(f"Chatbot error: {error}")

        raise HTTPException(
            status_code=500,
            detail="Failed to generate chatbot response",
        )


@app.post("/crop-doctor")
async def crop_doctor(
    images: list[UploadFile] = File(...),
    crop: str | None = Form(None),
    symptoms: str = Form(""),
    language: str = Form("English"),
    language_code: str = Form("en-IN"),
):
    try:
        if not images:
            raise HTTPException(
                status_code=400,
                detail="At least one image is required",
            )

        if len(images) > 5:
            raise HTTPException(
                status_code=400,
                detail="Maximum 5 images are allowed",
            )

        allowed_types = {
            "image/jpeg",
            "image/png",
            "image/webp",
        }

        image_data = []

        for image in images:
            if image.content_type not in allowed_types:
                raise HTTPException(
                    status_code=400,
                    detail="Only JPG, PNG and WebP are supported",
                )

            data = await image.read()

            if len(data) > 5 * 1024 * 1024:
                raise HTTPException(
                    status_code=400,
                    detail="Each image must be 5 MB or smaller",
                )

            image_data.append(
                {
                    "data": data,
                    "mime_type": image.content_type,
                }
            )

        total_size = sum(
            len(image["data"])
            for image in image_data
        )

        if total_size > 20 * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail="Total image size must be 20 MB or smaller",
            )

        analysis = generate_crop_doctor_analysis(
            images=image_data,
            crop=crop,
            symptoms=symptoms.strip(),
            language=language,
            language_code=language_code,
        )

        return {
            "analysis": analysis,
        }

    except HTTPException:
        raise

    except Exception as error:
        print(f"Crop Doctor error: {error}")

        raise HTTPException(
            status_code=500,
            detail="Failed to analyze crop images",
        )


@app.post("/crop-doctor/translate")
def crop_doctor_translate(data: dict):
    try:
        analysis = data.get("analysis")

        if not analysis:
            raise HTTPException(
                status_code=400,
                detail="Crop Doctor analysis is required",
            )

        language = data.get("language") or "English"
        language_code = data.get("language_code") or "en-IN"

        translated = translate_crop_doctor_analysis(
            analysis=analysis,
            language=language,
            language_code=language_code,
        )

        return {
            "analysis": translated,
        }

    except HTTPException:
        raise

    except Exception as error:
        print(f"Crop Doctor translation error: {error}")

        raise HTTPException(
            status_code=500,
            detail="Failed to translate Crop Doctor analysis",
        )


@app.post("/crop-doctor/treatment-report")
def crop_doctor_treatment_report(data: dict):
    try:
        analysis = data.get("analysis")

        if not analysis:
            raise HTTPException(
                status_code=400,
                detail="Crop Doctor analysis is required",
            )

        language = data.get("language") or "English"
        language_code = data.get("language_code") or "en-IN"
        crop = data.get("crop")
        symptoms = data.get("symptoms") or ""

        report = generate_crop_doctor_treatment_report(
            analysis=analysis,
            crop=crop,
            symptoms=symptoms,
            language=language,
            language_code=language_code,
        )

        return {
            "report": report,
        }

    except HTTPException:
        raise

    except Exception as error:
        print(
            f"Crop Doctor treatment report error: {error}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to generate treatment report",
        )