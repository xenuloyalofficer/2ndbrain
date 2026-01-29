# CLI PROMPT: Build Task Tracker for 2ndbrain

## Mission

Build a task tracking web app inside the 2ndbrain repo at `/apps/tasktracker/`. This app will be used by Clawdbot (via Telegram) to help Maria manage her 6 projects.

## Technical Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Convex
- **Styling**: Tailwind CSS + shadcn/ui
- **Deployment**: Vercel

## Step 1: Initialize Project

```bash
cd C:\Users\maria\Desktop\pessoal\2nd-brain
mkdir -p apps/tasktracker
cd apps/tasktracker

# Create Next.js app
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Add Convex
npm install convex
npx convex dev --once  # Initialize Convex project

# Add shadcn/ui
npx shadcn@latest init
npx shadcn@latest add card button checkbox badge progress collapsible
```

## Step 2: Convex Schema

Create `convex/schema.ts`:

```typescript
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
});
```

## Step 3: Convex Functions

Create `convex/projects.ts`:

```typescript
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
```

Create `convex/tasks.ts`:

```typescript
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
    
    if (args.projectSlug) {
      const project = await ctx.db
        .query("projects")
        .withIndex("by_slug", (q) => q.eq("slug", args.projectSlug))
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
```

Create `convex/subtasks.ts`:

```typescript
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
```

## Step 4: Seed Data

Create `convex/seed.ts`:

```typescript
import { mutation } from "./_generated/server";

export const seedAll = mutation({
  handler: async (ctx) => {
    // Check if already seeded
    const existing = await ctx.db.query("projects").first();
    if (existing) {
      console.log("Already seeded, skipping...");
      return;
    }

    // PROJECT 1: Jocril E-commerce
    const jocrilId = await ctx.db.insert("projects", {
      name: "Jocril E-commerce",
      slug: "jocril-ecommerce",
      description: "E-commerce store for Jocril. ~80% complete, closest to launch.",
      status: "active",
      priority: "high",
      order: 0,
      localPath: "C:\\Users\\maria\\Desktop\\pessoal\\jocril\\SITES\\loja-jocril",
      githubPath: "projects/jocril-ecommerce",
    });

    const jocrilTasks = [
      { title: "Import products and pricing data", aiPrompt: "In jocril-ecommerce, analyze product data and import to Convex. Check for CSV/JSON files first." },
      { title: "Finalize product catalog structure" },
      { title: "Test template-variant system" },
      { title: "Review storefront UI" },
      { title: "Complete checkout flow", aiPrompt: "Implement full checkout: cart → shipping → payment → confirmation." },
      { title: "Test payment integration" },
      { title: "Set up email notifications (Resend)", aiPrompt: "Integrate Resend for order confirmation, shipping updates, welcome email." },
      { title: "Admin panel polish" },
      { title: "Deploy to production" },
      { title: "LAUNCH 🚀" },
    ];

    for (let i = 0; i < jocrilTasks.length; i++) {
      await ctx.db.insert("tasks", {
        projectId: jocrilId,
        title: jocrilTasks[i].title,
        status: "todo",
        order: i,
        aiPrompt: jocrilTasks[i].aiPrompt,
      });
    }

    // PROJECT 2: Take It Down
    const takeItDownId = await ctx.db.insert("projects", {
      name: "Take It Down",
      slug: "take-it-down",
      description: "Privacy complaint tool for YouTube harassment. 8-week roadmap to beta.",
      status: "active",
      priority: "high",
      order: 1,
      localPath: "C:\\Users\\maria\\Desktop\\pessoal\\take-it-down\\privacy-complaint-tool",
      githubPath: "projects/take-it-down",
    });

    const tidTasks = [
      {
        title: "Verify YouTube Format Compliance",
        subtasks: [
          "Screenshot YouTube privacy complaint form",
          "Screenshot YouTube defamation complaint form",
          "Document character limits for each field",
          "Test current output - copy-paste to YouTube",
          "Update templates to match YouTube exactly",
        ],
      },
      {
        title: "Add Legal Disclaimers",
        subtasks: [
          "Draft disclaimer text",
          "Create DisclaimerBanner component",
          "Add to landing page, wizard, reports",
          "Update Terms of Service",
        ],
      },
      {
        title: "Write About Page",
        subtasks: [
          "Write Maria's story (decide: anonymous?)",
          "Explain why tool exists",
          "Explain pricing (API costs)",
          "Add resources section",
        ],
      },
      {
        title: "Calculate API Costs",
        subtasks: [
          "Run 3-5 test complaints",
          "Check OpenRouter usage",
          "Calculate cost per complaint",
          "Determine break-even point",
        ],
      },
      {
        title: "Define Pricing Model",
        subtasks: [
          "Research competitors",
          "Propose 3 tiers",
          "Get community feedback",
        ],
      },
      {
        title: "Stripe Integration",
        subtasks: [
          "Create Stripe account + products",
          "Build checkout flow",
          "Webhook handling",
          "Update user credits in Convex",
        ],
      },
      { title: "Add Image Timestamp Manual Entry" },
      { title: "Landing Page Design" },
      { title: "Content Marketing (3 blog posts)" },
      { title: "Beta Launch 🚀" },
    ];

    for (let i = 0; i < tidTasks.length; i++) {
      const taskId = await ctx.db.insert("tasks", {
        projectId: takeItDownId,
        title: tidTasks[i].title,
        status: "todo",
        order: i,
      });

      if (tidTasks[i].subtasks) {
        for (let j = 0; j < tidTasks[i].subtasks!.length; j++) {
          await ctx.db.insert("subtasks", {
            taskId,
            title: tidTasks[i].subtasks![j],
            done: false,
            order: j,
          });
        }
      }
    }

    // PROJECT 3: Flow Stach
    const flowStachId = await ctx.db.insert("projects", {
      name: "Flow Bridge",
      slug: "flow-stach",
      description: "HTML/CodePen → Webflow marketplace. 12-week roadmap.",
      status: "active",
      priority: "high",
      order: 2,
      localPath: "C:\\Users\\maria\\Desktop\\pessoal\\FLOW_PARTY\\flow-stach",
      githubPath: "projects/flow-stach",
    });

    const flowTasks = [
      {
        title: "Fix Core Conversion (90%+ success)",
        subtasks: [
          "List all files in temp/tests/",
          "Test each file in Webflow",
          "Compare working vs broken HTML",
          "Build webflow-preflight-validator.ts",
          "Add integration tests",
        ],
      },
      { title: "Rename Project (FlowStach → Flow Bridge?)" },
      {
        title: "Competitor Research",
        subtasks: [
          "Analyze Timothée Ricks pricing",
          "Analyze Willum pricing",
          "Analyze Osmo pricing",
        ],
      },
      {
        title: "Define Pricing Model",
        subtasks: [
          "Propose 3 tiers (Free, Pro, Team)",
          "Per-item vs subscription",
          "Choose payment provider",
        ],
      },
      { title: "CodePen Integration Stabilization" },
      {
        title: "Build Marketplace UI",
        subtasks: [
          "Browse page (/explore)",
          "Asset detail pages",
          "My Projects dashboard",
        ],
      },
      { title: "Payment Integration" },
      { title: "Redesign Application", status: "blocked", blockedReason: "Waiting on designers" },
      { title: "Connect Flow-Goodies Extension to Convex" },
      { title: "Content Curation (30-50 assets)" },
      { title: "Launch Prep (legal, SEO, analytics)" },
    ];

    for (let i = 0; i < flowTasks.length; i++) {
      const taskId = await ctx.db.insert("tasks", {
        projectId: flowStachId,
        title: flowTasks[i].title,
        status: (flowTasks[i] as any).status || "todo",
        blockedReason: (flowTasks[i] as any).blockedReason,
        order: i,
      });

      if ((flowTasks[i] as any).subtasks) {
        for (let j = 0; j < (flowTasks[i] as any).subtasks.length; j++) {
          await ctx.db.insert("subtasks", {
            taskId,
            title: (flowTasks[i] as any).subtasks[j],
            done: false,
            order: j,
          });
        }
      }
    }

    // PROJECT 4: DARVO Transcripts
    const darvoId = await ctx.db.insert("projects", {
      name: "DARVO Transcripts",
      slug: "darvo-transcripts",
      description: "Video analysis tool for harassment patterns. 6-8 week roadmap.",
      status: "active",
      priority: "medium",
      order: 3,
      localPath: "C:\\Users\\maria\\Desktop\\pessoal\\DARVO-Transcripts",
      githubPath: "projects/darvo-transcripts",
    });

    const darvoTasks = [
      { title: "Remove File Indexing UI", aiPrompt: "Comment out Search & Filter tab in main.py (lines 80-91). Keep database. Test app runs." },
      {
        title: "Add URL Input Tab",
        subtasks: [
          "New Gradio tab: Analyze Videos",
          "Input: YouTube URLs (one per line)",
          "Input: Names to track",
          "Button: Start Analysis",
        ],
      },
      { title: "Check Existing Transcripts Before Transcribing" },
      {
        title: "Build Interactive Flagging UI",
        subtasks: [
          "Gradio Dataframe with checkboxes",
          "Columns: Timestamp, Quote, Person, Technique",
          "Filter by Person/Technique",
          "Batch actions (Select All)",
        ],
      },
      {
        title: "Improve Clip Extraction",
        subtasks: [
          "User-selected buffer (15s, 30s, 60s)",
          "Smart boundaries",
          "Batch clip generation",
        ],
      },
      {
        title: "Build Research Website Generator",
        subtasks: [
          "Choose framework (Next.js)",
          "Homepage with stats",
          "Evidence pages per technique",
          "Data visualizations",
        ],
      },
    ];

    for (let i = 0; i < darvoTasks.length; i++) {
      const taskId = await ctx.db.insert("tasks", {
        projectId: darvoId,
        title: darvoTasks[i].title,
        status: "todo",
        order: i,
        aiPrompt: (darvoTasks[i] as any).aiPrompt,
      });

      if ((darvoTasks[i] as any).subtasks) {
        for (let j = 0; j < (darvoTasks[i] as any).subtasks.length; j++) {
          await ctx.db.insert("subtasks", {
            taskId,
            title: (darvoTasks[i] as any).subtasks[j],
            done: false,
            order: j,
          });
        }
      }
    }

    // PROJECT 5: Scientology Archive
    const scnId = await ctx.db.insert("projects", {
      name: "Scientology Archive",
      slug: "scientology-archive",
      description: "Document processing for scnfiles.com. BLOCKED: Awaiting folder access.",
      status: "blocked",
      priority: "low",
      order: 4,
      githubPath: "projects/scientology-archive",
    });

    const scnTasks = [
      { title: "Provide folder access to Claude", status: "blocked" },
      { title: "Audit scnfiles.com codebase" },
      { title: "Test OCR engines (Adobe, Tesseract, Google)" },
      { title: "Build format preservation layer" },
      { title: "Design microsite template" },
      { title: "Create collaboration workflow" },
    ];

    for (let i = 0; i < scnTasks.length; i++) {
      await ctx.db.insert("tasks", {
        projectId: scnId,
        title: scnTasks[i].title,
        status: (scnTasks[i] as any).status || "todo",
        order: i,
      });
    }

    // PROJECT 6: Imacx Management
    const imacxId = await ctx.db.insert("projects", {
      name: "Imacx Management",
      slug: "imacx-management",
      description: "Day job task tracking. Maria will populate tasks.",
      status: "active",
      priority: "high",
      order: 5,
      localPath: "C:\\Users\\maria\\Desktop\\Imacx\\IMACX_PROD\\NOVO\\imacx\\NEW-APP\\imacx-clean",
      githubPath: "projects/imacx-management",
    });

    console.log("✅ Seeded 6 projects with tasks!");
  },
});
```

## Step 5: UI Components

Create `src/app/page.tsx` (Dashboard):

```tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ProjectCard } from "@/components/project-card";

export default function Dashboard() {
  const projects = useQuery(api.projects.list);

  if (!projects) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 p-6">
        <h1 className="text-2xl font-bold">2nd Brain Task Tracker</h1>
        <p className="text-zinc-400 mt-1">
          {projects.filter(p => p.status === "active").length} active projects
        </p>
      </header>

      <main className="p-6 max-w-4xl mx-auto">
        <div className="space-y-4">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </main>
    </div>
  );
}
```

Create `src/components/project-card.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Id } from "../../convex/_generated/dataModel";

const statusColors = {
  active: "bg-green-500/20 text-green-400 border-green-500/30",
  blocked: "bg-red-500/20 text-red-400 border-red-500/30",
  completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  planning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

const priorityColors = {
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  medium: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  low: "bg-zinc-700/20 text-zinc-500 border-zinc-700/30",
};

export function ProjectCard({ project }: { project: any }) {
  const [expanded, setExpanded] = useState(false);
  const tasks = useQuery(
    api.tasks.listByProject,
    expanded ? { projectId: project._id } : "skip"
  );

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader
        className="cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {expanded ? (
              <ChevronDown className="w-5 h-5 text-zinc-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-zinc-400" />
            )}
            <CardTitle className="text-lg">{project.name}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={priorityColors[project.priority]}>
              {project.priority}
            </Badge>
            <Badge variant="outline" className={statusColors[project.status]}>
              {project.status}
            </Badge>
          </div>
        </div>
        <div className="ml-8 mt-2">
          <div className="flex items-center gap-3">
            <Progress value={project.completionPercent} className="h-2 flex-1" />
            <span className="text-sm text-zinc-400 w-12">
              {project.completionPercent}%
            </span>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            {project.doneTasks}/{project.totalTasks} tasks
          </p>
        </div>
      </CardHeader>

      {expanded && tasks && (
        <CardContent className="pt-0">
          <div className="ml-8 space-y-2">
            {tasks.map((task) => (
              <TaskItem key={task._id} task={task} />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function TaskItem({ task }: { task: any }) {
  const [expanded, setExpanded] = useState(false);
  const updateStatus = useMutation(api.tasks.updateStatus);
  const toggleSubtask = useMutation(api.subtasks.toggle);

  const taskStatusColors = {
    todo: "border-zinc-600",
    in_progress: "border-yellow-500 bg-yellow-500/10",
    done: "border-green-500 bg-green-500/10",
    blocked: "border-red-500 bg-red-500/10",
  };

  const handleToggle = () => {
    const newStatus = task.status === "done" ? "todo" : "done";
    updateStatus({ id: task._id, status: newStatus });
  };

  return (
    <div className={`border rounded-lg p-3 ${taskStatusColors[task.status]}`}>
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.status === "done"}
          onCheckedChange={handleToggle}
          className="mt-1"
        />
        <div className="flex-1">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => task.subtasks.length > 0 && setExpanded(!expanded)}
          >
            <span className={task.status === "done" ? "line-through text-zinc-500" : ""}>
              {task.title}
            </span>
            {task.status === "blocked" && (
              <Badge variant="outline" className="text-xs bg-red-500/20 text-red-400">
                blocked
              </Badge>
            )}
            {task.subtasks.length > 0 && (
              <span className="text-xs text-zinc-500">
                ({task.doneSubtasks}/{task.totalSubtasks})
              </span>
            )}
          </div>

          {expanded && task.subtasks.length > 0 && (
            <div className="mt-2 ml-4 space-y-1">
              {task.subtasks.map((subtask: any) => (
                <div key={subtask._id} className="flex items-center gap-2">
                  <Checkbox
                    checked={subtask.done}
                    onCheckedChange={() => toggleSubtask({ id: subtask._id })}
                    className="h-4 w-4"
                  />
                  <span
                    className={`text-sm ${subtask.done ? "line-through text-zinc-500" : "text-zinc-300"}`}
                  >
                    {subtask.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

## Step 6: Convex Provider

Create `src/app/providers.tsx`:

```tsx
"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
```

Update `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "2nd Brain Task Tracker",
  description: "Track projects and tasks for Maria's second brain",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

## Step 7: Deploy

1. Push to GitHub:
```bash
cd C:\Users\maria\Desktop\pessoal\2nd-brain
git add apps/tasktracker
git commit -m "Add task tracker app"
git push
```

2. Deploy to Vercel:
```bash
cd apps/tasktracker
npx vercel --prod
```

3. Run seed function:
```bash
npx convex run seed:seedAll
```

## Step 8: Test

- Open the deployed URL
- Verify all 6 projects show
- Click to expand, check tasks
- Mark a task done, verify % updates

## Success Criteria

- [ ] App loads at tasktracker.vercel.app (or similar)
- [ ] 6 projects displayed with correct status/priority
- [ ] Tasks expand with subtasks
- [ ] Checkbox toggles update status
- [ ] Completion % auto-calculates
- [ ] Mobile responsive

---

## API Endpoints for Clawdbot

After deployment, Clawdbot can use these Convex functions:

```javascript
// Get all projects
const projects = await convex.query(api.projects.list);

// Get next task
const next = await convex.query(api.tasks.getNextTask, { projectSlug: "jocril-ecommerce" });

// Mark task done
await convex.mutation(api.tasks.updateStatus, { id: taskId, status: "done" });

// Add new task
await convex.mutation(api.tasks.create, { 
  projectId, 
  title: "New task from Telegram" 
});
```

---

END OF CLI PROMPT
