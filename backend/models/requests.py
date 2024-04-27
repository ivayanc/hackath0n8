from pydantic import BaseModel


class RequestDTO(BaseModel):
    type: str
    description: str
    full_name: str
    phone_number: str
    telegram_id: int
    secret_key: str
