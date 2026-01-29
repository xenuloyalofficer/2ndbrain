"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Circle, CheckCircle2, Clock, AlertCircle, Plus, Zap, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";

const statusIcons = {
  todo: Circle,
  in_progress: Clock,
  done: CheckCircle2,
  blocked: AlertCircle,
};

const statusColors = {
  todo: "text-white/30",
  in_progress: "text-accent",
  done: "text-success",
  blocked: "text-danger",
};

export function MobileView() {
  const projects = useQuery(api.projects.list);
  const nextTask = useQuery(api.tasks.getNextTask, {});
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  if (!projects) return <MobileLoading />;

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 selection:bg-accent/30 font-sans">
      {/* Header with Rune */}
      <header className="sticky top-0 z-50 glass border-b border-white/5 px-4 py-3 mx-2 mt-2 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent via-orange-500 to-purple flex items-center justify-center text-lg shadow-lg shadow-accent/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-success rounded-full border-2 border-background online-indicator" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight text-white/90">
              Rune <span className="text-accent tracking-tighter">Mobile</span>
            </h1>
            <p className="text-[10px] font-bold text-success uppercase tracking-widest">Active • Synced</p>
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
      <div className="px-4 mb-8">
        <div className="grid grid-cols-3 gap-3">
          <div className="glass rounded-2xl p-4 text-center border border-white/5">
            <p className="text-2xl font-black text-white tabular-nums tracking-tighter">{projects.filter(p => p.status === 'active').length}</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Active</p>
          </div>
          <div className="glass rounded-2xl p-4 text-center border border-white/5">
            <p className="text-2xl font-black text-white tabular-nums tracking-tighter">
              {projects.reduce((acc, p) => acc + (p.totalTasks - p.doneTasks), 0)}
            </p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Pending</p>
          </div>
          <div className="glass rounded-2xl p-4 text-center border border-accent/20 bg-accent/5">
            <p className="text-2xl font-black text-accent tabular-nums tracking-tighter">
              {projects.length > 0 ? Math.round(projects.reduce((acc, p) => acc + p.completionPercent, 0) / projects.length) : 0}%
            </p>
            <p className="text-[10px] font-bold text-accent uppercase tracking-widest mt-1">Total</p>
          </div>
        </div>
      </div>

      {/* Project List */}
      <div className="px-4 space-y-3">
        <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 px-2">Operational Matrix</h2>
        {projects.map((project) => (
          <ProjectRowCard
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
        className="fixed bottom-6 right-6 w-16 h-16 bg-accent hover:bg-accent-hover rounded-2xl shadow-2xl shadow-accent/40 flex items-center justify-center transition-all active:scale-90 z-20"
      >
        <Plus className="w-8 h-8 text-white" />
      </button>

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <MobileQuickAddModal
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
    <div className="glass-card rounded-3xl p-6 relative overflow-hidden group animate-in slide-in-from-top-4 duration-700">
      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
        <Zap className="w-20 h-20 text-accent" />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-accent/10 border border-accent/20">
          <Zap className="w-4 h-4 text-accent" />
        </div>
        <span className="text-[10px] font-black text-accent uppercase tracking-widest">Priority Protocol</span>
      </div>

      <h2 className="text-xl font-black text-white leading-tight mb-1">{task.title}</h2>
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6">{project.name}</p>

      <div className="flex gap-3">
        {task.status === "todo" && (
          <button
            onClick={markInProgress}
            className="flex-1 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl py-4 transition-all active:scale-95 border border-white/5"
          >
            Initiate
          </button>
        )}
        <button
          onClick={markDone}
          className="flex-[2] bg-accent hover:bg-accent-hover text-white text-[10px] font-black uppercase tracking-widest rounded-xl py-4 transition-all active:scale-95 shadow-lg shadow-accent/20"
        >
          Execute Resolution ✓
        </button>
      </div>
    </div>
  );
}

function ProjectRowCard({ project, expanded, onToggle }: {
  project: any;
  expanded: boolean;
  onToggle: () => void;
}) {
  const tasks = useQuery(
    api.tasks.listByProject,
    expanded ? { projectId: project._id } : "skip"
  );

  return (
    <div className="glass-card rounded-2xl overflow-hidden border-white/5 transition-all">
      <button
        onClick={onToggle}
        className="w-full p-5 flex items-center justify-between group active:bg-white/5"
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${project.status === 'blocked' ? 'bg-danger/10 border border-danger/20' : 'glass border border-white/10 group-hover:scale-105'}`}>
            <span className="text-xl">
              {project.status === "blocked" ? "⚠️" :
                project.completionPercent === 100 ? "✅" : "🔘"}
            </span>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black tracking-tight text-white/90">{project.name}</h3>
              {project.status === "blocked" && (
                <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest bg-danger/10 text-danger border-danger/20 px-1.5 py-0">
                  Stalled
                </Badge>
              )}
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-accent to-success rounded-full transition-all duration-1000"
                  style={{ width: `${project.completionPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest tabular-nums">
                {project.doneTasks}<span className="mx-0.5 text-white/10">/</span>{project.totalTasks} operations
              </span>
            </div>
          </div>
        </div>
        <div className={`p-1.5 rounded-lg glass transition-transform duration-300 ${expanded ? "rotate-90" : ""}`}>
          <ChevronRight className="w-4 h-4 text-white/30" />
        </div>
      </button>

      {expanded && tasks && (
        <div className="px-4 pb-5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          {tasks.length === 0 ? (
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center py-6 italic">No operational data</p>
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
    const statusMap: Record<string, "todo" | "in_progress" | "done" | "blocked"> = {
      todo: "in_progress",
      in_progress: "done",
      done: "todo",
      blocked: "todo",
    };
    const next = statusMap[task.status as string] || "todo";
    updateStatus({ id: task._id, status: next });
  };

  const hasSubtasks = task.subtasks && task.subtasks.length > 0;

  return (
    <div className="glass bg-white/[0.02] rounded-xl overflow-hidden border border-white/5 active:scale-[0.98] transition-all">
      <div className="flex items-center gap-4 p-4">
        <button
          onClick={cycleStatus}
          className="active:scale-125 transition-transform"
        >
          <Icon className={`w-5 h-5 transition-colors ${statusColors[task.status as keyof typeof statusColors]}`} />
        </button>
        <button
          onClick={() => hasSubtasks && setExpanded(!expanded)}
          className={`flex-1 text-xs font-bold tracking-tight text-white/80 text-left transition-all ${task.status === "done" ? "line-through text-white/20" : "group-hover:text-white"}`}
        >
          {task.title}
        </button>
        {hasSubtasks && (
          <span className="text-[10px] font-black text-muted-foreground tabular-nums bg-white/5 border border-white/5 px-2 py-0.5 rounded-lg">
            {task.doneSubtasks}<span className="mx-0.5 text-white/10">/</span>{task.totalSubtasks}
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

function MobileQuickAddModal({ projects, onClose }: { projects: any[]; onClose: () => void }) {
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
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-end z-50 animate-in fade-in duration-300" onClick={onClose}>
      <div
        className="glass w-full rounded-t-[2.5rem] p-8 pb-12 border-t border-white/10 animate-in slide-in-from-bottom-full duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white/90">New Mission</h2>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Operational Deployment</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block px-1">Tactical Objective</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-5 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/40 focus:bg-white/[0.08] transition-all font-bold"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block px-1">Project Assignment</label>
            <div className="relative">
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-5 text-sm font-bold text-white/80 appearance-none focus:outline-none focus:border-accent/40 focus:bg-white/[0.08] transition-all"
              >
                {projects.map(p => (
                  <option key={p._id} value={p._id} className="bg-background text-white">{p.name}</option>
                ))}
              </select>
              <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 rotate-90" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !title.trim()}
            className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 rounded-2xl py-5 text-xs font-black uppercase tracking-[0.2em] text-white transition-all active:scale-95 shadow-xl shadow-accent/20"
          >
            {isSubmitting ? "Deploying..." : "Initialize Unit"}
          </button>
        </form>
      </div>
    </div>
  );
}

function MobileLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="relative group mx-auto w-fit mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent via-orange-500 to-purple flex items-center justify-center text-2xl animate-shimmer shadow-2xl shadow-accent/20 border border-white/10">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div className="absolute inset-0 w-14 h-14 rounded-2xl bg-accent blur-xl opacity-20 mx-auto animate-pulse" />
        </div>
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/90">Neural Uplink</h2>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2">Initializing Mobile Core...</p>
      </div>
    </div>
  );
}
