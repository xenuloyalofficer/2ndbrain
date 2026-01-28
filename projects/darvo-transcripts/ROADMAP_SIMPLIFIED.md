# DARVO Transcripts - Simplified Roadmap

**Last Updated**: 2026-01-27
**Current Status**: Functional but workflow needs simplification
**Goal**: URL → Analysis → Clips → Website (streamlined)

---

## 🎯 Simplification Strategy

### Remove
- ❌ File indexing UI (5000+ transcript files search)
- ❌ Low-quality transcripts (not Whisper-generated)

### Keep
- ✅ High-quality Whisper transcripts (reuse existing)
- ✅ Pattern analysis engine (DARVO, gaslighting, etc.)
- ✅ Video clip extraction

### Add
- ➕ URL-first workflow (paste YouTube URLs)
- ➕ Interactive flagging UI (checkboxes for mentions)
- ➕ Website generator (publish findings)
- ➕ Comment/chat analysis (future)

---

## 🔴 PHASE 1: Core Workflow (Weeks 1-2)

**Objective**: URL → Analysis → Flagged Clips

### Week 1: Remove Old, Add URL Input

- [ ] **Day 1: Remove File Indexing** (3-4 hours)
  - Comment out or delete "Search & Filter" tab (main.py:80-91)
  - Keep database of existing Whisper transcripts (don't delete data)
  - Test app still runs without search tab

- [ ] **Day 2: Add URL Input Tab** (Full day)
  - New Gradio tab: "Analyze Videos"
  - Input fields:
    - YouTube URLs (text area, one per line)
    - Names to track (comma-separated: "Mike Rinder, Claire Headley")
    - Subjects to track (optional: "Scientology, OSA, Fair Game")
  - Button: "Start Analysis"

- [ ] **Day 3: Check Existing Transcripts** (Full day)
  - Before transcribing → Check if video already in database
  - Query by YouTube video ID
  - If exists + Whisper-quality → Reuse
  - If not → Add to transcription queue
  - Show status:
    ```
    Video 1 (kyyTNv8f): Already transcribed ✅
    Video 2 (abc123xy): Needs transcription ⏳
    Video 3 (def456uv): Already transcribed ✅
    ```

- [ ] **Day 4: Transcription Queue** (Full day)
  - For videos needing transcription:
    - Download with yt-dlp
    - Transcribe with Whisper
    - Save to database (mark as Whisper-quality)
    - Show progress bar per video

- [ ] **Day 5: Buffer & Testing** (Full day)
  - Test with 3-5 sample videos
  - Fix any bugs
  - Verify existing transcripts reused correctly

**Deliverable**: URL input working, transcription automated

### Week 2: Interactive Flagging UI

- [ ] **Day 1-2: Build Results Table** (2 days)
  - After analysis → Show results in Gradio Dataframe
  - Columns:
    - Checkbox (flag for clip extraction)
    - Timestamp (MM:SS)
    - Quote (first 100 chars)
    - Person Mentioned
    - Technique (DARVO, Gaslighting, etc.)
    - Sentiment (Positive, Negative, Neutral)
    - Confidence (HIGH, MEDIUM, LOW)
  - Make checkbox column interactive (Gradio checkbox)

- [ ] **Day 3: Add Filters** (Full day)
  - Dropdown: Filter by Person
  - Dropdown: Filter by Technique
  - Dropdown: Filter by Confidence
  - Sort by: Timestamp, Confidence

- [ ] **Day 4: Batch Actions** (Half day)
  - Button: "Select All"
  - Button: "Deselect All"
  - Button: "Flag all DARVO"
  - Button: "Flag all Gaslighting"

- [ ] **Day 4-5: Clip Context Settings** (1.5 days)
  - Add slider: "Clip context (seconds before/after)"
  - Options: 15s, 30s, 60s, 90s
  - Default: 30s
  - Show estimated clip duration per mention

**Deliverable**: Interactive mention review + flagging

---

## 🟡 PHASE 2: Clip Optimization & Output (Weeks 3-4)

### Week 3: Improve Clip Extraction

- [ ] **Day 1: Optimize Buffer Logic** (Full day)
  - Use user-selected buffer (from slider)
  - Smart boundaries (don't cut mid-sentence)
  - Use Whisper segment timestamps for natural pauses

- [ ] **Day 2: Batch Clip Generation** (Full day)
  - Generate all flagged clips at once
  - Show progress bar (Clip 1 of 15...)
  - Handle errors gracefully (skip failed clips)

- [ ] **Day 3: Clip Organization** (Full day)
  - Output structure:
    ```
    clips/
    ├── by_person/
    │   ├── mike_rinder/
    │   │   ├── video1_00-15-30_DARVO.mp4
    │   │   └── video2_01-23-45_Gaslighting.mp4
    │   └── claire_headley/
    ├── by_technique/
    │   ├── DARVO/
    │   ├── Gaslighting/
    │   └── Character_Assassination/
    └── all_clips/
    ```
  - Filename format: `{video_id}_{timestamp}_{technique}.mp4`

- [ ] **Day 4-5: Report Generation** (2 days)
  - Markdown report with:
    - Summary statistics
    - Timeline of mentions
    - Categorized evidence (by person, by technique)
    - Embedded timestamps (YouTube links with ?t=XXs)
  - CSV export (for data analysis)

**Deliverable**: High-quality clips with context

### Week 4: Testing & Polish

- [ ] **Day 1-2: End-to-End Testing** (2 days)
  - Test with 10 real videos (Maria's harassment case)
  - Verify clips include full context
  - Check classification accuracy
  - Fix bugs

- [ ] **Day 3: Documentation** (Full day)
  - Write user guide (how to use simplified workflow)
  - Create video tutorial (screen recording)
  - Document configuration options

- [ ] **Day 4-5: UX Polish** (2 days)
  - Improve error messages
  - Add loading states (spinners, progress bars)
  - Better visual design (Gradio themes)

**Deliverable**: Polished, user-friendly tool

---

## 🟢 PHASE 3: Website Generator (Weeks 5-6)

**Objective**: Publish findings as interactive website

### Week 5: Static Site Foundation

- [ ] **Day 1: Choose Framework** (Half day)
  - **Option A**: Astro (recommended for static sites)
  - **Option B**: Next.js static export
  - **Option C**: Plain HTML + Tailwind CSS

- [ ] **Day 1-2: Site Structure** (1.5 days)
  - Homepage:
    - Project title
    - Summary stats (# videos, # mentions, # clips)
    - Key findings (most toxic videos, top techniques)
  - Timeline page:
    - Chronological list of mentions
    - Filter by date range
  - By Person page:
    - Mentions grouped by person
    - Sentiment chart per person
  - By Technique page:
    - Mentions grouped by technique
    - Frequency chart
  - Clips page:
    - Embedded video clips
    - Or download links

- [ ] **Day 3: Data Visualization** (Full day)
  - Install Chart.js or Recharts
  - Charts:
    - Sentiment over time (line chart)
    - Technique breakdown (pie chart)
    - Top mentioned people (bar chart)
    - Toxicity heatmap (calendar view)

- [ ] **Day 4-5: Video Embedding** (2 days)
  - Embed clips (HTML5 video player)
  - Or upload to YouTube (unlisted) and embed
  - Timestamp links (click → jump to moment)

**Deliverable**: Static website with charts + clips

### Week 6: Interactivity & Deployment

- [ ] **Day 1-2: Search & Filters** (2 days)
  - Search bar (filter mentions by keyword)
  - Technique filter (checkboxes: DARVO, Gaslighting)
  - Person filter (dropdown: select person)
  - Date range picker

- [ ] **Day 3: Generate from Analysis** (Full day)
  - Export analysis results to JSON
  - Feed JSON to static site generator
  - Generate HTML/CSS/JS
  - Test locally

- [ ] **Day 4: Deployment** (Full day)
  - Deploy to Vercel, Netlify, or GitHub Pages
  - Custom domain (optional: darvo-research.com?)
  - SSL certificate (auto from hosting)

- [ ] **Day 5: Polish & Test** (Full day)
  - Mobile responsiveness
  - Page load optimization
  - SEO (meta tags, sitemap)
  - Share on social media (test Open Graph)

**Deliverable**: Public research website

---

## 🔵 PHASE 4: Comment Analysis (Future)

**Not Immediate Priority** - Add after core workflow complete

### Tasks (Estimated 1-2 Weeks)
- [ ] Comment scraping (yt-dlp or YouTube API)
- [ ] Sentiment analysis per comment
- [ ] Toxicity detection (hate speech, threats)
- [ ] Community metrics (avg sentiment, % toxic)
- [ ] Brigading detection (coordinated harassment)

**Deliverable**: Community toxicity analysis

---

## 📅 Timeline Summary

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| **Phase 1: Core Workflow** | Weeks 1-2 | URL → Analysis → Flagging |
| **Phase 2: Clip Optimization** | Weeks 3-4 | High-quality clips + reports |
| **Phase 3: Website Generator** | Weeks 5-6 | Interactive research website |
| **Phase 4: Comment Analysis** | Future (1-2 weeks) | Community toxicity metrics |

**Total**: 6-8 weeks to full-featured

---

## 🎯 Quick Wins (Can Do This Week)

1. **Remove File Indexing UI** (2 hours)
   - Comment out Search tab in main.py
   - Test app runs without it

2. **Add URL Input Field** (2 hours)
   - New Gradio tab with text area
   - Button: "Analyze URLs"

3. **Test with 3 Videos** (1 hour)
   - Use existing analysis engine
   - Verify output quality

4. **Design Flagging UI** (1 hour)
   - Sketch Gradio Dataframe layout
   - List required columns

---

## 📝 Next Steps (This Week)

### For Maria:
1. ✅ **Test current Gradio app** - Run `python main.py`, screenshot UI
2. ✅ **Provide sample URLs** - 3-5 YouTube videos for testing
3. ✅ **List names/subjects** - Who to track? (e.g., "Mike Rinder")
4. ✅ **Check existing transcripts** - How many? Where stored?
5. ✅ **Choose clip buffer** - Prefer 15s, 30s, or 60s context?

### For Claude:
1. ✅ **Review main.py** - Locate file indexing code
2. ✅ **Design URL input UI** - Gradio code for new tab
3. ✅ **Design flagging table** - Gradio Dataframe with checkboxes
4. ✅ **Research website templates** - Astro templates for research sites

---

## 💡 Recommendations

### 1. Start Minimal (URL → Clips)
**Don't build everything at once**
- Remove file indexing first (simplify)
- Add URL input
- Keep existing analysis
- Output clips

**Why**: Get core workflow working fast

### 2. Flagging UI is Critical
**Users need control over what clips to generate**
- Interactive checkboxes
- Filter by technique/person
- Don't generate 100+ clips automatically

**Why**: Saves time, focuses on relevant evidence

### 3. Website Generator is High-Value
**Shareable research has more impact**
- Professional presentation
- Charts make patterns obvious
- Can go viral if findings compelling

**Recommendation**: Invest 2 weeks in website (worth it)

### 4. Comment Analysis is Optional (For Now)
**Video analysis is primary**
- Comments are supplementary
- More complex to implement
- Can add later

**Recommendation**: Ship video analysis first, add comments v2

### 5. Keep Local (Privacy)
**Sensitive research (harassment)**
- Local Whisper (no API for transcription)
- Local FFmpeg (no cloud processing)
- Only OpenRouter for analysis (free tier)

**Why**: Privacy, no data leaks

---

## 🚨 Risks & Mitigation

### Risk 1: YouTube Blocks yt-dlp
**Mitigation**:
- Keep yt-dlp updated
- Use cookies from logged-in account
- Fallback: Manual transcript upload

### Risk 2: Whisper Slow (Long Videos)
**Mitigation**:
- Use Whisper "base" model (faster)
- Transcribe overnight
- Cache transcripts (never re-transcribe)

### Risk 3: OpenRouter Rate Limits
**Mitigation**:
- Model rotation (already implemented)
- Batch with delays
- Upgrade to paid tier ($10-20/month)

### Risk 4: Legal Issues (Publishing)
**Mitigation**:
- Only publish facts (quotes, timestamps)
- No editorial opinions
- Add disclaimers (research, not accusations)
- Consult lawyer if high-profile

---

## 🎉 Vision (Q2 2026)

**DARVO Transcripts** becomes:
- **Evidence Collection Tool**: Extract clips in minutes (not hours)
- **Research Platform**: Publish objective findings
- **Pattern Documentation**: Chart harassment techniques over time
- **Awareness Campaign**: Share findings publicly

**Tagline**: "Evidence-Based Analysis of Online Toxicity"

**First Milestone**: Analyze 10 videos, extract 50 clips, publish research website

---

**END OF SIMPLIFIED ROADMAP**
