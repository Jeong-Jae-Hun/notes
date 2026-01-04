# Git Dotfiles 가이드

> 맥북 설정 파일을 Git으로 관리하여 여러 기기 간 동기화하는 방법

## 개요

dotfiles는 `.`으로 시작하는 설정 파일들을 의미합니다. Git 저장소로 관리하면:

- **버전 관리**: 설정 변경 히스토리 추적, 롤백 가능
- **동기화**: 여러 맥북에서 동일한 환경 유지
- **백업**: 맥북이 고장나도 설정 복구 가능
- **공유**: 다른 사람과 설정 공유 가능

## 저장소 구조

```
~/.dotfiles/
├── .zshrc                 # Zsh 설정
├── .zprofile              # Zsh 프로필
├── .gitconfig             # Git 전역 설정
├── config/
│   └── ghostty/           # Ghostty 터미널 설정
├── ssh/
│   └── config             # SSH 호스트 설정
├── Brewfile               # Homebrew 앱 목록
├── install.sh             # 새 맥북용 전체 설치 스크립트
├── link.sh                # 심볼릭 링크만 설정하는 스크립트
└── README.md              # 저장소 설명
```

## 스크립트 설명

| 스크립트 | 용도 | 언제 사용? |
|----------|------|-----------|
| `install.sh` | Homebrew 설치 + 앱 설치 + 심볼릭 링크 | 새 맥북 초기 설정 |
| `link.sh` | 심볼릭 링크만 설정 | 기존 맥북에서 dotfiles 연결 |

## 초기 설정

### 1. 저장소 생성

```bash
# dotfiles 디렉토리 생성
mkdir ~/dotfiles
cd ~/dotfiles
git init
```

### 2. 설정 파일 복사

```bash
# 쉘 설정
cp ~/.zshrc ~/dotfiles/
cp ~/.zprofile ~/dotfiles/ 2>/dev/null

# Git 설정
cp ~/.gitconfig ~/dotfiles/
cp ~/.gitignore_global ~/dotfiles/ 2>/dev/null

# 앱 설정 (config 폴더)
mkdir -p ~/dotfiles/config
cp -r ~/.config/ghostty ~/dotfiles/config/
```

### 3. 심볼릭 링크 설정

원본 파일을 백업하고 dotfiles로 심볼릭 링크 생성:

```bash
# 기존 파일 백업
mv ~/.zshrc ~/.zshrc.backup
mv ~/.gitconfig ~/.gitconfig.backup

# 심볼릭 링크 생성
ln -sf ~/dotfiles/.zshrc ~/.zshrc
ln -sf ~/dotfiles/.gitconfig ~/.gitconfig

# Ghostty 설정
rm -rf ~/.config/ghostty
ln -sf ~/dotfiles/config/ghostty ~/.config/ghostty
```

### 4. Brewfile 생성

현재 설치된 앱 목록 저장:

```bash
brew bundle dump --file=~/dotfiles/Brewfile --force
```

Brewfile 예시:
```ruby
# Brewfile
tap "homebrew/bundle"
tap "homebrew/cask-fonts"

# CLI 도구
brew "git"
brew "gh"
brew "fzf"
brew "ripgrep"
brew "tmux"
brew "neovim"

# 앱
cask "ghostty"
cask "visual-studio-code"
cask "arc"
cask "raycast"

# 폰트
cask "font-jetbrains-mono-nerd-font"
```

### 5. GitHub에 푸시

```bash
cd ~/dotfiles
git add .
git commit -m "feat: 초기 dotfiles 설정"

# GitHub에서 private 저장소 생성 후
git remote add origin git@github.com:USERNAME/dotfiles.git
git push -u origin main
```

## 새 맥북에서 복원

### 자동 설치 스크립트

`install.sh` 작성:

```bash
#!/bin/bash
set -e

DOTFILES_DIR="$HOME/dotfiles"

echo "=== Dotfiles 설치 시작 ==="

# 1. Homebrew 설치
if ! command -v brew &> /dev/null; then
    echo "Homebrew 설치 중..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    eval "$(/opt/homebrew/bin/brew shellenv)"
fi

# 2. Brewfile로 앱 설치
if [ -f "$DOTFILES_DIR/Brewfile" ]; then
    echo "앱 설치 중..."
    brew bundle install --file="$DOTFILES_DIR/Brewfile"
fi

# 3. 심볼릭 링크 생성
echo "심볼릭 링크 생성 중..."

# 쉘 설정
[ -f ~/.zshrc ] && mv ~/.zshrc ~/.zshrc.backup
ln -sf "$DOTFILES_DIR/.zshrc" ~/.zshrc

[ -f ~/.zprofile ] && mv ~/.zprofile ~/.zprofile.backup
ln -sf "$DOTFILES_DIR/.zprofile" ~/.zprofile

# Git 설정
[ -f ~/.gitconfig ] && mv ~/.gitconfig ~/.gitconfig.backup
ln -sf "$DOTFILES_DIR/.gitconfig" ~/.gitconfig

# Ghostty 설정
mkdir -p ~/.config
[ -d ~/.config/ghostty ] && rm -rf ~/.config/ghostty
ln -sf "$DOTFILES_DIR/config/ghostty" ~/.config/ghostty

echo "=== 설치 완료! ==="
echo "터미널을 재시작하세요."
```

### 복원 순서

```bash
# 1. Xcode Command Line Tools 설치
xcode-select --install

# 2. dotfiles 클론
git clone git@github.com:USERNAME/dotfiles.git ~/dotfiles

# 3. 설치 스크립트 실행
cd ~/dotfiles
chmod +x install.sh
./install.sh

# 4. 터미널 재시작
exec $SHELL
```

## 기존 맥북에서 연결

이미 설정 파일이 있는 맥북에서 dotfiles 저장소로 관리하고 싶을 때:

```bash
# 1. 저장소 클론
git clone git@github.com:USERNAME/dotfiles.git ~/.dotfiles

# 2. 심볼릭 링크 설정
cd ~/.dotfiles
chmod +x link.sh
./link.sh
```

`link.sh`는 기존 파일을 `.backup`으로 백업한 뒤 심볼릭 링크를 생성합니다.

## 일상적인 사용

### 설정 변경 후 커밋

```bash
cd ~/.dotfiles
git add .
git commit -m "chore: zshrc alias 추가"
git push
```

### 다른 맥북에서 동기화

```bash
cd ~/.dotfiles
git pull
```

### 새 앱 설치 시

```bash
# 앱 설치
brew install 앱이름

# Brewfile 업데이트
brew bundle dump --file=~/.dotfiles/Brewfile --force

# 커밋
cd ~/.dotfiles
git add Brewfile
git commit -m "chore: 앱이름 추가"
git push
```

## 관리 대상 파일 목록

| 파일/폴더 | 설명 | 우선순위 |
|-----------|------|----------|
| `.zshrc` | Zsh 설정, alias, PATH | 필수 |
| `.gitconfig` | Git 사용자, alias, 설정 | 필수 |
| `Brewfile` | 설치된 앱 목록 | 필수 |
| `config/ghostty/` | Ghostty 터미널 설정 | 권장 |
| `.ssh/config` | SSH 호스트 설정 | 권장 |
| `config/nvim/` | Neovim 설정 | 선택 |
| `.tmux.conf` | tmux 설정 | 선택 |

> [!warning] 주의
> - `.ssh/id_*` 개인키는 절대 커밋하지 않음
> - `.env`, API 키 등 민감 정보 제외
> - `.gitignore`에 민감 파일 추가 필수

## .gitignore 예시

```gitignore
# 민감 정보
.ssh/id_*
.ssh/*.pem
*.env
*credentials*
*secret*

# 시스템 파일
.DS_Store
*.swp
*.swo

# 로컬 전용 설정
.zshrc.local
.gitconfig.local
```

## 팁

### 로컬 전용 설정 분리

`.zshrc` 끝에 추가:
```bash
# 로컬 전용 설정 (Git에 포함 안 됨)
[ -f ~/.zshrc.local ] && source ~/.zshrc.local
```

이렇게 하면 기기별 다른 설정을 `.zshrc.local`에 저장 가능.

### 민감 정보 관리

환경 변수는 `.zshrc.local`에:
```bash
# ~/.zshrc.local (Git 제외)
export OPENAI_API_KEY="sk-xxx"
export GITHUB_TOKEN="ghp_xxx"
```

## 참고

- [GitHub: dotfiles](https://dotfiles.github.io/) - 다양한 dotfiles 예시
- [Homebrew Bundle](https://github.com/Homebrew/homebrew-bundle) - Brewfile 문서

---

*마지막 업데이트: 2025-12-23*
