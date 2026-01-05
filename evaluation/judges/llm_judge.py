from typing import Dict, Any
import json
import re

from evaluation.judges.base import BaseJudge
from evaluation.results import EvalResult
from models.llm_clients.base import BaseLLM


class LLMJudge(BaseJudge):
    """
    Uses an LLM to judge the quality of another LLM's response.
    Designed to be robust to partial / malformed / filtered outputs.
    """

    def __init__(self, judge_llm: BaseLLM):
        """
        Args:
            judge_llm: An LLM instance used ONLY for judging
        """
        self.judge_llm = judge_llm

    def name(self) -> str:
        return "llm_judge"

    def _build_prompt(self, result: EvalResult) -> str:
        """
        Build a judging prompt for reasoning quality.
        NOTE: Prompt is intentionally relaxed (no strict JSON requirement)
        to reduce Gemini safety refusals.
        """
        return f"""
You are an impartial evaluator.

Question:
{result.prompt}

Ground Truth Answer:
{result.reference}

Model Answer:
{result.model_output}

Evaluate the model's answer based on:
1. Correctness
2. Reasoning quality
3. Clarity

Give a score from 1 to 5 and a short explanation.
You may respond in plain text or JSON.
""".strip()

    def judge(self, result: EvalResult) -> Dict[str, Any]:
        """
        Judge a single EvalResult using an LLM.
        """

        # Case 1: evaluated model failed → automatic judge failure
        if not result.success:
            return {
                "judge_score": 0,
                "judge_explanation": "Model failed to produce a valid response."
            }

        prompt = self._build_prompt(result)

        try:
            response = self.judge_llm.generate(prompt)
        except Exception as e:
            return {
                "judge_score": None,
                "judge_explanation": f"Judge failed: {str(e)}"
            }

        score = None
        explanation = None

        # -------- Attempt 1: strict JSON parsing --------
        try:
            parsed = json.loads(response)
            if "score" in parsed:
                score = int(parsed.get("score"))
            explanation = parsed.get("explanation")
        except Exception:
            pass  # fall through

        # -------- Attempt 2: regex score extraction --------
        if score is None:
            score_match = re.search(r"\b([1-5])\b", response)
            if score_match:
                score = int(score_match.group(1))

        # -------- Final fallback --------
        if explanation is None:
            explanation = response.strip()

        return {
            "judge_score": score,
            "judge_explanation": explanation
        }
