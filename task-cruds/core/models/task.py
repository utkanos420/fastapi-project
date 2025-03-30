from .base import Base

from sqlalchemy import Integer, Column, String
from sqlalchemy.orm import Mapped, mapped_column

target_metadata = Base.metadata


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    task_title: Mapped[str] = mapped_column(String(255), nullable=False)
    task_description: Mapped[str] = mapped_column(String(500), nullable=False)
    task_importance: Mapped[int] = mapped_column(Integer, nullable=False)
    task_created_date: Mapped[str] = mapped_column(String(50), nullable=False)
    task_created_until_date: Mapped[str] = mapped_column(String(50), nullable=False)
    task_color: Mapped[str] = mapped_column(String(7), nullable=False, default="#47F547", server_default="#47F547")
    is_completed: Mapped[int] = mapped_column(Integer, default=0)


class Habits(Base):
    __tablename__ = "habits"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    habit_title: Mapped[str] = mapped_column(String(255), nullable=False)
    habit_counter: Mapped[int] = mapped_column(Integer, nullable=False)
    habit_color: Mapped[str] = mapped_column(String(7), nullable=False, default="#47F547", server_default="#47F547")
    is_completed: Mapped[int] = mapped_column(Integer, default=0)
