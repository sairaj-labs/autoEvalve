from pydantic import BaseModel
from typing import Optional, Dict, Any


class EvaluateRequest(BaseModel):
    dataset: str
    model_name: str


class EvaluateResponse(BaseModel):
    run_id: str
    status: str


class ReportResponse(BaseModel):
    run_id: str
    report: Dict[str, Any]


class CompareRequest(BaseModel):
    baseline_run_id: str
    candidate_run_id: str
