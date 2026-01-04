# 스테이징 영역 관리 및 커밋

## 기본 워크플로우

### 파일 상태 확인
```bash
# 현재 상태 확인
git status

# 간단한 형태로 상태 확인
git status -s
git status --short

# 브랜치 정보와 함께 상태 확인
git status -b
```

### 변경사항 확인
```bash
# 워킹 디렉토리와 스테이징 영역 비교
git diff

# 스테이징 영역과 마지막 커밋 비교
git diff --staged
git diff --cached

# 워킹 디렉토리와 마지막 커밋 비교
git diff HEAD

# 특정 파일만 비교
git diff file.txt
git diff --staged file.txt
```

## 파일 추가 (Staging)

### 기본 추가 명령어
```bash
# 특정 파일 추가
git add file.txt

# 여러 파일 추가
git add file1.txt file2.txt

# 현재 디렉토리의 모든 변경사항 추가
git add .

# 전체 프로젝트의 모든 변경사항 추가 (삭제 포함)
git add -A
git add --all

# 수정된 파일만 추가 (새 파일 제외)
git add -u
git add --update
```

### 패턴 매칭으로 추가
```bash
# 확장자별 추가
git add *.js
git add *.css

# 디렉토리별 추가
git add src/
git add docs/

# 와일드카드 사용
git add "*.txt"  # 모든 하위 디렉토리의 txt 파일
```

### 대화형 추가
```bash
# 대화형 모드로 파일 선택
git add -i
git add --interactive

# 파일 일부분만 추가 (hunk 단위)
git add -p file.txt
git add --patch file.txt

# 새 파일도 패치 모드로 추가
git add -N file.txt  # 추적 시작
git add -p file.txt   # 패치 모드로 추가
```

## 스테이징 영역 관리

### 스테이징에서 제거
```bash
# 특정 파일을 스테이징에서 제거 (파일은 유지)
git reset HEAD file.txt
git restore --staged file.txt

# 모든 파일을 스테이징에서 제거
git reset HEAD
git restore --staged .

# 특정 커밋으로 스테이징 영역 리셋
git reset commit-hash
```

### 워킹 디렉토리 변경사항 취소
```bash
# 특정 파일의 변경사항 취소
git checkout -- file.txt
git restore file.txt

# 모든 변경사항 취소
git checkout -- .
git restore .

# 특정 커밋의 상태로 파일 복원
git checkout commit-hash -- file.txt
git restore --source=commit-hash file.txt
```

## 커밋

### 기본 커밋
```bash
# 기본 커밋 (에디터 열림)
git commit

# 메시지와 함께 커밋
git commit -m "커밋 메시지"

# 추가와 커밋 동시에 (추적 중인 파일만)
git commit -am "수정사항 커밋"

# 빈 커밋 (파일 변경 없이)
git commit --allow-empty -m "빈 커밋"
```

### 커밋 메시지 작성
```bash
# 여러 줄 커밋 메시지
git commit -m "제목: 간단한 요약

상세한 설명을 여기에 작성합니다.
- 변경 사항 1
- 변경 사항 2"

# 템플릿 사용
git config --global commit.template ~/.gitmessage
```

### 커밋 수정
```bash
# 마지막 커밋 메시지 수정
git commit --amend -m "새로운 커밋 메시지"

# 마지막 커밋에 파일 추가
git add forgotten-file.txt
git commit --amend --no-edit

# 마지막 커밋의 작성자 정보 수정
git commit --amend --author="New Author <email@example.com>"
```

## 스태시 (임시 저장)

### 기본 스태시 사용
```bash
# 현재 작업 임시 저장
git stash
git stash save "작업 중인 기능"

# 메시지와 함께 스태시
git stash push -m "로그인 기능 작업 중"

# 추적되지 않는 파일도 포함
git stash -u
git stash --include-untracked

# 무시된 파일까지 포함
git stash -a
git stash --all
```

### 스태시 관리
```bash
# 스태시 목록 보기
git stash list

# 스태시 내용 확인
git stash show
git stash show -p stash@{1}

# 스태시 적용
git stash apply              # 가장 최근 스태시
git stash apply stash@{1}    # 특정 스태시

# 스태시 적용 후 삭제
git stash pop
git stash pop stash@{1}

# 스태시 삭제
git stash drop stash@{1}
git stash clear              # 모든 스태시 삭제
```

### 특별한 스태시 사용법
```bash
# 특정 파일만 스태시
git stash push file.txt

# 스테이징된 변경사항만 스태시
git stash --staged

# 스태시를 새 브랜치로 적용
git stash branch new-branch stash@{1}
```

## 파일 무시하기

### .gitignore 설정
```bash
# .gitignore 파일 생성
touch .gitignore

# 일반적인 .gitignore 패턴
echo "node_modules/" >> .gitignore
echo "*.log" >> .gitignore
echo ".env" >> .gitignore
echo "dist/" >> .gitignore

# 전역 .gitignore 설정
git config --global core.excludesfile ~/.gitignore_global
```

### 이미 추적 중인 파일 무시하기
```bash
# 파일을 추적에서 제거 (파일은 유지)
git rm --cached file.txt

# 디렉토리를 추적에서 제거
git rm -r --cached directory/

# 변경사항 커밋
git commit -m "Remove file from tracking"
```

### 임시로 파일 무시하기
```bash
# 특정 파일의 변경사항 무시
git update-index --skip-worktree file.txt

# 무시 해제
git update-index --no-skip-worktree file.txt

# 로컬에서만 변경사항 무시
git update-index --assume-unchanged file.txt

# 무시 해제
git update-index --no-assume-unchanged file.txt
```

## 실용적인 팁

### 효율적인 추가 패턴
```bash
# 수정된 파일들만 한 번에 추가
git add -u

# 새 파일들을 대화형으로 추가
git add -i

# 특정 타입 파일만 추가
git add '*.{js,ts,jsx,tsx}'
```

### 커밋 전 체크리스트
```bash
# 커밋 전 확인 사항
git status           # 상태 확인
git diff --staged    # 스테이징된 변경사항 확인
git stash list       # 스태시 확인
```

### 자주 사용하는 조합
```bash
# 빠른 커밋 (추적 중인 파일)
git commit -am "빠른 수정"

# 안전한 스태시 후 브랜치 전환
git stash && git checkout main

# 스태시 적용 후 충돌 확인
git stash pop && git status
```