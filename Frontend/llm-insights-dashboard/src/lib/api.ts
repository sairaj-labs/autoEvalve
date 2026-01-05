import axios from "axios";

/**
 * Base URL for backend API
 * Uses VITE_API_BASE_URL if provided, otherwise defaults to local FastAPI
 */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
   REQUEST / RESPONSE TYPES
   ========================= */

export interface EvaluateRequest {
  dataset: string;
  model_name: string;
}

export interface EvaluateResponse {
  run_id: string;
  status: string;
  message?: string;
}

export interface ReportMetrics {
  run_id: string;
  model_name: string;
  dataset: string;
  exact_match_accuracy: number | null;
  average_judge_score: number | null;
  judge_coverage: number | null;
  model_failure_rate: number | null;
  high_disagreement_rate: number | null;
}

export interface CompareRequest {
  baseline_run_id: string;
  candidate_run_id: string;
}

export interface MetricDelta {
  metric: string;
  baseline: number | null;
  candidate: number | null;
  delta: number;
  is_regression: boolean;
  is_blocking: boolean;
}

export interface CompareResponse {
  baseline_run_id: string;
  candidate_run_id: string;
  result: "PASS" | "FAIL";
  metric_deltas: MetricDelta[];
  blocking_issues: string[];
}

/* =========================
   API METHODS
   ========================= */

export const api = {
  /**
   * Trigger a new evaluation run
   * POST /evaluate
   */
  evaluate: async (data: EvaluateRequest): Promise<EvaluateResponse> => {
    const response = await apiClient.post<EvaluateResponse>(
      "/evaluate",
      data
    );
    return response.data;
  },

  /**
   * Fetch aggregated report for a run
   * GET /report/{run_id}
   */
  getReport: async (runId: string): Promise<ReportMetrics> => {
    const response = await apiClient.get<ReportMetrics>(
      `/report/${runId}`
    );
    return response.data;
  },

  /**
   * Compare two evaluation runs
   * POST /compare
   */
  compare: async (
    data: CompareRequest
  ): Promise<CompareResponse> => {
    const response = await apiClient.post<CompareResponse>(
      "/compare",
      data
    );
    return response.data;
  },
};

export default api;
