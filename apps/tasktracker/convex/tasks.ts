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

    const oldStatus = task.status;
    
    await ctx.db.patch(args.id, {
      status: args.status,
      blockedReason: args.blockedReason,
    });

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

export const create = mutation({
  args: {
    projectId: v.id("projects"),
    title: v.string(),
    description: v.optional(v.string()),
    aiPrompt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingTasks = await ctx.db
      .query("tasks")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    const order = existingTasks.length;

    const taskId = await ctx.db.insert("tasks", {
      ...args,
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
      // Sort by priority
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

    // Log it
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
