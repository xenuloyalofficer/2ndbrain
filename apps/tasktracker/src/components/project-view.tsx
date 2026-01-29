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
  MoreHorizontal
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
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#09090b]/80 border-b border-[#27272a]">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 rounded-xl hover:bg-[#1a1a1f] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex-1">
              <h1 className="text-xl font-bold">{project.name}</h1>
              <p className="text-sm text-zinc-500">{project.description}</p>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent">
                {project.completionPercent}%
              </div>
              <p className="text-xs text-zinc-500">{project.doneTasks}/{project.totalTasks} tasks</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${project.completionPercent}%` }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Quick Actions */}
        <div className="flex gap-3">
          <button 
            onClick={() => setShowAddTask(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/25"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
          
          {project.githubPath && (
            <a 
              href={project.githubPath}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 border border-[#27272a] rounded-xl hover:bg-[#1a1a1f] transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              GitHub
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
    <div className={`rounded-2xl border ${colorClasses[color]} overflow-hidden`}>
      <button 
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors"
      >
        {icon}
        <span className="font-semibold">{title}</span>
        <span className="text-sm text-zinc-500">({count})</span>
        <ChevronDown className={`ml-auto w-5 h-5 text-zinc-500 transition-transform ${expanded ? '' : '-rotate-90'}`} />
      </button>
      
      {expanded && (
        <div className="px-4 pb-4 space-y-2">
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

  const handleComplete = () => {
    updateStatus({ id: task._id, status: "done" });
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
    <div className="group relative bg-[#141417] border border-[#27272a] rounded-xl p-4 hover:border-[#3f3f46] transition-colors">
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button 
          onClick={isDone ? undefined : handleComplete}
          className={`
            mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0
            ${isDone 
              ? 'bg-emerald-500 border-emerald-500' 
              : 'border-zinc-600 hover:border-amber-500 hover:bg-amber-500/10'
            }
          `}
        >
          {isDone && <CheckCircle2 className="w-3 h-3 text-white" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className={`font-medium ${isDone ? 'line-through text-zinc-500' : ''}`}>
              {task.title}
            </h4>
            
            {task.listPriority === "today" && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">
                TODAY
              </span>
            )}
            {task.listPriority === "this_week" && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400">
                WEEK
              </span>
            )}
          </div>

          {task.blockedReason && (
            <p className="text-sm text-red-400 mt-1">⚠️ {task.blockedReason}</p>
          )}

          {hasSubtasks && (
            <div className="flex items-center gap-2 mt-2">
              <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-zinc-500">{task.doneSubtasks}/{task.totalSubtasks}</span>
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
                <div className="absolute right-0 top-8 z-20 bg-[#1a1a1f] border border-[#27272a] rounded-xl p-1 shadow-xl min-w-[140px]">
                  {task.status === "todo" && (
                    <button 
                      onClick={handleStart}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-zinc-700 rounded-lg transition-colors"
                    >
                      <Clock className="w-4 h-4 text-amber-500" />
                      Start
                    </button>
                  )}
                  <button 
                    onClick={addToToday}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-zinc-700 rounded-lg transition-colors"
                  >
                    <Flame className="w-4 h-4 text-amber-500" />
                    Add to Today
                  </button>
                  <button 
                    onClick={addToWeek}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-zinc-700 rounded-lg transition-colors"
                  >
                    <Calendar className="w-4 h-4 text-purple-500" />
                    Add to Week
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div 
        className="relative bg-[#141417] border border-[#27272a] rounded-2xl p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4">Add Task</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500/50 transition-colors"
            autoFocus
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-[#27272a] rounded-xl hover:bg-[#1a1a1f] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="flex-1 px-4 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl transition-colors disabled:opacity-50"
            >
              Add
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
