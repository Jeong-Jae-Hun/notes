# 브랜치 생성, 전환, 삭제

## 브랜치 기본 개념

브랜치는 독립적인 개발 라인을 만들어 기능 개발, 버그 수정, 실험 등을 안전하게 진행할 수 있게 해줍니다.

## 브랜치 조회

### 브랜치 목록 확인
```bash
# 로컬 브랜치 목록
git branch

# 원격 브랜치 목록
git branch -r

# 모든 브랜치 (로컬 + 원격)
git branch -a

# 브랜치와 마지막 커밋 정보
git branch -v

# 원격 추적 정보까지
git branch -vv
```

### 브랜치 상태 확인
```bash
# 현재 브랜치 확인
git branch --show-current

# 머지된 브랜치 확인
git branch --merged

# 머지되지 않은 브랜치 확인
git branch --no-merged

# 특정 브랜치 기준으로 머지 상태 확인
git branch --merged main
git branch --no-merged main
```

## 브랜치 생성

### 기본 생성
```bash
# 새 브랜치 생성 (현재 위치에서)
git branch feature/new-feature

# 특정 커밋에서 브랜치 생성
git branch feature/new-feature commit-hash

# 특정 브랜치에서 새 브랜치 생성
git branch feature/new-feature main
git branch feature/new-feature origin/develop
```

### 생성과 동시에 전환
```bash
# 생성하면서 전환 (전통적인 방법)
git checkout -b feature/new-feature

# 생성하면서 전환 (새로운 방법)
git switch -c feature/new-feature

# 원격 브랜치 기준으로 생성하면서 전환
git checkout -b feature/new-feature origin/feature/new-feature
git switch -c feature/new-feature origin/feature/new-feature

# 특정 커밋에서 생성하면서 전환
git checkout -b hotfix/critical-bug commit-hash
git switch -c hotfix/critical-bug commit-hash
```

## 브랜치 전환

### 기본 전환
```bash
# 브랜치 전환 (전통적인 방법)
git checkout main
git checkout feature/new-feature

# 브랜치 전환 (새로운 방법)
git switch main
git switch feature/new-feature

# 이전 브랜치로 돌아가기
git checkout -
git switch -
```

### 안전한 브랜치 전환
```bash
# 변경사항이 있을 때 스태시 후 전환
git stash && git switch main

# 변경사항 확인 후 전환
git status
git switch main  # 변경사항이 없어야 함

# 강제 전환 (변경사항 버림, 위험!)
git checkout -f main
git switch -f main
```

### 원격 브랜치 추적
```bash
# 원격 브랜치를 로컬로 가져와서 추적
git checkout -b feature/new-feature origin/feature/new-feature
git switch -c feature/new-feature origin/feature/new-feature

# 이름을 다르게 하여 추적
git checkout -b my-feature origin/feature/team-feature

# 기존 브랜치가 원격 브랜치를 추적하도록 설정
git branch --set-upstream-to=origin/feature/new-feature feature/new-feature
git branch -u origin/feature/new-feature feature/new-feature
```

## 브랜치 삭제

### 로컬 브랜치 삭제
```bash
# 안전한 삭제 (머지되지 않으면 삭제 거부)
git branch -d feature/completed-feature

# 강제 삭제 (머지 여부 무관)
git branch -D feature/abandoned-feature

# 여러 브랜치 동시 삭제
git branch -d feature/old-1 feature/old-2 feature/old-3

# 머지된 모든 브랜치 삭제 (main 제외)
git branch --merged main | grep -v main | xargs -n 1 git branch -d
```

### 원격 브랜치 삭제
```bash
# 원격 브랜치 삭제
git push origin --delete feature/completed-feature

# 축약 문법
git push origin :feature/completed-feature

# 여러 원격 브랜치 삭제
git push origin --delete feature/old-1 feature/old-2

# 로컬과 원격 브랜치 동시 삭제
git branch -d feature/old-feature
git push origin --delete feature/old-feature
```

### 정리 작업
```bash
# 원격에서 삭제된 브랜치를 로컬에서도 정리
git remote prune origin

# fetch 할 때 자동으로 정리
git fetch --prune

# 자동 정리 설정
git config --global remote.origin.prune true
```

## 브랜치 이름 변경

### 로컬 브랜치 이름 변경
```bash
# 현재 브랜치 이름 변경
git branch -m new-branch-name

# 다른 브랜치 이름 변경
git branch -m old-name new-name

# 강제 변경 (이미 존재하는 이름으로 변경)
git branch -M old-name new-name
```

### 원격 브랜치 이름 변경
```bash
# 1. 로컬 브랜치 이름 변경
git branch -m old-name new-name

# 2. 새 이름으로 푸시
git push origin -u new-name

# 3. 기존 원격 브랜치 삭제
git push origin --delete old-name
```

## 고급 브랜치 작업

### 브랜치 복사
```bash
# 현재 브랜치를 다른 이름으로 복사
git branch backup-branch

# 특정 브랜치를 다른 이름으로 복사
git branch new-experiment feature/original-feature
```

### 브랜치 비교
```bash
# 두 브랜치 간 차이점 확인
git diff main..feature/new-feature

# 공통 조상 이후 변경사항만
git diff main...feature/new-feature

# 파일 목록만 확인
git diff --name-only main..feature/new-feature

# 통계 정보
git diff --stat main..feature/new-feature
```

### 브랜치 히스토리 분석
```bash
# 브랜치가 분기된 지점 찾기
git merge-base main feature/new-feature

# 브랜치별 커밋 수 비교
git rev-list --count main
git rev-list --count feature/new-feature

# 브랜치만의 고유 커밋 확인
git log main..feature/new-feature --oneline
git log feature/new-feature..main --oneline
```

## 브랜치 네이밍 컨벤션

### 일반적인 브랜치 이름 패턴
```bash
# 기능 개발
feature/user-authentication
feature/payment-integration
feat/shopping-cart

# 버그 수정
bugfix/login-error
fix/payment-validation
hotfix/critical-security-issue

# 릴리스 준비
release/v1.2.0
release/2024-01-sprint

# 실험 및 연구
experiment/new-algorithm
research/performance-optimization

# 개인 작업
{username}/feature-name
john/user-profile-update
```

### 브랜치 이름 규칙 설정
```bash
# 브랜치 이름 훅 설정 (.git/hooks/pre-push)
#!/bin/sh
branch_name=$(git rev-parse --abbrev-ref HEAD)
valid_pattern="^(feature|bugfix|hotfix|release)\/[a-z0-9-]+$"

if [[ ! $branch_name =~ $valid_pattern ]]; then
    echo "Branch name '$branch_name' does not follow naming convention"
    echo "Use: feature/*, bugfix/*, hotfix/*, release/*"
    exit 1
fi
```

## 실용적인 워크플로우

### 일상적인 브랜치 작업
```bash
# 새 기능 시작
git checkout main
git pull
git checkout -b feature/new-awesome-feature

# 작업 완료 후
git push -u origin feature/new-awesome-feature

# 리뷰 후 정리
git checkout main
git pull
git branch -d feature/new-awesome-feature
git push origin --delete feature/new-awesome-feature
```

### 브랜치 상태 한눈에 보기
```bash
# 현재 브랜치와 원격 동기화 상태
git status -b

# 모든 브랜치의 최신 상태
git branch -vv

# 그래프로 브랜치 관계 확인
git log --graph --oneline --all -10
```

### 브랜치 정리 스크립트
```bash
#!/bin/bash
# cleanup-branches.sh

echo "=== 머지된 로컬 브랜치 정리 ==="
git branch --merged main | grep -v main | xargs -n 1 git branch -d

echo "=== 원격에서 삭제된 브랜치 정리 ==="
git remote prune origin

echo "=== 현재 브랜치 상태 ==="
git branch -vv
```

## 트러블슈팅

### 브랜치 전환 실패
```bash
# 변경사항이 있어서 전환 실패할 때
git stash
git switch target-branch
git stash pop

# 충돌 파일이 있을 때
git status
# 충돌 해결 후
git add .
git switch target-branch
```

### 삭제할 수 없는 브랜치
```bash
# 현재 체크아웃된 브랜치는 삭제 불가
git checkout main
git branch -d target-branch

# 머지되지 않은 브랜치 강제 삭제
git branch -D target-branch
```

### 원격 브랜치 문제
```bash
# 원격 브랜치가 보이지 않을 때
git fetch --all

# 원격 브랜치 추적 설정 문제
git branch --set-upstream-to=origin/feature/branch-name
```