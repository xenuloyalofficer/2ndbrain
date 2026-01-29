import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("blocked"),
      v.literal("completed"),
      v.literal("planning")
    ),
    priority: v.union(
      v.literal("high"),
      v.literal("medium"),
      v.literal("low")
    ),
    order: v.number(),
    localPath: v.optional(v.string()),
    githubPath: v.optional(v.string()),
  }).index("by_slug", ["slug"]),

  tasks: defineTable({
    projectId: v.id("projects"),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("done"),
      v.literal("blocked")
    ),
    aiPrompt: v.optional(v.string()),
    blockedReason: v.optional(v.string()),
    order: v.number(),
  }).index("by_project", ["projectId"]),

  subtasks: defineTable({
    taskId: v.id("tasks"),
    title: v.string(),
    done: v.boolean(),
    order: v.number(),
  }).index("by_task", ["taskId"]),

  actionLogs: defineTable({
    projectId: v.optional(v.id("projects")),
    taskId: v.optional(v.id("tasks")),
    action: v.string(),
    description: v.string(),
    timestamp: v.number(),
  }).index("by_timestamp", ["timestamp"]),
});
