# Graph Report - /Volumes/data/Dev/adxdeck-blog-main  (2026-07-14)

## Corpus Check
- 27 files · ~17,047,920 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2075 nodes · 8036 edges · 16 communities detected
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 102 edges (avg confidence: 0.8)
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
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]

## God Nodes (most connected - your core abstractions)
1. `i()` - 62 edges
2. `i()` - 62 edges
3. `i()` - 62 edges
4. `i()` - 62 edges
5. `i()` - 62 edges
6. `nc()` - 56 edges
7. `nc()` - 56 edges
8. `nc()` - 54 edges
9. `nc()` - 51 edges
10. `nc()` - 51 edges

## Surprising Connections (you probably didn't know these)
- `validatePathExamples()` --calls--> `at()`  [INFERRED]
  /Volumes/data/Dev/adxdeck-blog-main/scripts/check-learnmap-ontology.mjs → /Volumes/data/Dev/adxdeck-blog-main/virtume/assets/index-BJXWaOIy.js
- `windowResized()` --calls--> `resizeCanvas()`  [INFERRED]
  /Volumes/data/Dev/adxdeck/sketch.js → /Volumes/data/Dev/adxdeck-blog-main/learnmap/app.js
- `Dr()` --calls--> `Er()`  [INFERRED]
  /Volumes/data/Dev/adxdeck-blog-main/virtume/assets/index-BesBMq5F.js → /Volumes/data/Dev/adxdeck-blog-main/virtume/assets/index-BLafwqRH.js
- `ta()` --calls--> `Er()`  [INFERRED]
  /Volumes/data/Dev/adxdeck-blog-main/virtume/assets/index-BesBMq5F.js → /Volumes/data/Dev/adxdeck-blog-main/virtume/assets/index-BLafwqRH.js
- `na()` --calls--> `Er()`  [INFERRED]
  /Volumes/data/Dev/adxdeck-blog-main/virtume/assets/index-BesBMq5F.js → /Volumes/data/Dev/adxdeck-blog-main/virtume/assets/index-BLafwqRH.js

## Communities

### Community 0 - "Community 0"
Cohesion: 0.02
Nodes (324): $(), a(), aa(), ac(), ad(), ae(), af(), ai() (+316 more)

### Community 1 - "Community 1"
Cohesion: 0.02
Nodes (324): Er(), $(), a(), aa(), ac(), ad(), ae(), af() (+316 more)

### Community 2 - "Community 2"
Cohesion: 0.02
Nodes (326): $(), a(), aa(), ac(), ad(), ae(), af(), ai() (+318 more)

### Community 3 - "Community 3"
Cohesion: 0.03
Nodes (323): $(), a(), aa(), ac(), ad(), ae(), af(), ai() (+315 more)

### Community 4 - "Community 4"
Cohesion: 0.03
Nodes (323): $(), a(), aa(), ac(), ad(), ae(), af(), ai() (+315 more)

### Community 5 - "Community 5"
Cohesion: 0.03
Nodes (147): applyRouteFromHash(), assertCount(), buildCoordinates(), canvasPoint(), cardInfo(), centerNode(), clamp(), clearAutorotationTimer() (+139 more)

### Community 6 - "Community 6"
Cohesion: 0.04
Nodes (28): assertAllowedFields(), assertCount(), assertNoPrivateSourceFields(), assertSorted(), assertUnique(), buildProjection(), indirectPathExamples(), main() (+20 more)

### Community 7 - "Community 7"
Cohesion: 0.06
Nodes (39): $(), applyInput(), barRow(), buildPriorityActions(), card(), categoryPriority(), chip(), decisionSummary() (+31 more)

### Community 8 - "Community 8"
Cohesion: 0.09
Nodes (35): applySessionTheme(), clearHudHideTimer(), clearNotice(), clearTick(), completeTimer(), formatClock(), formatCountdown(), formatDurationLabel() (+27 more)

### Community 9 - "Community 9"
Cohesion: 0.15
Nodes (19): cleanWikiLinks(), currentKstDate(), escapeAttr(), escapeHtml(), formatDateHuman(), isTableSeparator(), normalizePostDate(), parseTableRow() (+11 more)

### Community 10 - "Community 10"
Cohesion: 0.33
Nodes (9): buildFilters(), cleanMarkdown(), fetchPosts(), formatDate(), getCategoryColor(), getSlugFromURL(), initBlogList(), initPostView() (+1 more)

### Community 11 - "Community 11"
Cohesion: 0.4
Nodes (0):

### Community 12 - "Community 12"
Cohesion: 1.0
Nodes (0):

### Community 13 - "Community 13"
Cohesion: 1.0
Nodes (0):

### Community 14 - "Community 14"
Cohesion: 1.0
Nodes (0):

### Community 15 - "Community 15"
Cohesion: 1.0
Nodes (0):

## Knowledge Gaps
- **Thin community `Community 12`** (2 nodes): `read()`, `check-learnmap-parent.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (1 nodes): `main.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (1 nodes): `posts-content.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (1 nodes): `check-learnmap-profile.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Er()` connect `Community 1` to `Community 0`, `Community 2`, `Community 3`, `Community 4`?**
  _High betweenness centrality (0.369) - this node is a cross-community bridge._
- **Why does `clamp()` connect `Community 5` to `Community 8`?**
  _High betweenness centrality (0.185) - this node is a cross-community bridge._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.02 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.02 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.02 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.03 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.03 - nodes in this community are weakly interconnected._