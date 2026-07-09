from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import select

from app.database import get_db
from app.schemas.prompt import PromptCreate, PlaygroundRequest, PlaygroundResponse
from app.models import Prompt, Response
from app.services.llm_providers import LLMFactory
from app.services.prompt_optimizer import PromptOptimizer
from app.services.model_router import ModelRouter

router = APIRouter()


@router.post("/playground", response_model=PlaygroundResponse)
async def playground(request: PlaygroundRequest, user_id: int = 1, db: AsyncSession = Depends(get_db)):
    """Run playground prompt and get response"""
    
    try:
        # Get LLM provider
        provider = LLMFactory.get_provider(request.model)
        
        # Generate response
        result = await provider.generate(
            system_prompt=request.system_prompt,
            user_prompt=request.user_prompt,
            temperature=request.temperature,
            max_tokens=request.max_tokens,
        )
        
        if not result["success"]:
            return PlaygroundResponse(
                response=f"Error: {result.get('error', 'Unknown error')}",
                input_tokens=0,
                output_tokens=0,
                total_tokens=0,
                estimated_cost=0.0,
                latency_ms=result.get("latency_ms", 0),
                model=request.model,
                cached=False,
            )
        
        # Calculate cost
        estimated_cost = provider.calculate_cost(
            result["input_tokens"],
            result["output_tokens"]
        )
        
        # Save to database if project_id provided
        if request.project_id:
            prompt = Prompt(
                user_id=user_id,
                project_id=request.project_id,
                system_prompt=request.system_prompt,
                user_prompt=request.user_prompt,
                model=request.model,
                temperature=request.temperature,
                max_tokens=request.max_tokens,
                input_tokens=result["input_tokens"],
                output_tokens=result["output_tokens"],
                total_tokens=result["input_tokens"] + result["output_tokens"],
                estimated_cost=estimated_cost,
            )
            db.add(prompt)
            
            response = Response(
                prompt=prompt,
                model=request.model,
                content=result["content"],
                tokens_used=result["output_tokens"],
                latency_ms=result["latency_ms"],
                success=1,
            )
            db.add(response)
            await db.commit()
        
        return PlaygroundResponse(
            response=result["content"],
            input_tokens=result["input_tokens"],
            output_tokens=result["output_tokens"],
            total_tokens=result["input_tokens"] + result["output_tokens"],
            estimated_cost=estimated_cost,
            latency_ms=result["latency_ms"],
            model=request.model,
            cached=False,
        )
    
    except Exception as e:
        return PlaygroundResponse(
            response=f"Error: {str(e)}",
            input_tokens=0,
            output_tokens=0,
            total_tokens=0,
            estimated_cost=0.0,
            latency_ms=0,
            model=request.model,
            cached=False,
        )


@router.post("/optimize")
async def optimize_prompt(prompt: str):
    """Optimize a prompt"""
    analysis = PromptOptimizer.analyze_prompt(prompt)
    optimized = PromptOptimizer.optimize_prompt(prompt)
    comparison = PromptOptimizer.compare_prompts(prompt, optimized["optimized_prompt"])
    
    return {
        **analysis,
        **optimized,
        **comparison,
    }


@router.post("/route")
async def route_model(prompt: str, speed_priority: bool = False, cost_priority: bool = False):
    """Get model recommendation for prompt"""
    return ModelRouter.route_request(prompt, speed_priority, cost_priority)


@router.get("/models")
async def get_models():
    """Get list of available models"""
    return {
        "models": [
            {
                "name": name,
                **ModelRouter.get_model_info(name)
            }
            for name in ModelRouter.MODELS.keys()
        ]
    }
