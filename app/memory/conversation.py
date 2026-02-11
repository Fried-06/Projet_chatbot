from sqlalchemy.orm import Session
from app.models.models import Conversation


def add_message(db: Session, user_id: int, role: str, content: str):
    message = Conversation(
        user_id=user_id,
        role=role,
        content=content
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return message

def get_conversation(db: Session, user_id: int, limit: int = 10):
    return (
        db.query(Conversation)
        .filter(Conversation.user_id == user_id)
        .order_by(Conversation.id.desc())
        .limit(limit)
        .all()[::-1]  # Remettre dans l'ordre chronologique
    )

def clear_conversation(db: Session, user_id: int):
    db.query(Conversation).filter(Conversation.user_id == user_id).delete()
    db.commit()