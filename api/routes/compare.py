from fastapi import APIRouter, HTTPException
from api.routes._store import RUN_STORE
from api.schemas import CompareRequest

from evaluation.comparison.diff import diff_reports
from evaluation.comparison.regression import check_regression
from evaluation.comparison.report import build_comparison_report

router = APIRouter()


@router.post("/compare")
def compare_runs(req: CompareRequest):
    if req.baseline_run_id not in RUN_STORE or req.candidate_run_id not in RUN_STORE:
        raise HTTPException(status_code=404, detail="Run ID not found")

    baseline = RUN_STORE[req.baseline_run_id]["report"]
    candidate = RUN_STORE[req.candidate_run_id]["report"]

    diff = diff_reports(baseline, candidate)
    regression = check_regression(
        diff,
        thresholds={
            "accuracy_drop": 0.03,
            "failure_rate_increase": 0.02,
        },
    )

    # Convert metric_deltas to frontend-friendly array
    metric_deltas = []
    for key, value in diff["metric_deltas"].items():
        if value is None:
            continue
        metric_deltas.append({
            "metric": key,
            "baseline": baseline.get(key),
            "candidate": candidate.get(key),
            "delta": value,
            "is_regression": value < 0,
            "is_blocking": key in regression["failures"],
        })

    return {
        "baseline_run_id": req.baseline_run_id,
        "candidate_run_id": req.candidate_run_id,
        "result": "PASS" if regression["regression_passed"] else "FAIL",
        "metric_deltas": metric_deltas,
        "blocking_issues": regression["failures"],
    }
