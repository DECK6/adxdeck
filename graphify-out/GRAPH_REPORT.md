# Graph Report - /Volumes/data/Dev/adxdeck  (2026-04-20)

## Corpus Check
- 8 files · ~3,606,013 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 112 nodes · 203 edges · 12 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]

## God Nodes (most connected - your core abstractions)
1. `updateUI()` - 17 edges
2. `MediaArtStage` - 16 edges
3. `startTimer()` - 9 edges
4. `clearNotice()` - 6 edges
5. `setSession()` - 6 edges
6. `clearTick()` - 6 edges
7. `initPostView()` - 6 edges
8. `pad()` - 5 edges
9. `readDurationMs()` - 5 edges
10. `tick()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `updateUI()` --calls--> `formatCountdown()`  [EXTRACTED]
  /Volumes/data/Dev/adxdeck/timer/app.js → /Volumes/data/Dev/adxdeck/timer/app.js  _Bridges community 4 → community 3_
- `startTimer()` --calls--> `readDurationMs()`  [EXTRACTED]
  /Volumes/data/Dev/adxdeck/timer/app.js → /Volumes/data/Dev/adxdeck/timer/app.js  _Bridges community 6 → community 3_

## Communities

### Community 0 - "Community 0"
Cohesion: 0.1
Nodes (7): animate(), drawConnections(), initParticles(), loadProjects(), Particle, renderProjects(), resize()

### Community 1 - "Community 1"
Cohesion: 0.33
Nodes (1): MediaArtStage

### Community 2 - "Community 2"
Cohesion: 0.22
Nodes (7): cleanWikiLinks(), escapeAttr(), escapeHtml(), formatDateHuman(), postPageHtml(), renderInline(), renderMarkdown()

### Community 3 - "Community 3"
Cohesion: 0.26
Nodes (14): clearNotice(), clearTick(), completeTimer(), formatDurationLabel(), onInputChange(), pauseTimer(), resumeTimer(), setNotice() (+6 more)

### Community 4 - "Community 4"
Cohesion: 0.27
Nodes (10): applySessionTheme(), formatClock(), formatCountdown(), formatTargetLabel(), pad(), secondsToParts(), setSession(), syncEndTimeInputFromMs() (+2 more)

### Community 5 - "Community 5"
Cohesion: 0.33
Nodes (9): buildFilters(), cleanMarkdown(), fetchPosts(), formatDate(), getCategoryColor(), getSlugFromURL(), initBlogList(), initPostView() (+1 more)

### Community 6 - "Community 6"
Cohesion: 0.33
Nodes (7): clamp(), getActiveTargetTimestamp(), getDisplayMs(), getEndTimeTargetTimestamp(), getIdlePreviewMs(), getProgress(), readDurationMs()

### Community 7 - "Community 7"
Cohesion: 0.5
Nodes (0): 

### Community 8 - "Community 8"
Cohesion: 0.67
Nodes (4): clearHudHideTimer(), revealHud(), scheduleHudHide(), setHudVisible()

### Community 9 - "Community 9"
Cohesion: 0.67
Nodes (2): seededRandom(), sketch()

### Community 10 - "Community 10"
Cohesion: 1.0
Nodes (0): 

### Community 11 - "Community 11"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **Thin community `Community 10`** (1 nodes): `main.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (1 nodes): `posts-content.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `MediaArtStage` connect `Community 1` to `Community 4`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **Why does `updateUI()` connect `Community 3` to `Community 4`, `Community 6`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._