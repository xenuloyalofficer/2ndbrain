# 2nd Brain - Quick Context

**Last Updated**: 2026-01-27

---

## What Is This?

The **2nd Brain** is a meta-documentation system that provides Claude (Clawbot) with complete context about all your projects. It's a hierarchical knowledge base designed for AI agent efficiency.

---

## Purpose

1. **Instant Context**: Give Clawbot full project understanding in seconds
2. **Cross-Project Knowledge**: Shared tech stack, patterns, workflows
3. **Progress Tracking**: Active tasks, blockers, weekly goals
4. **Historical Archive**: Decision logs, audits, snapshots

---

## Structure

```
2nd-brain/
├── README.md                    # Main index (this is the entry point)
├── projects/                    # Per-project documentation
│   ├── flow-stach/             # Each project gets 3 files:
│   │   ├── CONTEXT.md          # 5-minute overview
│   │   ├── ROADMAP.md          # Next steps
│   │   └── PROJECT_AUDIT.md   # Comprehensive technical audit
│   ├── take-it-down/
│   ├── imacx-management/
│   ├── jocril-ecommerce/
│   ├── darvo-transcripts/
│   └── 2nd-brain/              # Meta (this project)
├── knowledge/                   # Cross-project knowledge
│   ├── tech-stack/             # nextjs.md, convex.md, clerk.md, etc.
│   ├── patterns/               # auth-patterns.md, clipboard-patterns.md
│   └── workflows/              # git-workflow.md, deployment-checklist.md
├── active/                      # Current work
│   ├── TODAY.md                # Daily focus
│   ├── THIS_WEEK.md            # Weekly goals
│   └── BLOCKED.md              # Blockers across all projects
├── archive/                     # Historical records
│   └── 2026-01/                # Organized by YYYY-MM
│       ├── flow-stach-audit-2026-01-27.md
│       ├── take-it-down-audit-2026-01-27.md
│       └── ...
└── PROJECT_TEMPLATE.md         # Template for future projects
```

---

## How Clawbot Uses This

### 1. Quick Start (5 minutes)
```
Read: README.md → Get overview of all projects
Read: projects/{name}/CONTEXT.md → 5-minute project overview
```

### 2. Deep Dive (30 minutes)
```
Read: projects/{name}/PROJECT_AUDIT.md → Comprehensive technical audit
Read: knowledge/tech-stack/{tech}.md → Learn about shared technologies
```

### 3. Active Work
```
Read: active/TODAY.md → What's the current focus?
Read: active/BLOCKED.md → Any blockers?
Read: projects/{name}/ROADMAP.md → Next steps for project
```

---

## Tech Stack

None - this is pure documentation (Markdown files only).

---

## What's Working

- ✅ **Project Audits**: 5 of 7 projects fully audited
  - Flow Stach (comprehensive 10-part audit)
  - Take It Down (complete)
  - Imacx Management (high-level, production system)
  - Jocril E-commerce (complete)
  - DARVO Transcripts (complete)
- ✅ **Folder Structure**: Organized, hierarchical
- ✅ **Template System**: Reusable templates for future projects
- ✅ **Active Tracking**: TODAY.md, THIS_WEEK.md, BLOCKED.md

---

## What's Missing

- ⏳ **Scientology Archive**: Not available yet (documents pending)
- ⏳ **Knowledge Base**: `knowledge/` folder structure created but not populated
  - No tech stack guides (nextjs.md, convex.md, etc.)
  - No pattern guides (auth-patterns.md, clipboard-patterns.md, etc.)
  - No workflow guides (git-workflow.md, deployment-checklist.md, etc.)
- ⏳ **2nd Brain Audit**: This meta project needs its own PROJECT_AUDIT.md

---

## Next Steps (This Week)

1. **Complete 2nd Brain Audit**: Create PROJECT_AUDIT.md for this project
2. **Populate Knowledge Base**: Create tech-stack guides (Next.js, Convex, Clerk, Supabase, etc.)
3. **Document Patterns**: Auth patterns, clipboard patterns, etc.
4. **Create Workflow Guides**: Git workflow, deployment checklists

---

## Key Principles

### 1. Nearest-Wins Hierarchy
- **Root README.md**: Entry point for all projects
- **Project CONTEXT.md**: 5-minute overview
- **Project PROJECT_AUDIT.md**: Comprehensive technical audit

### 2. Cross-Project Knowledge
- **Tech stack guides**: Shared technologies across projects
- **Pattern guides**: Reusable patterns and conventions
- **Workflow guides**: Common procedures and checklists

### 3. Token Efficiency
- **Layered detail**: Quick context first, deep dive when needed
- **No duplication**: Cross-project knowledge lives in one place
- **Historical archive**: Past decisions separated from active work

### 4. AI-First Design
- **Clear hierarchy**: Easy for AI to navigate
- **Consistent structure**: Same 3-file pattern per project
- **Explicit relationships**: Links between related docs

---

## Current Status

**Phase**: Setup complete, knowledge base pending

**Progress**:
- ✅ Folder structure created
- ✅ 5 of 7 project audits complete
- ✅ Active tracking system in place
- ⏳ Knowledge base structure created but empty
- ⏳ Scientology Archive pending (documents not available)

---

**Location**: `C:\Users\maria\Desktop\pessoal\2nd-brain`
