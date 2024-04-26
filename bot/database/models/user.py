from typing import Optional

import sqlalchemy as sa

from sqlalchemy.orm import relationship
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from database.base import Base

from bot.utils.constants import Gender


class User(Base):
    __tablename__ = 'users'
    telegram_id: Mapped[int] = mapped_column(sa.BigInteger(), primary_key=True)
    username: Mapped[Optional[str]]
    full_name: Mapped[Optional[str]]
    academic_group: Mapped[Optional[str]]
    instagram: Mapped[Optional[str]]
    is_banned: Mapped[bool] = mapped_column(default=False)
    is_admin: Mapped[bool] = mapped_column(default=False)
    gender: Mapped[Optional[Gender]]

    def __repr__(self):
        return f'< Username: {self.username}, Telegram Id: {self.telegram_id} >'
