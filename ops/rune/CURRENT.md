# CURRENT (Rune canonical)

## Active operating state
- Canonical memory authority: `/mnt/usb-ssd/repos/2ndbrain/ops/rune/`
- Local workspace memory files are reference-only pointers.
- Health watchdog: `rune-lmstudio-watchdog.timer` (60s deterministic check).
- Heartbeat strategy: reduced cadence, cron is scheduler for critical reminders.

## Model routing (current policy)
- Primary heavy model: `openai-codex/gpt-5.3-codex`
- Fallback: `kimi-coding/k2p5`
- Local LM Studio: ops-only tiny tasks

## Immediate priorities
- Keep reminders/reports cron-backed.
- Keep heartbeat lightweight and non-noisy.
- Preserve deterministic checks before assumptions.
