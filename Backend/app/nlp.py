# Backend/app/nlp.py
from typing import List, Dict
import re

from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.corpus import stopwords


BASIC_STOPWORDS = set(stopwords.words("english"))

CUSTOM_STOPWORDS = {
    "said", "would", "also", "could", "told", "says", "say", "mr",
    "mrs", "new", "one", "two", "three", "make", "made", "still",
    "last", "year", "years", "week", "weeks", "month", "months",
    "today", "tomorrow", "yesterday", "people",
}

EN_STOPWORDS = list(BASIC_STOPWORDS.union(CUSTOM_STOPWORDS))

def preprocess(text: str) -> str:
    # Lowercase
    text = text.lower()
    # Keep only letters and spaces
    text = re.sub(r"[^a-z\s]", " ", text)
    # Collapse spaces
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def extract_keywords(text: str, top_k: int = 50) -> List[Dict[str, float]]:
    """Return list of {word, weight} sorted by weight desc."""
    cleaned = preprocess(text)
    if not cleaned:
        return []

    # TF-IDF over one document still gives us term weights
    vectorizer = TfidfVectorizer(
        stop_words=EN_STOPWORDS,
        max_features=1000,
        ngram_range=(1, 1),
    )
    tfidf_matrix = vectorizer.fit_transform([cleaned])  # shape (1, vocab_size)
    scores = tfidf_matrix.toarray()[0]

    vocab = vectorizer.get_feature_names_out()
    word_scores = list(zip(vocab, scores))
    # Sort by score
    word_scores.sort(key=lambda x: x[1], reverse=True)

    # Take top_k
    top = word_scores[:top_k]

    # Normalize weights to 0–1 for visualization
    if not top:
        return []

    max_score = top[0][1] or 1.0
    result = [
        {"word": w, "weight": float(s / max_score)}
        for w, s in top
        if s > 0
    ]
    return result
