from typing import Annotated

from fastapi import Path, Depends, HTTPException, status

from sqlalchemy.ext.asyncio import AsyncSession

from core.models import db_helper, NewTable

from . import habits_crud


async def habit_by_id(
        habit_id: Annotated[int, Path],
        session: AsyncSession = Depends(db_helper.scoped_session_dependency),
) -> NewTable:
    
    newtable = await habits_crud.get_habit(session=session, habit_id=habit_id)
    if newtable is not None:
        return newtable
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f'habit with id {habit_id} is not found'
    )
    
    




