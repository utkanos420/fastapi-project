from .base import Base

from sqlalchemy import Integer, Column, String
from sqlalchemy.orm import Mapped, mapped_column


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)  
    task_title: Mapped[str] = mapped_column(String(255), nullable=False)
    task_description: Mapped[str] = mapped_column(String(500), nullable=True)
    task_importance: Mapped[int] = mapped_column(Integer, nullable=False)
    task_created_date: Mapped[str] = mapped_column(String(50), nullable=False)
    task_created_until_date: Mapped[str] = mapped_column(String(50), nullable=True)
    is_archived: Mapped[int] = mapped_column(Integer, default=0)