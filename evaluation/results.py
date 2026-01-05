from dataclasses import dataclass
from typing import Optional, Dict, Any
import time

@dataclass
class EvalResult:
    """
    Represents the result of running ONE prompt on ONE model.
    """
    sample_id: str
    prompt: str
    model_output: str
    model_name: str
    dataset_name: str
    latency: float
    success: bool

    # NEW (Phase-4 Part-2)
    reference: Optional[str] = None

    error: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    timestamp: float = time.time()
