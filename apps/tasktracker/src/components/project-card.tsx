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
  active: "bg-green-500/20 text-green-400 border-green-500/30",
  blocked: "bg-red-500/20 text-red-400 border-red-500/30",
  completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  planning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

const priorityColors: Record<string, string> = {
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  medium: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  low: "bg-zinc-700/20 text-zinc-500 border-zinc-700/30",
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
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader
          className="cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {expanded ? (
                <ChevronDown className="w-5 h-5 text-zinc-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-zinc-400" />
              )}
              <CardTitle className="text-lg">{project.name}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={priorityColors[project.priority]}>
                {project.priority}
              </Badge>
              <Badge variant="outline" className={statusColors[project.status]}>
                {project.status}
              </Badge>
            </div>
          </div>
          <div className="ml-8 mt-2">
            <div className="flex items-center gap-3">
              <Progress value={project.completionPercent} className="h-2 flex-1" />
              <span className="text-sm text-zinc-400 w-12">
                {project.completionPercent}%
              </span>
            </div>
            <p className="text-sm text-zinc-500 mt-1">
              {project.doneTasks}/{project.totalTasks} tasks
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
    todo: "border-zinc-600",
    in_progress: "border-yellow-500 bg-yellow-500/10",
    done: "border-green-500 bg-green-500/10",
    blocked: "border-red-500 bg-red-500/10",
  };

  const handleToggle = () => {
    const newStatus = task.status === "done" ? "todo" : "done";
    updateStatus({ id: task._id, status: newStatus });
  };

  return (
    <div className={`border rounded-lg p-3 ${taskStatusColors[task.status]}`}>
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.status === "done"}
          onCheckedChange={handleToggle}
          className="mt-1"
        />
        <div className="flex-1">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => task.subtasks.length > 0 && setExpanded(!expanded)}
          >
            <span className={task.status === "done" ? "line-through text-zinc-500" : ""}>
              {task.title}
            </span>
            {task.status === "blocked" && (
              <Badge variant="outline" className="text-xs bg-red-500/20 text-red-400">
                blocked
              </Badge>
            )}
            {task.subtasks.length > 0 && (
              <span className="text-xs text-zinc-500">
                ({task.doneSubtasks}/{task.totalSubtasks})
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
