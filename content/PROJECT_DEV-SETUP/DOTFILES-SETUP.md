# Dotfiles 설정 가이드

> 개발 환경 + AI 코딩 도구 통합 관리

## 개요

dotfiles로 관리하는 설정:

| 카테고리 | macOS | Windows |
|----------|-------|---------|
| Shell | zsh | PowerShell 7 |
| Git | .gitconfig | .gitconfig |
| SSH | ssh/config | ssh/config |
| 터미널 | Ghostty | Windows Terminal |
| Claude Code | claude/ | claude/ |
| OpenCode | opencode/ | opencode/ |

## 저장소 구조

```
~/.dotfiles/                    # macOS: $HOME/.dotfiles
                                # Windows: %USERPROFILE%\.dotfiles
├── .zshrc                      # Zsh 설정 (macOS)
├── .zprofile                   # Zsh 프로필 (macOS)
├── .gitconfig                  # Git 전역 설정
├── config/
│   ├── ghostty/                # Ghostty 터미널 (macOS)
│   └── windows-terminal/       # Windows Terminal (Windows)
├── ssh/
│   └── config                  # SSH 호스트 설정
├── claude/                     # Claude Code 설정
│   ├── CLAUDE.md
│   ├── settings.json
│   ├── commands/
│   ├── skills/
│   └── hooks/
├── opencode/                   # OpenCode 설정
│   ├── .opencode.json
│   ├── AGENTS.md
│   ├── command/
│   └── agent/
├── powershell/                 # PowerShell 프로필 (Windows)
│   └── profile.ps1
├── Brewfile                    # Homebrew 앱 목록 (macOS)
├── install.sh                  # macOS 설치 스크립트
├── install.ps1                 # Windows 설치 스크립트
├── link.sh                     # macOS 심볼링크 스크립트
└── link.ps1                    # Windows 심볼링크 스크립트
```

---

## macOS 설정

### 새 맥북 초기 설정

```bash
# 1. Xcode Command Line Tools 설치
xcode-select --install

# 2. dotfiles 클론
git clone git@github.com:USERNAME/dotfiles.git ~/.dotfiles

# 3. 전체 설치 (Homebrew + 앱 + 심볼링크)
cd ~/.dotfiles
chmod +x install.sh
./install.sh

# 4. 쉘 재시작
exec $SHELL
```

### 기존 맥북에서 연결

```bash
# dotfiles만 연결 (Homebrew 건드리지 않음)
git clone git@github.com:USERNAME/dotfiles.git ~/.dotfiles
cd ~/.dotfiles
chmod +x link.sh
./link.sh
```

### 심볼링크 매핑 (macOS)

| 소스 | 대상 |
|------|------|
| `~/.dotfiles/.zshrc` | `~/.zshrc` |
| `~/.dotfiles/.zprofile` | `~/.zprofile` |
| `~/.dotfiles/.gitconfig` | `~/.gitconfig` |
| `~/.dotfiles/ssh/config` | `~/.ssh/config` |
| `~/.dotfiles/config/ghostty` | `~/Library/Application Support/com.mitchellh.ghostty/config` |
| `~/.dotfiles/claude/` | `~/.claude/` (각 파일/폴더) |
| `~/.dotfiles/opencode/.opencode.json` | `~/.opencode.json` |
| `~/.dotfiles/opencode/` | `~/.config/opencode/` |

---

## Windows 설정

### 사전 준비

1. **개발자 모드 활성화** (심볼링크용)
   - 설정 > 업데이트 및 보안 > 개발자용 > 개발자 모드 ON

2. **PowerShell 7 설치**
   ```powershell
   winget install Microsoft.PowerShell
   ```

3. **Git 설치**
   ```powershell
   winget install Git.Git
   ```

4. **Windows Terminal 설치** (권장)
   ```powershell
   winget install Microsoft.WindowsTerminal
   ```

### Git 초기 설정 (Windows)

```powershell
# 사용자 정보 설정
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 줄바꿈 설정 (Windows 필수)
git config --global core.autocrlf true

# 기본 브랜치 이름
git config --global init.defaultBranch main

# 에디터 설정 (VS Code)
git config --global core.editor "code --wait"

# Credential Manager 설정 (비밀번호 저장)
git config --global credential.helper manager

# 확인
git config --global --list
```

### SSH 키 생성 (Windows)

```powershell
# SSH 키 생성
ssh-keygen -t ed25519 -C "your.email@example.com"

# SSH 에이전트 시작 (PowerShell 관리자)
Get-Service ssh-agent | Set-Service -StartupType Automatic
Start-Service ssh-agent

# 키 추가
ssh-add $env:USERPROFILE\.ssh\id_ed25519

# 공개키 복사 (GitHub에 등록)
Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub | Set-Clipboard
# → GitHub > Settings > SSH Keys > New SSH Key

# 연결 테스트
ssh -T git@github.com
```

### 새 PC 초기 설정

```powershell
# 1. dotfiles 클론
git clone git@github.com:USERNAME/dotfiles.git $env:USERPROFILE\.dotfiles

# 2. 설치 스크립트 실행 (관리자 PowerShell)
cd $env:USERPROFILE\.dotfiles
.\install.ps1
```

### 기존 PC에서 연결

```powershell
# 심볼링크만 설정 (관리자 PowerShell)
cd $env:USERPROFILE\.dotfiles
.\link.ps1
```

### 심볼링크 매핑 (Windows)

| 소스 | 대상 |
|------|------|
| `.dotfiles\.gitconfig` | `%USERPROFILE%\.gitconfig` |
| `.dotfiles\ssh\config` | `%USERPROFILE%\.ssh\config` |
| `.dotfiles\powershell\profile.ps1` | `$PROFILE` |
| `.dotfiles\claude\` | `%USERPROFILE%\.claude\` |
| `.dotfiles\opencode\.opencode.json` | `%USERPROFILE%\.opencode.json` |
| `.dotfiles\opencode\` | `%APPDATA%\opencode\` |

### Windows 설치 스크립트 (install.ps1)

```powershell
# install.ps1
$ErrorActionPreference = "Stop"
$DotfilesDir = "$env:USERPROFILE\.dotfiles"

Write-Host "`n=== Dotfiles 설치 (Windows) ===" -ForegroundColor Cyan

# 1. 필수 도구 설치
Write-Host "`n[1/4] 필수 도구 확인" -ForegroundColor Yellow

$tools = @(
    @{ Name = "Git"; WingetId = "Git.Git" },
    @{ Name = "PowerShell 7"; WingetId = "Microsoft.PowerShell" },
    @{ Name = "Windows Terminal"; WingetId = "Microsoft.WindowsTerminal" },
    @{ Name = "Visual Studio Code"; WingetId = "Microsoft.VisualStudioCode" }
)

foreach ($tool in $tools) {
    $installed = winget list --id $tool.WingetId 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  [INSTALL] $($tool.Name)" -ForegroundColor Green
        winget install $tool.WingetId --accept-package-agreements --accept-source-agreements
    } else {
        Write-Host "  [SKIP] $($tool.Name) (이미 설치됨)" -ForegroundColor DarkGray
    }
}

# 2. Node.js 설치 (OpenCode용)
Write-Host "`n[2/4] Node.js 확인" -ForegroundColor Yellow
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "  [INSTALL] Node.js" -ForegroundColor Green
    winget install OpenJS.NodeJS.LTS
} else {
    Write-Host "  [SKIP] Node.js (이미 설치됨)" -ForegroundColor DarkGray
}

# 3. AI 도구 설치
Write-Host "`n[3/4] AI 코딩 도구 설치" -ForegroundColor Yellow

# Claude Code
if (-not (Get-Command claude -ErrorAction SilentlyContinue)) {
    Write-Host "  [INSTALL] Claude Code" -ForegroundColor Green
    npm install -g @anthropic-ai/claude-code
} else {
    Write-Host "  [SKIP] Claude Code (이미 설치됨)" -ForegroundColor DarkGray
}

# OpenCode
if (-not (Get-Command opencode -ErrorAction SilentlyContinue)) {
    Write-Host "  [INSTALL] OpenCode" -ForegroundColor Green
    npm install -g opencode-ai@latest
} else {
    Write-Host "  [SKIP] OpenCode (이미 설치됨)" -ForegroundColor DarkGray
}

# 4. 심볼링크 설정
Write-Host "`n[4/4] 심볼링크 설정" -ForegroundColor Yellow
& "$DotfilesDir\link.ps1"

Write-Host "`n=== 설치 완료! ===" -ForegroundColor Green
Write-Host "PowerShell 재시작 후 사용하세요." -ForegroundColor Cyan
```

### Windows 심볼링크 스크립트 (link.ps1)

```powershell
# link.ps1
$ErrorActionPreference = "Stop"
$DotfilesDir = "$env:USERPROFILE\.dotfiles"

# 관리자 권한 확인
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "[ERROR] 관리자 권한으로 실행하세요!" -ForegroundColor Red
    Write-Host "  Right-click PowerShell > Run as Administrator" -ForegroundColor Yellow
    exit 1
}

function New-SafeLink {
    param(
        [string]$Source,
        [string]$Target,
        [string]$Name,
        [switch]$IsDirectory
    )

    if (-not (Test-Path $Source)) {
        Write-Host "  [WARN] $Name : 소스 없음" -ForegroundColor Yellow
        return
    }

    # 이미 올바른 링크인 경우
    if (Test-Path $Target) {
        $item = Get-Item $Target -Force
        if ($item.LinkType -eq "SymbolicLink") {
            $currentTarget = $item.Target
            if ($currentTarget -eq $Source) {
                Write-Host "  [SKIP] $Name (이미 링크됨)" -ForegroundColor DarkGray
                return
            }
        }
        # 기존 파일 백업
        $backup = "$Target.backup"
        Move-Item -Path $Target -Destination $backup -Force
        Write-Host "  [BACKUP] $Name -> $backup" -ForegroundColor Yellow
    }

    # 부모 디렉토리 생성
    $parent = Split-Path $Target -Parent
    if (-not (Test-Path $parent)) {
        New-Item -ItemType Directory -Path $parent -Force | Out-Null
    }

    # 심볼링크 생성
    if ($IsDirectory) {
        New-Item -ItemType SymbolicLink -Path $Target -Target $Source | Out-Null
    } else {
        New-Item -ItemType SymbolicLink -Path $Target -Target $Source | Out-Null
    }
    Write-Host "  [NEW] $Name" -ForegroundColor Green
    Write-Host "        -> $Source" -ForegroundColor Cyan
}

Write-Host "`n=== 심볼링크 설정 (Windows) ===" -ForegroundColor Cyan

# Git
Write-Host "`n[Git]" -ForegroundColor Yellow
New-SafeLink -Source "$DotfilesDir\.gitconfig" -Target "$env:USERPROFILE\.gitconfig" -Name ".gitconfig"

# SSH
Write-Host "`n[SSH]" -ForegroundColor Yellow
New-SafeLink -Source "$DotfilesDir\ssh\config" -Target "$env:USERPROFILE\.ssh\config" -Name "ssh/config"

# PowerShell Profile
Write-Host "`n[PowerShell]" -ForegroundColor Yellow
$profileDir = Split-Path $PROFILE -Parent
if (-not (Test-Path $profileDir)) {
    New-Item -ItemType Directory -Path $profileDir -Force | Out-Null
}
New-SafeLink -Source "$DotfilesDir\powershell\profile.ps1" -Target $PROFILE -Name "profile.ps1"

# Claude Code
Write-Host "`n[Claude Code]" -ForegroundColor Yellow
$claudeDir = "$env:USERPROFILE\.claude"
New-SafeLink -Source "$DotfilesDir\claude\CLAUDE.md" -Target "$claudeDir\CLAUDE.md" -Name "CLAUDE.md"
New-SafeLink -Source "$DotfilesDir\claude\settings.json" -Target "$claudeDir\settings.json" -Name "settings.json"
New-SafeLink -Source "$DotfilesDir\claude\commands" -Target "$claudeDir\commands" -Name "commands/" -IsDirectory
New-SafeLink -Source "$DotfilesDir\claude\skills" -Target "$claudeDir\skills" -Name "skills/" -IsDirectory
New-SafeLink -Source "$DotfilesDir\claude\hooks" -Target "$claudeDir\hooks" -Name "hooks/" -IsDirectory

# OpenCode
Write-Host "`n[OpenCode]" -ForegroundColor Yellow
New-SafeLink -Source "$DotfilesDir\opencode\.opencode.json" -Target "$env:USERPROFILE\.opencode.json" -Name ".opencode.json"
New-SafeLink -Source "$DotfilesDir\opencode\command" -Target "$env:APPDATA\opencode\command" -Name "command/" -IsDirectory
New-SafeLink -Source "$DotfilesDir\opencode\agent" -Target "$env:APPDATA\opencode\agent" -Name "agent/" -IsDirectory
New-SafeLink -Source "$DotfilesDir\opencode\AGENTS.md" -Target "$env:APPDATA\opencode\AGENTS.md" -Name "AGENTS.md"

Write-Host "`n=== 완료 ===" -ForegroundColor Green
```

### .gitconfig 템플릿 (크로스 플랫폼)

`~/.dotfiles/.gitconfig`:

```ini
[user]
    name = Your Name
    email = your.email@example.com

[init]
    defaultBranch = main

[core]
    editor = code --wait
    quotepath = false       # 한글 파일명 제대로 표시
    # autocrlf는 플랫폼별로 설정 (install 스크립트에서)

[alias]
    st = status
    co = checkout
    br = branch
    ci = commit
    lg = log --oneline --graph --all -15
    last = log -1 HEAD
    undo = reset HEAD~1 --mixed
    amend = commit --amend --no-edit

[pull]
    rebase = false

[push]
    default = current
    autoSetupRemote = true

[credential]
    # macOS: osxkeychain
    # Windows: manager (install 스크립트에서 설정)
```

### ssh/config 템플릿

`~/.dotfiles/ssh/config`:

```
# GitHub
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519
    AddKeysToAgent yes

# 회사 서버 예시
Host work
    HostName work.example.com
    User username
    IdentityFile ~/.ssh/id_work
```

---

## 크로스 플랫폼 관리

### 공통 설정 vs 플랫폼별 설정

| 파일 | 공유 가능 | 비고 |
|------|----------|------|
| `.gitconfig` | O | 동일하게 사용 |
| `ssh/config` | O | 경로만 주의 |
| `claude/*` | O | 완전 호환 |
| `opencode/*` | △ | shell 설정만 분리 |
| `.zshrc` | X | macOS 전용 |
| `powershell/profile.ps1` | X | Windows 전용 |

### OpenCode 크로스 플랫폼 설정

```json
// .opencode.json (공통 부분)
{
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-opus-4-20250514",
  "small_model": "anthropic/claude-haiku-3-5-20241022",
  "agents": {
    "coder": { "model": "anthropic/claude-opus-4-20250514" },
    "task": { "model": "anthropic/claude-haiku-3-5-20241022" }
  },
  "autoCompact": true
}
```

shell 설정은 플랫폼별로:

```json
// macOS 추가
"shell": { "path": "/bin/zsh", "args": ["-l"] }

// Windows 추가
"shell": { "path": "pwsh.exe", "args": ["-NoLogo"] }
```

**방법 1**: 설치 스크립트에서 자동 감지

```bash
# install.sh (macOS)
jq '.shell = {"path": "/bin/zsh", "args": ["-l"]}' .opencode.json > tmp && mv tmp .opencode.json
```

```powershell
# install.ps1 (Windows)
$config = Get-Content .opencode.json | ConvertFrom-Json
$config.shell = @{ path = "pwsh.exe"; args = @("-NoLogo") }
$config | ConvertTo-Json -Depth 10 | Set-Content .opencode.json
```

**방법 2**: 플랫폼별 파일 분리

```
opencode/
├── .opencode.base.json      # 공통
├── .opencode.macos.json     # macOS shell
└── .opencode.windows.json   # Windows shell
```

---

## 일상 사용

### macOS (.zshrc alias)

```bash
# ~/.dotfiles/.zshrc 에 추가

# ---- 경로 변수 ----
export DOTFILES="$HOME/.dotfiles"
export PROJECTS="$HOME/Projects"
export OBSIDIAN="$HOME/Library/Mobile Documents/iCloud~md~obsidian/Documents/재훈드리아 대도서관"

# ---- dotfiles 동기화 ----
alias dot="cd $DOTFILES"
alias dotpush='cd $DOTFILES && git add . && git commit -m "update dotfiles" && git push && cd -'
alias dotsync='cd $DOTFILES && git pull && cd -'
alias dotbrew='brew bundle dump --file=$DOTFILES/Brewfile --force'

# ---- 옵시디언 동기화 ----
alias lib="cd \"$OBSIDIAN\""
alias libpush='cd "$OBSIDIAN" && git add . && git commit -m "update notes" && git push && cd -'
alias libsync='cd "$OBSIDIAN" && git pull && cd -'

# ---- 전체 동기화 ----
alias pushall='dotpush && libpush'
alias syncall='dotsync && libsync'

# ---- Git 단축 ----
alias gs='git status'
alias gd='git diff'
alias gl='git log --oneline -10'
alias gp='git push'
alias gpu='git pull'

# ---- 네비게이션 ----
alias proj="cd $PROJECTS"
alias ..='cd ..'
alias ...='cd ../..'

# ---- 유틸리티 ----
alias pwdc='pwd | pbcopy'  # 현재 경로 복사

# ---- AI 도구 ----
alias oc='opencode'
alias cc='claude'
```

### Windows

PowerShell Profile에 동일한 함수들이 정의되어 있음 (위 참조)

### PowerShell Profile 전체 템플릿

`powershell/profile.ps1`:

```powershell
# ============================================
# PowerShell Profile - Dev Setup
# ============================================

# ---- 경로 변수 ----
$dotfiles = "$env:USERPROFILE\.dotfiles"
$projects = "$env:USERPROFILE\Projects"
$obsidian = "$env:USERPROFILE\Documents\Obsidian"

# ---- Git 함수 ----

# dotfiles 푸시
function dotpush {
    param([string]$msg = "update dotfiles")
    Push-Location $dotfiles
    git add .
    git commit -m $msg
    git push
    Pop-Location
    Write-Host "dotfiles pushed!" -ForegroundColor Green
}

# dotfiles 동기화
function dotsync {
    Push-Location $dotfiles
    git pull
    Pop-Location
    Write-Host "dotfiles synced!" -ForegroundColor Green
}

# 옵시디언 푸시
function libpush {
    param([string]$msg = "update notes")
    Push-Location $obsidian
    git add .
    git commit -m $msg
    git push
    Pop-Location
    Write-Host "library pushed!" -ForegroundColor Green
}

# 옵시디언 동기화
function libsync {
    Push-Location $obsidian
    git pull
    Pop-Location
    Write-Host "library synced!" -ForegroundColor Green
}

# 전체 푸시
function pushall {
    dotpush
    libpush
}

# 전체 동기화
function syncall {
    dotsync
    libsync
}

# Git 상태 확인
function gs { git status }
function gd { git diff }
function gl { git log --oneline -10 }
function gp { git push }
function gpu { git pull }

# ---- 네비게이션 ----

function dot { Set-Location $dotfiles }
function proj { Set-Location $projects }
function lib { Set-Location $obsidian }

# ---- 유틸리티 ----

# 현재 경로 복사
function pwdc { (Get-Location).Path | Set-Clipboard }

# 새 디렉토리 만들고 이동
function mkcd { param($dir) New-Item -ItemType Directory -Path $dir; Set-Location $dir }

# 파일 찾기
function ff { param($name) Get-ChildItem -Recurse -Filter "*$name*" }

# ---- 프롬프트 커스터마이징 ----

function prompt {
    $path = (Get-Location).Path.Replace($env:USERPROFILE, "~")
    $branch = ""
    if (Test-Path .git) {
        $branch = git branch --show-current 2>$null
        if ($branch) { $branch = " ($branch)" }
    }
    Write-Host "$path" -NoNewline -ForegroundColor Cyan
    Write-Host $branch -NoNewline -ForegroundColor Yellow
    Write-Host " >" -NoNewline -ForegroundColor White
    return " "
}

# ---- AI 도구 ----

# OpenCode 빠른 실행
function oc { opencode $args }

# Claude 빠른 실행  
function cc { claude $args }

# ---- 시작 메시지 ----

Write-Host ""
Write-Host "Dev Environment Ready" -ForegroundColor Green
Write-Host "Commands: dotpush, dotsync, pushall, syncall" -ForegroundColor DarkGray
Write-Host ""
```

### 동기화 명령어 요약

| 명령어 | macOS | Windows | 설명 |
|--------|-------|---------|------|
| `dotpush` | ✅ | ✅ | dotfiles 커밋 & 푸시 |
| `dotsync` | ✅ | ✅ | dotfiles 풀 |
| `libpush` | ✅ | ✅ | 옵시디언 커밋 & 푸시 |
| `libsync` | ✅ | ✅ | 옵시디언 풀 |
| `pushall` | ✅ | ✅ | 전체 푸시 |
| `syncall` | ✅ | ✅ | 전체 동기화 |
| `dotbrew` | ✅ | - | Brewfile 업데이트 |

---

## 문제 해결

### Windows 심볼링크 권한 오류

```
New-Item : You do not have sufficient privilege to perform this operation.
```

**해결**:
1. 관리자 권한 PowerShell 사용
2. 또는 개발자 모드 활성화 (설정 > 개발자용)

### Claude Code Windows 경로 문제

Windows에서 Claude Code 훅이 작동하지 않을 때:

```json
// settings.json - Windows용 훅 경로
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "script": "powershell.exe -File C:/Users/USER/.claude/hooks/check.ps1"
    }]
  }
}
```

### Git 줄바꿈 설정

크로스 플랫폼 작업 시:

```bash
# macOS/Linux
git config --global core.autocrlf input

# Windows
git config --global core.autocrlf true
```

---

## 참고

- [[CLAUDE-SETUP]] - Claude Code 상세 설정
- [[OPENCODE-SETUP]] - OpenCode 상세 설정
- [GitHub dotfiles](https://dotfiles.github.io/) - dotfiles 모범 사례

---

#topic/dotfiles #topic/devops #type/guide
