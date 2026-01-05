from typing import Dict, Any


def check_regression(
    diff: Dict[str, Any],
    thresholds: Dict[str, float],
) -> Dict[str, Any]:
    """
    Decide whether candidate model passes regression checks.
    """

    failures = []

    if diff["accuracy_delta"] is not None:
        if diff["accuracy_delta"] < -thresholds.get("accuracy_drop", 0.01):
            failures.append("accuracy_regression")

    if diff["judge_score_delta"] is not None:
        if diff["judge_score_delta"] < -thresholds.get("judge_score_drop", 0.2):
            failures.append("judge_score_regression")

    if diff["failure_rate_delta"] is not None:
        if diff["failure_rate_delta"] > thresholds.get("failure_rate_increase", 0.02):
            failures.append("model_failure_increase")

    return {
        "regression_passed": len(failures) == 0,
        "failures": failures,
    }
