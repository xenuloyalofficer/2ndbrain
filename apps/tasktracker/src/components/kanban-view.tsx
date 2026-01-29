"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, CheckCircle2, Circle, Play, AlertCircle, ChevronDown, Flame, Zap, Target, Layers } from "lucide-react";

type TaskStatus = "todo" | "in_progress" | "done" | "blocked";

const columns: { id: TaskStatus; label: string; color: string; icon: any; accentColor: string }[] = [
  { id: "todo", label: "Operations", color: "border-white/5", icon: Circle, accentColor: "bg-slate-500" },
  { id: "in_progress", label: "Live", color: "border-accent/40", icon: Play, accentColor: "bg-accent" },
  { id: "done", label: "Resolved", color: "border-emerald-500/20", icon: CheckCircle2, accentColor: "bg-emerald-500" },
  { id: "blocked", label: "Stalled", color: "border-rose-500/20", icon: AlertCircle, accentColor: "bg-rose-500" },
];

export function KanbanView() {
  const projects = useQuery(api.projects.list);
  const actionLogs = useQuery(api.actionLogs.list, { limit: 12 });
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  if (!projects) return <KanbanLoading />;

  const activeProject = selectedProject
    ? projects.find(p => p._id === selectedProject)
    : projects.find(p => p.status === "active") || projects[0];

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 flex selection:bg-accent/30">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-[#0f1115]/90 backdrop-blur-md border-b border-white/5 p-8 sticky top-0 z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="logo-container">
                <img src="/rune-small.png" alt="Rune" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">System <span className="text-accent">Command</span></h1>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  Operational Core Matrix
                </p>
              </div>
            </div>

            {/* Project Selector - stylized */}
            <div className="relative group">
              <div className="absolute inset-0 bg-accent/5 blur-xl group-hover:bg-accent/10 transition-all opacity-0 group-hover:opacity-100" />
              <select
                value={activeProject?._id || ""}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="relative bg-[#181b21] border border-white/10 rounded px-6 h-11 text-xs font-bold uppercase tracking-widest text-slate-300 appearance-none focus:outline-none focus:border-accent transition-all cursor-pointer pr-12 group-hover:border-white/20 shadow-xl"
              >
                {projects.map((p) => (
                  <option key={p._id} value={p._id} className="bg-[#181b21] text-white">
                    {p.name} • {p.completionPercent}%
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none group-hover:text-accent transition-colors" />
            </div>
          </div>
        </header>

        {/* Kanban Board */}
        {activeProject ? (
          <KanbanBoard projectId={activeProject._id as Id<"projects">} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-600 uppercase text-[10px] font-bold tracking-[0.2em] italic">
            No active deployments detected
          </div>
        )}
      </div>

      {/* Pulse Sidebar - Modernized */}
      <aside className="w-80 bg-[#181b21]/30 border-l border-white/5 overflow-y-auto hidden xl:flex flex-col">
        <div className="p-8 pb-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-3">
            <div className="w-1 h-3 bg-accent rounded-full" />
            System Pulse
          </h3>
        </div>

        <div className="flex-1 p-8 space-y-8">
          {actionLogs && actionLogs.length > 0 ? (
            actionLogs.map((log) => (
              <div key={log._id} className="relative pl-6 group">
                <div className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-accent group-hover:animate-pulse transition-all shadow-[0_0_8px_rgba(59,130,246,0)] group-hover:shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                <div className="absolute left-[2.5px] top-4 w-[1px] h-[calc(100%+20px)] bg-white/5 last:hidden" />
                <p className="text-[11px] font-medium text-slate-400 leading-relaxed group-hover:text-slate-200 transition-colors">{log.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">{formatTimeAgo(log.timestamp)}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
              <Zap className="w-8 h-8 mb-4" />
              <p className="text-[10px] font-bold uppercase tracking-widest">Waiting for signal...</p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

function KanbanBoard({ projectId }: { projectId: Id<"projects"> }) {
  const tasks = useQuery(api.tasks.listByProject, { projectId });
  const updateStatus = useMutation(api.tasks.updateStatus);

  if (!tasks) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent animate-spin rounded-full" />
    </div>
  );

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
      updateStatus({ id: taskId as Id<"tasks">, status: newStatus });
    }
  };

  return (
    <div className="flex-1 p-8 overflow-x-auto scrollbar-none">
      <div className="grid grid-cols-4 gap-8 h-full min-w-[1200px] items-start">
        {columns.map((column) => (
          <div
            key={column.id}
            className={`flex flex-col rounded-xl border ${column.color} bg-white/[0.01] h-fit max-h-full`}
            onDrop={(e) => handleDrop(e, column.id)}
            onDragOver={(e) => e.preventDefault()}
          >
            {/* Column Header */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${column.accentColor} shadow-[0_0_8px_currentColor]`} />
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">{column.label}</h3>
              </div>
              <Badge variant="secondary" className="bg-white/5 text-[10px] font-bold tabular-nums text-slate-500 border-white/5 px-2 py-0">
                {tasksByStatus[column.id].length}
              </Badge>
            </div>

            {/* Column Body */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar min-h-[500px]">
              {tasksByStatus[column.id].map((task) => (
                <KanbanCard key={task._id} task={task} />
              ))}

              {tasksByStatus[column.id].length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 opacity-5 pointer-events-none">
                  <column.icon className="w-10 h-10" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KanbanCard({ task }: { task: any }) {
  const isDone = task.status === "done";
  const isInProgress = task.status === "in_progress";
  const isBlocked = task.status === "blocked";
  const hasSubtasks = task.totalSubtasks > 0;
  const progress = hasSubtasks ? (task.doneSubtasks / task.totalSubtasks) * 100 : 0;

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("taskId", task._id);
        e.currentTarget.classList.add("opacity-40");
      }}
      onDragEnd={(e) => {
        e.currentTarget.classList.remove("opacity-40");
      }}
      className={`bg-[#181b21] rounded-lg p-5 border border-white/5 cursor-grab active:cursor-grabbing hover:border-accent/40 hover:bg-[#1e232b] transition-all group shadow-lg ${isInProgress ? 'ring-1 ring-accent/20' : ''}`}
    >
      <div className="flex flex-col gap-4">
        <p className={`text-sm font-medium leading-relaxed transition-all ${isDone ? 'line-through text-slate-600' : 'text-slate-300 group-hover:text-white'}`}>
          {task.title}
        </p>

        {isBlocked && task.blockedReason && (
          <div className="flex items-start gap-2 p-2.5 bg-rose-500/5 border border-rose-500/10 rounded">
            <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
            <p className="text-[10px] font-medium text-rose-400 leading-tight">Blocked: {task.blockedReason}</p>
          </div>
        )}

        {hasSubtasks && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Resolution</span>
              <span className="text-[9px] font-bold text-slate-500 tabular-nums">{task.doneSubtasks}/{task.totalSubtasks}</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div
                className={`h-full transition-all duration-700 ${isDone ? 'bg-emerald-500/50' : 'bg-accent'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function KanbanLoading() {
  return (
    <div className="min-h-screen bg-[#0f1115] flex flex-col items-center justify-center p-8">
      <div className="relative group mb-6">
        <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center shadow-2xl shadow-accent/20">
          <Layers className="w-7 h-7 text-white" />
        </div>
        <div className="absolute inset-0 w-14 h-14 rounded-xl bg-accent blur-2xl opacity-20 animate-pulse" />
      </div>
      <p className="text-[10px] font-bold text-slate-700 uppercase tracking-[0.2em] animate-pulse">Establishing Command Grid</p>
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
