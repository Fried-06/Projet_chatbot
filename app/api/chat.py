from fastapi import APIRouter, HTTPException
from app.models.schema import ChatRequest, ChatResponse
from app.services.llm_services import generate_response  

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        response_text = generate_response(request.message)
        return ChatResponse(response=response_text)
    except Exception as e:
        print(f"ERREUR DETECTEE : {e}")
        raise HTTPException(status_code=500, detail=str(e))