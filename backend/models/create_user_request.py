from pydantic import BaseModel


class CreateUserRequest(BaseModel):
    email: str
    password: str
    full_name: str
