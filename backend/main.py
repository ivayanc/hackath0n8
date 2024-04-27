from fastapi import FastAPI, status, Depends, HTTPException
from database.models import user
from database.base import engine, Session
from typing import Annotated
from sqlalchemy.orm import Session
from models import auth
from models.auth import get_current_user

app = FastAPI()
app.include_router(auth.router)


user.Base.metadata.create_all(bind=engine)


def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@app.get("/")
async def root():
    return {"Root": "root"}


@app.get("/", status_code=status.HTTP_200_OK)
async def user(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication credentials were not provided")
    return {'User': user}