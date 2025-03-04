
from fastapi import APIRouter

from .tasks.views import crud_router

router = APIRouter()
router.include_router(router=crud_router, prefix="/tasks")