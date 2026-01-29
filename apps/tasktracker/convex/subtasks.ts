import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const toggle = mutation({
  args: { id: v.id("subtasks") },
  handler: async (ctx, args) => {
    const subtask = await ctx.db.get(args.id);
    if (!subtask) return;

    const newDone = !subtask.done;
    await ctx.db.patch(args.id, { done: newDone });

    // Get parent task for logging
    const task = await ctx.db.get(subtask.taskId);
    if (task) {
      await ctx.db.insert("actionLogs", {
        projectId: task.projectId,
        taskId: subtask.taskId,
        action: newDone ? "subtask_completed" : "subtask_unchecked",
        description: newDone 
          ? `☑️ Checked "${subtask.title}"` 
          : `⬜ Unchecked "${subtask.title}"`,
        timestamp: Date.now(),
      });
    }
  },
});

export const create = mutation({
  args: {
    taskId: v.id("tasks"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("subtasks")
      .withIndex("by_task", (q) => q.eq("taskId", args.taskId))
      .collect();

    const subtaskId = await ctx.db.insert("subtasks", {
      ...args,
      done: false,
      order: existing.length,
    });

    // Log it
    const task = await ctx.db.get(args.taskId);
    if (task) {
      await ctx.db.insert("actionLogs", {
        projectId: task.projectId,
        taskId: args.taskId,
        action: "subtask_created",
        description: `➕ Added subtask "${args.title}"`,
        timestamp: Date.now(),
      });
    }

    return subtaskId;
  },
});
