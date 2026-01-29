"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Circle, CheckCircle2, Clock, AlertCircle, Plus, Zap } from "lucide-react";
import { useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";

const statusIcons = {
  todo: Circle,
  in_progress: Clock,
  done: CheckCircle2,
  blocked: AlertCircle,
};

const statusColors = {
  todo: "text-zinc-400",
  in_progress: "text-yellow-400",
  done: "text-green-400",
  blocked: "text-red-400",
};

export function MobileView() {
  const projects = useQuery(api.projects.list);
  const nextTask = useQuery(api.tasks.getNextTask, {});
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  if (!projects) return <MobileLoading />;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-24">
      {/* Header with Rune */}
      <header className="sticky top-0 bg-zinc-950/95 backdrop-blur border-b border-zinc-800 p-4 z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-lg">
              🤖
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-950" />
          </div>
          <div>
            <h1 className="font-semibold">Rune</h1>
            <p className="text-xs text-zinc-500">Online • Ready for tasks</p>
          </div>
        </div>
      </header>

      {/* What's Next Card */}
      {nextTask && (
        <div className="p-4">
          <NextTaskCard task={nextTask.task} project={nextTask.project} />
        </div>
      )}

      {/* Quick Stats */}
      <div className="px-4 mb-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-zinc-900 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{projects.filter(p => p.status === 'active').length}</p>
            <p className="text-xs text-zinc-500">Active</p>
          </div>
          <div className="bg-zinc-900 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">
              {projects.reduce((acc, p) => acc + (p.totalTasks - p.doneTasks), 0)}
            </p>
            <p className="text-xs text-zinc-500">Tasks Left</p>
          </div>
          <div className="bg-zinc-900 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">
              {projects.length > 0 ? Math.round(projects.reduce((acc, p) => acc + p.completionPercent, 0) / projects.length) : 0}%
            </p>
            <p className="text-xs text-zinc-500">Overall</p>
          </div>
        </div>
      </div>

      {/* Project List */}
      <div className="px-4 space-y-2">
        <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Projects</h2>
        {projects.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            expanded={expandedProject === project._id}
            onToggle={() => setExpandedProject(
              expandedProject === project._id ? null : project._id
            )}
          />
        ))}
      </div>

      {/* Floating Add Button */}
      <button 
        onClick={() => setShowQuickAdd(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-purple-500 hover:bg-purple-600 rounded-full shadow-lg flex items-center justify-center transition-colors z-20"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <QuickAddModal 
          projects={projects} 
          onClose={() => setShowQuickAdd(false)} 
        />
      )}
    </div>
  );
}

function NextTaskCard({ task, project }: { task: any; project: any }) {
  const updateStatus = useMutation(api.tasks.updateStatus);

  const markDone = () => updateStatus({ id: task._id, status: "done" });
  const markInProgress = () => updateStatus({ id: task._id, status: "in_progress" });

  return (
    <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-4 h-4 text-purple-400" />
        <span className="text-xs font-medium text-purple-400 uppercase tracking-wider">What&apos;s Next</span>
      </div>
      <h2 className="font-semibold text-lg">{task.title}</h2>
      <p className="text-sm text-zinc-400 mt-1">{project.name}</p>
      <div className="flex gap-2 mt-4">
        {task.status === "todo" && (
          <button
            onClick={markInProgress}
            className="flex-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg py-2.5 text-sm font-medium transition-colors"
          >
            Start
          </button>
        )}
        <button
          onClick={markDone}
          className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg py-2.5 text-sm font-medium transition-colors"
        >
          Done ✓
        </button>
      </div>
    </div>
  );
}

function ProjectCard({ project, expanded, onToggle }: { 
  project: any; 
  expanded: boolean; 
  onToggle: () => void;
}) {
  const tasks = useQuery(
    api.tasks.listByProject,
    expanded ? { projectId: project._id } : "skip"
  );

  return (
    <div className="bg-zinc-900 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
            <span className="text-lg">
              {project.status === "blocked" ? "🔴" : 
               project.completionPercent === 100 ? "✅" : "📁"}
            </span>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{project.name}</h3>
              {project.status === "blocked" && (
                <Badge variant="outline" className="text-xs bg-red-500/20 text-red-400 border-red-500/30">
                  blocked
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-20 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${project.completionPercent}%` }}
                />
              </div>
              <span className="text-xs text-zinc-500">
                {project.doneTasks}/{project.totalTasks}
              </span>
            </div>
          </div>
        </div>
        <ChevronRight className={`w-5 h-5 text-zinc-500 transition-transform ${expanded ? "rotate-90" : ""}`} />
      </button>

      {expanded && tasks && (
        <div className="px-4 pb-4 space-y-2">
          {tasks.length === 0 ? (
            <p className="text-sm text-zinc-500 text-center py-4">No tasks yet</p>
          ) : (
            tasks.map((task) => (
              <TaskRow key={task._id} task={task} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function TaskRow({ task }: { task: any }) {
  const updateStatus = useMutation(api.tasks.updateStatus);
  const toggleSubtask = useMutation(api.subtasks.toggle);
  const [expanded, setExpanded] = useState(false);
  const Icon = statusIcons[task.status as keyof typeof statusIcons];

  const cycleStatus = () => {
    const next = {
      todo: "in_progress",
      in_progress: "done",
      done: "todo",
      blocked: "todo",
    }[task.status] as "todo" | "in_progress" | "done" | "blocked";
    updateStatus({ id: task._id, status: next });
  };

  const hasSubtasks = task.subtasks && task.subtasks.length > 0;

  return (
    <div className="bg-zinc-800/50 rounded-lg overflow-hidden">
      <div className="flex items-center gap-3 p-3">
        <button onClick={cycleStatus}>
          <Icon className={`w-5 h-5 ${statusColors[task.status as keyof typeof statusColors]}`} />
        </button>
        <button 
          onClick={() => hasSubtasks && setExpanded(!expanded)}
          className={`flex-1 text-left ${task.status === "done" ? "line-through text-zinc-500" : ""}`}
        >
          {task.title}
        </button>
        {hasSubtasks && (
          <span className="text-xs text-zinc-500 bg-zinc-700 px-2 py-0.5 rounded">
            {task.doneSubtasks}/{task.totalSubtasks}
          </span>
        )}
      </div>

      {expanded && hasSubtasks && (
        <div className="px-3 pb-3 pl-11 space-y-2">
          {task.subtasks.map((subtask: any) => (
            <div key={subtask._id} className="flex items-center gap-2">
              <Checkbox
                checked={subtask.done}
                onCheckedChange={() => toggleSubtask({ id: subtask._id })}
                className="h-4 w-4"
              />
              <span className={`text-sm ${subtask.done ? "line-through text-zinc-500" : "text-zinc-300"}`}>
                {subtask.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function QuickAddModal({ projects, onClose }: { projects: any[]; onClose: () => void }) {
  const createTask = useMutation(api.tasks.create);
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState(projects[0]?._id || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !projectId) return;

    setIsSubmitting(true);
    try {
      await createTask({
        projectId: projectId as Id<"projects">,
        title: title.trim(),
      });
      onClose();
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end z-50" onClick={onClose}>
      <div 
        className="bg-zinc-900 w-full rounded-t-2xl p-4 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1 bg-zinc-700 rounded-full mx-auto mb-4" />
        <h2 className="text-lg font-semibold mb-4">Add Task</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-zinc-400 mb-1 block">Project</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-3"
            >
              {projects.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-zinc-400 mb-1 block">Task</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-3"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !title.trim()}
            className="w-full bg-purple-500 hover:bg-purple-600 disabled:opacity-50 rounded-lg py-3 font-medium transition-colors"
          >
            {isSubmitting ? "Adding..." : "Add Task"}
          </button>
        </form>
      </div>
    </div>
  );
}

function MobileLoading() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl mx-auto mb-3 animate-pulse">
          🤖
        </div>
        <p className="text-zinc-500">Loading...</p>
      </div>
    </div>
  );
}
