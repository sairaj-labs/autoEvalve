from dataclasses import dataclass
from typing import Optional, Dict, Any

@dataclass
class EvalSample:
    id: str
    prompt: str
    reference: Optional[str] = None
    context: Optional[str] = None
    category: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
