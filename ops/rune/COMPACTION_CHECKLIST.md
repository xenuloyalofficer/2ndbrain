# COMPACTION CHECKLIST

## Pre-check
- [ ] Canonical path exists: `/mnt/usb-ssd/repos/2ndbrain/ops/rune/`
- [ ] Local memory source exists: `~/.openclaw/workspace/memory/`
- [ ] SQLite DB exists: `~/.openclaw/workspace/memory/memory.db`

## Step 1 — Inventory
- [ ] Count local `.md` memory files
- [ ] Split into active window (14d) vs archive-candidate
- [ ] Generate/refresh `SOURCES_INDEX.md`

## Step 2 — Promote
- [ ] Extract stable facts/rules/commitments from recent files
- [ ] Update `MEMORY.sklite.md`
- [ ] Update `CURRENT.md`

## Step 3 — Validate retrieval
- [ ] Run lexical retrieval smoke from promoted facts
- [ ] Confirm deterministic envelope (`ok/data/error/meta`)
- [ ] Confirm tombstones excluded in active retrieval

## Step 4 — Archive plan
- [ ] Produce archive-candidate list (non-destructive)
- [ ] Mark prune-ready files explicitly
- [ ] Keep rollback path clear

## Step 5 — Persist
- [ ] `git add ops/rune/*`
- [ ] Commit with compaction message
- [ ] Push

## Output artifacts
- `COMPACTION_PASS_<date>.md`
- updated canonical SKLite files
- updated source index
