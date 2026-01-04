# OpenCode 워크플로우 가이드

> Created: 2026-01-04

## 개요

OpenCode를 활용한 일상 개발 워크플로우 가이드

## 기본 워크플로우

### 1. 세션 시작

```bash
cd /path/to/project
opencode
```

> [!note] Claude Code와 달리 자동 컨텍스트 표시 없음 → `/ctx-resume` 수동 실행

### 2. 프로젝트 초기화 (최초 1회)

```
/init
```

프로젝트 구조 분석 후 `AGENTS.md` 자동 생성

### 3. 컨텍스트 재개

```
/ctx-resume
```

이전 작업 컨텍스트 로드

## 작업 모드

### Plan 모드 (Tab 전환)

복잡한 기능 구현 전 계획 수립

```
[Tab으로 Plan 모드 전환]
> 사용자 인증 시스템을 추가하고 싶어.
> JWT 기반으로 구현하고 리프레시 토큰도 필요해.
```

AI가 구현 계획을 제시 → 피드백 후 수정

### Build 모드 (Tab 전환)

계획 확정 후 실제 구현

```
[Tab으로 Build 모드 전환]
> 위 계획대로 구현해줘
```

### 일반 모드

질문, 간단한 수정, 코드 설명 등

```
> @src/auth.ts 이 파일이 하는 일 설명해줘
> 이 함수에 에러 핸들링 추가해줘
```

## 주요 명령어

### 내장 명령어

| 명령어 | 설명 |
|--------|------|
| `/init` | 프로젝트 초기화, AGENTS.md 생성 |
| `/undo` | 마지막 변경사항 취소 |
| `/redo` | 취소한 변경사항 복구 |
| `/share` | 대화 공유 링크 생성 |
| `/help` | 도움말 |
| `/connect` | AI 제공자 연결 |
| `/models` | 모델 목록/변경 |

### 커스텀 명령어 (설정됨)

| 명령어 | 설명 |
|--------|------|
| `/git` | Git 워크플로우 (커밋, PR 등) |
| `/ctx-save` | 컨텍스트 저장 |
| `/ctx-resume` | 컨텍스트 재개 |
| `/ctx-update` | 컨텍스트 업데이트 |
| `/do` | TODO 관리 |
| `/code-explain` | 코드 설명 |
| `/code-refactor` | 코드 리팩토링 |
| `/code-test` | 테스트 작성 |

## 파일 참조

### @ 멘션

`@` 입력 후 파일명 검색으로 컨텍스트에 파일 추가

```
> @package.json 이 프로젝트의 의존성 분석해줘
> @src/components/ 이 폴더의 컴포넌트 구조 설명해줘
```

### 명령어 내 파일 참조

커스텀 명령어에서 파일 내용 포함

```markdown
# 커맨드 정의
현재 브랜치 상태:
!`git status`

파일 내용:
@src/main.ts
```

## 에이전트 활용

### 에이전트 호출

```
@context-manager 이전 컨텍스트 불러와줘
@researcher GraphQL vs REST 비교해줘
@code-reviewer 이 PR 리뷰해줘
```

### 설정된 에이전트

| 에이전트 | 용도 | 모델 |
|----------|------|------|
| `context-manager` | 컨텍스트 관리 | GLM 4.7 (무료) |
| `researcher` | 기술 조사 | GLM 4.7 (무료) |
| `code-reviewer` | 코드 리뷰 | GLM 4.7 (무료) |

## 일반적인 작업 흐름

### 버그 수정

```
1. /ctx-resume (이전 작업 재개)
2. > @src/buggy-file.ts 이 파일에서 null 에러가 발생해
3. AI가 분석 후 수정 제안
4. 승인 후 적용
5. /git (커밋)
6. /ctx-update (컨텍스트 저장)
```

### 새 기능 개발

```
1. [Tab] Plan 모드
2. > 새 기능 요구사항 설명
3. 계획 검토 및 피드백
4. [Tab] Build 모드
5. > 구현 시작
6. 단계별 구현 확인
7. /git (커밋)
8. /ctx-save (새 컨텍스트 저장)
```

### 코드 리뷰

```
1. @code-reviewer PR #123 리뷰해줘
2. 또는: > @src/feature.ts 이 코드 리뷰해줘
3. 피드백 확인 및 수정
```

## Claude Code와의 차이점

| 기능 | Claude Code | OpenCode |
|------|-------------|----------|
| 모드 전환 | 없음 | Tab (Plan/Build) |
| 파일 참조 | 자동 | @멘션 |
| 스킬 | 지원 | 미지원 (커맨드로 대체) |
| 훅 | 지원 | 플러그인 |
| TUI | 없음 | 있음 |
| 오픈소스 | X | O |

## 팁

### 효율적인 사용

1. **Plan 먼저**: 복잡한 작업은 Plan 모드로 계획 수립
2. **파일 멘션**: 관련 파일을 @로 명시하면 정확도 향상
3. **단계별 진행**: 큰 작업은 작은 단계로 나눠 진행
4. **컨텍스트 저장**: 작업 종료 전 `/ctx-save` 습관화

### 모델 선택

**유료 (Claude 구독)**:
- **복잡한 코딩**: Claude Opus
- **일반 코딩**: Claude Sonnet
- **민감한 코드**: Claude (데이터 수집 없음)

**무료 (OpenCode Zen)**:
- **간단한 코딩**: GLM 4.7 (코딩 특화, SWE-bench 73.8%)
- **빠른 질문**: Grok Code Fast 1
- **에이전트**: GLM 4.7 (비용 절감)

```
# 모델 변경
/models
# → zen/glm-4.7 또는 zen/grok-code-fast-1 선택
```

> [!warning] 무료 모델은 한시적이며, 데이터 수집됨 (모델 개선용)

## 설정 경로

```bash
~/.dotfiles/opencode/
├── .opencode.json      # 글로벌 설정
├── AGENTS.md           # 지침
├── command/            # 커스텀 명령어
├── agent/              # 커스텀 에이전트
└── plugin/hooks.js     # 플러그인
```

## 참고

- [OpenCode 공식 문서](https://opencode.ai/docs/)
- [플러그인 가이드](https://opencode.ai/docs/plugins/)
- [명령어 레퍼런스](https://opencode.ai/docs/commands)

---

#topic/opencode #type/workflow
