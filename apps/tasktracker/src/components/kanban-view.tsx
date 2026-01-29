"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

type TaskStatus = "todo" | "in_progress" | "done" | "blocked";

const columns: { id: TaskStatus; label: string; color: string; bgColor: string }[] = [
  { id: "todo", label: "To Do", color: "border-zinc-500", bgColor: "bg-zinc-500/10" },
  { id: "in_progress", label: "In Progress", color: "border-yellow-500", bgColor: "bg-yellow-500/10" },
  { id: "done", label: "Done", color: "border-green-500", bgColor: "bg-green-500/10" },
  { id: "blocked", label: "Blocked", color: "border-red-500", bgColor: "bg-red-500/10" },
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-zinc-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Rune Avatar */}
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xl">
                  🤖
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-zinc-950" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Rune Dashboard</h1>
                <p className="text-sm text-zinc-500">Online • Last sync: just now</p>
              </div>
            </div>

            {/* Project Selector */}
            <select
              value={activeProject?._id || ""}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm"
            >
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.completionPercent}%)
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* Kanban Board */}
        {activeProject && (
          <KanbanBoard projectId={activeProject._id as Id<"projects">} />
        )}
      </div>

      {/* Action Log Sidebar */}
      <aside className="w-80 border-l border-zinc-800 bg-zinc-900/50 p-4 overflow-y-auto">
        <h3 className="font-semibold mb-4 flex items-center gap-2 text-zinc-400">
          📋 Action Log
        </h3>
        <div className="space-y-3">
          {actionLogs && actionLogs.length > 0 ? (
            actionLogs.map((log) => (
              <div key={log._id} className="text-sm border-l-2 border-zinc-700 pl-3">
                <p className="text-zinc-300">{log.description}</p>
                <p className="text-xs text-zinc-500 mt-1">
                  {formatTimeAgo(log.timestamp)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-zinc-500">No recent activity</p>
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
      <div className="grid grid-cols-4 gap-4 min-w-[1000px] h-full">
        {columns.map((column) => (
          <div
            key={column.id}
            className={`flex flex-col rounded-xl border-t-2 ${column.color} ${column.bgColor} transition-all`}
            onDrop={(e) => {
              handleDrop(e, column.id);
              e.currentTarget.classList.remove("ring-2", "ring-purple-500/50");
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {/* Column Header */}
            <div className="p-4 border-b border-zinc-800/50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{column.label}</h3>
                <Badge variant="secondary" className="bg-zinc-800 text-zinc-400">
                  {tasksByStatus[column.id].length}
                </Badge>
              </div>
            </div>

            {/* Column Content */}
            <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[calc(100vh-220px)]">
              {tasksByStatus[column.id].map((task) => (
                <KanbanCard 
                  key={task._id} 
                  task={task} 
                  onToggleSubtask={(id) => toggleSubtask({ id })}
                />
              ))}
              
              {tasksByStatus[column.id].length === 0 && (
                <div className="text-center py-8 text-zinc-600 text-sm">
                  No tasks
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
      className="bg-zinc-800 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:bg-zinc-750 transition-colors border border-zinc-700/50 hover:border-zinc-600"
    >
      <p className={`text-sm font-medium ${task.status === "done" ? "line-through text-zinc-500" : ""}`}>
        {task.title}
      </p>

      {task.blockedReason && (
        <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
          ⚠️ {task.blockedReason}
        </p>
      )}

      {hasSubtasks && (
        <>
          <button
            onClick={() => setShowSubtasks(!showSubtasks)}
            className="mt-2 flex items-center gap-2 w-full"
          >
            <div className="flex-1 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full transition-all"
                style={{ width: `${(task.doneSubtasks / task.totalSubtasks) * 100}%` }}
              />
            </div>
            <span className="text-xs text-zinc-500">
              {task.doneSubtasks}/{task.totalSubtasks}
            </span>
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
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl mx-auto mb-3 animate-pulse">
          🤖
        </div>
        <p className="text-zinc-500">Loading dashboard...</p>
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
