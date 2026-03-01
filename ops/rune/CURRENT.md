# CURRENT (Rune canonical)

## Active operating state
- Canonical memory authority: `/mnt/usb-ssd/repos/2ndbrain/ops/rune/`
- Local workspace memory files are reference-only pointers.
- Health watchdog: `rune-lmstudio-watchdog.timer` (60s deterministic check).
- Heartbeat strategy: reduced cadence + Kimi for heartbeat jobs; critical reminders remain cron-driven.

## Model routing (current policy)
- Primary heavy model: `openai-codex/gpt-5.3-codex`
- Fallback: `kimi-coding/k2p5`
- Local LM Studio: ops-only tiny tasks

## Memory compaction status
- Phase 1 complete: canonical SKLite baseline created.
- Phase 2 complete: safe prune applied (9 files moved to `memory_archive/2026-03-01`).
- Active local memory set is now leaner; retrieval remains via SQLite index.
