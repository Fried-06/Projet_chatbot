from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.models import Conversation


async def add_message(db: AsyncSession, user_id: int, role: str, content: str):
    message = Conversation(
        user_id=user_id,
        role=role,
        content=content
    )
    db.add(message)
    await db.commit()
    await db.refresh(message)
    return message


async def get_conversation(db: AsyncSession, user_id: int, limit: int = 10):
    result = await db.execute(
        select(Conversation)
        .filter(Conversation.user_id == user_id)
        .order_by(Conversation.id.desc())
        .limit(limit)
    )
    messages = result.scalars().all()
    return list(reversed(messages))  # Ordre chronologique


async def clear_conversation(db: AsyncSession, user_id: int):
    result = await db.execute(
        select(Conversation).filter(Conversation.user_id == user_id)
    )
    messages = result.scalars().all()
    for message in messages:
        await db.delete(message)
    await db.commit()