import uuid
import time
from fastapi import APIRouter, BackgroundTasks
from api.schemas import EvaluateRequest
from api.routes._store import RUN_STORE

from eval_datasets.registry import load_dataset_by_name
from models.llm_clients.gemini import GeminiLLM
from evaluation.orchestrator import evaluate_dataset
from evaluation.metrics.exact_match import ExactMatchMetric
from evaluation.judges.llm_judge import LLMJudge
from evaluation.judges.agreement import JudgeAgreement
from evaluation.aggregation.report import aggregate_dataset_report

router = APIRouter()


def run_evaluation_background(run_id: str, dataset: str, model_name: str):
    print(f"[BG] START evaluation for {run_id}")

    try:
        print("[BG] Loading dataset...")
        samples = load_dataset_by_name(dataset)[:10]
        print(f"[BG] Loaded {len(samples)} samples")

        print("[BG] Initializing LLM...")
        llm = GeminiLLM()
        print("[BG] LLM initialized")

        print("[BG] Running model inference...")
        results = evaluate_dataset(
            samples=samples,
            llm=llm,
            dataset_name=dataset,
        )
        print(f"[BG] Model inference completed, got {len(results)} results")

        print("[BG] Computing exact match...")
        metric = ExactMatchMetric()
        exact_scores = [metric.compute(r) for r in results]
        print("[BG] Exact match computed")

        print("[BG] Initializing judges...")
        judges = [LLMJudge(GeminiLLM()) for _ in range(3)]
        agreement = JudgeAgreement(judges)
        print("[BG] Judges initialized")

        print("[BG] Running judge evaluations...")
        judge_agreements = [agreement.evaluate(r) for r in results]
        print("[BG] Judge evaluations completed")

        print("[BG] Aggregating report...")
        report = aggregate_dataset_report(
            results=results,
            exact_match_scores=exact_scores,
            judge_agreements=judge_agreements,
            dataset_name=dataset,
            model_name=model_name,
        )
        print("[BG] Report aggregated")

        RUN_STORE[run_id]["report"] = report
        RUN_STORE[run_id]["status"] = "completed"

        print(f"[BG] COMPLETED evaluation for {run_id}")

    except Exception as e:
        print(f"[BG] ERROR during evaluation: {e}")
        RUN_STORE[run_id]["status"] = "failed"
        RUN_STORE[run_id]["error"] = str(e)



@router.post("/evaluate")
def run_evaluation(req: EvaluateRequest, background_tasks: BackgroundTasks):
    run_id = f"eval-{uuid.uuid4().hex[:8]}"

    RUN_STORE[run_id] = {
        "status": "running",
        "dataset": req.dataset,
        "model": req.model_name,
        "created_at": time.time(),
    }

    background_tasks.add_task(
        run_evaluation_background,
        run_id,
        req.dataset,
        req.model_name,
    )

    return {
        "run_id": run_id,
        "status": "running",
        "message": "Evaluation started in background",
    }
