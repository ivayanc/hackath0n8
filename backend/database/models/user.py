from typing import Optional

import sqlalchemy as sa

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from database.base import Base


class User(Base):
    __tablename__ = 'users'
    id: Mapped[int] = mapped_column(sa.BigInteger(), primary_key=True, autoincrement=True)
    email: Mapped[str]
    password: Mapped[str]
    full_name: Mapped[str]

    def __repr__(self):
        return f'User {self.full_name}'
