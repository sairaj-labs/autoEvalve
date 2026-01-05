from typing import List, Dict, Any
import statistics

from evaluation.results import EvalResult


def aggregate_dataset_report(
    results: List[EvalResult],
    exact_match_scores: List[Dict[str, Any]],
    judge_agreements: List[Dict[str, Any]],
    dataset_name: str,
    model_name: str,
) -> Dict[str, Any]:
    """
    Aggregate dataset-level evaluation statistics.
    """

    num_samples = len(results)

    # -------------------------
    # Model failure rate
    # -------------------------
    model_failures = sum(1 for r in results if not r.success)
    model_failure_rate = round(model_failures / num_samples, 3) if num_samples else 0.0

    # -------------------------
    # Exact Match Accuracy
    # -------------------------
    exact_match_values = [
        m["exact_match"] for m in exact_match_scores if m["exact_match"] is not None
    ]
    exact_match_accuracy = (
        round(sum(exact_match_values) / len(exact_match_values), 3)
        if exact_match_values
        else None
    )

    # -------------------------
    # Judge statistics
    # -------------------------
    judge_scores = []
    judge_success_count = 0
    high_disagreement_count = 0

    for agreement in judge_agreements:
        if agreement.get("agreement_success"):
            judge_success_count += 1
            judge_scores.extend(agreement.get("scores", []))

            if agreement.get("high_disagreement"):
                high_disagreement_count += 1

    judge_coverage = (
        round(judge_success_count / num_samples, 3) if num_samples else 0.0
    )

    avg_judge_score = (
        round(statistics.mean(judge_scores), 2) if judge_scores else None
    )

    disagreement_rate = (
        round(high_disagreement_count / judge_success_count, 3)
        if judge_success_count
        else None
    )

    # -------------------------
    # Final Report
    # -------------------------
    return {
        "dataset": dataset_name,
        "model": model_name,
        "num_samples": num_samples,
        "model_failure_rate": model_failure_rate,
        "exact_match_accuracy": exact_match_accuracy,
        "avg_judge_score": avg_judge_score,
        "judge_coverage": judge_coverage,
        "high_disagreement_rate": disagreement_rate,
    }
