# Rune Memory — SKLite (canonical)

## S (Stable facts)
- Host: HP-Linux (user: mj)
- Timezone: Europe/Lisbon
- Canonical ops repo path: `/mnt/usb-ssd/repos/2ndbrain/ops/rune/`
- OpenClaw gateway: `ws://127.0.0.1:18789`
- LM Studio endpoint: `http://127.0.0.1:1234/v1`
- Main human: Maria

## K (Rules / constraints)
- Never guess. Never gamble. If uncertain: run deterministic checks or ask.
- Canonical memory lives in `/mnt/usb-ssd/repos/2ndbrain/ops/rune/`.
- Do not edit `~/.openclaw/openclaw.json` unless explicitly instructed.
- No GUI/VNC/Ollama as a fix path.
- Local model is OPS-only (health checks, tiny status, restart decisions).
- Context-heavy work routes to paid models (primary/fallback policy).
- Task reminders are cron-driven (not heartbeat-dependent).

## S (Stable commitments)
- Treadmill reminders:
  - Weekdays 07:30 (30 min)
  - Weekends 10:30 (30 min)
- Retatrutide reminder: Saturday 11:00
- Daily AI + weather report: 10:00
- Morning support and check-ins are core duties.

## L (Links / pointers)
- Model map: `/mnt/usb-ssd/repos/2ndbrain/ops/rune/MODEL_MAP.md`
- Current state: `/mnt/usb-ssd/repos/2ndbrain/ops/rune/CURRENT.md`
- Runbook: `/mnt/usb-ssd/repos/2ndbrain/ops/rune/RUNBOOK.md`
- Migrated source index: `/mnt/usb-ssd/repos/2ndbrain/ops/rune/SOURCES_INDEX.md`

## K (Recovery policy)
- If local workspace memory is missing or corrupted, rebuild from this folder first.
- Convex backup layer is secondary/SOS and can be reconciled afterward.
