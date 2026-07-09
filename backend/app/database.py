from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.pool import NullPool, StaticPool
from .config import settings
from .models.base import Base

# Determine if using SQLite (for development) or PostgreSQL (for production)
is_sqlite = "sqlite" in settings.DATABASE_URL

# Create async engine with appropriate settings for SQLite or PostgreSQL
if is_sqlite:
    # SQLite needs special handling for async
    engine = create_async_engine(
        settings.DATABASE_URL,
        echo=settings.DATABASE_ECHO,
        future=True,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,  # Use StaticPool for SQLite
    )
else:
    # PostgreSQL with asyncpg
    engine = create_async_engine(
        settings.DATABASE_URL,
        echo=settings.DATABASE_ECHO,
        future=True,
        poolclass=NullPool,  # For serverless environments
    )

# Create async session factory
AsyncSessionLocal = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)


async def init_db():
    """Initialize database tables"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_db():
    """Dependency for getting database session"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def close_db():
    """Close database connection"""
    await engine.dispose()
