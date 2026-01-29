"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Id } from "../../convex/_generated/dataModel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const statusColors: Record<string, string> = {
  active: "bg-success-muted text-success border-success/20",
  blocked: "bg-danger-muted text-danger border-danger/20",
  completed: "bg-purple-muted text-purple border-purple/20",
  planning: "bg-warning-muted text-warning border-warning/20",
};

const priorityColors: Record<string, string> = {
  high: "bg-accent/10 text-accent border-accent/20",
  medium: "bg-white/10 text-white/70 border-white/10",
  low: "bg-white/5 text-white/40 border-white/5",
};

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
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const prevCompletionRef = useRef(project.completionPercent);

  const tasks = useQuery(
    api.tasks.listByProject,
    expanded ? { projectId: project._id } : "skip"
  );

  const updateProjectStatus = useMutation(api.projects.updateStatus);

  // Detect when project reaches 100% completion
  useEffect(() => {
    if (
      project.completionPercent === 100 &&
      prevCompletionRef.current < 100 &&
      project.totalTasks > 0
    ) {
      setShowCompleteDialog(true);
    }
    prevCompletionRef.current = project.completionPercent;
  }, [project.completionPercent, project.totalTasks]);

  const handleHideProject = () => {
    updateProjectStatus({ id: project._id, status: "completed" });
    setShowCompleteDialog(false);
  };

  return (
    <>
      <Card className="glass-card border-white/5 group overflow-hidden">
        <CardHeader
          className="cursor-pointer p-6"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-xl glass transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`}>
                <ChevronRight className="w-4 h-4 text-white/50" />
              </div>
              <CardTitle className="text-xl font-black tracking-tight text-white/90 group-hover:text-white transition-colors">
                {project.name}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border ${priorityColors[project.priority]}`}>
                {project.priority}
              </Badge>
              <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border ${statusColors[project.status]}`}>
                {project.status}
              </Badge>
            </div>
          </div>
          <div className="ml-12">
            <div className="flex items-center gap-4">
              <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <Progress
                  value={project.completionPercent}
                  className="h-full bg-gradient-to-r from-accent to-purple transition-all duration-1000"
                />
              </div>
              <span className="text-xs font-black text-white/30 tabular-nums">
                {project.completionPercent}%
              </span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-3 flex items-center gap-2">
              <span className="text-white/60">{project.doneTasks}</span>
              <span className="text-white/20">/</span>
              <span>{project.totalTasks} operations</span>
            </p>
          </div>
        </CardHeader>

        {expanded && tasks && (
          <CardContent className="pt-0">
            <div className="ml-8 space-y-2">
              {tasks.map((task) => (
                <TaskItem key={task._id} task={task} />
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      <AlertDialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle>All tasks complete!</AlertDialogTitle>
            <AlertDialogDescription>
              Hide "{project.name}" from the dashboard?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700">
              Keep visible
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleHideProject}
              className="bg-green-600 hover:bg-green-700"
            >
              Yes, hide
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

interface Subtask {
  _id: Id<"subtasks">;
  taskId: Id<"tasks">;
  title: string;
  done: boolean;
  order: number;
}

interface Task {
  _id: Id<"tasks">;
  projectId: Id<"projects">;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done" | "blocked";
  aiPrompt?: string;
  blockedReason?: string;
  order: number;
  subtasks: Subtask[];
  totalSubtasks: number;
  doneSubtasks: number;
}

function TaskItem({ task }: { task: Task }) {
  const [expanded, setExpanded] = useState(false);
  const updateStatus = useMutation(api.tasks.updateStatus);
  const toggleSubtask = useMutation(api.subtasks.toggle);

  const taskStatusColors: Record<string, string> = {
    todo: "border-white/10 bg-white/5",
    in_progress: "border-accent/30 bg-accent/5",
    done: "border-success/30 bg-success/5",
    blocked: "border-danger/30 bg-danger/5",
  };

  const handleToggle = () => {
    const newStatus = task.status === "done" ? "todo" : "done";
    updateStatus({ id: task._id, status: newStatus });
  };

  return (
    <div className={`border rounded-xl p-4 transition-all hover:translate-x-1 ${taskStatusColors[task.status]}`}>
      <div className="flex items-start gap-4">
        <Checkbox
          checked={task.status === "done"}
          onCheckedChange={handleToggle}
          className="mt-1 checkmark-bounce"
        />
        <div className="flex-1">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => task.subtasks.length > 0 && setExpanded(!expanded)}
          >
            <span className={`font-bold transition-all ${task.status === "done" ? "line-through text-white/20" : "text-white/80"}`}>
              {task.title}
            </span>
            {task.status === "blocked" && (
              <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest bg-danger/10 text-danger border-danger/20 px-2 py-0">
                blocked
              </Badge>
            )}
            {task.subtasks.length > 0 && (
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">
                {task.doneSubtasks}<span className="mx-0.5">/</span>{task.totalSubtasks}
              </span>
            )}
          </div>

          {expanded && task.subtasks.length > 0 && (
            <div className="mt-2 ml-4 space-y-1">
              {task.subtasks.map((subtask) => (
                <div key={subtask._id} className="flex items-center gap-2">
                  <Checkbox
                    checked={subtask.done}
                    onCheckedChange={() => toggleSubtask({ id: subtask._id })}
                    className="h-4 w-4"
                  />
                  <span
                    className={`text-sm ${subtask.done ? "line-through text-zinc-500" : "text-zinc-300"}`}
                  >
                    {subtask.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
