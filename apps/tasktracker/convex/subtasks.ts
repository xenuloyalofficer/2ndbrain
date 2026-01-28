import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const toggle = mutation({
  args: { id: v.id("subtasks") },
  handler: async (ctx, args) => {
    const subtask = await ctx.db.get(args.id);
    if (subtask) {
      await ctx.db.patch(args.id, { done: !subtask.done });
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

    return await ctx.db.insert("subtasks", {
      ...args,
      done: false,
      order: existing.length,
    });
  },
});
