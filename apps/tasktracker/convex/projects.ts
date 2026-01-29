import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all projects with computed completion %
export const list = query({
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").collect();

    const projectsWithStats = await Promise.all(
      projects.map(async (project) => {
        const tasks = await ctx.db
          .query("tasks")
          .withIndex("by_project", (q) => q.eq("projectId", project._id))
          .collect();

        const totalTasks = tasks.length;
        const doneTasks = tasks.filter((t) => t.status === "done").length;
        const completionPercent = totalTasks > 0
          ? Math.round((doneTasks / totalTasks) * 100)
          : 0;

        return { ...project, completionPercent, totalTasks, doneTasks };
      })
    );

    return projectsWithStats.sort((a, b) => a.order - b.order);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("projects"),
    status: v.union(
      v.literal("active"),
      v.literal("blocked"),
      v.literal("completed"),
      v.literal("planning")
    )
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    priority: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
  },
  handler: async (ctx, args) => {
    const slug = args.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    const projects = await ctx.db.query("projects").collect();
    const order = projects.length;

    const projectId = await ctx.db.insert("projects", {
      name: args.name,
      slug,
      description: args.description,
      status: "active",
      priority: args.priority,
      order,
    });

    await ctx.db.insert("actionLogs", {
      action: "project_created",
      description: `Initialized new active core: ${args.name}`,
      timestamp: Date.now(),
    });

    return projectId;
  },
});
