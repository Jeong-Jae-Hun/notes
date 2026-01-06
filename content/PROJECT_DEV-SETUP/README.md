# 개발 환경 설정 (DEV-SETUP)

> Created: 2026-01-04

## 개요

개발 환경 전체를 dotfiles로 통합 관리하는 프로젝트

- **dotfiles**: Shell, Git, SSH, 터미널
- **Claude Code**: AI 코딩 어시스턴트
- **OpenCode**: 오픈소스 AI 코딩 도구

## 플랫폼 지원

| 플랫폼 | Shell | 터미널 | 상태 |
|--------|-------|--------|------|
| **macOS** | zsh | Ghostty | ✅ 메인 |
| **Windows** | PowerShell 7 | Windows Terminal | ✅ 지원 |
| **Linux** | zsh/bash | - | ⚠️ 미테스트 |

## 저장소 구조

```
~/.dotfiles/                    # Git 관리
├── .zshrc                      # Zsh 설정 (macOS)
├── .gitconfig                  # Git 전역 설정
├── config/
│   ├── ghostty/                # Ghostty (macOS)
│   └── windows-terminal/       # Windows Terminal
├── ssh/
│   └── config                  # SSH 호스트
├── claude/                     # Claude Code
│   ├── CLAUDE.md
│   ├── commands/               # 21개
│   ├── skills/                 # 12개
│   ├── agents/                 # 3개
│   └── hooks/                  # 4개
├── opencode/                   # OpenCode
│   ├── .opencode.json
│   ├── AGENTS.md
│   ├── command/                # 17개
│   └── agent/                  # 3개
├── powershell/                 # PowerShell (Windows)
│   └── profile.ps1
├── Brewfile                    # Homebrew (macOS)
├── install.sh                  # macOS 설치
├── install.ps1                 # Windows 설치
├── link.sh                     # macOS 심볼링크
└── link.ps1                    # Windows 심볼링크
```

## 빠른 시작

### macOS

```bash
# 새 맥북 설정
git clone git@github.com:USERNAME/dotfiles.git ~/.dotfiles
cd ~/.dotfiles && ./install.sh

# 기존 맥북 연결
cd ~/.dotfiles && ./link.sh
```

### Windows (관리자 PowerShell)

```powershell
# 새 PC 설정
git clone git@github.com:USERNAME/dotfiles.git $env:USERPROFILE\.dotfiles
cd $env:USERPROFILE\.dotfiles; .\install.ps1

# 기존 PC 연결
cd $env:USERPROFILE\.dotfiles; .\link.ps1
```

## 문서 구성

| 문서 | 내용 |
|------|------|
| [[_CONTEXT]] | 프로젝트 현황 및 변경 이력 |
| [[DOTFILES-SETUP]] | dotfiles 설치/관리 (macOS + Windows) |
| [[CLAUDE-SETUP]] | Claude Code 설정 상세 |
| [[CLAUDE-AGENT-SYSTEM]] | Claude Code 에이전트 시스템 |
| [[OPENCODE-SETUP]] | OpenCode 설정 가이드 |
| [[OPENCODE-WORKFLOW]] | OpenCode 워크플로우 가이드 |

## 일상 사용

```bash
# macOS - 설정 동기화
dotpush   # 커밋 & 푸시
dotsync   # 풀

# OpenCode 실행
opencode
/models   # 모델 변경 (Opus ↔ Haiku)
```

## 참고 링크

- [dotfiles 레포](https://github.com/Jeong-Jae-Hun/dotfiles)
- [OpenCode 공식](https://opencode.ai)

## 템플릿 레포

새 환경 설정 시 사용할 수 있는 템플릿:

| 템플릿 | 용도 |
|--------|------|
| [dev-setup-template](https://github.com/Jeong-Jae-Hun/dev-setup-template) | dotfiles + Claude + OpenCode |
| [note-template](https://github.com/Jeong-Jae-Hun/note-template) | Obsidian PARA + 컨텍스트 시스템 |

---

#project/dev-setup #topic/productivity
