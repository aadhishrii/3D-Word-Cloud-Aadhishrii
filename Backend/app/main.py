# Backend/app/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from typing import List

from .fetcher import fetch_article_text
from .nlp import extract_keywords


class AnalyzeRequest(BaseModel):
    url: HttpUrl


class WordScore(BaseModel):
    word: str
    weight: float


class AnalyzeResponse(BaseModel):
    url: str
    words: List[WordScore]


app = FastAPI(title="3D Word Cloud API")

# CORS – adjust origin for frontend dev server port
origins = [
    "http://localhost:5173",  # Vite default
    "http://127.0.0.1:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest):
    try:
        text = fetch_article_text(str(request.url))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching article: {e}")

    if not text or len(text) < 200:
        raise HTTPException(status_code=422, detail="Article text is too short or empty")

    try:
        keywords = extract_keywords(text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing article: {e}")

    if not keywords:
        raise HTTPException(status_code=422, detail="Could not extract keywords")

    return AnalyzeResponse(url=str(request.url), words=keywords)
