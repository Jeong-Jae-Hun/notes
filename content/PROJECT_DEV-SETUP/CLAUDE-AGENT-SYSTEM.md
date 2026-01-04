# Claude Code 에이전트 시스템

> Created: 2025-01-01
> 상태: 운영 중

## 개요

Claude Code의 스킬/커맨드를 **에이전트 기반**으로 재구성한 시스템.
복잡한 작업은 에이전트가 처리하고, 단순한 작업은 기존 커맨드/스킬 유지.

## 왜 에이전트인가?

### 기존 방식의 한계

```
/ctx-save 실행
    ↓
204줄 프롬프트가 메인 컨텍스트에 로드
    ↓
토큰 소비, 지식 축적 불가
```

### 에이전트 방식의 장점

```
"context-manager 에이전트로 저장해줘"
    ↓
Task 도구가 별도 컨텍스트에서 에이전트 실행
    ↓
결과만 반환 (토큰 절약)
    ↓
knowledge.md에 새 패턴 축적 (학습!)
```

## 하이브리드 구조

| 유형 | 역할 | 예시 |
|------|------|------|
| **에이전트** | 복잡한 작업 수행 | context-manager, researcher, code-reviewer |
| **커맨드** | 단순 명령어 | git, sync, push |
| **스킬** | 가이드라인 제공 | git-workflow, tech-writing |

### 분류 기준

- **에이전트**: 여러 파일 탐색, 분석 필요, 지식 축적 유용
- **커맨드**: 10줄 이하, 단순 실행
- **스킬**: 작업 방법을 가르침 (실행 X)

## 파일 구조

```
~/.claude/
├── agents/                          # 에이전트 (복잡한 작업)
│   ├── context-manager.md           # 프롬프트
│   ├── context-manager-knowledge.md # 축적된 지식
│   ├── researcher.md
│   ├── researcher-knowledge.md
│   ├── code-reviewer.md
│   └── code-reviewer-knowledge.md
│
├── commands/                        # 커맨드 (단순 작업)
│   ├── git.md
│   ├── ctx-save.md, ctx-resume.md   # 기존 유지 (병행)
│   ├── dot-push.md, dot-sync.md
│   └── ...
│
└── skills/                          # 스킬 (가이드라인)
    ├── git-workflow/
    ├── tech-writing/
    ├── obsidian-para/
    └── ...
```

## 에이전트 상세

### 1. context-manager

**역할**: 옵시디언 컨텍스트 관리 (저장/로드/업데이트)

**파일**:
- `context-manager.md` - 작업 절차, 템플릿
- `context-manager-knowledge.md` - 프로젝트 패턴, 발견된 규칙

**대체하는 커맨드**: `/ctx-save`, `/ctx-resume`, `/ctx-update`

### 2. researcher

**역할**: 기술 조사 및 문서화

**파일**:
- `researcher.md` - 조사 절차, 문서 템플릿
- `researcher-knowledge.md` - 유용한 소스, 이전 조사 기록

**대체하는 스킬**: `quick-research`

### 3. code-reviewer

**역할**: 코드 리뷰

**파일**:
- `code-reviewer.md` - 체크리스트, 코멘트 형식
- `code-reviewer-knowledge.md` - 프로젝트별 규칙, 자주 발견되는 이슈

**대체하는 스킬**: `code-review`

## 사용법

### 에이전트 호출 (자연어)

```
"context-manager 에이전트로 현재 작업 저장해줘"
"researcher 에이전트로 Docker vs Podman 비교해줘"
"code-reviewer 에이전트로 변경 사항 리뷰해줘"
```

### 내부 동작

```
사용자 요청
    ↓
Claude가 Task 도구 호출
    ↓
general-purpose 에이전트가 에이전트 파일 읽기
    ↓
작업 수행 + knowledge 업데이트
    ↓
결과만 반환
```

## 지식 축적 시스템

### knowledge.md 구조

```markdown
# {Agent} Knowledge

## 발견된 패턴
- 프로젝트별 특성
- 자주 반복되는 작업

## 히스토리
| 날짜 | 내용 |
|------|------|
```

### 자동 업데이트

에이전트가 작업하면서 새로운 패턴 발견 시 knowledge.md에 추가.
다음 호출 시 이 지식을 참조하여 더 나은 작업 수행.

## 제한사항

### 커스텀 subagent_type 미지원

```
Task 도구에서 직접 호출 불가:
- subagent_type: "context-manager"  # ❌ 에러

우회 방법:
- subagent_type: "general-purpose"
- prompt: "context-manager.md 파일 읽고 따라해"  # ✅
```

### 기존 커맨드 병행

에이전트 방식이 항상 더 좋은 건 아님.
단순한 작업은 기존 커맨드가 더 빠름.

## 향후 계획

- [ ] 추가 에이전트: weekly-reviewer, obsidian-writer
- [ ] 에이전트 간 협업 패턴 개발
- [ ] knowledge 파일 자동 정리/요약

---

## 관련 링크

- [[_CONTEXT|현재 진행 상황]]
- [Claude Code Agents 공식 문서](https://code.claude.com/docs/en/sub-agents.md)

---

#claude-code #agent #setup
