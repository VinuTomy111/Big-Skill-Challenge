import os
import httpx
import logging
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

async def get_sentiment_score(text: str) -> int:
    if not GROQ_API_KEY:
        logger.error("GROQ_API_KEY environment variable is not set")
        return 0

    logger.info(f"API Key Loaded: {GROQ_API_KEY[:5]}****")
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    prompt = f"Analyze the following text and return ONLY a number between 0 and 10 based on tone, positivity, and impact. Do not include any explanation.\n\nText: {text}"

    data = {
        "model": "openai/gpt-oss-120b",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.0
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, json=data, timeout=10.0)
            response.raise_for_status()
            logger.info(f"STATUS CODE: {response.status_code}")
            response_data = response.json()
            logger.info(f"FULL RESPONSE: {response_data}")
            content = response_data['choices'][0]['message']['content'].strip()
            logger.info(f"AI RAW OUTPUT: {content}")
            
            # Parse strictly as integer
            score = int(content)
            
            # Ensure between 0 and 10
            if score < 0:
                return 0
            elif score > 10:
                return 10
                
            return score
            
    except httpx.HTTPStatusError as e:
        logger.error(f"Groq API Error: {e.response.text}")
        return 0
    except ValueError as e:
        logger.error(f"Failed to parse Groq response: {e}")
        return 0
    except Exception as e:
        logger.error(f"Unexpected error calling Groq: {e}")
        return 0
