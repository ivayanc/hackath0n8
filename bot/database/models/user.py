from typing import Optional

import sqlalchemy as sa

from sqlalchemy.orm import relationship
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from database.base import Base


class User(Base):
    __tablename__ = 'telegram_users'
    telegram_id: Mapped[int] = mapped_column(sa.BigInteger(), primary_key=True)
    username: Mapped[Optional[str]]
    full_name: Mapped[Optional[str]]
    phone_number: Mapped[Optional[str]]
    request_sent: Mapped[bool] = mapped_column(sa.Boolean(), default=False)
    request_id: Mapped[Optional[int]]
    request_in_progress: Mapped[bool] = mapped_column(sa.Boolean(), default=False)

    def __repr__(self):
        return f'< Username: {self.username}, Telegram Id: {self.telegram_id} >'
