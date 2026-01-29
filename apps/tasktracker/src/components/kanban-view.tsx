"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, CheckCircle2, Circle, Play, AlertCircle, Sparkles, ChevronDown } from "lucide-react";

type TaskStatus = "todo" | "in_progress" | "done" | "blocked";

const columns: { id: TaskStatus; label: string; color: string; bgColor: string; icon: any }[] = [
  { id: "todo", label: "Operations", color: "border-white/10", bgColor: "bg-white/5", icon: Circle },
  { id: "in_progress", label: "Live", color: "border-accent/30", bgColor: "bg-accent/5", icon: Play },
  { id: "done", label: "Resolved", color: "border-success/30", bgColor: "bg-success/5", icon: CheckCircle2 },
  { id: "blocked", label: "Stalled", color: "border-danger/30", bgColor: "bg-danger/5", icon: AlertCircle },
];

export function KanbanView() {
  const projects = useQuery(api.projects.list);
  const actionLogs = useQuery(api.actionLogs.list, { limit: 15 });
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  if (!projects) return <KanbanLoading />;

  const activeProject = selectedProject
    ? projects.find(p => p._id === selectedProject)
    : projects.find(p => p.status === "active") || projects[0];

  return (
    <div className="min-h-screen bg-background text-foreground flex selection:bg-accent/30">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="glass border-b border-white/5 p-6 mx-4 mt-4 rounded-2xl">
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
                <h1 className="text-xl font-black tracking-tight text-white/90">
                  Rune <span className="text-accent underline decoration-accent/30 underline-offset-4 tracking-tighter">Command</span>
                </h1>
                <p className="text-[10px] font-bold text-success uppercase tracking-widest mt-0.5">Systems Online • Real-time Sync</p>
              </div>
            </div>

            {/* Project Selector */}
            <div className="relative group">
              <select
                value={activeProject?._id || ""}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="bg-white/5 border border-white/5 rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white/70 appearance-none focus:outline-none focus:border-accent/40 focus:bg-white/[0.08] transition-all cursor-pointer pr-12 group-hover:bg-white/[0.08]"
              >
                {projects.map((p) => (
                  <option key={p._id} value={p._id} className="bg-background text-white">
                    {p.name} • {p.completionPercent}%
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none group-hover:text-accent transition-colors" />
            </div>
          </div>
        </header>

        {/* Kanban Board */}
        {activeProject && (
          <KanbanBoard projectId={activeProject._id as Id<"projects">} />
        )}
      </div>

      {/* Action Log Sidebar */}
      <aside className="w-80 glass border-l border-white/5 p-6 overflow-y-auto hidden lg:block">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-8 flex items-center gap-3">
          <div className="w-1.5 h-4 bg-accent rounded-full" />
          System Pulse
        </h3>
        <div className="space-y-6">
          {actionLogs && actionLogs.length > 0 ? (
            actionLogs.map((log) => (
              <div key={log._id} className="relative pl-6 group">
                <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-white/10 group-hover:bg-accent group-hover:scale-125 transition-all" />
                <div className="absolute left-[3.5px] top-4 w-[1px] h-[calc(100%+12px)] bg-white/5" />
                <p className="text-xs font-bold text-white/80 leading-relaxed group-hover:text-white transition-colors">{log.description}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mt-1.5">
                  {formatTimeAgo(log.timestamp)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground italic text-center py-12">Waiting for operations...</p>
          )}
        </div>
      </aside>
    </div>
  );
}

function KanbanBoard({ projectId }: { projectId: Id<"projects"> }) {
  const tasks = useQuery(api.tasks.listByProject, { projectId });
  const updateStatus = useMutation(api.tasks.updateStatus);
  const toggleSubtask = useMutation(api.subtasks.toggle);

  if (!tasks) return <div className="p-8 text-zinc-500">Loading tasks...</div>;

  const tasksByStatus: Record<TaskStatus, typeof tasks> = {
    todo: tasks.filter(t => t.status === "todo"),
    in_progress: tasks.filter(t => t.status === "in_progress"),
    done: tasks.filter(t => t.status === "done"),
    blocked: tasks.filter(t => t.status === "blocked"),
  };

  const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) {
      updateStatus({
        id: taskId as Id<"tasks">,
        status: newStatus
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("ring-2", "ring-purple-500/50");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("ring-2", "ring-purple-500/50");
  };

  return (
    <div className="flex-1 p-6 overflow-x-auto">
      <div className="grid grid-cols-4 gap-6 min-w-[1200px] h-full items-start">
        {columns.map((column, index) => (
          <div
            key={column.id}
            className={`flex flex-col rounded-3xl border-t-2 ${column.color} ${column.bgColor} transition-all animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[${index * 100}ms] backdrop-blur-sm`}
            onDrop={(e) => {
              handleDrop(e, column.id);
              e.currentTarget.classList.remove("ring-2", "ring-accent/30");
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {/* Column Header */}
            <div className="p-5 border-b border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <column.icon className="w-4 h-4 text-white/30" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-white/90">{column.label}</h3>
                </div>
                <Badge variant="secondary" className="bg-white/5 border border-white/10 text-[10px] font-black tabular-nums text-white/40 px-2 py-0">
                  {tasksByStatus[column.id].length}
                </Badge>
              </div>
            </div>

            {/* Column Content */}
            <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-250px)] custom-scrollbar">
              {tasksByStatus[column.id].map((task) => (
                <KanbanCard
                  key={task._id}
                  task={task}
                  onToggleSubtask={(id) => toggleSubtask({ id })}
                />
              ))}

              {tasksByStatus[column.id].length === 0 && (
                <div className="text-center py-20 text-white/10 text-[10px] font-black uppercase tracking-widest italic">
                  Systems Neutral
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KanbanCard({
  task,
  onToggleSubtask
}: {
  task: any;
  onToggleSubtask: (id: Id<"subtasks">) => void;
}) {
  const [showSubtasks, setShowSubtasks] = useState(false);
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("taskId", task._id);
        e.currentTarget.classList.add("opacity-50");
      }}
      onDragEnd={(e) => {
        e.currentTarget.classList.remove("opacity-50");
      }}
      className="glass-card rounded-2xl p-5 cursor-grab active:cursor-grabbing hover:bg-white/5 transition-all group animate-in zoom-in-95 duration-200"
    >
      <p className={`text-sm font-bold tracking-tight text-white/90 group-hover:text-white transition-colors leading-relaxed ${task.status === "done" ? "line-through text-white/20" : ""}`}>
        {task.title}
      </p>

      {task.blockedReason && (
        <p className="text-[10px] font-bold uppercase tracking-widest text-danger mt-3 flex items-center gap-2 bg-danger/10 p-2 rounded-lg border border-danger/20">
          <AlertCircle className="w-3.5 h-3.5" />
          Blocked: {task.blockedReason}
        </p>
      )}

      {hasSubtasks && (
        <>
          <button
            onClick={() => setShowSubtasks(!showSubtasks)}
            className="mt-4 flex flex-col gap-2 w-full group/progress"
          >
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-accent to-success rounded-full transition-all duration-1000"
                style={{ width: `${(task.doneSubtasks / task.totalSubtasks) * 100}%` }}
              />
            </div>
            <div className="flex justify-between items-center w-full">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover/progress:text-accent transition-colors">
                Progress Matrix
              </span>
              <span className="text-[10px] font-black text-muted-foreground tabular-nums">
                {task.doneSubtasks}/{task.totalSubtasks}
              </span>
            </div>
          </button>

          {showSubtasks && (
            <div className="mt-2 space-y-1.5 pl-1">
              {task.subtasks.map((subtask: any) => (
                <div key={subtask._id} className="flex items-center gap-2">
                  <Checkbox
                    checked={subtask.done}
                    onCheckedChange={() => onToggleSubtask(subtask._id)}
                    className="h-3.5 w-3.5"
                  />
                  <span className={`text-xs ${subtask.done ? "line-through text-zinc-500" : "text-zinc-400"}`}>
                    {subtask.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function KanbanLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <div className="relative group mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent via-orange-500 to-purple flex items-center justify-center text-3xl mx-auto animate-shimmer shadow-2xl shadow-accent/20 border border-white/10">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-accent blur-xl opacity-20 mx-auto animate-pulse" />
      </div>
      <div className="text-center">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/90">Curating Neural Board</h2>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2 underline-offset-4 decoration-accent/30 underline">Establishing Secure Link...</p>
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
