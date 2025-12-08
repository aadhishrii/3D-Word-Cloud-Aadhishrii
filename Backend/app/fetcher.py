# Backend/app/fetcher.py
import re
from typing import Optional

import requests
from bs4 import BeautifulSoup


def fetch_article_text(url: str) -> str:
    """Fetches and returns main text from a news-like page.
    This is intentionally simple – good enough for demo.
    """
    resp = requests.get(url, timeout=10)
    resp.raise_for_status()

    soup = BeautifulSoup(resp.text, "html.parser")

    # Try <article> tag first
    article = soup.find("article")
    if article:
        texts = article.find_all("p")
    else:
        # Fallback: all <p> tags
        texts = soup.find_all("p")

    paragraphs = [p.get_text(separator=" ", strip=True) for p in texts]
    text = " ".join(paragraphs)

    # Basic cleanup
    text = re.sub(r"\s+", " ", text)
    return text.strip()
