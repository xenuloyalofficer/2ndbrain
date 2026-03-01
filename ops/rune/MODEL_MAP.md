# Model Map (Rune / OpenClaw)

## Defaults
- Primary: openai-codex/gpt-5.3-codex
- Fallback: kimi-coding/k2p5

## Local (ops-only)
- lmstudio/qwen2.5-coder-1.5b-instruct (temp=0)
- Use only for: health checks, tiny triage, restart decisions
- Never for: writing files, long prompts, summarization

## Extra
- openai/gpt-4.1-mini (emergency bridge)
- google/gemini-2.0-flash (fast fallback)

## Endpoints
- lmstudio: http://127.0.0.1:1234/v1
- openrouter: https://openrouter.ai/api/v1
- kimi: https://api.kimi.com/coding/
