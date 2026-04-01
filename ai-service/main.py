from fastapi import FastAPI
from api.routes import validation

app = FastAPI(
    title="The Big Skill Challenge - AI Validation Service",
    description="Microservice for validating 25-word creative entries and detecting fraud.",
    version="1.0.0"
)

app.include_router(validation.router, prefix="/api/v1")

@app.get("/health")
def health_check():
    return {"status": "ok"}
