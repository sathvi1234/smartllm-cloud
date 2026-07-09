"""Database seeding with demo data"""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timedelta
from .models import User, Project, APIKey, Prompt, Response, Analytics
from .utils.auth import hash_password


async def seed_database(db: AsyncSession):
    """Seed database with demo data if empty"""
    
    # Check if user already exists
    existing_user = await db.execute(select(User).where(User.email == "demo@smartllm.ai"))
    if existing_user.scalars().first():
        print("[v0] Database already seeded")
        return
    
    print("[v0] Seeding database with demo data...")
    
    # Create demo user
    demo_user = User(
        email="demo@smartllm.ai",
        full_name="Demo User",
        hashed_password=hash_password("demo123"),
        is_active=True,
        is_verified=True,
        is_admin=False,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        last_login=datetime.utcnow() - timedelta(hours=2),
    )
    db.add(demo_user)
    await db.flush()
    
    # Create demo projects
    projects_data = [
        {
            "name": "E-commerce Platform",
            "description": "AI-powered product recommendations",
            "owner_id": demo_user.id,
        },
        {
            "name": "Content Generation",
            "description": "Automated blog post generation",
            "owner_id": demo_user.id,
        },
        {
            "name": "Data Analysis",
            "description": "Intelligent data insights",
            "owner_id": demo_user.id,
        },
    ]
    
    projects = []
    for proj_data in projects_data:
        project = Project(**proj_data, created_at=datetime.utcnow())
        db.add(project)
        projects.append(project)
    
    await db.flush()
    
    # Create API keys for projects
    for project in projects:
        api_key = APIKey(
            user_id=demo_user.id,
            project_id=project.id,
            key=f"sk_test_{project.id}_{datetime.utcnow().timestamp()}",
            name=f"{project.name} Key",
            created_at=datetime.utcnow(),
        )
        db.add(api_key)
    
    # Create sample prompts
    prompts_data = [
        {
            "user_id": demo_user.id,
            "project_id": projects[0].id,
            "original_prompt": "Write a product recommendation for electronics",
            "optimized_prompt": "As an expert product curator, recommend 3 complementary electronics based on user preferences. Format as JSON.",
            "model_used": "gpt-4o",
            "input_tokens": 45,
            "output_tokens": 180,
            "cost": 0.00375,
        },
        {
            "user_id": demo_user.id,
            "project_id": projects[1].id,
            "original_prompt": "Generate a blog post",
            "optimized_prompt": "Generate a 1000-word SEO-optimized blog post about the latest AI trends. Include h2 headers and a meta description.",
            "model_used": "gemini-2.5-flash",
            "input_tokens": 38,
            "output_tokens": 850,
            "cost": 0.00156,
        },
    ]
    
    for prompt_data in prompts_data:
        prompt = Prompt(
            **prompt_data,
            created_at=datetime.utcnow(),
        )
        db.add(prompt)
    
    # Create analytics entries
    for i in range(7):
        date = datetime.utcnow() - timedelta(days=i)
        analytics = Analytics(
            user_id=demo_user.id,
            date=date,
            total_requests=4000 + (i * 500),
            total_tokens=2000000 + (i * 150000),
            total_cost=150.0 + (i * 12.5),
            cache_hits=250 + (i * 30),
            models_used=4,
        )
        db.add(analytics)
    
    await db.commit()
    print("[v0] Database seeded successfully")
