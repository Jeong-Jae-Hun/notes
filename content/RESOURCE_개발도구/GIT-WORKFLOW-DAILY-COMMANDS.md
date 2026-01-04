# 일상적인 Git 작업 흐름

## 하루 작업 시작하기

### 아침 루틴
```bash
# 1. 메인 브랜치로 이동하여 최신화
git checkout main
git pull origin main

# 2. 어제 작업하던 브랜치 확인
git branch -v
git status

# 3. 새로운 작업 브랜치 생성 (필요시)
git checkout -b feature/today-work

# 4. 스태시된 작업 확인 (있다면)
git stash list
```

### 빠른 상태 확인
```bash
# 전체 상황 파악을 위한 원라이너
git status -s && echo "--- 최근 커밋 ---" && git log --oneline -5

# 브랜치 상태와 원격 추적 정보
git branch -vv

# 변경된 파일 목록만 빠르게
git diff --name-only
```

## 기능 개발 워크플로우

### 새 기능 시작
```bash
# 1. 최신 main에서 브랜치 생성
git checkout main
git pull origin main
git checkout -b feature/user-authentication

# 2. 첫 커밋으로 작업 의도 기록
git commit --allow-empty -m "feat: 사용자 인증 기능 개발 시작"

# 3. 원격에 브랜치 생성
git push -u origin feature/user-authentication
```

### 작업 중 커밋 패턴
```bash
# 작은 단위로 자주 커밋
git add src/auth/login.js
git commit -m "feat: 로그인 폼 컴포넌트 추가"

git add src/auth/validation.js  
git commit -m "feat: 이메일 유효성 검사 로직 추가"

git add tests/auth.test.js
git commit -m "test: 로그인 기능 테스트 케이스 추가"

# 작업 중 백업 커밋
git add -A
git commit -m "wip: 인증 로직 작업 중"
```

### 임시 저장과 브랜치 전환
```bash
# 급하게 다른 작업이 필요할 때
git stash push -m "로그인 기능 작업 중"
git checkout hotfix/critical-bug

# 작업 완료 후 돌아와서
git checkout feature/user-authentication
git stash pop
```

## 협업 워크플로우

### 동료 작업 확인
```bash
# 다른 사람의 브랜치 확인
git fetch origin
git checkout -b review/colleague-feature origin/feature/colleague-feature

# 변경사항 리뷰
git log main..feature/colleague-feature --oneline
git diff main...feature/colleague-feature
```

### 내 작업 공유 준비
```bash
# 히스토리 정리 (푸시 전)
git rebase -i HEAD~3

# 최신 main과 동기화
git fetch origin
git rebase origin/main

# 정리된 히스토리 푸시
git push --force-with-lease origin feature/my-work
```

### Pull Request 전 체크리스트
```bash
# 1. 테스트 실행
npm test  # 또는 해당 프로젝트의 테스트 명령어

# 2. 린트 검사
npm run lint

# 3. 빌드 확인
npm run build

# 4. 최신 main과 충돌 확인
git fetch origin
git merge origin/main --no-commit --no-ff
git merge --abort  # 충돌 확인만 하고 취소

# 5. 커밋 메시지 확인
git log --oneline -10
```

## 버그 수정 워크플로우

### 긴급 버그 수정
```bash
# 1. 현재 작업 임시 저장
git stash push -m "현재 작업 임시 저장"

# 2. 버그 수정 브랜치 생성
git checkout main
git pull origin main
git checkout -b hotfix/login-error

# 3. 버그 수정
# ... 코드 수정 ...
git add .
git commit -m "fix: 로그인 시 이메일 검증 오류 수정"

# 4. 즉시 배포를 위한 푸시
git push -u origin hotfix/login-error

# 5. 원래 작업으로 복귀
git checkout feature/previous-work
git stash pop
```

### 버그 재현 및 분석
```bash
# 문제가 발생한 커밋 찾기
git bisect start
git bisect bad HEAD
git bisect good v1.0.0

# 자동 테스트로 이진 탐색
git bisect run npm test

# 특정 파일의 변경 히스토리 추적
git log --follow --patch -- src/problematic-file.js

# 누가 언제 수정했는지 확인
git blame src/problematic-file.js
```

## 릴리스 워크플로우

### 릴리스 준비
```bash
# 1. 릴리스 브랜치 생성
git checkout main
git pull origin main
git checkout -b release/v1.2.0

# 2. 버전 업데이트
npm version 1.2.0  # package.json 버전 업데이트 + 태그 생성

# 3. 릴리스 노트 생성
git log v1.1.0..HEAD --pretty=format:"- %s" > RELEASE_NOTES.md

# 4. 최종 테스트
npm run test:all
npm run build:prod

# 5. 릴리스 브랜치 푸시
git push -u origin release/v1.2.0
```

### 릴리스 완료
```bash
# 1. main에 머지
git checkout main
git merge --no-ff release/v1.2.0
git tag v1.2.0
git push origin main --tags

# 2. develop에도 머지 (Git Flow 사용시)
git checkout develop
git merge --no-ff release/v1.2.0
git push origin develop

# 3. 릴리스 브랜치 삭제
git branch -d release/v1.2.0
git push origin --delete release/v1.2.0
```

## 일일 정리 작업

### 브랜치 정리
```bash
# 머지된 브랜치 확인
git branch --merged main

# 안전하게 정리 (main, develop 제외)
git branch --merged main | grep -v -E "(main|develop|\*)" | xargs -n 1 git branch -d

# 원격에서 삭제된 브랜치 정리
git remote prune origin

# 고아 브랜치 확인
git for-each-ref --format='%(refname:short) %(upstream)' refs/heads | grep -v origin
```

### 스태시 정리
```bash
# 오래된 스태시 확인
git stash list

# 필요없는 스태시 삭제
git stash drop stash@{2}

# 모든 스태시 정리 (신중하게!)
git stash clear
```

### 저장소 최적화
```bash
# 가비지 컬렉션
git gc

# 압축 최적화 (월 1회 정도)
git gc --aggressive

# 저장소 크기 확인
git count-objects -vH

# 큰 파일 찾기 (필요시)
git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | awk '/^blob/ {print substr($0,6)}' | sort --numeric-sort --key=2 | tail -10
```

## 실수 복구 패턴

### 잘못된 커밋 수정
```bash
# 마지막 커밋 메시지 수정
git commit --amend -m "올바른 커밋 메시지"

# 마지막 커밋에 파일 추가
git add forgotten-file.txt
git commit --amend --no-edit

# 여러 커밋을 하나로 합치기
git rebase -i HEAD~3  # squash 사용
```

### 잘못된 브랜치에서 작업한 경우
```bash
# 현재 변경사항을 올바른 브랜치로 이동
git stash
git checkout correct-branch
git stash pop

# 또는 커밋 후 체리픽
git commit -m "잘못된 브랜치에서 작업"
git checkout correct-branch
git cherry-pick wrong-branch
git checkout wrong-branch
git reset --hard HEAD~1
```

### 실수로 삭제한 브랜치 복구
```bash
# reflog에서 삭제된 브랜치 찾기
git reflog

# 브랜치 복구
git checkout -b recovered-branch commit-hash

# 또는 삭제된 브랜치 즉시 복구
git branch deleted-branch-name HEAD@{1}
```

## 유용한 단축 스크립트

### 일일 작업 시작 스크립트
```bash
#!/bin/bash
# start-work.sh

echo "=== Git 일일 작업 시작 ==="

# 메인 브랜치 최신화
git checkout main
git pull origin main

# 브랜치 상태 확인
echo "=== 현재 브랜치 상태 ==="
git branch -vv

# 스태시 확인
echo "=== 스태시 목록 ==="
git stash list

echo "=== 준비 완료 ==="
```

### 작업 완료 스크립트
```bash
#!/bin/bash
# finish-work.sh

BRANCH=$(git branch --show-current)

echo "=== 작업 완료 점검 ($BRANCH) ==="

# 1. 상태 확인
git status

# 2. 테스트 실행
if command -v npm &> /dev/null; then
    echo "테스트 실행 중..."
    npm test
fi

# 3. 푸시 (변경사항이 있는 경우)
if [[ $(git status --porcelain) ]]; then
    echo "변경사항이 있습니다. 커밋 후 진행하세요."
else
    echo "원격에 푸시 중..."
    git push origin $BRANCH
fi

echo "=== 작업 완료 ==="
```

### 정리 스크립트
```bash
#!/bin/bash
# cleanup.sh

echo "=== Git 저장소 정리 ==="

# 1. 머지된 브랜치 정리
echo "머지된 브랜치 정리 중..."
git branch --merged main | grep -v -E "(main|develop|\*)" | xargs -n 1 git branch -d

# 2. 원격 브랜치 정리
echo "원격 브랜치 정리 중..."
git remote prune origin

# 3. 가비지 컬렉션
echo "가비지 컬렉션 실행 중..."
git gc

echo "=== 정리 완료 ==="
git branch -vv
```

## 팀별 워크플로우 적응

### GitHub Flow 팀
```bash
# 1. 기능 브랜치에서 작업
git checkout -b feature/new-feature

# 2. 작업 완료 후 PR 생성
git push -u origin feature/new-feature

# 3. 리뷰 후 main에 squash merge

# 4. 로컬 정리
git checkout main
git pull origin main
git branch -d feature/new-feature
```

### Git Flow 팀
```bash
# 1. develop에서 기능 브랜치 생성
git checkout develop
git pull origin develop
git checkout -b feature/new-feature

# 2. 기능 완료 후 develop에 머지
git checkout develop
git merge --no-ff feature/new-feature

# 3. 릴리스 시 release 브랜치 생성
git checkout -b release/v1.0 develop
```

### 트렁크 기반 개발 팀
```bash
# 1. main에서 직접 작업 (소규모 변경)
git checkout main
git pull origin main

# 2. 작은 단위로 자주 커밋
git add .
git commit -m "small change"
git push origin main

# 3. 큰 기능은 feature flag 사용
git add .
git commit -m "feat: new feature (behind flag)"
```