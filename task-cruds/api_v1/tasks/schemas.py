from pydantic import BaseModel, ConfigDict


class TaskBase(BaseModel):

    task_title: str
    task_description: str
    task_importance: int
    task_created_date: str
    task_created_until_date: str

    is_archived: int

class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskCreate):
    pass

class TaskUpdatePartial(TaskCreate):

    task_title: str | None = None
    task_description: str | None = None
    task_importance: int | None = None
    task_created_date: str | None = None
    task_created_until_date: str | None = None



class Task(TaskBase):
    model_config = ConfigDict(from_attributes=True)
    id: int