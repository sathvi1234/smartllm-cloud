from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import select

from app.database import get_db
from app.schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate
from app.models import Project
from app.utils import ResourceNotFound

router = APIRouter()


@router.post("", response_model=ProjectResponse)
async def create_project(project: ProjectCreate, user_id: int = 1, db: AsyncSession = Depends(get_db)):
    """Create a new project"""
    db_project = Project(**project.dict(), owner_id=user_id)
    db.add(db_project)
    await db.commit()
    await db.refresh(db_project)
    return db_project


@router.get("", response_model=list[ProjectResponse])
async def list_projects(user_id: int = 1, db: AsyncSession = Depends(get_db)):
    """List all projects for user"""
    query = select(Project).where(Project.owner_id == user_id)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: int, user_id: int = 1, db: AsyncSession = Depends(get_db)):
    """Get specific project"""
    query = select(Project).where(Project.id == project_id, Project.owner_id == user_id)
    result = await db.execute(query)
    project = result.scalar_one_or_none()
    if not project:
        raise ResourceNotFound("Project")
    return project


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(project_id: int, project_update: ProjectUpdate, user_id: int = 1, db: AsyncSession = Depends(get_db)):
    """Update a project"""
    query = select(Project).where(Project.id == project_id, Project.owner_id == user_id)
    result = await db.execute(query)
    project = result.scalar_one_or_none()
    if not project:
        raise ResourceNotFound("Project")
    
    for key, value in project_update.dict(exclude_unset=True).items():
        setattr(project, key, value)
    
    await db.commit()
    await db.refresh(project)
    return project


@router.delete("/{project_id}")
async def delete_project(project_id: int, user_id: int = 1, db: AsyncSession = Depends(get_db)):
    """Delete a project"""
    query = select(Project).where(Project.id == project_id, Project.owner_id == user_id)
    result = await db.execute(query)
    project = result.scalar_one_or_none()
    if not project:
        raise ResourceNotFound("Project")
    
    await db.delete(project)
    await db.commit()
    return {"message": "Project deleted"}
