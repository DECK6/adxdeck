---
type: article
title: "Hermes 대시보드는 포크 없이 확장된다"
aliases:
  - "hermes-dashboard-extensions"
author:
  - "Deck"
date created: 2026-07-04
date modified: 2026-07-04
tags: [hermes, ai-agent, workflow, dashboard]
description: "A practical guide to extending the Hermes Agent web dashboard with YAML themes, UI plugins, shell slots, and optional FastAPI backend routes without forking the dashboard codebase."
thumbnail: images/hermes-dashboard-extensions-cover.png
status: completed
series: hermes-notes
---

# Hermes 대시보드는 포크 없이 확장된다

![Hermes dashboard extensions cover](images/hermes-dashboard-extensions-cover.png)

Hermes Dashboard는 설정과 세션을 보는 관리 화면에서 끝나지 않습니다. **Extending the Dashboard**는 대시보드를 포크하지 않고도 theme, tab, slot, backend API를 얹어 각자의 운영 조종석으로 바꾸는 기능입니다. 문제는 단순합니다. “기본 화면을 고쳐 쓰고 싶지만, Hermes 본체를 패치하고 유지보수하고 싶지는 않다”는 상황을 해결합니다.

## 기능 개요 — theme, UI plugin, backend route

확장 레이어는 세 가지입니다. 첫째, `~/.hermes/dashboard-themes/` 아래의 YAML theme가 palette, typography, density, layout, background asset을 바꿉니다. 둘째, `~/.hermes/plugins/<name>/dashboard/` 안의 `manifest.json`과 JavaScript bundle이 새 tab을 추가하거나 built-in page에 작은 widget을 끼웁니다. 셋째, 같은 dashboard 폴더의 Python 파일은 FastAPI `router`를 노출해 `/api/plugins/<name>/...` 아래에 backend route를 붙입니다.

핵심은 런타임 드롭인입니다. dashboard 소스를 fork하거나 `npm run build`를 다시 하지 않아도, 정해진 폴더 구조에 파일을 넣고 새로고침하거나 rescan하면 UI가 발견됩니다. CLI skin이 터미널 표시를 바꾸는 기능이라면, dashboard theme는 브라우저 관리 화면의 디자인 시스템을 바꾸는 별도 표면입니다.

## 어떻게 작동하나

가장 작은 theme는 YAML 한 파일이면 됩니다.

```bash
mkdir -p ~/.hermes/dashboard-themes
```

```yaml
# ~/.hermes/dashboard-themes/neon.yaml
name: neon
label: Neon
palette:
  background: "#000000"
  midground: "#ff00ff"
```

대시보드의 palette picker에서 선택하면 `config.yaml`의 `dashboard.theme`에 저장됩니다. 더 깊게는 `layoutVariant: cockpit`, `typography.fontUrl`, `assets.bg`, `componentStyles.card`, `customCSS`로 화면 전체를 재조합할 수 있습니다.

UI plugin은 Hermes plugin 디렉터리 안에 dashboard 하위 폴더를 둡니다.

```json
{
  "name": "my-plugin",
  "label": "My Plugin",
  "icon": "Sparkles",
  "tab": { "path": "/my-plugin", "position": "after:skills" },
  "entry": "dist/index.js",
  "css": "dist/style.css",
  "api": "plugin_api.py"
}
```

bundle은 `window.__HERMES_PLUGIN_SDK__`에서 React, UI components, API client를 받고, `window.__HERMES_PLUGINS__.register()`로 tab component를 등록합니다. 전체 page를 대체할 수도 있지만, 보통은 slot이 더 안전합니다. `sessions:top`, `cron:bottom`, `header-left`, `sidebar`, `overlay` 같은 위치에 card나 banner만 얹으면 built-in page는 Hermes 업데이트를 계속 따라갑니다.

```javascript
window.__HERMES_PLUGINS__.registerSlot(
  "session-notes", "sessions:top", PinnedSessionsBanner
);
```

Backend가 필요하면 `plugin_api.py`에 `router = APIRouter()`를 export합니다. route는 dashboard process 안에서 mount되므로 session count, config snapshot, custom 운영 지표 같은 widget을 만들 수 있습니다. 다만 backend route는 startup 때 mount되므로 새 API 파일을 추가한 뒤에는 dashboard 재시작이 필요합니다.

## 실제 운용에서의 짧은 장면

이 사용자의 셋업에서는 프로파일별 운영 상태를 자주 확인하고, Kanban이나 achievements처럼 dashboard tab으로 드러나는 plugin도 함께 검토합니다. 이번 점검에서도 active profile의 `dashboard.theme`는 기본값이고 `plugins.enabled`는 비어 있었지만, 설치본에는 dashboard manifest를 가진 bundled plugin이 존재했습니다. 즉 확장은 항상 켜진 화면이라기보다, 필요한 운영 패널을 작게 얹을 수 있는 준비된 표면입니다.

## 자주 걸리는 함정

첫째, manifest 위치는 `~/.hermes/plugins/<name>/dashboard/manifest.json`입니다. project plugin은 `HERMES_ENABLE_PROJECT_PLUGINS`를 켠 경우에만 스캔됩니다. 둘째, tab이 안 보이면 먼저 rescan을 부릅니다.

```bash
curl http://127.0.0.1:9119/api/dashboard/plugins/rescan
```

그래도 안 되면 browser console에서 bundle 404, IIFE exception, manifest의 `name`과 `register()` 이름 불일치를 확인합니다. theme가 안 보이면 YAML 확장자와 parse error를 보고, `~/.hermes/logs/errors.log`를 봅니다. 셋째, dashboard를 `--host 0.0.0.0`로 열면 plugin backend route도 도달 가능해집니다. 신뢰하지 않는 plugin과 공개 bind는 함께 쓰지 않는 편이 안전합니다.

## 언제 쓰면 좋은가

기본 Dashboard는 Hermes를 관리하는 표준 조종석입니다. Extending the Dashboard는 그 조종석에 팀 상태판, 세션 banner, Kanban rail, 운영 통계 widget을 붙이고 싶을 때 적합합니다. 단순 색상 변경은 theme 하나로 충분하고, agent 행동이나 권한을 바꾸려는 목적이라면 dashboard 확장이 아니라 plugin, hook, toolset, config를 따로 설계해야 합니다.
