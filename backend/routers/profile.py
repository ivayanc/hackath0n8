from fastapi import APIRouter, Depends, status, HTTPException

from database.models.user import User

from models.user import UserDetail

from utils.auth import get_current_user

router = APIRouter(
    prefix='/profile',
    tags=['profile']
)


@router.get('/', response_model=UserDetail)
def profile(user: User = Depends(get_current_user)):
    return user
