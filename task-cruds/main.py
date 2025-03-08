from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from starlette.requests import Request
from fastapi.staticfiles import StaticFiles

import uvicorn

import os

from core.config import settings
from core.models import Base, db_helper

from api_v1 import router as router_v1


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with db_helper.engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield


app = FastAPI(lifespan=lifespan)

base_dir = os.path.dirname(os.path.abspath(__file__))
templates_dir = os.path.join(base_dir, "web", "templates") 
static_dir = os.path.join(base_dir, "web", "static")

templates = Jinja2Templates(directory=templates_dir)

app.mount("/static", StaticFiles(directory=static_dir), name="static")

app.include_router(router_v1, prefix=settings.api_v1_prefix)


@app.get("/")
def hello_index():
    return {
        "message": "Nice to meet you! Make sure to move to /docs endpoint"
    }

@app.get("/lol", response_class=HTMLResponse)
async def get_tasks(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


if __name__ == "__main__":
    uvicorn.run(app=app, port=7761, log_level="debug")

