# OpenCode 가이드

> [!info] 정보 출처 표시
> - 공식: 공식 페이지에서 확인된 정보
> - 추측/참고: 일반적인 경험 기반 제안

## 개요

**OpenCode**는 터미널에서 동작하는 오픈소스 AI 코딩 에이전트입니다. Claude Code의 오픈소스 대안으로, 다양한 AI 모델을 선택해서 사용할 수 있습니다.

| 항목 | 내용 |
|------|------|
| 공식 사이트 | https://opencode.ai |
| GitHub | https://github.com/sst/opencode |
| 라이선스 | MIT |
| GitHub Stars | 47,000+ |
| 월간 사용자 | 650,000+ |

## 주요 특징

### 다중 AI 제공자 지원

- **무료 모델 포함**: 별도 API 키 없이 사용 가능
- **75+ 모델 지원**: Claude, GPT, Gemini, Groq, 로컬 모델 등
- **Claude Pro 연동**: Anthropic 계정으로 Pro/Max 플랜 사용 가능

### 핵심 기능

- **TUI 인터페이스**: Bubble Tea 기반 터미널 UI
- **LSP 통합**: 언어별 코드 인텔리전스 자동 로드
- **MCP 지원**: 외부 도구와 표준 프로토콜 연동
- **다중 세션**: 동일 프로젝트에서 병렬 에이전트 실행
- **데이터 프라이버시**: 코드/컨텍스트 저장 안 함

## 설치 방법

```bash
# 공식 스크립트 (권장)
curl -fsSL https://opencode.ai/install | bash

# Homebrew (macOS/Linux)
brew install opencode

# npm
npm i -g opencode-ai@latest

# Go
go install github.com/opencode-ai/opencode@latest
```

## 기본 사용법

```bash
# TUI 시작
opencode

# 비대화형 모드 (단일 프롬프트)
opencode run "이 함수를 리팩토링해줘"

# 헤드리스 서버 시작
opencode serve

# 웹 인터페이스 시작
opencode web
```

### 주요 서브커맨드

| 명령어 | 기능 |
|--------|------|
| `opencode` | TUI 시작 |
| `opencode run [message]` | 비대화형 모드 |
| `opencode serve` | API 서버 시작 |
| `opencode web` | 웹 인터페이스 시작 |
| `opencode agent` | 에이전트 관리 |
| `opencode auth` | 인증 관리 |
| `opencode models` | 사용 가능 모델 표시 |
| `opencode session` | 세션 관리 |
| `opencode stats` | 토큰/비용 통계 |

## Claude Code와 비교

### 기능 비교

| 기능 | OpenCode | Claude Code |
|------|----------|-------------|
| 오픈소스 | ✅ MIT | ❌ |
| 모델 선택 | 75+ 모델 | Claude 전용 |
| 무료 사용 | ✅ 무료 모델 포함 | ❌ API 비용 |
| TUI | ✅ | ✅ |
| MCP | ✅ | ✅ |
| LSP | ✅ | ✅ |

### 호환성 정리

#### 호환되는 것

| 기능 | 설명 |
|------|------|
| **스킬 경로** | `.claude/skills/` 경로 그대로 인식 |
| **MCP 서버** | 동일한 MCP 프로토콜 사용 |
| **기본 도구** | Read, Write, Edit, Bash 동일 |

#### 변환이 필요한 것

| Claude Code | OpenCode |
|-------------|----------|
| `TodoWrite` | `update_plan` |
| `Task` (서브에이전트) | `@mention` |
| `Skill` | `use_skill` |

#### 호환 안 되는 것

| 기능 | 이유 |
|------|------|
| **CLAUDE.md** | OpenCode는 `opencode.json` 사용 |
| **훅 (Hooks)** | Claude 4개 이벤트 vs OpenCode 32개+ |
| **슬래시 커맨드** | 내장 커맨드 체계가 다름 |

## 스킬 마이그레이션

### 스킬 경로

OpenCode는 Claude 스킬 경로를 자동 인식합니다:

```
# Claude 호환 경로 (자동 인식)
.claude/skills/<name>/SKILL.md      # 프로젝트
~/.claude/skills/<name>/SKILL.md    # 전역

# OpenCode 전용 경로
.opencode/skill/<name>/SKILL.md     # 프로젝트
~/.config/opencode/skill/<name>/SKILL.md  # 전역
```

### SKILL.md 형식

```yaml
---
name: my-skill          # 필수
description: 스킬 설명   # 필수 (1-1024자)
license: MIT            # 선택
compatibility:          # 선택
  - claude
  - opencode
---

# 스킬 프롬프트 내용
```

### 이름 규칙

- 1-64자의 소문자 영숫자
- 단일 하이픈 구분자 허용
- 정규식: `^[a-z0-9]+(-[a-z0-9]+)*$`

## 에이전트별 모델 지정

OpenCode의 강력한 기능 중 하나는 **에이전트별로 다른 모델을 지정**할 수 있다는 점입니다.

### opencode.json 설정 예시

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-sonnet-4-5",
  "small_model": "anthropic/claude-haiku-4-5",

  "agent": {
    "code-reviewer": {
      "description": "코드 리뷰 전문",
      "model": "anthropic/claude-haiku-4-5",
      "prompt": "You are a code reviewer...",
      "tools": { "write": false, "edit": false }
    },
    "researcher": {
      "description": "조사 전문 (무료 모델 사용)",
      "model": "groq/llama-4-scout"
    },
    "debugger": {
      "description": "디버깅 전문",
      "model": "openai/gpt-4.1"
    }
  }
}
```

### 모델 ID 형식

```
provider/model-id
```

| Provider | 예시 |
|----------|------|
| Anthropic | `anthropic/claude-sonnet-4-5` |
| OpenAI | `openai/gpt-4.1` |
| Groq (무료) | `groq/llama-4-scout` |
| Google | `google/gemini-2.5-pro` |
| OpenCode Zen | `opencode/gpt-5.1-codex` |

### 기본 동작

- **주 에이전트**: 전역 `model` 설정 사용
- **서브에이전트**: 모델 미지정 시 → 호출한 주 에이전트의 모델 상속
- **small_model**: 제목 생성 등 가벼운 작업용

### 비용 최적화 전략

| 용도 | 권장 모델 | 이유 |
|------|----------|------|
| 메인 코딩 | Claude Opus/Sonnet | 높은 정확도 |
| 코드 리뷰 | Claude Haiku | 빠르고 저렴 |
| 조사/검색 | Groq Llama (무료) | 비용 없음 |
| 디버깅 | GPT-4.1 | 논리적 추론 |

## 마이그레이션 난이도

| 난이도 | 항목 |
|--------|------|
| **쉬움** | 스킬, MCP 서버 |
| **중간** | 에이전트 (도구명 변환 필요) |
| **어려움** | 훅, 커스텀 슬래시 커맨드 |

> [!tip] 상세 가이드
> 단계별 마이그레이션 방법은 [[AI-OPENCODE-MIGRATION|마이그레이션 가이드]] 참조

## 언제 OpenCode를 선택할까?

- Claude 외 다른 모델을 사용하고 싶을 때
- API 비용을 절약하고 싶을 때 (무료 모델 제공)
- 오픈소스 도구를 선호할 때
- 로컬 모델을 사용하고 싶을 때

## 참고 링크

- [OpenCode 공식 사이트](https://opencode.ai)
- [GitHub - sst/opencode](https://github.com/sst/opencode)
- [OpenCode Config 문서](https://opencode.ai/docs/config/)
- [OpenCode Agents 문서](https://opencode.ai/docs/agents/)
- [OpenCode Skills 문서](https://opencode.ai/docs/skills/)
- [Claude Code → OpenCode 마이그레이션 가이드](https://gist.github.com/RichardHightower/827c4b655f894a1dd2d14b15be6a33c0)

---

```yaml
tags:
  - type/guide
  - topic/ai
  - topic/devtools
  - status/active
```
