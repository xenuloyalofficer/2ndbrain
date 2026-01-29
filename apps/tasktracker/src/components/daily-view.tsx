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
  GripVertical,
  MoreHorizontal,
  Archive
} from "lucide-react";

export function DailyView() {
  const todayTasks = useQuery(api.tasks.listByPriority, { priority: "today" });
  const weekTasks = useQuery(api.tasks.listByPriority, { priority: "this_week" });
  const doneTasks = useQuery(api.tasks.listDoneThisWeek);
  const projects = useQuery(api.projects.list);
  const actionLogs = useQuery(api.actionLogs.list, { limit: 8 });
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDone, setShowDone] = useState(false);

  const isLoading = !todayTasks || !weekTasks || !doneTasks || !projects;

  if (isLoading) return <DailyLoading />;

  const todayCount = todayTasks.length;
  const todayDone = todayTasks.filter(t => t.status === "done").length;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#09090b]/80 border-b border-[#27272a]">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Rune Avatar */}
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-xl shadow-lg shadow-amber-500/20">
                  🤖
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#09090b] online-indicator" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                  Rune Dashboard
                </h1>
                <p className="text-sm text-zinc-500">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Today Progress Ring */}
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 -rotate-90">
                  <circle 
                    cx="24" cy="24" r="20" 
                    className="fill-none stroke-zinc-800" 
                    strokeWidth="4"
                  />
                  <circle 
                    cx="24" cy="24" r="20" 
                    className="fill-none stroke-amber-500" 
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${(todayDone / Math.max(todayCount, 1)) * 125.6} 125.6`}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                  {todayDone}/{todayCount}
                </span>
              </div>

              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/25"
              >
                <Plus className="w-4 h-4" />
                Add Task
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
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-500/15 rounded-xl">
                  <Flame className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Today</h2>
                  <p className="text-xs text-zinc-500">Focus on these 3 things</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-xs text-zinc-500">{todayCount}/3</span>
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div 
                        key={i} 
                        className={`w-2 h-2 rounded-full ${i < todayCount ? 'bg-amber-500' : 'bg-zinc-700'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {todayTasks.map((task) => (
                  <TaskCard key={task._id} task={task} variant="today" />
                ))}
                
                {todayCount < 3 && (
                  <EmptySlot 
                    count={3 - todayCount} 
                    onAdd={() => setShowAddModal(true)} 
                  />
                )}
              </div>
            </section>

            {/* THIS WEEK Section */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/15 rounded-xl">
                  <Calendar className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">This Week</h2>
                  <p className="text-xs text-zinc-500">Drag to Today when ready</p>
                </div>
                <span className="ml-auto text-sm text-zinc-500">{weekTasks.length} tasks</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {weekTasks.map((task) => (
                  <TaskCard key={task._id} task={task} variant="week" />
                ))}
                
                {weekTasks.length === 0 && (
                  <div className="col-span-2 py-12 text-center">
                    <Calendar className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                    <p className="text-sm text-zinc-500">No tasks queued for this week</p>
                    <button 
                      onClick={() => setShowAddModal(true)}
                      className="mt-3 text-sm text-purple-400 hover:text-purple-300"
                    >
                      + Add from backlog
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
                <div className="space-y-2 pl-12">
                  {doneTasks.map((task) => (
                    <div 
                      key={task._id} 
                      className="flex items-center gap-3 py-2 text-zinc-500"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm line-through">{task.title}</span>
                      <span className="ml-auto text-xs">{task.projectName}</span>
                    </div>
                  ))}
                  {doneTasks.length === 0 && (
                    <p className="text-sm text-zinc-600 py-4">Nothing completed yet. Let's change that!</p>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-[#141417] border border-[#27272a] rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-zinc-400 mb-4">This Week</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-500">Completed</span>
                  <span className="text-2xl font-bold text-emerald-500">{doneTasks.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-500">In Queue</span>
                  <span className="text-2xl font-bold text-purple-500">{weekTasks.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-500">Active Projects</span>
                  <span className="text-2xl font-bold text-amber-500">
                    {projects.filter(p => p.status === 'active').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Log */}
            <div className="bg-[#141417] border border-[#27272a] rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-zinc-400 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Activity
              </h3>
              <div className="space-y-3">
                {actionLogs && actionLogs.length > 0 ? (
                  actionLogs.map((log) => (
                    <div key={log._id} className="flex gap-3">
                      <div className="w-1 rounded-full bg-gradient-to-b from-amber-500 to-transparent" />
                      <div>
                        <p className="text-sm text-zinc-300">{log.description}</p>
                        <p className="text-xs text-zinc-600 mt-0.5">
                          {formatTimeAgo(log.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-zinc-600">No recent activity</p>
                )}
              </div>
            </div>

            {/* Projects Quick Access */}
            <div className="bg-[#141417] border border-[#27272a] rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-zinc-400 mb-4">Projects</h3>
              <div className="space-y-2">
                {projects.slice(0, 5).map((project) => (
                  <button 
                    key={project._id}
                    onClick={() => {
                      if (typeof window !== "undefined" && (window as any).__tasktracker) {
                        (window as any).__tasktracker.openProject(project._id);
                      }
                    }}
                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-[#1a1a1f] transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-xs">
                      {project.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{project.name}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full"
                            style={{ width: `${project.completionPercent}%` }}
                          />
                        </div>
                        <span className="text-xs text-zinc-500">{project.completionPercent}%</span>
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

  const isToday = variant === "today";
  const hasSubtasks = task.totalSubtasks > 0;
  const progress = hasSubtasks ? (task.doneSubtasks / task.totalSubtasks) * 100 : 0;

  const handleComplete = () => {
    updateStatus({ id: task._id, status: "done" });
  };

  const moveToToday = () => {
    setPriority({ id: task._id, priority: "today" });
  };

  const moveToWeek = () => {
    setPriority({ id: task._id, priority: "this_week" });
  };

  return (
    <div 
      className={`
        group relative bg-[#141417] border rounded-2xl p-4 
        transition-all duration-200 hover:border-[#3f3f46] hover:bg-[#1a1a1f]
        ${isToday ? 'border-amber-500/30 hover:border-amber-500/50' : 'border-[#27272a]'}
        ${task.status === 'done' ? 'opacity-60' : ''}
      `}
    >
      {/* Glow effect for today items */}
      {isToday && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500/5 to-orange-500/5 pointer-events-none" />
      )}

      <div className="relative flex items-start gap-4">
        {/* Checkbox */}
        <button 
          onClick={handleComplete}
          className={`
            mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all
            ${task.status === 'done' 
              ? 'bg-emerald-500 border-emerald-500' 
              : isToday 
                ? 'border-amber-500/50 hover:border-amber-500 hover:bg-amber-500/10' 
                : 'border-zinc-600 hover:border-zinc-500 hover:bg-zinc-800'
            }
          `}
        >
          {task.status === 'done' && <CheckCircle2 className="w-4 h-4 text-white" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold ${task.status === 'done' ? 'line-through text-zinc-500' : ''}`}>
            {task.title}
          </h3>
          
          <div className="flex items-center gap-3 mt-2">
            <span className={`
              text-xs px-2 py-0.5 rounded-md
              ${isToday ? 'bg-amber-500/15 text-amber-400' : 'bg-purple-500/15 text-purple-400'}
            `}>
              {task.projectName}
            </span>

            {hasSubtasks && (
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs text-zinc-500">{task.doneSubtasks}/{task.totalSubtasks}</span>
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
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isToday && task.status !== 'done' && (
            <button 
              onClick={moveToToday}
              className="p-1.5 rounded-lg hover:bg-amber-500/20 text-zinc-400 hover:text-amber-400 transition-colors"
              title="Move to Today"
            >
              <Flame className="w-4 h-4" />
            </button>
          )}
          {isToday && task.status !== 'done' && (
            <button 
              onClick={moveToWeek}
              className="p-1.5 rounded-lg hover:bg-purple-500/20 text-zinc-400 hover:text-purple-400 transition-colors"
              title="Move to This Week"
            >
              <Calendar className="w-4 h-4" />
            </button>
          )}
          <button className="p-1.5 rounded-lg hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptySlot({ count, onAdd }: { count: number; onAdd: () => void }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={onAdd}
          className="w-full p-4 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-600 hover:border-amber-500/30 hover:text-amber-500/70 hover:bg-amber-500/5 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">Pick task #{(3 - count + i + 1)}</span>
        </button>
      ))}
    </>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div 
        className="relative bg-[#141417] border border-[#27272a] rounded-3xl p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-6">Add Task</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-zinc-400 mb-2 block">Task</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500/50 transition-colors"
              autoFocus
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400 mb-2 block">Project</label>
            <select
              value={projectId as string}
              onChange={(e) => setProjectId(e.target.value as Id<"projects">)}
              className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500/50 transition-colors"
            >
              {projects.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-zinc-400 mb-2 block">Add to</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPriority("today")}
                className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                  priority === "today" 
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-400' 
                    : 'border-[#27272a] text-zinc-400 hover:border-zinc-600'
                }`}
              >
                <Flame className="w-4 h-4 mx-auto mb-1" />
                Today
              </button>
              <button
                type="button"
                onClick={() => setPriority("this_week")}
                className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                  priority === "this_week" 
                    ? 'bg-purple-500/15 border-purple-500/50 text-purple-400' 
                    : 'border-[#27272a] text-zinc-400 hover:border-zinc-600'
                }`}
              >
                <Calendar className="w-4 h-4 mx-auto mb-1" />
                This Week
              </button>
              <button
                type="button"
                onClick={() => setPriority(undefined)}
                className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                  priority === undefined 
                    ? 'bg-zinc-500/15 border-zinc-500/50 text-zinc-400' 
                    : 'border-[#27272a] text-zinc-400 hover:border-zinc-600'
                }`}
              >
                <Archive className="w-4 h-4 mx-auto mb-1" />
                Backlog
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
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
              className="flex-1 px-4 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Adding..." : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DailyLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-3xl mx-auto mb-4 animate-pulse shadow-lg shadow-amber-500/30">
          🤖
        </div>
        <p className="text-zinc-500">Loading your tasks...</p>
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
