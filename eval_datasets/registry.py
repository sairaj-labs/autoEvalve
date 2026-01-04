from eval_datasets.loaders.gsm8k import GSM8KLoader
from eval_datasets.loaders.truthfulqa import TruthfulQALoader
from eval_datasets.loaders.safety import SafetyLoader

DATASET_REGISTRY = {
    "gsm8k": GSM8KLoader,
    "truthfulqa": TruthfulQALoader,
    "safety": SafetyLoader
}

def load_dataset_by_name(name: str):
    if name not in DATASET_REGISTRY:
        raise ValueError(f"Unknown dataset: {name}")
    return DATASET_REGISTRY[name]().load()
