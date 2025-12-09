import requests
from requests.exceptions import HTTPError, Timeout, RequestException
from bs4 import BeautifulSoup
import re

def fetch_article_text(url: str) -> str:
    try:
        resp = requests.get(
            url,
            timeout=10,
            headers={
                "User-Agent": "Mozilla/5.0 (compatible; 3DWordCloudBot/1.0)"
            }
        )
        resp.raise_for_status()

    except HTTPError as http_err:
        status = http_err.response.status_code

        if status in (401, 403):
            raise Exception(
                "This article cannot be accessed because the website blocks automated scraping "
                "(HTTP 401/403 Forbidden). Try a different link from BBC, CNN, or Reuters."
            )
        elif status == 404:
            raise Exception("The article could not be found (404 Not Found).")
        else:
            raise Exception(f"Website returned an error ({status}).")

    except Timeout:
        raise Exception("The request timed out. The website took too long to respond.")

    except RequestException:
        raise Exception("Could not connect to the website. Please check the URL and try again.")

    soup = BeautifulSoup(resp.text, "html.parser")
    texts = soup.find_all("p")
    paragraphs = [p.get_text(strip=True) for p in texts]
    text = " ".join(paragraphs)
    text = re.sub(r"\s+", " ", text)

    if len(text) < 100:
        raise Exception(
            "Unable to extract readable content from this article. "
            "Some sites restrict access or use complex layouts."
        )

    return text

