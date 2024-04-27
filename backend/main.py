import json

from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from configuration import SECRET_KEY

from models.user import UserDetail, CreateUser, LoginUser
from models.auth import Token

from database.base import session, Session
from database.models.request import Request
from database.models.user import User

from utils.database import get_db
from utils.auth import hash_pass, verify_password, create_access_token, create_refresh_token, get_current_user


app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post('/registration', status_code=status.HTTP_201_CREATED, response_model=UserDetail)
def create_users(user: CreateUser, db: Session = Depends(get_db)):
    hashed_pass = hash_pass(user.password)
    user.password = hashed_pass

    new_user = User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@app.post('/login', response_model=Token)
def login(request_user: LoginUser, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request_user.username).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail=F"User doesn't exist")
    if not verify_password(request_user.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='Wrong password')

    access_token = create_access_token(data={"user_id": user.id})
    refresh_token = create_refresh_token(data={"user_id": user.id})
    return {
        "access_token": access_token,
        "refresh_token": refresh_token
    }


@app.get('/me', response_model=UserDetail)
async def get_me(user: User = Depends(get_current_user)):
    return user
