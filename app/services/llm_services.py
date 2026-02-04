from app.memory.conversation import get_conversation, add_message
from app.core.config import GEMINI_API_KEY, GEMINI_MODEL
import google.generativeai as genai



genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel(GEMINI_MODEL)



def build_prompt(user_message: str):
    conversation = get_conversation()
    conversation.append({"role": "user", "content": user_message})
    
    prompt = ""
    for msg in conversation:
        prompt += f"{msg['role'].capitalize()}: {msg['content']}\n"

    return prompt


def call_gemini_api(user_message: str) -> str:
    prompt = build_prompt(user_message)
    
    response = model.generate_text(
        prompt=prompt,
        max_output_tokens=1000,
        temperature=0.7,
        top_p=0.9,
    )
    
    return response.text


def generate_response(user_message: str) -> str:
    add_message("user", user_message)
    
    response = call_gemini_api(user_message)
    
    add_message("assistant", response)
    
    return response