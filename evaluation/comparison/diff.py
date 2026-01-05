from typing import Dict, Any


def diff_reports(
    baseline: Dict[str, Any],
    candidate: Dict[str, Any],
) -> Dict[str, Any]:
    """
    Compute metric deltas between two aggregated reports.
    """

    def delta(key):
        if baseline.get(key) is None or candidate.get(key) is None:
            return None
        return round(candidate[key] - baseline[key], 4)

    return {
        "dataset": baseline["dataset"],
        "baseline_model": baseline["model"],
        "candidate_model": candidate["model"],

        "accuracy_delta": delta("exact_match_accuracy"),
        "judge_score_delta": delta("avg_judge_score"),
        "judge_coverage_delta": delta("judge_coverage"),
        "failure_rate_delta": delta("model_failure_rate"),
        "disagreement_delta": delta("high_disagreement_rate"),
    }
