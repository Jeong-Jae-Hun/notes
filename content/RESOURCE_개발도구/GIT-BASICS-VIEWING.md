# 히스토리 조회 및 상태 확인

## 로그 조회

### 기본 로그 보기
```bash
# 기본 로그
git log

# 한 줄로 간단하게
git log --oneline

# 그래프와 함께
git log --graph

# 모든 브랜치 로그
git log --all

# 조합 사용
git log --all --graph --oneline
```

### 로그 개수 제한
```bash
# 최근 5개 커밋만
git log -5
git log -n 5

# 최근 10개를 한 줄로
git log --oneline -10

# 더 자세한 정보와 함께
git log -3 --stat
```

### 로그 포맷팅
```bash
# 예쁜 로그 형식
git log --pretty=format:"%h - %an, %ar : %s"

# 커스텀 형식
git log --pretty=format:"%C(yellow)%h%C(reset) - %C(bold blue)%an%C(reset), %C(green)%ar%C(reset) : %s"

# 전체 그래프 로그 (추천)
git log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
```

### 시간 기반 필터링
```bash
# 특정 날짜 이후
git log --since="2023-01-01"
git log --since="2 weeks ago"
git log --since="yesterday"

# 특정 날짜 이전
git log --until="2023-12-31"
git log --until="1 week ago"

# 날짜 범위
git log --since="2023-01-01" --until="2023-12-31"
```

### 작성자 및 메시지 필터링
```bash
# 특정 작성자
git log --author="John Doe"
git log --author="john"

# 여러 작성자
git log --author="john\|jane"

# 커밋 메시지 검색
git log --grep="bug fix"
git log --grep="feat"

# 대소문자 구분 없이 검색
git log --grep="BUG" -i
```

## 특정 커밋 정보

### 커밋 상세 보기
```bash
# 최신 커밋 상세 정보
git show

# 특정 커밋
git show commit-hash
git show HEAD~1    # 이전 커밋
git show HEAD~2    # 2개 이전 커밋

# 브랜치의 최신 커밋
git show main
git show origin/main
```

### 커밋 변경사항만 보기
```bash
# 파일 목록만
git show --name-only HEAD
git show --name-only commit-hash

# 통계 정보와 함께
git show --stat HEAD

# 변경된 파일과 라인 수
git show --shortstat HEAD
```

### 특정 파일의 히스토리
```bash
# 파일 변경 히스토리
git log -- file.txt

# 파일명 변경 추적
git log --follow -- file.txt

# 파일의 각 라인 변경 히스토리
git blame file.txt

# 특정 라인 범위만
git blame -L 10,20 file.txt
```

## 브랜치 및 태그 정보

### 브랜치 정보
```bash
# 모든 브랜치 목록
git branch -a

# 브랜치와 마지막 커밋
git branch -v

# 원격 브랜치와의 관계
git branch -vv

# 머지된 브랜치 확인
git branch --merged
git branch --no-merged
```

### 태그 정보
```bash
# 태그 목록
git tag

# 패턴으로 태그 검색
git tag -l "v1.*"

# 태그 상세 정보
git show v1.0.0

# 태그가 가리키는 커밋
git rev-list -n 1 v1.0.0
```

## 차이점 비교

### 기본 diff
```bash
# 워킹 디렉토리 vs 스테이징
git diff

# 스테이징 vs 마지막 커밋
git diff --staged

# 워킹 디렉토리 vs 마지막 커밋
git diff HEAD
```

### 커밋 간 비교
```bash
# 두 커밋 비교
git diff commit1 commit2

# 현재 브랜치와 다른 브랜치 비교
git diff main
git diff origin/main

# 특정 파일만 비교
git diff main -- file.txt
```

### 브랜치 간 비교
```bash
# 브랜치 간 차이점
git diff main..feature-branch

# 공통 조상 이후 변경사항
git diff main...feature-branch

# 통계 정보만
git diff --stat main..feature-branch
```

## 검색 및 찾기

### 파일 내용 검색
```bash
# 현재 워킹 디렉토리에서 검색
git grep "search term"

# 특정 커밋에서 검색
git grep "search term" HEAD~1

# 파일 타입 지정
git grep "search term" -- "*.js"

# 라인 번호와 함께
git grep -n "search term"
```

### 커밋 찾기
```bash
# 특정 변경사항이 포함된 커밋 찾기
git log -S "function_name"

# 특정 코드가 추가/삭제된 커밋
git log -G "regex_pattern"

# 이진 탐색으로 버그 찾기
git bisect start
git bisect bad
git bisect good commit-hash
```

## 참조 로그 (reflog)

### reflog 보기
```bash
# HEAD 변경 히스토리
git reflog

# 특정 브랜치의 reflog
git reflog show feature-branch

# 더 자세한 정보
git reflog --pretty=fuller
```

### reflog 활용
```bash
# 잃어버린 커밋 복구
git reset --hard HEAD@{2}

# 삭제된 브랜치 복구
git checkout -b recovered-branch HEAD@{2}

# reflog 정리
git reflog expire --all --expire=now
git gc --prune=now
```

## 상태 확인

### 저장소 상태
```bash
# 기본 상태
git status

# 짧은 형태
git status -s

# 브랜치 정보 포함
git status -b

# 무시된 파일도 표시
git status --ignored
```

### 원격 저장소 상태
```bash
# 원격 저장소 정보
git remote -v

# 원격 브랜치 상태
git remote show origin

# 로컬과 원격 브랜치 비교
git status -uno  # 추적되지 않는 파일 숨기기
```

## 유용한 별칭 설정

### 로그 관련 별칭
```bash
# 예쁜 로그
git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"

# 간단한 로그
git config --global alias.ls "log --oneline"

# 브랜치 그래프
git config --global alias.tree "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit --all"
```

### 상태 관련 별칭
```bash
# 상태 확인
git config --global alias.st "status"

# 차이점 확인
git config --global alias.df "diff"

# 브랜치 정보
git config --global alias.br "branch -vv"
```

## 출력 포맷 옵션

### 로그 포맷 옵션
- `%H` : 커밋 해시 (전체)
- `%h` : 커밋 해시 (축약)
- `%an` : 작성자 이름
- `%ae` : 작성자 이메일
- `%ad` : 작성 날짜
- `%ar` : 작성 날짜 (상대적)
- `%s` : 커밋 제목
- `%b` : 커밋 본문
- `%d` : ref 이름

### 색상 옵션
- `%Cred` : 빨간색
- `%Cgreen` : 초록색
- `%Cblue` : 파란색
- `%Cyellow` : 노란색
- `%Creset` : 색상 리셋

## 실용적인 조합 명령어

### 빠른 히스토리 확인
```bash
# 최근 변경사항 한눈에 보기
git log --oneline -10 && echo "--- Status ---" && git status -s

# 브랜치 관계 확인
git log --graph --oneline --all -10

# 파일별 최근 변경사항
git log --stat -5
```

### 디버깅을 위한 조회
```bash
# 특정 기능과 관련된 커밋 찾기
git log --grep="login" --oneline

# 특정 파일의 변경 히스토리
git log --follow --patch -- file.txt

# 코드 변경 추적
git log -S "function_name" --oneline
```