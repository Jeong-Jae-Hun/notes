---
tags:
  - type/guide
  - topic/devops
---

# Ghostty 터미널 설정 가이드 (한국인 개발자용)

> 작성일: 2025-12-22

## 개요

Ghostty는 Mitchell Hashimoto(HashiCorp 공동 창업자)가 만든 터미널 에뮬레이터입니다. Zig로 작성되어 빠르고, GPU 가속을 지원하며, macOS에서는 Swift/AppKit을 사용해 네이티브 UI를 제공합니다.

**핵심 특징:**
- GPU 가속으로 빠른 렌더링
- 플랫폼 네이티브 UI (macOS: Swift/AppKit, Linux: GTK4)
- 100개 이상의 내장 테마
- 내장 멀티플렉싱 (tmux 대체 가능)
- 24비트 트루 컬러 지원

## 설정 파일 위치

Ghostty는 다음 순서로 설정 파일을 찾습니다:

```
# 우선순위 1: XDG 설정 (권장)
~/.config/ghostty/config

# 우선순위 2: macOS 전용
~/Library/Application Support/com.mitchellh.ghostty/config
```

> [!tip] 빠른 설정 접근
> - macOS: `Cmd + ,` 로 설정 파일 열기
> - 설정 리로드: `Cmd + Shift + ,`

## 한국어/CJK 폰트 설정

### 문제점

Ghostty는 CJK(중국어, 일본어, 한국어) 폰트 fallback이 완벽하지 않습니다. 별도로 CJK 지원 폰트를 명시해야 한글이 제대로 표시됩니다.

### 권장 설정

```config
# 영문 폰트 (주 폰트)
font-family = "JetBrains Mono" 
# font-family = "Fira Code"
# font-family = "MesloLGS NF"

# 한글 fallback 폰트 (반드시 추가!)
font-family = "D2Coding"
# 또는
# font-family = "Noto Sans CJK KR"

font-size = 14
```

### 한글 코딩 폰트 추천

| 폰트 | 특징 |
|------|------|
| **D2Coding** | 네이버 개발, 한글+영문 조화, 고정폭, 코딩 최적화 |
| **Noto Sans CJK KR** | Google 개발, 범용 CJK 지원 |
| **Sarasa Gothic** | 영문(Iosevka) + CJK 조합, 고정폭 |

> [!important] D2Coding 권장
> 한글과 영문이 2:1 비율로 정확히 맞춰진 고정폭 글꼴은 D2Coding이 유일합니다.

### 폰트 확인 명령어

```bash
# 시스템에 설치된 폰트 목록 확인
ghostty +list-fonts

# 특정 폰트 검색
ghostty +list-fonts | grep -i "d2"
```

## 전체 설정 예시 (현재 적용 중)

```config
# ========================================
# 폰트 설정
# ========================================
font-family = MesloLGS NF
font-family = D2Coding
font-size = 14

# ========================================
# 테마
# ========================================
theme = Catppuccin Mocha

# ========================================
# 쉘 통합
# ========================================
shell-integration = zsh
shell-integration-features = cursor,sudo,title

# ========================================
# 퀵 터미널 (드롭다운)
# ========================================
quick-terminal-position = top
quick-terminal-animation-duration = 200

# ========================================
# 윈도우
# ========================================
window-padding-x = 8
window-padding-y = 8
macos-titlebar-style = tabs
macos-option-as-alt = true

# ========================================
# 동작
# ========================================
copy-on-select = true
scrollback-limit = 100000
cursor-style = block
cursor-style-blink = false

# ========================================
# 키바인딩 - 프롬프트 점프
# ========================================
keybind = ctrl+shift+up=jump_to_prompt:-1
keybind = ctrl+shift+down=jump_to_prompt:1

# ========================================
# 키바인딩 - 퀵 터미널 (글로벌)
# ========================================
keybind = global:ctrl+`=toggle_quick_terminal

# ========================================
# 키바인딩 - 분할 창 이동 (vim 스타일)
# ========================================
keybind = ctrl+h=goto_split:left
keybind = ctrl+j=goto_split:bottom
keybind = ctrl+k=goto_split:top
keybind = ctrl+l=goto_split:right

# ========================================
# 키바인딩 - Shift+Enter 수정 (CSI u 호환)
# ========================================
keybind = shift+enter=text:\n

# ========================================
# 키바인딩 - 외부 에디터 열기
# ========================================
# Cmd+O: 현재 디렉토리를 WebStorm으로 열기
keybind = cmd+o=text:open -a "WebStorm" .\n
# Cmd+Shift+O: 현재 디렉토리를 Obsidian으로 열기
keybind = cmd+shift+o=text:open -a "Obsidian" .\n
```

## 고급 기능

### 퀵 터미널 (드롭다운 터미널)

어디서든 단축키 하나로 터미널을 불러올 수 있는 기능입니다. iTerm2의 핫키 윈도우와 비슷합니다.

```config
quick-terminal-position = top
quick-terminal-animation-duration = 200
keybind = global:ctrl+`=toggle_quick_terminal
```

| 옵션 | 설명 |
|------|------|
| `top` | 화면 위에서 슬라이드 다운 |
| `bottom` | 화면 아래에서 슬라이드 업 |
| `left` / `right` | 좌/우에서 슬라이드 |
| `center` | 화면 중앙에 팝업 |

**사용법:** `Ctrl + `` 누르면 어디서든 터미널 토글

> [!warning] 권한 필요
> 글로벌 단축키는 **시스템 설정 → 개인정보 보호 및 보안 → 손쉬운 사용**에서 Ghostty를 허용해야 작동합니다.

### Shell Integration (쉘 통합)

Ghostty의 핵심 기능입니다. bash, zsh, fish, elvish에 자동 주입됩니다.

```config
shell-integration = zsh
shell-integration-features = cursor,sudo,title
```

| 기능 | 설명 |
|------|------|
| `cursor` | 프롬프트에서 커서 모양 변경 |
| `sudo` | sudo 입력 시 Touch ID 연동 |
| `title` | 현재 명령어를 창 제목에 표시 |

**Shell Integration으로 가능한 것들:**

| 동작 | 방법 |
|------|------|
| 명령어 출력 전체 선택 | `Cmd + 트리플클릭` |
| 커서를 클릭 위치로 이동 | `Option + 클릭` |
| 이전 프롬프트로 점프 | `Ctrl + Shift + ↑` |
| 다음 프롬프트로 점프 | `Ctrl + Shift + ↓` |

### Command Palette (1.2 신기능)

VS Code처럼 모든 기능을 검색해서 실행할 수 있습니다.

```
Cmd + Shift + P
```

### 파일 경로 Cmd+클릭으로 에디터 열기

> [!warning] 미구현 기능 (2025-12 기준)
> 파일 경로 클릭은 아직 Ghostty에서 정식 지원되지 않습니다. URL 클릭만 가능합니다.
> `link` 커스텀 설정도 TODO 상태입니다. 향후 업데이트에서 지원 예정.

**현재 가능한 것:**
- ✅ URL (`https://...`) → `Cmd + 클릭`으로 브라우저에서 열기
- ❌ 파일 경로 (`/path/to/file`) → 미지원

**대안:** 키바인딩으로 현재 디렉토리를 에디터로 열기
```config
keybind = cmd+o=text:open -a "WebStorm" .\n
keybind = cmd+shift+o=text:open -a "Obsidian" .\n
```

#### 확장자별 기본 앱 설정 (duti)

마크다운은 Obsidian, 코드는 WebStorm으로 열리게 하려면 `duti`로 기본 앱을 설정합니다.

```bash
# duti 설치
brew install duti

# 앱 Bundle ID 확인
osascript -e 'id of app "Obsidian"'    # md.obsidian
osascript -e 'id of app "WebStorm"'    # com.jetbrains.WebStorm

# .md → Obsidian
duti -s md.obsidian .md all

# 코드 파일 → WebStorm
duti -s com.jetbrains.WebStorm .js all
duti -s com.jetbrains.WebStorm .ts all
duti -s com.jetbrains.WebStorm .tsx all
duti -s com.jetbrains.WebStorm .jsx all
duti -s com.jetbrains.WebStorm .json all
duti -s com.jetbrains.WebStorm .css all
duti -s com.jetbrains.WebStorm .scss all
duti -s com.jetbrains.WebStorm .vue all
duti -s com.jetbrains.WebStorm .py all
duti -s com.jetbrains.WebStorm .go all
duti -s com.jetbrains.WebStorm .yaml all
duti -s com.jetbrains.WebStorm .yml all

# 설정 확인
duti -x md   # Obsidian
duti -x ts   # WebStorm
```

> [!tip] 다른 에디터 사용 시
> - VS Code: `com.microsoft.VSCode`
> - Cursor: `com.todesktop.230313mzl4w4u92`
> - Sublime Text: `com.sublimetext.4`

### 분할 창 vim 스타일 이동

```config
keybind = ctrl+h=goto_split:left
keybind = ctrl+j=goto_split:bottom
keybind = ctrl+k=goto_split:top
keybind = ctrl+l=goto_split:right
```

hjkl 키로 분할 창 사이를 빠르게 이동할 수 있습니다.

## 유용한 키바인딩

### 기본 단축키 (macOS)

| 단축키 | 기능 |
|--------|------|
| `Cmd + T` | 새 탭 |
| `Cmd + N` | 새 창 |
| `Cmd + D` | 세로 분할 |
| `Cmd + Shift + D` | 가로 분할 |
| `Cmd + [` / `Cmd + ]` | 분할 창 이동 |
| `Cmd + W` | 현재 탭/분할 닫기 |
| `Cmd + ,` | 설정 파일 열기 |
| `Cmd + Shift + ,` | 설정 리로드 |

### 커스텀 키바인딩 예시

```config
# 분할 창 이동 (vim 스타일)
keybind = ctrl+h=goto_split:left
keybind = ctrl+j=goto_split:bottom
keybind = ctrl+k=goto_split:top
keybind = ctrl+l=goto_split:right

# 빠른 분할
keybind = ctrl+a>h=new_split:left
keybind = ctrl+a>j=new_split:down
keybind = ctrl+a>k=new_split:up
keybind = ctrl+a>l=new_split:right

# 분할 창 확대/축소 토글
keybind = ctrl+a>f=toggle_split_zoom
```

## 테마 설정

### 내장 테마 목록 확인

```bash
ghostty +list-themes
```

### 인기 테마

```config
# 어두운 테마
theme = Catppuccin Mocha
theme = dracula
theme = nord
theme = tokyo-night
theme = one-dark

# 밝은 테마
theme = Catppuccin Latte
theme = one-light
```

### 커스텀 색상 설정

```config
# 테마 대신 직접 색상 지정
background = 1e1e2e
foreground = cdd6f4
cursor-color = f5e0dc

# 팔레트 커스터마이징
palette = 0=#45475a
palette = 1=#f38ba8
# ... (0-15까지 지정 가능)
```

## macOS 전용 설정

```config
# 타이틀바 스타일
macos-titlebar-style = tabs
# 옵션: native, transparent, tabs, hidden

# 윈도우 테마
window-theme = auto
# 옵션: auto, system, light, dark, ghostty

# Option 키 동작 (한글 입력 관련)
macos-option-as-alt = true
```

## 유용한 CLI 명령어

```bash
# 폰트 목록
ghostty +list-fonts

# 테마 목록
ghostty +list-themes

# 특정 설정으로 실행
ghostty --font-size=16 --theme=dracula

# 특정 명령어 실행 후 종료
ghostty -e "htop"
```

## 트러블슈팅

### 한글이 깨지거나 크게 표시될 때

1. CJK 폰트를 명시적으로 추가:
```config
font-family = "JetBrains Mono"
font-family = "D2Coding"
```

2. D2Coding 또는 Noto Sans CJK KR 설치 확인:
```bash
ghostty +list-fonts | grep -iE "d2|noto.*cjk"
```

### IME(한글 입력기) 문제

- Ghostty 1.1.0+ 에서 CJK IME 지원이 크게 개선됨
- macOS에서 한영 전환이 안 될 경우 최신 버전으로 업데이트

### Shift+Enter가 `[27;2;13~` 처럼 출력될 때

Ghostty는 기본적으로 CSI u (kitty keyboard protocol)를 사용합니다. 일부 앱(특히 vim, neovim이 아닌 환경)에서 이 프로토콜을 지원하지 않아 raw 이스케이프 시퀀스가 그대로 출력됩니다.

**해결책:** keybind로 Shift+Enter를 일반 줄바꿈으로 매핑

```config
keybind = shift+enter=text:\n
```

> [!tip] 적용 방법
> `Cmd + Shift + ,` 로 설정 리로드하면 즉시 적용됩니다.

### 전역 단축키가 작동하지 않을 때

macOS: **시스템 설정 → 개인정보 보호 및 보안 → 손쉬운 사용**에서 Ghostty 허용

## 참고 자료

- [Ghostty 공식 문서](https://ghostty.org/docs)
- [설정 옵션 레퍼런스](https://ghostty.org/docs/config/reference)
- [Shell Integration](https://ghostty.org/docs/features/shell-integration)
- [GitHub 저장소](https://github.com/ghostty-org/ghostty)
- [D2Coding 폰트](https://github.com/naver/d2codingfont)
- [릴리즈 노트 1.2.0](https://ghostty.org/docs/install/release-notes/1-2-0)
