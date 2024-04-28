import asyncio
import logging

from celery import Celery
from celery.schedules import crontab

from database.base import session
from database.models.user import User

from bot.utils.send_notification_messages import send_in_progress_message, send_completed_message

app = Celery('tasks', broker='redis://redis:6379')
logger = logging.getLogger(__name__)


@app.task
def move_in_progress_task(request_id: int, volunteer: str):
    with session() as s:
        user = s.query(User).filter(User.request_id == request_id).first()
    if not user:
        return
    with session() as s:
        user.request_in_progress = True
        s.add(user)
        s.commit()
        s.refresh(user)
    coro = send_in_progress_message(user.telegram_id, volunteer)
    asyncio.run(coro)


@app.task
def completed_task(request_id: int):
    with session() as s:
        user = s.query(User).filter(User.request_id == request_id).first()
    if not user:
        return
    with session() as s:
        user.request_in_progress = False
        user.request_id = None
        user.request_sent = False
        s.add(user)
        s.commit()
        s.refresh(user)
    coro = send_completed_message(user.telegram_id)
    asyncio.run(coro)


app.conf.update(
    result_expires=3600,
)

if __name__ == '__main__':
    app.start()
