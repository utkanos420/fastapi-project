from .base import Base

from sqlalchemy.orm import Mapped


class Product(Base):
    __tablename__ = "tasks"


    name: Mapped[str]
    description: Mapped[str]
    price: Mapped[int]

    task_title: Mapped[str]
    task_description: Mapped[str]
    task_importance: Mapped[int]
    task_created_date: Mapped[str]
    task_created_until_date: Mapped[str]
