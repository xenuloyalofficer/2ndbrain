import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    const tasksWithSubtasks = await Promise.all(
      tasks.map(async (task) => {
        const subtasks = await ctx.db
          .query("subtasks")
          .withIndex("by_task", (q) => q.eq("taskId", task._id))
          .collect();

        const totalSubtasks = subtasks.length;
        const doneSubtasks = subtasks.filter((s) => s.done).length;

        return {
          ...task,
          subtasks: subtasks.sort((a, b) => a.order - b.order),
          totalSubtasks,
          doneSubtasks
        };
      })
    );

    return tasksWithSubtasks.sort((a, b) => a.order - b.order);
  },
});

// Get tasks by list priority (today, this_week)
export const listByPriority = query({
  args: { priority: v.union(v.literal("today"), v.literal("this_week")) },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_list_priority", (q) => q.eq("listPriority", args.priority))
      .collect();

    const tasksWithDetails = await Promise.all(
      tasks.map(async (task) => {
        const project = await ctx.db.get(task.projectId);
        const subtasks = await ctx.db
          .query("subtasks")
          .withIndex("by_task", (q) => q.eq("taskId", task._id))
          .collect();

        return {
          ...task,
          projectName: project?.name || "Unknown",
          projectSlug: project?.slug || "",
          subtasks: subtasks.sort((a, b) => a.order - b.order),
          totalSubtasks: subtasks.length,
          doneSubtasks: subtasks.filter((s) => s.done).length,
        };
      })
    );

    return tasksWithDetails.sort((a, b) => a.order - b.order);
  },
});

// Get recently completed tasks (this week)
export const listDoneThisWeek = query({
  args: {},
  handler: async (ctx) => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    
    const allTasks = await ctx.db.query("tasks").collect();
    const doneTasks = allTasks.filter(
      (t) => t.status === "done" && t.completedAt && t.completedAt > oneWeekAgo
    );

    const tasksWithDetails = await Promise.all(
      doneTasks.map(async (task) => {
        const project = await ctx.db.get(task.projectId);
        return {
          ...task,
          projectName: project?.name || "Unknown",
          projectSlug: project?.slug || "",
        };
      })
    );

    return tasksWithDetails.sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("tasks"),
    status: v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("done"),
      v.literal("blocked")
    ),
    blockedReason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (!task) return;

    const updates: Record<string, unknown> = {
      status: args.status,
      blockedReason: args.blockedReason,
    };

    // If marking as done, record completion time and clear list priority
    if (args.status === "done") {
      updates.completedAt = Date.now();
      updates.listPriority = undefined;
    }

    await ctx.db.patch(args.id, updates);

    // Log the action
    const statusLabels: Record<string, string> = {
      todo: "To Do",
      in_progress: "In Progress",
      done: "Done",
      blocked: "Blocked",
    };

    let action = "updated";
    let description = `"${task.title}" → ${statusLabels[args.status]}`;

    if (args.status === "done") {
      action = "completed";
      description = `✅ Completed "${task.title}"`;
    } else if (args.status === "in_progress") {
      action = "started";
      description = `▶️ Started "${task.title}"`;
    } else if (args.status === "blocked") {
      action = "blocked";
      description = `🔴 Blocked "${task.title}"${args.blockedReason ? `: ${args.blockedReason}` : ""}`;
    }

    await ctx.db.insert("actionLogs", {
      projectId: task.projectId,
      taskId: args.id,
      action,
      description,
      timestamp: Date.now(),
    });
  },
});

// Set list priority (move to today/this_week)
export const setListPriority = mutation({
  args: {
    id: v.id("tasks"),
    priority: v.optional(v.union(v.literal("today"), v.literal("this_week"))),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (!task) return;

    // Check TODAY limit (max 3)
    if (args.priority === "today") {
      const todayTasks = await ctx.db
        .query("tasks")
        .withIndex("by_list_priority", (q) => q.eq("listPriority", "today"))
        .collect();
      
      // Don't count the current task if it's already in today
      const otherTodayTasks = todayTasks.filter((t) => t._id !== args.id);
      if (otherTodayTasks.length >= 3) {
        throw new Error("TODAY list is full (max 3). Complete or move a task first.");
      }
    }

    await ctx.db.patch(args.id, { listPriority: args.priority });

    // Log the action
    const project = await ctx.db.get(task.projectId);
    const priorityLabels: Record<string, string> = {
      today: "TODAY 🔥",
      this_week: "THIS WEEK",
    };

    await ctx.db.insert("actionLogs", {
      projectId: task.projectId,
      taskId: args.id,
      action: "prioritized",
      description: args.priority 
        ? `📌 "${task.title}" → ${priorityLabels[args.priority]}`
        : `📤 "${task.title}" → Backlog`,
      timestamp: Date.now(),
    });
  },
});

export const create = mutation({
  args: {
    projectId: v.id("projects"),
    title: v.string(),
    description: v.optional(v.string()),
    aiPrompt: v.optional(v.string()),
    listPriority: v.optional(v.union(v.literal("today"), v.literal("this_week"))),
  },
  handler: async (ctx, args) => {
    // Check TODAY limit if adding directly to today
    if (args.listPriority === "today") {
      const todayTasks = await ctx.db
        .query("tasks")
        .withIndex("by_list_priority", (q) => q.eq("listPriority", "today"))
        .collect();
      
      if (todayTasks.length >= 3) {
        throw new Error("TODAY list is full (max 3).");
      }
    }

    const existingTasks = await ctx.db
      .query("tasks")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    const order = existingTasks.length;

    const taskId = await ctx.db.insert("tasks", {
      projectId: args.projectId,
      title: args.title,
      description: args.description,
      aiPrompt: args.aiPrompt,
      listPriority: args.listPriority,
      status: "todo",
      order,
    });

    // Get project name for the log
    const project = await ctx.db.get(args.projectId);
    const projectName = project?.name || "Unknown";

    // Log the action
    await ctx.db.insert("actionLogs", {
      projectId: args.projectId,
      taskId,
      action: "created",
      description: `➕ Added "${args.title}" to ${projectName}`,
      timestamp: Date.now(),
    });

    return taskId;
  },
});

export const getNextTask = query({
  args: { projectSlug: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let projects;
    const slug = args.projectSlug;

    if (slug) {
      const project = await ctx.db
        .query("projects")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .first();
      projects = project ? [project] : [];
    } else {
      projects = await ctx.db.query("projects").collect();
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      projects.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }

    for (const project of projects) {
      if (project.status === "blocked") continue;

      const tasks = await ctx.db
        .query("tasks")
        .withIndex("by_project", (q) => q.eq("projectId", project._id))
        .collect();

      const nextTask = tasks
        .sort((a, b) => a.order - b.order)
        .find((t) => t.status === "todo" || t.status === "in_progress");

      if (nextTask) {
        return { project, task: nextTask };
      }
    }

    return null;
  },
});

export const quickAdd = mutation({
  args: {
    projectSlug: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", args.projectSlug))
      .first();
    
    if (!project) throw new Error(`Project "${args.projectSlug}" not found`);

    const existingTasks = await ctx.db
      .query("tasks")
      .withIndex("by_project", (q) => q.eq("projectId", project._id))
      .collect();

    const taskId = await ctx.db.insert("tasks", {
      projectId: project._id,
      title: args.title,
      status: "todo",
      order: existingTasks.length,
    });

    await ctx.db.insert("actionLogs", {
      projectId: project._id,
      taskId,
      action: "created",
      description: `➕ Added "${args.title}" to ${project.name}`,
      timestamp: Date.now(),
    });

    return taskId;
  },
});

// Archive done tasks (clear completedAt older than a week)
export const archiveDone = mutation({
  args: {},
  handler: async (ctx) => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    
    const allTasks = await ctx.db.query("tasks").collect();
    const oldDoneTasks = allTasks.filter(
      (t) => t.status === "done" && t.completedAt && t.completedAt < oneWeekAgo
    );

    for (const task of oldDoneTasks) {
      await ctx.db.patch(task._id, { completedAt: undefined });
    }

    return { archived: oldDoneTasks.length };
  },
});
