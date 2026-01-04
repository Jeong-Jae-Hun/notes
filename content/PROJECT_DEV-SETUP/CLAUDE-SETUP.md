---
tags:
  - type/reference
  - topic/ai
  - topic/devops
---

# Claude Code 현재 설정 현황

> Last Updated: 2026-01-04

## 개요

Claude Code 설정을 dotfiles로 관리하여 버전 관리 및 여러 기기 동기화 가능.

## 플랫폼별 경로

### macOS / Linux

```
~/.claude/ → ~/.dotfiles/claude/ (심볼링크)
```

### Windows

```
%USERPROFILE%\.claude\ → %USERPROFILE%\.dotfiles\claude\ (심볼링크)
```

## 구성 요소

### 파일 구조

```
~/.dotfiles/claude/           # macOS: ~/.dotfiles/claude/
                              # Windows: %USERPROFILE%\.dotfiles\claude\
├── CLAUDE.md           # 기본 지침
├── settings.json       # 권한, 훅, MCP
├── skill-rules.json    # 스킬 자동 활성화 규칙
├── commands/           # 21개 커맨드
├── skills/             # 12개 스킬
├── agents/             # 3개 에이전트
└── hooks/              # 4개 훅
```

---

## 커맨드 (18개)

### 컨텍스트 관리

| 커맨드 | 용도 |
|--------|------|
| `/ctx-save` | 현재 작업을 옵시디언에 저장 |
| `/ctx-resume` | 이전 작업 불러오기 |
| `/ctx-update` | 기존 컨텍스트 업데이트 |
| `/ctx-archive` | 완료된 컨텍스트 보관 |

### Git 작업

| 커맨드 | 용도 |
|--------|------|
| `/commit` | 변경사항 커밋 |
| `/pr` | PR 메시지 작성 |
| `/bcp` | 브랜치 생성 + 커밋 + PR |

### 동기화

| 커맨드 | 용도 |
|--------|------|
| `/sync-all` | dotfiles + library 전체 동기화 |
| `/dot-push` | dotfiles 커밋 & 푸시 |
| `/dot-sync` | dotfiles pull |
| `/lib-push` | library(옵시디언) 커밋 & 푸시 |
| `/lib-sync` | library pull |
| `/save-claude` | Claude 설정 커밋 & 푸시 |

### 문서 작성

| 커맨드 | 용도 |
|--------|------|
| `/save-plan` | 계획을 옵시디언에 저장 |
| `/save-note` | 대화 내용을 노트로 저장 |

### 코드 작업

| 커맨드 | 용도 |
|--------|------|
| `/explain` | 코드/파일 설명 |
| `/refactor` | 코드 리팩토링 |
| `/test` | 테스트 코드 작성 |

---

## 스킬 (11개)

### 개발

| 스킬 | 용도 |
|------|------|
| `code-review` | 코드 리뷰 체크리스트 |
| `git-workflow` | Git 컨벤션, gh CLI 가이드 |
| `playwright-qa` | E2E 테스트 가이드 |
| `tech-writing` | 기술 문서 작성 |

### 문서/지식 관리

| 스킬 | 용도 |
|------|------|
| `obsidian-para` | 옵시디언 노트 작성 가이드 |
| `learning-journal` | TIL, 학습 기록 |
| `quick-research` | 빠른 조사 후 저장 |
| `weekly-review` | 주간 회고 생성 |

### 개인/설정

| 스킬 | 용도 |
|------|------|
| `my-writing-style` | 개인 말투로 글쓰기 |
| `dotfiles-management` | dotfiles 관리 가이드 |
| `project-init` | 새 프로젝트 폴더 생성 |

---

## 훅 (5개)

### PreToolUse (Bash)

```
dangerous-command-check.sh
```
- 위험한 명령어 감지 및 경고
- `rm -rf`, `git push --force`, `DROP TABLE` 등

### UserPromptSubmit

```
skill-activation-prompt.sh → skill-activation-prompt.js
```
- 사용자 입력 분석하여 관련 스킬 자동 추천
- `skill-rules.json` 기반으로 키워드/패턴 매칭

### SessionStart

```
session-start-context.sh
```
- 세션 시작 시 현재 디렉토리 분석
- 매칭되는 프로젝트 컨텍스트 추천
- `/ctx-resume` 안내

### PostToolUse (Bash)

```
post-commit-reminder.sh
```
- 커밋 후 컨텍스트 업데이트 알림

---

## MCP 서버 (1개)

| 서버 | 용도 |
|------|------|
| `obsidian-mcp` | 옵시디언 볼트 연동 |

---

## 권한 설정

자동 허용된 경로:
- `~/.claude/skills/**`
- `~/.dotfiles/claude/**`
- 옵시디언 볼트 전체

---

## 평가

### 잘된 점

| 항목 | 설명 |
|------|------|
| **dotfiles 관리** | 버전 관리, 여러 기기 동기화, 백업 |
| **컨텍스트 시스템** | 작업 연속성, 프로젝트별 상태 추적 |
| **스킬 자동 활성화** | 상황에 맞는 가이드 자동 제안 |
| **옵시디언 통합** | 지식 축적, 문서화 습관화 |
| **Single Source of Truth** | git-workflow에 규칙 통합 |

### 개선 가능

| 항목 | 현재 | 개선 방향 |
|------|------|----------|
| MCP 서버 | obsidian만 | 필요시 추가 검토 |
| 프로젝트별 설정 | 없음 | `.claude/settings.local.json` |
| ~~스킬 규칙~~ | ~~8개 스킬만~~ | ✅ 11개 스킬 완료 |

### 불필요해 보이는 것

| 항목 | 이유 |
|------|------|
| github-mcp | gh CLI로 충분 |
| 컨텍스트 템플릿 다양화 | 오버엔지니어링, 현재 구조로 충분 |

---

## 추가 제안 (완료 현황)

### ✅ 1. 스킬 규칙 보완

~~현재 `skill-rules.json`에 8개 스킬만 등록됨. 나머지 3개 추가 가능:~~
- ~~`project-init`~~
- ~~`quick-research`~~
- ~~`weekly-review`~~

**완료** - 11개 스킬 모두 등록

### 2. 프로젝트별 설정

프로젝트 루트에 `.claude/settings.local.json` 생성하여 프로젝트별 규칙 적용

```json
{
  "contextPath": "업무/PROJECT_CI-ME",
  "defaultBranch": "develop"
}
```

### ✅ 3. 자주 쓰는 프롬프트

~~반복되는 요청을 커맨드화:~~
- ~~/explain - 코드 설명 요청~~
- ~~/refactor - 리팩토링 요청~~
- ~~/test - 테스트 작성 요청~~

**완료** - `/explain`, `/refactor`, `/test` 커맨드 생성

### ✅ 4. 훅 확장

- ~~`PreToolUse` - 위험한 명령 경고~~
- `PostToolUse(Write)` - 파일 생성 후 알림 (미완료)

**완료** - `dangerous-command-check.sh` 추가

---

## Windows 설정

### 설치

```powershell
# npm으로 설치
npm install -g @anthropic-ai/claude-code
```

### 설정 파일 위치 (Windows)

| 파일 | 경로 |
|------|------|
| 설정 디렉토리 | `%USERPROFILE%\.claude\` |
| CLAUDE.md | `%USERPROFILE%\.claude\CLAUDE.md` |
| settings.json | `%USERPROFILE%\.claude\settings.json` |
| 커맨드 | `%USERPROFILE%\.claude\commands\` |
| 스킬 | `%USERPROFILE%\.claude\skills\` |
| 훅 | `%USERPROFILE%\.claude\hooks\` |

### 심볼링크 설정 (관리자 PowerShell)

```powershell
$dotfiles = "$env:USERPROFILE\.dotfiles\claude"
$claude = "$env:USERPROFILE\.claude"

# 기존 폴더 백업
if (Test-Path $claude) {
    Move-Item $claude "$claude.backup"
}

# 심볼링크 생성
New-Item -ItemType Directory -Path $claude -Force

# 개별 파일/폴더 링크
New-Item -ItemType SymbolicLink -Path "$claude\CLAUDE.md" -Target "$dotfiles\CLAUDE.md"
New-Item -ItemType SymbolicLink -Path "$claude\settings.json" -Target "$dotfiles\settings.json"
New-Item -ItemType SymbolicLink -Path "$claude\commands" -Target "$dotfiles\commands"
New-Item -ItemType SymbolicLink -Path "$claude\skills" -Target "$dotfiles\skills"
New-Item -ItemType SymbolicLink -Path "$claude\hooks" -Target "$dotfiles\hooks"
```

### Windows 훅 설정

Windows에서는 Shell 스크립트 대신 PowerShell 또는 Node.js 사용:

**settings.json (Windows용)**:
```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "command": ["node", "C:/Users/USER/.claude/hooks/dangerous-command-check.js"]
    }],
    "SessionStart": [{
      "command": ["powershell", "-File", "C:/Users/USER/.claude/hooks/session-start.ps1"]
    }]
  }
}
```

> [!warning] Windows 훅 주의사항
> - 경로에 백슬래시(`\`) 대신 슬래시(`/`) 사용
> - Shell 스크립트(`.sh`)는 작동 안 함 → `.js` 또는 `.ps1` 사용

### 크로스 플랫폼 훅 작성

동일한 훅을 macOS/Windows에서 사용하려면 Node.js로 작성:

```javascript
// hooks/dangerous-command-check.js
const input = JSON.parse(process.argv[2] || '{}');
const command = input.tool_input?.command || '';

const dangerous = [
  /rm\s+-rf\s+[\/~]/,
  /git\s+push\s+.*--force/,
  /DROP\s+TABLE/i
];

if (dangerous.some(pattern => pattern.test(command))) {
  console.log(JSON.stringify({
    decision: "block",
    reason: "위험한 명령어 감지"
  }));
} else {
  console.log(JSON.stringify({ decision: "allow" }));
}
```

---

## 레포지토리

| 레포 | URL |
|------|-----|
| dotfiles | github.com/Jeong-Jae-Hun/dotfiles |
| library | github.com/Jeong-Jae-Hun/library |

---

#project/dev-setup #topic/productivity #type/reference
