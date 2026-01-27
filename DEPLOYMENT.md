# Deployment Guide

**Last Updated**: 2026-01-27

---

## Current Status

- ✅ **GitHub**: Deployed to https://github.com/xenuloyalofficer/2ndbrain
- ⏳ **Vercel**: Ready for deployment (token configured)

---

## GitHub Repository

### URL
https://github.com/xenuloyalofficer/2ndbrain

### Access
- **Owner**: xenuloyalofficer
- **Token**: Configured with full repository access
- **Branch**: `main`

### Updating Documentation

```bash
# Navigate to 2nd-brain directory
cd C:\Users\maria\Desktop\pessoal\2nd-brain

# Stage changes
git add .

# Commit with descriptive message
git commit -m "Update: [description of changes]"

# Push to GitHub
git push origin main
```

---

## Vercel Deployment (Future)

### Current Setup
- **Token**: Configured (`6aTMlVBfncVTDiIRgWFgy3D1`)
- **Config File**: `vercel.json` created
- **Status**: Ready to deploy when needed

### When to Deploy to Vercel

Deploy when you want to:
1. **Add a documentation website** (Nextra, VitePress, Docusaurus)
2. **Enable web-based browsing** of the documentation
3. **Provide public URL** for sharing with team or Clawbot

### Deployment Options

#### Option A: Static Files (Current)
```bash
# Install Vercel CLI
npm i -g vercel

# Login with token
vercel login --token 6aTMlVBfncVTDiIRgWFgy3D1

# Deploy
cd C:\Users\maria\Desktop\pessoal\2nd-brain
vercel --prod
```

**Result**: Raw markdown files accessible at Vercel URL

#### Option B: Nextra Documentation Site (Recommended)
```bash
# Install Nextra
npm install next react react-dom nextra nextra-theme-docs

# Create pages/ directory
mkdir pages
# Move markdown files to pages/
# Nextra will auto-generate navigation

# Deploy
vercel --prod
```

**Result**: Beautiful, searchable documentation site

#### Option C: VitePress
```bash
# Install VitePress
npm install -D vitepress

# Initialize VitePress
npx vitepress init

# Move markdown files to docs/
# Configure .vitepress/config.ts

# Build
npm run docs:build

# Deploy
vercel --prod
```

**Result**: Fast, Vue-powered documentation site

---

## Recommended Next Steps

### For Now (Keep Simple)
- ✅ GitHub repository (done)
- ✅ Clawbot can access via GitHub API
- ✅ Raw markdown files version controlled

### When Ready for Web Deployment
1. **Choose documentation framework** (Nextra recommended)
2. **Set up project structure** (pages/, components/, etc.)
3. **Configure Vercel** (connect GitHub repo)
4. **Deploy** (automatic on push)

---

## Security Notes

### Tokens
- **GitHub Token**: Stored locally, expires in 90 days (regenerate when needed)
- **Vercel Token**: Stored locally, no expiration
- **Never commit tokens**: Both are in `.gitignore`

### Access Control
- **GitHub**: Private repository (only you have access)
- **Vercel**: Public deployment (when deployed)
- **Clawbot Access**: Via GitHub API with token

---

## Maintenance

### Weekly
- [ ] Update active/TODAY.md
- [ ] Review active/THIS_WEEK.md

### Monthly
- [ ] Update project ROADMAP.md files
- [ ] Archive old audits
- [ ] Refresh PROJECT_AUDIT.md for active projects

### Quarterly
- [ ] Regenerate GitHub token (if expiring)
- [ ] Review knowledge base coverage
- [ ] Update cross-project patterns

---

## Troubleshooting

### Git Push Failed
```bash
# Check remote
git remote -v

# Re-add remote if needed
git remote remove origin
git remote add origin https://github_pat_[TOKEN]@github.com/xenuloyalofficer/2ndbrain.git
git push -u origin main
```

### Vercel Deployment Failed
```bash
# Check token
vercel whoami

# Re-login
vercel login --token 6aTMlVBfncVTDiIRgWFgy3D1

# Try again
vercel --prod
```

---

**END OF DEPLOYMENT GUIDE**
