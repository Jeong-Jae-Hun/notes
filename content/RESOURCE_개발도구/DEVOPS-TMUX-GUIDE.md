---
tags:
  - type/guide
  - topic/devops
---

# tmux 가이드 - 터미널 멀티플렉서

> 작성일: 2025-12-22

## tmux란?

tmux(Terminal Multiplexer)는 하나의 터미널 창에서 여러 터미널 세션을 관리할 수 있게 해주는 도구입니다.

## 왜 tmux를 써야 하는가?

### 1. 세션 유지 (가장 큰 장점)

```
SSH 연결 끊김 → 작업 중인 프로세스 계속 실행
터미널 실수로 닫음 → 다시 연결하면 그대로
```

- 장시간 걸리는 작업 (빌드, ML 학습, 배포) 안전하게 실행
- 퇴근 후에도 서버에서 작업 계속 진행
- 나중에 다시 붙어서(attach) 결과 확인

### 2. 화면 분할

```
┌─────────────┬─────────────┐
│   에디터    │    서버     │
│   (vim)     │   (logs)    │
├─────────────┴─────────────┤
│         터미널            │
└───────────────────────────┘
```

- 하나의 SSH 연결로 여러 작업 동시 수행
- 로그 모니터링하면서 코드 수정
- 여러 서버 동시 관리

### 3. 세션/윈도우/패인 구조

```
세션 (Session)
├── 윈도우 1 (Window) ← 탭과 비슷
│   ├── 패인 1 (Pane) ← 분할된 영역
│   └── 패인 2
├── 윈도우 2
│   └── 패인 1
└── 윈도우 3
```

## 설치

```bash
# macOS
brew install tmux

# Ubuntu/Debian
sudo apt install tmux
```

## 기본 사용법

### 세션 관리

```bash
# 새 세션 시작 (이름 지정 권장!)
tmux new -s work

# 세션 목록 보기
tmux ls

# 세션에 다시 붙기
tmux attach -t work
# 또는
tmux a -t work

# 세션 종료
tmux kill-session -t work
```

### Prefix 키

tmux의 모든 단축키는 **Prefix 키**를 먼저 누른 후 실행합니다.

```
기본 Prefix: Ctrl + b
```

> [!tip] Prefix 변경
> 많은 사람들이 `Ctrl + a`로 변경합니다 (손이 더 편함)

### 필수 단축키

| 동작 | 단축키 |
|------|--------|
| **세션** | |
| 세션에서 분리(detach) | `Prefix + d` |
| 세션 목록 | `Prefix + s` |
| **윈도우** | |
| 새 윈도우 | `Prefix + c` |
| 다음 윈도우 | `Prefix + n` |
| 이전 윈도우 | `Prefix + p` |
| 윈도우 번호로 이동 | `Prefix + 0-9` |
| 윈도우 닫기 | `Prefix + &` |
| **패인(분할)** | |
| 세로 분할 | `Prefix + %` |
| 가로 분할 | `Prefix + "` |
| 패인 이동 | `Prefix + 방향키` |
| 패인 닫기 | `Prefix + x` |
| 패인 최대화/복원 | `Prefix + z` |
| 패인 레이아웃 변경 | `Prefix + Space` |
| **기타** | |
| 도움말 | `Prefix + ?` |
| 명령어 모드 | `Prefix + :` |
| 설정 리로드 | `Prefix + r` (설정 필요) |

## 설정 파일 (~/.tmux.conf)

### 기본 추천 설정

```bash
# Prefix를 Ctrl+a로 변경 (선택사항)
# set -g prefix C-a
# unbind C-b
# bind C-a send-prefix

# 마우스 활성화
set -g mouse on

# 인덱스 1부터 시작 (0은 키보드 반대편)
set -g base-index 1
setw -g pane-base-index 1

# 256 컬러 지원
set -g default-terminal "screen-256color"
set -ga terminal-overrides ",xterm-256color:Tc"

# 히스토리 늘리기
set -g history-limit 50000

# ESC 지연 제거 (vim 사용자 필수)
set -sg escape-time 0

# 설정 리로드 단축키
bind r source-file ~/.tmux.conf \; display "Config reloaded!"

# 분할 단축키 개선 (더 직관적)
bind | split-window -h -c "#{pane_current_path}"
bind - split-window -v -c "#{pane_current_path}"

# vim 스타일 패인 이동
bind h select-pane -L
bind j select-pane -D
bind k select-pane -U
bind l select-pane -R

# 패인 크기 조절
bind -r H resize-pane -L 5
bind -r J resize-pane -D 5
bind -r K resize-pane -U 5
bind -r L resize-pane -R 5
```

## 플러그인 (TPM)

### TPM 설치

```bash
git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
```

### ~/.tmux.conf에 추가

```bash
# 플러그인 목록
set -g @plugin 'tmux-plugins/tpm'
set -g @plugin 'tmux-plugins/tmux-sensible'
set -g @plugin 'tmux-plugins/tmux-resurrect'
set -g @plugin 'tmux-plugins/tmux-continuum'
set -g @plugin 'catppuccin/tmux'

# TPM 초기화 (맨 아래에 위치)
run '~/.tmux/plugins/tpm/tpm'
```

### 플러그인 설치

```
Prefix + I  (대문자 I)
```

### 추천 플러그인

| 플러그인 | 설명 |
|----------|------|
| **tmux-sensible** | 합리적인 기본 설정 |
| **tmux-resurrect** | 재부팅 후 세션 복원 |
| **tmux-continuum** | 자동 저장/복원 |
| **tmux-yank** | 시스템 클립보드 복사 |
| **catppuccin/tmux** | 예쁜 테마 |
| **vim-tmux-navigator** | vim과 패인 이동 통합 |

## Oh My Tmux (원클릭 설정)

설정이 귀찮다면 Oh My Tmux를 추천합니다.

```bash
cd ~
git clone https://github.com/gpakosz/.tmux.git
ln -s -f .tmux/.tmux.conf
cp .tmux/.tmux.conf.local .
```

**특징:**
- Powerline 스타일 상태바
- vim 스타일 키바인딩
- 듀얼 Prefix (Ctrl+a, Ctrl+b)
- TPM 내장

> [!warning] 주의
> Oh My Tmux 사용 시 TPM 관련 설정을 직접 추가하면 안 됩니다 (이미 내장됨)

## Ghostty + tmux 연동

### Ghostty 설정 추가

```config
# ~/.config/ghostty/config 또는
# ~/Library/Application Support/com.mitchellh.ghostty/config

# tmux 자동 시작 (선택사항)
# command = tmux new-session -A -s main

# tmux prefix 전송 키바인딩
keybind = cmd+1=text:\x021
keybind = cmd+2=text:\x022
keybind = cmd+3=text:\x023
keybind = cmd+s=text:\x02s
keybind = cmd+z=text:\x02z
```

> [!note] 참고
> `\x02`는 Ctrl+b (기본 Prefix)의 hex 코드입니다.
> Prefix를 Ctrl+a로 바꿨다면 `\x01`을 사용하세요.

## 실전 워크플로우 예시

### 개발 작업

```bash
# 프로젝트별 세션 생성
tmux new -s my-project

# 윈도우 구성
# 윈도우 1: 에디터 (vim/nvim)
# 윈도우 2: 서버 실행
# 윈도우 3: git 작업
# 윈도우 4: 기타 터미널
```

### 서버 관리

```bash
# 서버 세션
tmux new -s server

# 패인 분할
# 상단: htop (모니터링)
# 하단 좌: 로그 tail
# 하단 우: 명령어 실행
```

### 퇴근 전

```bash
# 세션에서 분리 (작업은 계속 실행됨)
Prefix + d

# 또는 그냥 터미널 닫아도 됨
```

### 다음날 출근

```bash
# 어제 작업 그대로 복원
tmux attach -t my-project
```

## 자주 쓰는 명령어 정리

```bash
# 세션
tmux new -s name          # 새 세션 (이름 지정)
tmux ls                   # 세션 목록
tmux a -t name            # 세션 붙기
tmux kill-session -t name # 세션 종료
tmux kill-server          # 모든 세션 종료

# 윈도우 (Prefix + ...)
c  # 새 윈도우
n  # 다음 윈도우
p  # 이전 윈도우
,  # 윈도우 이름 변경
&  # 윈도우 닫기

# 패인 (Prefix + ...)
%  # 세로 분할
"  # 가로 분할
x  # 패인 닫기
z  # 최대화 토글
{  # 패인 위치 바꾸기 (왼쪽)
}  # 패인 위치 바꾸기 (오른쪽)
```

## 참고 자료

- [tmux GitHub Wiki](https://github.com/tmux/tmux/wiki)
- [tmux Cheat Sheet](https://tmuxcheatsheet.com/)
- [TPM - Tmux Plugin Manager](https://github.com/tmux-plugins/tpm)
- [Oh My Tmux](https://github.com/gpakosz/.tmux)
- [Awesome Tmux](https://github.com/rothgar/awesome-tmux)
- [Red Hat - tmux 초보자 가이드](https://www.redhat.com/en/blog/introduction-tmux-linux)
