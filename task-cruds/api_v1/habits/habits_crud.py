from sqlalchemy import select
from sqlalchemy.engine import Result
from sqlalchemy.ext.asyncio import AsyncSession

from core.models import NewTable

from .habits_schemas import HabitCreate, HabitUpdate, HabitUpdatePartial

async def get_habits(session: AsyncSession) -> NewTable:
    stmt = select(NewTable).order_by(NewTable.id)
    result: Result = await session.execute(stmt)
    habits = result.scalars().all()
    return list(habits)

async def get_habit(session: AsyncSession, habit_id: int) -> NewTable | None:
    return await session.get(NewTable, habit_id)


async def create_habit(session: AsyncSession, habit_in: HabitCreate) -> NewTable:
    habit = NewTable(**habit_in.model_dump())
    session.add(habit)
    await session.commit()
    await session.refresh(habit)
    return habit


async def update_habit(session: AsyncSession, habit: NewTable, habit_update: HabitUpdate, partial: bool = True) -> NewTable:
    for name, value in habit_update.model_dump(exclude_unset=partial).items():
        setattr(habit, name, value)

    print(f'Updating habit {habit.id} with {habit_update}')
    session.add(habit)
    await session.commit()
    await session.refresh(habit)

    return habit

async def delete_habit(session: AsyncSession, habit_in: NewTable) -> None:
    await session.delete(habit_in)
    await session.commit()