# api.py

from fastapi import APIRouter, Body
from fastapi import Request
from core.utils import log
from backend.calc_points import calc_points
import json
from fastapi.responses import JSONResponse


router = APIRouter()

@router.get("/example")
def example():
    return {"json": "example"}

@router.post("/submit")
async def data(request: Request):
    data = await request.json()

    data = json.loads(data)

    if data["data"] == "distanced":
        points = calc_points(data)
        response_data = {"score": points}
        return JSONResponse(content=response_data)



    
    

