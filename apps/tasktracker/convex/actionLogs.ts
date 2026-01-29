import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("actionLogs")
      .withIndex("by_timestamp")
      .order("desc")
      .take(args.limit || 20);
    
    return logs;
  },
});

export const log = mutation({
  args: {
    projectId: v.optional(v.id("projects")),
    taskId: v.optional(v.id("tasks")),
    action: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("actionLogs", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

export const clear = mutation({
  args: {},
  handler: async (ctx) => {
    const logs = await ctx.db.query("actionLogs").collect();
    for (const log of logs) {
      await ctx.db.delete(log._id);
    }
  },
});
