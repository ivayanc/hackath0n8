from fastapi import APIRouter, status

from configuration import SECRET_KEY

from database.models.request import Request

from models.requests import CreateRequestDTO, ReadRequestDTO


router = APIRouter(
    prefix='/',
    tags=['requests']
)


@router.post("/requests/create/", status_code=status.HTTP_201_CREATED)
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


@router.get('/request/{request_id}/', response_model=ReadRequestDTO)
async def get_request(request_id: int):
    with session() as s:
        instance = s.query(Request).filter(Request.id == request_id).first()
    if not instance:
        raise HTTPException(status_code=404)
    dto = ReadRequestDTO.from_orm(instance)
    return dto
