from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(..., 
                         min_length=1,
                         max_length=3000,
                         description="The message sent by the user to the chatbot."
                        )


class ChatResponse(BaseModel):
    response: str   