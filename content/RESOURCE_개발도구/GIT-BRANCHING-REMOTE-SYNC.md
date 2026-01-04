# 원격 저장소 동기화

## 원격 저장소 기본 개념

원격 저장소는 네트워크상에 있는 Git 저장소로, 팀원들과 코드를 공유하고 백업하는 역할을 합니다.

## 원격 저장소 관리

### 원격 저장소 확인
```bash
# 원격 저장소 목록
git remote

# 원격 저장소 URL과 함께 확인
git remote -v

# 특정 원격 저장소 상세 정보
git remote show origin

# 원격 브랜치 정보
git ls-remote origin
```

### 원격 저장소 추가/수정/삭제
```bash
# 원격 저장소 추가
git remote add origin https://github.com/user/repo.git
git remote add upstream https://github.com/original/repo.git

# 원격 저장소 URL 변경
git remote set-url origin https://github.com/user/new-repo.git

# 원격 저장소 이름 변경
git remote rename origin new-origin

# 원격 저장소 제거
git remote remove upstream
```

## 가져오기 (Fetch)

### 기본 Fetch
```bash
# 모든 원격 브랜치 정보 가져오기 (로컬 브랜치 변경 없음)
git fetch

# 특정 원격 저장소에서 가져오기
git fetch origin

# 모든 원격 저장소에서 가져오기
git fetch --all

# 태그 정보도 함께 가져오기
git fetch --tags
```

### 고급 Fetch
```bash
# 특정 브랜치만 가져오기
git fetch origin main

# 원격에서 삭제된 브랜치 정보 업데이트
git fetch --prune
git fetch -p

# Shallow clone의 히스토리 확장
git fetch --unshallow

# 자동 정리 설정
git config --global remote.origin.prune true
```

### Fetch 후 상태 확인
```bash
# 로컬과 원격 브랜치 비교
git status

# 원격 브랜치와의 차이점 확인
git diff HEAD origin/main

# 가져온 변경사항 확인
git log HEAD..origin/main --oneline

# 그래프로 브랜치 관계 확인
git log --graph --oneline --all
```

## 당겨오기 (Pull)

### 기본 Pull
```bash
# 현재 브랜치에 원격 변경사항 가져와서 머지
git pull

# 특정 원격 저장소에서 pull
git pull origin

# 특정 브랜치에서 pull
git pull origin main
```

### Pull 전략
```bash
# 머지로 pull (기본값)
git pull --no-rebase

# 리베이스로 pull
git pull --rebase

# Fast-forward만 허용
git pull --ff-only

# 관련 없는 히스토리 허용
git pull --allow-unrelated-histories
```

### Pull 설정
```bash
# 기본 pull 전략을 리베이스로 설정
git config --global pull.rebase true

# 특정 브랜치에서만 리베이스 설정
git config branch.main.rebase true

# Fast-forward만 허용하도록 설정
git config --global pull.ff only
```

## 푸시하기 (Push)

### 기본 Push
```bash
# 현재 브랜치를 원격으로 푸시
git push

# 특정 원격 저장소로 푸시
git push origin

# 특정 브랜치를 특정 원격으로 푸시
git push origin main
```

### 첫 번째 Push
```bash
# 새 브랜치를 원격에 푸시하면서 추적 설정
git push -u origin feature/new-feature
git push --set-upstream origin feature/new-feature

# 현재 브랜치를 같은 이름으로 원격에 푸시
git push -u origin HEAD
```

### 강제 Push
```bash
# 강제 푸시 (위험!)
git push --force

# 안전한 강제 푸시 (다른 사람의 변경사항 보호)
git push --force-with-lease

# 특정 커밋까지만 강제 푸시
git push --force-with-lease=origin/branch:commit-hash
```

### 브랜치와 태그 Push
```bash
# 모든 브랜치 푸시
git push --all origin

# 모든 태그 푸시
git push --tags origin

# 브랜치와 태그 모두 푸시
git push --all && git push --tags

# 특정 태그 푸시
git push origin v1.0.0
```

## 원격 브랜치 추적

### 추적 관계 설정
```bash
# 기존 브랜치가 원격 브랜치를 추적하도록 설정
git branch --set-upstream-to=origin/main main
git branch -u origin/main main

# 추적 관계 확인
git branch -vv

# 추적하지 않는 브랜치 확인
git for-each-ref --format='%(refname:short) %(upstream)' refs/heads | grep -v origin
```

### 원격 브랜치 체크아웃
```bash
# 원격 브랜치를 로컬로 체크아웃하면서 추적 설정
git checkout -b feature/branch origin/feature/branch
git switch -c feature/branch origin/feature/branch

# 이름을 다르게 하여 추적
git checkout -b my-feature origin/team-feature

# 원격 브랜치와 같은 이름으로 자동 추적
git checkout feature/branch  # origin/feature/branch가 존재할 때
```

## 동기화 전략

### 개인 브랜치 동기화
```bash
# 안전한 동기화 패턴
git fetch origin
git rebase origin/main
git push --force-with-lease origin feature/my-branch

# 스크립트로 만들기
#!/bin/bash
git fetch origin
if git rebase origin/main; then
    git push --force-with-lease origin $(git branch --show-current)
else
    echo "Rebase conflicts detected. Please resolve manually."
fi
```

### 팀 브랜치 동기화
```bash
# 안전한 팀 브랜치 업데이트
git checkout main
git fetch origin
git merge origin/main  # 또는 git pull --ff-only
git push origin main
```

### 포크 저장소 동기화
```bash
# upstream 설정 (원본 저장소)
git remote add upstream https://github.com/original/repo.git

# upstream에서 변경사항 가져오기
git fetch upstream

# main 브랜치 동기화
git checkout main
git merge upstream/main
git push origin main

# 자동화 스크립트
#!/bin/bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
echo "Fork synchronized with upstream"
```

## 충돌 해결

### Push 충돌 해결
```bash
# push 거부 시
git push  # 실패

# 원격 변경사항 확인
git fetch origin
git log HEAD..origin/main --oneline

# 변경사항 통합 후 재시도
git pull --rebase  # 또는 git merge origin/main
git push
```

### Pull 충돌 해결
```bash
# pull 중 충돌 발생
git pull
# 충돌 파일 수정 후
git add conflicted-file.txt
git commit  # 머지의 경우
# 또는
git rebase --continue  # 리베이스의 경우
```

## 대용량 저장소 최적화

### Shallow Clone
```bash
# 최근 커밋만 클론 (빠른 클론)
git clone --depth 1 https://github.com/user/repo.git

# 특정 브랜치만 shallow clone
git clone --depth 1 --branch main https://github.com/user/repo.git

# shallow clone을 full clone으로 변환
git fetch --unshallow
```

### Partial Clone
```bash
# 대용량 파일 제외하고 클론
git clone --filter=blob:limit=1m https://github.com/user/repo.git

# 특정 경로만 클론
git clone --filter=tree:0 https://github.com/user/repo.git
git sparse-checkout init --cone
git sparse-checkout set src/
```

### Bandwidth 절약
```bash
# 압축 레벨 설정
git config --global core.compression 9

# Delta 압축 설정
git config --global pack.deltaCacheSize 2g
git config --global pack.packSizeLimit 2g

# 네트워크 최적화
git config --global http.postBuffer 1048576000
```

## 여러 원격 저장소 관리

### 다중 원격 저장소
```bash
# 여러 원격 저장소 설정
git remote add origin https://github.com/user/repo.git
git remote add gitlab https://gitlab.com/user/repo.git
git remote add bitbucket https://bitbucket.org/user/repo.git

# 모든 원격 저장소에 푸시
git remote set-url --add --push origin https://github.com/user/repo.git
git remote set-url --add --push origin https://gitlab.com/user/repo.git
git push origin main  # 모든 설정된 push URL로 푸시
```

### 미러링 설정
```bash
# 원격 저장소 미러링
git clone --mirror https://github.com/user/repo.git
cd repo.git
git remote set-url --push origin https://gitlab.com/user/repo.git
git push --mirror
```

## 실용적인 워크플로우

### 일상적인 동기화 루틴
```bash
#!/bin/bash
# daily-sync.sh

echo "=== 일일 Git 동기화 ==="

# 1. 메인 브랜치 최신화
git checkout main
git fetch origin
git merge origin/main

# 2. 작업 브랜치들 업데이트
for branch in $(git branch | grep -v main | sed 's/*//' | xargs); do
    echo "Updating branch: $branch"
    git checkout $branch
    git rebase main
done

# 3. 정리 작업
git checkout main
git remote prune origin

echo "=== 동기화 완료 ==="
```

### 안전한 force-push 스크립트
```bash
#!/bin/bash
# safe-force-push.sh

BRANCH=$(git branch --show-current)
REMOTE="origin"

echo "현재 브랜치: $BRANCH"
echo "원격 저장소: $REMOTE"

# 원격 상태 확인
git fetch $REMOTE

# 로컬과 원격 비교
LOCAL=$(git rev-parse @)
REMOTE_REF=$(git rev-parse @{u} 2>/dev/null)

if [ "$LOCAL" = "$REMOTE_REF" ]; then
    echo "이미 최신 상태입니다."
    exit 0
fi

# 안전한 force-push
echo "Force push를 실행합니다..."
git push --force-with-lease $REMOTE $BRANCH

if [ $? -eq 0 ]; then
    echo "Push 성공!"
else
    echo "Push 실패! 다른 사람이 변경사항을 푸시했을 수 있습니다."
    echo "git fetch $REMOTE && git log HEAD..$REMOTE/$BRANCH --oneline"
fi
```

## 트러블슈팅

### 일반적인 문제들
```bash
# "Updates were rejected because the tip of your current branch is behind"
git fetch origin
git rebase origin/main  # 또는 git merge origin/main
git push

# "fatal: refusing to merge unrelated histories"
git pull --allow-unrelated-histories

# SSL 인증서 문제 (임시 해결)
git config --global http.sslVerify false  # 보안상 권장하지 않음

# 큰 파일 push 실패
git config --global http.postBuffer 1048576000
```

### 원격 브랜치 복구
```bash
# 삭제된 원격 브랜치 복구
git reflog
git push origin commit-hash:refs/heads/branch-name

# 원격 브랜치 정보 새로고침
git remote update --prune
```

### 네트워크 문제 해결
```bash
# 타임아웃 설정
git config --global http.lowSpeedLimit 1000
git config --global http.lowSpeedTime 300

# 프록시 설정
git config --global http.proxy http://proxy.company.com:8080

# 프록시 해제
git config --global --unset http.proxy
```