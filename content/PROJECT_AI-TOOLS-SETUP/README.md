# AI 코딩 도구 설정 통합 관리

> Created: 2026-01-04

## 개요

Claude Code와 OpenCode 설정을 통합 관리하는 프로젝트

## 관리 대상

| 도구 | 설정 경로 | 상세 문서 |
|------|----------|----------|
| **Claude Code** | `~/.dotfiles/claude/` | [[CLAUDE-SETUP]] |
| **OpenCode** | `~/.dotfiles/opencode/` | [[OPENCODE-SETUP]] |

## 설정 구조

```
~/.dotfiles/
├── claude/              # Claude Code 설정
│   ├── CLAUDE.md
│   ├── commands/        # 21개
│   ├── skills/          # 12개
│   ├── agents/          # 3개
│   └── hooks/           # 4개
│
└── opencode/            # OpenCode 설정
    ├── .opencode.json
    ├── AGENTS.md        # ← CLAUDE.md 동기화
    ├── command/         # ← 17개 (주요 커맨드)
    ├── agent/           # ← 3개 (에이전트)
    └── plugin/          # ← hooks.js (훅 대체)
```

## 설정 동기화 현황

| 항목 | Claude → OpenCode | 상태 |
|------|------------------|------|
| 지침 | CLAUDE.md → AGENTS.md | ✅ |
| 커맨드 | commands/ → command/ | ✅ 17개 |
| 에이전트 | agents/ → agent/ | ✅ 3개 |
| 훅 | hooks/ → plugin/ | ✅ |
| 스킬 | skills/ → (없음) | ⚠️ 미지원 |

## 모델 전략

| 용도 | Claude Code | OpenCode |
|------|-------------|----------|
| 메인 코딩 | Claude (구독) | Claude Opus (구독) |
| 에이전트 | Claude Sonnet | Claude Haiku |
| 타이틀 | - | Claude Haiku |

## 문서 구성

| 문서 | 내용 |
|------|------|
| [[CLAUDE-SETUP]] | Claude Code 현재 설정 상세 |
| [[CLAUDE-AGENT-SYSTEM]] | Claude Code 에이전트 시스템 설계 |
| [[OPENCODE-SETUP]] | OpenCode 설정 가이드 |

## 참고 링크

- [claude-workflow-template](https://github.com/Jeong-Jae-Hun/claude-workflow-template) - Claude Code 워크플로우 템플릿
- [OpenCode GitHub](https://github.com/opencode-ai/opencode)
- [OpenCode 공식](https://opencode.ai)

---

#project/ai-tools-setup #topic/productivity
