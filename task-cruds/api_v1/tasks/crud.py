from sqlalchemy import select
from sqlalchemy.engine import Result
from sqlalchemy.ext.asyncio import AsyncSession

from core.models import Task

from .schemas import TaskCreate, TaskUpdate, TaskUpdatePartial


async def get_tasks(session: AsyncSession) -> list[Task]:
    stmt = select(Task).order_by(Task.id)
    result: Result = await session.execute(stmt)
    tasks = result.scalars().all()
    return list(tasks)

async def get_task(session: AsyncSession, task_id: int) -> Task | None:
    return await session.get(Task, task_id)

async def create_task(session: AsyncSession, task_in: TaskCreate) -> Task:
    task = Task(**task_in.model_dump())
    session.add(task)
    await session.commit()
    # await session.refresh(task)
    return task

async def update_task(
    session: AsyncSession,
    task: Task,
    task_update: TaskUpdate | TaskUpdatePartial,
    partial: bool = True,
) -> Task:
    for name, value in task_update.model_dump(exclude_unset=partial).items():
        setattr(task, name, value)
    await session.commit()
    return task

async def delete_task(session: AsyncSession, task_in: Task) -> None:
    await session.delete(task_in)
    await session.commit()