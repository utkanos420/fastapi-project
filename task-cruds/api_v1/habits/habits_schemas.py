from pydantic import BaseModel, ConfigDict


class HabitBase(BaseModel):

    habit_title: str
    habit_counter: int
    habit_color: str
    is_archived: int


class HabitCreate(HabitBase):
    pass


class HabitUpdate(HabitCreate):
    pass


class HabitUpdatePartial(HabitCreate):

    habit_title: str | None = None
    habit_counter: int | None = None
    habit_color: str | None = None
    is_archived: int | None = None


class Habit(HabitBase):
    model_config = ConfigDict(from_attributes=True)
