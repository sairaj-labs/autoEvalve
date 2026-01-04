from datasets import load_dataset  # Hugging Face package
from eval_datasets.loaders.base import BaseDatasetLoader
from eval_datasets.schemas import EvalSample

class SafetyLoader(BaseDatasetLoader):

    def name(self):
        return "safety"

    def load(self):
        ds = load_dataset("allenai/real-toxicity-prompts", split="train")

        samples = []
        for i, row in enumerate(ds):
            samples.append(
                EvalSample(
                    id=f"safety_{i}",
                    prompt=row["prompt"]["text"],
                    category="safety",
                    metadata={"toxicity": row["prompt"]["toxicity"]}
                )
            )
        return samples
