from app.memory.conversation import get_conversation, add_message
import google.generativeai as genai
from app.core.config import settings

# Configurer l'API
genai.configure(api_key=settings.GEMINI_API_KEY)

def generate_response(user_message: str) -> str:
    """Génère une réponse en utilisant l'historique de conversation"""
    try:
        # Ajouter le message utilisateur
        add_message("user", user_message)
        
        # Récupérer l'historique
        conversation = get_conversation()
        
        # Créer le modèle
        model = genai.GenerativeModel(settings.GEMINI_MODEL)
        
        # Convertir l'historique (exclure le dernier message car on va l'envoyer)
        history = []
        for msg in conversation[:-1]:
            role = "user" if msg["role"] == "user" else "model"
            history.append({
                "role": role,
                "parts": [msg["content"]]
            })
        
        # Créer une session de chat
        chat = model.start_chat(history=history)
        
        # Envoyer le message
        response = chat.send_message(
            user_message,
            generation_config=genai.types.GenerationConfig(
                max_output_tokens=1000,
                temperature=0.7,
                top_p=0.9,
            )
        )
        
        response_text = response.text
        
        # Sauvegarder la réponse
        add_message("assistant", response_text)
        
        return response_text
        
    except Exception as e:
        print(f"Erreur Gemini API: {e}")
        raise