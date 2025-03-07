
from fastapi import APIRouter

from .tasks.views import crud_router
from .habits.habits_views import habits_router

router = APIRouter()
router.include_router(router=crud_router, prefix="/tasks")
router.include_router(router=habits_router, prefix="/habits", tags=["habits"])