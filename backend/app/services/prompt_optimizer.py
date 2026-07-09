from typing import Dict, List, Any
import re


class PromptOptimizer:
    """Service for optimizing prompts"""
    
    @staticmethod
    def analyze_prompt(prompt: str) -> Dict[str, Any]:
        """Analyze prompt quality and provide metrics"""
        
        analysis = {
            "original_prompt": prompt,
            "quality_score": 0,
            "issues": [],
            "suggestions": [],
            "estimated_token_reduction": 0,
            "estimated_cost_saving": 0.0,
        }
        
        score = 100
        
        # Check for redundancy
        words = prompt.lower().split()
        if len(words) != len(set(words)):
            score -= 10
            analysis["issues"].append("Redundant words detected")
            analysis["suggestions"].append("Remove redundant phrases")
        
        # Check for clarity
        if len(prompt) < 20:
            score -= 15
            analysis["issues"].append("Prompt is too short and may lack clarity")
            analysis["suggestions"].append("Provide more context and detail")
        
        # Check for specificity
        vague_words = ["something", "thing", "stuff", "maybe", "probably"]
        if any(word in prompt.lower() for word in vague_words):
            score -= 15
            analysis["issues"].append("Vague language detected")
            analysis["suggestions"].append("Use specific terminology")
        
        # Check for structure
        if not any(punctuation in prompt for punctuation in [".", "?", "!"]):
            score -= 10
            analysis["issues"].append("Lacks proper punctuation")
            analysis["suggestions"].append("Add proper punctuation for clarity")
        
        # Check for context
        if len(prompt.split()) < 5:
            score -= 20
            analysis["issues"].append("Insufficient context provided")
            analysis["suggestions"].append("Add more context to the prompt")
        
        # Estimate token reduction
        original_tokens = len(prompt.split())
        optimized_tokens = max(original_tokens - 10, 5)
        analysis["estimated_token_reduction"] = original_tokens - optimized_tokens
        analysis["estimated_cost_saving"] = (analysis["estimated_token_reduction"] / 1000) * 0.002
        
        analysis["quality_score"] = max(0, min(100, score))
        
        return analysis
    
    @staticmethod
    def optimize_prompt(prompt: str) -> Dict[str, Any]:
        """Generate optimized version of prompt"""
        
        # Remove redundant words
        words = prompt.split()
        unique_words = []
        seen = set()
        for word in words:
            word_lower = word.lower().strip(".,!?;:")
            if word_lower not in seen:
                unique_words.append(word)
                seen.add(word_lower)
        
        optimized = " ".join(unique_words)
        
        # Create short version
        words_list = optimized.split()
        if len(words_list) > 15:
            short_version = " ".join(words_list[:15]) + "..."
        else:
            short_version = optimized
        
        return {
            "original_prompt": prompt,
            "optimized_prompt": optimized,
            "short_prompt": short_version,
            "token_reduction": len(prompt.split()) - len(optimized.split()),
            "cost_savings": (len(prompt.split()) - len(optimized.split())) / 1000 * 0.002,
        }
    
    @staticmethod
    def compare_prompts(original: str, optimized: str) -> Dict[str, Any]:
        """Compare original and optimized prompts"""
        
        original_tokens = len(original.split())
        optimized_tokens = len(optimized.split())
        
        return {
            "original_token_count": original_tokens,
            "optimized_token_count": optimized_tokens,
            "tokens_saved": original_tokens - optimized_tokens,
            "efficiency_gain": ((original_tokens - optimized_tokens) / original_tokens * 100) if original_tokens > 0 else 0,
            "estimated_cost_reduction": ((original_tokens - optimized_tokens) / 1000) * 0.002,
        }
