# autoElave/models/llm_clients/base.py

from abc import ABC, abstractmethod
from typing import Any, Dict

class BaseLLM(ABC):
    """
    Abstract base class for LLM clients.
    All LLM implementations (Gemini, OpenAI, local) should inherit from this.
    """

    @abstractmethod
    def generate(self, prompt: str, **kwargs) -> str:
        """
        Generate a response for a given prompt.
        
        Args:
            prompt (str): Input text prompt
            kwargs: Optional LLM-specific parameters (temperature, max tokens, etc.)
        
        Returns:
            str: LLM-generated text
        """
        raise NotImplementedError

    def generate_with_metadata(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """
        Optional: Return additional metadata like latency, token usage, etc.
        """
        import time
        start_time = time.time()
        output = self.generate(prompt, **kwargs)
        latency = time.time() - start_time
        return {
            "output": output,
            "latency": latency
        }
