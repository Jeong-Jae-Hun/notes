# 머지와 리베이스 전략

## 머지 (Merge)

머지는 두 개 이상의 브랜치를 합치는 작업입니다. 브랜치의 히스토리를 보존하면서 변경사항을 통합합니다.

### 기본 머지

```bash
# 현재 브랜치에 다른 브랜치 머지
git checkout main
git merge feature/new-feature

# 머지 커밋 메시지와 함께
git merge feature/new-feature -m "Merge feature: 새로운 기능 추가"

# 현재 브랜치 확인 후 머지
git branch --show-current
git merge feature/new-feature
```

### 머지 타입

#### Fast-Forward 머지
```bash
# Fast-Forward 머지 (기본값)
git merge feature/linear-feature

# Fast-Forward 머지 강제 실행
git merge --ff-only feature/linear-feature

# Fast-Forward 머지 방지 (항상 머지 커밋 생성)
git merge --no-ff feature/linear-feature
```

#### 3-way 머지
```bash
# 분기된 브랜치 머지 (자동으로 3-way 머지)
git merge feature/diverged-feature

# 머지 커밋 메시지 자동 생성
git merge --no-edit feature/diverged-feature

# 머지 전 변경사항 미리 보기
git diff HEAD...feature/diverged-feature
```

### 머지 전략

#### Recursive 전략 (기본값)
```bash
# 기본 머지 전략
git merge feature/branch

# Recursive 전략 명시적 사용
git merge -s recursive feature/branch

# 충돌 시 현재 브랜치 우선
git merge -s recursive -X ours feature/branch

# 충돌 시 머지할 브랜치 우선
git merge -s recursive -X theirs feature/branch
```

#### Octopus 전략 (다중 브랜치 머지)
```bash
# 여러 브랜치 동시 머지
git merge feature1 feature2 feature3

# Octopus 전략 명시적 사용
git merge -s octopus feature1 feature2 feature3
```

### 머지 취소

```bash
# 머지 중 취소
git merge --abort

# 머지 완료 후 취소 (마지막 커밋이 머지 커밋인 경우)
git reset --hard HEAD~1

# 안전한 머지 취소 (reflog 사용)
git reflog
git reset --hard HEAD@{1}
```

## 리베이스 (Rebase)

리베이스는 브랜치의 베이스를 변경하여 커밋 히스토리를 선형으로 만듭니다.

### 기본 리베이스

```bash
# 현재 브랜치를 main 기준으로 리베이스
git checkout feature/branch
git rebase main

# 한 번에 실행
git rebase main feature/branch

# 원격 브랜치 기준으로 리베이스
git rebase origin/main
```

### 리베이스 과정 제어

```bash
# 리베이스 계속
git rebase --continue

# 현재 커밋 건너뛰기
git rebase --skip

# 리베이스 중단
git rebase --abort

# 리베이스 상태 확인
git status
```

### 인터랙티브 리베이스

```bash
# 최근 3개 커밋 수정
git rebase -i HEAD~3

# 특정 브랜치 기준으로 인터랙티브 리베이스
git rebase -i main

# 루트 커밋부터 리베이스
git rebase -i --root
```

#### 인터랙티브 리베이스 명령어
```bash
# 에디터에서 사용하는 명령어들
pick 1234567 Original commit message     # 커밋을 그대로 사용
reword 1234567 Original commit message   # 커밋 메시지 수정
edit 1234567 Original commit message     # 커밋 내용 수정
squash 1234567 Original commit message   # 이전 커밋과 합치기 (메시지 수정)
fixup 1234567 Original commit message    # 이전 커밋과 합치기 (메시지 버리기)
drop 1234567 Original commit message     # 커밋 삭제
exec command                              # 셸 명령어 실행
```

### 고급 리베이스

#### onto 리베이스
```bash
# 특정 지점부터 다른 지점으로 리베이스
git rebase --onto main feature-base feature-tip

# 커밋 범위를 다른 브랜치로 이동
git rebase --onto new-base old-base current-branch
```

#### 자동 스쿼시
```bash
# 임시 커밧을 자동으로 이전 커밋과 합치기
git commit --fixup=commit-hash
git rebase -i --autosquash main

# 자동 스쿼시 설정
git config --global rebase.autosquash true
```

## 머지 vs 리베이스 비교

### 언제 머지를 사용할까?

#### 장점
- 히스토리가 보존됨
- 브랜치의 맥락이 명확함
- 안전함 (원본 커밋 보존)
- 팀원들과 공유된 브랜치에 안전

#### 사용 상황
```bash
# 팀과 공유하는 브랜치
git checkout main
git merge feature/team-feature

# 릴리스 브랜치 통합
git checkout release/v1.0
git merge hotfix/critical-bug

# 기능 완성 후 메인 브랜치에 통합
git checkout main
git merge --no-ff feature/completed-feature
```

### 언제 리베이스를 사용할까?

#### 장점
- 깔끔한 선형 히스토리
- 이해하기 쉬운 커밋 그래프
- 의미 있는 커밋만 남길 수 있음

#### 사용 상황
```bash
# 개인 작업 브랜치 정리
git checkout feature/my-work
git rebase main

# 커밋 히스토리 정리
git rebase -i HEAD~5

# 최신 변경사항 적용 후 푸시
git fetch origin
git rebase origin/main
git push --force-with-lease
```

## 충돌 해결

### 머지 충돌 해결

```bash
# 머지 중 충돌 발생
git merge feature/branch
# 충돌 파일 수정 후
git add conflicted-file.txt
git commit

# 머지 도구 사용
git mergetool

# 충돌 해결 후 상태 확인
git status
```

### 리베이스 충돌 해결

```bash
# 리베이스 중 충돌 발생
git rebase main
# 충돌 파일 수정 후
git add conflicted-file.txt
git rebase --continue

# 각 커밋마다 충돌 해결
# ... 반복 ...
```

### 충돌 예방

```bash
# 머지 전 미리 확인
git diff HEAD...feature/branch

# 리베이스 전 백업 브랜치 생성
git branch backup-branch
git rebase main

# 자동 머지 설정
git config merge.tool vimdiff
git config mergetool.keepBackup false
```

## 실전 워크플로우

### GitHub Flow 스타일

```bash
# 1. 새 기능 브랜치 생성
git checkout main
git pull origin main
git checkout -b feature/new-feature

# 2. 작업 및 커밋
git add .
git commit -m "feat: 새 기능 구현"

# 3. 원격에 푸시
git push -u origin feature/new-feature

# 4. Pull Request 생성 후 리뷰

# 5. 머지 (GitHub에서 Squash and Merge)

# 6. 로컬 정리
git checkout main
git pull origin main
git branch -d feature/new-feature
```

### Git Flow 스타일

```bash
# 기능 개발 시작
git checkout develop
git pull origin develop
git checkout -b feature/new-feature

# 작업 완료 후
git checkout develop
git merge --no-ff feature/new-feature
git push origin develop
git branch -d feature/new-feature

# 릴리스 준비
git checkout -b release/v1.0 develop
# 버그 수정 등...
git checkout main
git merge --no-ff release/v1.0
git tag v1.0
git checkout develop
git merge --no-ff release/v1.0
```

### 개인 작업 히스토리 정리

```bash
# 커밋 히스토리 정리 후 푸시
git rebase -i HEAD~5    # 최근 5개 커밋 정리
git push --force-with-lease origin feature/branch

# 메인 브랜치 최신 변경사항 반영
git fetch origin
git rebase origin/main
git push --force-with-lease origin feature/branch
```

## 고급 테크닉

### 체리픽 (Cherry-pick)

```bash
# 다른 브랜치에서 특정 커밋만 가져오기
git cherry-pick commit-hash

# 여러 커밋 체리픽
git cherry-pick commit1 commit2 commit3

# 범위로 체리픽
git cherry-pick start-commit..end-commit

# 체리픽 중 충돌 해결
git cherry-pick commit-hash
# 충돌 해결 후
git add .
git cherry-pick --continue
```

### 부분 리베이스

```bash
# 특정 파일만 리베이스
git rebase -i HEAD~3
# edit 선택 후
git reset HEAD~
git add specific-file.txt
git commit -m "수정된 메시지"
git rebase --continue
```

### 머지 커밋 되돌리기

```bash
# 머지 커밋 되돌리기 (부모 1번 기준)
git revert -m 1 merge-commit-hash

# 머지 커밋 되돌리기 (부모 2번 기준)
git revert -m 2 merge-commit-hash
```

## 설정 및 별칭

### 유용한 설정

```bash
# 머지 시 Fast-Forward 방지
git config --global merge.ff false

# 리베이스 시 자동 스쿼시 활성화
git config --global rebase.autosquash true

# 머지 도구 설정
git config --global merge.tool vimdiff

# Pull 시 리베이스 사용
git config --global pull.rebase true
```

### 유용한 별칭

```bash
# 머지 관련 별칭
git config --global alias.mergeff "merge --no-ff"
git config --global alias.mergeabort "merge --abort"

# 리베이스 관련 별칭
git config --global alias.rb "rebase"
git config --global alias.rbi "rebase -i"
git config --global alias.rbc "rebase --continue"
git config --global alias.rba "rebase --abort"

# 로그 관련 별칭
git config --global alias.graph "log --graph --oneline --all"
git config --global alias.conflicts "diff --name-only --diff-filter=U"
```

## 트러블슈팅

### 일반적인 문제들

```bash
# "fatal: refusing to merge unrelated histories"
git merge --allow-unrelated-histories feature/branch

# 리베이스 후 푸시 거부
git push --force-with-lease origin feature/branch

# 머지 도구가 실행되지 않을 때
git config --global merge.tool vimdiff
git mergetool

# 리베이스 중 같은 충돌이 반복될 때
git rebase --skip
# 또는
git rebase --abort
```

### 복구 방법

```bash
# 잘못된 머지 복구
git reflog
git reset --hard HEAD@{1}

# 잘못된 리베이스 복구
git reflog
git reset --hard HEAD@{5}

# 리베이스 전 상태로 복구
git reset --hard ORIG_HEAD
```