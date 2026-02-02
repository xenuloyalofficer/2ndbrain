# Jocril E-commerce - Quick Context

**Location**: `C:\Users\maria\Desktop\pessoal\jocril\SITES\loja-jocril` / `~/active-projects/jocril/`
**Status**: Active
**Priority**: Medium
**Last Updated**: 2026-02-01

---

## What Is This?

An **e-commerce platform** for **Jocril Acrílicos** (professional acrylic display products).

**Template-Variant Product Model**: Products have templates → variants (customizations)

---

## Current State

### ✅ What's Working

- **Next.js 16** with App Router
- **Template-variant product system**
- **Public storefront** (product browsing, cart)
- **Admin routes** (protected)
- **Supabase** (database)
- **Clerk** (authentication - not Supabase Auth)
- **Well-documented** (ARCHITECTURE.md, AI_RULES.md, DOCS_INDEX.md, AGENTS.md hierarchy)
- **Test coverage** (Vitest)
- **System invariants** validation script

### ⚠️ What's Incomplete

- **Product import** - Back office fixed, upload functionality working. ~2 hours remaining to complete all file uploads
- **Store finalization** - Still in setup phase
- **RLS policies** - Legacy Supabase Auth RLS (not compatible with Clerk)

### 🔴 What's Broken

**None identified** - system appears functional but incomplete.

---

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS v4
- **UI**: Radix UI, shadcn components
- **Auth**: Clerk (Portuguese localization)
- **Database**: Supabase (NOT using Supabase Auth)
- **Forms**: React Hook Form + Zod validation
- **Testing**: Vitest + @testing-library/react
- **Analytics**: Vercel Analytics
- **Email**: Resend
- **Charts**: Recharts
- **Package Manager**: Bun

---

## Quick Commands

```bash
bun dev                  # Development server
bun build                # Production build
bun lint                 # ESLint
bun test                 # Run tests
bun test:coverage        # Test coverage
bun verify:invariants    # Verify system invariants
```

---

## Key Files

- `ARCHITECTURE.md` - Folder responsibilities, governance hierarchy
- `AI_RULES.md` - Universal AI constraints (overrides everything)
- `AGENTS.md` - Project-wide patterns (nearest-wins hierarchy)
- `DOCS_INDEX.md` - Documentation index
- `documents/` - Reference documentation, content templates
- `scripts/verify-system-invariants.ts` - System validation

---

## Architecture Principles

### 1. Separation of Concerns
- **Pages** (`app/`) - Routing & data fetching
- **Components** (`components/`) - UI rendering
- **Libraries** (`lib/`) - Business logic & data access
- **Hooks** (`hooks/`) - Stateful behavior
- **Contexts** (`contexts/`) - Cross-cutting state (cart, auth)

### 2. Just-in-Time Documentation
- Document at point of use
- Avoid centralized sprawl
- Keep guidance close to code

### 3. Nearest-Wins AGENTS.md Hierarchy
```
AI_RULES.md               → Universal constraints (always applies)
    ↓
/AGENTS.md                → Project-wide patterns
    ↓
/app/AGENTS.md            → App-specific patterns
/components/AGENTS.md     → Component patterns
/lib/AGENTS.md            → Library patterns
```

### 4. Human-in-the-Loop Governance
- Architectural decisions require approval
- AI proposes, human disposes
- Governance files are human-controlled

---

## RLS Warning ⚠️

**Legacy RLS Policies** exist but are **bypassed**:
- RLS assumes Supabase Auth (`auth.uid()`)
- System uses **Clerk** authentication
- Application layer enforces access control
- Most DB operations use service-role (bypasses RLS)
- **Do NOT rely on `auth.uid()`** - it won't work with Clerk

---

## Next Steps

1. **Complete file uploads** - ~2 hours remaining
2. **Send to client** - Client will help with uploads and store placement
3. **Finalize store setup** - Complete storefront features
4. **Test checkout flow** - End-to-end testing
5. **Deploy to production** - Launch store
6. **Marketing plan** - Drive traffic

---

## Notes for Clawbot

- **Template-variant model** - Products → Templates → Variants (customizations)
- **Clerk auth** (not Supabase Auth) - RLS policies are legacy/inactive
- **AI_RULES.md overrides everything** - Read it first
- **AGENTS.md hierarchy** - Nearest wins (read closest to file)
- **Governance files human-controlled** - Don't modify without approval
- **Well-documented** - Check DOCS_INDEX.md for references
- **System invariants** - Run `bun verify:invariants` to validate system state
- **Portuguese locale** - Clerk uses PT-BR localization
- **Professional products** - Acrylic displays for businesses (not consumer retail)
