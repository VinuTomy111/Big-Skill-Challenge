from pydantic import BaseModel
from typing import Optional

class EntrySubmission(BaseModel):
    entry_id: str
    submission_text: str

class ValidationResult(BaseModel):
    entry_id: str
    is_valid: bool
    word_count: int
    similarity_score: float
    status_message: str
