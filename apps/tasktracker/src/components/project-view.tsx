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
  Calendar,
  ChevronDown,
  ExternalLink,
  MoreHorizontal,
  Play,
  Undo2,
  X
} from "lucide-react";

interface ProjectViewProps {
  projectId: Id<"projects">;
  onBack: () => void;
}

export function ProjectView({ projectId, onBack }: ProjectViewProps) {
  const projects = useQuery(api.projects.list);
  const tasks = useQuery(api.tasks.listByProject, { projectId });
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    blocked: true,
    inProgress: true,
    todo: true,
    done: false,
  });

  const project = projects?.find(p => p._id === projectId);

  if (!project || !tasks) return <ProjectLoading />;

  const blockedTasks = tasks.filter(t => t.status === "blocked");
  const inProgressTasks = tasks.filter(t => t.status === "in_progress");
  const todoTasks = tasks.filter(t => t.status === "todo");
  const doneTasks = tasks.filter(t => t.status === "done");

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/5 mx-4 mt-4 rounded-2xl">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <div className="flex items-center gap-6">
            <button
              onClick={onBack}
              className="p-2.5 rounded-xl hover:bg-white/5 transition-all active:scale-95 group border border-white/5"
            >
              <ChevronLeft className="w-5 h-5 text-white/50 group-hover:text-white" />
            </button>

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-black tracking-tight text-white/90 truncate">{project.name}</h1>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1 truncate">{project.description}</p>
            </div>

            <div className="text-right flex items-center gap-6">
              <div>
                <div className="text-3xl font-black text-white tabular-nums">
                  {project.completionPercent}<span className="text-accent text-xl ml-1">%</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">{project.doneTasks}/{project.totalTasks} operations</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-accent via-purple to-success rounded-full transition-all duration-1000"
              style={{ width: `${project.completionPercent}%` }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Quick Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => setShowAddTask(true)}
            className="group flex items-center gap-2.5 px-6 py-3 bg-accent hover:bg-accent-hover text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
            Initialize Task
          </button>

          {project.githubPath && (
            <a
              href={project.githubPath}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 px-6 py-3 border border-white/5 rounded-2xl hover:bg-white/5 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-all"
            >
              <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-white" />
              Source Control
            </a>
          )}
        </div>

        {/* Blocked Section */}
        {blockedTasks.length > 0 && (
          <TaskSection
            title="Blocked"
            icon={<AlertCircle className="w-5 h-5 text-red-500" />}
            count={blockedTasks.length}
            color="red"
            expanded={expandedSections.blocked}
            onToggle={() => toggleSection("blocked")}
          >
            {blockedTasks.map(task => (
              <ProjectTaskCard key={task._id} task={task} />
            ))}
          </TaskSection>
        )}

        {/* In Progress Section */}
        <TaskSection
          title="In Progress"
          icon={<Clock className="w-5 h-5 text-amber-500" />}
          count={inProgressTasks.length}
          color="amber"
          expanded={expandedSections.inProgress}
          onToggle={() => toggleSection("inProgress")}
        >
          {inProgressTasks.length > 0 ? (
            inProgressTasks.map(task => (
              <ProjectTaskCard key={task._id} task={task} />
            ))
          ) : (
            <EmptyState message="No tasks in progress" />
          )}
        </TaskSection>

        {/* To Do Section */}
        <TaskSection
          title="To Do"
          icon={<Circle className="w-5 h-5 text-zinc-500" />}
          count={todoTasks.length}
          color="zinc"
          expanded={expandedSections.todo}
          onToggle={() => toggleSection("todo")}
        >
          {todoTasks.length > 0 ? (
            todoTasks.map(task => (
              <ProjectTaskCard key={task._id} task={task} />
            ))
          ) : (
            <EmptyState message="All tasks started!" />
          )}
        </TaskSection>

        {/* Done Section */}
        <TaskSection
          title="Done"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          count={doneTasks.length}
          color="emerald"
          expanded={expandedSections.done}
          onToggle={() => toggleSection("done")}
        >
          {doneTasks.length > 0 ? (
            doneTasks.map(task => (
              <ProjectTaskCard key={task._id} task={task} />
            ))
          ) : (
            <EmptyState message="Nothing completed yet" />
          )}
        </TaskSection>
      </main>

      {/* Add Task Modal */}
      {showAddTask && (
        <QuickAddModal
          projectId={projectId}
          onClose={() => setShowAddTask(false)}
        />
      )}
    </div>
  );
}

function TaskSection({
  title,
  icon,
  count,
  color,
  expanded,
  onToggle,
  children
}: {
  title: string;
  icon: React.ReactNode;
  count: number;
  color: "red" | "amber" | "zinc" | "emerald";
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const colorClasses = {
    red: "bg-red-500/10 border-red-500/20",
    amber: "bg-amber-500/10 border-amber-500/20",
    zinc: "bg-zinc-800/50 border-zinc-700/50",
    emerald: "bg-emerald-500/10 border-emerald-500/20",
  };

  return (
    <div className={`rounded-3xl border ${colorClasses[color]} overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 backdrop-blur-sm`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-5 hover:bg-white/5 transition-all group"
      >
        <div className="p-2 rounded-xl glass group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <span className="text-sm font-black uppercase tracking-widest text-white/90">{title}</span>
        <span className="text-xs font-bold text-muted-foreground opacity-50 tabular-nums">({count})</span>
        <div className={`ml-auto p-1.5 rounded-lg glass transition-transform duration-300 ${expanded ? '' : '-rotate-90'}`}>
          <ChevronDown className="w-4 h-4 text-white/30" />
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}

function ProjectTaskCard({ task }: {
  task: {
    _id: Id<"tasks">;
    title: string;
    status: string;
    totalSubtasks: number;
    doneSubtasks: number;
    blockedReason?: string;
    listPriority?: "today" | "this_week";
  }
}) {
  const updateStatus = useMutation(api.tasks.updateStatus);
  const setPriority = useMutation(api.tasks.setListPriority);
  const [showActions, setShowActions] = useState(false);

  const hasSubtasks = task.totalSubtasks > 0;
  const progress = hasSubtasks ? (task.doneSubtasks / task.totalSubtasks) * 100 : 0;
  const isDone = task.status === "done";
  const isInProgress = task.status === "in_progress";

  const handleComplete = () => {
    updateStatus({ id: task._id, status: "done" });
  };

  const handleUndo = () => {
    updateStatus({ id: task._id, status: "todo" });
  };

  const handleStart = () => {
    updateStatus({ id: task._id, status: "in_progress" });
  };

  const addToToday = () => {
    setPriority({ id: task._id, priority: "today" });
    setShowActions(false);
  };

  const addToWeek = () => {
    setPriority({ id: task._id, priority: "this_week" });
    setShowActions(false);
  };

  return (
    <div className="group relative glass-card p-5 rounded-2xl animate-in slide-in-from-left-2 duration-300">
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={isDone ? handleUndo : handleComplete}
          className={`
            mt-1 w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 checkmark-bounce
            ${isDone
              ? 'bg-success border-success hover:bg-success-hover'
              : 'border-white/20 hover:border-accent hover:bg-accent/10'
            }
          `}
          title={isDone ? "Undo - mark as not done" : "Mark as done"}
        >
          {isDone && <CheckCircle2 className="w-3 h-3 text-white" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h4 className={`text-sm font-bold tracking-tight transition-all ${isDone ? 'line-through text-white/20' : 'text-white/90 group-hover:text-white'}`}>
              {task.title}
            </h4>

            {isInProgress && (
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-accent/10 text-accent border border-accent/20 flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                Live
              </span>
            )}

            {task.listPriority === "today" && (
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-accent/10 text-accent border border-accent/20">
                Today
              </span>
            )}
            {task.listPriority === "this_week" && (
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple/10 text-purple border border-purple/20">
                Week
              </span>
            )}
          </div>

          {task.blockedReason && (
            <p className="text-sm text-red-400 mt-1">⚠️ {task.blockedReason}</p>
          )}

          {hasSubtasks && (
            <div className="flex items-center gap-3 mt-3">
              <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-accent to-success rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{task.doneSubtasks}/{task.totalSubtasks}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        {!isDone && (
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-1.5 rounded-lg hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showActions && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowActions(false)} />
                <div className="absolute right-0 top-10 z-20 glass rounded-xl p-1.5 shadow-2xl min-w-[170px] animate-in fade-in zoom-in-95 duration-200">
                  {!isInProgress && (
                    <button
                      onClick={() => { handleStart(); setShowActions(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-[10px] font-black uppercase tracking-widest text-success hover:bg-success/10 rounded-lg transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      Initialize
                    </button>
                  )}
                  <button
                    onClick={addToToday}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-[10px] font-black uppercase tracking-widest text-accent hover:bg-accent/10 rounded-lg transition-colors"
                  >
                    <Flame className="w-4 h-4" />
                    Set to Today
                  </button>
                  <button
                    onClick={addToWeek}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-[10px] font-black uppercase tracking-widest text-purple hover:bg-purple/10 rounded-lg transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    Set to Week
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function QuickAddModal({ projectId, onClose }: {
  projectId: Id<"projects">;
  onClose: () => void;
}) {
  const createTask = useMutation(api.tasks.create);
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await createTask({
        projectId,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={onClose}>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
      <div
        className="relative glass rounded-3xl p-8 w-full max-w-md shadow-2xl border-white/10 animate-in zoom-in-95 slide-in-from-bottom-10 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white/90">Initialize Task</h2>
            <p className="text-sm text-muted-foreground mt-1">What's the next mission?</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              className="flex-[2] px-6 py-4 bg-accent hover:bg-accent-hover text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all disabled:opacity-50 shadow-xl shadow-accent/20 active:scale-95"
            >
              {isSubmitting ? "Processing..." : "Deploy Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-6 text-center text-sm text-zinc-600">
      {message}
    </div>
  );
}

function ProjectLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-3xl mx-auto mb-4 animate-pulse">
          📁
        </div>
        <p className="text-zinc-500">Loading project...</p>
      </div>
    </div>
  );
}
