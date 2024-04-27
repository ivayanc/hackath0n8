from fastapi import APIRouter, Depends, status, HTTPException

from configuration import SECRET_KEY

from database.base import Session
from database.models.request import Request

from models.requests import CreateRequestDTO, ReadRequestDTO

from utils.database import get_db


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


@router.get('/{request_id}', response_model=ReadRequestDTO)
async def get_request(request_id: int, db: Session = Depends(get_db)):
    instance = db.query(Request).filter(Request.id == request_id).first()
    if not instance:
        raise HTTPException(status_code=404)
    dto = ReadRequestDTO.from_orm(instance)
    return dto
