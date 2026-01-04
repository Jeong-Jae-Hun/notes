# Claude Code → OpenCode 마이그레이션 가이드

> [!info] 정보 출처 표시
> - 공식: 공식 페이지에서 확인된 정보
> - 추측/참고: 일반적인 경험 기반 제안

## 개요

Claude Code에서 OpenCode로 마이그레이션하는 단계별 가이드입니다.

### 왜 마이그레이션하나?

| 이유 | 설명 |
|------|------|
| 비용 절감 | 무료 모델 사용 가능 |
| 모델 자유 | 75+ 모델 선택 가능 |
| 오픈소스 | MIT 라이선스, 커스터마이징 가능 |

## 사전 준비

### 1. OpenCode 설치

```bash
curl -fsSL https://opencode.ai/install | bash
```

### 2. 디렉토리 구조 확인

```
# Claude Code 구조
~/.claude/
├── CLAUDE.md
├── settings.json
└── skills/
    └── my-skill/
        └── SKILL.md

# OpenCode 구조
~/.config/opencode/
├── opencode.json
├── agent/
│   └── my-agent.md
└── skill/
    └── my-skill/
        └── SKILL.md
```

## 마이그레이션 체크리스트

- [ ] OpenCode 설치
- [ ] 기본 설정 파일 생성 (opencode.json)
- [ ] 스킬 마이그레이션
- [ ] 에이전트 마이그레이션
- [ ] MCP 서버 설정
- [ ] 테스트 실행

---

## Step 1: 기본 설정 파일 생성

### opencode.json 생성

```bash
mkdir -p ~/.config/opencode
```

```json
{
  "$schema": "https://opencode.ai/config.json",
  "theme": "opencode",
  "model": "anthropic/claude-sonnet-4-5",
  "small_model": "anthropic/claude-haiku-4-5",
  "autoupdate": true
}
```

### 프로젝트별 설정

프로젝트 루트에 `opencode.json` 생성:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-sonnet-4-5"
}
```

---

## Step 2: 스킬 마이그레이션

### 호환되는 경로

OpenCode는 Claude 스킬 경로를 **자동 인식**합니다:

```
.claude/skills/<name>/SKILL.md  ← 그대로 사용 가능
```

### SKILL.md 형식 확인

```yaml
---
name: my-skill          # 필수 (1-64자, 소문자, 하이픈)
description: 스킬 설명   # 필수 (1-1024자)
license: MIT            # 선택
---

# 스킬 프롬프트 내용
```

### 마이그레이션 작업

```bash
# 기존 스킬 확인
ls ~/.claude/skills/

# OpenCode 전용 경로로 복사 (선택사항)
cp -r ~/.claude/skills/* ~/.config/opencode/skill/
```

> [!tip] 팁
> `.claude/skills/` 경로를 그대로 두면 Claude Code와 OpenCode 모두에서 사용 가능

---

## Step 3: 에이전트 마이그레이션

### Claude Code vs OpenCode 아키텍처

```
Claude Code: User → Claude → Task Agent → 결과
OpenCode:    User → Primary Agent → @subagent → 결과
```

### 도구 이름 변환표

| Claude Code | OpenCode | 설명 |
|-------------|----------|------|
| `TodoWrite` | `update_plan` | 작업 계획 |
| `Task` | `@mention` | 서브에이전트 호출 |
| `Skill` | `use_skill` | 스킬 실행 |
| `Read` | `read` | 파일 읽기 (동일) |
| `Write` | `write` | 파일 쓰기 (동일) |
| `Edit` | `edit` | 파일 수정 (동일) |
| `Bash` | `bash` | 명령 실행 (동일) |

### 에이전트 파일 생성

`~/.config/opencode/agent/code-reviewer.md`:

```yaml
---
description: 코드 리뷰 전문 에이전트
mode: subagent
model: anthropic/claude-haiku-4-5
temperature: 0.3
tools:
  read: true
  write: false
  edit: false
  bash: false
permissions:
  edit: deny
---

# Code Reviewer

You are a code reviewer. Analyze code for:
- Best practices
- Potential bugs
- Performance issues
- Security vulnerabilities

Provide constructive feedback with specific suggestions.
```

### 에이전트 설정 변환 예시

**Claude Code (JSON)**:
```json
{
  "name": "researcher",
  "capabilities": ["web_search", "read"],
  "parameters": {
    "model": "claude-haiku"
  }
}
```

**OpenCode (Markdown)**:
```yaml
---
description: 조사 전문 에이전트
mode: subagent
model: groq/llama-4-scout
tools:
  read: true
  web_search: true
  write: false
permissions:
  bash: deny
---

# Researcher Agent

You are a research specialist...
```

---

## Step 4: MCP 서버 설정

### opencode.json에 MCP 추가

```json
{
  "model": "anthropic/claude-sonnet-4-5",
  "mcp": {
    "playwright": {
      "type": "local",
      "command": ["npx", "@anthropic-ai/mcp-playwright"],
      "enabled": true
    },
    "filesystem": {
      "type": "local",
      "command": ["npx", "@anthropic-ai/mcp-filesystem"],
      "enabled": true
    }
  }
}
```

### MCP 서버 마이그레이션

Claude Code MCP 설정 확인:
```bash
cat ~/.claude/settings.json | grep -A 10 "mcpServers"
```

동일한 MCP 서버를 OpenCode에 추가합니다.

---

## Step 5: 권한 설정

### Claude Code vs OpenCode 권한 모델

| Claude Code | OpenCode |
|-------------|----------|
| 신뢰 기반 (암묵적) | 명시적 제어 |
| 전역 설정 | 에이전트별 세분화 |

### 세밀한 권한 제어

```yaml
permissions:
  bash:
    "rm -rf *": deny       # 위험 명령 차단
    "git push": ask        # 확인 후 실행
    "git diff*": allow     # 자동 허용
  edit: ask                # 파일 수정 시 확인
```

---

## Step 6: 비용 최적화 설정

### 에이전트별 모델 지정

```json
{
  "model": "anthropic/claude-sonnet-4-5",
  "small_model": "anthropic/claude-haiku-4-5",

  "agent": {
    "coder": {
      "description": "메인 코딩",
      "model": "anthropic/claude-sonnet-4-5"
    },
    "reviewer": {
      "description": "코드 리뷰",
      "model": "anthropic/claude-haiku-4-5"
    },
    "researcher": {
      "description": "조사 (무료)",
      "model": "groq/llama-4-scout"
    }
  }
}
```

### 권장 모델 매핑

| 용도 | Claude Code | OpenCode 대안 |
|------|-------------|--------------|
| 메인 작업 | Claude Opus | Claude Opus 또는 Sonnet |
| 서브태스크 | Claude Sonnet | Claude Haiku (저렴) |
| 조사/검색 | - | Groq Llama (무료) |
| 간단한 작업 | - | Gemini Flash (빠름) |

---

## Step 7: 테스트

### 기본 동작 확인

```bash
# OpenCode 실행
opencode

# 사용 가능한 모델 확인
opencode models

# 에이전트 목록 확인
opencode agent list
```

### 스킬 동작 확인

TUI에서:
```
/skill my-skill
```

### 에이전트 호출 확인

TUI에서:
```
@researcher 이 주제에 대해 조사해줘
```

---

## 문제 해결

### 스킬이 인식되지 않음

```bash
# 스킬 경로 확인
ls -la .claude/skills/
ls -la ~/.config/opencode/skill/

# SKILL.md 형식 확인 (YAML frontmatter 필수)
head -20 .claude/skills/my-skill/SKILL.md
```

### 에이전트 모델 오류

```bash
# 사용 가능한 모델 확인
opencode models

# 모델 ID 형식 확인: provider/model-id
# 예: anthropic/claude-sonnet-4-5
```

### MCP 서버 연결 실패

```bash
# MCP 서버 수동 테스트
npx @anthropic-ai/mcp-playwright

# 로그 확인
opencode --debug
```

---

## 호환되지 않는 기능

마이그레이션 불가능한 항목:

| 기능 | 대안 |
|------|------|
| CLAUDE.md | opencode.json으로 재작성 |
| 훅 (Hooks) | OpenCode 이벤트 시스템으로 재작성 |
| 슬래시 커맨드 | OpenCode 커맨드로 재정의 |

---

## 참고 링크

- [OpenCode 공식 문서](https://opencode.ai/docs/)
- [OpenCode Config 문서](https://opencode.ai/docs/config/)
- [OpenCode Agents 문서](https://opencode.ai/docs/agents/)
- [마이그레이션 상세 가이드](https://gist.github.com/RichardHightower/827c4b655f894a1dd2d14b15be6a33c0)

---

```yaml
tags:
  - type/guide
  - topic/ai
  - topic/devtools
  - topic/migration
  - status/active
```
