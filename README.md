# Maria's Second Brain

**Purpose**: Centralized knowledge base for all projects, designed to give Clawbot (Claude) complete context.

**Last Updated**: 2026-01-27

---

## 📁 Project Portfolio

| Project | Status | Priority | Location |
|---------|--------|----------|----------|
| **Flow Stach** (Webflow Template Market) | Active | High | `C:\Users\maria\Desktop\pessoal\FLOW_PARTY\flow-stach` |
| **Take It Down** (Online Reporting Tool) | Active | High | `C:\Users\maria\Desktop\pessoal\take-it-down\privacy-complaint-tool` |
| **Imacx Management** | Active | High | `C:\Users\maria\Desktop\Imacx\IMACX_PROD\NOVO\imacx\NEW-APP\imacx-clean` |
| **Jocril E-commerce** | Active | Medium | `C:\Users\maria\Desktop\pessoal\jocril\SITES\loja-jocril` |
| **DARVO Transcripts** | Active | Medium | `C:\Users\maria\Desktop\pessoal\DARVO-Transcripts` |
| **Scientology Archive** | Planning | Low | TBD (documents pending) |
| **2nd Brain** (This System) | Active | High | `C:\Users\maria\Desktop\pessoal\2nd-brain` |

---

## 🗂️ Structure

```
2nd-brain/
├── projects/               # One folder per project
│   ├── flow-stach/
│   ├── take-it-down/
│   ├── imacx-management/
│   ├── jocril-ecommerce/
│   ├── darvo-transcripts/
│   ├── scientology-archive/
│   └── 2nd-brain/
├── knowledge/              # Cross-project knowledge
│   ├── tech-stack/
│   ├── patterns/
│   └── workflows/
├── active/                 # Current work tracking
│   ├── TODAY.md
│   ├── THIS_WEEK.md
│   └── BLOCKED.md
└── archive/                # Historical records
    └── 2026-01/
```

---

## 🚀 Quick Start for Clawbot

When starting a conversation, Clawbot should:

1. **Check `active/TODAY.md`** - What's the current focus?
2. **Read relevant `projects/[name]/CONTEXT.md`** - Get project overview
3. **Review `projects/[name]/ROADMAP.md`** - Understand next steps
4. **Check `active/BLOCKED.md`** - Are there any blockers?

---

## 📋 Project Templates

Each project folder contains:

- `PROJECT_AUDIT.md` - Comprehensive technical audit
- `CONTEXT.md` - Quick context (5-minute read)
- `ROADMAP.md` - What's next
- `DECISIONS.md` - Architecture decision log
- `TECH_STACK.md` - Technologies used

---

## 🔄 Maintenance

- **Daily**: Update `active/TODAY.md`
- **Weekly**: Update `active/THIS_WEEK.md` and project ROADMAPs
- **Monthly**: Archive old audits, update CONTEXT files
- **After major changes**: Run project audit, update docs

---

## 📖 Usage Notes

This is a **living document system**. Always keep it up to date so Clawbot has accurate context.

When blocked, document it in `active/BLOCKED.md` immediately.

When making architectural decisions, log them in the project's `DECISIONS.md`.

---

## 🛠️ Tools

- **Audit Script**: Run `docs/cli-prompts/00-full-project-audit.md` in each project
- **Template**: Use `projects/PROJECT_TEMPLATE.md` for new project audits

---

## 🌐 Deployment

### GitHub Repository
- **URL**: https://github.com/xenuloyalofficer/2ndbrain
- **Branch**: `main`
- **Access**: Private repository (owner: xenuloyalofficer)

### Vercel (Ready for Future Deployment)
- **Status**: Configured, not deployed yet
- **Token**: Set up and ready
- **Use Case**: When adding a documentation website (Nextra, VitePress, etc.)

See `DEPLOYMENT.md` for detailed deployment instructions.

---

## 🔐 Access for Clawbot

Clawbot can access this 2nd Brain via:
1. **GitHub API** - Read documentation files directly from repository
2. **Local Files** - When running locally with Claude Code
3. **Vercel** (future) - When deployed as a documentation site

---

## 📊 Stats

- **Total Projects**: 7 (6 documented, 1 pending)
- **Documentation Lines**: ~11,000+ lines
- **Tech Stack Guides**: 3 (Next.js, Convex, Clerk)
- **Pattern Guides**: 0 (planned)
- **Workflow Guides**: 0 (planned)
