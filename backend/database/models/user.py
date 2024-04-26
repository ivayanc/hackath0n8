from typing import Optional

import sqlalchemy as sa

from sqlalchemy.orm import relationship
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from database.base import Base


class User(Base):
    __tablename__ = 'users'
    telegram_id: Mapped[int] = mapped_column(sa.BigInteger(), primary_key=True)
    full_name: Mapped[Optional[str]]
    phone_number: Mapped[Optional[str]]
    is_banned: Mapped[bool] = mapped_column(default=False)
    is_admin: Mapped[bool] = mapped_column(default=False)

    def __repr__(self):
        return f'< Username: {self.username}, Telegram Id: {self.telegram_id} >'
