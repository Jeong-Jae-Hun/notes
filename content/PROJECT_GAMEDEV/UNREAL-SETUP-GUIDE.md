# 언리얼 엔진 설치 가이드

> 작성: 2026-01-04

## 라이선스 & 비용

### 핵심 요약

| 상황 | 비용 |
|------|------|
| 다운로드 & 학습 | **무료** |
| 게임 개발 중 | **무료** |
| 게임 출시 (수익 $0 ~ $1M) | **무료** |
| 게임 출시 (수익 $1M 초과분) | **5% 로열티** |

### 상세

- **학생 플랜 없음** - 애초에 모든 사람에게 무료
- **학생 인증 불필요** - JetBrains와 다름
- **100만 달러(약 14억원)** 초과 수익부터 로열티 발생
- 취미/학습/인디 게임은 사실상 **평생 무료**

### 로열티 계산 예시

| 총 수익 | Epic에 내는 돈 |
|---------|---------------|
| $500,000 (7억) | $0 |
| $1,000,000 (14억) | $0 |
| $2,000,000 (28억) | $50,000 (초과분 × 5%) |

> [!tip] 결론
> 14억 벌기 전까진 걱정할 필요 없음. 그냥 시작하면 됨.

---

## 설치 방법

### 1. Epic Games Launcher 설치

1. [unrealengine.com/download](https://www.unrealengine.com/download) 접속
2. **Download Epic Games Launcher** 클릭
3. Epic Games 계정 생성 (일반 이메일 OK)
4. Launcher 설치 및 로그인

### 2. Unreal Engine 5 설치

1. Epic Games Launcher 실행
2. 좌측 **Unreal Engine** 탭 클릭
3. **Library** → **+** 버튼 → 최신 버전 선택
4. **Install** 클릭

> [!warning] 용량 주의
> - 설치 용량: 약 **100GB 이상**
> - SSD 권장
> - 프로젝트당 추가 10-50GB

### 3. 시스템 요구사항

| 항목 | 최소 | 권장 |
|------|------|------|
| OS | Windows 10 64-bit | Windows 11 |
| CPU | Quad-core Intel/AMD, 2.5GHz | 6-core, 3.0GHz+ |
| RAM | 8GB | 32GB |
| GPU | DirectX 11/12 호환 | RTX 2070 / RX 5700 이상 |
| 저장공간 | SSD 256GB | SSD 512GB+ |

---

## 첫 프로젝트 생성

### Third Person 템플릿 권장

1. Epic Games Launcher → **Unreal Engine** → **Launch**
2. **Games** 카테고리 선택
3. **Third Person** 템플릿 선택
4. 프로젝트 설정:
   - **Blueprint** 선택 (처음엔 C++ 아님)
   - Starter Content: **체크**
   - 저장 경로 설정
5. **Create** 클릭

### 프로젝트 폴더 구조

```
MyProject/
├── Config/          # 설정 파일
├── Content/         # 에셋 (블루프린트, 메시, 텍스처)
├── Intermediate/    # 빌드 캐시 (Git 제외)
├── Saved/           # 로그, 자동저장 (Git 제외)
└── MyProject.uproject
```

---

## Git 설정 (협업용)

### .gitignore

```gitignore
# Build
Binaries/
DerivedDataCache/
Intermediate/
Saved/

# IDE
.vs/
.vscode/
*.VC.db

# OS
.DS_Store
Thumbs.db
```

### Git LFS (대용량 파일)

```bash
git lfs install
git lfs track "*.uasset"
git lfs track "*.umap"
```

> [!note] 참고
> 협업 레포: https://github.com/Jeong-Jae-Hun/game

---

## 학습 자료

### 공식 자료

- [Epic Games 온라인 러닝](https://dev.epicgames.com/community/unreal-engine/learning)
- [언리얼 공식 문서](https://docs.unrealengine.com/)

### 유튜브

- [Unreal Sensei](https://www.youtube.com/c/UnrealSensei) - 입문자 추천
- [Virtus Learning Hub](https://www.youtube.com/c/VirtusEdu)

---

## 관련 문서

- [[_CONTEXT|현재 진행 상황]]
- [[CURRICULUM|12개월 커리큘럼]]

---

#project/gamedev #type/guide #status/active
