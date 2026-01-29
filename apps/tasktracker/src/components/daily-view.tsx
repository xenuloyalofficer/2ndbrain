"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import {
  Flame,
  Calendar,
  CheckCircle2,
  Plus,
  ChevronRight,
  ChevronDown,
  Clock,
  MoreHorizontal,
  Archive,
  Undo2,
  Play,
  X,
  Zap,
  Layout,
  Target
} from "lucide-react";

export function DailyView() {
  const todayTasks = useQuery(api.tasks.listByPriority, { priority: "today" });
  const weekTasks = useQuery(api.tasks.listByPriority, { priority: "this_week" });
  const doneTasks = useQuery(api.tasks.listDoneThisWeek);
  const projects = useQuery(api.projects.list);
  const actionLogs = useQuery(api.actionLogs.list, { limit: 6 });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showPickerModal, setShowPickerModal] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showDone, setShowDone] = useState(false);

  const isLoading = !todayTasks || !weekTasks || !doneTasks || !projects;

  if (isLoading) return <DailyLoading />;

  const activeTodayTasks = todayTasks.filter(t => t.status !== "done");
  const activeWeekTasks = weekTasks.filter(t => t.status !== "done");
  const todayCount = activeTodayTasks.length;

  return (
    <div className="min-h-screen pb-24 selection:bg-accent/30 bg-[#0f1115] text-slate-200">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0f1115]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="logo-container">
              <img src="/rune-small.png" alt="Rune" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Rune <span className="text-accent">Dashboard</span></h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-1.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded gap-3 h-[40px]">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Today's Focus</span>
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i < todayCount ? 'bg-accent' : 'bg-white/10'}`} />
                ))}
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-std px-5 bg-accent hover:bg-accent-hover text-white text-sm font-bold rounded transition-all shadow-lg shadow-accent/10 active:scale-95 gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-12">

            {/* START DOING / Daily Focus */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Target className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white uppercase tracking-tight">Start Doing</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">The most important 3 things</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 tracking-tighter tabular-nums">{todayCount}/3</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {activeTodayTasks.map((task) => (
                  <TaskCard key={task._id} task={task} variant="today" />
                ))}
                {todayCount < 3 && (
                  <EmptySlots
                    count={3 - todayCount}
                    onPick={() => setShowPickerModal(true)}
                    onAdd={() => setShowAddModal(true)}
                  />
                )}
              </div>
            </section>

            {/* STOP DOING / Weekly Blockers */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-lg">
                  <Calendar className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white uppercase tracking-tight">Stop Doing</h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Tasks queued for this week</p>
                </div>
                <span className="ml-auto bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[10px] font-bold text-slate-500">{activeWeekTasks.length} queued</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeWeekTasks.map((task) => (
                  <TaskCard key={task._id} task={task} variant="week" />
                ))}
                {activeWeekTasks.length === 0 && (
                  <div className="col-span-2 p-12 border border-dashed border-white/5 rounded-xl text-center bg-white/[0.01]">
                    <Clock className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                    <p className="text-sm text-slate-600 font-medium">No weekly blockers identified</p>
                    <button onClick={() => setShowAddModal(true)} className="mt-3 text-xs text-accent font-bold hover:underline">Add weekly task</button>
                  </div>
                )}
              </div>
            </section>

            {/* CONTINUE DOING / Recently Resolved */}
            <section className="space-y-4">
              <button
                onClick={() => setShowDone(!showDone)}
                className="flex items-center justify-between w-full p-4 bg-[#181b21] hover:bg-[#1e232b] border border-white/5 rounded-xl transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-bold text-white tracking-tight">Continue Doing</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{doneTasks.length} recently resolved</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-600 transition-transform ${showDone ? 'rotate-90' : ''}`} />
              </button>

              {showDone && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  {doneTasks.map((task) => (
                    <DoneTaskRow key={task._id} task={task} />
                  ))}
                  {doneTasks.length === 0 && (
                    <div className="p-8 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-xl text-xs text-slate-600">
                      No recently resolved units
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* SIDEBAR: Stats & Workspaces & Pulse */}
          <aside className="lg:col-span-4 space-y-8">

            {/* EFFICIENCY / PERFORMANCE Stats */}
            <div className="bg-[#181b21] p-6 rounded-xl border border-white/5 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 blur-3xl -mr-12 -mt-12" />
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <div className="w-1 h-3 bg-accent rounded-full" />
                Operational Status
              </h3>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-lg">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Resolved Units</p>
                    <p className="text-2xl font-bold text-white tracking-tighter">{doneTasks.length}</p>
                  </div>
                  <div className="w-10 h-10 rounded bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-lg">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Queue Size</p>
                    <p className="text-xl font-bold text-white">{activeWeekTasks.length}</p>
                  </div>
                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-lg">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Active Core</p>
                    <p className="text-xl font-bold text-white">{projects.filter(p => p.status === 'active').length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* PULSE / Action Logs */}
            <div className="bg-[#181b21] p-6 rounded-xl border border-white/5">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <div className="w-1 h-3 bg-purple rounded-full" />
                Pulse Matrix
              </h3>
              <div className="space-y-5">
                {actionLogs && actionLogs.length > 0 ? (
                  actionLogs.map((log) => (
                    <div key={log._id} className="relative pl-6 group">
                      <div className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                      <div className="absolute left-[2.5px] top-4 w-[1px] h-[calc(100%+12px)] bg-white/5 last:hidden" />
                      <p className="text-xs font-medium text-slate-400 leading-relaxed group-hover:text-slate-200 transition-colors">{log.description}</p>
                      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1.5">
                        {formatTimeAgo(log.timestamp)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-700 italic text-center py-6">Static detected...</p>
                )}
              </div>
            </div>

            {/* WORKSPACES / Projects */}
            <div className="bg-[#181b21] p-6 rounded-xl border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="w-1 h-3 bg-emerald-500 rounded-full" />
                  Active Cores
                </h3>
                <button
                  onClick={() => setShowAddProjectModal(true)}
                  className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white transition-all shadow-sm"
                  title="Initialize New Core"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-2">
                {projects.map((project) => (
                  <button
                    key={project._id}
                    onClick={() => {
                      if (typeof window !== "undefined" && (window as any).__tasktracker) {
                        (window as any).__tasktracker.openProject(project._id);
                      }
                    }}
                    className="w-full group p-3 rounded hover:bg-white/5 transition-all text-left border border-transparent hover:border-white/5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-300 group-hover:text-accent transition-colors truncate block flex-1">{project.name}</span>
                      <span className="text-[10px] font-bold text-slate-600 tabular-nums">{project.completionPercent}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent transition-all duration-1000 group-hover:bg-accent-hover"
                        style={{ width: `${project.completionPercent}%` }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </main>

      {/* Modals */}
      {showAddModal && <AddTaskModal projects={projects!} onClose={() => setShowAddModal(false)} />}
      {showPickerModal && <TaskPickerModal projects={projects!} onClose={() => setShowPickerModal(false)} />}
    </div>
  );
}

function TaskCard({ task, variant }: {
  task: {
    _id: Id<"tasks">;
    title: string;
    status: string;
    projectName: string;
    projectSlug: string;
    totalSubtasks: number;
    doneSubtasks: number;
  };
  variant: "today" | "week"
}) {
  const updateStatus = useMutation(api.tasks.updateStatus);
  const setPriority = useMutation(api.tasks.setListPriority);
  const [showMenu, setShowMenu] = useState(false);

  const isToday = variant === "today";
  const isInProgress = task.status === "in_progress";
  const hasSubtasks = task.totalSubtasks > 0;
  const progressPercent = hasSubtasks ? (task.doneSubtasks / task.totalSubtasks) * 100 : 0;

  return (
    <div className={`p-5 rounded-lg group bg-[#181b21] border transition-all duration-300 ${isInProgress ? 'border-accent/40 bg-accent/[0.04] ring-1 ring-accent/10' : 'border-white/5 hover:border-white/10'}`}>
      <div className="flex items-center gap-4">
        {/* Checkbox */}
        <button
          onClick={() => updateStatus({ id: task._id, status: "done" })}
          className={`h-6 w-6 rounded border-2 flex items-center justify-center transition-all checkmark-bounce shrink-0 ${isInProgress ? 'border-accent/40 bg-accent/10 hover:bg-accent' : 'border-slate-700 hover:border-accent bg-white/5'}`}
        >
          <CheckCircle2 className="w-4 h-4 opacity-0 group-hover:opacity-40" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20 uppercase tracking-widest leading-none">
              {task.projectName}
            </span>
            {isInProgress && (
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                <Clock className="w-3 h-3" />
                Active
              </span>
            )}
          </div>
          <h3 className={`text-sm font-medium leading-relaxed transition-colors ${isInProgress ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
            {task.title}
          </h3>

          {hasSubtasks && (
            <div className="mt-4 flex flex-col gap-1.5">
              <div className="flex justify-between items-center px-0.5">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Resolution Progress</span>
                <span className="text-[9px] font-bold text-slate-500 tabular-nums">{task.doneSubtasks}/{task.totalSubtasks}</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-accent transition-all duration-700" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all ml-4">
          {!isToday && (
            <button
              onClick={() => setPriority({ id: task._id, priority: "today" })}
              className="p-2 rounded hover:bg-accent/10 text-slate-500 hover:text-accent transition-colors"
              title="Prioritize Today"
            >
              <Flame className="w-4 h-4" />
            </button>
          )}
          {!isInProgress && (
            <button
              onClick={() => updateStatus({ id: task._id, status: "in_progress" })}
              className="p-2 rounded hover:bg-accent/10 text-slate-500 hover:text-accent transition-colors"
              title="Initialize Resolution"
            >
              <Play className="w-4 h-4" />
            </button>
          )}
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="p-2 rounded hover:bg-white/10 text-slate-500">
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 z-50 bg-[#1e232b] border border-white/10 rounded-lg shadow-2xl min-w-[160px] p-1 animate-in fade-in zoom-in-95">
                <button
                  onClick={() => { setPriority({ id: task._id, priority: undefined }); setShowMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[10px] font-bold uppercase text-slate-400 hover:bg-white/5 hover:text-white rounded transition-colors"
                >
                  <Archive className="w-3.5 h-3.5" />
                  Return to Backlog
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptySlots({ count, onPick, onAdd }: { count: number; onPick: () => void; onAdd: () => void }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-8 rounded-lg border border-dashed border-white/5 flex flex-col items-center justify-center gap-4 group hover:bg-white/[0.01] hover:border-white/10 transition-all">
          <div className="text-center">
            <p className="text-[10px] font-bold text-slate-700 uppercase tracking-[0.2em] group-hover:text-slate-500 transition-colors">Mission Slot Available</p>
            <p className="text-[9px] font-bold text-slate-800 uppercase tracking-widest mt-1">Standby for deployment</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onPick}
              className="btn-std px-5 bg-accent/5 hover:bg-accent text-accent hover:text-white rounded border border-accent/20 hover:border-accent text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95"
            >
              Pick from backlog
            </button>
            <button
              onClick={onAdd}
              className="btn-std px-5 hover:bg-white/5 text-slate-500 hover:text-white rounded text-[10px] font-bold uppercase tracking-widest transition-all"
            >
              New Unit
            </button>
          </div>
        </div>
      ))}
    </>
  );
}

function DoneTaskRow({ task }: { task: { _id: Id<"tasks">; title: string; projectName: string } }) {
  const updateStatus = useMutation(api.tasks.updateStatus);
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-white/[0.01] border border-white/5 group hover:bg-white/[0.02] transition-all">
      <div className="w-5 h-5 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-500/40">
        <CheckCircle2 className="w-3 h-3" />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-xs text-slate-500 uppercase font-bold tracking-widest block mb-0.5 opacity-50">{task.projectName}</span>
        <span className="text-sm text-slate-500 line-through truncate block">{task.title}</span>
      </div>
      <button
        onClick={() => updateStatus({ id: task._id, status: "todo" })}
        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all"
        title="Undo"
      >
        <Undo2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function TaskPickerModal({ projects, onClose }: { projects: any[]; onClose: () => void }) {
  const [selectedProjectId, setSelectedProjectId] = useState<Id<"projects"> | null>(projects[0]?._id);
  const tasks = useQuery(api.tasks.listByProject, selectedProjectId ? { projectId: selectedProjectId } : "skip");
  const setPriority = useMutation(api.tasks.setListPriority);

  const availableTasks = tasks?.filter(t => t.status !== "done" && !t.listPriority) || [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-[#181b21] border border-white/10 rounded-xl p-8 w-full max-w-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col max-h-[85vh] animate-in zoom-in-95 slide-in-from-bottom-5 duration-500">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Pick from backlog</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Select objective for immediate deployment</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 shrink-0 min-h-[50px] items-center">
          {projects.map(p => (
            <button
              key={p._id}
              onClick={() => setSelectedProjectId(p._id)}
              className={`h-9 px-4 rounded text-[10px] font-bold uppercase tracking-widest whitespace-nowrap border transition-all flex items-center justify-center ${selectedProjectId === p._id ? 'bg-accent border-accent text-white shadow-lg shadow-accent/20' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'}`}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {availableTasks.map(t => (
            <button
              key={t._id}
              onClick={() => { setPriority({ id: t._id, priority: "today" }); onClose(); }}
              className="w-full text-left p-5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-accent/40 hover:bg-white/[0.04] transition-all group flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{t.title}</p>
                {t.totalSubtasks > 0 && (
                  <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1.5">{t.doneSubtasks}/{t.totalSubtasks} steps defined</p>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-slate-800 group-hover:text-accent transition-colors" />
            </button>
          ))}
          {availableTasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center text-slate-700">
              <Archive className="w-10 h-10 mb-4 opacity-10" />
              <p className="text-xs font-bold uppercase tracking-widest italic font-medium">Terminal Backlog Clear</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AddProjectModal({ onClose }: { onClose: () => void }) {
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-[#181b21] border border-white/10 rounded-xl p-10 w-full max-w-md shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-5 duration-500">
        <h2 className="text-lg font-bold text-white tracking-tight mb-8">Initialize Active Core</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-1">Core Identity</label>
            <input
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-lg px-5 py-4 text-white text-sm focus:outline-none focus:border-accent transition-all placeholder:text-slate-800 font-medium"
              placeholder="e.g., Project X"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-1">Mission Parameters</label>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-lg px-5 py-4 text-white text-sm focus:outline-none focus:border-accent transition-all placeholder:text-slate-800 font-medium min-h-[100px] resize-none"
              placeholder="Operational description..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-1">Strategic Weight</label>
            <div className="grid grid-cols-3 gap-2">
              {(["low", "medium", "high"] as const).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`py-3 rounded text-[10px] font-bold uppercase tracking-widest border transition-all ${priority === p ? 'bg-accent/10 border-accent text-accent shadow-lg shadow-accent/5' : 'bg-white/5 border-white/5 text-slate-500'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="btn-std flex-1 text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-white transition-colors">Abort</button>
            <button className="btn-std flex-1 bg-accent hover:bg-accent-hover text-white rounded text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-accent/20 transition-all active:scale-95">Initialize Core</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddTaskModal({ projects, onClose }: { projects: any[]; onClose: () => void }) {
  const createTask = useMutation(api.tasks.create);
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState(projects[0]?._id);
  const [priority, setPriority] = useState<"today" | "this_week" | undefined>("today");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !projectId) return;
    await createTask({ projectId, title: title.trim(), listPriority: priority });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-[#181b21] border border-white/10 rounded-xl p-10 w-full max-w-md shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-5 duration-500">
        <h2 className="text-lg font-bold text-white tracking-tight mb-8">Initialize Mission Unit</h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Objective Concept</label>
            <input
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-lg px-5 py-4 text-white text-sm focus:outline-none focus:border-accent transition-all placeholder:text-slate-800 font-medium"
              placeholder="Enter brief description..."
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Operational Core</label>
            <div className="relative">
              <select
                className="w-full appearance-none bg-white/5 border border-white/10 rounded-lg px-5 py-4 text-white text-sm focus:outline-none focus:border-accent transition-all cursor-pointer font-medium"
                value={projectId}
                onChange={e => setProjectId(e.target.value as Id<"projects">)}
              >
                {projects.map(p => <option key={p._id} value={p._id} className="bg-[#181b21]">{p.name}</option>)}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Pipeline Priority</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPriority("today")}
                className={`py-3 rounded text-[10px] font-bold uppercase tracking-widest border transition-all ${priority === "today" ? 'bg-accent/10 border-accent text-accent shadow-lg shadow-accent/5' : 'bg-white/5 border-white/5 text-slate-500'}`}
              >
                Immediate
              </button>
              <button
                type="button"
                onClick={() => setPriority("this_week")}
                className={`py-3 rounded text-[10px] font-bold uppercase tracking-widest border transition-all ${priority === "this_week" ? 'bg-purple/10 border-purple text-purple shadow-lg shadow-purple/5' : 'bg-white/5 border-white/5 text-slate-500'}`}
              >
                Deferred
              </button>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="btn-std flex-1 text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-white transition-colors">Discard</button>
            <button className="btn-std flex-1 bg-accent hover:bg-accent-hover text-white rounded text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-accent/20 transition-all active:scale-95">Deploy Unit</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DailyLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1115]">
      <div className="flex flex-col items-center gap-6">
        <div className="w-10 h-10 rounded border-2 border-accent border-t-transparent animate-spin" />
        <p className="text-[10px] font-bold text-slate-700 uppercase tracking-[0.2em] animate-pulse">Establishing Neural Link</p>
      </div>
    </div>
  );
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
