import json

from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm

from configuration import SECRET_KEY

from models.requests import CreateRequestDTO, ReadRequestDTO
from models.user import UserDetail, CreateUser
from models.auth import Token

from database.base import session, Session
from database.models.request import Request
from database.models.user import User

from utils.database import get_db
from utils.auth import hash_pass, verify_password, create_access_token, create_refresh_token, get_current_user


app = FastAPI()


@app.post("/requests/create/", status_code=status.HTTP_201_CREATED)
async def create_request(request: CreateRequestDTO):
    if request.secret_key == SECRET_KEY:
        with session() as s:
            instance = Request(
                type=request.type,
                description=request.description,
                full_name=request.full_name,
                phone_number=request.phone_number,
                telegram_id=request.telegram_id
            )
            s.add(instance)
            s.commit()

        return JSONResponse({'id': instance.id}, status_code=status.HTTP_201_CREATED)
    else:
        raise HTTPException(status_code=400, detail="Wrong secret key")


@app.get('/request/{request_id}/', response_model=ReadRequestDTO)
async def get_request(request_id: int):
    with session() as s:
        instance = s.query(Request).filter(Request.id == request_id).first()
    if not instance:
        raise HTTPException(status_code=404)
    dto = ReadRequestDTO.from_orm(instance)
    return dto


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
def login(request_user: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
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
