from fastapi import APIRouter, HTTPException, status, Depends

import sqlalchemy as sa
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from core.models import db_helper
from . import habits_crud
from .habits_schemas import Habit, HabitCreate, HabitUpdate, HabitUpdatePartial
from .habits_dependencies import habit_by_id


habits_router = APIRouter()

@habits_router.get("/", response_model=list[Habit])
async def get_habits(session: AsyncSession = Depends(db_helper.session_dependency)):
    return await habits_crud.get_habits(session=session)

@habits_router.post("/", response_model=list[Habit])
async def create_habit(habit_in: HabitCreate, session: AsyncSession = Depends(db_helper.session_dependency)):
    habit = await habits_crud.create_habit(session=session, habit_in=habit_in)
    return [habit]

