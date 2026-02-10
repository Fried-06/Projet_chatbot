from app.memory.conversation import get_conversation, add_message
import google.generativeai as genai
from app.core.config import settings
from sqlalchemy.orm import Session


genai.configure(api_key=settings.GEMINI_API_KEY)

def generate_response(db: Session, user_id: int, user_message: str) -> str:
    add_message(db, user_id, "user", user_message)

    conversation_history = get_conversation(db, user_id)

    context = "\n".join([f"{msg.role}: {msg.content}" for msg in conversation_history])

    response = genai.generate(
        model=settings.GEMINI_MODEL,
        input=context,
        max_tokens=150,
        temperature=0.7,
    )

    response_text = response.text.strip()

    add_message(db, user_id, "assistant", response_text)

    return response_text