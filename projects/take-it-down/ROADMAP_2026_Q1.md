# Take It Down - Q1 2026 Prioritized Roadmap

**Last Updated**: 2026-01-27
**Based On**: Maria's personal experience + current implementation gaps
**Goal**: Public beta launch by end of Q1 2026

---

## 🔴 CRITICAL PATH (Weeks 1-2): Verify & Protect

**Objective**: Ensure output works + add legal protection

### Week 1: YouTube Format Compliance

- [ ] **Day 1: Document YouTube Requirements**
  - Screenshot privacy complaint form from YouTube
  - Screenshot defamation complaint form
  - Document character limits for each field
  - Document timestamp format (MM:SS vs HH:MM:SS?)
  - Note required vs. optional fields

- [ ] **Day 2-3: Test Current Output**
  - Generate report using existing wizard
  - Copy-paste to YouTube forms
  - Document what works vs. breaks
  - Identify format mismatches

- [ ] **Day 4-5: Update Templates**
  - Modify complaint templates to match YouTube exactly
  - Add character limit validation
  - Add timestamp format validation
  - Test with real case (Maria's harassment)

**Success Criteria**:
- ✅ Reports copy-paste perfectly to YouTube with zero editing
- ✅ Character limits enforced (user warned before exceeding)
- ✅ Timestamps in correct format

### Week 2: Legal Protection & Transparency

- [ ] **Day 1-2: Create Disclaimer System**
  - Draft disclaimer text: "I am not a lawyer or therapist..."
  - Create `DisclaimerBanner` component
  - Add to landing page (prominent, before sign-up)
  - Add to wizard footer (every step)
  - Add to generated reports (footer)
  - Update Terms of Service

- [ ] **Day 3-5: About Page**
  - Write Maria's story (decide: anonymous or real name?)
  - Explain why tool exists (personal experience)
  - Explain why not free (API costs breakdown)
  - List what tool does vs. doesn't do
  - Add resources section (lawyers, therapists, support groups)
  - Include photo or illustration (humanize the story)

**Success Criteria**:
- ✅ Disclaimers on every page
- ✅ About page builds trust + sets expectations
- ✅ Legal protection in place

---

## 🟡 HIGH PRIORITY (Weeks 3-4): Monetization

### Week 3: Define Pricing Model

- [ ] **Calculate Costs** (2 days)
  - Run 10 test complaints through wizard
  - Check OpenRouter API usage (tokens used)
  - Calculate average cost per complaint
  - Add hosting costs (Vercel, Convex)
  - Determine break-even point

- [ ] **Research Comparable Services** (1 day)
  - LegalZoom document generation pricing
  - Rocket Lawyer pricing
  - AI writing tools (Copy.ai, Jasper)
  - Note: Most charge $20-50 for documents

- [ ] **Propose Pricing Tiers** (1 day)
  - **Free**: Preview wizard only (no AI analysis)
  - **Single Complaint**: $10 (one-time payment)
  - **3-Pack**: $25 (save $5, for multi-video cases)
  - Optional: **Monthly**: $30/month unlimited (if enough demand)

- [ ] **Get Feedback** (2 days)
  - Share pricing with ex-Scientology communities (ESMB, Reddit)
  - Ask: "Would you pay $10 for this?"
  - Adjust based on feedback

**Success Criteria**:
- ✅ Pricing model defined and approved
- ✅ User feedback validates pricing is fair

### Week 4: Stripe Integration

- [ ] **Set Up Stripe** (2 days)
  - Create Stripe account
  - Create products (single complaint, 3-pack)
  - Set up webhooks (payment.succeeded, payment.failed)
  - Test with Stripe test mode

- [ ] **Build Payment Flow** (3 days)
  - Checkout page (Stripe Checkout)
  - Payment success page (redirect after payment)
  - Payment failure page (retry prompt)
  - Update user credits in Convex (track complaint count)

- [ ] **Paywall Logic** (2 days)
  - Free tier: Can use wizard up to "Evidence" step
  - Paid gate: Block AI analysis unless user has credits
  - Show upgrade prompt: "Buy 1 complaint for $10"
  - Deduct 1 credit after successful generation

**Success Criteria**:
- ✅ Stripe payment working end-to-end
- ✅ Users can purchase complaint credits
- ✅ Paywall enforces payment before AI analysis

---

## 🟢 MEDIUM PRIORITY (Weeks 5-6): User Experience

### Week 5: Image Timestamp Manual Entry

- [ ] **Add Image Evidence Step** (3 days)
  - New wizard step: "Images" (after "Evidence")
  - UI: "Did the video show images of you?"
  - Form: [Timestamp (MM:SS)] [Description of image]
  - Allow multiple entries (add/remove buttons)
  - Store in `complaints.evidence.imageTimestamps[]`

- [ ] **Update Report Generation** (2 days)
  - Merge text mentions + image timestamps in output
  - Format: "At 3:45, image shown: [description]"
  - Sort chronologically (all evidence together)

- [ ] **Add Guidance** (1 day)
  - Tooltip: "Can't detect images automatically"
  - Suggestion: "Ask a trusted friend to watch and note timestamps"
  - Link to support resources (if too difficult to watch)

**Success Criteria**:
- ✅ Users can add image evidence manually
- ✅ Reports include both text + image evidence
- ✅ Clear guidance reduces user burden

### Week 6: Landing Page & Marketing Prep

- [ ] **Landing Page Design** (3 days)
  - **Hero**: "Take Back Control of Your Online Reputation"
  - **How It Works**: 3 steps (upload → AI finds → copy-paste)
  - **Why This Exists**: Maria's story (brief)
  - **Pricing**: Transparent (API costs explanation)
  - **FAQ**: Common questions + disclaimers
  - **CTA**: "Start Your Complaint" button

- [ ] **SEO & Analytics** (1 day)
  - Add meta tags (title, description, Open Graph)
  - Set up Plausible or PostHog (privacy-friendly analytics)
  - Create sitemap
  - Submit to Google Search Console

- [ ] **Support Resources Page** (1 day)
  - List lawyers specializing in online harassment
  - List therapists/counselors (PTSD, trauma)
  - List support organizations (Cyber Smile Foundation, EFF)
  - Hotlines (suicide prevention, crisis support)

**Success Criteria**:
- ✅ Professional landing page live
- ✅ Analytics tracking user behavior
- ✅ Support resources readily available

---

## 🔵 GROWTH PHASE (Weeks 7-8): Marketing & Launch

### Week 7: Content Marketing

- [ ] **Write Blog Posts** (3-5 days)
  - "How I Fought Back Against a YouTuber's Harassment" (Maria's story)
  - "Step-by-Step: Filing a YouTube Privacy Complaint"
  - "What to Do If You're Being Harassed on YouTube"
  - SEO optimize for keywords (YouTube harassment, defamation, privacy complaint)

- [ ] **Create Video Tutorial** (2-3 days)
  - Screen recording of wizard walkthrough
  - Voiceover explaining each step
  - Upload to YouTube (ironic, but effective for SEO)
  - Embed on landing page

**Success Criteria**:
- ✅ 3 blog posts published
- ✅ Video tutorial live on YouTube
- ✅ Organic traffic starting to arrive

### Week 8: Community Outreach & Beta Launch

- [ ] **Partner Outreach** (2 days)
  - Email anti-harassment organizations (Cyber Smile, EFF)
  - Email ex-Scientology support groups (ESMB, Tony Ortega's blog)
  - Offer free credits to their members (partnership)

- [ ] **Reddit/Forum Launch** (1 day)
  - Post to r/youtube (with mod permission)
  - Post to r/legaladvice (offer as resource, not promotion)
  - Post to ex-Scientology subreddit (share story)

- [ ] **Social Media** (1 day)
  - Twitter/X announcement
  - LinkedIn post (Maria's personal account)
  - TikTok short video (if comfortable on camera)

- [ ] **Invite-Only Beta** (ongoing)
  - Invite 20-50 beta users from communities
  - Collect feedback (UX, pricing, report quality)
  - Iterate based on feedback

**Success Criteria**:
- ✅ 50+ beta sign-ups in first week
- ✅ 10+ complaints generated successfully
- ✅ Positive feedback from users

---

## 📅 Timeline Summary

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| **Phase 1: Verify & Protect** | Weeks 1-2 | YouTube-compliant output + disclaimers |
| **Phase 2: Monetization** | Weeks 3-4 | Stripe payment + paywall |
| **Phase 3: User Experience** | Weeks 5-6 | Image timestamps + landing page |
| **Phase 4: Growth** | Weeks 7-8 | Marketing + beta launch |
| **Public Launch** | End of Week 8 | Open to public (Q1 2026) |

**Total**: ~8 weeks (2 months)

---

## 🎯 Success Metrics (First 3 Months)

### Impact Metrics
- **Complaints Generated**: 100+ complaints
- **Successful Takedowns**: Track user-reported success rate (aim for 30%+)
- **User Testimonials**: "This saved me hours of pain"

### Business Metrics
- **Break-Even**: Cover API costs within 3 months
- **Paid Users**: 50+ paying users
- **Revenue**: $500+ (50 users × $10 avg)

### User Experience
- **Time Saved**: 2-3 hours per complaint (vs. manual)
- **Emotional Relief**: "I didn't have to re-watch the videos"
- **Ease of Use**: 90% completion rate (start → finish)

---

## 🚨 Risk Mitigation

### Risk 1: YouTube Changes Complaint Format
**Mitigation**:
- Monitor YouTube's Creator Support forums
- Set up Google Alert for "YouTube complaint policy"
- Update templates within 48 hours of any changes

### Risk 2: Legal Liability (User Blames Tool)
**Mitigation**:
- Strong disclaimers on every page
- Terms of Service with indemnification clause
- No guarantees (tool helps, doesn't promise results)

### Risk 3: AI Hallucinations (Fake Quotes)
**Mitigation**:
- Always show AI output to user for review
- Add warning: "Verify all quotes are accurate before submitting"
- Never auto-submit (user always has final control)

### Risk 4: Low User Adoption
**Mitigation**:
- Strong marketing (personal story resonates)
- Partner with advocacy organizations
- Offer free credits to influencers (testimonials)

---

## 💡 Quick Wins (Can Do This Week)

1. **Get YouTube Forms**
   - Go to YouTube → Privacy complaint
   - Screenshot every field
   - Document format

2. **Draft Disclaimers**
   - Write "I'm not a lawyer/therapist" text
   - Get feedback from legal-savvy friend (optional)

3. **Calculate Costs**
   - Run 3 test complaints
   - Check OpenRouter dashboard for usage
   - Calculate average cost

4. **Write About Page**
   - Draft Maria's story (300-500 words)
   - Decide: anonymous or real name?

---

## 📝 Next Actions (This Week)

### For Maria:
1. ✅ **Approve roadmap** (or adjust priorities)
2. ✅ **Get YouTube complaint forms** (screenshot both)
3. ✅ **Calculate API costs** (run test complaints)
4. ✅ **Decide on anonymity** (About page - real name or pseudonym?)
5. ✅ **Draft disclaimers** (text for "not a lawyer/therapist")

### For Claude:
1. ✅ **Review current templates** (check YouTube format compliance)
2. ✅ **Create disclaimer component** (React banner)
3. ✅ **Draft About page** (based on Maria's story)
4. ✅ **Identify template gaps** (what's missing from output)

---

## 🎉 Launch Vision (Q1 2026)

**Take It Down** launches as a compassionate tool that:
- Helps victims file YouTube complaints in 30 minutes (vs. 3 hours)
- Uses AI to find evidence automatically (less re-watching trauma)
- Provides clear guidance without false promises
- Operates sustainably with fair pricing ($10 per complaint)
- Connects victims to professional support resources

**Tagline**: "You don't have to fight alone."

**Target**: 100 complaints in first 3 months, 30%+ success rate

---

**END OF Q1 2026 ROADMAP**
