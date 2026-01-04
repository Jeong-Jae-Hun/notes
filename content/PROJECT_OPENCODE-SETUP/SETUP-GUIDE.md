# OpenCode 설정 가이드

## 설치

```bash
# 방법 1: 공식 스크립트
curl -fsSL https://opencode.ai/install | bash

# 방법 2: Homebrew
brew install opencode

# 방법 3: npm
npm i -g opencode-ai@latest
```

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
      "apiKey": "${ANTHROPIC_API_KEY}",
      "disabled": false
    },
    "openai": {
      "apiKey": "${OPENAI_API_KEY}",
      "disabled": true
    }
  },
  "agents": {
    "coder": {
      "model": "claude-sonnet-4-20250514",
      "maxTokens": 16000
    },
    "task": {
      "model": "claude-sonnet-4-20250514",
      "maxTokens": 8000
    },
    "title": {
      "model": "claude-haiku-3-5-20241022",
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

AI 제공자별 API 키 및 활성화 설정

```json
"providers": {
  "anthropic": { "apiKey": "...", "disabled": false },
  "openai": { "apiKey": "...", "disabled": true },
  "google": { "apiKey": "...", "disabled": true },
  "groq": { "apiKey": "...", "disabled": true }
}
```

### agents

에이전트별 모델 및 토큰 설정

| 에이전트 | 용도 | 권장 모델 |
|----------|------|-----------|
| `coder` | 메인 코딩 에이전트 | claude-sonnet-4 |
| `task` | 서브태스크 처리 | claude-sonnet-4 |
| `title` | 세션 제목 생성 | claude-haiku |

### shell

명령 실행에 사용할 셸

```json
"shell": {
  "path": "/bin/zsh",
  "args": ["-l"]
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

- 글로벌: `~/.config/opencode/commands/*.md`
- 프로젝트: `./.opencode/commands/*.md`

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

## dotfiles 통합

### 구조

```bash
~/.dotfiles/opencode/
├── .opencode.json
└── commands/
    ├── commit.md
    └── review.md
```

### 심볼링크 설정

```bash
# 디렉토리 생성
mkdir -p ~/.dotfiles/opencode/commands

# 설정 파일 이동
mv ~/.opencode.json ~/.dotfiles/opencode/

# 심볼링크 생성
ln -sf ~/.dotfiles/opencode/.opencode.json ~/.opencode.json
ln -sf ~/.dotfiles/opencode ~/.config/opencode
```

## Claude Code와의 차이점

| 기능 | Claude Code | OpenCode |
|------|-------------|----------|
| 설정 형식 | Markdown (CLAUDE.md) | JSON (.opencode.json) |
| 스킬 | 지원 | 미지원 |
| 훅 | 지원 | 미지원 |
| 에이전트 커스텀 | 지원 | 제한적 |
| MCP | 지원 | 지원 |
| 다중 모델 제공자 | Anthropic만 | 다양한 제공자 |
| 오픈소스 | X | O |

## 참고 링크

- [GitHub](https://github.com/opencode-ai/opencode)
- [공식 문서](https://opencode.ai/docs/)
- [CLI 레퍼런스](https://opencode.ai/docs/cli/)

---

#topic/opencode #type/guide
