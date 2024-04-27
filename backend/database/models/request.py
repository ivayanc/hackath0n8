from typing import Optional
from datetime import datetime

import sqlalchemy as sa

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from database.base import Base


class Request(Base):
    __tablename__ = 'requests'
    id: Mapped[int] = mapped_column(sa.BigInteger(), primary_key=True, autoincrement=True)
    type: Mapped[str]
    description: Mapped[str]
    full_name: Mapped[str]
    phone_number: Mapped[str]
    telegram_id: Mapped[int] = mapped_column(sa.BigInteger())
    created_at: Mapped[datetime] = mapped_column(sa.DateTime(), default=datetime.utcnow)

    def __repr__(self):
        return f'Request {self.id}'
