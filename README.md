# 3D Word Cloud – Aadhishrii

Interactive 3D word cloud that visualizes key topics from a news article URL.

- **Frontend:** React + TypeScript + React Three Fiber (Three.js)
- **Backend:** FastAPI (Python) + simple TF-IDF keyword extraction

---

## Project Structure

```text
3D-Word-Cloud-Aadhishrii/
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
