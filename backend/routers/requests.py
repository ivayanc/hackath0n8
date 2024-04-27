from typing import Union

from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.responses import JSONResponse

from configuration import SECRET_KEY

from database.base import Session
from database.models.request import Request
from database.models.user import User

from models.requests import CreateRequestDTO, ReadRequestBotDTO, ReadRequestDTO

from utils.database import get_db
from utils.auth import get_current_user
from utils.enums import RequestStatus


router = APIRouter(
    prefix='/requests',
    tags=['requests']
)


@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_request(request: CreateRequestDTO, db: Session = Depends(get_db)):
    if request.secret_key == SECRET_KEY:
        instance = Request(
            type=request.type,
            description=request.description,
            full_name=request.full_name,
            phone_number=request.phone_number,
            telegram_id=request.telegram_id
        )
        db.add(instance)
        db.commit()
        db.refresh(instance)

        return JSONResponse({'id': instance.id}, status_code=status.HTTP_201_CREATED)
    else:
        raise HTTPException(status_code=400, detail="Wrong secret key")


@router.post('/bot/get_request', response_model=ReadRequestDTO)
async def bot_get(request: ReadRequestBotDTO, db: Session = Depends(get_db)):
    if request.secret_key == SECRET_KEY:
        instance = db.query(Request).filter(Request.id == request.request_id).first()
        if not instance:
            raise HTTPException(status_code=404)
        dto = ReadRequestDTO.from_orm(instance)
        return dto
    else:
        raise HTTPException(status_code=400, detail="Wrong secret key")


@router.get("/", response_model=list[ReadRequestDTO])
async def get(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    instances = db.query(Request).all()
    response = [ReadRequestDTO.from_orm(instance) for instance in instances]
    return response


@router.post("/{request_id}/take_in_progress", response_model=ReadRequestDTO)
async def take_in_progress(request_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    instance = db.query(Request).filter(
        Request.id == request_id,
        Request.status == RequestStatus.NEW.value
    ).first()
    if not instance:
        raise HTTPException(status_code=404)
    instance.volunteer_id = user.id
    instance.status = RequestStatus.IN_PROGRESS.value
    db.add(instance)
    db.commit()
    db.refresh(instance)
    return ReadRequestDTO.from_orm(instance)


@router.post("/{request_id}/complete", response_model=ReadRequestDTO)
async def complete(request_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    instance = db.query(Request).filter(
        Request.id == request_id,
        Request.volunteer_id == user.id,
        Request.status == RequestStatus.IN_PROGRESS.value
    ).first()
    if not instance:
        raise HTTPException(status_code=404)
    instance.volunteer_id = user.id
    instance.status = RequestStatus.COMPLETED.value
    db.add(instance)
    db.commit()
    db.refresh(instance)
    return ReadRequestDTO.from_orm(instance)


@router.get("/my", response_model=list[ReadRequestDTO])
async def get_my(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    instances = db.query(Request).filter(Request.volunteer_id == user.id).all()
    response = [ReadRequestDTO.from_orm(instance) for instance in instances]
    return response
