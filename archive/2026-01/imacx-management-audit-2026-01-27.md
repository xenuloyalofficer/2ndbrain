# IMACX MANAGEMENT SYSTEM - PROJECT AUDIT (High-Level)

**Date**: 2026-01-27
**Working Directory**: `C:\Users\maria\Desktop\Imacx\IMACX_PROD\NOVO\imacx\NEW-APP\imacx-clean`
**Status**: **PRODUCTION SYSTEM** (Active)

**⚠️ IMPORTANT**: This is a streamlined audit. Full enterprise audit would require significantly more time given the system's complexity.

---

## Executive Summary

**Imacx Management** is a comprehensive enterprise management system for a printing/design company. It's a **live production system** with strict governance rules, dual database architecture (Supabase + MSSQL PHC), and covers multiple business domains.

---

## Part 1: Project Overview

### System Type
Enterprise management system (production-ready, actively used)

### Core Domains

| Domain | Route | Purpose |
|--------|-------|---------|
| **Production** | `/producao` | Production workflow management |
| **Stock/Inventory** | `/stocks` | Inventory tracking and analytics |
| **Logistics & Billing** | `/gestao` | Financial management, logistics, billing |
| **Admin Settings** | `/definicoes` | System configuration, permissions |
| **Design Workflow** | `/designer-flow` | Design project management |
| **Vacation Management** | `/ferias` | Employee vacation tracking |
| **Quotes/Budgets** | `/orcamentos` | Quote generation and management |
| **Dashboard** | `/dashboard` | Main overview dashboard |

---

## Part 2: Tech Stack

### Frontend
- **Framework**: Next.js 14.2 App Router
- **Language**: TypeScript (strict mode)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Components**: Radix UI / shadcn
- **Theme**: next-themes (light/dark mode support)
- **Charts**: Recharts
- **Virtualization**: `@tanstack/react-virtual`, `react-window`
- **Excel Export**: ExcelJS

### Backend & Data
- **Primary DB**: Supabase (auth, modern tables)
- **Legacy DB**: MSSQL (PHC system - `.schema('phc')`)
- **Auth**: Supabase Auth
- **SSR**: `@supabase/ssr`

### Development Tools
- **Package Manager**: pnpm
- **Testing**: Vitest (unit), Playwright (E2E)
- **Linting**: ESLint (custom plugin: `eslint-plugin-imx`)
- **Formatting**: Prettier
- **Git Hooks**: Husky + lint-staged
- **Bundle Analysis**: `@next/bundle-analyzer`

### Deployment
- **Platform**: Vercel (based on `.vercel` folder)

---

## Part 3: Architecture Principles

### Governance Contracts (NON-NEGOTIABLE)

1. **GIT_AUTHORITY_CONTRACT** (`WORK/docs/governance/`)
   - Only `git status`, `git diff`, `git log` allowed without permission
   - All other git commands require explicit approval
   - Mistakes: STOP → EXPLAIN → WAIT (no auto-fix)

2. **NO_PATCHES_CONTRACT** (`WORK/docs/governance/`)
   - No global CSS with `!important`
   - No hardcoded heights on generic elements
   - No "quick fixes" or workarounds
   - If a rule causes problems → REMOVE THE RULE (don't patch)

3. **AI_BEHAVIOR_CONTRACT** (`WORK/docs/governance/`)
   - Ask before: creating files, deleting data, schema changes, adding dependencies
   - Never assume IDs, columns, or user intent exist
   - "Remove" means DEACTIVATE unless told otherwise
   - Mistakes: STOP → DECLARE → WAIT

### Design System Enforcement
- **Single Source of Truth**: `.cursor/rules/design-system.md`
- No hardcoded colors allowed
- Must test light + dark themes
- Declarative, consistent code

### File Placement Rules
- **Root is READ-ONLY** (only `CLAUDE.md`, `AGENTS.md` allowed)
- Documentation → `WORK/docs/{architecture,features,business,analysis}/`
- Scripts → `scripts/` (reusable) or `scripts/analysis/` (one-shot)
- ETL → `scripts/etl/`
- Migrations → `supabase/migrations/`
- Archives → `TEMP/_archived/YYYY-MM/`
- Binaries → `TEMP/assets/`

### Database Conventions
- **PHC queries**: Always `.schema('phc').from('table')`
- **Auth**: Use `getUser()` not `getSession()`
- **Cancelled invoices**: Always filter `WHERE anulado = false`

---

## Part 4: Project Structure

```
imacx-clean/
├── .agent/                   # AI agent configurations
├── .claude/                  # Claude-specific settings
├── .cursor/                  # Cursor IDE rules (design-system.md)
├── .github/                  # GitHub workflows
├── .husky/                   # Git hooks
├── app/                      # Next.js App Router
│   ├── dashboard/           # Main dashboard
│   ├── producao/            # Production workflow
│   ├── stocks/              # Inventory
│   ├── gestao/              # Logistics/billing
│   ├── definicoes/          # Admin settings
│   ├── designer-flow/       # Design workflow
│   ├── ferias/              # Vacation management
│   ├── orcamentos/          # Quotes/budgets
│   ├── login/               # Auth
│   └── style-guide/         # Component showcase
├── components/              # Reusable React components
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions
├── types/                   # TypeScript type definitions
├── scripts/                 # Automation scripts
│   ├── etl/                # ETL (data migration after schema changes)
│   └── analysis/           # One-shot analysis scripts
├── supabase/               # Supabase config & migrations
├── chrome-extension/       # (if exists) Browser extension
├── WORK/                   # Documentation hub
│   └── docs/
│       ├── architecture/   # System architecture docs
│       ├── features/       # Feature specifications
│       ├── business/       # Business logic documentation
│       ├── analysis/       # Analysis reports
│       └── governance/     # Governance contracts
└── TEMP/                   # Temporary files & archives
    ├── _archived/          # Historical files (organized by YYYY-MM)
    └── assets/             # Binary files (images, etc.)
```

---

## Part 5: Documentation System

### Hierarchical AGENTS.md Pattern

The project uses a **hierarchical documentation system**:

1. **Root**: `AGENTS.md` (quick reference) + `CLAUDE.md` (behavioral rules)
2. **Sub-Agents**: Each major folder has its own `AGENTS.md`
   - `app/AGENTS.md`
   - `components/AGENTS.md`
   - `scripts/etl/AGENTS.md`
   - `supabase/AGENTS.md`

### Documentation Hub

**All documentation lives in**: `WORK/docs/`

**Key Documentation Files**:
- `WORK/docs/README.md` - Documentation index
- `WORK/docs/architecture/APP_ARCHITECTURE.md` - Application architecture
- `WORK/docs/governance/GIT_AUTHORITY_CONTRACT.md` - Git rules
- `WORK/docs/governance/NO_PATCHES_CONTRACT.md` - No patches rule
- `WORK/docs/governance/AI_BEHAVIOR_CONTRACT.md` - AI behavior
- `.cursor/rules/design-system.md` - Design system specification
- `scripts/etl/README_ETL_SCRIPTS.md` - ETL script documentation

---

## Part 6: Key Features (Based on Routes)

### Production Module (`/producao`)
Production workflow management for printing/design company

### Stock/Inventory Module (`/stocks`)
Inventory tracking, analytics, stock management

### Logistics & Billing (`/gestao`)
- Financial management
- Invoicing
- Logistics coordination

### Admin Settings (`/definicoes`)
- System configuration
- User permissions (`funcoes` - roles/functions)
- Access control

### Design Workflow (`/designer-flow`)
Design project management and workflow

### Vacation Management (`/ferias`)
Employee vacation tracking and approval

### Quotes/Budgets (`/orcamentos`)
Quote generation, management, and tracking

### Dashboard (`/dashboard`)
Main overview with KPIs and quick access

---

## Part 7: Database Architecture

### Dual Database System

**Supabase** (Modern):
- Auth (users, sessions)
- Modern application tables
- Real-time subscriptions
- Row-level security

**MSSQL PHC** (Legacy):
- Legacy business data
- Accounting integration
- Historical data
- Always accessed via `.schema('phc')`

### Migrations

**Location**: `supabase/migrations/`

**Naming Convention**: `YYYYMMDDHHMMSS_description.sql`

**Commands** (Windows cmd, not PowerShell):
```cmd
supabase db push
supabase db push --include-all  # if migrations out of order
```

---

## Part 8: Scripts & Automation

### ETL Scripts (`scripts/etl/`)

**Purpose**: Data migration after schema changes

**Key Scripts**:
- `run_full.py` - Full ETL pipeline
- `run_annual_historical.py` - Annual historical data migration

**When to Run**:
- After adding new columns to schema
- After major database changes

**Documentation**: `scripts/etl/README_ETL_SCRIPTS.md`

### Analysis Scripts (`scripts/analysis/`)

One-shot analysis scripts for data exploration and reporting.

---

## Part 9: Testing

### Test Infrastructure

**Unit Tests**: Vitest
```bash
pnpm test              # Run tests
pnpm test:run          # Run once
pnpm test:coverage     # Coverage report
```

**E2E Tests**: Playwright

**Test Config**: `vitest.config.ts` (likely)

### Testing Library
- `@testing-library/react` - Component testing
- `jsdom` - DOM simulation

---

## Part 10: Chrome Extension

**Location**: `chrome-extension/` (directory exists)

**Purpose**: TBD (requires investigation)

**Potential Uses**:
- Data capture from web pages
- Integration with external systems
- Quick actions from browser

---

## Part 11: Known Characteristics

### ✅ Strengths

1. **Well-Governed**
   - Clear contracts (Git, Patches, AI Behavior)
   - Strict file placement rules
   - Documentation-first approach

2. **Design System**
   - Centralized design system
   - Light + dark mode support
   - Consistent UI components

3. **Testing**
   - Unit tests (Vitest)
   - E2E tests (Playwright)
   - Test coverage tracking

4. **Documentation**
   - Hierarchical AGENTS.md pattern
   - Comprehensive docs in `WORK/docs/`
   - Inline documentation

5. **Type Safety**
   - TypeScript (strict mode)
   - Type definitions in `types/`

6. **Code Quality**
   - ESLint with custom rules
   - Prettier formatting
   - Git hooks (lint-staged)

7. **Production-Ready**
   - Deployed to Vercel
   - Dual database architecture
   - Auth system (Supabase)

### ⚠️ Considerations

1. **Complexity**
   - Large enterprise system
   - Multiple domains
   - Dual database (complexity)

2. **Legacy Integration**
   - MSSQL PHC system (legacy)
   - Requires careful handling

3. **Documentation Depth**
   - Extensive docs (good) but requires time to navigate
   - Must read AGENTS.md hierarchy

---

## Part 12: Definition of Done

Before any PR/deployment:

1. ✅ `pnpm build` passes
2. ✅ No TypeScript errors (`npx tsc --noEmit`)
3. ✅ Design system followed (light + dark mode tested)
4. ✅ No hardcoded colors
5. ✅ Tests pass
6. ✅ Linting passes

---

## Summary: What's Complete

### Core System (Production)

- ✅ **Full enterprise management system** (live in production)
- ✅ **7+ major domains** (production, stocks, logistics, billing, design, vacation, quotes)
- ✅ **Dual database** (Supabase + MSSQL PHC)
- ✅ **Auth system** (Supabase Auth)
- ✅ **Design system** (enforced via `.cursor/rules/design-system.md`)
- ✅ **Testing infrastructure** (Vitest + Playwright)
- ✅ **Documentation system** (hierarchical AGENTS.md + WORK/docs/)
- ✅ **Governance contracts** (Git, Patches, AI Behavior)
- ✅ **ETL scripts** (data migration pipeline)
- ✅ **Deployment** (Vercel)
- ✅ **Code quality tools** (ESLint, Prettier, Husky, lint-staged)

---

## Summary: What's Incomplete/Unknown

### Areas Requiring Deeper Investigation

- **Chrome Extension** - Purpose and integration unclear
- **Recent Features** - What features were added recently?
- **Pending Issues** - Any bugs or technical debt?
- **Performance** - Are there any performance bottlenecks?
- **User Feedback** - What do users want?

### Future Enhancements (TBD)

- Roadmap depends on stakeholder input
- Strategic planning needed for next iteration

---

## Summary: What's Broken

**⚠️ UNKNOWN** - Production system requires stakeholder review to identify issues.

**Note**: This audit is high-level. Production issues should be reviewed with:
- Error monitoring (Sentry? Vercel analytics?)
- User feedback
- Support tickets
- Team retrospectives

---

## Summary: What's Missing

### Not Identified (Yet)

Without deeper codebase exploration and stakeholder input, missing features cannot be definitively identified.

**Recommended Next Steps**:
1. Review recent production issues
2. Gather user feedback
3. Conduct performance audit
4. Review security posture
5. Plan next iteration with stakeholders

---

## Critical Recommendations

### Immediate

1. **Review Production Health**
   - Check error logs
   - Monitor performance
   - Review user feedback

2. **Stakeholder Alignment**
   - Schedule roadmap planning
   - Prioritize features
   - Address pain points

### High Priority

3. **Deep Dive Audit**
   - This audit is high-level
   - Full audit requires more time
   - Focus on specific domains as needed

4. **Documentation Review**
   - Ensure `WORK/docs/` is up-to-date
   - Update architecture docs if needed
   - Document any recent major changes

### Medium Priority

5. **Performance Optimization**
   - Profile slow pages
   - Optimize database queries
   - Consider caching strategies

6. **Security Audit**
   - Review auth flow
   - Check for SQL injection risks
   - Audit environment variables

---

## Notes for Future Audits

This is a **large, complex, production system**. Future audits should:

- Focus on specific domains (one at a time)
- Collaborate with domain experts
- Review actual usage patterns
- Test with real data
- Interview users

**Full enterprise audit** would require:
- Multiple days of investigation
- Access to production logs
- Stakeholder interviews
- User testing sessions
- Performance profiling

---

**END OF HIGH-LEVEL AUDIT**

**⚠️ RECOMMENDATION**: Schedule dedicated time for domain-specific deep dives based on business priorities.
