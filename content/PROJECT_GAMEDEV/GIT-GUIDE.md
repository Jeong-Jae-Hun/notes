# Git 협업 가이드

> 친구와 함께 Git으로 협업하는 방법

---

## 기본 개념

```
GitHub (원격)
    ↑↓ push/pull
내 컴퓨터 (로컬)
    ↑↓ push/pull
친구 컴퓨터 (로컬)
```

---

## 일일 작업 흐름

### 1. 작업 시작 전

```bash
# 최신 변경사항 가져오기
git pull
```

### 2. 작업 중

```bash
# 변경된 파일 확인
git status

# 모든 변경사항 스테이징
git add .

# 커밋
git commit -m "feat: 캐릭터 점프 구현"
```

### 3. 작업 끝날 때

```bash
# 푸시
git push
```

---

## 커밋 메시지 규칙

### 형식

```
타입: 설명 (50자 이내)
```

### 타입

| 타입 | 설명 | 예시 |
|------|------|------|
| `feat` | 새 기능 | `feat: 캐릭터 대시 추가` |
| `fix` | 버그 수정 | `fix: 충돌 버그 수정` |
| `docs` | 문서 | `docs: README 업데이트` |
| `style` | 코드 스타일 | `style: 블루프린트 정리` |
| `refactor` | 리팩토링 | `refactor: 이동 로직 분리` |
| `asset` | 에셋 추가 | `asset: 배경음악 추가` |

### 좋은 예시

```
feat: 플레이어 체력 시스템 추가
fix: 벽 통과 버그 수정
asset: 발소리 효과음 추가
docs: 컨트롤 가이드 작성
```

### 나쁜 예시

```
수정함
ㅋㅋ
asdf
```

---

## 충돌 해결

### 충돌 발생 시

```bash
git pull
# CONFLICT 메시지가 나오면...
```

### 해결 방법

1. VS Code에서 충돌 파일 열기
2. 둘 중 하나 선택 또는 수동 병합
3. 저장 후:

```bash
git add .
git commit -m "merge: 충돌 해결"
git push
```

### 언리얼 바이너리 파일 충돌

`.uasset`, `.umap` 파일은 수동 병합 불가능.

**해결책**: 한 쪽을 선택

```bash
# 내 버전 유지
git checkout --ours Content/Maps/MyLevel.umap

# 상대방 버전 사용
git checkout --theirs Content/Maps/MyLevel.umap

git add .
git commit -m "merge: 레벨 파일 충돌 해결"
```

**예방책**: 같은 파일 동시 수정 피하기

---

## 충돌 예방 팁

### 작업 전 소통

- "나 지금 MainCharacter 수정할게"
- "OK, 나는 다른 거 작업할게"

### 자주 커밋 & 푸시

- 작은 단위로 자주 커밋
- 작업 끝나면 바로 푸시

---

## 브랜치 전략 (선택)

> 처음에는 main 브랜치만 사용해도 OK

### 기능 브랜치 사용 시

```bash
# 새 브랜치 생성
git checkout -b feature/dash

# 작업 후 커밋
git add .
git commit -m "feat: 대시 기능"

# 푸시
git push -u origin feature/dash

# GitHub에서 Pull Request 생성
# 리뷰 후 머지
```

---

## 유용한 명령어

### 상태 확인

```bash
git status          # 현재 상태
git log --oneline   # 커밋 히스토리
git diff            # 변경 내용
```

### 실수 복구

```bash
# 마지막 커밋 취소 (변경사항 유지)
git reset --soft HEAD~1

# 스테이징 취소
git reset HEAD <파일>

# 변경사항 버리기 (주의!)
git checkout -- <파일>
```

### 임시 저장

```bash
# 현재 작업 임시 저장
git stash

# 임시 저장 복원
git stash pop
```

---

## 체크리스트

### 작업 시작

- [ ] `git pull` 실행
- [ ] 작업할 파일 소통

### 작업 완료

- [ ] `git add .`
- [ ] `git commit -m "타입: 설명"`
- [ ] `git push`
- [ ] `docs/_CONTEXT.md` 업데이트
