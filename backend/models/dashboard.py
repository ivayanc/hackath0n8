from __future__ import annotations

from pydantic import BaseModel


class DayStatistic(BaseModel):
    day: str
    cnt: int


class CategoryStatistic(BaseModel):
    category_name: str
    procent: int


class DashboardDTO(BaseModel):
    new_cnt: int
    in_progress_cnt: int
    completed_cnt: int
    total_cnt: int
    day_statistic: list[DayStatistic]
    category_statistic: list[CategoryStatistic]
