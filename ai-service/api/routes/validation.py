from fastapi import APIRouter
from models.schemas import EntrySubmission, ValidationResult, SentimentRequest, SentimentResponse
from services.validator import validate_word_count, check_duplicate
from services.groq_service import get_sentiment_score

router = APIRouter()

@router.post("/validate-entry", response_model=ValidationResult)
async def validate_entry(submission: EntrySubmission):
    is_valid, word_count, message = validate_word_count(submission.submission_text)
    
    # If word count is valid, check for duplicates
    similarity = 0.0
    if is_valid:
        similarity = check_duplicate(submission.submission_text)
        if similarity > 0.85:
            is_valid = False
            message = "Invalid: High similarity to existing entry detected (Fraud prevention)."

    return ValidationResult(
        entry_id=submission.entry_id,
        is_valid=is_valid,
        word_count=word_count,
        similarity_score=similarity,
        status_message=message
    )

@router.post("/sentiment-score", response_model=SentimentResponse)
async def sentiment_score(request: SentimentRequest):
    score = await get_sentiment_score(request.text)
    return SentimentResponse(score=score)

