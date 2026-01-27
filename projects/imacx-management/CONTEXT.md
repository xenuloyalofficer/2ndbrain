# Imacx Management - Quick Context

**Location**: `C:\Users\maria\Desktop\Imacx\IMACX_PROD\NOVO\imacx\NEW-APP\imacx-clean`
**Status**: Active (Production)
**Priority**: High
**Last Updated**: 2026-01-27

---

## What Is This?

A **comprehensive enterprise management system** for Imacx (printing/design company).

**Core Domains:**
- Production workflow
- Stock/inventory analytics
- Logistics & billing
- Financial management
- Design workflow
- Vacation management
- Quotes/budgets
- Admin settings

---

## Current State

### ✅ Production System

This is a **live production system** actively used by Imacx employees.

**Key Characteristics:**
- Large codebase with enterprise features
- Strict governance rules (GIT_AUTHORITY_CONTRACT, NO_PATCHES_CONTRACT, AI_BEHAVIOR_CONTRACT)
- Well-documented architecture in `WORK/docs/`
- Design system enforced (`.cursor/rules/design-system.md`)
- Both Supabase (auth, some tables) + MSSQL (PHC legacy system)

---

## Tech Stack

- **Frontend**: Next.js 14.2 App Router, React 18, TypeScript (strict)
- **Styling**: Tailwind CSS, Radix UI / shadcn components
- **Databases**:
  - Supabase (auth, modern tables)
  - MSSQL (PHC legacy system - `.schema('phc')`)
- **Package Manager**: pnpm
- **Testing**: Vitest, Playwright
- **Deployment**: Vercel

---

## Quick Commands

```bash
pnpm dev           # Development server
pnpm build         # Production build
pnpm lint          # Lint check
npx tsc --noEmit   # TypeScript check
pnpm test          # Run tests
pnpm test:coverage # Test coverage
```

### Supabase (Windows cmd, not PowerShell)
```cmd
supabase db push                    # Push migrations
supabase db push --include-all      # If migrations out of order
```

---

## Key Routes

| Route | Domain |
|-------|--------|
| `/producao` | Production workflow |
| `/stocks` | Inventory & analytics |
| `/gestao` | Logistics, billing, financial |
| `/definicoes` | Admin settings |
| `/designer-flow` | Design workflow |
| `/ferias` | Vacation management |
| `/orcamentos` | Quotes/budgets |
| `/dashboard` | Main dashboard |

---

## Critical Governance Rules

### 1. Git Authority (NON-NEGOTIABLE)
- **Allowed**: `git status`, `git diff`, `git log`
- **Forbidden**: Everything else without explicit approval
- **If mistake**: STOP → EXPLAIN → WAIT (no auto-fix)

### 2. No Patches Rule (NON-NEGOTIABLE)
- No global CSS with `!important`
- No hardcoded heights on generic elements
- No "quick fixes" or patches
- If rule causes problems → REMOVE IT (don't add exclusions)

### 3. File Placement
- **Root is READ-ONLY** (only CLAUDE.md, AGENTS.md allowed)
- Documentation → `WORK/docs/{architecture,features,business,analysis}/`
- Scripts → `scripts/` (reusable) or `scripts/analysis/` (one-shot)
- Migrations → `supabase/migrations/`
- Archives → `TEMP/_archived/YYYY-MM/`

### 4. Design System
- **Single source of truth**: `.cursor/rules/design-system.md`
- No hardcoded colors
- Test light + dark themes
- Follow design system strictly

### 5. Database Queries
- **PHC queries**: Always use `.schema('phc')`
- **Auth**: Use `getUser()` not `getSession()`
- **Cancelled invoices**: Always `WHERE anulado = false`

---

## Directory Structure

```
imacx-clean/
├── app/                      # Next.js App Router
│   ├── producao/            # Production
│   ├── stocks/              # Inventory
│   ├── gestao/              # Logistics/billing
│   ├── definicoes/          # Admin
│   ├── designer-flow/       # Design
│   ├── ferias/              # Vacation
│   ├── orcamentos/          # Quotes
│   └── dashboard/           # Main dashboard
├── components/              # React components
├── hooks/                   # Custom hooks
├── lib/                     # Utilities
├── types/                   # TypeScript types
├── scripts/                 # Reusable scripts
│   ├── etl/                # ETL scripts (data migration)
│   └── analysis/           # One-shot analysis
├── supabase/               # Supabase migrations
├── chrome-extension/       # Browser extension (if exists)
├── WORK/                   # Documentation hub
│   └── docs/
│       ├── architecture/   # System architecture
│       ├── features/       # Feature docs
│       ├── business/       # Business logic
│       ├── analysis/       # Reports
│       └── governance/     # Contracts (git, patches, AI behavior)
└── TEMP/                   # Temporary files & archives
    ├── _archived/          # Old files by date
    └── assets/             # Binaries
```

---

## Documentation Hub

**All docs live in**: `WORK/docs/`

**Key Docs:**
- `WORK/docs/README.md` - Documentation index
- `WORK/docs/architecture/APP_ARCHITECTURE.md` - App architecture
- `WORK/docs/governance/GIT_AUTHORITY_CONTRACT.md` - Git rules
- `WORK/docs/governance/NO_PATCHES_CONTRACT.md` - No patches rule
- `WORK/docs/governance/AI_BEHAVIOR_CONTRACT.md` - AI behavior rules
- `.cursor/rules/design-system.md` - Design system
- `scripts/etl/README_ETL_SCRIPTS.md` - ETL guide

---

## Next Steps

*(To be filled in after deeper audit)*

- Review recent changes/features
- Check for any pending migrations
- Verify production deployment status
- Review any outstanding bugs/issues
- Plan next features

---

## Notes for Clawbot

- **This is PRODUCTION** - be extremely careful
- **Strict governance** - follow all contracts religiously
- **Read AGENTS.md first** - hierarchical documentation (root + sub-agents in each folder)
- **Design system is law** - never invent styles
- **Dual database** - Supabase (modern) + MSSQL PHC (legacy)
- **Root is read-only** - don't create files there
- **Documentation lives in WORK/docs/** - not in root
- **Git authority** - only status/diff/log without permission
- **No patches** - if something breaks, fix root cause, don't patch
- **ETL scripts exist** - for data migration after schema changes
- **Well-tested** - Vitest + Playwright tests
- **Enterprise-grade** - used by real company with real users

This is a **large, mature, production system**. Go slow, read docs, follow rules.
