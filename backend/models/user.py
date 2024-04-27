from __future__ import annotations

from pydantic import BaseModel


class CreateUser(BaseModel):
    email: str
    password: str
    full_name: str


class UserDetail(BaseModel):
    id: int
    email: str
    full_name: str


class LoginUser(BaseModel):
    email: str
    password: str
