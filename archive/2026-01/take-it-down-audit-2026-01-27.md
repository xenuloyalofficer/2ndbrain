# TAKE IT DOWN (Privacy Complaint Tool) - COMPLETE PROJECT AUDIT

**Date**: 2026-01-27
**Working Directory**: `C:\Users\maria\Desktop\pessoal\take-it-down\privacy-complaint-tool`
**Git Branch**: (check with `git status`)
**Main Branch**: TBD

---

## Part 1: Project Structure

### Top-Level Folders

| Folder | Purpose |
|--------|---------|
| `src/app/` | Next.js 16 App Router pages (landing, dashboard, wizard) |
| `src/components/` | React components (landing, wizard, complaint, transcript, UI) |
| `src/lib/` | Core utilities (YouTube API, jurisdictions, templates, identification) |
| `src/hooks/` | Custom React hooks (auth sync) |
| `convex/` | Convex backend (schema, queries, mutations, actions) |
| `public/` | Static assets (SVG icons) |

### Config Files (Root)

- `package.json` - Next.js 16, Convex, Clerk, React 19
- `tsconfig.json` - TypeScript config (strict mode)
- `tailwind.config.ts` - Tailwind CSS v4
- `next.config.ts` - Next.js configuration
- `eslint.config.mjs` - ESLint configuration
- `CLAUDE.md` - Project instructions for Claude
- `AGENTS.md` - Agent documentation
- `IMPLEMENTATION_PLAN.md` - AI transcript classification plan
- `.env.local` - Environment variables (git-ignored)
- `.env.example` - Example env vars

---

## Part 2: Core Features

### What Is This Project?

**Take It Down** is a privacy complaint automation tool designed to help harassment victims file legally-compliant privacy complaints against YouTube/Google and other platforms.

**Key Innovation**: Guides users through creating framework-specific complaints based on their jurisdiction (GDPR, NetzDG, eSafety, CCPA, etc.)

---

### User Journey (7-Step Wizard)

```
Landing Page → Sign In/Up → Dashboard → New Complaint →

Step 1: Intake (Video URL)
   ↓
Step 2: About (Identifiers: name, emails, phones, social media)
   ↓
Step 3: Jurisdiction (Country → Legal framework)
   ↓
Step 4: Transcript (Fetch transcript, find mentions, AI-classify)
   ↓
Step 5: Appearances (Visual evidence timestamps)
   ↓
Step 6: Generate (Framework-specific complaint text)
   ↓
Step 7: Submit (Guided submission checklist)
   ↓
Dashboard (Status: Submitted)
```

---

## Part 3: Web App Features

### Routes Audit

| Route | Component | Purpose | Status |
|-------|-----------|---------|--------|
| `/` | `app/page.tsx` | Landing page with marketing content | ✅ Working |
| `/sign-in` | `app/(auth)/sign-in/page.tsx` | Clerk sign-in | ✅ Working |
| `/sign-up` | `app/(auth)/sign-up/page.tsx` | Clerk sign-up | ✅ Working |
| `/dashboard` | `app/dashboard/page.tsx` | User dashboard with complaint list | ✅ Working |
| `/dashboard/complaint/new` | `app/dashboard/complaint/new/page.tsx` | Create new complaint | ✅ Working |
| `/dashboard/complaint/[id]/intake` | Step 1 | Video URL input | ✅ Working |
| `/dashboard/complaint/[id]/about` | Step 2 | Identifier inputs | ✅ Working |
| `/dashboard/complaint/[id]/jurisdiction` | Step 3 | Jurisdiction selector | ✅ Working |
| `/dashboard/complaint/[id]/transcript` | Step 4 | Transcript analysis + AI classification | ⚠️ Partial |
| `/dashboard/complaint/[id]/appearances` | Step 5 | Visual appearance timestamps | ✅ Working |
| `/dashboard/complaint/[id]/generate` | Step 6 | Generate complaint preview | ✅ Working |
| `/dashboard/complaint/[id]/submit` | Step 7 | Submission checklist | ✅ Working |

---

## Part 4: Convex Backend

### Schema (`convex/schema.ts`)

| Table | Fields | Indexes |
|-------|--------|---------|
| **users** | `clerkId` (string), `email`, `name`, `subscriptionStatus` (free\|trial\|pro), `subscriptionId`, `createdAt`, `updatedAt` | `by_clerk_id`, `by_email` |
| **complaints** | `userId`, `status` (draft\|ready\|submitted\|resolved\|rejected), `currentStep`, `createdAt`, `updatedAt`, `videoUrl`, `videoId`, `channelUrl`, `channelName`, `videoTitle`, `identifiers` (object with fullName, nicknames, socialMedia, emails, phoneNumbers, addresses, otherTerms), `jurisdictionDetails` (object with country, countryCode, framework, frameworkStrength, escalationPath, dpaName, dpaUrl), `transcript` (object with raw, language, fetchedAt, fetchError), `transcriptMatches` (array of objects), `visualAppearances` (array of objects), `identificationStrength`, `identificationFactors`, `generatedComplaint`, `complaintType`, `submittedAt`, `submissionMethod`, `referenceNumber` | `by_user`, `by_status`, `by_user_and_status` |
| **transcriptMentions** | `complaintId`, `segmentIndex`, `start`, `duration`, `text`, `contextBefore`, `contextAfter`, `nameMatched`, `classification` (object with primary, secondary, confidence, severity, reasoning, piiExposed, modelUsed), `isRelevant`, `userOverride`, `createdAt` | `by_complaint`, `by_complaint_and_relevant` |

### Convex Functions

#### users.ts
| Function | Type | Purpose | Auth | Returns |
|----------|------|---------|------|---------|
| `currentUser` | Query | Get current authenticated user | User | User object or null |
| `upsertFromClerk` | Mutation | Sync user from Clerk to Convex | Clerk | User object |

#### complaints.ts
| Function | Type | Purpose | Auth | Returns |
|----------|------|---------|------|---------|
| `list` | Query | List user's complaints | User | Array of complaints |
| `byId` | Query | Get single complaint by ID | User | Complaint object or null |
| `create` | Mutation | Create new draft complaint | User | Complaint ID |
| `update` | Mutation | Update complaint fields | User | Success boolean |
| `updateStatus` | Mutation | Change complaint status | User | Success boolean |
| `delete` | Mutation | Delete complaint | User | Success boolean |

#### transcriptMentions.ts
| Function | Type | Purpose | Auth | Returns |
|----------|------|---------|------|---------|
| `list` | Query | List mentions for complaint | User | Array of mentions |
| `storeBatch` | Mutation | Store batch of AI-classified mentions | Internal | Success boolean |
| `toggleRelevant` | Mutation | User override for mention relevance | User | Success boolean |

#### actions/classifyTranscript.ts
| Function | Type | Purpose | Auth | Returns |
|----------|------|---------|------|---------|
| `classifyMentions` | Action | AI-classify transcript mentions using OpenRouter | User | Count of classified mentions |

---

## Part 5: Key Utilities

### YouTube API (`src/lib/youtube.ts`)

**Functions:**
- `extractVideoId(url)` - Parse YouTube URL (handles 6+ formats: youtu.be, youtube.com/watch, youtube.com/embed, etc.)
- `isValidYouTubeUrl(url)` - Validate YouTube URL
- `getVideoUrl(videoId)` - Generate standard YouTube URL
- `getThumbnailUrl(videoId)` - Get thumbnail image
- `formatTimestamp(seconds)` - Convert to MM:SS
- `fetchTranscript(videoId)` - Fetch video transcript via `youtube-transcript-plus` library

**Dependencies:**
- `youtube-transcript-plus` (NPM package)

---

### Jurisdictions Database (`src/lib/jurisdictions.ts`)

**Coverage:** 50+ countries with legal framework data

**Frameworks Supported:**
1. **NetzDG** (Germany) - "Nuclear" strength
2. **GDPR** (EU/EEA) - "Strong" strength
3. **eSafety** (Australia) - "Strong" strength
4. **CCPA** (California, USA) - "Moderate" strength
5. **IT Rules** (India) - "Moderate" strength
6. **Marco Civil** (Brazil) - "Moderate" strength
7. **PIPEDA** (Canada) - "Moderate" strength
8. **Standard** (Fallback) - "Limited" strength

**Data per Jurisdiction:**
- Name, country code, flag emoji
- Legal framework type
- Framework strength rating
- Expected response time
- Escalation path (e.g., "Federal Commissioner for Data Protection")
- DPA name and URL
- Legal citations

---

### Complaint Templates (`src/lib/complaint-templates.ts`)

**Function:** `generateComplaint(data: ComplaintData)`

**Generates framework-specific complaint text:**

1. **NetzDG (Germany)** - Network Enforcement Act citations
2. **GDPR (EU)** - Article 17 (right to erasure), Article 21 (objection)
3. **eSafety (Australia)** - eSafety Act 2021
4. **CCPA (California)** - California Consumer Privacy Act
5. **IT Rules (India)** - Information Technology Rules 2021
6. **Marco Civil (Brazil)** - Marco Civil da Internet
7. **PIPEDA (Canada)** - Personal Information Protection Act
8. **Standard** - Generic privacy complaint

**Complaint Types:**
- `privacy` - Privacy violation (unauthorized use of image/video)
- `harassment` - Online harassment/cyberbullying
- `defamation` - Defamatory content
- `doxxing` - Location/personal info exposure
- `threat` - Threatening content

---

### Identification Strength Calculator (`src/lib/identification.ts`)

**Function:** `calculateIdentificationStrength(matches, appearances)`

**Calculates case strength based on:**
- Confirmed transcript mentions (name, nickname, email, phone, address, social media)
- Visual appearances (face clear, face partial, body, photo, video)

**Returns:**
```typescript
{
  strength: "strong" | "moderate" | "weak",
  factors: string[] // e.g., ["full_name_spoken", "face_visible", "email_disclosed"]
}
```

**Strength Thresholds:**
- **Strong**: Multiple identifiers + visual evidence OR name + multiple identifiers
- **Moderate**: Name + some identifiers OR visual only
- **Weak**: Minimal identifiers, no visual

---

## Part 6: AI Classification System

### OpenRouter Integration (`convex/lib/openrouter.ts`)

**Purpose:** AI-powered classification of transcript mentions

**Model Rotation:**
1. Kimi K2 (`moonshotai/kimi-k2-0711`)
2. Qwen3 Coder (`qwen/qwen3-coder-480b-a35b:free`)
3. GLM 4.5 Air (`zhipu-ai/glm-4.5-air:free`)

**Features:**
- Exponential backoff on rate limits (429)
- Retry logic (3 attempts)
- JSON response parsing with fallback
- Model rotation on failure

**Classification Categories:**
- `privacy_violation` - Unauthorized personal info
- `harassment` - Cyberbullying, targeted attacks
- `defamation` - False/damaging statements
- `threat` - Threatening language
- `doxxing` - Location/address exposure
- `relationship_exposure` - Relationship status disclosure
- `mental_health_targeting` - Mental health stigma
- `family_targeting` - Family member mentions
- `sexual_content` - Sexual/explicit content
- `neutral` - Benign mention
- `uncertain` - Needs manual review

**Severity Scale:** 1-5 (1 = low, 5 = critical)

---

### Classification Action (`convex/actions/classifyTranscript.ts`)

**Function:** `classifyMentions(args)`

**Workflow:**
1. Accept complaint ID, target names, transcript segments
2. Filter segments containing target names
3. Build context windows (2 segments before/after each mention)
4. Batch classify (10 at a time with 100ms delays)
5. Parse and validate AI responses
6. Store results in `transcriptMentions` table

**Batching Strategy:**
- 10 mentions per batch
- 100ms delay between batches
- Respects OpenRouter rate limits

---

## Part 7: Component Structure

### Landing Page Components (`src/components/landing/`)

| Component | Purpose |
|-----------|---------|
| `navigation.tsx` | Top nav bar |
| `hero.tsx` | Main hero section |
| `trust-cards.tsx` | Trust/social proof |
| `fit-section.tsx` | Use case fit |
| `why-section.tsx` | Value proposition |
| `how-it-works.tsx` | Process explanation |
| `proxy-mode.tsx` | Proxy filing info |
| `your-rights.tsx` | Legal rights info |
| `my-story.tsx` | Personal narrative |
| `crisis-help.tsx` | Crisis resources |
| `faq.tsx` | FAQs |
| `footer.tsx` | Footer |

---

### Wizard Components (`src/components/wizard/`)

| Component | Purpose |
|-----------|---------|
| `wizard-step.tsx` | Container for each step (title, description, children) |
| `wizard-progress.tsx` | Progress indicator |
| `wizard-nav.tsx` | Navigation buttons (Back/Continue) |
| `wizard-card.tsx` | Card wrapper for forms |
| `crisis-resources.tsx` | Emergency resource display |

---

### Complaint Components (`src/components/complaint/`)

| Component | Purpose |
|-----------|---------|
| `video-url-input.tsx` | YouTube URL input with validation |
| `identifier-inputs.tsx` | Multi-field identifier input |
| `jurisdiction-selector.tsx` | Jurisdiction dropdown |
| `visual-appearance-input.tsx` | Timestamp + appearance type input |
| `identification-strength.tsx` | Case strength display |
| `complaint-preview.tsx` | Editable complaint preview |
| `submission-checklist.tsx` | Filing checklist |
| `transcript-analyzer.tsx` | Transcript fetch + search |

---

### Transcript Components (`src/components/transcript/`)

| Component | Purpose |
|-----------|---------|
| `classification-badge.tsx` | Mention classification badge |
| `mention-card.tsx` | Individual mention card with timestamp, context, controls |

---

### UI Components (`src/components/ui/`)

Shadcn/ui-based:
- `button.tsx`, `card.tsx`, `badge.tsx`
- `accordion.tsx`, `separator.tsx`
- Standard form inputs

---

## Part 8: Auth System

### Clerk Setup

**Provider**: Clerk (`@clerk/nextjs`)

**Environment Variables:**
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Protected Routes

**Middleware**: `src/middleware.ts`

**Protected:**
- `/dashboard/*` (all dashboard routes)

**Unprotected:**
- `/` (landing page)
- `/sign-in`, `/sign-up`

### Auth Sync

**Hook**: `src/hooks/use-auth.ts`

**Purpose:** Syncs Clerk identity to Convex JWT tokens

**Flow:**
1. User signs in via Clerk
2. `use-auth.ts` hook triggers `users.upsertFromClerk` mutation
3. Convex creates/updates user record
4. Subsequent queries use `userId` from Convex

---

## Part 9: Environment & Deployment

### Required Environment Variables

**From `.env.example`:**

```bash
# Convex Database
CONVEX_DEPLOYMENT=your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# OpenRouter (AI Classification)
OPENROUTER_API_KEY=your-key-here

# Stripe (Subscriptions - future)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Current State

**Deployment Status**: 🔴 **Localhost Only**

- No production domain configured
- Convex backend: Likely dev environment
- No Stripe integration active yet

### Missing for Production

1. Domain registration and configuration
2. Deploy to Vercel/Netlify
3. Convex production deployment
4. Clerk production instance
5. OpenRouter API key (production)
6. Stripe integration (if launching paid tiers)
7. SSL/HTTPS
8. Marketing site content finalization

---

## Part 10: Known Issues & TODOs

### TODOs Found

From `IMPLEMENTATION_PLAN.md`:
- ⚠️ **AI Classification** - Partially implemented
  - OpenRouter client exists
  - Classification action exists
  - Schema exists
  - **Missing**: UI integration in transcript page
  - **Missing**: Batch processing progress UI
  - **Missing**: User override controls

### Known Limitations

1. **Transcript Analysis (Step 4)**
   - AI classification implemented but not fully integrated into UI
   - No progress indicator during batch processing
   - No "Classify with AI" button in transcript page
   - Mention cards exist but not wired up to classification data

2. **Subscription Tiers**
   - Schema includes `subscriptionStatus` field
   - Stripe integration planned but not implemented
   - No paywall or premium gating

3. **Proxy Mode**
   - Landing page section exists
   - Schema includes `isProxyFiling` and `proxyRelationship` fields
   - No UI flow for proxy filing

4. **Escalation Paths**
   - Jurisdiction data includes escalation paths
   - No automated escalation workflow
   - Manual process only

5. **Multi-Platform Support**
   - Currently YouTube-only
   - No support for other platforms (Facebook, Instagram, TikTok, etc.)

---

## Part 11: Tests

**Test Directory:** No tests directory found

**Test Coverage:** ❌ None

**Missing:**
- Unit tests for utilities (youtube.ts, jurisdictions.ts, identification.ts)
- Integration tests for complaint workflow
- E2E tests for wizard flow
- Component tests for form inputs
- API tests for Convex functions

---

## Summary: What's Complete

### Core Features (Fully Working)

1. **7-Step Wizard Flow**
   - ✅ Step 1: Video URL input with validation
   - ✅ Step 2: Identifier collection (name, emails, phones, social media)
   - ✅ Step 3: Jurisdiction selection with framework detection
   - ⚠️ Step 4: Transcript analysis (fetch working, AI classification partial)
   - ✅ Step 5: Visual appearance timestamps
   - ✅ Step 6: Framework-specific complaint generation
   - ✅ Step 7: Submission checklist and tracking

2. **Jurisdiction Support**
   - 50+ countries with legal framework data
   - 8 frameworks (NetzDG, GDPR, eSafety, CCPA, IT Rules, Marco Civil, PIPEDA, Standard)
   - Framework-specific complaint templates

3. **YouTube Integration**
   - URL parsing (6+ formats)
   - Transcript fetching
   - Thumbnail display
   - Timestamp linking

4. **Identification System**
   - Multi-identifier collection
   - Transcript mention search
   - Visual appearance logging
   - Case strength calculation

5. **Authentication**
   - Clerk integration
   - Protected routes
   - User sync to Convex

6. **Database**
   - Complete schema (users, complaints, transcriptMentions)
   - CRUD operations for complaints
   - User-scoped queries

7. **Landing Page**
   - Full marketing content
   - Crisis resources
   - FAQ section
   - Navigation

---

## Summary: What's Incomplete

### Partially Built Features

1. **AI Transcript Classification**
   - Backend infrastructure complete (OpenRouter, action, schema)
   - **Missing**: UI integration
   - **Missing**: "Classify with AI" button
   - **Missing**: Progress indicator
   - **Missing**: User override controls in UI

2. **Subscription System**
   - Schema supports tiers (free, trial, pro)
   - Stripe dependency installed
   - **Missing**: Payment integration
   - **Missing**: Tier-based feature gating
   - **Missing**: Subscription management UI

3. **Proxy Mode**
   - Landing page section exists
   - Schema fields exist
   - **Missing**: Proxy filing workflow
   - **Missing**: Relationship verification
   - **Missing**: Legal authorization

4. **Multi-Platform Support**
   - Architecture is YouTube-specific
   - **Missing**: Generic platform abstraction
   - **Missing**: Facebook, Instagram, TikTok, etc.

---

## Summary: What's Broken

**No critical broken features identified.**

**Minor Issues:**
- AI classification not integrated into UI (backend works)
- Some landing page components may need content updates

---

## Summary: What's Missing

### Features Implied by Architecture But Not Implemented

1. **Stripe Integration**
   - Dependency installed
   - Schema supports subscriptions
   - **Missing**: Checkout flow
   - **Missing**: Subscription webhooks
   - **Missing**: Tier enforcement

2. **Escalation Automation**
   - Jurisdiction data includes escalation paths
   - **Missing**: Automated escalation workflow
   - **Missing**: DPA complaint filing
   - **Missing**: Follow-up tracking

3. **Analytics/Tracking**
   - **Missing**: Success rate tracking
   - **Missing**: Response time tracking
   - **Missing**: Platform response logging

4. **Export/Print**
   - **Missing**: PDF export of complaint
   - **Missing**: Print-optimized view
   - **Missing**: Evidence package export

5. **Notifications**
   - **Missing**: Email notifications for status changes
   - **Missing**: Deadline reminders
   - **Missing**: Response tracking

6. **Multi-Language Support**
   - Framework-specific templates in English only
   - **Missing**: Translations
   - **Missing**: Jurisdiction-specific language

7. **Team Collaboration**
   - **Missing**: Shared access for legal representatives
   - **Missing**: Comments/notes
   - **Missing**: Version history

8. **Testing**
   - **Missing**: Comprehensive test suite
   - **Missing**: E2E tests for critical flows

---

## Critical Questions & Ambiguities

1. **Is the OpenRouter API key configured?**
   - Check `.env.local` and Convex dashboard
   - Classification won't work without it

2. **What's the plan for subscription tiers?**
   - Free vs Pro features?
   - Complaint limits?
   - Pricing?

3. **Is there a live domain?**
   - Check if domain registered
   - Deployment target?

4. **How to handle multi-platform?**
   - YouTube-only for MVP?
   - Expand to other platforms later?

5. **Legal review process?**
   - Are complaint templates legally reviewed?
   - Disclaimer needed?
   - Liability considerations?

6. **Privacy/security audit?**
   - User data handling compliant?
   - GDPR compliance for tool itself?
   - Data retention policy?

---

## Recommendations

### High Priority

1. **Complete AI Classification UI Integration**
   - Add "Classify with AI" button to transcript page
   - Show progress indicator during batch processing
   - Wire up mention cards to classification data
   - Add user override controls

2. **Add Test Coverage**
   - Unit tests for utilities
   - E2E tests for wizard flow
   - Integration tests for Convex functions

3. **Production Deployment**
   - Deploy to Vercel/Netlify
   - Configure domain
   - Deploy Convex to production
   - Set up production env vars

4. **Legal Review**
   - Review complaint templates with lawyer
   - Add disclaimers where appropriate
   - Ensure compliance with local laws

5. **Marketing Plan**
   - Finalize landing page content
   - Create launch plan
   - Identify target audience channels

### Medium Priority

6. **Implement Subscription System**
   - Stripe integration
   - Tier-based feature gating
   - Subscription management UI

7. **Add Export Features**
   - PDF export of complaints
   - Evidence package download
   - Print-optimized view

8. **Improve UX**
   - Add loading states
   - Add error handling
   - Add success confirmations
   - Add help tooltips

9. **Analytics Integration**
   - Track complaint success rates
   - Track user flow drop-offs
   - Monitor API usage

### Low Priority

10. **Multi-Platform Support**
    - Abstract platform-specific logic
    - Add Facebook, Instagram, etc.

11. **Proxy Mode Implementation**
    - Workflow for legal representatives
    - Authorization verification

12. **Multi-Language Support**
    - Translate templates
    - Jurisdiction-specific languages

---

**END OF AUDIT**
