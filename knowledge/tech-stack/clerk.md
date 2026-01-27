# Clerk - Tech Stack Guide

**Last Updated**: 2026-01-27

---

## Projects Using This

| Project | Convex Integration | Features Used |
|---------|-------------------|---------------|
| **Flow Stach** | ✅ Yes | Sign-in/up, User profile, Protected routes, Convex JWT bridge |
| **Take It Down** | ✅ Yes | Sign-in/up, Protected routes, Wizard flow auth, Convex JWT bridge |
| **Jocril E-commerce** | ✅ Yes | Sign-in/up, User accounts, Order history, Convex JWT bridge |

**Total**: 3 of 7 projects (43%)

**Note**: All 3 projects use Clerk → Convex integration (no standalone Clerk usage)

---

## Architecture Pattern

### Clerk + Convex Integration
```
User → Clerk UI Components → Clerk Auth
                                ↓
                           JWT Token
                                ↓
                    Next.js Middleware (Clerk)
                                ↓
                         Convex Functions
                                ↓
                  ctx.auth.getUserIdentity()
                                ↓
                    Query users table by clerkId
```

**Flow**:
1. User authenticates via Clerk components
2. Clerk issues JWT token
3. Next.js middleware validates JWT
4. Convex functions receive authenticated context
5. Query `users` table using Clerk ID

---

## Common Setup Across Projects

### 1. Environment Variables

```bash
# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Optional: Customize sign-in/sign-up URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/workspace
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

### 2. Provider Setup

```typescript
// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { useAuth } from "@clerk/nextjs";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            {children}
          </ConvexProviderWithClerk>
        </ClerkProvider>
      </body>
    </html>
  );
}
```

**Key Elements**:
- **ClerkProvider**: Wraps entire app
- **ConvexProviderWithClerk**: Bridges Clerk auth to Convex
- **useAuth**: Hook for current auth state

### 3. Middleware Setup

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/explore(.*)",
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

**Key Elements**:
- **clerkMiddleware**: Clerk middleware function
- **createRouteMatcher**: Define public routes
- **auth().protect()**: Require auth for non-public routes

### 4. Convex Schema (Users Table)

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    role: v.union(v.literal("user"), v.literal("admin")),
    createdAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),
});
```

**Key Fields**:
- **clerkId**: Unique Clerk user ID (e.g., `user_2a3b4c5d...`)
- **email**: User email from Clerk
- **name, imageUrl**: User profile data from Clerk
- **role**: App-specific user roles
- **createdAt**: Timestamp

### 5. Auth Helper (Convex)

```typescript
// convex/users.ts
import { QueryCtx, MutationCtx } from "./_generated/server";

export async function requireAuth(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthenticated");

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();

  if (!user) throw new Error("User not found in database");

  return user;
}

// Usage in queries/mutations
export const myQuery = query({
  handler: async (ctx) => {
    const user = await requireAuth(ctx);
    // Now you have the full user object from Convex DB
    return { userId: user._id, email: user.email };
  },
});
```

**Key Elements**:
- **ctx.auth.getUserIdentity()**: Get Clerk identity from context
- **identity.subject**: Clerk user ID
- **Query users table**: Fetch full user object from Convex

### 6. Sync Clerk to Convex (User Creation)

**Pattern**: Create Convex user on first Clerk sign-up

```typescript
// convex/users.ts
export const createUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existingUser) return existingUser._id;

    // Create new user
    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      imageUrl: args.imageUrl,
      role: "user",
      createdAt: Date.now(),
    });

    return userId;
  },
});
```

**Trigger**: Call from client on first sign-in

```typescript
// app/components/AuthSync.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

export function AuthSync() {
  const { user } = useUser();
  const createUser = useMutation(api.users.createUser);

  useEffect(() => {
    if (user) {
      createUser({
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress ?? "",
        name: user.fullName ?? undefined,
        imageUrl: user.imageUrl ?? undefined,
      });
    }
  }, [user]);

  return null;
}
```

---

## UI Components (All Projects)

### 1. Sign-In Page

```typescript
// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn />
    </div>
  );
}
```

### 2. Sign-Up Page

```typescript
// app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp />
    </div>
  );
}
```

### 3. User Button (Profile Menu)

```typescript
// app/components/Header.tsx
import { UserButton } from "@clerk/nextjs";

export function Header() {
  return (
    <header>
      <nav>
        <Logo />
        <UserButton afterSignOutUrl="/" />
      </nav>
    </header>
  );
}
```

### 4. Protected Page

```typescript
// app/workspace/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function WorkspacePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return <div>Protected Workspace</div>;
}
```

---

## Project-Specific Patterns

### Flow Stach

**Features**:
- Sign-in/sign-up via Clerk components
- UserButton in nav bar
- Protected workspace routes
- Admin role check (stored in Convex)

**Admin Check**:
```typescript
// convex/users.ts
export const isAdmin = query({
  handler: async (ctx) => {
    const user = await requireAuth(ctx);
    return user.role === "admin";
  },
});

// Frontend
const isAdmin = useQuery(api.users.isAdmin);
if (isAdmin) {
  // Show admin UI
}
```

### Take It Down

**Features**:
- Clerk auth for multi-step wizard
- Protected wizard routes
- User-specific complaints
- Email from Clerk used in complaint forms

**Wizard Auth**:
```typescript
// app/(wizard)/layout.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function WizardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect=/wizard/intake");

  return <div>{children}</div>;
}
```

### Jocril E-commerce

**Features**:
- Clerk auth for user accounts
- Protected checkout flow
- Order history per user
- Email for order confirmations

**Checkout Auth**:
```typescript
// app/(shop)/checkout/page.tsx
import { auth } from "@clerk/nextjs/server";

export default async function CheckoutPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect=/checkout");

  // User is authenticated, proceed with checkout
}
```

---

## Hooks & Client-Side Usage

### 1. useUser Hook
```typescript
"use client";

import { useUser } from "@clerk/nextjs";

export function ProfileCard() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>Not signed in</div>;

  return (
    <div>
      <img src={user.imageUrl} alt={user.fullName ?? "User"} />
      <p>{user.fullName}</p>
      <p>{user.emailAddresses[0]?.emailAddress}</p>
    </div>
  );
}
```

### 2. useAuth Hook
```typescript
"use client";

import { useAuth } from "@clerk/nextjs";

export function ProtectedButton() {
  const { isSignedIn, userId } = useAuth();

  if (!isSignedIn) return <a href="/sign-in">Sign in to continue</a>;

  return <button>Protected Action</button>;
}
```

### 3. SignInButton / SignUpButton
```typescript
"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";

export function AuthButtons() {
  return (
    <div>
      <SignInButton mode="modal">
        <button>Sign In</button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button>Sign Up</button>
      </SignUpButton>
    </div>
  );
}
```

---

## Customization

### 1. Theme Customization

```typescript
// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: "#e94560",
              colorBackground: "#1a1a2e",
              colorText: "#f4f4f4",
            },
            elements: {
              card: "shadow-lg",
              headerTitle: "text-2xl font-bold",
              formButtonPrimary: "bg-pink-500 hover:bg-pink-600",
            },
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
```

### 2. Redirect URLs

```bash
# .env.local
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/workspace
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

---

## Common Conventions

### 1. Route Protection Levels

**Public Routes** (no auth):
- `/` - Landing page
- `/explore` - Browse public content
- `/sign-in`, `/sign-up` - Auth pages

**Protected Routes** (require auth):
- `/workspace` - User workspace
- `/dashboard` - User dashboard
- `/checkout` - Checkout flow

**Admin Routes** (require admin role):
- `/admin` - Admin panel
- Check role in Convex query, not just Clerk auth

### 2. Error Handling

```typescript
// convex/users.ts
export async function requireAuth(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthenticated");

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();

  if (!user) {
    // User exists in Clerk but not in Convex DB
    throw new Error("User not found. Please sign in again.");
  }

  return user;
}
```

### 3. Admin Role Checks

```typescript
// convex/users.ts
export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const user = await requireAuth(ctx);
  if (user.role !== "admin") throw new Error("Unauthorized: Admin access required");
  return user;
}

// Usage
export const adminQuery = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);
    // Only admins reach this point
  },
});
```

---

## Testing

### Current State
- **No test files found** for Clerk auth in any project
- **Manual testing**: Likely tested via UI

### Recommended Approach

```typescript
// __tests__/auth.test.tsx
import { render, screen } from "@testing-library/react";
import { ClerkProvider } from "@clerk/nextjs";

// Mock Clerk
jest.mock("@clerk/nextjs", () => ({
  useUser: () => ({ user: { id: "user_123", email: "test@example.com" }, isLoaded: true }),
  useAuth: () => ({ isSignedIn: true, userId: "user_123" }),
}));

test("renders protected content when authenticated", () => {
  render(
    <ClerkProvider>
      <ProtectedComponent />
    </ClerkProvider>
  );
  expect(screen.getByText("Protected Content")).toBeInTheDocument();
});
```

---

## Common Issues & Solutions

### 1. "Unauthenticated" Error in Convex
**Cause**: Clerk JWT not passed to Convex
**Solution**: Ensure `ConvexProviderWithClerk` wraps app and `useAuth` is passed

### 2. User Not Found in Convex DB
**Cause**: User signed up via Clerk but not synced to Convex
**Solution**: Implement `AuthSync` component (see setup section)

### 3. Redirect Loop on Sign-In
**Cause**: Protected route redirects to sign-in, which redirects back
**Solution**: Check `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` is correct

### 4. Clerk Middleware Not Working
**Cause**: Middleware matcher not configured correctly
**Solution**: Ensure `matcher` in `middleware.ts` includes routes

---

## Resources

### Official Documentation
- [Clerk Docs](https://clerk.com/docs)
- [Clerk + Convex Guide](https://docs.convex.dev/auth/clerk)
- [Clerk + Next.js](https://clerk.com/docs/references/nextjs/overview)

### Project Examples
- Flow Stach: `app/layout.tsx` - ClerkProvider + ConvexProviderWithClerk
- Take It Down: `middleware.ts` - Route protection
- Jocril: `convex/users.ts` - requireAuth helper

---

## Recommendations

### For New Projects
1. **Always sync Clerk to Convex DB** (AuthSync component)
2. **Create `requireAuth` helper** (DRY principle)
3. **Use middleware for route protection** (not per-page checks)
4. **Store app-specific user data in Convex** (not Clerk metadata)

### For Existing Projects
1. **Add tests** (Mock Clerk hooks)
2. **Review admin checks** (Ensure role validation in Convex)
3. **Optimize user sync** (Only create user once, idempotent)
4. **Document custom roles** (If using roles beyond user/admin)

---

**END OF GUIDE**
