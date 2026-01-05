# autoElave/models/llm_clients/gemini.py

import os
import time
from dotenv import load_dotenv
import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted
from .base import BaseLLM

# Load environment variables
load_dotenv()


class GeminiLLM(BaseLLM):
    """
    Gemini LLM client with quota-safe defaults, retry logic,
    and robust response text extraction.
    """

    def __init__(
        self,
        api_key: str = None,
        model: str = "models/gemini-flash-latest",
        max_retries: int = 3,
        retry_delay: float = 2.0,
    ):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")

        if not self.api_key:
            raise ValueError(
                "Gemini API key not provided. Set GEMINI_API_KEY in environment or .env file."
            )

        genai.configure(api_key=self.api_key)

        self.model_name = model
        self.model = genai.GenerativeModel(self.model_name)

        self.max_retries = max_retries
        self.retry_delay = retry_delay

    # -------------------------------
    # INTERNAL: Safe text extraction
    # -------------------------------
    def _extract_text(self, response) -> str:
        """
        Safely extract text from a Gemini response.

        Gemini may return:
        - response.text (happy path)
        - candidates[].content.parts[].text
        - or no text at all (safety / refusal)

        This method handles all cases.
        """

        # Case 1: Quick accessor works
        if hasattr(response, "text") and response.text:
            return response.text.strip()

        # Case 2: Walk candidates → content → parts
        if hasattr(response, "candidates"):
            for candidate in response.candidates:
                if hasattr(candidate, "content") and candidate.content:
                    for part in candidate.content.parts:
                        if hasattr(part, "text") and part.text:
                            return part.text.strip()

        # Case 3: No valid text returned
        raise ValueError(
            "Gemini returned no valid text content "
            "(possibly due to safety filtering or empty response)."
        )

    # -------------------------------
    # PUBLIC: Generate text
    # -------------------------------
    def generate(self, prompt: str, **kwargs) -> str:
        """
        Generate text from Gemini with retry on quota exhaustion.
        """
        for attempt in range(self.max_retries):
            try:
                response = self.model.generate_content(
                    prompt,
                    generation_config={
                        "temperature": kwargs.get("temperature", 0.7),
                        "max_output_tokens": kwargs.get("max_tokens", 256),
                    },
                )

                return self._extract_text(response)

            except ResourceExhausted as e:
                # Quota / rate limit hit
                if attempt == self.max_retries - 1:
                    raise e
                time.sleep(self.retry_delay)

            except Exception:
                # Let Phase-3 handle failures cleanly
                raise
