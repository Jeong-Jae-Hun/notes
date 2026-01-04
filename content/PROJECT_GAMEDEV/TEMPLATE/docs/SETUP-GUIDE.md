# 환경 설정 가이드

> 언리얼 엔진 + Git 환경 설정

---

## 1. 언리얼 엔진 설치

### Step 1: Epic Games Launcher 설치

1. [Epic Games](https://www.epicgames.com/store/ko/download) 접속
2. "Epic Games Launcher 다운로드" 클릭
3. 설치 후 계정 생성/로그인

### Step 2: Unreal Engine 5 설치

1. Epic Games Launcher 실행
2. 왼쪽 메뉴에서 **Unreal Engine** 클릭
3. **라이브러리** 탭 → **엔진 버전** 옆 **+** 버튼
4. 최신 버전 선택 (예: 5.4)
5. **설치** 클릭

> ⚠️ **용량 주의**: 약 50GB 이상 필요

### Step 3: 첫 프로젝트 생성

1. **새 프로젝트 만들기** 클릭
2. **Games** → **Third Person** 선택
3. 프로젝트 설정:
   - 프로젝트 이름: `OurGame` (영문)
   - 위치: 원하는 폴더
   - Blueprint / C++: **Blueprint** (처음엔 이걸로)
4. **생성** 클릭

---

## 2. Git 설치

### Windows

1. [Git for Windows](https://git-scm.com/download/win) 다운로드
2. 설치 (기본 옵션 유지)
3. 터미널에서 확인:
   ```bash
   git --version
   ```

### macOS

```bash
# Homebrew로 설치
brew install git

# 확인
git --version
```

---

## 3. Git LFS 설치

> 언리얼 프로젝트는 대용량 파일(텍스처, 사운드 등)이 많아서 Git LFS 필수

### Windows

1. [Git LFS](https://git-lfs.github.com/) 다운로드
2. 설치
3. 터미널에서:
   ```bash
   git lfs install
   ```

### macOS

```bash
brew install git-lfs
git lfs install
```

---

## 4. GitHub 계정 설정

### SSH 키 생성

```bash
# SSH 키 생성
ssh-keygen -t ed25519 -C "your_email@example.com"

# 엔터 3번 (기본값)

# SSH 에이전트에 추가
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# 공개키 복사
# macOS
cat ~/.ssh/id_ed25519.pub | pbcopy

# Windows (Git Bash)
cat ~/.ssh/id_ed25519.pub | clip
```

### GitHub에 SSH 키 등록

1. [GitHub SSH Settings](https://github.com/settings/keys) 접속
2. **New SSH key** 클릭
3. Title: `내 컴퓨터`
4. Key: 복사한 공개키 붙여넣기
5. **Add SSH key**

### 연결 테스트

```bash
ssh -T git@github.com
# "Hi username! You've successfully authenticated" 나오면 성공
```

---

## 5. Git 사용자 설정

```bash
git config --global user.name "내 이름"
git config --global user.email "my@email.com"
```

---

## 6. 프로젝트 클론

```bash
# 프로젝트 클론
git clone git@github.com:username/repository.git

# 폴더로 이동
cd repository

# LFS 파일 가져오기
git lfs pull
```

---

## 7. VS Code 설치 (선택)

> AI 어시스턴트(OpenCode) 사용 시 필요

1. [VS Code](https://code.visualstudio.com/) 다운로드
2. 설치
3. 확장 설치:
   - **C/C++** (Microsoft)
   - **GitLens**

---

## 체크리스트

- [ ] Epic Games Launcher 설치
- [ ] Unreal Engine 5 설치
- [ ] Git 설치
- [ ] Git LFS 설치
- [ ] GitHub 계정 생성
- [ ] SSH 키 설정
- [ ] Git 사용자 설정
- [ ] 프로젝트 클론
- [ ] VS Code 설치 (선택)

---

## 문제 해결

### "Permission denied (publickey)"

SSH 키가 등록되지 않음. 위의 SSH 키 설정 다시 진행.

### LFS 파일이 깨져 보임

```bash
git lfs pull
```

### 언리얼 프로젝트가 안 열림

1. `.uproject` 파일 우클릭
2. "Generate Visual Studio project files" 선택
3. 다시 열기
