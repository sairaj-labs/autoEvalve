from abc import ABC, abstractmethod
from typing import List
from eval_datasets.schemas import EvalSample

class BaseDatasetLoader(ABC):

    @abstractmethod
    def load(self) -> List[EvalSample]:
        pass

    @abstractmethod
    def name(self) -> str:
        pass
