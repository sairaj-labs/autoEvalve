from eval_datasets.registry import load_dataset_by_name

def test_all_datasets():
    for name in ["gsm8k", "truthfulqa", "safety"]:
        samples = load_dataset_by_name(name)
        assert len(samples) > 0
        assert hasattr(samples[0], "prompt")
