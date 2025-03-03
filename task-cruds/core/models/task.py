from .base import Base

from sqlalchemy import Integer
from sqlalchemy.orm import Mapped, mapped_column


class Task(Base):
    __tablename__ = "tasks"


    task_title: Mapped[str]
    task_description: Mapped[str]
    task_importance: Mapped[int]
    task_created_date: Mapped[str]
    task_created_until_date: Mapped[str]

    is_archived: Mapped[int] = mapped_column(Integer, default=0)
