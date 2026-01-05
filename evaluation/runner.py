from typing import Optional
from evaluation.results import EvalResult
from eval_datasets.schemas import EvalSample
from models.llm_clients.base import BaseLLM


def run_single_evaluation(
    sample: EvalSample,
    llm: BaseLLM,
    dataset_name: str,
    model_name: Optional[str] = None,
) -> EvalResult:
    """
    Runs evaluation for a single EvalSample on a given LLM.
    """
    try:
        response = llm.generate_with_metadata(sample.prompt)

        return EvalResult(
            sample_id=sample.id,
            prompt=sample.prompt,
            model_output=response["output"],
            latency=response["latency"],
            model_name=model_name or llm.__class__.__name__,
            dataset_name=dataset_name,
            success=True,
            reference=sample.reference,   # 🔥 KEY LINE
            metadata=sample.metadata,
        )


    except Exception as e:
        return EvalResult(
            sample_id=sample.id,
            prompt=sample.prompt,
            model_output="",
            latency=0.0,
            model_name=model_name or llm.__class__.__name__,
            dataset_name=dataset_name,
            success=False,
            reference=sample.reference,
            error=str(e),
            metadata=sample.metadata,
        )

