# DARVO Transcripts - Project Audit

**Date**: 2026-01-27
**Project**: SPTV Transcript Analyzer
**Location**: `C:\Users\maria\Desktop\pessoal\DARVO-Transcripts\sptv-analyzer`
**Status**: Functional, Feature-Rich Desktop Tool

---

## Executive Summary

**DARVO Transcripts** (SPTV Transcript Analyzer) is a **local Python desktop application** built with Gradio that analyzes 5000+ YouTube video transcripts for manipulation patterns using LLM-based analysis. It provides efficient indexing, filtering, and batch analysis capabilities with optional video clip extraction.

**Key Strength**: Token-efficient architecture (search without AI, analyze selectively).

---

## Part 1: Architecture Overview

### Application Type
- **Local desktop app** (Gradio web UI running at localhost:7860)
- **Data-first design**: Works with local transcript files, no database required
- **AI-optional**: Search and filter without consuming API tokens

### Core Workflow
```
1. Index transcripts (5000+ files) → In-memory dataframe
2. Filter by keyword/date/channel → No API calls
3. Analyze selected transcripts → LLM analysis (batch or single)
4. Extract video clips (optional) → FFmpeg + Whisper transcription
```

---

## Part 2: Tech Stack

### Frontend
- **Framework**: Gradio (Python web UI framework)
- **Theme**: Soft theme with custom CSS (dark blue/pink color scheme)
- **Layout**: Tab-based interface (Search, Pattern Analysis, Settings, Clip Extraction)

### Backend
- **Language**: Python 3.9+
- **Core Libraries**:
  - `gradio` - Web UI framework
  - `pandas` - Transcript indexing and filtering
  - `requests` - OpenRouter API client
  - `python-dateutil` - Date parsing

### AI/LLM Integration
- **Provider**: OpenRouter API
- **Models** (free tier rotation):
  - `xiaomi/mimo-v2-flash:free`
  - `deepseek/deepseek-r1-0528:free`
  - `meta-llama/llama-3.3-70b-instruct:free`
- **Model Rotation**: Automatic rotation on rate limits (429 errors)

### Video Clip Extraction (Optional)
- **Transcription**: `faster-whisper` (local Whisper models)
- **Download**: `yt-dlp` (YouTube video downloader)
- **Matching**: `rapidfuzz` (fuzzy text matching for quote timestamps)
- **Cutting**: FFmpeg (video clip extraction)

---

## Part 3: File Structure

```
sptv-analyzer/
├── main.py                      # Main Gradio app (910 lines)
├── config.py                    # Configuration (API keys, models, paths)
├── patterns.py                  # Pattern definitions and prompts (199 lines)
├── llm_client.py                # OpenRouter API client with rotation
├── indexer.py                   # Transcript file indexing
├── search.py                    # Filtering and search logic
├── clip_extract/                # Clip extraction module (optional)
│   ├── parser.py               # Parse analyzer output for timestamps
│   ├── downloader.py           # YouTube video downloader
│   ├── transcriber.py          # Whisper transcription
│   ├── cutter.py               # FFmpeg clip cutting
│   ├── matcher.py              # Quote-to-timestamp matching
│   ├── pipeline.py             # Batch processing orchestration
│   ├── clip_config.py          # Clip extraction configuration
│   └── main.py                 # Clip extraction CLI
├── requirements.txt             # Python dependencies
└── README.md                    # Installation and usage guide
```

---

## Part 4: Data Model

### Transcript File Format
**Naming Convention**: `YYYYMMDD-VideoID-ChannelName-VideoTitle_Language.txt`

**Example**: `20240730-kyyTNv8fKQQ-Marily-I_m_Receiving_Threats_____en.txt`

**Parsed Fields**:
- `date_str` - YYYYMMDD (sortable)
- `youtube_id` - 11-character video ID
- `channel` - Channel name
- `title` - Video title
- `language` - Language code
- `filepath` - Full path to transcript file
- `has_timestamps` - Boolean (whether transcript includes timestamps)

### In-Memory Index
- **Type**: Python list of transcript objects
- **Size**: ~5000 transcripts
- **Search**: Pandas DataFrame filtering (no database required)

---

## Part 5: Pattern Detection System

### Supported Patterns

| Pattern | Description | Stages/Types |
|---------|-------------|--------------|
| **DARVO** | Deny, Attack, Reverse Victim and Offender | 3 stages: Deny → Attack → Reverse |
| **Gaslighting** | Psychological manipulation to question reality | 5 types: Denial, Minimizing, Blame-shifting, History rewriting, Memory questioning |
| **Audience Weaponization** | Inciting audience to attack a target | 6 types: Direct CTA, Dog whistle, Enemy framing, Harassment framing, Doxxing, Deniability |
| **Character Assassination** | Sustained effort to damage reputation | 5 types: Ad hominem, Unverified claim, Derogatory labeling, Motive attribution, Guilt by association |
| **Love Bombing** | Excessive flattery and attention | 5 types: Excessive praise, Rapid escalation, Creating debt, Special status, Withdrawal |
| **Custom** | User-defined analysis query | N/A |

### Pattern Detection Prompts

Each pattern has:
1. **System prompt** - Expert analyst role + pattern definition
2. **Structured output format** - Verdict (YES/NO), Confidence (HIGH/MEDIUM/LOW), Evidence (quotes + timestamps), Summary
3. **User context field** - Optional focus area (people, events, timeframes)

**Example Output Format** (main.py:20-45):
```markdown
## VERDICT
[YES or NO]

## CONFIDENCE
[HIGH / MEDIUM / LOW]

## EVIDENCE
### Deny Stage
- **Timestamp**: [MM:SS]
- **Quote**: [exact quote]
- **Analysis**: [explanation]

## SUMMARY
[2-3 sentence summary]
```

---

## Part 6: Core Features

### 1. Search & Filter (No AI)
- **Keyword search**: OR logic with commas (e.g., "Mike Rinder, Claire Headley")
- **Date range filter**: From/to dates
- **Channel filter**: Filter by channel name
- **Result preview**: Dataframe with 6 columns (Date, Channel, Title, ID, Timestamps, Path)
- **Transcript viewer**: Click row to view full transcript

**Code**: main.py:80-91

### 2. Single Transcript Analysis
- **Input**: Selected transcript from Search tab
- **Pattern selection**: Dropdown (6 patterns)
- **Custom prompt**: Optional custom analysis query
- **Output**: Markdown formatted analysis with verdict, confidence, evidence, summary

**Code**: main.py:103-119

### 3. Batch Analysis
- **Input priority**:
  1. Specific videos (YouTube URLs/IDs pasted)
  2. Filtered transcripts (from Search tab)
  3. Analyze All (entire 5000+ index)
- **Pattern**: Single pattern applied to all
- **Context**: Optional user context for focus areas
- **Progress**: Gradio progress bar with transcript titles
- **Rate limiting**: 0.5s delay between calls
- **Error handling**: Graceful failures, continue batch
- **Output**: Markdown report with:
  - Summary (matches/total, source)
  - Matches section (only verdicts = YES)
  - YouTube links for each match
  - Errors section (if any)

**Code**: main.py:121-189

### 4. Settings
- **Transcript Path**: Configurable folder path with re-indexing
- **API Configuration**:
  - API key status (masked)
  - OpenRouter API URL
  - Model list (editable, one per line)
- **Runtime updates**: Changes apply immediately without restart

**Code**: main.py:191-201, config.py:28-66

### 5. Clip Extraction (Optional)

#### Quick Mode (Single Video)
1. **Parse Analysis**: Extract quotes and timestamps from analyzer output
2. **Download & Transcribe**: YouTube URL → local video → Whisper transcription
3. **Match Quotes**: Fuzzy match quotes to transcription timestamps
4. **Cut Clips**: FFmpeg cuts clips with configurable buffers

**Code**: main.py:236-318, 320-363, 366-419

#### Batch Mode (Multiple Videos)
1. **Parse Analysis**: Batch analysis output with multiple videos
2. **Configure Sources**:
   - Local video folder (scans for .mp4, .webm, .mkv with video IDs)
   - YouTube URLs list (formats: URL, video_id URL, or just video_id)
   - Priority: Local files > YouTube download
3. **Automatic Processing**:
   - Downloads missing videos
   - Transcribes with Whisper
   - Matches quotes
   - Cuts clips
4. **Output**: Clips organized by pattern folders

**Code**: main.py:424-659

---

## Part 7: Key Implementation Details

### 1. OpenRouter Client (llm_client.py)

**Model Rotation Logic**:
```python
# llm_client.py:24-27
def _rotate_model(self):
    """Switch to the next model in the list."""
    self.current_model_index = (self.current_model_index + 1) % len(self.models)
    print(f"Rotated to model: {self.models[self.current_model_index]}")
```

**API Call with Retry**:
- Attempts: `len(self.models) * 2` (each model tried twice)
- Rate limit detection: HTTP 429 → rotate model
- Connection errors: Exception → rotate model
- Delays: 1s between retries

**Code**: llm_client.py:29-78

### 2. Video ID Extraction (main.py:53-73)

Supports multiple formats:
- YouTube URLs: `youtube.com/watch?v=` or `youtu.be/`
- Raw video IDs: 11-character alphanumeric strings
- Newline-separated lists

**Code**: main.py:53-73

### 3. Clip Extraction Pipeline (clip_extract/)

**Architecture**:
```
1. Parser → Extract quotes + timestamps from markdown
2. Downloader → YouTube video → local file
3. Transcriber → Whisper → segment-level transcription
4. Matcher → Fuzzy match quotes to segments
5. Cutter → FFmpeg → clip files
```

**Output Structure**:
```
clips/
├── DARVO/
│   └── videoID_DARVO_Deny_02m15s.mp4
├── Gaslighting/
│   └── videoID_Gaslighting_Minimizing_05m30s.mp4
└── Character_Assassination/
    └── videoID_CharacterAssassination_Unverified_08m45s.mp4
```

### 4. Filename to Video ID Extraction (main.py:424-434)

**Pattern matching**:
1. Standard format: `YYYYMMDD-{11-char-ID}-...`
2. Fallback: Find 11-char alphanumeric anywhere in filename
3. Last resort: Use first 20 chars of filename stem

**Code**: main.py:424-434

---

## Part 8: Configuration

### Environment Variables
- `OPENROUTER_API_KEY` - Required for LLM analysis

### Config File (config.py)

**Default Values**:
```python
TRANSCRIPT_PATH = Path(r"C:\Users\maria\Desktop\pessoal\asl\video-transcripts")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
DEFAULT_MODELS = [
    "xiaomi/mimo-v2-flash:free",
    "deepseek/deepseek-r1-0528:free",
    "meta-llama/llama-3.3-70b-instruct:free"
]
MAX_SEARCH_RESULTS = 500
CONTEXT_LINES = 2
MAX_TRANSCRIPT_LENGTH = 50000  # Character limit for API calls
```

**Runtime Overrides**:
- Models and API URL can be changed in Settings tab
- Changes take effect immediately
- Not persisted to disk (reset on restart)

---

## Part 9: Dependencies

### Core (Required)
```
gradio
requests
pandas
python-dateutil
```

### Clip Extraction (Optional)
```
faster-whisper
yt-dlp
rapidfuzz
```

### External Tools
- **FFmpeg** - Required for clip extraction (not in requirements.txt)

---

## Part 10: Known Limitations

### 1. Token Limits
- **MAX_TRANSCRIPT_LENGTH**: 50,000 characters per API call
- **Handling**: Truncates transcripts (does not chunk/paginate)
- **Impact**: Long transcripts may lose analysis coverage

### 2. Search Performance
- **In-memory index**: ~5000 transcripts
- **No pagination**: All results loaded at once
- **Limit**: MAX_SEARCH_RESULTS = 500

### 3. Clip Extraction Dependencies
- **Graceful degradation**: If dependencies missing, clip extraction tab shows install instructions
- **FFmpeg**: Must be installed separately and in PATH

### 4. No Persistence
- **Analysis results**: Not saved to database
- **User must**: Copy/paste analysis output to external storage
- **Settings**: Model configuration resets on app restart

### 5. Single Video ID Format
- **Expected format**: Transcripts must follow naming convention
- **Fallback logic**: Attempts to extract video ID but may fail on non-standard filenames

---

## Part 11: Strengths

### 1. Token Efficiency
- **Search without AI**: Filter 5000+ transcripts without API calls
- **Selective analysis**: Only analyze what you need
- **Cost control**: Batch analysis with progress tracking

### 2. User Experience
- **No database setup**: Just point to transcript folder
- **Gradio UI**: Clean, familiar web interface
- **Progress feedback**: Real-time progress bars for long operations

### 3. Model Rotation
- **Free tier friendly**: Automatic rotation when rate limited
- **Zero downtime**: Seamlessly switches to next model
- **Configurable**: User can add/remove models

### 4. Structured Output
- **Consistent format**: All patterns use same output structure
- **Timestamp extraction**: Designed for clip extraction pipeline
- **Machine-parseable**: Evidence blocks with metadata

### 5. Clip Extraction
- **End-to-end**: Analysis → Timestamps → Clips
- **Batch processing**: Multiple videos at once
- **Local file support**: Avoids re-downloading existing videos
- **Organized output**: Clips sorted by pattern folders

---

## Part 12: Suggested Improvements

### High Priority

1. **Persistent Storage**
   - Save analysis results to SQLite or JSON files
   - Resume interrupted batch analyses
   - History of previous analyses

2. **Chunking for Long Transcripts**
   - Split >50K character transcripts into chunks
   - Aggregate chunk-level verdicts
   - Maintain context across chunks

3. **Export Functionality**
   - Export batch results to CSV/Excel
   - Include video links, timestamps, quotes
   - Filter by verdict (YES only) or confidence level

### Medium Priority

4. **Advanced Filtering**
   - Multi-pattern analysis (detect all patterns in one pass)
   - Verdict filter (show only matches)
   - Confidence filter (HIGH only)

5. **Timestamp Support**
   - Detect if transcript has timestamps vs. plain text
   - Parse existing timestamps (don't re-transcribe)
   - Direct timestamp extraction from analyzer prompts

6. **UI Improvements**
   - Dark mode toggle
   - Column sorting in dataframes
   - Pagination for large result sets

### Low Priority

7. **Multi-language Support**
   - Pattern detection in non-English transcripts
   - Language-specific model selection
   - Translation integration

8. **Collaboration Features**
   - Share analysis results via URL
   - Export to presentation-ready formats
   - Annotation system for evidence review

---

## Part 13: Testing Status

### Current State
- **No test files found** in the repository
- **Manual testing**: Likely tested manually via UI

### Recommended Tests

1. **Unit Tests**:
   - `test_video_id_extraction()` - Filename parsing
   - `test_model_rotation()` - Rate limit handling
   - `test_verdict_parsing()` - Markdown verdict extraction
   - `test_timestamp_parsing()` - Timestamp format handling

2. **Integration Tests**:
   - `test_batch_analysis()` - End-to-end batch workflow
   - `test_clip_extraction()` - Full clip pipeline
   - `test_api_retry()` - OpenRouter error handling

3. **Fixture Data**:
   - Sample transcripts (various formats)
   - Sample analyzer outputs
   - Mock API responses

---

## Part 14: Documentation Quality

### Existing Documentation
- ✅ **README.md**: Installation, usage, data structure
- ✅ **Inline comments**: Minimal but present
- ✅ **Docstrings**: Function-level docstrings in main.py

### Missing Documentation
- ❌ **Architecture diagrams**: No visual system overview
- ❌ **API documentation**: OpenRouter integration details
- ❌ **Pattern definitions**: No separate pattern specification doc
- ❌ **Deployment guide**: No production deployment instructions
- ❌ **Troubleshooting guide**: Common issues and solutions

---

## Summary: What's Complete

### Fully Functional
- ✅ Transcript indexing (5000+ files)
- ✅ Search and filtering (keyword, date, channel)
- ✅ Single transcript analysis (6 patterns)
- ✅ Batch analysis (specific videos, filtered, or all)
- ✅ OpenRouter API integration with model rotation
- ✅ Settings UI (path, API key, models)
- ✅ Clip extraction (optional, with dependencies)
  - ✅ Quick mode (single video)
  - ✅ Batch mode (multiple videos)
  - ✅ Local file scanning
  - ✅ YouTube download fallback

### Well-Designed
- ✅ Token-efficient architecture
- ✅ Graceful degradation (clip extraction optional)
- ✅ Progress feedback for long operations
- ✅ Structured output format for patterns
- ✅ Local-first (no cloud dependency except OpenRouter)

---

## Summary: What's Incomplete

### Missing Features
- ❌ Persistent storage (results not saved)
- ❌ Export functionality (CSV, Excel, PDF)
- ❌ Chunking for long transcripts (>50K chars)
- ❌ Multi-pattern analysis (one pattern at a time)
- ❌ Timestamp extraction from existing transcripts

### Known Issues
- ⚠️ Transcripts truncated at 50K characters
- ⚠️ No pagination for large search results (500 limit)
- ⚠️ Settings reset on app restart

---

## Summary: What Needs Attention

### High Priority
1. **Data Persistence**: Add SQLite or JSON storage for analysis results
2. **Export Reports**: CSV/Excel export with video links and timestamps
3. **Chunking Strategy**: Handle long transcripts properly

### Medium Priority
4. **Testing**: Unit tests for core functions
5. **Documentation**: Architecture diagrams, troubleshooting guide
6. **Multi-pattern Analysis**: Detect all patterns in one pass

### Low Priority
7. **UI Polish**: Dark mode, sorting, pagination
8. **Collaboration**: Share results, annotations

---

## Conclusion

**DARVO Transcripts** is a **well-architected, functional desktop tool** with a clear focus on token efficiency and user experience. The core analysis pipeline is solid, with smart design choices (local indexing, model rotation, optional clip extraction).

**Primary gaps**: Data persistence, export functionality, and long transcript handling.

**Recommendation**: Add SQLite storage and CSV export for immediate value. Chunking strategy for long transcripts is critical for completeness.

---

**END OF PROJECT AUDIT**
