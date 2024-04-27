from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def user():
    return {"User": "user"}
