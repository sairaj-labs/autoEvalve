from typing import List
from evaluation.runner import run_single_evaluation
from evaluation.results import EvalResult
from eval_datasets.schemas import EvalSample
from models.llm_clients.base import BaseLLM


def evaluate_dataset(
    samples: List[EvalSample],
    llm: BaseLLM,
    dataset_name: str,
    max_samples: int = None,
) -> List[EvalResult]:
    """
    Runs evaluation over a list of EvalSamples.
    """
    results: List[EvalResult] = []

    if max_samples:
        samples = samples[:max_samples]

    for sample in samples:
        result = run_single_evaluation(
            sample=sample,
            llm=llm,
            dataset_name=dataset_name,
        )
        results.append(result)

    return results
