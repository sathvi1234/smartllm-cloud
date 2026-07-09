from typing import Dict, Any, List


class ModelRouter:
    """Service for recommending best LLM model"""
    
    # Model configurations with cost and performance metrics
    MODELS = {
        "gpt-4o": {
            "provider": "openai",
            "cost_per_1k_input": 0.005,
            "cost_per_1k_output": 0.015,
            "latency_ms": 600,
            "quality_score": 95,
            "speed_score": 70,
            "complexity_threshold": 0.8,  # Suitable for complex queries
            "description": "Most capable model, best for complex reasoning",
        },
        "gpt-4": {
            "provider": "openai",
            "cost_per_1k_input": 0.03,
            "cost_per_1k_output": 0.06,
            "latency_ms": 800,
            "quality_score": 92,
            "speed_score": 60,
            "complexity_threshold": 0.7,
            "description": "High quality, suitable for complex tasks",
        },
        "gpt-3.5-turbo": {
            "provider": "openai",
            "cost_per_1k_input": 0.0005,
            "cost_per_1k_output": 0.0015,
            "latency_ms": 300,
            "quality_score": 85,
            "speed_score": 90,
            "complexity_threshold": 0.3,
            "description": "Fast and economical for simple tasks",
        },
        "gemini-2.5-pro": {
            "provider": "gemini",
            "cost_per_1k_input": 0.0005,
            "cost_per_1k_output": 0.0015,
            "latency_ms": 500,
            "quality_score": 90,
            "speed_score": 80,
            "complexity_threshold": 0.7,
            "description": "Versatile and cost-effective",
        },
        "gemini-2.5-flash": {
            "provider": "gemini",
            "cost_per_1k_input": 0.00007,
            "cost_per_1k_output": 0.0002,
            "latency_ms": 250,
            "quality_score": 80,
            "speed_score": 95,
            "complexity_threshold": 0.2,
            "description": "Fastest and cheapest option",
        },
        "mixtral-8x7b": {
            "provider": "groq",
            "cost_per_1k_input": 0.00024,
            "cost_per_1k_output": 0.00024,
            "latency_ms": 200,
            "quality_score": 82,
            "speed_score": 98,
            "complexity_threshold": 0.5,
            "description": "Extremely fast with Groq acceleration",
        },
        "llama-2": {
            "provider": "ollama",
            "cost_per_1k_input": 0.0,
            "cost_per_1k_output": 0.0,
            "latency_ms": 1000,
            "quality_score": 70,
            "speed_score": 40,
            "complexity_threshold": 0.2,
            "description": "Local model, no cost but lower quality",
        },
    }
    
    @staticmethod
    def calculate_complexity(prompt: str) -> float:
        """Calculate prompt complexity on scale of 0-1"""
        
        complexity = 0.5  # Base complexity
        
        # Increase with prompt length
        word_count = len(prompt.split())
        if word_count > 100:
            complexity += 0.2
        elif word_count > 50:
            complexity += 0.1
        
        # Increase with technical terms
        technical_terms = ["complex", "analyze", "explain", "code", "algorithm", "data", "structure"]
        technical_count = sum(1 for term in technical_terms if term in prompt.lower())
        complexity += min(0.2, technical_count * 0.05)
        
        # Increase with question marks (multiple questions = more complex)
        complexity += min(0.1, prompt.count("?") * 0.05)
        
        return min(1.0, complexity)
    
    @staticmethod
    def route_request(prompt: str, speed_priority: bool = False, cost_priority: bool = False) -> Dict[str, Any]:
        """Route request to best model based on prompt and priorities"""
        
        complexity = ModelRouter.calculate_complexity(prompt)
        
        # Filter models by complexity
        suitable_models = {}
        for model_name, specs in ModelRouter.MODELS.items():
            if complexity <= specs["complexity_threshold"] or complexity > 0.8:
                suitable_models[model_name] = specs
        
        # Score each model based on priorities
        scored_models = {}
        for model_name, specs in suitable_models.items():
            score = 0
            
            # Quality component (40%)
            score += (specs["quality_score"] / 100) * 40
            
            # Speed component (30%)
            speed_normalized = (1000 - specs["latency_ms"]) / 1000
            score += speed_normalized * 30
            
            # Cost component (30%) - lower cost = higher score
            cost_normalized = 1 - min(1, specs["cost_per_1k_output"] * 100)
            score += cost_normalized * 30
            
            # Apply priorities
            if speed_priority:
                score += (speed_normalized * 20)
            if cost_priority:
                score += (cost_normalized * 20)
            
            scored_models[model_name] = {
                "score": score,
                "specs": specs,
            }
        
        # Find best model
        best_model = max(scored_models.items(), key=lambda x: x[1]["score"])
        model_name = best_model[0]
        model_specs = best_model[1]["specs"]
        
        # Estimate costs
        prompt_tokens = len(prompt.split())
        estimated_output_tokens = min(2000, prompt_tokens * 2)
        estimated_cost = (
            (prompt_tokens / 1000) * model_specs["cost_per_1k_input"] +
            (estimated_output_tokens / 1000) * model_specs["cost_per_1k_output"]
        )
        
        return {
            "recommended_model": model_name,
            "provider": model_specs["provider"],
            "complexity_score": complexity,
            "quality_score": model_specs["quality_score"],
            "speed_score": model_specs["speed_score"],
            "estimated_cost": estimated_cost,
            "estimated_latency_ms": model_specs["latency_ms"],
            "description": model_specs["description"],
            "why_this_model": [
                "Balanced quality and cost for this complexity level",
                f"Estimated cost: ${estimated_cost:.4f}",
                f"Expected latency: {model_specs['latency_ms']}ms",
            ],
            "alternatives": [
                {"model": m, "reason": "Faster but lower quality"}
                for m in list(scored_models.keys())[:2]
                if m != model_name
            ],
        }
    
    @staticmethod
    def get_model_info(model_name: str) -> Dict[str, Any]:
        """Get detailed information about a specific model"""
        
        if model_name not in ModelRouter.MODELS:
            return {"error": f"Model {model_name} not found"}
        
        specs = ModelRouter.MODELS[model_name]
        return {
            "model": model_name,
            **specs,
        }
    
    @staticmethod
    def compare_models(models: List[str]) -> Dict[str, Any]:
        """Compare multiple models"""
        
        comparison = {"models": {}}
        
        for model_name in models:
            if model_name in ModelRouter.MODELS:
                specs = ModelRouter.MODELS[model_name]
                comparison["models"][model_name] = {
                    "cost": specs["cost_per_1k_output"],
                    "quality": specs["quality_score"],
                    "speed": specs["speed_score"],
                    "latency": specs["latency_ms"],
                }
        
        return comparison
