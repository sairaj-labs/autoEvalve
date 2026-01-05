from abc import ABC, abstractmethod
from typing import Dict, Any
from evaluation.results import EvalResult


class BaseJudge(ABC):
    """
    Abstract base class for all judges.
    """

    @abstractmethod
    def name(self) -> str:
        """
        Name of the judge.
        """
        pass

    @abstractmethod
    def judge(self, result: EvalResult) -> Dict[str, Any]:
        """
        Judge a single EvalResult and return structured scores.
        """
        pass
