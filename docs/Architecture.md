# The Big Skill Challenge - Architecture & Contracts

## Components

### 1. **Mobile App (React Native)**
- Sends registration and submission requests to the .NET API.
- Implements OTP Verification flow.

### 2. **Backend (.NET 9 Web API)**
- Implements Clean Architecture.
- Protects endpoints via JWT authentication.
- Main entry point for mobile app. Stores data in SQL Server using Entity Framework Core.

### 3. **AI Validator Service (Python FastAPI)**
- Decoupled from core business logic to allow scalable ML/AI processing.
- Handles rules related to syntax (25 words precisely) and complex heuristics (duplicate check via embeddings later).

## Communication Flow: Creative Entry
1. User submits text in React Native -> POST `/api/v1/entries` (.NET).
2. .NET API saves `Entry` with 'Pending Validation' status.
3. .NET API triggers an HTTP POST to `http://localhost:8000/api/v1/validate-entry` (Python Service).
4. Python Service validates word count exactly and checks for semantics/duplicates.
5. Python Service responds synchronously with `ValidationResult`.
6. .NET API creates `AIValidationResult` linked to the `Entry` in SQL Server and updates status.
7. Mobile app gets updated via Polling or WebSockets.

## API Contracts

### **.NET Registration (Auth)**
`POST /api/v1/Auth/register`
**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "jin@example.com",
  "phone": "+4412345678",
  "country": "UK",
  "password": "SecurePassword123!"
}
```

### **Python Validation Endpoint**
`POST /api/v1/validate-entry`
**Request:**
```json
{
  "entry_id": "00000000-0000-0000-0000-000000000000",
  "submission_text": "This is a creative entry containing precisely twenty five words for the competition testing validation logic..."
}
```
**Response:**
```json
{
  "entry_id": "00000000-0000-0000-0000-000000000000",
  "is_valid": true,
  "word_count": 25,
  "similarity_score": 0.05,
  "status_message": "Valid: Exactly 25 words."
}
```
