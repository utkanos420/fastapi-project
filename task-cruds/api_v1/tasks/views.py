from fastapi import APIRouter, HTTPException, status, Depends

import sqlalchemy as sa
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from core.models import db_helper
from . import crud
from .schemas import Task, TaskCreate, TaskUpdate, TaskUpdatePartial
from .dependencies import task_by_id


crud_router = APIRouter()


@crud_router.get("/", response_model=list[Task], tags=["tasks"])
async def get_tasks(session: AsyncSession = Depends(db_helper.session_dependency)):
    return await crud.get_tasks(session=session)


@crud_router.post("/", response_model=Task, tags=["tasks"])
async def create_task(task_in: TaskCreate,
                          session: AsyncSession = Depends(db_helper.session_dependency)):
    return await crud.create_task(session=session, task_in=task_in)


@crud_router.get("/{task_id}/", tags=["tasks"])
async def get_task(
    task: Task = Depends(task_by_id),

):
    return task


@crud_router.put("/{task_id}/", tags=["tasks"])
async def update_task(
    task_update: TaskUpdate,
    task: Task = Depends(task_by_id),
    session: AsyncSession = Depends(db_helper.scoped_session_dependency),

):
    return await crud.update_task(
        session=session,
        task=task,
        task_update=task_update,

    )


@crud_router.patch("/{task_id}/", tags=["tasks"])
async def update_task_partial(
    task_update: TaskUpdatePartial,
    task: Task = Depends(task_by_id),
    session: AsyncSession = Depends(db_helper.scoped_session_dependency),

):
    return await crud.update_task(
        session=session,
        task=task,
        task_update=task_update,
        partial=True
    )


@crud_router.delete("/{task_id}/", tags=["tasks"], status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    session: AsyncSession = Depends(db_helper.scoped_session_dependency),
    task: Task = Depends(task_by_id),

) -> None:
    await crud.delete_task(session=session, task_in=task)


async def get_task_count(session: AsyncSession):
    result = await session.execute(select(sa.func.count()).select_from(Task))
    count = result.scalar()
    return count
