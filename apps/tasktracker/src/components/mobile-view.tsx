"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Circle, CheckCircle2, Clock, AlertCircle, Plus, Zap, X, Flame, Layout } from "lucide-react";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";

function MobileAddProjectModal({ onClose }: { onClose: () => void }) {
  const createProject = useMutation(api.projects.create);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createProject({ name: name.trim(), description: description.trim(), priority });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full bg-[#181b21] rounded-t-3xl border-t border-white/10 p-8 pb-12 animate-in slide-in-from-bottom-full duration-500">
        <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />
        <h2 className="text-xl font-bold text-white tracking-tight mb-8">Initialize Core</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest px-1">Core Identity</label>
            <input
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-5 text-base text-white focus:outline-none focus:border-accent transition-all placeholder:text-slate-800 font-bold"
              placeholder="Project Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest px-1">Strategic Weight</label>
            <div className="grid grid-cols-3 gap-2">
              {(["low", "medium", "high"] as const).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${priority === p ? 'bg-accent/10 border-accent text-accent' : 'bg-white/5 border-white/5 text-slate-500'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <button className="w-full py-5 bg-accent text-white rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] shadow-2xl shadow-accent/40 active:scale-95 transition-all">
            Initialize Core
          </button>
        </form>
      </div>
    </div>
  );
}

export function MobileView() {
  const projects = useQuery(api.projects.list);
  const nextTask = useQuery(api.tasks.getNextTask, {});
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);

  if (!projects) return <MobileLoading />;

  const activeProjectsCount = projects.filter(p => p.status === 'active').length;
  const pendingTasksCount = projects.reduce((acc, p) => acc + (p.totalTasks - p.doneTasks), 0);
  const totalCompletion = projects.length > 0 ? Math.round(projects.reduce((acc, p) => acc + p.completionPercent, 0) / projects.length) : 0;

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 pb-24 font-sans selection:bg-accent/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0f1115]/90 backdrop-blur-md border-b border-white/5 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="logo-container">
            <img src="/rune-small.png" alt="Rune" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white">Rune <span className="text-accent">Mobile</span></h1>
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest leading-none mt-1 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-emerald-500" />
              Operational Core
            </p>
          </div>
        </div>
      </header>

      {/* Primary Action Card (What's Next) */}
      {nextTask && (
        <div className="p-4">
          <div className="bg-[#181b21] rounded-xl p-6 border border-white/5 relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Zap className="w-16 h-16 text-accent" />
            </div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-accent/10 rounded">
                <Zap className="w-3.5 h-3.5 text-accent" />
              </div>
              <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">Priority Protocol</span>
            </div>
            <h2 className="text-xl font-bold text-white leading-tight mb-1">{nextTask.task.title}</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">{nextTask.project.name}</p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowQuickAdd(true)}
                className="flex-1 bg-white/5 text-[10px] font-bold uppercase tracking-widest rounded transition-all border border-white/5 active:scale-95 h-12"
              >
                Defer
              </button>
              <button
                className="flex-[2] bg-accent text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-lg shadow-accent/20 active:scale-95 h-12"
              >
                Execute Resolution ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid Stats */}
      <div className="px-4 mb-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-[#181b21] p-4 rounded-lg border border-white/5 text-center">
            <p className="text-xl font-bold text-white tracking-tighter">{activeProjectsCount}</p>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Active</p>
          </div>
          <div className="bg-[#181b21] p-4 rounded-lg border border-white/5 text-center">
            <p className="text-xl font-bold text-white tracking-tighter">{pendingTasksCount}</p>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Pending</p>
          </div>
          <div className="bg-[#181b21] p-4 rounded-lg border border-accent/20 text-center bg-accent/5">
            <p className="text-xl font-bold text-accent tracking-tighter">{totalCompletion}%</p>
            <p className="text-[9px] font-bold text-accent uppercase tracking-widest mt-1">Completion</p>
          </div>
        </div>
      </div>

      {/* Projects List with density */}
      <div className="px-4 space-y-3 mt-6">
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <div className="w-1 h-3 bg-emerald-500 rounded-full" />
            Operational Matrix
          </h2>
          <button
            onClick={() => setShowAddProject(true)}
            className="p-1.5 rounded bg-white/5 text-slate-500 hover:text-white border border-white/5 active:bg-white/10 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
        {projects.map((project) => (
          <div key={project._id} className="bg-[#181b21] rounded-lg border border-white/5 overflow-hidden transition-all active:bg-[#1e232b]">
            <button
              onClick={() => setExpandedProject(expandedProject === project._id ? null : project._id)}
              className="w-full flex items-center justify-between p-5"
            >
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-sm font-bold ${project.status === 'blocked' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-white/5 text-slate-500 border border-white/10'}`}>
                  {project.status === 'blocked' ? '⚠️' : project.name.charAt(0)}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{project.name}</h3>
                    {project.status === 'blocked' && (
                      <span className="text-[8px] font-black uppercase tracking-tighter bg-rose-500/10 text-rose-500 px-1.5 py-0 rounded border border-rose-500/20">Stalled</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 mt-2">
                    <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-accent transition-all duration-1000" style={{ width: `${project.completionPercent}%` }} />
                    </div>
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                      {project.doneTasks}/{project.totalTasks} operations
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 text-slate-600 transition-transform ${expandedProject === project._id ? 'rotate-90' : ''}`} />
            </button>

            {expandedProject === project._id && (
              <MobileProjectTasks projectId={project._id} />
            )}
          </div>
        ))}
      </div>

      {/* Fast Add Button */}
      <button
        onClick={() => setShowQuickAdd(true)}
        className="fixed bottom-6 right-6 w-15 h-15 bg-accent rounded-xl shadow-2xl shadow-accent/40 flex items-center justify-center transition-all active:scale-90 z-50 text-white"
      >
        <Plus className="w-7 h-7" />
      </button>

      {showQuickAdd && <MobileQuickAddModal projects={projects} onClose={() => setShowQuickAdd(false)} />}
      {showAddProject && <MobileAddProjectModal onClose={() => setShowAddProject(false)} />}
    </div>
  );
}

function MobileProjectTasks({ projectId }: { projectId: Id<"projects"> }) {
  const tasks = useQuery(api.tasks.listByProject, { projectId });
  const updateStatus = useMutation(api.tasks.updateStatus);

  if (!tasks) return <div className="p-4 text-center"><div className="w-4 h-4 border border-accent border-t-transparent animate-spin rounded-full mx-auto" /></div>;

  return (
    <div className="border-t border-white/5 p-3 space-y-2 bg-[#0a0b0e]">
      {tasks.map(t => (
        <div key={t._id} className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-lg active:bg-white/5">
          <button
            onClick={() => updateStatus({ id: t._id, status: t.status === 'done' ? 'todo' : 'done' })}
            className={`w-5 h-5 rounded border ${t.status === 'done' ? 'bg-emerald-500 border-emerald-500' : 'border-slate-700 bg-black/20'}`}
          >
            {t.status === 'done' && <CheckCircle2 className="w-3 h-3 text-white mx-auto" />}
          </button>
          <span className={`text-xs font-medium flex-1 ${t.status === 'done' ? 'line-through text-slate-600' : 'text-slate-300'}`}>{t.title}</span>
        </div>
      ))}
      {tasks.length === 0 && <p className="text-[10px] text-center p-6 text-slate-700 font-bold uppercase tracking-widest italic">Operations Matrix Clear</p>}
    </div>
  );
}

function MobileQuickAddModal({ projects, onClose }: { projects: any[]; onClose: () => void }) {
  const createTask = useMutation(api.tasks.create);
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState(projects[0]?._id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !projectId) return;
    await createTask({ projectId, title: title.trim(), listPriority: "today" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full bg-[#181b21] rounded-t-3xl border-t border-white/10 p-8 pb-12 animate-in slide-in-from-bottom-full duration-500">
        <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">New Mission</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Operational Deployment</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full"><X className="w-5 h-5 text-slate-600" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest px-1">Tactical Objective</label>
            <input
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-5 text-base text-white focus:outline-none focus:border-accent transition-all placeholder:text-slate-800 font-bold"
              placeholder="What needs to be done?"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest px-1">Project Assignment</label>
            <div className="relative">
              <select
                value={projectId}
                onChange={e => setProjectId(e.target.value as Id<"projects">)}
                className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-5 py-5 text-sm font-bold text-white/80 focus:outline-none focus:border-accent transition-all"
              >
                {projects.map(p => <option key={p._id} value={p._id} className="bg-[#181b21]">{p.name}</option>)}
              </select>
              <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 rotate-90" />
            </div>
          </div>
          <button className="w-full py-5 bg-accent text-white rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] shadow-2xl shadow-accent/40 active:scale-95 transition-all">
            Initialize Unit
          </button>
        </form>
      </div>
    </div>
  );
}

function MobileLoading() {
  return (
    <div className="min-h-screen bg-[#0f1115] flex flex-col items-center justify-center p-8">
      <div className="relative group mb-6">
        <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shadow-2xl shadow-accent/20">
          <Flame className="w-6 h-6 text-white" />
        </div>
        <div className="absolute inset-0 w-12 h-12 rounded-xl bg-accent blur-xl opacity-20 animate-pulse" />
      </div>
      <p className="text-[10px] font-bold text-slate-700 uppercase tracking-[0.2em] animate-pulse">Initializing Mobile Core</p>
    </div>
  );
}
