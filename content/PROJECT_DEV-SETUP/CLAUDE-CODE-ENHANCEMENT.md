# Claude Code 세팅 개선 분석

> 최종 업데이트: 2026-02-19 13:22 (목요일)

현재 세팅을 새로운 기능과 비교 분석한 결과.

## 현재 세팅 요약

| 항목 | 수량 |
|------|------|
| commands | 27개 |
| skills | 14개 |
| agents | 4개 (context-manager, code-reviewer, researcher, schedule-manager) |
| hooks | 6개 (dangerous-check, session-start, post-commit, notify-question) |
| scripts | 2개 (cal.sh, sync-progress.sh) |
| templates | 3개 (bug, feature, research) |
| plugins | 1개 (claude-dashboard statusline) |

---

## 개선 제안

### 1. `opusplan` 모델 활용 (비용 절감)

**현재**: `model` 설정 없음 (기본값 사용)
**제안**: Plan 모드에서 Opus, 실행에서 Sonnet 자동 전환

```json
{
  "model": "opusplan"
}
```

**이유**: Plan 모드를 `EnterPlanMode` → `ExitPlanMode` 워크플로우로 적극 사용하고 있음. 계획은 Opus의 깊은 추론, 코드 실행은 Sonnet의 효율성을 활용하면 비용 대비 품질 최적화 가능.

> [!warning] 단점
> Opus가 필요한 복잡한 구현 작업에서 Sonnet으로 전환되면 품질이 떨어질 수 있음. 필요시 `/model opus`로 임시 전환 가능.

---

### 2. Effort Level 설정

**현재**: 미설정 (기본 high)
**제안**: 기본은 high 유지, 환경 변수로 필요시 조정

```json
{
  "effortLevel": "high"
}
```

- `high`: 아키텍처 설계, 복잡한 디버깅
- `medium`: 일반 코딩, 리뷰
- `low`: 간단한 수정, 포맷팅

`/model` 커맨드에서 좌/우 방향키로 실시간 조정 가능.

---

### 3. Auto Memory 활용 ✅

> 2026-02-19 적용 완료. MEMORY.md에 볼트 구조, 프로젝트 정보, 워크플로우 패턴 기록.

세션마다 자동 로드되므로 디버깅 인사이트나 새 패턴 발견 시 지속 업데이트할 것.

---

### 4. Stop Hook으로 자동 컨텍스트 알림

**현재**: `PostToolUse`에서 commit 후 `/ctx-update` 알림만 있음
**제안**: Claude 응답 완료 시 컨텍스트 저장 리마인더

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/stop-reminder.sh"
          }
        ]
      }
    ]
  }
}
```

```bash
# stop-reminder.sh
#!/bin/bash
# 30턴 이상이면 컨텍스트 저장 리마인드
# (구현: 세션 길이 체크 로직)
```

> [!tip] 핵심 가치
> 긴 세션에서 `/ctx-save` 잊지 않도록 자동 알림. 현재 post-commit만 커버하는 부분을 확장.

---

### 5. PreCompact Hook으로 압축 전 컨텍스트 보존

**현재**: 미설정
**제안**: 컨텍스트 압축 직전에 핵심 정보를 자동 저장

```json
{
  "hooks": {
    "PreCompact": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "컨텍스트가 압축됩니다. 현재 작업의 핵심 사항을 MEMORY.md에 기록하세요: 1) 현재 작업 중인 것, 2) 발견한 중요 사항, 3) 다음 단계."
          }
        ]
      }
    ]
  }
}
```

> [!note] 효과
> 장시간 세션에서 압축으로 컨텍스트가 손실되기 전에 핵심 정보를 Auto Memory에 저장. 세션 연속성 보장.

---

### 6. Path-specific Rules (`.claude/rules/`)

**현재**: 미사용
**제안**: 프로젝트별 코드 스타일을 경로 규칙으로 분리

```markdown
<!-- .claude/rules/lua-style.md -->
---
paths:
  - "**/*.lua"
---
# Lua 코드 규칙
- LuaCATS 주석 사용
- busted 테스트 프레임워크
- luacheck 린트 준수
```

```markdown
<!-- .claude/rules/typescript-style.md -->
---
paths:
  - "**/*.ts"
  - "**/*.tsx"
---
# TypeScript 코드 규칙
- fxts/core 유틸리티 우선 (isNil, isString 등)
- 한 줄 패턴 (getter, helper)
- params 객체 패턴
- updateContext 콜백에서 d 사용
```

> [!warning] 적용 범위
> 이 규칙은 각 프로젝트 레포의 `.claude/rules/`에 넣어야 함. dotfiles의 글로벌 설정이 아님.

---

### 7. `showTurnDuration` 활성화 ✅

> 2026-02-19 적용 완료. `settings.json`에 `"showTurnDuration": true` 추가.

---

### 8. `autoUpdatesChannel: "stable"` 설정 ✅

> 2026-02-19 적용 완료. `settings.json`에 `"autoUpdatesChannel": "stable"` 추가.

---

### 9. MCP 서버 확장

**현재**: playwright만 설정됨
**제안**: 업무에 유용한 MCP 서버 추가

```bash
# GitHub (이미 gh CLI 사용 중이지만, MCP로 더 자연스러운 통합)
claude mcp add --transport http github https://api.githubcopilot.com/mcp/

# Notion (문서 관리 연동 시)
claude mcp add --transport http notion https://mcp.notion.com/mcp

# Linear/Jira (이슈 트래킹 사용 시)
claude mcp add --transport http linear https://mcp.linear.app/sse
```

> [!note] 주의
> 이미 gh CLI + hooks로 충분히 커버하고 있으면 불필요. MCP는 도구 수가 늘어나면 컨텍스트 소비가 증가함.

---

### 10. `spinnerTipsOverride` 활용 ✅

> 2026-02-19 적용 완료. `settings.json`에 커스텀 팁 4개 추가 (ctx-update, assignee, plan mode, 디버깅 요약).

---

### 11. Fast Mode 활용 전략

**현재**: 미설정
**제안**: 상황에 따라 토글

```
# 빠른 반복 작업 시
/fast

# 비용 중요한 장시간 작업 시
/fast (끄기)
```

**주의**: Fast Mode는 extra usage로 별도 과금. 세션 중간에 켜면 전체 컨텍스트를 fast 가격으로 재계산.

> [!tip] 권장 시나리오
> - 라이브 디버깅: Fast ON
> - 플랜 모드 설계: Fast OFF (생각 시간이 중요)
> - 리팩토링 반복: Fast ON

---

### 12. Agent Teams — 필요 시 환경 변수로 활성화

**결정**: settings.json에 상시 설정하지 않고, 필요할 때만 환경 변수로 켜기

```bash
# 큰 PR 리뷰, 복잡한 디버깅 시에만
CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 claude
```

**이유**:
- 실험적 기능이라 안정성 미보장
- 각 팀원이 독립 인스턴스 → 토큰 비용 N배
- 일상 작업은 기존 subagent 구조가 더 효율적

**활용 시나리오** (on-demand):
- 대형 PR 리뷰: 보안/성능/테스트 관점 병렬 투입
- 디버깅 가설 경쟁: 여러 가설을 동시에 검증하고 서로 반박
- 대규모 리팩토링: 한쪽이 수정, 다른 쪽이 테스트 검증

**기존 subagent와의 차이**:

| 항목 | Subagents (현재) | Agent Teams (on-demand) |
|------|-----------------|------------------------|
| 방식 | 메인이 지시 → 서브 실행 → 결과 반환 | 독립 인스턴스끼리 소통 |
| 비용 | 낮음 | 높음 (인스턴스 × N) |
| 적합 | 순차 작업, 일반 업무 | 병렬 탐색, 복잡한 리뷰 |

---

## 진행 상황

### 적용 완료 (2026-02-19)
- [x] Auto Memory 채우기 — MEMORY.md 초기 데이터 기록
- [x] `showTurnDuration: true` — 턴 소요시간 표시
- [x] `autoUpdatesChannel: "stable"` — 안정 업데이트 채널
- [x] `spinnerTipsOverride` — 커스텀 리마인더 팁 4개
- [x] Agent Teams 전략 결정 — 상시 X, 필요 시 환경 변수로 활성화

### 미적용 (검토 필요)

| 항목 | 난이도 | 효과 | 비고 |
|------|--------|------|------|
| `opusplan` 모델 | 낮음 | 높음 (비용) | 코딩 품질 차이 체감 후 결정 |
| PreCompact Hook | 중간 | 높음 | 스크립트 작성 필요 |
| Stop Hook 자동 알림 | 중간 | 중간 | 스크립트 작성 필요 |
| Path-specific Rules | 중간 | 높음 | 각 프로젝트 레포에 적용 |
| Fast Mode 전략 | 낮음 | 상황별 | extra usage 과금 |
| MCP 서버 확장 | 중간 | 상황별 | gh CLI로 충분하면 불필요 |
| Effort Level 조정 | 낮음 | 중간 | 기본 high로 충분 |

---

## 적용하지 않아도 되는 것

- **Sandbox 설정**: 개인 개발 환경에서는 불필요한 제약
- **terminalProgressBarEnabled**: Ghostty 터미널 지원 여부 확인 필요
- **prefersReducedMotion**: 개인 취향 (현재 불편함 없으면 불필요)
- **CLAUDE_AUTOCOMPACT_PCT_OVERRIDE**: 기본값(80%)이 대부분 충분
