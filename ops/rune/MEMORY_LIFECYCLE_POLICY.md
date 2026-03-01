# MEMORY LIFECYCLE POLICY (canonical)

## Goal
Keep Rune memory lean, searchable, and durable:
- **Canonical truth** in SKLite (`ops/rune/`)
- **Fast retrieval** via SQLite index
- **Local workspace memory** as short-lived working cache

## Memory tiers

### Tier 1 — Canonical (long-term truth)
Path: `/mnt/usb-ssd/repos/2ndbrain/ops/rune/`
Files:
- `MEMORY.sklite.md`
- `CURRENT.md`
- `MODEL_MAP.md`
- `RUNBOOK.md`
- `SOURCES_INDEX.md`

Rules:
- This tier is authoritative.
- Keep concise, factual, deterministic.
- Commit/push changes.

### Tier 2 — Local working memory (short-term)
Path: `~/.openclaw/workspace/memory/*.md`
Rules:
- Keep only active/recent context.
- Do not treat as canonical truth.
- Promote durable facts weekly to Tier 1.

### Tier 3 — Retrieval layer (SQLite)
Path: `~/.openclaw/workspace/memory/memory.db`
Rules:
- Use for lexical/semantic retrieval.
- Keep index healthy and idempotent.
- Tombstones respected in active retrieval.

## Retention policy
- Keep local daily notes in active window: **last 14 days**.
- Older daily notes become **archive-candidate** and should be compacted into SKLite facts + indexed references.
- Pinned/critical records are never auto-removed.

## Compaction cadence
- **Weekly pass**: promote facts/rules/decisions to SKLite.
- **Monthly pass**: archive-candidate review and prune plan.

## Promotion rules
Promote to SKLite when item is:
- stable preference/rule
- recurring schedule/commitment
- architecture or operations decision
- safety constraint

Do not promote:
- transient debugging chatter
- one-off noisy tool output

## Non-negotiables
- Never guess when uncertain.
- Canonical edits should be short and factual.
- Always provide terminal-first read commands for docs.
