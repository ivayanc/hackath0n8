from typing import Optional

from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    refresh_token: str


class DataToken(BaseModel):
    id: Optional[int] = None


class Refresh(BaseModel):
    token: str
