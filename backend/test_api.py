from fastapi import FastAPI

app = FastAPI()

@app.get("/ping")
async def ping():
    return {"ping": "pong"}

@app.post("/api/echo")
async def echo(data: dict):
    return {"you_sent": data}
