from typing import List, Dict, Any
import statistics

from evaluation.results import EvalResult
from evaluation.judges.base import BaseJudge


class JudgeAgreement:
    """
    Runs multiple judges on the same EvalResult
    and computes agreement statistics.
    """

    def __init__(self, judges: List[BaseJudge]):
        if len(judges) < 2:
            raise ValueError("JudgeAgreement requires at least 2 judges.")
        self.judges = judges

    def evaluate(self, result: EvalResult) -> Dict[str, Any]:
        """
        Run all judges and compute agreement metrics.
        """

        scores = []
        explanations = []
        raw_judgments = []

        for judge in self.judges:
            judgment = judge.judge(result)
            raw_judgments.append({
                "judge": judge.name(),
                **judgment
            })

            score = judgment.get("judge_score")
            if isinstance(score, int):
                scores.append(score)

            explanations.append(judgment.get("judge_explanation"))

        # If no valid scores, return failure
        if not scores:
            return {
                "agreement_success": False,
                "reason": "No valid judge scores",
                "raw_judgments": raw_judgments
            }

        return {
            "agreement_success": True,
            "num_judges": len(self.judges),
            "scores": scores,
            "mean_score": round(statistics.mean(scores), 2),
            "median_score": statistics.median(scores),
            "std_dev": round(statistics.pstdev(scores), 2),
            "min_score": min(scores),
            "max_score": max(scores),
            "high_disagreement": self._is_high_disagreement(scores),
            "raw_judgments": raw_judgments
        }

    def _is_high_disagreement(self, scores: List[int]) -> bool:
        """
        Flags high disagreement when score spread is large.
        """
        return (max(scores) - min(scores)) >= 2
