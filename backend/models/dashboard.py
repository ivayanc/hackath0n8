from __future__ import annotations

from pydantic import BaseModel


class DayStatistic(BaseModel):
    day: str
    cnt: int


class DashboardDTO(BaseModel):
    new_cnt: int
    in_progress_cnt: int
    completed_cnt: int
    day_statistic: list[DayStatistic]
