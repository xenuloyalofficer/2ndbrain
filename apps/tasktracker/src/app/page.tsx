"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ProjectCard } from "@/components/project-card";

export default function Dashboard() {
  const projects = useQuery(api.projects.list);

  if (!projects) {
    return <div className="p-8">Loading...</div>;
  }

  const visibleProjects = projects.filter(p => p.status !== "completed");
  const completedCount = projects.filter(p => p.status === "completed").length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 p-6">
        <h1 className="text-2xl font-bold">2nd Brain Task Tracker</h1>
        <p className="text-zinc-400 mt-1">
          {visibleProjects.filter(p => p.status === "active").length} active projects
          {completedCount > 0 && ` · ${completedCount} completed`}
        </p>
      </header>

      <main className="p-6 max-w-4xl mx-auto">
        <div className="space-y-4">
          {visibleProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </main>
    </div>
  );
}
