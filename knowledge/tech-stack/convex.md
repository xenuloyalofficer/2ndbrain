# Convex - Tech Stack Guide

**Last Updated**: 2026-01-27

---

## Projects Using This

| Project | Schema Tables | Functions | Key Features |
|---------|---------------|-----------|--------------|
| **Flow Stach** | 7 tables | 31 functions | Assets marketplace, Import wizard, Webflow JSON conversion |
| **Take It Down** | 3 tables | ~15 functions | Privacy complaints, Multi-step wizard, Transcript analysis |
| **Jocril E-commerce** | ~8 tables | ~20 functions | Product catalog, Template-variant model, Order management |

**Total**: 3 of 7 projects (43%)

---

## Architecture Pattern

### Convex as BaaS (Backend-as-a-Service)
```
Frontend (Next.js) → Convex Functions → Convex Database
                      ↓
                   Real-time Subscriptions
```

**Key Benefits**:
1. **Type-safe**: Generated TypeScript types for queries/mutations
2. **Real-time**: Automatic subscriptions (no polling)
3. **Serverless**: No server management
4. **Integrated**: Database + Functions in one

---

## Common Patterns Across Projects

### 1. Schema Definition (All Projects)

**Pattern**: Define tables with validators and indexes

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    role: v.union(v.literal("user"), v.literal("admin")),
    createdAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  projects: defineTable({
    userId: v.id("users"),
    title: v.string(),
    status: v.string(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"]),
});
```

**Key Elements**:
- **defineTable()**: Table definition
- **v.* validators**: Type validation (v.string(), v.number(), v.id(), etc.)
- **.index()**: Composite indexes for query performance
- **v.union()**: Enums/unions for restricted values

### 2. Query Functions (All Projects)

**Pattern**: Read-only database access

```typescript
// convex/projects.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    return await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});
```

**Key Elements**:
- **query()**: Declare query function
- **args**: Input validation with validators
- **handler**: Async function with ctx (context)
- **ctx.db.query()**: Database queries
- **.withIndex()**: Use index for performance
- **.unique()**: Get single result
- **.collect()**: Get all results

### 3. Mutation Functions (All Projects)

**Pattern**: Write operations (create, update, delete)

```typescript
// convex/projects.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    const projectId = await ctx.db.insert("projects", {
      userId: user._id,
      title: args.title,
      description: args.description,
      status: "draft",
      createdAt: Date.now(),
    });

    return projectId;
  },
});
```

**Key Elements**:
- **mutation()**: Declare mutation function
- **args**: Validated inputs
- **ctx.db.insert()**: Create new record
- **ctx.db.patch()**: Update record
- **ctx.db.delete()**: Delete record

### 4. Action Functions (2 Projects)

**Projects**: Flow Stach, Take It Down

**Pattern**: External API calls, non-deterministic operations

```typescript
// convex/import.ts
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const analyzeTranscript = action({
  args: {
    transcriptId: v.id("transcripts"),
  },
  handler: async (ctx, args) => {
    // Fetch transcript
    const transcript = await ctx.runQuery(api.transcripts.get, {
      id: args.transcriptId,
    });

    // Call external API (OpenRouter)
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528:free",
        messages: [{ role: "user", content: transcript.text }],
      }),
    });

    const data = await response.json();

    // Save result
    await ctx.runMutation(api.transcripts.update, {
      id: args.transcriptId,
      analysis: data.choices[0].message.content,
    });

    return data;
  },
});
```

**Key Elements**:
- **action()**: Declare action function
- **ctx.runQuery()**: Call query from action
- **ctx.runMutation()**: Call mutation from action
- **fetch()**: External API calls
- **Non-deterministic**: Can have side effects

### 5. Authentication Pattern (All Projects)

**Pattern**: Clerk → Convex JWT bridge

```typescript
// convex/users.ts
export const requireAuth = async (ctx: QueryCtx | MutationCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthenticated");

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();

  if (!user) throw new Error("User not found");

  return user;
};

// Usage in queries/mutations
export const myQuery = query({
  handler: async (ctx) => {
    const user = await requireAuth(ctx);
    // Now you have the user object
  },
});
```

**Clerk Setup**:
```typescript
// next.config.mjs
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();
```

### 6. Indexes for Performance (All Projects)

**Pattern**: Compound indexes for frequently queried fields

**Common Indexes**:
```typescript
// By foreign key
.index("by_user", ["userId"])
.index("by_project", ["projectId"])

// By status/state
.index("by_status", ["status"])

// By timestamp
.index("by_created_at", ["createdAt"])

// Compound (user + status)
.index("by_user_and_status", ["userId", "status"])

// Unique lookup
.index("by_clerk_id", ["clerkId"])
.index("by_email", ["email"])
.index("by_slug", ["slug"])
```

**Performance Impact**: 10-100x faster queries with proper indexes

---

## Project-Specific Patterns

### Flow Stach (7 Tables, 31 Functions)

**Schema**:
```typescript
// convex/schema.ts
export default defineSchema({
  users: defineTable({...}).index("by_clerk_id", ["clerkId"]),
  assets: defineTable({...}).index("by_category", ["category"]).index("by_slug", ["slug"]),
  templates: defineTable({...}).index("by_asset", ["assetId"]),
  payloads: defineTable({...}).index("by_template", ["templateId"]),
  favorites: defineTable({...}).index("by_user", ["userId"]),
  importProjects: defineTable({...}).index("by_user", ["userId"]),
  importArtifacts: defineTable({...}).index("by_project", ["projectId"]),
});
```

**Key Functions**:
- **assets.ts**: 10 functions (create, update, delete, list, get, search, etc.)
- **import.ts**: 8 functions (streaming HTML→Webflow conversion)
- **favorites.ts**: 4 functions (toggle, list)
- **payloads.ts**: 5 functions (Webflow JSON management)

**Unique Patterns**:
1. **Streaming conversion**: `internalMutation` for streaming HTML processing
2. **Webflow JSON storage**: Complex payloads in `payloads` table
3. **Asset marketplace**: Public assets + user favorites

### Take It Down (3 Tables, ~15 Functions)

**Schema**:
```typescript
// convex/schema.ts
export default defineSchema({
  users: defineTable({...}).index("by_clerk_id", ["clerkId"]),
  complaints: defineTable({
    userId: v.id("users"),
    status: v.string(), // "draft" | "ready" | "submitted" | "resolved" | "rejected"
    currentStep: v.optional(v.string()),
    identifiers: v.optional(v.object({...})),
    evidence: v.optional(v.object({...})),
    // 7-step wizard data
  }).index("by_user", ["userId"]).index("by_status", ["status"]),
  transcriptMentions: defineTable({
    complaintId: v.id("complaints"),
    videoId: v.string(),
    timestamp: v.string(),
    quote: v.string(),
  }).index("by_complaint", ["complaintId"]),
});
```

**Key Functions**:
- **complaints.ts**: CRUD operations for multi-step wizard
- **transcriptMentions.ts**: Video evidence management
- **users.ts**: User profile, auth

**Unique Patterns**:
1. **Multi-step wizard state**: All wizard steps stored in single `complaints` row
2. **OpenRouter integration**: Actions for AI-powered transcript analysis
3. **Nested objects**: Complex `identifiers` and `evidence` structures

### Jocril E-commerce (~8 Tables, ~20 Functions)

**Schema**:
```typescript
// convex/schema.ts (estimated)
export default defineSchema({
  users: defineTable({...}).index("by_clerk_id", ["clerkId"]),
  productTemplates: defineTable({...}).index("by_category", ["category"]),
  productVariants: defineTable({
    templateId: v.id("productTemplates"),
    sku: v.string(),
    price: v.number(),
    // Color, size, etc.
  }).index("by_template", ["templateId"]).index("by_sku", ["sku"]),
  orders: defineTable({...}).index("by_user", ["userId"]).index("by_status", ["status"]),
  orderItems: defineTable({...}).index("by_order", ["orderId"]),
  // ... more tables
});
```

**Key Patterns**:
1. **Template-Variant model**: Separate tables for product templates and variants
2. **Order management**: Orders + order items relational structure
3. **Inventory tracking**: Variant-level stock management

---

## Generated Files

### Convex Auto-Generates:
```
convex/_generated/
├── api.d.ts              # Type-safe API imports
├── api.js                # Runtime API exports
├── dataModel.d.ts        # Database schema types
├── server.d.ts           # Server function types
└── server.js             # Server function exports
```

**Usage**:
```typescript
// Frontend
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";

function MyComponent() {
  const projects = useQuery(api.projects.list);
  const createProject = useMutation(api.projects.create);

  // Type-safe! IDE autocomplete works
}
```

---

## Frontend Integration (React/Next.js)

### 1. Provider Setup
```typescript
// app/providers/ConvexProvider.tsx
"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
```

### 2. useQuery Hook
```typescript
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function ProjectList() {
  const projects = useQuery(api.projects.list);

  if (projects === undefined) return <div>Loading...</div>;

  return (
    <ul>
      {projects.map((project) => (
        <li key={project._id}>{project.title}</li>
      ))}
    </ul>
  );
}
```

### 3. useMutation Hook
```typescript
"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function CreateProjectForm() {
  const createProject = useMutation(api.projects.create);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await createProject({
      title: formData.get("title") as string,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" />
      <button type="submit">Create</button>
    </form>
  );
}
```

### 4. useAction Hook (Actions)
```typescript
"use client";

import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

export function AnalyzeButton({ transcriptId }: { transcriptId: Id<"transcripts"> }) {
  const analyze = useAction(api.import.analyzeTranscript);

  const handleClick = async () => {
    const result = await analyze({ transcriptId });
    console.log(result);
  };

  return <button onClick={handleClick}>Analyze</button>;
}
```

---

## Real-Time Subscriptions

**Automatic**: `useQuery` automatically subscribes to changes

```typescript
const projects = useQuery(api.projects.list);
// If another user creates a project, this component re-renders automatically
```

**No polling needed**: Convex pushes updates via WebSocket

---

## Development Workflow

### 1. Local Development
```bash
# Terminal 1: Start Convex dev server
npx convex dev

# Terminal 2: Start Next.js
npm run dev
```

### 2. Schema Changes
```typescript
// 1. Edit convex/schema.ts
export default defineSchema({
  // Add new table or field
  newTable: defineTable({...}),
});

// 2. Convex auto-detects and regenerates types
// 3. Frontend immediately has new types available
```

### 3. Deploy
```bash
# Deploy to Convex production
npx convex deploy

# Vercel deploys Next.js automatically on push
```

---

## Common Conventions

### 1. File Organization
```
convex/
├── schema.ts              # Database schema
├── users.ts              # User queries/mutations
├── projects.ts           # Project CRUD
├── import.ts             # Import actions
├── _generated/           # Auto-generated (DO NOT EDIT)
└── lib/                  # Shared utilities (optional)
```

### 2. Function Naming
- **list**: Get all records (filtered)
- **get**: Get single record by ID
- **create**: Insert new record
- **update**: Patch existing record
- **delete**: Remove record
- **toggle**: Toggle boolean field (e.g., favorite)

### 3. Error Handling
```typescript
export const get = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.id);
    if (!project) throw new Error("Project not found");
    return project;
  },
});
```

### 4. Return Types
```typescript
// Good: Return serializable data only
return { id: project._id, title: project.title };

// Bad: Don't return functions, Dates, or complex objects
return { project, createdAt: new Date() }; // Date not serializable
```

---

## Performance Tips

### 1. Use Indexes
```typescript
// Bad: Full table scan
await ctx.db.query("projects").filter((q) => q.eq(q.field("userId"), userId)).collect();

// Good: Use index
await ctx.db.query("projects").withIndex("by_user", (q) => q.eq("userId", userId)).collect();
```

### 2. Paginate Large Lists
```typescript
// Bad: Load all records
const allProjects = await ctx.db.query("projects").collect();

// Good: Paginate
const projects = await ctx.db.query("projects").withIndex("by_created_at").order("desc").take(20);
```

### 3. Minimize Query Complexity
```typescript
// Bad: Multiple queries in loop
for (const project of projects) {
  const user = await ctx.db.get(project.userId); // N+1 queries!
}

// Good: Single query with join
const projects = await ctx.db.query("projects").collect();
const userIds = projects.map((p) => p.userId);
const users = await Promise.all(userIds.map((id) => ctx.db.get(id)));
```

---

## Testing

### Current State
- **No test files found** in any project
- **Manual testing**: Likely tested via UI

### Recommended Approach
```typescript
// convex/projects.test.ts
import { convexTest } from "convex-test";
import { api } from "./_generated/api";
import schema from "./schema";

describe("projects", () => {
  it("should create project", async () => {
    const t = convexTest(schema);
    const projectId = await t.mutation(api.projects.create, {
      title: "Test Project",
    });
    expect(projectId).toBeDefined();
  });
});
```

---

## Resources

### Official Documentation
- [Convex Docs](https://docs.convex.dev/)
- [Schema Definition](https://docs.convex.dev/database/schemas)
- [Queries & Mutations](https://docs.convex.dev/functions)
- [Actions](https://docs.convex.dev/functions/actions)
- [Indexes](https://docs.convex.dev/database/indexes)

### Project Examples
- Flow Stach: `convex/schema.ts` - 7 tables, comprehensive example
- Take It Down: `convex/complaints.ts` - Multi-step wizard state
- Jocril: `convex/products.ts` - E-commerce patterns

---

## Common Issues & Solutions

### 1. "Function not found" Error
**Cause**: Stale generated files
**Solution**: Restart `npx convex dev`

### 2. Type Errors After Schema Change
**Cause**: Frontend using old types
**Solution**: Restart Next.js dev server

### 3. Slow Queries
**Cause**: Missing indexes
**Solution**: Add index to schema, check with Convex dashboard query profiler

### 4. "Unauthenticated" Error
**Cause**: Clerk middleware not configured
**Solution**: Ensure `ConvexProviderWithClerk` wraps app and `useAuth` is passed

---

## Recommendations

### For New Projects
1. **Always define schema** (don't rely on schemaless mode)
2. **Index foreign keys** (userId, projectId, etc.)
3. **Use requireAuth helper** (consistent auth pattern)
4. **Paginate from day 1** (don't `.collect()` everything)

### For Existing Projects
1. **Add tests** (convex-test package)
2. **Review indexes** (check Convex dashboard for slow queries)
3. **Optimize large queries** (paginate, limit results)
4. **Document functions** (JSDoc comments for generated types)

---

**END OF GUIDE**
