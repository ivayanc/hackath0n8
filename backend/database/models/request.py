from typing import Optional
from datetime import datetime

import sqlalchemy as sa

from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.base import Base
from database.models.user import User

from utils.enums import RequestStatus


class Request(Base):
    __tablename__ = 'requests'
    id: Mapped[int] = mapped_column(sa.BigInteger(), primary_key=True, autoincrement=True)
    type: Mapped[str]
    description: Mapped[str]
    full_name: Mapped[str]
    phone_number: Mapped[str]
    telegram_id: Mapped[int] = mapped_column(sa.BigInteger())
    volunteer_id: Mapped[Optional[int]] = mapped_column(sa.ForeignKey("users.id"))
    volunteer = relationship("User")
    status: Mapped[RequestStatus] = mapped_column(sa.String(), default=RequestStatus.NEW.value)
    created_at: Mapped[datetime] = mapped_column(sa.DateTime(), default=datetime.utcnow)

    def __repr__(self):
        return f'Request {self.id}'
