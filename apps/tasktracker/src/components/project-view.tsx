"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import {
  ChevronLeft,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Plus,
  Flame,
  ChevronDown,
  ExternalLink,
  MoreHorizontal,
  Play,
  X,
  Target,
  Zap,
  Layers
} from "lucide-react";

interface ProjectViewProps {
  projectId: Id<"projects">;
  onBack: () => void;
}

export function ProjectView({ projectId, onBack }: ProjectViewProps) {
  const projects = useQuery(api.projects.list);
  const tasks = useQuery(api.tasks.listByProject, { projectId });
  const [showAddTask, setShowAddTask] = useState(false);

  const project = projects?.find(p => p._id === projectId);

  if (!project || !tasks) return <ProjectLoading />;

  const blockedTasks = tasks.filter(t => t.status === "blocked");
  const inProgressTasks = tasks.filter(t => t.status === "in_progress");
  const todoTasks = tasks.filter(t => t.status === "todo");
  const doneTasks = tasks.filter(t => t.status === "done");

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 pb-20">
      {/* Header with high density */}
      <header className="border-b border-white/5 bg-[#0f1115]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <div className="flex items-center gap-8">
            <button
              onClick={onBack}
              className="p-3 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all active:scale-95 border border-white/5 shadow-xl"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="logo-container">
                  <img src="/rune-small.png" alt="Rune" />
                </div>
                <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">Operational Core</span>
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight truncate">{project.name}</h1>
              <p className="text-xs font-medium text-slate-500 mt-2 max-w-2xl line-clamp-1">{project.description}</p>
            </div>

            <div className="hidden md:flex items-center gap-10">
              <div className="text-right">
                <div className="text-3xl font-bold text-white tracking-tighter tabular-nums">
                  {project.completionPercent}<span className="text-accent text-xl ml-1">%</span>
                </div>
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">Global Resolution</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white tracking-tighter tabular-nums">
                  {project.doneTasks}<span className="text-slate-700 text-xl mx-1">/</span>{project.totalTasks}
                </div>
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">Operational Split</p>
              </div>
            </div>
          </div>

          {/* Hero Progress Bar */}
          <div className="mt-10 h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-accent transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              style={{ width: `${project.completionPercent}%` }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-12 space-y-12">
        {/* Quick Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowAddTask(true)}
            className="btn-std px-6 bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-widest rounded transition-all shadow-xl shadow-accent/10 active:scale-95 group gap-2.5"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            Initialize Task Unit
          </button>
          {project.githubPath && (
            <a
              href={project.githubPath}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-std px-6 bg-white/5 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-widest rounded border border-white/5 hover:border-white/10 transition-all active:scale-95 gap-2.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Source Control
            </a>
          )}
        </div>

        {/* Task Sections with high density */}
        <div className="grid grid-cols-1 gap-12">
          {blockedTasks.length > 0 && (
            <TaskSection
              title="Stalled"
              icon={<AlertCircle className="w-4 h-4" />}
              tasks={blockedTasks}
              color="text-rose-500"
              accent="bg-rose-500/10 border-rose-500/20"
            />
          )}

          <TaskSection
            title="Live"
            icon={<Play className="w-4 h-4" />}
            tasks={inProgressTasks}
            color="text-accent"
            accent="bg-accent/10 border-accent/20"
          />

          <TaskSection
            title="Operational Log"
            icon={<Target className="w-4 h-4" />}
            tasks={todoTasks}
            color="text-slate-500"
            accent="bg-white/5 border-white/10"
          />

          <TaskSection
            title="Resolved"
            icon={<CheckCircle2 className="w-4 h-4" />}
            tasks={doneTasks}
            color="text-emerald-500"
            accent="bg-emerald-500/10 border-emerald-500/20"
            isDone
          />
        </div>
      </main>

      {showAddTask && <AddTaskModal projectId={projectId} onClose={() => setShowAddTask(false)} />}
    </div>
  );
}

function TaskSection({ title, icon, tasks, color, accent, isDone }: { title: string, icon: any, tasks: any[], color: string, accent: string, isDone?: boolean }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg ${accent} ${color}`}>
          {icon}
        </div>
        <h2 className={`text-xs font-bold uppercase tracking-[0.2em] ${color}`}>{title}</h2>
        <div className="h-px flex-1 bg-white/5" />
        <span className="text-[10px] font-bold text-slate-700 tabular-nums">({tasks.length} units)</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map(t => <ProjectTaskCard key={t._id} task={t} isDone={isDone} />)}
        {tasks.length === 0 && (
          <div className="col-span-2 py-8 text-center text-[10px] text-slate-700 font-bold uppercase tracking-widest italic border border-dashed border-white/5 rounded-lg">
            No active units in this sector
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectTaskCard({ task, isDone }: { task: any, isDone?: boolean }) {
  const updateStatus = useMutation(api.tasks.updateStatus);
  const isInProgress = task.status === 'in_progress';
  const hasSubtasks = task.totalSubtasks > 0;
  const progress = hasSubtasks ? (task.doneSubtasks / task.totalSubtasks) * 100 : 0;

  return (
    <div className={`bg-[#181b21] p-6 rounded-xl border transition-all group ${isInProgress ? 'border-accent/40 bg-accent/[0.03] ring-1 ring-accent/10' : 'border-white/5 hover:border-white/10'}`}>
      <div className="flex items-start gap-5">
        <button
          onClick={() => updateStatus({ id: task._id, status: isDone ? "todo" : "done" })}
          className={`shrink-0 mt-1 w-6 h-6 rounded border-2 flex items-center justify-center transition-all checkmark-bounce ${isDone ? 'bg-emerald-500 border-emerald-500' : 'border-slate-700 hover:border-accent bg-white/5'}`}
        >
          {isDone && <CheckCircle2 className="w-4 h-4 text-white" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h4 className={`text-sm font-medium leading-relaxed transition-all ${isDone ? 'line-through text-slate-600' : 'text-slate-200 group-hover:text-white'}`}>
              {task.title}
            </h4>
            {isInProgress && <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />}
          </div>

          {task.status === 'blocked' && task.blockedReason && (
            <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mt-1 mb-4 flex items-center gap-1.5">
              <AlertCircle className="w-3 h-3" />
              Blocked: {task.blockedReason}
            </p>
          )}

          {hasSubtasks && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-slate-600">
                <span>Verification Split</span>
                <span className="tabular-nums">{task.doneSubtasks}/{task.totalSubtasks}</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div className={`h-full transition-all duration-700 ${isDone ? 'bg-emerald-500/50' : 'bg-accent'}`} style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AddTaskModal({ projectId, onClose }: { projectId: Id<"projects">, onClose: () => void }) {
  const createTask = useMutation(api.tasks.create);
  const [title, setTitle] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await createTask({ projectId, title: title.trim() });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-[#181b21] border border-white/10 rounded-xl p-10 w-full max-w-md shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-5 duration-500">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-white tracking-tight text-center">Initialize Task Unit</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg"><X className="w-6 h-6 text-slate-600" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-1">Tactical Objective</label>
            <input
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-lg px-5 py-4 text-white text-base focus:outline-none focus:border-accent transition-all placeholder:text-slate-800 font-medium"
              placeholder="Objective description..."
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <button className="w-full py-5 bg-accent hover:bg-accent-hover text-white rounded-lg text-xs font-bold uppercase tracking-[0.2em] shadow-xl shadow-accent/20 transition-all active:scale-95">
            Deploy Unit
          </button>
        </form>
      </div>
    </div>
  );
}

function ProjectLoading() {
  return (
    <div className="min-h-screen bg-[#0f1115] flex flex-col items-center justify-center p-8">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent animate-spin rounded-full mb-4" />
      <p className="text-[10px] font-bold text-slate-700 uppercase tracking-[0.2em] animate-pulse">Syncing Sector Cores</p>
    </div>
  );
}
