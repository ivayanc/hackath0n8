from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.requests import router as requests_router
from routers.auth import router as auth_router

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

app.include_router(requests_router)
app.include_router(auth_router)
