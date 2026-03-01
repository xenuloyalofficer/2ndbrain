# CURRENT (Rune)

- Canonical memory path: `/mnt/usb-ssd/repos/2ndbrain/ops/rune/`.
- Governing model policy: primary `openai-codex/gpt-5.3-codex`, fallback `kimi-coding/k2p5`, local LM Studio ops-only.
- Heartbeat strategy: reduced cadence + Kimi for heartbeat jobs; critical reminders remain cron-driven.
- LM Studio watchdog active via systemd timer (`rune-lmstudio-watchdog.timer`), checks every 60s.
- OpenClaw gateway active; built-in memory search disabled during governed canary path.
