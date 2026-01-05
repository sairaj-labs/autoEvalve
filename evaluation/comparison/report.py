from typing import Dict, Any


def build_comparison_report(
    diff: Dict[str, Any],
    regression: Dict[str, Any],
) -> Dict[str, Any]:
    """
    Final comparison report combining deltas and regression verdict.
    """

    return {
        "dataset": diff["dataset"],
        "baseline_model": diff["baseline_model"],
        "candidate_model": diff["candidate_model"],

        "metric_deltas": {
            "accuracy": diff["accuracy_delta"],
            "judge_score": diff["judge_score_delta"],
            "judge_coverage": diff["judge_coverage_delta"],
            "failure_rate": diff["failure_rate_delta"],
            "disagreement": diff["disagreement_delta"],
        },

        "regression_passed": regression["regression_passed"],
        "blocking_issues": regression["failures"],
    }
