# [Project Name] - Project Documentation Template

**Use this template when documenting a new project.**

---

## CONTEXT.md Template

```markdown
# [Project Name] - Quick Context

**Location**: `[Absolute path to project]`
**Status**: [Active/Planning/On Hold/Completed]
**Priority**: [High/Medium/Low]
**Last Updated**: YYYY-MM-DD

---

## What Is This?

[1-2 sentence description of the project]

---

## Current State

**What's Working**:
- Feature 1
- Feature 2

**What's Incomplete**:
- Feature X
- Feature Y

**What's Broken**:
- Issue 1
- Issue 2

---

## Tech Stack

- **Frontend**: [Framework, libraries]
- **Backend**: [Database, API, auth]
- **Deployment**: [Hosting, CI/CD]
- **Tools**: [Build tools, testing]

---

## Quick Commands

```bash
# Development
[command to start dev server]

# Build
[command to build]

# Test
[command to run tests]

# Deploy
[command to deploy]
```

---

## Key Files

- `[path]` - [Purpose]
- `[path]` - [Purpose]
- `[path]` - [Purpose]

---

## Next Steps

1. [Next major task]
2. [Next major task]
3. [Next major task]

---

## Notes for Clawbot

[Any important context, gotchas, or things to be aware of when working on this project]
```

---

## ROADMAP.md Template

```markdown
# [Project Name] - Roadmap

**Last Updated**: YYYY-MM-DD

---

## Now (This Week)

- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

---

## Next (This Month)

- [ ] Task 4
- [ ] Task 5
- [ ] Task 6

---

## Later (This Quarter)

- [ ] Feature 1
- [ ] Feature 2
- [ ] Feature 3

---

## Ideas (Backlog)

- Idea 1
- Idea 2
- Idea 3
```

---

## DECISIONS.md Template

```markdown
# [Project Name] - Architecture Decision Log

**Purpose**: Document important architectural and technical decisions.

---

## Template for New Decisions

### [Decision Title]
**Date**: YYYY-MM-DD
**Status**: [Proposed/Accepted/Deprecated/Superseded]
**Deciders**: [Who made this decision]

**Context**:
What's the situation and problem statement?

**Options Considered**:
1. Option 1 - [Pros/Cons]
2. Option 2 - [Pros/Cons]
3. Option 3 - [Pros/Cons]

**Decision**:
What was chosen and why?

**Consequences**:
- Positive: [What improves]
- Negative: [What trade-offs]
- Neutral: [Other impacts]

---

## Decisions

[List decisions here, newest first]
```

---

## TECH_STACK.md Template

```markdown
# [Project Name] - Tech Stack

**Last Updated**: YYYY-MM-DD

---

## Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| [Framework] | vX.X | [Why used] |
| [Library] | vX.X | [Why used] |

---

## Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| [Database] | vX.X | [Why used] |
| [API] | vX.X | [Why used] |

---

## DevOps

| Technology | Version | Purpose |
|------------|---------|---------|
| [Tool] | vX.X | [Why used] |

---

## Testing

| Technology | Version | Purpose |
|------------|---------|---------|
| [Framework] | vX.X | [Why used] |

---

## Dependencies

### Critical Dependencies
- [Package] - [Why critical]

### Optional Dependencies
- [Package] - [What it enables]

---

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `VAR_NAME` | Yes/No | [What it does] |
```

---

## PROJECT_AUDIT.md Template

Use the audit script from:
`C:\Users\maria\Desktop\pessoal\FLOW_PARTY\flow-stach\docs\cli-prompts\00-full-project-audit.md`

This generates a comprehensive technical audit covering:
1. Project structure
2. Extensions/integrations
3. Routes and features
4. Backend/database
5. Core functionality
6. System integrations
7. Auth/security
8. Environment/deployment
9. Known issues
10. Test coverage

---

## Usage

1. Copy this template to a new project folder
2. Fill in CONTEXT.md first (quick overview)
3. Run full audit to generate PROJECT_AUDIT.md
4. Create ROADMAP.md with next steps
5. Log decisions as they're made in DECISIONS.md
6. Document tech stack in TECH_STACK.md
