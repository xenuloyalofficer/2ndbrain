# Next.js - Tech Stack Guide

**Last Updated**: 2026-01-27

---

## Projects Using This

| Project | Version | Router | Key Features |
|---------|---------|--------|--------------|
| **Flow Stach** | 16.1 (canary) | App Router | Server Actions, Streaming, Convex integration |
| **Take It Down** | 16 (canary) | App Router | Server Actions, Middleware, Multi-step wizard |
| **Imacx Management** | 14.2 | App Router | Production system, SSR with Supabase, Complex routing |
| **Jocril E-commerce** | 14.2 | App Router | Server Actions, Product catalog, Checkout flow |

**Total**: 4 of 7 projects (57%)

---

## Common Patterns Across Projects

### 1. App Router (All Projects)
- **Universal adoption**: All Next.js projects use App Router (not Pages Router)
- **File-based routing**: `app/` directory structure
- **Layouts**: Nested layouts for shared UI
- **Server Components**: Default for all components

### 2. Server Actions (3 Projects)
**Projects**: Flow Stach, Take It Down, Jocril E-commerce

**Pattern**:
```typescript
// app/actions.ts
"use server"

export async function createProject(formData: FormData) {
  // Server-side logic
  const title = formData.get("title") as string;
  // Database mutation
  return { success: true };
}
```

**Usage**:
```typescript
// app/page.tsx
import { createProject } from "./actions";

export default function Page() {
  return (
    <form action={createProject}>
      <input name="title" />
      <button type="submit">Create</button>
    </form>
  );
}
```

### 3. Route Groups (All Projects)
**Pattern**: Organize routes without affecting URL structure

**Examples**:
- Flow Stach: `app/(authenticated)/`, `app/(public)/`
- Take It Down: `app/(wizard)/`, `app/(dashboard)/`
- Imacx: `app/(dashboard)/`, `app/(auth)/`

**Benefit**: Shared layouts per group

### 4. Middleware (2 Projects)
**Projects**: Take It Down, Imacx Management

**Pattern**:
```typescript
// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

**Use Cases**:
- Authentication checks
- Route protection
- Redirects based on auth state

### 5. Dynamic Routes (All Projects)
**Pattern**: `app/[slug]/page.tsx`

**Examples**:
- Flow Stach: `/assets/[slug]` - Asset detail pages
- Jocril: `/products/[id]` - Product pages
- Imacx: `/projects/[id]` - Project management

### 6. Loading States (3 Projects)
**Pattern**: `loading.tsx` for instant loading UI

**Example**:
```typescript
// app/workspace/loading.tsx
export default function Loading() {
  return <div>Loading workspace...</div>;
}
```

**Projects**: Flow Stach, Take It Down, Imacx

### 7. Error Boundaries (2 Projects)
**Pattern**: `error.tsx` for error handling

**Example**:
```typescript
// app/error.tsx
"use client";

export default function Error({ error, reset }: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

**Projects**: Flow Stach, Imacx

---

## Project-Specific Patterns

### Flow Stach (Next.js 16.1)
- **Streaming**: Uses React Suspense for incremental rendering
- **Parallel Routes**: Multiple route segments rendered simultaneously
- **Server Components**: Heavy use for Convex queries
- **Convex integration**: SSR with Convex Server SDK

**File**: `app/(authenticated)/workspace/page.tsx`
```typescript
import { getQuery } from "convex/server";
import { api } from "@/convex/_generated/api";

export default async function WorkspacePage() {
  const projects = await getQuery(api.projects.list);
  return <ProjectList projects={projects} />;
}
```

### Take It Down (Next.js 16)
- **Multi-step wizard**: 7-step form with client-side state
- **Route protection**: Clerk middleware for auth
- **Server Actions**: Form submission handlers
- **Conditional routing**: Based on wizard step

**File**: `app/(wizard)/[step]/page.tsx`
```typescript
export default function WizardStep({ params }: { params: { step: string } }) {
  // Dynamic step rendering
  return <StepComponent step={params.step} />;
}
```

### Imacx Management (Next.js 14.2)
- **Production system**: Live with real users
- **SSR with Supabase**: Server-side data fetching
- **Complex routing**: 7+ major route groups
- **MSSQL integration**: Legacy database queries

**File**: `app/(dashboard)/dashboard/page.tsx`
```typescript
import { createServerClient } from "@supabase/ssr";

export default async function DashboardPage() {
  const supabase = createServerClient(/* ... */);
  const { data } = await supabase.from("invoices").select("*");
  return <Dashboard data={data} />;
}
```

### Jocril E-commerce (Next.js 14.2)
- **Product catalog**: Template-variant model
- **Checkout flow**: Multi-step with Server Actions
- **Clerk auth**: Protected routes for user accounts
- **Supabase future**: Planned migration from Clerk-only

**File**: `app/(shop)/products/page.tsx`
```typescript
export default async function ProductsPage() {
  const products = await getProducts();
  return <ProductGrid products={products} />;
}
```

---

## Version Differences

### Next.js 14.2 vs. 16+

| Feature | 14.2 | 16+ | Impact |
|---------|------|-----|--------|
| **Canary Channel** | Stable | Canary | 16+ gets bleeding-edge features |
| **Server Actions** | Stable | Enhanced | 16+ has better type safety |
| **Turbopack** | Beta | Stable | 16+ faster dev builds |
| **Partial Prerendering (PPR)** | Experimental | Beta | 16+ can enable with flag |

**Recommendation**: Upgrade to Next.js 16 when stable for Imacx and Jocril.

---

## Common Conventions

### 1. File Naming
- **Pages**: `page.tsx` (lowercase)
- **Layouts**: `layout.tsx` (lowercase)
- **Loading**: `loading.tsx` (lowercase)
- **Error**: `error.tsx` (lowercase)

### 2. Component Placement
- **Server Components**: Default (no "use client")
- **Client Components**: Explicit "use client" directive at top
- **Actions**: Separate `actions.ts` file with "use server"

### 3. Data Fetching
- **Server Components**: `async` functions, direct DB queries
- **Client Components**: React hooks (useState, useEffect)
- **Server Actions**: Form handlers, mutations

### 4. Metadata
- **Static**: Export `metadata` object
- **Dynamic**: Export `generateMetadata` function

**Example**:
```typescript
// app/products/[id]/page.tsx
export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  return {
    title: product.title,
    description: product.description,
  };
}
```

---

## Performance Optimizations

### 1. Image Optimization (All Projects)
```typescript
import Image from "next/image";

<Image
  src="/hero.jpg"
  width={800}
  height={600}
  alt="Hero"
  priority // Above-the-fold images
/>
```

### 2. Font Optimization (3 Projects)
**Projects**: Flow Stach, Take It Down, Imacx

```typescript
// app/layout.tsx
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

### 3. Lazy Loading (2 Projects)
**Projects**: Flow Stach, Imacx

```typescript
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});
```

---

## Deployment

### Vercel (All Projects)
- **Platform**: Vercel (automatic deployments)
- **Build command**: `next build`
- **Environment variables**: `.env.local` (gitignored)
- **Preview deployments**: Automatic on PR

**Typical `.env.local`**:
```bash
# All projects
NEXT_PUBLIC_CONVEX_URL=https://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# Imacx specific
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
DATABASE_URL=postgresql://...
MSSQL_CONNECTION_STRING=...
```

---

## Common Issues & Solutions

### 1. "use client" Overuse
**Problem**: Marking too many components as client components
**Solution**: Keep server components by default, only use "use client" when:
- Using React hooks (useState, useEffect)
- Using browser APIs (localStorage, window)
- Event handlers (onClick, onSubmit)

### 2. Server/Client Component Boundary
**Problem**: Passing server components to client components
**Solution**: Use `children` prop or composition

**Bad**:
```typescript
"use client"
function ClientWrapper({ serverData }: { serverData: ServerComponent }) {
  // Error: Can't pass server component to client component
}
```

**Good**:
```typescript
"use client"
function ClientWrapper({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

// Usage:
<ClientWrapper>
  <ServerComponent /> {/* Server component as children */}
</ClientWrapper>
```

### 3. Hydration Mismatch
**Problem**: Server-rendered HTML doesn't match client-rendered HTML
**Common causes**:
- Date/time formatting differences
- Randomized IDs
- Browser-only APIs used in server components

**Solution**: Use `useEffect` or `"use client"` for browser-dependent rendering

---

## Testing

### Imacx Management (Has Tests)
- **Framework**: Vitest
- **Test files**: `*.test.ts`, `*.test.tsx`
- **Commands**:
  - `pnpm test` - Run tests
  - `pnpm test:run` - Run once
  - `pnpm test:coverage` - Coverage report

### Other Projects (No Tests)
- Flow Stach: No tests
- Take It Down: No tests
- Jocril E-commerce: No tests

**Recommendation**: Add Vitest to all projects following Imacx pattern.

---

## Resources

### Official Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

### Project Examples
- Flow Stach: `/app/(authenticated)/workspace/page.tsx` - Server Components + Convex
- Take It Down: `/app/(wizard)/[step]/page.tsx` - Dynamic routing + multi-step forms
- Imacx: `/app/(dashboard)/dashboard/page.tsx` - SSR + Supabase
- Jocril: `/app/(shop)/products/page.tsx` - Product catalog + Server Actions

---

## Recommendations

### For New Projects
1. **Use Next.js 16+** (canary → stable when released)
2. **App Router only** (Pages Router is legacy)
3. **Server Components by default** (opt into client when needed)
4. **Server Actions for mutations** (replace API routes)
5. **Middleware for auth** (Clerk or Supabase)

### For Existing Projects
1. **Upgrade to Next.js 16** (Imacx, Jocril when stable)
2. **Add tests** (Vitest pattern from Imacx)
3. **Optimize images** (Use `next/image` everywhere)
4. **Review client components** (Minimize "use client" usage)

---

**END OF GUIDE**
