# Scientology Archive - Vision vs. Reality Analysis

**Date**: 2026-01-27
**Purpose**: Document processing + microsite generation for leaked Scientology documents
**Status**: PENDING - Awaiting folder access for full audit

---

## 🎯 Vision Summary (From Maria)

### Project Purpose
Help **ex-Scientologists** gather and publish **evidence of manipulation and mind control** by the Church of Scientology. Make important documents **public** through a centralized archive website.

**Legal Status**: All documents obtained legally

---

## 📄 Document Requirements

### Critical Requirement: Formatting Fidelity
**Scientology documents have specific formatting that MUST be preserved**

**Example Structure**:
```
[Left aligned address]                    [Right aligned address]

                                          [Date]

[Paragraph 1 - starts with specific entity]
[Paragraph 2 - starts with specific entity]
...

                                          [Signature block - specific format]
```

**Why Formatting Matters**:
- Authenticity verification (proves documents are real)
- Legal evidence (formatting proves provenance)
- Historical accuracy (preserves original meaning)
- Credibility (shows documents weren't altered)

**Technical Challenge**: OCR must:
- ✅ Detect multi-column layouts (left/right addresses)
- ✅ Preserve paragraph indentation and spacing
- ✅ Recognize entity names at paragraph starts
- ✅ Maintain signature block formatting
- ✅ Keep date positioning accurate

---

## 🌐 Existing Website

**Live Site**: https://scnfiles.com/

**Architecture**:
- Main site with navigation
- Each document/section = **microsite** within main site
- All microsites share same structure + styles

**Content So Far**:
- Some documents already published
- More documents need to be processed and added

---

## 🎯 What Needs to Be Done

### 1. Document Processing Pipeline
**Input**: Raw documents (scanned PDFs, images, or physical documents)
**Output**: Formatted microsites with faithful OCR

**Steps Required**:
1. **OCR with Format Preservation**
   - Use OCR engine that preserves layout (Tesseract with layout analysis? Adobe PDF Extract?)
   - Detect multi-column layouts
   - Preserve indentation, spacing, alignment
   - Extract text while maintaining structure

2. **Formatting Validation**
   - Verify addresses in correct positions (left/right)
   - Check date alignment
   - Confirm paragraph entity markers
   - Validate signature block format

3. **Microsite Generation**
   - Convert formatted OCR to HTML
   - Apply consistent styles (all microsites look the same)
   - Add metadata (date, document type, source)
   - Generate navigation (link to/from main site)

### 2. Collaboration System
**Problem**: Need multiple people to help process documents

**Requirements**:
- **Distribute tasks** to collaborators
- **Standardized workflow** (everyone follows same process)
- **Quality control** (verify formatting accuracy)
- **Template system** (reusable microsite structure)

**Potential Solution**:
- AI-assisted processing (reduce manual work)
- Shared document queue (assign tasks to collaborators)
- Automated microsite generation (from formatted OCR)
- Review/approval workflow (before publishing)

### 3. AI-Assisted Automation
**Use AI For**:
- OCR post-processing (clean up errors while preserving format)
- Layout analysis (detect columns, alignment)
- Microsite generation (auto-create HTML from template)
- Quality checks (flag formatting inconsistencies)

**AI Should NOT**:
- Alter document content (must be faithful to original)
- Guess missing text (mark as [illegible] instead)
- Simplify formatting (preserve complexity)

---

## 📋 Technical Stack (Current - To Be Verified)

**Website**:
- Framework: Unknown (to check when folder accessed)
- Hosting: Unknown (scnfiles.com domain registered)
- CMS: Unknown (static site generator? custom?)

**Document Processing**:
- OCR Engine: Unknown (to check)
- Format Preservation: Unknown (to check)
- Automation Level: Unknown (manual vs. automated?)

---

## 🔴 Critical Questions (To Answer After Folder Access)

### About Current Implementation
1. **What tech stack is scnfiles.com built on?**
   - Static site generator (Hugo, Jekyll, Gatsby, Next.js)?
   - CMS (WordPress, Sanity, custom)?
   - Plain HTML/CSS?

2. **How are documents currently processed?**
   - Manual OCR + HTML editing?
   - Automated pipeline?
   - What OCR tools are used?

3. **How are microsites generated?**
   - Manual HTML per document?
   - Template system (reusable)?
   - Automated from structured data?

4. **What's the file structure?**
   - Document originals (PDFs, images)?
   - Processed text files?
   - HTML microsites?

### About What Needs Improvement
5. **What's broken in current OCR?**
   - Formatting lost?
   - Addresses misaligned?
   - Signatures not preserved?

6. **What's the bottleneck for collaborators?**
   - Too manual (hard to distribute)?
   - No clear workflow?
   - Quality control difficult?

7. **How many documents need processing?**
   - Backlog size?
   - Priority order?

---

## 💡 Proposed Solutions (Preliminary)

### Solution 1: OCR with Layout Preservation

**Option A: Adobe PDF Extract API**
- Pros: Excellent layout preservation, handles multi-column
- Cons: Cost ($0.05-0.10 per page), API dependency

**Option B: Tesseract + Layout Analysis**
- Pros: Free, open-source, scriptable
- Cons: Requires manual layout tuning, less accurate

**Option C: Google Document AI**
- Pros: Good layout detection, handles complex documents
- Cons: Cost, requires Google Cloud account

**Recommendation**: Test all three with sample Scientology documents, choose best for format fidelity

### Solution 2: Microsite Template System

**Architecture**:
```
templates/
  scientology-document/
    layout.html          # Standard structure
    styles.css           # Consistent styling
    metadata.json        # Document info

documents/
  001-policy-letter/
    ocr.json            # OCR output with formatting
    microsite/          # Generated HTML
  002-memo/
    ocr.json
    microsite/
```

**Generation Process**:
1. OCR produces structured JSON (text + formatting)
2. Script reads JSON + template
3. Generates microsite HTML
4. Deploys to scnfiles.com

**Benefits**:
- Consistent styling across all documents
- Easy to update all microsites (change template)
- Fast generation (seconds per document)

### Solution 3: Collaboration Workflow

**Proposed Workflow**:
1. **Document Intake**
   - Upload to shared folder (Google Drive, Dropbox)
   - Assign to collaborator

2. **Processing**
   - Collaborator runs OCR tool (standardized)
   - Reviews formatting accuracy
   - Flags issues (illegible text, formatting lost)

3. **Quality Control**
   - Reviewer checks formatting fidelity
   - Compares to original document
   - Approves or requests fixes

4. **Microsite Generation**
   - Automated script generates HTML
   - Deploys to scnfiles.com
   - Updates navigation/index

5. **Publishing**
   - Final review
   - Announce new document (social media, mailing list)

**Tools**:
- Project management (Trello, Notion, Airtable)
- Document queue (assign tasks)
- Status tracking (OCR done, reviewed, published)

---

## 🎯 Success Metrics (To Define After Audit)

### Document Quality
- **Formatting accuracy**: 95%+ fidelity to original
- **OCR accuracy**: 98%+ text recognition
- **Processing speed**: X documents per week

### Collaboration
- **Onboarding time**: Collaborators productive in < 1 hour
- **Processing time**: X hours per document average
- **Quality control**: < 10% rejection rate

### Public Impact
- **Documents published**: X total (Y per month)
- **Website traffic**: Unique visitors, page views
- **Media coverage**: Articles citing scnfiles.com

---

## 📝 Next Steps (After Folder Access)

### For Maria:
1. ✅ **Provide folder access** - Share folder location with Claude
2. ✅ **Sample documents** - 3-5 examples showing formatting challenges
3. ✅ **Current tech stack** - What tools are currently used?
4. ✅ **Collaborator list** - How many? What skills?

### For Claude (After Access):
1. ✅ **Audit current site** - Analyze scnfiles.com code
2. ✅ **Review document samples** - Understand formatting requirements
3. ✅ **Test OCR options** - Compare Adobe, Tesseract, Google
4. ✅ **Design template system** - Reusable microsite generator
5. ✅ **Propose workflow** - Collaboration + automation plan
6. ✅ **Create comprehensive roadmap** - Prioritized implementation plan

---

## 🚨 Important Considerations

### Legal & Safety
- **Source protection**: Ensure leakers' identities protected
- **Document authenticity**: Formatting proves documents are real (don't alter!)
- **Legal review**: Consult lawyer before publishing sensitive docs
- **DMCA risks**: Church may claim copyright (fair use defense?)

### Ethical Responsibilities
- **Accuracy**: Never alter content (faithful OCR only)
- **Context**: Provide historical context (why document matters)
- **Impact**: Consider effect on ex-members (trigger warnings?)

### Technical Risks
- **Hosting**: Church may try to take down site (backup hosting?)
- **DDoS**: Large organization may attack site (Cloudflare protection?)
- **Data loss**: Keep backups of all originals (multiple locations)

---

## 🎉 Vision (When Complete)

**Scientology Archive (scnfiles.com)** becomes:
- **Authoritative repository** of leaked Scientology documents
- **Evidence base** for journalists, researchers, legal cases
- **Educational resource** for understanding mind control techniques
- **Collaborative effort** with ex-members contributing documents

**Tagline**: "Bringing Transparency to a Secretive Organization"

**Target**: 100+ documents published, professional presentation, trusted source

---

## ⏳ Status: AWAITING FOLDER ACCESS

**Next**: Maria will provide folder location in a few hours
**Then**: Full audit + comprehensive roadmap

---

**END OF PRELIMINARY VISION DOCUMENT**

*This document will be updated with detailed analysis after folder access is granted.*
