from pydantic import BaseModel, Field, EmailStr


class ChatRequest(BaseModel):
    user_id: int
    message: str = Field(..., 
                         min_length=1,
                         max_length=3000,
                         description="The message sent by the user to the chatbot."
                        )


class ChatResponse(BaseModel):
    response: str   

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, description="The user's username, must be between 3 and 50 characters long.")
    nom : str = Field(..., min_length=1, max_length=100, description="The user's full name.")
    prenom : str = Field(..., min_length=1, max_length=100, description="The user's full name.")
    email: EmailStr
    password: str = Field(..., min_length=6, description="The user's password, must be at least 6 characters long.")

class UserLogin(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, description="The user's username, must be between 3 and 50 characters long.")
    password: str = Field(..., min_length=6, description="The user's password, must be at least 6 characters long.")


class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    nom : str
    prenom : str

    class Config:
        form_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str 