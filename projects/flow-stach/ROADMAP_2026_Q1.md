# Flow Bridge - Q1 2026 Prioritized Roadmap

**Last Updated**: 2026-01-27
**Based On**: Maria's vision + current implementation gaps
**Goal**: Launch-ready marketplace by Q2 2026

---

## 🔴 CRITICAL PATH (Weeks 1-2): Fix Core Conversion

**Objective**: Achieve 90%+ success rate for HTML → Webflow conversion

### Week 1: Test Matrix & Pattern Analysis

- [ ] **Day 1-2: Create Test Matrix**
  - List all files in `temp/tests/`
  - Test each file in Webflow (paste & document results)
  - Categorize: ✅ Works | ⚠️ Partial | ❌ Breaks Webflow
  - Document error messages for broken files

- [ ] **Day 3-5: Pattern Analysis (Claude-Driven)**
  - Compare working vs. broken HTML structures
  - Identify CSS patterns that crash Webflow
  - Analyze class naming (BEM violations?)
  - Check GSAP/Three.js library conflicts
  - Document Webflow's CSS "likes and dislikes"

### Week 2: Implement Guardrails

- [ ] **Day 1-3: Build Validation Layer**
  - Create `webflow-preflight-validator.ts`
  - Add strict CSS property allowlist/blocklist
  - Validate class naming before conversion
  - Block known problematic patterns
  - Add user-friendly error messages

- [ ] **Day 4-5: Regression Prevention**
  - Add integration tests for all working files
  - Lock down successful conversions (snapshot tests)
  - Set up CI/CD to catch regressions
  - Document "safe conversion patterns"

**Success Criteria**:
- ✅ 90%+ test files work in Webflow
- ✅ Zero regressions on previously working files
- ✅ Clear documentation of what works vs. doesn't

---

## 🟡 HIGH PRIORITY (Weeks 3-4): Stabilize Imports

### Week 3: CodePen Integration

- [ ] **CodePen Import Stabilization**
  - Apply same guardrails from HTML import
  - Test with 20 popular CodePens (GSAP, Three.js, CSS animations)
  - Document limitations (what works, what doesn't)
  - Create user guidance ("These CodePens work best...")

- [ ] **Import UX Improvements**
  - Add progress indicators for long conversions
  - Show validation errors before paste
  - Add "Test in Webflow" preview button

### Week 4: Business Model Definition

- [ ] **Competitor Research**
  - **Timothée Ricks**: Pricing tiers, offerings, revenue model
  - **Willum**: Subscription vs. purchase, license types
  - **Osmo**: Asset library pricing, free vs. paid

- [ ] **Pricing Strategy Document**
  - Define 3 tier options (Free, Pro, Team)
  - Per-item pricing (if applicable)
  - Annual vs. monthly discounts
  - License model (personal vs. commercial)

- [ ] **Payment Gateway Decision**
  - Choose: Stripe (recommended) or LemonSqueezy
  - Document integration requirements

**Success Criteria**:
- ✅ CodePen → Webflow working reliably
- ✅ Pricing model defined and approved
- ✅ Payment provider chosen

---

## 🟢 MONTH 2: Build Marketplace MVP

### Weeks 5-6: Public Marketplace UI

- [ ] **Browse & Discovery Page** (`/explore`)
  - Grid layout for templates + components
  - Category filtering (Hero, Navbar, Footer, Cards, etc.)
  - Tag-based search
  - Featured items section (curated picks)
  - Sort by: Newest, Popular, Name

- [ ] **Asset Detail Pages** (`/assets/[slug]`)
  - Hero image/video preview
  - Description, tags, category
  - Live iframe preview (for components)
  - Pricing display (Free, $X, or "Pro only")
  - "Copy to Webflow" button (logged-in users)
  - "Download Code" button (paid users)
  - Related items section

- [ ] **My Projects Dashboard** (`/workspace/projects`)
  - List of user's imported HTML/CodePen projects
  - Saved favorites (templates/components)
  - Download history
  - Quick actions (Re-download, Delete, Share)

**Success Criteria**:
- ✅ Functional marketplace UI (no payments yet)
- ✅ Users can browse, preview, save favorites
- ✅ Copy-to-Webflow works for logged-in users

### Weeks 7-8: Payment Integration

- [ ] **Stripe Integration**
  - Set up Stripe account + products
  - Create checkout flow (subscription)
  - Webhook handling (payment success/failure)
  - Update user role in Convex (free → paid)

- [ ] **Paywall Logic**
  - Check user subscription status before copy/download
  - Show upgrade prompt for free users
  - Trial period (7 days free access?)
  - Grace period for failed payments

- [ ] **Download Functionality**
  - Generate ZIP (HTML + CSS + JS + assets)
  - Bundle images, fonts, libraries
  - Include README.md with setup instructions
  - Add license file

**Success Criteria**:
- ✅ Working payment flow (subscription)
- ✅ Paywall prevents free users from accessing paid content
- ✅ Download button generates clean ZIP files

---

## 🔵 MONTH 3: Polish & Prepare for Launch

### Weeks 9-10: Redesign Application

**Dependency**: Receive designs from designers

- [ ] **Review New Designs**
  - Align with designers on implementation timeline
  - Prioritize pages (landing > marketplace > dashboard)

- [ ] **Create Component Library**
  - Build reusable components for new UI
  - Set up Tailwind config for new design system
  - Add Storybook (optional, for component docs)

- [ ] **Migrate Existing Pages**
  - Apply new design to `/explore`
  - Update `/assets/[slug]` detail pages
  - Redesign `/workspace` dashboard
  - Update landing page

**Success Criteria**:
- ✅ New UI applied to all core pages
- ✅ Responsive on mobile, tablet, desktop
- ✅ Brand consistency across site

### Week 11: Extension Integration

- [ ] **Connect Flow-Goodies to Convex**
  - Update Flow-Goodies to use Convex backend
  - Add Clerk auth to extension
  - Sync user's saved items across web + extension

- [ ] **Chrome Extension Updates**
  - Update `flow-bridge-extension` with new branding
  - Add "My Projects" view in extension popup
  - Test auth sync with main app

**Success Criteria**:
- ✅ Extensions use same backend as web app
- ✅ Favorites/projects sync across platforms

### Week 12: Content Curation & Launch Prep

- [ ] **Partner with Designers**
  - Reach out to 3-5 designers for initial templates
  - Create licensing agreements
  - Set revenue share terms (70/30?)

- [ ] **Create Initial Assets** (Target: 30-50 items)
  - 10-15 templates (full page designs)
  - 20-30 components (GSAP animations, UI elements)
  - Quality control review

- [ ] **Launch Checklist**
  - Legal: Terms of Service, Privacy Policy
  - SEO: Sitemap, meta tags, Open Graph
  - Analytics: Plausible/PostHog setup
  - Monitoring: Sentry error tracking
  - Support: Help docs, contact form

**Success Criteria**:
- ✅ 30+ high-quality assets ready
- ✅ Legal docs in place
- ✅ Monitoring & analytics live
- ✅ Ready for public beta

---

## 📅 Timeline Summary

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| **Phase 1: Fix Core** | Weeks 1-2 | Reliable HTML → Webflow conversion |
| **Phase 2: Stabilize** | Weeks 3-4 | CodePen working, pricing defined |
| **Phase 3: Marketplace** | Weeks 5-8 | MVP marketplace + payments |
| **Phase 4: Polish** | Weeks 9-12 | Redesign, extensions, content |
| **Launch** | End of Week 12 | Public beta (Q2 2026) |

**Total**: ~12 weeks (3 months)

---

## 🎯 Success Metrics (at Launch)

### Technical
- **Conversion Rate**: 90%+ HTML → Webflow success
- **Uptime**: 99.9% (Vercel + Convex)
- **Page Load**: < 2 seconds
- **Test Coverage**: 80%+ code coverage

### Business
- **Initial Assets**: 30-50 templates/components
- **Beta Users**: 100 sign-ups in first month
- **Paid Conversions**: 10% free → paid
- **Revenue**: $500+ MRR (Monthly Recurring Revenue)

### User Experience
- **Copy to Webflow**: < 2 clicks
- **Download**: < 3 clicks
- **Time to Value**: < 5 minutes (sign up → first asset)

---

## 🚨 Risk Mitigation

### Risk 1: Webflow Conversion Still Broken After Week 2
**Mitigation**:
- Scope down to "works for simple components only"
- Add disclaimer: "Best for static layouts, GSAP animations"
- Document known limitations prominently

### Risk 2: Designers Not Available for Content
**Mitigation**:
- Use AI to generate initial templates (Cursor, v0)
- Refine in Webflow yourself
- Launch with 20 assets (smaller, but launch)

### Risk 3: Redesign Delayed
**Mitigation**:
- Launch with current UI (it's functional)
- Apply redesign as v2 (post-launch)
- Don't block launch on aesthetics

### Risk 4: Payment Integration Complex
**Mitigation**:
- Use Stripe's pre-built Checkout (simplest)
- Follow Stripe docs strictly
- Ask for help if stuck (Stripe support is excellent)

---

## 💡 Quick Wins (Can Do This Week)

1. **Rename Project**
   - Update all references from "FlowStach" to "Flow Bridge"
   - Update domain (flowbridge.com or flowstach.com?)

2. **Competitor Research**
   - Visit Timothée Ricks, Willum, Osmo sites
   - Screenshot pricing pages
   - Document offerings

3. **Test File Audit**
   - List all files in `temp/tests/`
   - Create spreadsheet: Filename | Webflow Result | Notes

4. **Pricing Draft**
   - Based on competitor research
   - Propose 3 tiers (Free, Pro, Team)
   - Get feedback from potential users

---

## 📝 Next Actions (This Week)

### For Maria:
1. ✅ Approve this roadmap (or request changes)
2. ✅ Share test files for analysis
3. ✅ Do competitor pricing research (Timothée, Willum, Osmo)
4. ✅ Connect with designers (redesign timeline)

### For Claude:
1. ✅ Create test matrix from `temp/tests/` files
2. ✅ Analyze pattern differences (working vs. broken)
3. ✅ Propose validation rules (guardrails)
4. ✅ Start implementing preflight validator

---

## 🎉 Launch Vision (End of Q1 2026)

**Flow Bridge** launches as a curated marketplace where:
- Designers discover high-quality Webflow templates/components
- AI-powered developers import HTML directly to Webflow
- CodePen demos become Webflow-ready with one click
- Users pay $19/month for unlimited access
- Creators earn revenue share from their contributions

**Tagline**: "From AI to Webflow, instantly."

---

**END OF Q1 2026 ROADMAP**
