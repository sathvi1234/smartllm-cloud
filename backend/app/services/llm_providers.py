import asyncio
import time
from typing import Optional, Dict, Any
from abc import ABC, abstractmethod
from app.config import settings

# Provider imports
import openai
import google.generativeai as genai
from groq import Groq
import httpx


class LLMProvider(ABC):
    """Base class for LLM providers"""
    
    def __init__(self):
        self.model_name = None
        self.cost_per_1k_input = 0.0
        self.cost_per_1k_output = 0.0
    
    @abstractmethod
    async def generate(self, 
                      system_prompt: Optional[str],
                      user_prompt: str,
                      temperature: float = 0.7,
                      max_tokens: int = 2000) -> Dict[str, Any]:
        """Generate response from LLM"""
        pass
    
    def calculate_cost(self, input_tokens: int, output_tokens: int) -> float:
        """Calculate cost of tokens"""
        input_cost = (input_tokens / 1000) * self.cost_per_1k_input
        output_cost = (output_tokens / 1000) * self.cost_per_1k_output
        return input_cost + output_cost


class OpenAIService(LLMProvider):
    """OpenAI API service"""
    
    def __init__(self):
        super().__init__()
        self.client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.model_name = "gpt-4o"
        self.cost_per_1k_input = 0.005
        self.cost_per_1k_output = 0.015
    
    async def generate(self,
                      system_prompt: Optional[str],
                      user_prompt: str,
                      temperature: float = 0.7,
                      max_tokens: int = 2000) -> Dict[str, Any]:
        """Generate response using OpenAI"""
        start_time = time.time()
        
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": user_prompt})
        
        try:
            response = await self.client.chat.completions.create(
                model=self.model_name,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
            )
            
            latency_ms = (time.time() - start_time) * 1000
            
            return {
                "content": response.choices[0].message.content,
                "input_tokens": response.usage.prompt_tokens,
                "output_tokens": response.usage.completion_tokens,
                "latency_ms": latency_ms,
                "success": True,
            }
        except Exception as e:
            return {
                "content": "",
                "input_tokens": 0,
                "output_tokens": 0,
                "latency_ms": (time.time() - start_time) * 1000,
                "success": False,
                "error": str(e),
            }


class GeminiService(LLMProvider):
    """Google Gemini API service"""
    
    def __init__(self):
        super().__init__()
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model_name = "gemini-2.5-pro"
        self.client = genai.GenerativeModel(self.model_name)
        self.cost_per_1k_input = 0.0005
        self.cost_per_1k_output = 0.0015
    
    async def generate(self,
                      system_prompt: Optional[str],
                      user_prompt: str,
                      temperature: float = 0.7,
                      max_tokens: int = 2000) -> Dict[str, Any]:
        """Generate response using Gemini"""
        start_time = time.time()
        
        full_prompt = user_prompt
        if system_prompt:
            full_prompt = f"{system_prompt}\n\n{user_prompt}"
        
        try:
            response = self.client.generate_content(
                full_prompt,
                generation_config={
                    "temperature": temperature,
                    "max_output_tokens": max_tokens,
                }
            )
            
            latency_ms = (time.time() - start_time) * 1000
            
            return {
                "content": response.text,
                "input_tokens": len(full_prompt.split()),  # Approximate
                "output_tokens": len(response.text.split()),  # Approximate
                "latency_ms": latency_ms,
                "success": True,
            }
        except Exception as e:
            return {
                "content": "",
                "input_tokens": 0,
                "output_tokens": 0,
                "latency_ms": (time.time() - start_time) * 1000,
                "success": False,
                "error": str(e),
            }


class GroqService(LLMProvider):
    """Groq API service"""
    
    def __init__(self):
        super().__init__()
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.model_name = "mixtral-8x7b-32768"
        self.cost_per_1k_input = 0.00024
        self.cost_per_1k_output = 0.00024
    
    async def generate(self,
                      system_prompt: Optional[str],
                      user_prompt: str,
                      temperature: float = 0.7,
                      max_tokens: int = 2000) -> Dict[str, Any]:
        """Generate response using Groq"""
        start_time = time.time()
        
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": user_prompt})
        
        try:
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
            )
            
            latency_ms = (time.time() - start_time) * 1000
            
            return {
                "content": response.choices[0].message.content,
                "input_tokens": response.usage.prompt_tokens,
                "output_tokens": response.usage.completion_tokens,
                "latency_ms": latency_ms,
                "success": True,
            }
        except Exception as e:
            return {
                "content": "",
                "input_tokens": 0,
                "output_tokens": 0,
                "latency_ms": (time.time() - start_time) * 1000,
                "success": False,
                "error": str(e),
            }


class OllamaService(LLMProvider):
    """Local Ollama service"""
    
    def __init__(self):
        super().__init__()
        self.base_url = settings.OLLAMA_BASE_URL
        self.model_name = "llama2"
        self.cost_per_1k_input = 0.0  # Local, no cost
        self.cost_per_1k_output = 0.0
    
    async def generate(self,
                      system_prompt: Optional[str],
                      user_prompt: str,
                      temperature: float = 0.7,
                      max_tokens: int = 2000) -> Dict[str, Any]:
        """Generate response using Ollama"""
        start_time = time.time()
        
        prompt = user_prompt
        if system_prompt:
            prompt = f"{system_prompt}\n\n{user_prompt}"
        
        try:
            async with httpx.AsyncClient(timeout=120) as client:
                response = await client.post(
                    f"{self.base_url}/api/generate",
                    json={
                        "model": self.model_name,
                        "prompt": prompt,
                        "temperature": temperature,
                        "stream": False,
                    }
                )
            
            if response.status_code == 200:
                data = response.json()
                latency_ms = (time.time() - start_time) * 1000
                
                return {
                    "content": data.get("response", ""),
                    "input_tokens": len(prompt.split()),
                    "output_tokens": len(data.get("response", "").split()),
                    "latency_ms": latency_ms,
                    "success": True,
                }
        except Exception as e:
            pass
        
        return {
            "content": "",
            "input_tokens": 0,
            "output_tokens": 0,
            "latency_ms": (time.time() - start_time) * 1000,
            "success": False,
            "error": "Ollama service unavailable",
        }


class LLMFactory:
    """Factory for creating LLM providers"""
    
    @staticmethod
    def get_provider(provider_name: str) -> LLMProvider:
        """Get LLM provider by name"""
        providers = {
            "openai": OpenAIService,
            "gemini": GeminiService,
            "groq": GroqService,
            "ollama": OllamaService,
        }
        
        provider_class = providers.get(provider_name.lower())
        if not provider_class:
            raise ValueError(f"Unknown provider: {provider_name}")
        
        return provider_class()
    
    @staticmethod
    def get_available_providers() -> list:
        """Get list of available providers"""
        return ["openai", "gemini", "groq", "ollama"]
