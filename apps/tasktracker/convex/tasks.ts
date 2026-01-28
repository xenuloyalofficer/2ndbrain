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
    await ctx.db.patch(args.id, {
      status: args.status,
      blockedReason: args.blockedReason,
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

    return await ctx.db.insert("tasks", {
      ...args,
      status: "todo",
      order,
    });
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
