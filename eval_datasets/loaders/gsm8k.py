from datasets import load_dataset  # huggingface
from eval_datasets.loaders.base import BaseDatasetLoader
from eval_datasets.schemas import EvalSample

class GSM8KLoader(BaseDatasetLoader):

    def name(self):
        return "gsm8k"

    def load(self):
        ds = load_dataset("gsm8k", "main", split="test")

        samples = []
        for i, row in enumerate(ds):
            samples.append(
                EvalSample(
                    id=f"gsm8k_{i}",
                    prompt=row["question"],
                    reference=row["answer"],
                    category="reasoning",
                    metadata={"dataset": "gsm8k"}
                )
            )
        return samples

