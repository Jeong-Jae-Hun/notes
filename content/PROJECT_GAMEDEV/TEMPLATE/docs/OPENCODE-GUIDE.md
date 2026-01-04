# OpenCode 가이드

> AI 어시스턴트를 활용한 개발

---

## OpenCode란?

[OpenCode](https://github.com/opencode-ai/opencode)는 터미널에서 AI 어시스턴트를 사용할 수 있게 해주는 무료 오픈소스 도구입니다.

**특징**:
- 무료 (API 키만 있으면 됨)
- Claude, GPT 등 다양한 모델 지원
- 파일 읽기/쓰기, 명령어 실행 가능
- 프로젝트 컨텍스트 인식

---

## 1. 설치

### 필수 조건

- Node.js 18 이상
- npm 또는 pnpm

### Node.js 설치

**Windows**:
1. [Node.js](https://nodejs.org/) 다운로드
2. LTS 버전 설치

**macOS**:
```bash
brew install node
```

### OpenCode 설치

```bash
# npm으로 설치
npm install -g opencode

# 또는 pnpm
pnpm install -g opencode

# 설치 확인
opencode --version
```

---

## 2. API 키 설정

### Anthropic (Claude) API 키

1. [Anthropic Console](https://console.anthropic.com/) 접속
2. 계정 생성/로그인
3. **API Keys** → **Create Key**
4. 키 복사

### 환경 변수 설정

**macOS / Linux**:
```bash
# ~/.zshrc 또는 ~/.bashrc에 추가
export ANTHROPIC_API_KEY="your-api-key-here"

# 적용
source ~/.zshrc
```

**Windows** (PowerShell):
```powershell
# 시스템 환경 변수에 추가
[Environment]::SetEnvironmentVariable("ANTHROPIC_API_KEY", "your-api-key-here", "User")

# 터미널 재시작
```

---

## 3. 프로젝트에서 사용

### 프로젝트 폴더로 이동

```bash
cd /path/to/your/project
```

### OpenCode 실행

```bash
opencode
```

### 기본 명령어

| 명령어 | 설명 |
|--------|------|
| `/help` | 도움말 |
| `/clear` | 대화 초기화 |
| `/exit` | 종료 |
| `Ctrl+C` | 중단 |

---

## 4. CLAUDE.md 설정

프로젝트 루트에 `.claude/CLAUDE.md` 파일이 있으면 AI가 자동으로 읽습니다.

### 이미 설정됨

이 템플릿에는 이미 `.claude/CLAUDE.md`가 포함되어 있습니다.
필요시 팀 정보, 규칙 등을 수정하세요.

---

## 5. 활용 예시

### 블루프린트 관련

```
"Third Person 템플릿에서 대시 기능 추가하는 방법 알려줘"

"이 블루프린트 스크린샷 보고 뭐가 잘못됐는지 알려줘"

"아이템 수집 시스템 블루프린트 구조 설계해줘"
```

### C++ 관련

```
"이 블루프린트를 C++로 변환해줘"

"UPROPERTY 매크로 종류 설명해줘"

"Replicated 변수 만드는 방법"
```

### 사운드 관련

```
"언리얼에서 3D 사운드 설정하는 방법"

"Sound Cue에서 랜덤 재생 설정"

"거리 기반 볼륨 감쇠 어떻게 해?"
```

### 문제 해결

```
"이 에러 메시지 해결 방법: [에러 내용]"

"빌드가 안 되는데 로그 봐줘"

"멀티플레이어에서 위치 동기화가 안 돼"
```

---

## 6. 팁

### 컨텍스트 활용

AI는 `.claude/CLAUDE.md`와 `docs/_CONTEXT.md`를 읽습니다.
현재 상황을 잘 기록해두면 더 정확한 답변을 받을 수 있어요.

### 스크린샷 활용

블루프린트 문제는 스크린샷을 찍어서 보여주면 좋습니다.

```
"이 블루프린트 봐줘 [스크린샷 경로]"
```

### 점진적 요청

한 번에 다 하지 말고 단계별로:

```
1. "점프 기능 설계해줘"
2. "이제 구현 방법 알려줘"
3. "테스트 방법도"
```

---

## 7. 비용 관리

### API 사용량 확인

[Anthropic Console](https://console.anthropic.com/) → **Usage**

### 비용 절약 팁

1. **작은 모델 사용**: 간단한 질문은 Haiku
2. **명확한 질문**: 추가 질문 줄이기
3. **컨텍스트 정리**: 불필요한 파일 제외

---

## 대안: Claude Code

Anthropic 공식 CLI 도구도 있습니다.

```bash
# 설치
npm install -g @anthropic-ai/claude-code

# 실행
claude
```

유료 플랜 필요하지만 더 안정적입니다.

---

## 문제 해결

### "API key not found"

환경 변수 설정 확인:
```bash
echo $ANTHROPIC_API_KEY
```

### "Rate limit exceeded"

API 사용량 한도 초과. 잠시 기다리거나 플랜 업그레이드.

### 한글 깨짐

터미널 인코딩을 UTF-8로 설정.
