from abc import ABC, abstractmethod
from typing import Dict, Any
from evaluation.results import EvalResult


class BaseMetric(ABC):
    """
    Abstract base class for all evaluation metrics.
    """

    @abstractmethod
    def name(self) -> str:
        """
        Name of the metric.
        """
        pass

    @abstractmethod
    def compute(self, result: EvalResult) -> Dict[str, Any]:
        """
        Compute metric score for a single EvalResult.

        Returns a dictionary so metrics can return
        multiple values if needed.
        """
        pass
