from __future__ import annotations

from pydantic import BaseModel

from database.models.request import Request

from utils.enums import RequestStatus


class CreateRequestDTO(BaseModel):
    type: str
    description: str
    full_name: str
    phone_number: str
    telegram_id: int
    secret_key: str


class ReadRequestDTO(BaseModel):
    id: int
    type: str
    description: str
    full_name: str
    phone_number: str
    status: RequestStatus

    @staticmethod
    def from_orm(instance: Request) -> ReadRequestDTO:
        return ReadRequestDTO(
            id=instance.id,
            type=instance.type,
            description=instance.description,
            full_name=instance.full_name,
            phone_number=instance.phone_number,
            status=instance.status
        )


class ReadRequestBotDTO(BaseModel):
    request_id: int
    secret_key: str
