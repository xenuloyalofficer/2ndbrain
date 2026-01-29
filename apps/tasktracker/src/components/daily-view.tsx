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
  Clock,
  Sparkles,
  MoreHorizontal,
  Archive,
  Undo2,
  Play,
  X
} from "lucide-react";

export function DailyView() {
  const todayTasks = useQuery(api.tasks.listByPriority, { priority: "today" });
  const weekTasks = useQuery(api.tasks.listByPriority, { priority: "this_week" });
  const doneTasks = useQuery(api.tasks.listDoneThisWeek);
  const projects = useQuery(api.projects.list);
  const actionLogs = useQuery(api.actionLogs.list, { limit: 8 });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showPickerModal, setShowPickerModal] = useState(false);
  const [showDone, setShowDone] = useState(false);

  const isLoading = !todayTasks || !weekTasks || !doneTasks || !projects;

  if (isLoading) return <DailyLoading />;

  // Filter out done tasks from today/week lists
  const activeTodayTasks = todayTasks.filter(t => t.status !== "done");
  const activeWeekTasks = weekTasks.filter(t => t.status !== "done");

  const todayCount = activeTodayTasks.length;

  return (
    <div className="min-h-screen pb-24 selection:bg-accent/30">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/5 mx-4 mt-4 rounded-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              {/* Rune Avatar */}
              <div className="relative group">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent via-orange-500 to-purple flex items-center justify-center text-xl shadow-lg shadow-accent/20 transition-transform group-hover:scale-105 duration-300">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background online-indicator" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white/90">
                  Rune <span className="text-accent underline decoration-accent/30 underline-offset-4">Dashboard</span>
                </h1>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mt-0.5">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Today Progress */}
              <div className="hidden sm:flex items-center gap-4 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                <div className="text-right">
                  <div className="text-sm font-bold text-accent">{todayCount}/3 tasks</div>
                  <div className="w-20 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all duration-500"
                      style={{ width: `${(todayCount / 3) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="group flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 active:translate-y-0"
              >
                <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                <span>New Task</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* TODAY Section */}
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-accent/10 rounded-xl border border-accent/20">
                  <Flame className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white/90">Daily Focus</h2>
                  <p className="text-sm text-muted-foreground">The most important 3 things</p>
                </div>
                <div className="ml-auto flex items-center gap-3">
                  <span className="text-sm font-bold text-muted-foreground/50 tracking-tighter">{todayCount}<span className="mx-0.5">/</span>3</span>
                  <div className="flex gap-1.5 p-1 bg-white/5 rounded-full border border-white/5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${i < todayCount ? 'bg-accent shadow-[0_0_8px_rgba(249,115,22,0.6)]' : 'bg-white/10'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
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

            {/* THIS WEEK Section */}
            <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-purple/10 rounded-xl border border-purple/20">
                  <Calendar className="w-5 h-5 text-purple" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white/90">Coming Up</h2>
                  <p className="text-sm text-muted-foreground">Tasks for this week</p>
                </div>
                <span className="ml-auto bg-white/5 px-3 py-1 rounded-full text-xs font-bold text-muted-foreground border border-white/5">
                  {activeWeekTasks.length} queued
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeWeekTasks.map((task) => (
                  <TaskCard key={task._id} task={task} variant="week" />
                ))}

                {activeWeekTasks.length === 0 && (
                  <div className="col-span-2 py-12 text-center bg-[#141417] border border-[#27272a] rounded-2xl">
                    <Calendar className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                    <p className="text-sm text-zinc-500">No tasks queued for this week</p>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="mt-3 text-sm text-purple-400 hover:text-purple-300"
                    >
                      + Add a task
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* DONE THIS WEEK Section */}
            <section>
              <button
                onClick={() => setShowDone(!showDone)}
                className="flex items-center gap-3 mb-4 w-full text-left"
              >
                <div className="p-2 bg-emerald-500/15 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Done This Week</h2>
                  <p className="text-xs text-zinc-500">{doneTasks.length} completed</p>
                </div>
                <ChevronRight className={`ml-auto w-5 h-5 text-zinc-500 transition-transform ${showDone ? 'rotate-90' : ''}`} />
              </button>

              {showDone && (
                <div className="space-y-1 glass p-5 rounded-2xl animate-in fade-in zoom-in-95 duration-300">
                  {doneTasks.map((task) => (
                    <DoneTaskRow key={task._id} task={task} />
                  ))}
                  {doneTasks.length === 0 && (
                    <p className="text-sm text-muted-foreground py-6 text-center italic">Nothing completed yet. Time to crush some goals! 🚀</p>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Quick Stats */}
            <div className="glass p-6 rounded-2xl animate-in fade-in slide-in-from-right-4 duration-700">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                <div className="w-1 h-3 bg-accent rounded-full" />
                Performance
              </h3>
              <div className="space-y-5">
                <div className="flex items-center justify-between group">
                  <span className="text-sm text-muted-foreground group-hover:text-white transition-colors">Completed</span>
                  <span className="text-xl font-black text-success tabular-nums">{doneTasks.length}</span>
                </div>
                <div className="flex items-center justify-between group">
                  <span className="text-sm text-muted-foreground group-hover:text-white transition-colors">In Queue</span>
                  <span className="text-xl font-black text-purple tabular-nums">{activeWeekTasks.length}</span>
                </div>
                <div className="flex items-center justify-between group">
                  <span className="text-sm text-muted-foreground group-hover:text-white transition-colors">Active Projects</span>
                  <span className="text-xl font-black text-accent tabular-nums">
                    {projects.filter(p => p.status === 'active').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Log */}
            <div className="glass p-6 rounded-2xl animate-in fade-in slide-in-from-right-8 duration-700 delay-150">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                <div className="w-1 h-3 bg-purple rounded-full" />
                Pulse
              </h3>
              <div className="space-y-5">
                {actionLogs && actionLogs.length > 0 ? (
                  actionLogs.map((log) => (
                    <div key={log._id} className="flex gap-4 group">
                      <div className="relative flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-accent group-hover:scale-125 transition-transform" />
                        <div className="w-px flex-1 bg-white/10 my-1" />
                      </div>
                      <div className="pb-1">
                        <p className="text-xs font-medium text-white/80 leading-relaxed group-hover:text-white transition-colors">{log.description}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                          {formatTimeAgo(log.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground italic">Silence is golden...</p>
                )}
              </div>
            </div>

            {/* Projects Quick Access */}
            <div className="glass p-6 rounded-2xl animate-in fade-in slide-in-from-right-12 duration-700 delay-300">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                <div className="w-1 h-3 bg-success rounded-full" />
                Workspaces
              </h3>
              <div className="space-y-3">
                {projects.slice(0, 5).map((project) => (
                  <button
                    key={project._id}
                    onClick={() => {
                      if (typeof window !== "undefined" && (window as any).__tasktracker) {
                        (window as any).__tasktracker.openProject(project._id);
                      }
                    }}
                    className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all group text-left border border-transparent hover:border-white/5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-sm font-black text-white/50 group-hover:text-accent group-hover:bg-accent/10 group-hover:scale-110 transition-all duration-300">
                      {project.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate text-white/90 group-hover:text-white transition-colors">{project.name}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-accent to-success rounded-full transition-all duration-1000"
                            style={{ width: `${project.completionPercent}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-black text-muted-foreground">{project.completionPercent}%</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Add Modal */}
      {showAddModal && (
        <AddTaskModal
          projects={projects}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Picker Modal - pick from backlog */}
      {showPickerModal && (
        <TaskPickerModal
          projects={projects}
          onClose={() => setShowPickerModal(false)}
        />
      )}
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
    blockedReason?: string;
  };
  variant: "today" | "week"
}) {
  const updateStatus = useMutation(api.tasks.updateStatus);
  const setPriority = useMutation(api.tasks.setListPriority);
  const [showMenu, setShowMenu] = useState(false);

  const isToday = variant === "today";
  const hasSubtasks = task.totalSubtasks > 0;
  const progress = hasSubtasks ? (task.doneSubtasks / task.totalSubtasks) * 100 : 0;
  const isInProgress = task.status === "in_progress";

  const handleComplete = () => {
    updateStatus({ id: task._id, status: "done" });
  };

  const handleStart = () => {
    updateStatus({ id: task._id, status: "in_progress" });
    setShowMenu(false);
  };

  const moveToToday = () => {
    setPriority({ id: task._id, priority: "today" });
    setShowMenu(false);
  };

  const moveToWeek = () => {
    setPriority({ id: task._id, priority: "this_week" });
    setShowMenu(false);
  };

  const removeFromList = () => {
    setPriority({ id: task._id, priority: undefined });
    setShowMenu(false);
  };

  return (
    <div
      className={`
        group relative glass-card p-5 rounded-2xl
        ${isToday ? 'border-accent/20 bg-accent/5' : ''}
        ${isInProgress ? 'ring-1 ring-accent/30 shadow-[0_0_20px_rgba(249,115,22,0.1)]' : ''}
      `}
    >
      {/* In Progress indicator */}
      {isInProgress && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/10 px-2 py-1 rounded-full border border-accent/20">
          <Clock className="w-3 h-3" />
          Live
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={handleComplete}
          className={`
            mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all checkmark-bounce
            ${isToday
              ? 'border-accent/40 hover:border-accent hover:bg-accent/20'
              : 'border-white/20 hover:border-white/40 hover:bg-white/5'
            }
          `}
          title="Mark as done"
        >
          <CheckCircle2 className="w-4 h-4 opacity-0 group-hover:opacity-40" />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white/90 pr-12 leading-snug group-hover:text-white transition-colors">
            {task.title}
          </h3>

          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <span className={`
              text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border
              ${isToday
                ? 'bg-accent/10 text-accent border-accent/20'
                : 'bg-purple/10 text-purple border-purple/20'
              }
            `}>
              {task.projectName}
            </span>

            {hasSubtasks && (
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-accent to-purple rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground">{task.doneSubtasks}/{task.totalSubtasks}</span>
              </div>
            )}

            {task.blockedReason && (
              <span className="text-xs text-red-400 flex items-center gap-1">
                🔴 Blocked
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Quick action: Move to Today (only for week tasks) */}
          {!isToday && (
            <button
              onClick={moveToToday}
              className="p-2 rounded-xl hover:bg-amber-500/20 text-zinc-400 hover:text-amber-400 transition-colors"
              title="Move to Today"
            >
              <Flame className="w-4 h-4" />
            </button>
          )}

          {/* Quick action: Start (only if not in progress) */}
          {!isInProgress && (
            <button
              onClick={handleStart}
              className="p-2 rounded-xl hover:bg-emerald-500/20 text-zinc-400 hover:text-emerald-400 transition-colors"
              title="Start working"
            >
              <Play className="w-4 h-4" />
            </button>
          )}

          {/* More menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-xl hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-12 z-20 glass rounded-xl p-1.5 shadow-2xl min-w-[180px] animate-in fade-in zoom-in-95 duration-200">
                  {isToday && (
                    <button
                      onClick={moveToWeek}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-purple hover:bg-purple/10 rounded-lg transition-colors"
                    >
                      <Calendar className="w-4 h-4" />
                      Move to Week
                    </button>
                  )}
                  <button
                    onClick={removeFromList}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Archive className="w-4 h-4" />
                    Archive
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DoneTaskRow({ task }: {
  task: {
    _id: Id<"tasks">;
    title: string;
    projectName: string;
  }
}) {
  const updateStatus = useMutation(api.tasks.updateStatus);
  const [showUndo, setShowUndo] = useState(false);

  const handleUndo = () => {
    updateStatus({ id: task._id, status: "todo" });
  };

  return (
    <div
      className="flex items-center gap-3 py-2 group"
      onMouseEnter={() => setShowUndo(true)}
      onMouseLeave={() => setShowUndo(false)}
    >
      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
      <span className="text-sm line-through text-zinc-500 flex-1">{task.title}</span>
      <span className="text-xs text-zinc-600">{task.projectName}</span>

      {showUndo && (
        <button
          onClick={handleUndo}
          className="p-1 rounded hover:bg-zinc-700 text-zinc-500 hover:text-white transition-colors"
          title="Undo - mark as not done"
        >
          <Undo2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

function EmptySlots({ count, onPick, onAdd }: { count: number; onPick: () => void; onAdd: () => void }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-full p-6 border-2 border-dashed border-white/5 rounded-2xl flex items-center justify-center gap-6 group hover:border-accent/30 hover:bg-accent/5 transition-all cursor-pointer"
        >
          <button
            onClick={onPick}
            className="flex items-center gap-2.5 px-5 py-2.5 bg-accent/10 group-hover:bg-accent text-accent group-hover:text-white rounded-xl transition-all font-bold text-sm"
          >
            <Flame className="w-4 h-4" />
            Pick from backlog
          </button>
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/30 group-hover:text-accent/30">Or</span>
          <button
            onClick={onAdd}
            className="flex items-center gap-2.5 px-5 py-2.5 hover:bg-white/5 text-muted-foreground hover:text-white rounded-xl transition-all font-bold text-sm"
          >
            <Plus className="w-4 h-4" />
            Create new
          </button>
        </div>
      ))}
    </>
  );
}

function TaskPickerModal({ projects, onClose }: {
  projects: Array<{ _id: Id<"projects">; name: string; slug: string }>;
  onClose: () => void;
}) {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const tasks = useQuery(
    api.tasks.listByProject,
    selectedProject ? { projectId: selectedProject as Id<"projects"> } : "skip"
  );
  const setPriority = useMutation(api.tasks.setListPriority);

  const availableTasks = tasks?.filter(t => t.status !== "done" && !t.listPriority) || [];

  const addToToday = async (taskId: Id<"tasks">) => {
    try {
      await setPriority({ id: taskId, priority: "today" });
      onClose();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to add task");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={onClose}>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
      <div
        className="relative glass rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[85vh] flex flex-col border-white/10 animate-in zoom-in-95 slide-in-from-bottom-10 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white/90">Curate Focus</h2>
            <p className="text-sm text-muted-foreground mt-1">Select a task from your backlog</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Project selector */}
        <div className="mb-8">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 block">Source Project</label>
          <div className="flex flex-wrap gap-2.5">
            {projects.map(p => (
              <button
                key={p._id}
                onClick={() => setSelectedProject(p._id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${selectedProject === p._id
                  ? 'bg-accent border-accent text-white shadow-lg shadow-accent/20'
                  : 'bg-white/5 border-white/5 text-muted-foreground hover:border-white/20'
                  }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Task list */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {!selectedProject && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <ChevronRight className="w-6 h-6 text-muted-foreground/30 rotate-90" />
              </div>
              <p className="text-sm font-bold text-muted-foreground/50 italic tracking-tight">Select a workspace above</p>
            </div>
          )}

          {selectedProject && availableTasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <CheckCircle2 className="w-10 h-10 text-success/30 mb-4" />
              <p className="text-sm font-bold text-muted-foreground/50 italic tracking-tight">Project backlog is empty</p>
            </div>
          )}

          {availableTasks.map(task => (
            <button
              key={task._id}
              onClick={() => addToToday(task._id)}
              className="w-full flex items-center gap-4 p-4 glass-card rounded-2xl transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                <Flame className="w-5 h-5 text-accent group-hover:text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white/90 truncate group-hover:text-white">{task.title}</p>
                {task.totalSubtasks > 0 && (
                  <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mt-1 group-hover:text-white/50">{task.doneSubtasks}/{task.totalSubtasks} steps</p>
                )}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-accent opacity-0 group-hover:opacity-100 transition-opacity">Add</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AddTaskModal({ projects, onClose }: {
  projects: Array<{ _id: Id<"projects">; name: string; slug: string }>;
  onClose: () => void
}) {
  const createTask = useMutation(api.tasks.create);
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState(projects[0]?._id || "");
  const [priority, setPriority] = useState<"today" | "this_week" | undefined>("this_week");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !projectId) return;

    setIsSubmitting(true);
    try {
      await createTask({
        projectId: projectId as Id<"projects">,
        title: title.trim(),
        listPriority: priority,
      });
      onClose();
    } catch (error) {
      console.error("Failed to create task:", error);
      alert(error instanceof Error ? error.message : "Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={onClose}>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
      <div
        className="relative glass rounded-3xl p-8 w-full max-w-md shadow-2xl border-white/10 animate-in zoom-in-95 slide-in-from-bottom-10 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white/90">Initialize Task</h2>
            <p className="text-sm text-muted-foreground mt-1">What's the mission today?</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block px-1">Concept</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task description..."
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/40 focus:bg-white/[0.08] transition-all font-medium"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block px-1">Workspace</label>
            <select
              value={projectId as string}
              onChange={(e) => setProjectId(e.target.value as Id<"projects">)}
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white appearance-none focus:outline-none focus:border-accent/40 focus:bg-white/[0.08] transition-all font-medium cursor-pointer"
            >
              {projects.map(p => (
                <option key={p._id} value={p._id} className="bg-background text-white">{p.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block px-1">Priority Pipeline</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPriority("today")}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${priority === "today"
                  ? 'bg-accent/10 border-accent text-accent shadow-lg shadow-accent/10'
                  : 'bg-white/5 border-white/5 text-muted-foreground hover:border-white/20'
                  }`}
              >
                <Flame className="w-5 h-5 mb-2" />
                <span className="text-[10px] font-black uppercase tracking-tighter">Today</span>
              </button>
              <button
                type="button"
                onClick={() => setPriority("this_week")}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${priority === "this_week"
                  ? 'bg-purple/10 border-purple text-purple shadow-lg shadow-purple/10'
                  : 'bg-white/5 border-white/5 text-muted-foreground hover:border-white/20'
                  }`}
              >
                <Calendar className="w-5 h-5 mb-2" />
                <span className="text-[10px] font-black uppercase tracking-tighter">Week</span>
              </button>
              <button
                type="button"
                onClick={() => setPriority(undefined)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${priority === undefined
                  ? 'bg-white/10 border-white/40 text-white'
                  : 'bg-white/5 border-white/5 text-muted-foreground hover:border-white/20'
                  }`}
              >
                <Archive className="w-5 h-5 mb-2" />
                <span className="text-[10px] font-black uppercase tracking-tighter">Backlog</span>
              </button>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl border border-white/5 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:bg-white/5 transition-all"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="flex-[2] px-6 py-4 bg-accent hover:bg-accent-hover text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-accent/20 hover:-translate-y-0.5"
            >
              {isSubmitting ? "Processing..." : "Deploy Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DailyLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="relative group">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent via-orange-500 to-purple flex items-center justify-center text-3xl mx-auto mb-6 animate-shimmer shadow-2xl shadow-accent/20 border border-white/10">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-accent blur-xl opacity-20 mx-auto animate-pulse" />
        </div>
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/90">Curating Systems</h2>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2">Connecting to Neural Network...</p>
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
