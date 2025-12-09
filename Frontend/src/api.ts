// Frontend/src/api.ts
import axios from "axios";
import type { AnalyzeResponse } from "./types";

const API_BASE_URL = "http://localhost:8000";

export async function analyzeUrl(url: string): Promise<AnalyzeResponse> {
  const res = await axios.post<AnalyzeResponse>(`${API_BASE_URL}/analyze`, {
    url,
  });
  return res.data;
}
