# Jocril E-commerce - Launch Roadmap

**Last Updated**: 2026-01-27
**Current Status**: 80-90% complete, ready for final sprint
**Goal**: Production launch in 3 weeks

---

## 🎯 Launch Strategy

### Core Objective
**Get client self-sufficient** + **Deploy to production** + **First sales**

### Timeline
- **Week 1**: Simplify admin (client can add products)
- **Week 2**: Design polish + pre-launch prep
- **Week 3**: Deploy + launch

---

## 🔴 WEEK 1: Admin Simplification (CRITICAL)

**Objective**: Client can add products without Maria's help

### Day 1: Admin UX Audit

- [ ] **Morning: Run Local Environment**
  ```bash
  cd C:\Users\maria\Desktop\pessoal\jocril\SITES\loja-jocril
  bun dev
  # Open http://localhost:3000/admin
  ```

- [ ] **Test Product Creation Flow** (2 hours)
  - Go to `/admin/products/new`
  - Fill out ALL fields
  - Try to add a product from scratch
  - Screenshot every step
  - Note every question/confusion

- [ ] **Document Pain Points** (1 hour)
  - Which fields are confusing?
  - What requires technical knowledge?
  - What would make client call for help?
  - Create prioritized list (Critical, Medium, Minor)

- [ ] **Client Simulation** (1 hour)
  - Pretend you're non-technical
  - Try to add 3 different products
  - Note where you get stuck

**Deliverable**: UX audit document with screenshots + issues list

### Day 2: Define Simplified Requirements

- [ ] **Morning: Spec Out Simple Admin** (2 hours)
  - Draft 4-5 step wizard flow
  - List required vs. optional fields
  - Define sensible defaults
  - Sketch UI wireframes (paper or Figma)

- [ ] **Afternoon: Choose Implementation Approach**
  - **Option A**: Simplify existing forms (2-3 days) ← Fastest
  - **Option B**: Build wizard flow (3-5 days) ← Best UX
  - **Option C**: Integrate CMS (Sanity/Payload) (1-2 days) ← Easiest for client

- [ ] **Decision Matrix**
  | Approach | Time | Client UX | Maintenance | Recommendation |
  |----------|------|-----------|-------------|----------------|
  | A: Simplify | 2-3 days | Good | Low | ✅ If tight timeline |
  | B: Wizard | 3-5 days | Excellent | Low | ✅ If want best UX |
  | C: CMS | 1-2 days | Excellent | Medium (monthly cost) | ⚠️ If budget allows |

**Deliverable**: Simplified admin spec + implementation decision

### Day 3-5: Implement Simplification

#### If Choosing Option A: Simplify Existing Forms

- [ ] **Day 3: Hide Advanced Fields** (Full day)
  - Move template-variant UI behind "Advanced" toggle
  - Show only: Name, Category, Price, Stock, Images, Description
  - Add "Show Advanced Options" collapsed section
  - Test with simple product creation

- [ ] **Day 4: Add Help & Validation** (Full day)
  - Add tooltip help text to every field
  - Improve validation error messages
  - Add image preview after upload
  - Pre-fill sensible defaults (stock: 0, category: first option)

- [ ] **Day 5: Polish & Test** (Full day)
  - Style improvements (bigger buttons, clearer labels)
  - Test full flow 10 times
  - Fix any bugs found
  - Create test products

#### If Choosing Option B: Wizard Flow

- [ ] **Day 3: Build Wizard Shell** (Full day)
  - Create `/admin/products/wizard` route
  - Build step navigation (Step 1 of 5, progress bar)
  - Implement Next/Previous buttons
  - Set up state management (React Context or useState)

- [ ] **Day 4: Implement Steps 1-3** (Full day)
  - Step 1: Basic Info (name, category, description)
  - Step 2: Images (drag-drop upload, preview)
  - Step 3: Pricing (price, stock, SKU)
  - Validate each step before allowing "Next"

- [ ] **Day 5: Implement Steps 4-5 + Polish** (Full day)
  - Step 4: Details (full description, materials, dimensions)
  - Step 5: Review & Publish (preview card, save draft option)
  - Style polish
  - Test full flow

**Deliverable**: Simplified admin ready for client use

---

## 🟡 WEEK 2: Design & Prep

**Objective**: Polish storefront + prepare for launch

### Day 1-2: Design Tweaks

**Needs Maria's Input First**: List of specific design changes

- [ ] **Morning Day 1: Get Design Change List from Maria**
  - What needs to change? (screenshots)
  - Where? (public storefront, admin, both?)
  - Priority (critical vs. nice-to-have)

- [ ] **Afternoon Day 1: Implement Critical Changes**
  - Fix layout issues
  - Adjust colors/typography if needed
  - Improve mobile responsiveness
  - Test on real devices

- [ ] **Day 2: Polish Details**
  - Product card styling
  - Category page layout
  - Cart UI improvements
  - Checkout button prominence
  - Footer content (contact, policies)

**Deliverable**: Polished storefront ready for customers

### Day 3: Legal & Content

- [ ] **Morning: Legal Pages** (3-4 hours)
  - [ ] **Terms of Service** - E-commerce terms template
  - [ ] **Privacy Policy** - GDPR compliant (Portugal)
  - [ ] **Refund Policy** - Returns/exchanges terms
  - [ ] **Shipping Policy** - Delivery times, costs, zones
  - [ ] **Cookie Banner** - GDPR cookie consent

- [ ] **Afternoon: Content Pages** (2-3 hours)
  - [ ] **About Page** - Company story, mission
  - [ ] **Contact Page** - Email, phone, address, map
  - [ ] **FAQ Page** - 10-15 common questions

**Deliverable**: All legal/content pages ready

### Day 4: SEO & Analytics

- [ ] **Morning: SEO Setup** (2 hours)
  - [ ] Meta tags (title, description) for all pages
  - [ ] Open Graph images (product sharing)
  - [ ] Sitemap.xml auto-generation
  - [ ] Robots.txt configuration
  - [ ] Google Search Console setup

- [ ] **Afternoon: Analytics & Monitoring** (2 hours)
  - [ ] Google Analytics 4 setup
  - [ ] Conversion tracking (add-to-cart, purchase)
  - [ ] Plausible or PostHog (privacy-friendly alternative)
  - [ ] Sentry error tracking
  - [ ] Vercel Analytics (already included)

**Deliverable**: SEO + analytics fully configured

### Day 5: Client Training

- [ ] **Morning: Record Training Videos** (2 hours)
  - [ ] Video 1: Adding a Product (5 min)
  - [ ] Video 2: Editing Products (3 min)
  - [ ] Video 3: Managing Orders (5 min)
  - [ ] Video 4: Updating Stock (2 min)
  - [ ] Video 5: Common Issues & Fixes (5 min)

- [ ] **Afternoon: Create Written Guide** (2 hours)
  - [ ] PDF guide with screenshots
  - [ ] Quick reference card (1-page cheat sheet)
  - [ ] FAQ for client

- [ ] **Live Training Session** (1-2 hours)
  - Walk client through admin
  - Have client add 3 test products (supervised)
  - Answer questions
  - Note any confusion for improvement

**Deliverable**: Client trained + confident

---

## 🟢 WEEK 3: Deploy & Launch

**Objective**: Go live + first sales

### Day 1: Deploy to Production

- [ ] **Morning: Pre-Deployment Checklist** (1 hour)
  - [ ] All environment variables set in Vercel
  - [ ] Supabase production database ready
  - [ ] Stripe production mode keys
  - [ ] Email (Resend) production configured
  - [ ] Domain DNS records ready

- [ ] **Midday: Deploy to Vercel** (1 hour)
  ```bash
  # Connect to Vercel
  vercel --prod

  # Or push to main branch (auto-deploy)
  git push origin main
  ```

- [ ] **Afternoon: Configure Custom Domain** (2-3 hours)
  - Add domain to Vercel project
  - Update DNS records (wait 24-48 hours for propagation)
  - Test HTTPS certificate (auto-provisioned)
  - Test www redirect (if applicable)

**Deliverable**: Site live on custom domain

### Day 2: Smoke Testing

- [ ] **Morning: Full Site Testing** (2 hours)
  - [ ] Browse all categories
  - [ ] View product details
  - [ ] Add products to cart
  - [ ] Update cart quantities
  - [ ] Remove from cart
  - [ ] Proceed to checkout
  - [ ] Test on mobile + desktop

- [ ] **Afternoon: Payment Testing** (2 hours)
  - [ ] Place test order (Stripe test mode)
  - [ ] Verify order confirmation email
  - [ ] Check order appears in admin
  - [ ] Test order status updates
  - [ ] **Switch to Stripe production mode**
  - [ ] Place REAL test order (small amount)
  - [ ] Refund test order

**Deliverable**: All critical flows working

### Day 3: Initial Product Setup

- [ ] **Client Adds First Products** (Full day)
  - Goal: 10-20 products minimum
  - At least 2-3 categories populated
  - All with images, prices, descriptions
  - Maria supervises first few products

- [ ] **Product Quality Check**
  - [ ] All images high-quality
  - [ ] Descriptions clear and complete
  - [ ] Prices correct (including VAT)
  - [ ] Stock levels accurate

**Deliverable**: Store populated with real products

### Day 4: Launch Day

- [ ] **Morning: Final Checks** (1 hour)
  - [ ] All products visible in storefront
  - [ ] All links working
  - [ ] Mobile experience smooth
  - [ ] Checkout flow working
  - [ ] Email notifications sending

- [ ] **Midday: Go Live** (30 min)
  - [ ] Post on social media (Instagram, Facebook, LinkedIn)
  - [ ] Email announcement to existing customers (if any)
  - [ ] Update Google Business Profile (if applicable)
  - [ ] Add to Portuguese e-commerce directories

- [ ] **Afternoon: Monitor** (Ongoing)
  - Watch Google Analytics for traffic
  - Check Sentry for errors
  - Respond to customer inquiries quickly
  - Fix any urgent issues

**Deliverable**: Public launch announced

### Day 5: Post-Launch Support

- [ ] **Morning: Review First Orders** (if any)
  - How did customers find the site?
  - Which products sold?
  - Any checkout issues?

- [ ] **Afternoon: Quick Fixes**
  - Address any bugs reported
  - Improve based on user feedback
  - Adjust product descriptions if needed

**Deliverable**: Smooth first week

---

## 📋 Pre-Launch Master Checklist

### Technical
- [ ] SSL/HTTPS working (auto from Vercel)
- [ ] Custom domain configured
- [ ] All pages load < 2 seconds
- [ ] Mobile-responsive (test on iPhone, Android)
- [ ] Images optimized (next/image used everywhere)
- [ ] Forms validate correctly
- [ ] Error pages styled (404, 500)

### Legal & Compliance
- [ ] Terms of Service page
- [ ] Privacy Policy (GDPR compliant)
- [ ] Refund Policy
- [ ] Shipping Policy
- [ ] Cookie consent banner
- [ ] VAT calculation correct (Portuguese law)

### E-commerce
- [ ] Payment gateway working (Stripe production)
- [ ] Order confirmation emails sending
- [ ] Shipping confirmation emails ready
- [ ] At least 10-20 products live
- [ ] Product categories set up
- [ ] Cart functionality working
- [ ] Checkout flow tested

### Content
- [ ] About page complete
- [ ] Contact page with email/phone/address
- [ ] FAQ page (10-15 questions)
- [ ] Footer links (policies, contact, social)
- [ ] 404 error page friendly message

### SEO & Analytics
- [ ] Meta tags on all pages
- [ ] Open Graph images for sharing
- [ ] Sitemap.xml generated
- [ ] Google Analytics tracking
- [ ] Google Search Console submitted
- [ ] Favicon and app icons

### Admin
- [ ] Client can add products independently
- [ ] Client trained on admin panel
- [ ] Training videos/docs provided
- [ ] Test products removed

---

## 🎯 Success Metrics (First 30 Days)

### Business Goals
- **Orders**: 10+ orders in first month
- **Revenue**: €X,XXX (based on average order value)
- **Conversion Rate**: 2-5% (visitors → buyers)
- **Average Order Value**: €XXX

### Client Independence
- **Product Additions**: Client adds 5+ products without help
- **Order Processing**: Client fulfills orders smoothly
- **Zero Calls to Maria**: Client self-sufficient

### Technical Health
- **Uptime**: 99.9% (Vercel + Supabase)
- **Page Load**: < 2 seconds avg
- **Zero Critical Bugs**: No checkout failures
- **Mobile Traffic**: 50%+ mobile visitors

---

## 💡 Quick Wins (Can Do Today)

1. **Test Admin Locally** (30 min)
   - Run `bun dev`
   - Go to `/admin/products/new`
   - Try adding a product
   - Screenshot confusing parts

2. **List Design Tweaks** (30 min)
   - Browse storefront
   - Note what looks off
   - Take screenshots
   - Create priority list

3. **Check Database** (15 min)
   - How many products exist?
   - Are they test data or real?
   - What categories are set up?

4. **Review Legal Templates** (30 min)
   - Find Portuguese e-commerce legal templates
   - Start drafting Terms/Privacy/Refund policies

---

## 📝 Next Actions (This Week)

### For Maria:
1. ✅ **Run admin locally** - Test product creation
2. ✅ **Screenshot UX pain points** - What confuses you?
3. ✅ **List design tweaks** - Specific changes needed
4. ✅ **Check database state** - Products? Categories?
5. ✅ **Choose admin approach** - Option A, B, or C?
6. ✅ **Draft legal policies** - Terms, Privacy, Refund

### For Claude:
1. ✅ **Analyze admin forms** - Review product creation code
2. ✅ **Propose simplified flow** - 4-5 step wizard spec
3. ✅ **Identify quick wins** - What can be fixed in 1 day?
4. ✅ **Create training outline** - What client needs to know

---

## 🎉 Launch Vision (February 2026)

**Jocril E-commerce** launches as a professional B2B store where:
- Businesses discover high-quality acrylic displays
- Client manages products confidently (no Maria dependency)
- Orders process smoothly end-to-end
- First sales happen within days
- Business grows sustainably

**Tagline**: "Professional Acrylic Displays, Made in Portugal"

**3-Week Target**:
- ✅ Deploy to production
- ✅ Client self-sufficient
- ✅ 10-20 products live
- ✅ First 5 sales

---

**END OF LAUNCH ROADMAP**
