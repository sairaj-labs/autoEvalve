from fastapi import APIRouter, HTTPException
from api.routes._store import RUN_STORE
from api.schemas import ReportResponse

router = APIRouter()


@router.get("/report/{run_id}")
def get_report(run_id: str):
    if run_id not in RUN_STORE:
        raise HTTPException(status_code=404, detail="Run ID not found")

    run = RUN_STORE[run_id]

    if run["status"] != "completed":
        return {
            "run_id": run_id,
            "status": run["status"],
        }

    data = run["report"]

    return {
        "run_id": run_id,
        "model_name": data["model"],
        "dataset": data["dataset"],
        "exact_match_accuracy": data["exact_match_accuracy"],
        "average_judge_score": data["avg_judge_score"],
        "judge_coverage": data["judge_coverage"],
        "model_failure_rate": data["model_failure_rate"],
        "high_disagreement_rate": data["high_disagreement_rate"],
    }
