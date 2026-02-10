from app.memory.conversation import get_conversation, add_message
from google import genai
from google.genai import types
from app.core.config import settings
from sqlalchemy.orm import Session

client = genai.Client(api_key=settings.GEMINI_API_KEY)

def generate_response(db: Session, user_id: int, user_message: str) -> str:
    try:
        add_message(db, user_id, "user", user_message)

        conversation = get_conversation(db, user_id)

        # Construire l'historique (sans le dernier message)
        history = []
        for msg in conversation[:-1]:
            role = "user" if msg.role == "user" else "model"
            history.append(
                types.Content(
                    role=role,
                    parts=[types.Part(text=msg.content)]
                )
            )

        # Créer le chat et envoyer le message
        chat = client.chats.create(
            model=settings.GEMINI_MODEL,
            history=history
        )

        response = chat.send_message(
            user_message,
            config=types.GenerateContentConfig(
                max_output_tokens=1000,
                temperature=0.7,
                top_p=0.9,
            )
        )

        response_text = response.text.strip()
        add_message(db, user_id, "assistant", response_text)
        return response_text

    except Exception as e:
        print(f"Erreur Gemini API: {e}")
        raise