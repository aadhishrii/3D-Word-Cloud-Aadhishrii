# 3D Word Cloud – Aadhishrii

This project visualizes topics from a news article as a 3D word cloud.
The frontend uses React, TypeScript, and React Three Fiber.
The backend uses FastAPI to fetch article text, extract keywords using TF-IDF, and return weighted words to the frontend.

## Project Structure
Backend/

  app/
  
    main.py
    fetcher.py
    nlp.py
    __init__.py
    
  requirements.txt

Frontend/

  src/
  
    App.tsx
    api.ts
    types.ts
    components/
    
      WordCloud3D.tsx
      
  package.json

setup_and_run.sh
README.md

## Running the Project

### Prerequisites

Python 3.9 or higher

Node.js 18 or higher

Bash shell (macOS, Linux, or Git Bash on Windows)

### One-Command Setup and Run

From the project root directory, run:

./setup_and_run.sh



This script will:

Create or activate a Python virtual environment in Backend/.venv.

Install all backend dependencies from requirements.txt.

Install all frontend dependencies using npm install.

Start both servers:

Backend: http://localhost:8000

Frontend: http://localhost:5173

Open http://localhost:5173
 in your browser to use the application.

## How It Works

### Backend (FastAPI) 

1. Fetches article HTML from a provided URL.

2. Extracts readable text using BeautifulSoup.

3. Cleans and preprocesses text.

4. Uses scikit-learn TF-IDF to extract important keywords.

5. Returns a JSON response of words with associated weights.



#### API endpoint:

POST /analyze
{
  "url": "<article_url>"
}


### Frontend (React + TypeScript)

1. Input field to enter a URL.

2. Sends the URL to the backend.

3. Receives keyword data.

4. Renders a 3D word cloud using React Three Fiber.

5. Word size and color are based on keyword weight.



## Libraries Used

Backend

fastapi

uvicorn

requests

beautifulsoup4

scikit-learn

nltk

Frontend

react

typescript

vite

three

@react-three/fiber

@react-three/drei

axios


## Notes

Some websites block automated scraping; in such cases, the backend returns a readable error message.

This project focuses on demonstrating the end-to-end flow from URL input to 3D visualization, not production-grade web crawling.
