# Take It Down - Quick Context

**Location**: `C:\Users\maria\Desktop\pessoal\take-it-down\privacy-complaint-tool`
**Status**: Active
**Priority**: High
**Last Updated**: 2026-01-27

---

## What Is This?

A **privacy complaint automation tool** that helps harassment victims file legally-compliant complaints against YouTube/Google.

**Key Innovation**: Generates framework-specific complaint text based on user's jurisdiction (GDPR, NetzDG, eSafety, CCPA, etc.)

---

## Current State

### ✅ What's Working

- **7-Step Wizard Flow** - Complete user journey from video URL to submission
- **Jurisdiction System** - 50+ countries with 8 legal frameworks
- **Framework-Specific Templates** - Auto-generated complaints (NetzDG, GDPR, eSafety, CCPA, etc.)
- **YouTube Integration** - URL parsing, transcript fetching, thumbnail display
- **Transcript Analysis** - Fetch transcripts, search for identifiers
- **Identification Calculator** - Case strength based on evidence
- **Auth System** - Clerk authentication with Convex sync
- **Complete Landing Page** - Marketing content, crisis resources, FAQ

### ⚠️ What's Incomplete

- **AI Classification UI** - Backend complete, UI integration missing
  - No "Classify with AI" button in transcript page
  - No progress indicator during batch processing
  - Mention cards not wired to classification data
- **Subscription System** - Schema ready, Stripe not integrated
- **Proxy Mode** - Landing page section exists, no workflow
- **Multi-Platform** - Currently YouTube-only
- **No Tests** - Zero test coverage

### 🔴 What's Broken

**No critical failures.** Minor UI integration gaps.

---

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS v4
- **Backend**: Convex (database + backend functions)
- **Auth**: Clerk
- **AI**: OpenRouter (Kimi K2, Qwen3 Coder, GLM 4.5 Air) for transcript classification
- **Payments**: Stripe (planned, not integrated)
- **Deployment**: Localhost only (not deployed)

---

## Quick Commands

```bash
# Development
npm run dev              # Start Next.js
npx convex dev           # Start Convex (separate terminal)

# Type check
npx tsc --noEmit

# Lint
npm run lint

# Build
npm run build
npm run start
```

---

## Key Files

- `convex/schema.ts` - Database schema (users, complaints, transcriptMentions)
- `src/lib/jurisdictions.ts` - 50+ countries with legal framework data
- `src/lib/complaint-templates.ts` - Framework-specific generators
- `src/lib/youtube.ts` - YouTube API utilities
- `src/lib/identification.ts` - Case strength calculator
- `convex/actions/classifyTranscript.ts` - AI classification action
- `IMPLEMENTATION_PLAN.md` - AI classification implementation details

---

## Next Steps

1. **Complete AI Classification UI**
   - Add "Classify with AI" button
   - Show progress indicator
   - Wire up mention cards to data

2. **Add Test Coverage**
   - Unit tests for utilities
   - E2E tests for wizard flow

3. **Production Deployment**
   - Deploy to Vercel
   - Configure domain
   - Deploy Convex to production

4. **Legal Review**
   - Review complaint templates
   - Add disclaimers

5. **Marketing Plan**
   - Finalize landing page
   - Launch strategy

---

## Notes for Clawbot

- **7-step wizard** is the core flow - don't skip steps
- **Framework-specific templates** are the secret sauce - each jurisdiction has different legal requirements
- **Identification strength** is calculated from transcript mentions + visual appearances
- **AI classification** is implemented but not integrated into UI yet (high priority)
- **OpenRouter API key required** for AI features
- **Very focused scope** - harassment victims filing YouTube complaints
- **Legally sensitive** - templates need lawyer review before production launch
- **Crisis resources** are prominent - user safety is priority
- **No tests yet** - critical gap for production readiness
