# DARVO Transcripts - Vision vs. Reality Analysis

**Date**: 2026-01-27
**Purpose**: Simplify and refocus for evidence collection + research
**Outcome**: Streamlined workflow for toxic behavior analysis

---

## 🎯 Vision Summary (From Maria)

### Project Purpose
Research tool to **analyze streamer behavior** and **community toxicity** for:
1. **Evidence collection** (for Take It Down or similar complaints)
2. **Pattern documentation** (DARVO, gaslighting, harassment techniques)
3. **Community analysis** (toxicity levels, comment sentiment)
4. **Public reporting** (interactive website showcasing findings)

### Target Use Cases
- Analyze multiple videos from toxic streamers
- Find clips mentioning specific people/subjects
- Classify behavior (DARVO, gaslighting, positive, negative)
- Extract video clips with full context (30s-2min)
- Generate evidence reports with charts/data
- Publish findings on interactive website

### How It Should Work (Simplified Workflow)

**Step 1: Input**
- Provide YouTube URLs (multiple videos)
- Provide context: Names to watch for, subjects to track
- Example: "Analyze videos for mentions of 'Mike Rinder', 'Claire Headley'"

**Step 2: Transcription** (Automatic)
- Check if video already transcribed (Whisper-quality)
- If not → Transcribe with Whisper (high-quality)
- Store in database (reuse for future analyses)

**Step 3: AI Analysis**
- Scan transcripts for mentions of specified people/subjects
- Extract quotes with timestamps
- Classify each mention:
  - 🔴 DARVO (Deny, Attack, Reverse Victim/Offender)
  - 🟠 Gaslighting
  - 🟢 Positive/supportive
  - ⚫ Negative/critical
  - 🟡 Other harassment techniques

**Step 4: User Review & Flagging**
- Show list of all mentions found
- User checks/flags which ones to include
- User can add notes or context

**Step 5: Video Clip Extraction**
- For flagged mentions → Extract video clips
- Include full context (not just the phrase)
- Duration: 30 seconds to 2 minutes
- Example: If quote is at 15:30, extract 15:15-15:45 (before + during + after)

**Step 6: Report Generation**
- Comprehensive report with:
  - Summary statistics (# mentions, sentiment breakdown)
  - Timeline of incidents
  - Categorized evidence (by person, by technique)
  - Video clips embedded or downloadable
  - Charts/visualizations (toxicity over time, sentiment analysis)

**Step 7: Website Publication**
- Interactive website showcasing findings
- Filters (by person, by date, by technique)
- Searchable transcript database
- Charts and data visualizations
- Public URL for sharing research

---

## ✅ What's Currently Working

### 1. Core Infrastructure
- ✅ **Python + Gradio** - Desktop app running
- ✅ **Whisper Integration** - Automatic transcription
- ✅ **OpenRouter AI** - Pattern analysis (free models)
- ✅ **Local-first** - No cloud dependency (privacy)

### 2. Transcript Analysis (Partial)
- ✅ **Pattern Detection** - 6 patterns supported:
  - DARVO (3 stages)
  - Gaslighting (5 types)
  - Audience Weaponization (6 types)
  - Character Assassination (5 types)
  - Love Bombing (5 types)
  - Custom
- ✅ **Keyword Search** - Filter by names/subjects
- ✅ **Batch Analysis** - Multiple transcripts at once
- ✅ **Structured Output** - Verdict, confidence, evidence, quotes

### 3. Video Clip Extraction (Optional)
- ✅ **YouTube Download** - yt-dlp integration
- ✅ **Whisper Transcription** - Local transcription
- ✅ **Quote Matching** - Fuzzy match quotes to timestamps
- ✅ **FFmpeg Cutting** - Extract video clips
- ✅ **Batch Processing** - Multiple videos at once

---

## ❌ Critical Gaps (Blocking Maria's Workflow)

### 1. Outdated Workflow (LOW PRIORITY FEATURES)
**Problem**: Current app focuses on analyzing **existing transcript files**

**Current Flow** (Gradio UI):
1. Index 5000+ transcript files from folder
2. Search by keyword
3. Select transcript
4. Analyze single transcript
5. (Optional) Extract clips

**Maria's Feedback**:
- ❌ "First part should be removed" (file indexing)
- ❌ Low-quality transcripts (not Whisper-generated)
- ❌ Too many steps to get to analysis

**What to Keep**:
- ✅ High-quality Whisper transcripts (already in database)
- ✅ Reuse existing transcriptions (don't re-transcribe)

### 2. Missing: URL-First Workflow (HIGH PRIORITY)
**Problem**: Can't input YouTube URLs directly as starting point

**What Should Happen**:
```
Input: YouTube URLs + Context (names, subjects)
   ↓
Check: Already transcribed? (reuse if Whisper-quality)
   ↓
Transcribe: If not, transcribe with Whisper
   ↓
Analyze: Find mentions, classify sentiment/technique
   ↓
Flag: User checks which mentions to include
   ↓
Extract: Generate video clips with context
   ↓
Report: Output findings + clips
   ↓
Publish: Generate interactive website
```

**Current Status**: Steps 3-6 exist, but Steps 1-2 and 7 missing/incomplete

### 3. No Flagging/Review UI (HIGH PRIORITY)
**Problem**: User can't interactively review and flag mentions

**What's Missing**:
- ❌ List view of all mentions found
- ❌ Checkboxes to flag which ones to include
- ❌ Ability to add notes/context per mention
- ❌ Sentiment/technique tags visible at a glance
- ❌ Sort/filter mentions (by person, by technique, by confidence)

**Current State**:
- Shows analysis output as markdown text
- No interactive UI for selection
- All-or-nothing (include all or none)

### 4. Video Context Not Optimized (MEDIUM PRIORITY)
**Problem**: Clips may not include enough context

**Maria's Requirement**:
- "Not just the phrase, but full context"
- "Maybe one minute maximum, two minute videos, or less than 30 seconds"
- Example: "Mike Rinder is a liar" → Need 30s-1min before/after to understand context

**Current Implementation** (clip_extract/):
- Has configurable buffer (seconds before/after)
- Default: probably 5-10 seconds
- May not be enough for understanding context

**Solution**: Make buffer configurable (15s, 30s, 60s before/after)

### 5. No Website Generator (HIGH PRIORITY)
**Problem**: Can't publish findings as interactive website

**Maria's Vision**:
- Interactive charts (toxicity over time)
- Searchable database (filter by person, technique, date)
- Embedded video clips
- Data visualizations
- Public URL for sharing research

**Design Reference**: https://jenna-darvo.vercel.app/

**Design Requirements** (from reference):
- **Dark professional theme**: Navy backgrounds, coral accents, cream text
- **Typography hierarchy**:
  - Bebas Neue (headers) - Bold, attention-grabbing
  - JetBrains Mono (quotes/data) - Monospace for authenticity
  - Inter (body text) - Clean, readable
- **Modular layout**: Clear sections, organized categories
- **Evidence categorization**: Separate pages per technique (DARVO, Gaslighting, etc.)
- **Metadata transparency**: "All quotes from transcripts", "X messages analyzed"
- **Footer with stats**: Credibility markers ("6,176+ messages analyzed")
- **Professional credibility**: Technical aesthetic conveys analytical rigor

**Current State**:
- Output is markdown reports only
- No website generation
- No data visualization

**What's Needed**:
- Next.js (matches reference site architecture)
- Tailwind CSS (for dark theme)
- Charts library (Chart.js or Recharts)
- Video player (embedded clips or YouTube embeds)
- Search/filter functionality
- Deploy to Vercel

### 6. Comment/Live Chat Analysis (NOT IMPLEMENTED)
**Problem**: Can't analyze comments or live chat toxicity

**Maria's Requirement**:
- "Analyzes comments on videos"
- "Analyzes comments on live chats"
- "Know toxicity level of community"

**Current State**:
- Only analyzes video transcripts
- No comment scraping
- No chat analysis

**Why This Matters**:
- Community toxicity is evidence of audience weaponization
- Comments show harassment patterns
- Live chat shows real-time toxicity

**Technical Challenge**:
- YouTube API rate limits
- Need to scrape comments (yt-dlp or YouTube API)
- Live chat archives (may not be available for old streams)

---

## 🔴 IMMEDIATE PRIORITIES (Next 2 Weeks)

### Priority 1: Simplify Workflow - Remove File Indexing (1-2 Days)
**Objective**: Remove outdated "Search Existing Files" tab

**Tasks**:
1. **Remove Search Tab** (main.py:80-91)
   - Remove file indexing code
   - Remove "Search & Filter" tab from Gradio UI
   - Keep database of existing Whisper transcripts (don't lose data)

2. **Add URL Input as Step 1** (1 day)
   - New tab: "Analyze Videos"
   - Input: Paste YouTube URLs (one per line)
   - Input: Context (names to watch for)
   - Button: "Start Analysis"

3. **Check Existing Transcripts** (1 day)
   - Before transcribing, check if video already in database
   - If exists + Whisper-quality → Reuse
   - If not → Queue for transcription
   - Show status: "3 videos already transcribed, 2 need transcription"

**Deliverable**: Streamlined workflow (URLs → Analysis)

### Priority 2: Build Flagging/Review UI (2-3 Days)
**Objective**: Interactive mention selection

**Tasks**:
1. **Analysis Results Tab** (2 days)
   - After analysis completes → Show results table
   - Columns: Timestamp | Quote | Person | Technique | Sentiment | Confidence
   - Checkbox per row (flag for clip extraction)
   - Sort by: Person, Technique, Confidence
   - Filter by: Person (dropdown), Technique (dropdown)

2. **Notes Field** (1 day)
   - Add notes per mention (optional)
   - Example: "Said sarcastically" or "Refers to incident from previous video"

3. **Batch Actions** (30 min)
   - "Select All" / "Deselect All" buttons
   - "Flag all DARVO" / "Flag all Gaslighting" buttons

**Deliverable**: Interactive review UI for mentions

### Priority 3: Optimize Video Context (1 Day)
**Objective**: Configurable clip duration

**Tasks**:
1. **Add Buffer Settings** (clip_extract/clip_config.py)
   - User chooses: 15s, 30s, 60s, 90s before/after
   - Default: 30s before, 30s after (1 min total)

2. **Smart Clip Boundaries** (if time allows)
   - Don't cut mid-sentence
   - Use Whisper segment boundaries
   - Ensure clip starts/ends at natural pauses

**Deliverable**: Clips include full context

---

## 🟡 HIGH PRIORITY (Next Month)

### Priority 4: Website Generator (1-2 Weeks)
**Objective**: Publish findings as interactive website

**Phase 1: Static Site Structure** (3-5 days)
- HTML template (single-page app or multi-page)
- Sections:
  - Hero: Project title, summary stats
  - Timeline: Incidents over time (chart)
  - By Person: Mentions grouped by person mentioned
  - By Technique: Mentions grouped by DARVO/gaslighting/etc.
  - Video Clips: Embedded or downloadable
  - Methodology: How analysis was done

**Phase 2: Data Visualization** (2-3 days)
- Chart.js or Recharts integration
- Sentiment over time (line chart)
- Technique breakdown (pie chart)
- Toxicity heatmap (calendar view)
- Top mentioned people (bar chart)

**Phase 3: Interactivity** (2-3 days)
- Search bar (filter mentions by keyword)
- Technique filter (show only DARVO, only gaslighting)
- Person filter (show only mentions of specific person)
- Date range filter (analyze specific time period)

**Phase 4: Video Embedding** (1-2 days)
- Embed video clips (HTML5 video player)
- Or upload to YouTube (unlisted) and embed
- Timestamp links (click timestamp → jump to that moment)

**Phase 5: Deployment** (1 day)
- Generate static HTML/CSS/JS
- Deploy to Vercel, Netlify, or GitHub Pages
- Custom domain (optional)

**Deliverable**: Interactive research website

### Priority 5: Comment & Live Chat Analysis (1-2 Weeks)
**Objective**: Analyze community toxicity

**Phase 1: Comment Scraping** (2-3 days)
- Use yt-dlp to fetch comments
- Store in database (video_id, author, text, timestamp)
- Handle pagination (scrape all comments, not just top 100)

**Phase 2: Sentiment Analysis** (2 days)
- Analyze comment sentiment (positive, negative, neutral)
- Detect toxic language (hate speech, threats, harassment)
- Identify brigading (coordinated harassment)

**Phase 3: Live Chat Analysis** (3-5 days)
- Check if live chat archive exists (not always available)
- Parse live chat JSON (yt-dlp can fetch)
- Sentiment analysis per message
- Toxicity timeline (spikes during specific topics)

**Phase 4: Community Metrics** (2 days)
- Average sentiment score per video
- % toxic comments
- Most toxic videos (by comment sentiment)
- Most toxic commenters (repeat offenders)

**Deliverable**: Community toxicity metrics + analysis

---

## 🟢 MEDIUM PRIORITY (This Quarter)

### Priority 6: Database Migration (1 Week)
**Current**: Local file-based transcripts (5000+ files)
**Problem**: Hard to query, no metadata, slow search

**Solution**: SQLite database
- Tables: videos, transcripts, mentions, analyses
- Indexes for fast search (by person, by date, by technique)
- Migrate existing Whisper transcripts to DB

### Priority 7: Multi-Streamer Comparison (1 Week)
**Use Case**: Compare toxicity across streamers

**Features**:
- Analyze 5-10 streamers at once
- Side-by-side comparison chart
- Rank by toxicity level
- Identify outliers (most toxic, least toxic)

### Priority 8: Automated Reporting (3-5 Days)
**Use Case**: Generate reports automatically on schedule

**Features**:
- Weekly digest: New mentions found
- Monthly summary: Toxicity trends
- Email notifications (new DARVO instances found)

---

## 📅 Timeline Summary

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| **Phase 1: Simplify Workflow** | Weeks 1-2 | URL input, remove file indexing, flagging UI |
| **Phase 2: Clip Optimization** | Week 2 | Configurable context buffers |
| **Phase 3: Website Generator** | Weeks 3-4 | Interactive research website |
| **Phase 4: Comment Analysis** | Weeks 5-6 | Community toxicity metrics |
| **Phase 5: Polish** | Week 7-8 | Database migration, multi-streamer comparison |

**Total**: ~8 weeks (2 months) to fully featured

---

## 🎯 Success Metrics

### Research Quality
- **Clip Context**: 90%+ clips include enough context to understand
- **Classification Accuracy**: AI correctly classifies DARVO/gaslighting 80%+ of time
- **False Positives**: < 20% of flagged mentions are irrelevant

### User Experience
- **Time Saved**: 5+ hours per analysis (vs. manual)
- **Ease of Use**: Non-technical users can run analysis
- **Website Quality**: Professional, shareable research

### Impact
- **Evidence Quality**: Clips usable in complaints/reports
- **Public Awareness**: Website views, shares
- **Pattern Documentation**: Clear trends identified

---

## 💡 Strategic Recommendations

### 1. Start with URL Workflow (Don't Build Everything)
**Focus**: Get URL → Analysis → Clips working first
- Remove file indexing (simplify)
- Add URL input
- Keep existing analysis engine
- Output clips

**Why**: Minimum viable workflow for Maria's use case

### 2. Website Generator is High-Value
**Why**: Shareable, professional research
- More impactful than markdown reports
- Can go viral (if findings are compelling)
- Establishes credibility

**Suggestion**: Use template (don't build from scratch)
- Astro or Next.js static export
- Pre-built chart libraries
- Deploy to Vercel (free)

### 3. Comment Analysis is Optional (For Now)
**Why**: Video analysis is primary use case
- Comments are supplementary evidence
- More complex to implement (scraping, rate limits)
- Can add later

**Recommendation**: Ship URL → Clips first, add comments later

### 4. Keep It Local (Privacy First)
**Why**: Sensitive research (harassment, abuse)
- Local Whisper (no API calls for transcription)
- Local FFmpeg (no cloud video processing)
- Only OpenRouter for analysis (free tier)

**Trade-off**: Slower, but more private

### 5. Gradio is Great for MVP, Consider Web App Later
**Why**: Gradio is fast for prototyping, limited for polish
- Current: Python + Gradio (desktop app)
- Future: Next.js web app (better UI, more features)

**Timeline**: Gradio for next 2-3 months, consider migration later

---

## 🚨 Risks & Mitigation

### Risk 1: YouTube Blocking (yt-dlp)
**Impact**: Can't download videos or transcripts
**Mitigation**:
- Keep yt-dlp updated (YouTube changes detection)
- Use cookies from logged-in account (less blocking)
- Have backup: Manual transcript upload

### Risk 2: OpenRouter Rate Limits (Free Tier)
**Impact**: Can't analyze many videos quickly
**Mitigation**:
- Model rotation (already implemented)
- Batch processing with delays
- Upgrade to paid tier if needed ($10-20/month)

### Risk 3: Whisper Transcription Slow (Large Videos)
**Impact**: 2-hour video takes 30+ min to transcribe
**Mitigation**:
- Use Whisper "base" or "small" model (faster, less accurate)
- Transcribe overnight (queue system)
- Cache transcripts (never re-transcribe)

### Risk 4: Legal Issues (Publishing Findings)
**Impact**: Streamer claims defamation
**Mitigation**:
- Only publish objective facts (quotes, timestamps)
- No editorial opinions
- Include disclaimers (research, not legal accusations)
- Consult lawyer before publishing (if high-profile case)

---

## 📝 Next Steps (This Week)

### For Maria:
1. ✅ **Approve roadmap** (or adjust priorities)
2. ✅ **Test current Gradio app** - Which parts work? Which don't?
3. ✅ **Provide sample URLs** - 3-5 YouTube videos for testing
4. ✅ **List names/subjects** - Who to track? (e.g., "Mike Rinder", "Scientology")
5. ✅ **Check existing transcripts** - How many Whisper-quality? Location?

### For Claude:
1. ✅ **Review main.py** - Identify file indexing code to remove
2. ✅ **Design flagging UI** - Mockup for interactive mention selection
3. ✅ **Research website templates** - Find Astro/Next.js templates for research sites
4. ✅ **Propose clip buffer settings** - UI for 15s/30s/60s context

---

## 🎉 Vision (Q1 2026)

**DARVO Transcripts** becomes a powerful research tool that:
- Analyzes toxic streamer behavior in minutes (not hours)
- Extracts video evidence with full context
- Classifies harassment techniques objectively
- Publishes findings as interactive websites
- Documents patterns for awareness and accountability

**Tagline**: "Evidence-Based Analysis of Online Toxicity"

**Target**: Analyze 10-20 videos, extract 50+ clips, publish first research website

---

**END OF VISION vs. REALITY ANALYSIS**
