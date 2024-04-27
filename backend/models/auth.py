from datetime import timedelta, datetime
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from starlette import status
from database.base import Session
from database.models.user import User
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from database.base import engine
from models.create_user_request import CreateUserRequest
from models.token import Token
from models.login_request import LoginRequest

from configuration import SECRET_KEY, ALGORITHM

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="auth/token")


def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency,
                      create_user_request: CreateUserRequest):
    create_user_model = User(
        email=create_user_request.email,
        password=bcrypt_context.hash(create_user_request.password),
        full_name=create_user_request.full_name
    )

    db.add(create_user_model)
    db.commit()


@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: Annotated[LoginRequest, Depends()],
                                 db: db_dependency):
    user = authenticate_user(form_data.email, form_data.password, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='Could not validate user.')
    token = create_access_token(user.email, user.id, timedelta(days=31))
    #refresh_token = create_refresh_token(user.email, user.id, timedelta(days=365), db)

    return {'access_token': token, 'token_type': 'bearer'}  # , 'refresh_token': refresh_token


# @router.post("/refresh-token", response_model=Token)
# async def refresh_access_token(refresh_token: str, db: db_dependency):
#     user = verify_refresh_token(refresh_token, db)
#     if not user:
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
#                             detail='Invalid refresh token.')
#
#     # Generate new access token
#     access_token = create_access_token(user.email, user.id, timedelta(days=31))
#     return {'access_token': access_token, 'token_type': 'bearer'}


def authenticate_user(email: str, password: str, db):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return False
    if not bcrypt_context.verify(password, user.password):
        return False
    return user


# def verify_refresh_token(refresh_token: str, db: Session):
#     user = db.query(User).filter(User.refresh_token == refresh_token).first()
#     if not user:
#         return None
#
#     if user.refresh_token_expires_at < datetime.utcnow():
#         return None
#
#     return user


def create_access_token(email: str, user_id: int, expires_delta: timedelta):
    encode = {'sub': email, 'id': user_id}
    expires = datetime.utcnow() + expires_delta
    encode.update({'exp': expires})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)


# def create_refresh_token(email: str, user_id: int, expires_delta: timedelta, db) -> str:
#     encode = {'sub': email, 'id': user_id}
#     expires = datetime.utcnow() + expires_delta
#     encode.update({'exp': expires})
#     refresh_token = jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)
#     user = db.query(User).filter(User.email == email, User.id == user_id).first()
#     if user:
#         user.refresh_token = refresh_token
#         user.refresh_token_expires_at = expires
#         db.commit()
#
#     return refresh_token


async def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get('sub')
        user_id: int = payload.get('id')
        if email is None or user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail="Could not validate user.")
        return {'email': email, 'id': user_id}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='Could not validate user.')
