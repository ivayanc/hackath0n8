import json

from fastapi import FastAPI, HTTPException, status
from fastapi.responses import JSONResponse

from configuration import SECRET_KEY

from models.requests import RequestDTO

from database.base import session
from database.models.request import Request

app = FastAPI()


@app.post("/requests/create/", status_code=status.HTTP_201_CREATED)
async def create_request(request: RequestDTO):
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
