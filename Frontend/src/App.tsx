// Frontend/src/App.tsx
import React, { useState } from "react";
import "./App.css";
import { analyzeUrl } from "./api";
import { WordCloud3D } from "./components/WordCloud3D";
import type { WordScore } from "./types";

const SAMPLE_URLS = [
  "https://www.bbc.com/news",
  "https://www.cnn.com",
  "https://www.nytimes.com/section/world",
];

function App() {
  const [url, setUrl] = useState<string>(SAMPLE_URLS[0]);
  const [words, setWords] = useState<WordScore[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await analyzeUrl(url);
      setWords(res.words);
    } catch (err: any) {
      console.error(err);
      setWords([]);
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Something went wrong. Please try another URL.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>3D News Topic Cloud</h1>
        <p>Paste a news article URL and explore its topics in 3D.</p>
      </header>

      <main className="app-main">
        <section className="controls">
          <form onSubmit={handleAnalyze} className="controls-form">
            <label>
              Article URL
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/news/article"
              />
            </label>

            <div className="sample-links">
              <span>Sample links: </span>
              {SAMPLE_URLS.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setUrl(s)}
                  className="sample-btn"
                >
                  {new URL(s).hostname}
                </button>
              ))}
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </form>

          {error && <p className="error">{error}</p>}
          {!error && !loading && words.length === 0 && (
            <p className="hint">
              Submit a URL to see a 3D word cloud of its key topics.
            </p>
          )}
        </section>

        <section className="visualization">
        {loading && (
          <div className="loading-overlay">Loading 3D word cloud...</div>
        )}

        {!loading && words.length === 0 && (
          <div style={{ color: "#7f8fa6", fontSize: "1.1rem" }}>
            Your 3D word cloud will appear here.
          </div>
        )}

        {words.length > 0 && <WordCloud3D words={words} />}
      </section>

      </main>
    </div>
  );
}

export default App;

