import sqlalchemy as sq

from typing import Union

from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, status, HTTPException

from database.base import Session
from database.models.request import Request
from database.models.user import User

from models.dashboard import DashboardDTO, DayStatistic

from utils.database import get_db
from utils.auth import get_current_user
from utils.enums import RequestStatus


router = APIRouter(
    prefix='/dashboard',
    tags=['dashboard']
)


@router.get("/", response_model=DashboardDTO)
async def dashboard_main(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    day_statistic = []
    for day in range(6, -1, -1):
        start_date = datetime.now() - timedelta(days=day)
        day_statistic.append({
            'day': start_date.strftime('%d.%m.%Y'),
            'cnt': len(db.query(Request).filter(sq.func.DATE(Request.created_at) == start_date.date()).all())
        })

    return DashboardDTO(
        new_cnt=len(db.query(Request).filter(Request.status == RequestStatus.NEW.value).all()),
        in_progress_cnt=len(db.query(Request).filter(Request.status == RequestStatus.IN_PROGRESS.value,
                                                 Request.volunteer_id == user.id).all()),
        completed_cnt=len(db.query(Request).filter(Request.status == RequestStatus.COMPLETED.value,
                                                 Request.volunteer_id == user.id).all()),
        day_statistic=[DayStatistic(**statistic) for statistic in day_statistic]
    )
