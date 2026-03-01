# RUNBOOK (Rune recovery)

## Canonical source of truth
- Folder: `/mnt/usb-ssd/repos/2ndbrain/ops/rune/`
- Core files:
  - `MODEL_MAP.md`
  - `MEMORY.sklite.md`
  - `CURRENT.md`
  - `RUNBOOK.md`

## Fast health checks
```bash
curl -sS -m 2 http://127.0.0.1:1234/v1/models >/dev/null || systemctl --user restart openclaw-gateway.service
systemctl --user status openclaw-gateway.service --no-pager --lines=20
```

## Read docs in terminal
```bash
less /mnt/usb-ssd/repos/2ndbrain/ops/rune/MEMORY.sklite.md
less /mnt/usb-ssd/repos/2ndbrain/ops/rune/CURRENT.md
less /mnt/usb-ssd/repos/2ndbrain/ops/rune/RUNBOOK.md
```

## If runtime is unstable
1. Keep system in read-only safe behavior.
2. Do deterministic checks first (no guesses).
3. Avoid GUI/VNC/Ollama startup attempts.
4. Use canonical files above as rebuild baseline.

## Backup discipline
- Commit/push canonical folder regularly.
- If push fails: capture exact stderr and report it verbatim.
