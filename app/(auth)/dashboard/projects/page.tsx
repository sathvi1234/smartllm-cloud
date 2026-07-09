'use client';

import { useState } from 'react';
import { mockProjects } from '@/lib/mock-data';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/lib/store/ui-store';
import { Plus } from 'lucide-react';
import { Project } from '@/lib/types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { addNotification } = useUIStore();

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    addNotification({
      id: `notification_${Date.now()}`,
      type: 'success',
      message: 'Project deleted successfully',
    });
  };

  const handleCreateProject = () => {
    const newProject: Project = {
      id: `project_${Date.now()}`,
      userId: '1',
      name: 'New Project',
      description: 'Add a description',
      apiKey: `sk_live_${Math.random().toString(36).substr(2, 20)}`,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      totalRequests: 0,
      monthlyCost: 0,
      cacheHitRate: 0,
    };

    setProjects((prev) => [newProject, ...prev]);
    addNotification({
      id: `notification_${Date.now()}`,
      type: 'success',
      message: 'Project created successfully',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="mt-2 text-muted-foreground">Manage your API projects and credentials</p>
        </div>
        <Button onClick={handleCreateProject} className="gap-2">
          <Plus className="size-4" />
          New Project
        </Button>
      </div>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={handleDeleteProject}
              onEdit={setSelectedProject}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border bg-muted/50 p-12 text-center">
          <h3 className="mb-2 font-semibold">No projects yet</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Create your first project to start optimizing AI requests
          </p>
          <Button onClick={handleCreateProject} className="gap-2">
            <Plus className="size-4" />
            Create Project
          </Button>
        </div>
      )}
    </div>
  );
}
