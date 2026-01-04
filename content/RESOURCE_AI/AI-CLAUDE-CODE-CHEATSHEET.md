# Claude Code 치트시트

> Claude Code 생산성을 높이는 24가지 꿀팁 정리

## 빠른 참조표

| 단축키/명령어 | 설명 |
|--------------|------|
| `!명령어` | 터미널 바로 실행 |
| `Esc Esc` | 이전 상태 되돌리기 |
| `#메모` | 메모리에 바로 저장 |
| `@파일` | 컨텍스트에 파일 추가 |
| `&프롬프트` | 백그라운드 실행 (웹) |
| `Ctrl+S` | 프롬프트 임시 저장 |
| `Ctrl+R` | 이전 프롬프트 검색 |
| `Tab` | 제안된 프롬프트 불러오기 |

## 실행 관련

### `!` 프리픽스 - 터미널 바로 실행
```
!git status
!npm install
!ls -la
```
- 모델 추론 없이 bash 즉시 실행
- 결과가 대화 맥락에 자동 포함
- 대기 시간 & 토큰 절약

### `-p` 옵션 - Headless 모드
```bash
# 스크립트/CI 파이프라인용
claude -p "이 코드 설명해줘" < file.js
git diff | claude -p "변경 내용 요약해줘"
```

### `--dangerously-skip-permissions` - YOLO 모드
```bash
claude --dangerously-skip-permissions
```
- 권한 확인 없이 바로 실행
- **주의**: 자동화/실험 환경에서만 사용

## 세션 관리

### `--continue` / `--resume`
```bash
claude --continue          # 직전 대화 이어가기
claude --resume            # 세션 목록에서 선택
claude --resume api-migration  # 이름으로 바로 불러오기
```

### `/rename` - 세션 이름 지정
```
/rename api-migration
/rename bugfix-auth
```

### `--teleport` - 원격 세션 불러오기
```bash
# 웹에서 & 프리픽스로 시작한 작업을 로컬로
claude --teleport 세션ID
```

## 컨텍스트 & 메모리

### `#` 프리픽스 - 메모리 저장
```
# Always use bun instead of npm
# 테스트는 한글로 작성
# API 응답은 camelCase로 통일
```

### `@` 멘션 - 컨텍스트 추가
```
@src/utils.ts 이 파일 리팩토링해줘
@components/ 디렉터리 구조 분석해줘
```
- 파일, 디렉터리, MCP 서버, 서브에이전트 지원

### `/context` - 토큰 사용 내역 확인
- 시스템 프롬프트, MCP, 메모리 파일 점유량 확인
- 불필요한 요소 정리로 효율적 관리

## 편집 & 네비게이션

### `Esc Esc` - 되돌리기
- 대화 내용만 / 코드만 / 둘 다 선택 가능
- 실험적 시도 후 깔끔하게 롤백

### `/vim` - Vim 모드 편집
```
/vim
```
- `h j k l` 이동
- `ciw`, `dd` 등 기본 명령 지원

### `Ctrl+S` - 프롬프트 임시 저장
- 작성 중인 내용 저장
- 다른 메시지 후에도 자동 복원

### `Ctrl+R` - 이전 프롬프트 검색
- 역방향 검색으로 과거 입력 찾기
- `Enter`: 바로 실행
- `Tab`: 불러와서 수정

## 생각 깊이 조절

### 키워드로 추론 강도 조절
| 키워드 | 강도 | 용도 |
|--------|------|------|
| `think` | 기본 | 일반 작업 |
| `think hard` | 중간 | 복잡한 로직 |
| `ultrathink` | 최대 | 아키텍처 설계 |

### API Extended Thinking
```javascript
{
  thinking: {
    type: "enabled",
    budget_tokens: 5000
  }
}
```

## 자동화 & 커스터마이징

### `/hooks` - 실행 흐름 제어
- 특정 시점에 자동 실행되는 쉘 명령
- 설정: `/hooks` 또는 `.claude/settings.json`
- 용도: 위험 명령 차단, 알림, 규칙 적용

### Agent Skills - 작업 방식 재사용
- 폴더 단위로 작업 방법 저장
- 프로젝트/도구 간 재사용 가능

### `/plugin install` - 설정 공유
```
/plugin install my-setup
```
- 명령어, 에이전트, 스킬, 훅, MCP 한 번에 설치

## 유틸리티 명령어

| 명령어 | 설명 |
|--------|------|
| `/init` | CLAUDE.md 자동 생성 (온보딩 문서) |
| `/export` | 대화 기록 마크다운으로 내보내기 |
| `/stats` | 사용 통계 확인 (잔디처럼) |
| `/statusline` | 하단 상태 바 커스터마이징 |
| `/chrome` | 브라우저 직접 제어 (프론트엔드 디버깅) |

### `/chrome` 활용
- 페이지 이동, 버튼 클릭
- 콘솔 에러 확인, DOM 검사
- "버그 고치고 확인해줘" 한 번에 처리

## 워크플로우 예시

### 새 프로젝트 시작
```
/init                      # 온보딩 문서 생성
# 테스트는 vitest 사용     # 규칙 저장
/rename new-feature        # 세션 이름 지정
```

### 디버깅 흐름
```
@src/api/auth.ts 이 파일 분석해줘
!npm test                  # 테스트 실행
/chrome                    # 브라우저에서 확인
```

### 세션 관리
```
/rename feature-x          # 이름 붙이기
# 작업 중단 후
claude --resume feature-x  # 이어서 작업
/export                    # 완료 후 기록 저장
```

## 참고

- 출처: [@choi.openai](https://www.threads.net/@choi.openai) Threads
- 작성일: 2025-12-25
