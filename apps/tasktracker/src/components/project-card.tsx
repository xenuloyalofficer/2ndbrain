"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronRight, Clock, Target, CheckCircle2 } from "lucide-react";
import { Id } from "../../convex/_generated/dataModel";

interface Project {
  _id: Id<"projects">;
  name: string;
  slug: string;
  description: string;
  status: "active" | "blocked" | "completed" | "planning";
  priority: "high" | "medium" | "low";
  order: number;
  completionPercent: number;
  totalTasks: number;
  doneTasks: number;
}

export function ProjectCard({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false);
  const tasks = useQuery(api.tasks.listByProject, expanded ? { projectId: project._id } : "skip");
  const updateStatus = useMutation(api.tasks.updateStatus);

  const priorityColors = {
    high: "text-accent border-accent/20 bg-accent/5",
    medium: "text-slate-400 border-white/10 bg-white/5",
    low: "text-slate-600 border-white/5 bg-white/[0.02]"
  };

  return (
    <Card className="bg-[#181b21] border border-white/5 rounded-lg overflow-hidden group transition-all hover:border-white/10">
      <CardHeader
        className="cursor-pointer p-6 hover:bg-white/[0.01] transition-all"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={`p-1.5 rounded bg-white/5 border border-white/10 transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`}>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>
            <CardTitle className="text-lg font-bold text-white tracking-tight group-hover:text-accent transition-colors">{project.name}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm ${priorityColors[project.priority]}`}>
              {project.priority}
            </Badge>
            <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm border-white/10 text-slate-500">
              {project.status}
            </Badge>
          </div>
        </div>

        <div className="ml-12 space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-accent transition-all duration-1000 shadow-[0_0_8px_rgba(59,130,246,0.3)]" style={{ width: `${project.completionPercent}%` }} />
            </div>
            <span className="text-xs font-bold text-slate-500 tabular-nums">{project.completionPercent}%</span>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
              <Target className="w-3 h-3" />
              <span>{project.doneTasks}/{project.totalTasks} operations</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              <span>Active Core</span>
            </div>
          </div>
        </div>
      </CardHeader>

      {expanded && tasks && (
        <div className="px-6 pb-6 ml-12 space-y-3 animate-in fade-in slide-in-from-top-2">
          {tasks.map((task) => (
            <div key={task._id} className="flex items-center gap-4 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group/task">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateStatus({ id: task._id, status: task.status === 'done' ? 'todo' : 'done' });
                }}
                className={`w-5 h-5 rounded border transition-all ${task.status === 'done' ? 'bg-emerald-500 border-emerald-500' : 'border-slate-700 hover:border-accent bg-black/20'}`}
              >
                {task.status === 'done' && <CheckCircle2 className="w-3.5 h-3.5 text-white mx-auto" />}
              </button>
              <div className="flex-1 min-w-0">
                <span className={`text-sm font-medium block truncate ${task.status === 'done' ? 'line-through text-slate-600' : 'text-slate-400 group-hover/task:text-slate-200'}`}>
                  {task.title}
                </span>
              </div>
              {task.totalSubtasks > 0 && (
                <span className="text-[9px] font-bold text-slate-700 tabular-nums">{task.doneSubtasks}/{task.totalSubtasks} steps</span>
              )}
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="py-6 text-center border border-dashed border-white/5 rounded-lg">
              <p className="text-[10px] text-slate-700 font-bold uppercase tracking-widest italic">No mission data recorded</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
