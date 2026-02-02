# Flow Stach - Quick Context

**Location**: `C:\Users\maria\Desktop\pessoal\FLOW_PARTY\flow-stach` / `~/active-projects/flowbridge/`
**Status**: Active
**Priority**: High
**Last Updated**: 2026-02-01

---

## What Is This?

A **Webflow ecosystem** consisting of:
1. **Tool**: HTML → Webflow converter (web app)
2. **Marketplace**: Premium component library
3. **Two Extensions**: Chrome extension + Webflow Designer extension

---

## Current State

### ✅ What's Working

- **Full-stack web app** (Next.js 16 + Convex + Clerk)
- **HTML Import Wizard** - Parse AI-generated HTML, extract tokens, componentize, generate Webflow JSON
- **React → HTML Converter** - Convert React components to vanilla HTML/CSS/JS
- **Asset Marketplace** - Browse, search, favorite, copy components
- **Clipboard System** - Modern Clipboard API with Webflow compatibility
- **Flow Bridge Chrome Extension** - Auth-synced popup for copying projects
- **Flow-Goodies Webflow Extension** - In-Designer component library UI
- **Convex Backend** - 31 queries/mutations, complete schema, auth helpers

### ⚠️ What's Incomplete

- JavaScript component auto-injection (shows alert, requires manual copy-paste)
- Media queries and pseudo-classes (partial support)
- Template management UI (backend ready, no frontend)
- Full test coverage (unit tests only, no integration/E2E)
- Backend connection for Flow-Goodies (uses hardcoded sample data)
- Templates lack userId (all templates visible to everyone)

### 🔴 What's Broken

**No critical failures.** Minor CSS parsing edge cases.

---

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS v4
- **Backend**: Convex (database + backend functions)
- **Auth**: Clerk
- **Deployment**: Localhost only (not deployed)
- **Extensions**:
  - Chrome (Vite + TypeScript)
  - Webflow Designer (Webpack + TypeScript)

---

## Quick Commands

```bash
# Development
bun run dev          # Start server (Convex + Next.js)
bun run convex:dev   # Start Convex only

# Build
bun run build

# Type check
bun run typecheck

# Tests
tsx tests/flowbridge-semantic.test.ts
```

---

## Key Files

- `convex/schema.ts` - Database schema (7 tables)
- `lib/webflow-converter.ts` - HTML → Webflow JSON conversion
- `lib/clipboard.ts` - Clipboard system with Webflow compatibility
- `app/admin/import/page.tsx` - HTML import wizard
- `flow-bridge-extension/` - Chrome extension
- `Flow-Goodies-extension/` - Webflow Designer extension

---

## Next Steps

1. **Production Deployment**
   - Deploy to Vercel/Netlify
   - Configure domain (flowstach.com)
   - Deploy Convex to production

2. **Connect Flow-Goodies to Backend**
   - Replace sample data with Convex queries
   - Add Clerk auth

3. **Complete JavaScript Support**
   - Auto-inject scripts or provide clear instructions

4. **Template Management UI**
   - Build admin UI for template CRUD

5. **Partner with Designers**
   - Launch template marketplace

---

## Notes for Clawbot

- **Two extensions serve different purposes** - don't confuse them
  - Flow-Goodies = in-Designer component library
  - Flow Bridge = browser extension for project copying

- **Data model**: `templates` → `assets` → `payloads` is the user-facing flow
  - `importProjects` + `importArtifacts` is internal import pipeline

- **Full project audit available** at `PROJECT_AUDIT.md` in this folder

- **Auth can be disabled** for testing via `NEXT_PUBLIC_DISABLE_AUTH=true`

- **Very few TODOs** - codebase is well-maintained

- **LLM conversion is optional** - requires OpenRouter API key
