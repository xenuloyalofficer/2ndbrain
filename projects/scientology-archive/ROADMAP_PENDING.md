# Scientology Archive - Roadmap (PENDING)

**Last Updated**: 2026-01-27
**Status**: AWAITING FOLDER ACCESS
**Goal**: Document processing pipeline + collaboration system

---

## ⏳ Current Status

**Awaiting**:
- Folder location from Maria
- Sample documents for formatting analysis
- Current tech stack review
- Existing OCR pipeline audit

**Once Received**:
- Full audit of scnfiles.com codebase
- Analysis of document formatting requirements
- OCR engine testing (Adobe, Tesseract, Google)
- Template system design
- Collaboration workflow proposal
- Comprehensive implementation roadmap

---

## 🎯 Preliminary Goals (To Be Refined)

### Goal 1: Perfect OCR Formatting
**Requirement**: 95%+ fidelity to original Scientology document formatting
- Preserve multi-column layouts (addresses left/right)
- Maintain date alignment
- Keep paragraph entity markers
- Preserve signature blocks

### Goal 2: Microsite Automation
**Requirement**: Generate microsites in minutes (not hours)
- Reusable template system
- Automated from OCR output
- Consistent styling across all documents
- Easy to update (change template → update all sites)

### Goal 3: Collaboration System
**Requirement**: Distribute work to multiple collaborators
- Clear workflow (intake → OCR → review → publish)
- Task assignment system
- Quality control checkpoints
- Onboarding in < 1 hour

---

## 📋 High-Level Phases (Tentative)

### Phase 1: Audit & Analysis (1 Week)
**After folder access granted**:
- Analyze current scnfiles.com implementation
- Review sample documents (formatting challenges)
- Test OCR engines (compare accuracy)
- Document current bottlenecks

### Phase 2: OCR Pipeline (2-3 Weeks)
- Choose OCR engine (Adobe, Tesseract, or Google)
- Build format preservation layer
- Validate against sample documents
- Create quality control checklist

### Phase 3: Template System (1-2 Weeks)
- Design microsite template
- Build generation script (OCR JSON → HTML)
- Test with existing documents
- Deploy to scnfiles.com

### Phase 4: Collaboration Workflow (1-2 Weeks)
- Document processing guide
- Task management system (Trello, Notion, Airtable)
- Quality control workflow
- Collaborator onboarding materials

### Phase 5: Automation & Scale (Ongoing)
- AI-assisted OCR post-processing
- Batch processing for multiple documents
- Automated deployment pipeline
- Monitoring & maintenance

---

## 🔴 Critical Success Factors

### 1. Formatting Fidelity (Non-Negotiable)
**Why**: Document authenticity depends on it
- Must preserve exact layout
- Must maintain alignment (addresses, dates, signatures)
- Must keep entity markers at paragraph starts

**Risk**: If formatting is lost, documents lose credibility

### 2. Collaborator Ease-of-Use (High Priority)
**Why**: Can't scale without help
- Simple workflow (minimal steps)
- Clear instructions (no ambiguity)
- Fast turnaround (hours, not days)

**Risk**: If too complex, collaborators won't help

### 3. Website Performance (Medium Priority)
**Why**: Public-facing resource
- Fast page loads (< 2 seconds)
- Mobile-friendly (many users on phones)
- Search functionality (find documents)

**Risk**: Slow site = fewer visitors

---

## 💡 Preliminary Technical Approach

### OCR Strategy (To Be Validated)
**Option A: Adobe PDF Extract API** (If budget allows)
- Best layout preservation
- Handles multi-column documents
- JSON output with formatting data

**Option B: Tesseract + Custom Post-Processing**
- Free and open-source
- Requires manual layout tuning
- Python scripts for format validation

**Decision**: Test both with real Scientology documents, choose based on accuracy

### Microsite Generation
**Proposed Stack**:
- **Template**: HTML + Tailwind CSS (consistent styling)
- **Generator**: Python script (OCR JSON → HTML)
- **Deployment**: Static site (Netlify, Vercel, or GitHub Pages)

**Workflow**:
```
1. OCR produces structured JSON:
   {
     "addresses": { "left": "...", "right": "..." },
     "date": "...",
     "paragraphs": [
       { "entity": "...", "text": "..." },
       ...
     ],
     "signature": "..."
   }

2. Generator reads JSON + template

3. Outputs microsite HTML:
   /documents/001-policy-letter/
     index.html
     styles.css
     metadata.json

4. Deploys to scnfiles.com/documents/001-policy-letter/
```

### Collaboration Tools
**Proposed Setup**:
- **Task Management**: Notion or Airtable (document queue)
- **File Sharing**: Google Drive or Dropbox (upload originals)
- **Communication**: Slack or Discord (coordination)
- **Documentation**: Wiki or Notion (process guide)

---

## 📝 Next Steps (Immediate)

### When Folder Access Granted:
1. [ ] **Analyze scnfiles.com codebase**
   - What framework? (static site, CMS, custom?)
   - How are microsites structured?
   - What's the current deployment process?

2. [ ] **Review sample documents**
   - Get 3-5 examples with complex formatting
   - Identify formatting patterns
   - Document alignment requirements

3. [ ] **Test OCR engines**
   - Adobe PDF Extract: Test accuracy + layout
   - Tesseract: Test with layout analysis
   - Google Document AI: Test complex documents
   - Compare results, choose best

4. [ ] **Design template system**
   - Create HTML template for microsites
   - Define JSON schema for OCR output
   - Build generator script

5. [ ] **Propose collaboration workflow**
   - Document processing steps
   - Quality control checkpoints
   - Task assignment system

6. [ ] **Create comprehensive roadmap**
   - Detailed timeline (weeks/months)
   - Resource requirements (budget, tools)
   - Risk mitigation strategies

---

## 🚨 Risks to Consider

### Technical Risks
- **OCR accuracy**: May not perfectly preserve formatting
- **Scale**: Processing 100+ documents may be slow
- **Website hosting**: Church may try to take down site

### Legal Risks
- **Copyright**: Church may claim copyright (fair use defense?)
- **Source protection**: Must protect leakers' identities
- **Legal threats**: Church is litigious (be prepared)

### Operational Risks
- **Collaborator availability**: May not have enough help
- **Quality control**: Hard to verify formatting accuracy at scale
- **Document authenticity**: Need to verify documents are real

---

## 🎉 Vision (When Complete)

**Scientology Archive (scnfiles.com)** will be:
- **Comprehensive**: 100+ leaked documents published
- **Authentic**: Formatting preserved, credible source
- **Collaborative**: Ex-members contributing documents
- **Impactful**: Used by journalists, researchers, legal teams

**Success Story**:
"A journalist researching Scientology's disconnection policy found a leaked internal memo on scnfiles.com. The document's preserved formatting proved its authenticity, and it became key evidence in a major exposé."

---

## ⏳ AWAITING FOLDER ACCESS

**Timeline**: Maria will provide access in a few hours

**Then**: Full audit → Detailed roadmap → Implementation begins

---

**END OF PRELIMINARY ROADMAP**

*This document will be replaced with a comprehensive roadmap after folder audit is complete.*
