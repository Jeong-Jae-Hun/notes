# Git 초기 설정 및 저장소 생성

## 기본 설정

### 사용자 정보 설정
```bash
# 필수 설정
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 설정 확인
git config user.name
git config user.email
git config --list
```

### 에디터 설정
```bash
# VS Code 설정
git config --global core.editor "code --wait"

# Vim 설정
git config --global core.editor "vim"

# nano 설정
git config --global core.editor "nano"
```

### 줄바꿈 설정
```bash
# Windows 환경
git config --global core.autocrlf true

# Mac/Linux 환경
git config --global core.autocrlf input

# 플랫폼 무관하게 LF만 사용
git config --global core.autocrlf false
```

### 한글 설정
```bash
# 한글 파일명 깨짐 방지
git config --global core.quotepath false

# 한글 커밋 메시지 지원
git config --global i18n.logoutputencoding utf-8
git config --global i18n.commitencoding utf-8
```

## 저장소 초기화

### 새 저장소 생성
```bash
# 현재 디렉토리를 Git 저장소로 초기화
git init

# 새 디렉토리 생성하면서 초기화
git init my-project
cd my-project

# bare 저장소 생성 (서버용)
git init --bare my-repo.git
```

### 원격 저장소 클론
```bash
# 기본 클론
git clone https://github.com/user/repo.git

# 다른 이름의 폴더로 클론
git clone https://github.com/user/repo.git my-folder

# 특정 브랜치만 클론
git clone -b feature-branch https://github.com/user/repo.git

# 얕은 클론 (최근 커밋만, 빠른 다운로드)
git clone --depth 1 https://github.com/user/repo.git

# 서브모듈까지 함께 클론
git clone --recursive https://github.com/user/repo.git
```

## 원격 저장소 연결

### 원격 저장소 추가
```bash
# origin 원격 저장소 추가
git remote add origin https://github.com/user/repo.git

# upstream 원격 저장소 추가 (포크한 경우)
git remote add upstream https://github.com/original/repo.git

# 원격 저장소 목록 확인
git remote -v
```

### 원격 저장소 관리
```bash
# 원격 저장소 URL 변경
git remote set-url origin https://github.com/user/new-repo.git

# 원격 저장소 이름 변경
git remote rename origin new-origin

# 원격 저장소 제거
git remote remove upstream
```

## 초기 커밋

### 첫 번째 커밋 만들기
```bash
# README 파일 생성
echo "# My Project" >> README.md

# .gitignore 파일 생성
curl -o .gitignore https://raw.githubusercontent.com/github/gitignore/master/Node.gitignore

# 파일 추가 및 커밋
git add .
git commit -m "Initial commit"

# 원격 저장소에 푸시
git push -u origin main
```

### 기본 브랜치 설정
```bash
# main을 기본 브랜치로 설정
git config --global init.defaultBranch main

# 현재 브랜치 이름 변경
git branch -M main

# 원격의 기본 브랜치 확인
git remote show origin
```

## 유용한 초기 설정

### 별칭 설정
```bash
# 자주 사용하는 명령어 단축키
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
```

### 보안 설정
```bash
# HTTPS 대신 SSH 사용 (권장)
git config --global url."git@github.com:".insteadOf "https://github.com/"

# 자격 증명 저장 (신중하게 사용)
git config --global credential.helper store
```

### 성능 설정
```bash
# 자동 가비지 컬렉션 설정
git config --global gc.auto 256

# 대용량 파일 처리 개선
git config --global core.preloadindex true
git config --global core.fscache true
```