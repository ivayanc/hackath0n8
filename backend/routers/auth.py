from fastapi import APIRouter, Depends, status, HTTPException

from models.user import UserDetail, CreateUser, LoginUser
from models.auth import Token, Refresh

from database.base import Session
from database.models.user import User

from utils.database import get_db
from utils.auth import hash_pass, verify_password, create_access_token, create_refresh_token, get_current_user, verify_refresh_token

router = APIRouter(
    prefix='/auth',
    tags=['auth']
)


@router.post('/registration/', status_code=status.HTTP_201_CREATED, response_model=UserDetail)
def create_users(user: CreateUser, db: Session = Depends(get_db)):
    hashed_pass = hash_pass(user.password)
    user.password = hashed_pass

    new_user = User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post('/login/', response_model=Token)
def login(request_user: LoginUser, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request_user.email).first()

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


@router.post('/refresh/', response_model=Token)
def refresh(refresh_request: Refresh, db: Session = Depends(get_db)):
    data_token = verify_refresh_token(
        refresh_request.token,
        HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Wrong refresh token'
        )
    )

    access_token = create_access_token(data={"user_id": data_token.id})
    refresh_token = create_refresh_token(data={"user_id": data_token.id})
    return {
        "access_token": access_token,
        "refresh_token": refresh_token
    }
