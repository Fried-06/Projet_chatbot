from fastapi import APIRouter, HTTPException, Depends
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.llm_services import generate_response  
from app.core.dependencies import get_current_user
from app.models.models import User
from app.bd.database import get_db
from sqlalchemy.orm import Session


router = APIRouter(prefix="/api")

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        response_text = generate_response(db, current_user, request.message)
        return ChatResponse(response=response_text)
    except Exception as e:
        print(f"ERREUR DETECTEE : {e}")
        raise HTTPException(status_code=500, detail=str(e))