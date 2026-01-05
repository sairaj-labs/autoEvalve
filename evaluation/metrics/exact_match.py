import re
from typing import Dict, Any
from evaluation.metrics.base import BaseMetric
from evaluation.results import EvalResult


class ExactMatchMetric(BaseMetric):
    """
    Exact match metric for reasoning datasets like GSM8K.
    Compares final numeric answer only using the true reference.
    """

    def name(self) -> str:
        return "exact_match"

    def _extract_final_answer(self, text: str) -> str:
        """
        Extract the final numeric answer from text.
        Uses the last number as the final answer.
        """
        if not text:
            return ""

        numbers = re.findall(r"-?\d+\.?\d*", text)
        return numbers[-1] if numbers else ""

    def compute(self, result: EvalResult) -> Dict[str, Any]:
        """
        Compute exact match score (1 or 0) using the true gold reference.
        """

        # Case 1: Model failed OR no reference available
        if not result.success or not result.reference:
            return {
                "exact_match": 0,
                "predicted_answer": None,
                "gold_answer": None,
            }

        # Case 2: Model succeeded
        predicted = self._extract_final_answer(result.model_output)
        gold = self._extract_final_answer(result.reference)

        is_match = int(predicted == gold and predicted != "")

        return {
            "exact_match": is_match,
            "predicted_answer": predicted,
            "gold_answer": gold,
        }
