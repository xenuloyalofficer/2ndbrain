# DARVO Transcripts - Quick Context

**Location**: `C:\Users\maria\Desktop\pessoal\DARVO-Transcripts\sptv-analyzer`
**Status**: Active
**Priority**: Medium
**Last Updated**: 2026-01-27

---

## What Is This?

A **Python + Gradio desktop app** to analyze YouTube transcripts for manipulation patterns (DARVO, gaslighting, etc.) using AI.

**Use Case**: Analyze 5000+ local transcript files for patterns without burning through API tokens.

---

## Current State

### ✅ What's Working

- **Indexing** - Scans local folder with 5000+ transcript files
- **Search** - Filter by keyword, date, channel (no AI tokens)
- **Pattern Analysis** - Send transcripts to OpenRouter LLMs
- **Model Rotation** - Automatically rotate free/cheap models on rate limits
- **Gradio UI** - Web-based interface
- **Clip Extraction** (optional) - Extract video clips based on analysis results

### ⚠️ What's Incomplete

- Clip extraction feature (optional dependency)
- Batch analysis across multiple transcripts
- Export reports

### 🔴 What's Broken

**None identified** - appears functional

---

## Tech Stack

- **Language**: Python 3.9+
- **UI**: Gradio (web interface)
- **AI**: OpenRouter API (LLM analysis)
- **Data**: Local .txt files (YouTube transcripts)
- **Clip Extract**: FFmpeg (optional, for video clipping)

---

## Quick Commands

```powershell
# Set API key
$env:OPENROUTER_API_KEY = "sk-..."

# Install
cd sptv-analyzer
pip install -r requirements.txt

# Run
python main.py
```

---

## Key Files

- `main.py` - Gradio app (UI, analysis flow)
- `config.py` - Configuration (paths, models)
- `indexer.py` - Transcript file indexing
- `search.py` - Search/filter logic
- `patterns.py` - Pattern definitions (DARVO, gaslighting, etc.)
- `llm_client.py` - OpenRouter API client
- `clip_extract/` - Optional video clip extraction

---

## Data Structure

**Transcript filenames** must follow format:
```
YYYYMMDD-VideoID-ChannelName-VideoTitle_Language.txt
```

**Example**:
```
20240730-kyyTNv8fKQQ-Marily-I_m_Receiving_Threats_____en.txt
```

**Parsing**:
- Date: `20240730`
- Video ID: `kyyTNv8fKQQ`
- Channel: `Marily`
- Title: `I_m_Receiving_Threats_____`
- Language: `en`

---

## Analysis Patterns

**Built-in patterns** (from `patterns.py`):
- **DARVO** - Deny, Attack, Reverse Victim & Offender
- **Gaslighting** - Reality distortion, memory manipulation
- **Love Bombing** - Excessive affection/praise (manipulation tactic)
- **Triangulation** - Involving third parties to manipulate
- **Projection** - Accusing others of own behavior
- **Deflection** - Avoiding accountability by changing subject
- **Minimization** - Downplaying harm caused
- **Blame Shifting** - Making victim responsible

---

## Workflow

1. **Index** (first run)
   - App auto-indexes default path from `config.py`
   - Or: Settings tab → paste folder path → Re-Index

2. **Search**
   - Enter keywords (e.g., "threats", "apology")
   - Filter by date range, channel
   - Click row to view transcript

3. **Analyze**
   - Select transcript from search results
   - Go to "Pattern Analysis" tab
   - Select pattern (e.g., DARVO)
   - Click "Analyze with AI"
   - AI returns markdown report

4. **Clip Extract** (optional)
   - If analysis finds patterns with timestamps
   - Can extract video clips using FFmpeg

---

## Configuration

**Edit `config.py`**:
- `TRANSCRIPT_PATH` - Default folder path
- `DEFAULT_MODELS` - OpenRouter model list (rotation)

**Model Rotation**:
- Uses free/cheap models first
- Auto-rotates on rate limit (429)
- Falls back to next model in list

---

## Next Steps

1. **Batch Analysis** - Analyze multiple transcripts in one go
2. **Export Reports** - Save analysis results to file
3. **Pattern Customization** - Allow user-defined patterns
4. **Visualization** - Charts/graphs of pattern frequency
5. **Clip Extraction Polish** - Improve video clipping workflow

---

## Notes for Clawbot

- **Local-first** - All transcripts stored locally (5000+ files)
- **Token-efficient** - Only uses AI for analysis step (not search/filter)
- **Gradio UI** - Web interface (runs localhost)
- **OpenRouter** - Uses free/cheap models with rotation
- **DARVO focus** - Originally for DARVO analysis, expanded to other patterns
- **Transcript format** - Strict filename format required for parsing
- **Optional clip extract** - FFmpeg dependency (gracefully handles if missing)
- **Windows PowerShell** - Environment variable setting for API key

This is a **specialized research tool** for analyzing manipulation patterns in YouTube transcripts.
