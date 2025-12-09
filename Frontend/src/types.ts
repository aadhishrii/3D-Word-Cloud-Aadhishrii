// Frontend/src/types.ts
export interface WordScore {
  word: string;
  weight: number; // 0–1
}

export interface AnalyzeResponse {
  url: string;
  words: WordScore[];
}
