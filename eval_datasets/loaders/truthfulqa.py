from datasets import load_dataset  # Hugging Face package
from eval_datasets.loaders.base import BaseDatasetLoader
from eval_datasets.schemas import EvalSample

class TruthfulQALoader(BaseDatasetLoader):

    def name(self):
        return "truthfulqa"

    def load(self):
        ds = load_dataset("truthful_qa", "generation", split="validation")

        samples = []
        for i, row in enumerate(ds):
            samples.append(
                EvalSample(
                    id=f"truthfulqa_{i}",
                    prompt=row["question"],
                    reference=row["best_answer"],
                    category="hallucination",
                    metadata={"incorrect_answers": row["incorrect_answers"]}
                )
            )
        return samples
