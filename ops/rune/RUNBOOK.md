# RUNBOOK (Rune recovery + operations)

## Canonical memory folder
`/mnt/usb-ssd/repos/2ndbrain/ops/rune/`

## Canonical files (read first)
1. `MODEL_MAP.md`
2. `MEMORY.sklite.md`
3. `CURRENT.md`
4. `RUNBOOK.md`
5. `SOURCES_INDEX.md`

## Terminal read commands
```bash
less /mnt/usb-ssd/repos/2ndbrain/ops/rune/MODEL_MAP.md
less /mnt/usb-ssd/repos/2ndbrain/ops/rune/MEMORY.sklite.md
less /mnt/usb-ssd/repos/2ndbrain/ops/rune/CURRENT.md
less /mnt/usb-ssd/repos/2ndbrain/ops/rune/RUNBOOK.md
less /mnt/usb-ssd/repos/2ndbrain/ops/rune/SOURCES_INDEX.md
```

## Deterministic health checks
```bash
curl -sS -m 2 http://127.0.0.1:1234/v1/models >/dev/null || systemctl --user restart openclaw-gateway.service
systemctl --user status openclaw-gateway.service --no-pager --lines=20
```

## Memory authority rule
- Canonical truth = `/mnt/usb-ssd/repos/2ndbrain/ops/rune/`
- `~/.openclaw/workspace/MEMORY.md` and `~/.openclaw/workspace/memory/*.md` are non-canonical working references.

## Backup discipline
```bash
cd /mnt/usb-ssd/repos/2ndbrain
git add ops/rune/
git commit -m "rune: update canonical SKLite memory"
git push
```
- If commit/push fails, report exact stderr (no guessing).
