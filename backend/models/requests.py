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
    category: str
    description: str
    status: RequestStatus
    created_at: str

    @staticmethod
    def from_orm(instance: Request) -> ReadRequestDTO:
        created_at = instance.created_at.strftime('%d.%m.%Y %H:%M')

        return ReadRequestDTO(
            id=instance.id,
            category=instance.type,
            description=instance.description,
            status=instance.status,
            created_at=created_at
        )


class ReadMyRequestDTO(BaseModel):
    id: int
    category: str
    description: str
    full_name: str
    phone_number: str
    status: RequestStatus
    created_at: str

    @staticmethod
    def from_orm(instance: Request) -> ReadMyRequestDTO:
        created_at = instance.created_at.strftime('%d.%m.%Y %H:%M')

        return ReadMyRequestDTO(
            id=instance.id,
            category=instance.type,
            description=instance.description,
            full_name=instance.full_name,
            phone_number=instance.phone_number,
            status=instance.status,
            created_at=created_at
        )


class ReadRequestBotDTO(BaseModel):
    request_id: int
    secret_key: str
