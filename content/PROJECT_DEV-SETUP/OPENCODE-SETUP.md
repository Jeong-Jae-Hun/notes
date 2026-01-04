# OpenCode 설정 가이드

## 설치

### macOS / Linux

```bash
# 방법 1: 공식 스크립트
curl -fsSL https://opencode.ai/install | bash

# 방법 2: Homebrew
brew install opencode

# 방법 3: npm
npm i -g opencode-ai@latest
```

### Windows

```powershell
# 방법 1: PowerShell 스크립트
irm https://opencode.ai/install.ps1 | iex

# 방법 2: npm (Node.js 필요)
npm i -g opencode-ai@latest

# 방법 3: Scoop
scoop install opencode
```

> [!tip] Windows는 **Windows Terminal + PowerShell 7** 조합 추천

## 제공자 연결

### OpenCode Zen

OpenCode 전용 AI 게이트웨이 서비스

| 항목 | 내용 |
|------|------|
| 과금 | Pay-as-you-go (토큰당) |
| 최소 충전 | $20 + $1.23 수수료 |
| 자동 충전 | 잔액 $5 이하 시 (비활성화 가능) |

**무료 모델 (한시적)**:

| 모델 | 제공자 | 특징 |
|------|--------|------|
| **GLM 4.7** | Zhipu AI | 코딩 특화, SWE-bench 73.8% |
| **Grok Code Fast 1** | xAI | 빠른 속도, 범용성 |
| **MiniMax M2.1** | MiniMax | - |
| **Big Pickle** | - | 스텔스 모델 |

> [!warning] 무료 기간 중 데이터 수집됨 (모델 개선용)

### Claude Pro/Max 연결

```bash
opencode
/connect
# → Anthropic 선택 → OAuth 인증
```

### 모델 선택 가이드

| 상황 | 추천 모델 | 비용 |
|------|----------|------|
| 복잡한 코딩 | Claude Opus | 구독 |
| 일반 코딩 | Claude Sonnet | 구독 |
| 간단한 작업 | GLM 4.7 (무료) | 무료 |
| 빠른 질문 | Grok Code Fast | 무료 |
| 민감한 코드 | Claude (구독) | 구독 |

## 설정 파일

### 위치 (우선순위 순)

1. `./.opencode.json` - 프로젝트 로컬
2. `$XDG_CONFIG_HOME/opencode/.opencode.json` - XDG 표준
3. `$HOME/.opencode.json` - 홈 디렉토리

### 기본 구조

```json
{
  "data": {
    "directory": ".opencode"
  },
  "providers": {
    "anthropic": {
      "disabled": false
    },
    "zen": {
      "disabled": false
    }
  },
  "agents": {
    "coder": {
      "model": "claude-sonnet-4-20250514",
      "maxTokens": 16000
    },
    "task": {
      "model": "zen/glm-4.7",
      "maxTokens": 8000
    },
    "title": {
      "model": "zen/glm-4.7",
      "maxTokens": 80
    }
  },
  "shell": {
    "path": "/bin/zsh",
    "args": ["-l"]
  },
  "autoCompact": true,
  "mcpServers": {},
  "lsp": {}
}
```

## 주요 설정 항목

### providers

AI 제공자별 설정

```json
"providers": {
  "anthropic": { "disabled": false },
  "zen": { "disabled": false },
  "openai": { "apiKey": "...", "disabled": true },
  "google": { "apiKey": "...", "disabled": true }
}
```

### agents

에이전트별 모델 설정

| 에이전트 | 용도 | 추천 모델 |
|----------|------|-----------|
| `coder` | 메인 코딩 | claude-sonnet-4 (구독) |
| `task` | 서브태스크 | zen/glm-4.7 (무료) |
| `title` | 세션 제목 | zen/glm-4.7 (무료) |

### 모델 ID 형식

```
{provider}/{model-name}

예시:
- anthropic/claude-sonnet-4-20250514
- zen/glm-4.7
- zen/grok-code-fast-1
- openai/gpt-4o
```

### shell

명령 실행에 사용할 셸

**macOS / Linux:**
```json
"shell": {
  "path": "/bin/zsh",
  "args": ["-l"]
}
```

**Windows (PowerShell 7):**
```json
"shell": {
  "path": "pwsh.exe",
  "args": ["-NoLogo"]
}
```

**Windows (기본 PowerShell):**
```json
"shell": {
  "path": "powershell.exe",
  "args": ["-NoLogo"]
}
```

### mcpServers

MCP 서버 연결 (Claude Code와 동일 형식)

```json
"mcpServers": {
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path"]
  }
}
```

## 커스텀 커맨드

### 저장 위치

- 글로벌: `~/.config/opencode/command/*.md`
- 프로젝트: `./.opencode/command/*.md`

### 형식

파일명이 커맨드 ID가 됨 (예: `commit.md` → `/commit`)

```markdown
---
description: 커밋 메시지 생성
---

변경사항을 분석하고 커밋 메시지를 생성해주세요.

1. git diff --staged 실행
2. 변경 내용 요약
3. 커밋 메시지 제안
```

## 커스텀 에이전트

### 저장 위치

- 글로벌: `~/.config/opencode/agent/*.md`
- 프로젝트: `./.opencode/agent/*.md`

### 형식

```markdown
---
description: 코드 리뷰 에이전트
mode: subagent
model: zen/glm-4.7
temperature: 0.1
tools:
  write: false
  edit: false
---

코드 리뷰를 수행합니다...
```

## 플러그인

### 저장 위치

- 글로벌: `~/.config/opencode/plugin/*.js`
- 프로젝트: `./.opencode/plugin/*.js`

### 형식

```javascript
export const MyPlugin = async ({ project, directory }) => {
  return {
    "session.created": async () => {
      console.log("세션 시작!")
    },
    "tool.execute.before": async (input) => {
      // 도구 실행 전 처리
    }
  }
}
```

### 주요 이벤트

| 이벤트 | 시점 |
|--------|------|
| `session.created` | 세션 시작 |
| `session.idle` | 세션 유휴 |
| `tool.execute.before` | 도구 실행 전 |
| `tool.execute.after` | 도구 실행 후 |
| `file.edited` | 파일 수정 |

## dotfiles 통합

### 구조

```bash
~/.dotfiles/opencode/
├── .opencode.json
├── AGENTS.md
├── command/
├── agent/
└── plugin/
```

### 심볼링크 설정

**macOS / Linux:**
```bash
ln -sf ~/.dotfiles/opencode/.opencode.json ~/.opencode.json
ln -sf ~/.dotfiles/opencode ~/.config/opencode
```

**Windows (PowerShell 관리자 모드):**
```powershell
# 심볼링크 생성 (관리자 권한 필요)
New-Item -ItemType SymbolicLink -Path "$env:USERPROFILE\.opencode.json" -Target "$env:USERPROFILE\.dotfiles\opencode\.opencode.json"
New-Item -ItemType SymbolicLink -Path "$env:APPDATA\opencode" -Target "$env:USERPROFILE\.dotfiles\opencode"
```

> [!warning] Windows 심볼링크는 **관리자 권한** 또는 **개발자 모드** 필요
> 설정 > 업데이트 및 보안 > 개발자용 > 개발자 모드 활성화

## Claude Code vs OpenCode

| 기능 | Claude Code | OpenCode |
|------|-------------|----------|
| 설정 형식 | Markdown | JSON |
| 스킬 | 지원 | 미지원 |
| 훅 | 지원 | 플러그인 |
| 에이전트 커스텀 | 지원 | 지원 |
| MCP | 지원 | 지원 |
| 다중 제공자 | Anthropic만 | 다양 |
| 무료 모델 | X | O (Zen) |
| 오픈소스 | X | O |

## Windows 전용 설정

### 설정 파일 위치 (Windows)

| 우선순위 | 경로 |
|---------|------|
| 1 | `.\.opencode.json` (프로젝트) |
| 2 | `%APPDATA%\opencode\.opencode.json` |
| 3 | `%USERPROFILE%\.opencode.json` |

### 커맨드/에이전트 위치 (Windows)

```
%APPDATA%\opencode\
├── command\
├── agent\
└── plugin\
```

### Windows 전체 설정 예시

```json
{
  "$schema": "https://opencode.ai/config.json",
  "data": {
    "directory": ".opencode"
  },
  "model": "anthropic/claude-opus-4-20250514",
  "small_model": "anthropic/claude-haiku-3-5-20241022",
  "agents": {
    "coder": {
      "model": "anthropic/claude-opus-4-20250514",
      "maxTokens": 16000
    },
    "task": {
      "model": "anthropic/claude-haiku-3-5-20241022",
      "maxTokens": 8000
    },
    "title": {
      "model": "anthropic/claude-haiku-3-5-20241022",
      "maxTokens": 80
    }
  },
  "shell": {
    "path": "pwsh.exe",
    "args": ["-NoLogo"]
  },
  "autoCompact": true
}
```

### Windows 빠른 설정 스크립트

```powershell
# 1. OpenCode 설치
npm i -g opencode-ai@latest

# 2. 설정 디렉토리 생성
mkdir "$env:APPDATA\opencode\command" -Force
mkdir "$env:APPDATA\opencode\agent" -Force

# 3. 기본 설정 파일 생성
@'
{
  "model": "anthropic/claude-opus-4-20250514",
  "shell": { "path": "pwsh.exe", "args": ["-NoLogo"] },
  "autoCompact": true
}
'@ | Out-File -FilePath "$env:USERPROFILE\.opencode.json" -Encoding UTF8

# 4. 실행
opencode
```

### 크로스 플랫폼 dotfiles 관리

macOS와 Windows에서 같은 dotfiles를 사용할 때:

```bash
# dotfiles 구조
~/.dotfiles/opencode/
├── .opencode.json          # 공통 설정 (shell 제외)
├── .opencode.macos.json    # macOS 전용
├── .opencode.windows.json  # Windows 전용
├── AGENTS.md
├── command/
└── agent/
```

**설정 병합 스크립트 (setup.sh / setup.ps1):**

```bash
# macOS/Linux
cp ~/.dotfiles/opencode/.opencode.json ~/.opencode.json
# shell 설정 병합
```

```powershell
# Windows
Copy-Item "$env:USERPROFILE\.dotfiles\opencode\.opencode.windows.json" "$env:USERPROFILE\.opencode.json"
```

## 참고 링크

- [GitHub](https://github.com/sst/opencode)
- [공식 문서](https://opencode.ai/docs/)
- [OpenCode Zen](https://opencode.ai/zen)
- [플러그인 가이드](https://opencode.ai/docs/plugins/)

---

#topic/opencode #type/guide
