# Docker GUI 도구 가이드

Colima나 Docker CLI만으로는 GUI가 없어 불편할 수 있습니다. 이 문서에서는 Docker를 시각적으로 관리할 수 있는 다양한 GUI 도구들을 소개합니다.

## 1. Portainer (★★★★★ 추천)

Docker를 위한 **가장 강력하고 인기 있는 오픈소스 GUI 관리 도구**입니다.

### 특징
- ✅ 완전 무료 (Community Edition)
- ✅ 웹 기반 (브라우저에서 실행)
- ✅ Colima와 완벽 호환
- ✅ 컨테이너, 이미지, 볼륨, 네트워크 관리
- ✅ Docker Compose 스택 관리
- ✅ 리소스 모니터링
- ✅ 다중 Docker 호스트 관리
- ✅ 한국어 지원

### 설치 및 사용

```bash
# 1. Colima 시작 (아직 시작하지 않았다면)
colima start

# 2. Portainer 컨테이너 실행
docker volume create portainer_data

docker run -d \
  -p 9001:9000 \
  -p 9443:9443 \
  --name portainer \
  --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:latest

# Colima 사용 시 소켓 경로 확인
# ~/.colima/default/docker.sock

# Colima용 실행 명령
docker run -d \
  -p 9001:9000 \
  -p 9443:9443 \
  --name portainer \
  --restart=always \
  -v $HOME/.colima/default/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:latest

# 3. 브라우저에서 접속
# https://localhost:9443
# 또는
# http://localhost:9000

# 4. 초기 관리자 계정 생성
# Username: admin
# Password: 8자 이상 설정
```

### 주요 기능
- **대시보드**: 전체 리소스 현황 한눈에 확인
- **컨테이너 관리**: 시작, 중지, 재시작, 로그 확인
- **이미지 관리**: 빌드, 다운로드, 삭제
- **볼륨 관리**: 생성, 삭제, 브라우징
- **네트워크 관리**: 생성, 삭제, 연결
- **스택 관리**: Docker Compose YAML로 배포
- **템플릿**: 인기 앱 원클릭 배포

### 스크린샷 주요 화면
- 컨테이너 목록 및 상태
- 실시간 리소스 모니터링
- 로그 뷰어
- 터미널 접속

---

## 2. Lazydocker (★★★★☆)

**터미널 기반 TUI(Text User Interface) Docker 관리 도구**로, GUI와 CLI의 중간 형태입니다.

### 특징
- ✅ 완전 무료 & 오픈소스
- ✅ 가볍고 빠름
- ✅ 키보드만으로 조작
- ✅ 실시간 로그 및 통계
- ✅ 컨테이너, 이미지, 볼륨 관리
- ✅ Docker Compose 지원
- ⚠️ 터미널 기반 (브라우저 GUI 아님)

### 설치 및 사용

```bash
# Homebrew로 설치
brew install lazydocker

# 실행
lazydocker

# Colima가 실행 중이면 바로 사용 가능
```

### 주요 단축키
- `Space`: 컨테이너 시작/중지
- `d`: 삭제
- `e`: 컨테이너 환경변수 확인
- `l`: 로그 전체 화면
- `s`: Shell 접속
- `m`: 메인 메뉴
- `q`: 종료

### 언제 사용하면 좋은가?
- 빠르게 Docker 상태 확인이 필요할 때
- 터미널을 선호하는 개발자
- 가벼운 모니터링 도구가 필요할 때

---

## 3. Docker Desktop (★★★★★)

Docker 공식 GUI 도구로, 가장 완성도 높은 솔루션입니다.

### 특징
- ✅ 공식 도구
- ✅ 네이티브 macOS 앱
- ✅ 직관적인 GUI
- ✅ Kubernetes 통합
- ✅ 확장 프로그램 지원
- ✅ 업데이트 관리
- ⚠️ 상업적 사용 시 유료 (기업, 대규모 조직)
- ⚠️ 리소스 사용량 높음

### 설치

```bash
# Homebrew Cask로 설치
brew install --cask docker

# 또는 공식 웹사이트에서 다운로드
# https://www.docker.com/products/docker-desktop/
```

### 라이센스 정책
- **무료**: 개인 사용, 오픈소스 프로젝트, 소규모 기업(직원 250명 미만, 연매출 1천만 달러 미만)
- **유료**: 대기업 및 상업적 사용

### 언제 사용하면 좋은가?
- GUI가 꼭 필요한 경우
- 초보자
- Docker 공식 지원이 필요한 경우
- 확장 프로그램 사용이 필요한 경우

---

## 4. Dockge (★★★★☆)

**Docker Compose에 특화된 가볍고 심플한 웹 GUI**입니다.

### 특징
- ✅ 완전 무료 & 오픈소스
- ✅ Docker Compose 전용
- ✅ 웹 기반
- ✅ 심플하고 빠름
- ✅ YAML 편집기 내장
- ⚠️ Compose 중심 (개별 컨테이너 관리는 제한적)

### 설치 및 사용

```bash
# docker-compose.yml 작성
mkdir -p ~/dockge
cd ~/dockge

cat > docker-compose.yml << 'EOF'
version: "3.8"
services:
  dockge:
    image: louislam/dockge:1
    restart: unless-stopped
    ports:
      - 5001:5001
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./data:/app/data
      - ./stacks:/opt/stacks
EOF

# Colima 사용 시 docker.sock 경로 수정
# - $HOME/.colima/default/docker.sock:/var/run/docker.sock

# 실행
docker-compose up -d

# 접속
# http://localhost:5001
```

### 언제 사용하면 좋은가?
- Docker Compose를 주로 사용하는 경우
- 가볍고 심플한 GUI를 원할 때
- 여러 Compose 스택을 관리할 때

---

## 5. DockStation (★★★☆☆)

**데스크톱 네이티브 Docker GUI 앱**입니다.

### 특징
- ✅ 무료
- ✅ macOS, Windows, Linux 지원
- ✅ 네이티브 앱
- ✅ 프로젝트별 관리
- ⚠️ 업데이트 빈도 낮음
- ⚠️ 일부 기능 제한

### 설치

```bash
# Homebrew Cask로 설치
brew install --cask dockstation

# 또는 공식 웹사이트
# https://dockstation.io/
```

---

## 6. Podman Desktop (★★★★☆)

**Podman 기반의 Docker 호환 GUI 도구**입니다.

### 특징
- ✅ 완전 무료 & 오픈소스
- ✅ Docker 호환
- ✅ Kubernetes 지원
- ✅ rootless 컨테이너
- ⚠️ Docker가 아닌 Podman 사용

### 설치

```bash
# Homebrew로 설치
brew install --cask podman-desktop

# 또는 공식 웹사이트
# https://podman-desktop.io/
```

---

## 7. Rancher Desktop (★★★★☆)

**Kubernetes와 컨테이너 관리를 위한 오픈소스 도구**입니다.

### 특징
- ✅ 완전 무료 & 오픈소스
- ✅ Kubernetes 내장
- ✅ Docker 호환
- ✅ containerd 또는 dockerd 선택 가능
- ⚠️ Kubernetes 중심

### 설치

```bash
# Homebrew Cask로 설치
brew install --cask rancher

# 또는 공식 웹사이트
# https://rancherdesktop.io/
```

---

## 8. Dive (이미지 분석 도구)

**Docker 이미지 레이어를 분석하는 TUI 도구**입니다.

### 특징
- ✅ 무료 & 오픈소스
- ✅ 이미지 레이어 시각화
- ✅ 이미지 크기 최적화
- ✅ 불필요한 파일 찾기

### 설치 및 사용

```bash
# 설치
brew install dive

# 사용
dive [IMAGE_NAME]

# 예시
dive nginx:latest
```

---

## 비교표

| 도구 | 유형 | 가격 | 추천도 | 주요 용도 |
|------|------|------|--------|-----------|
| **Portainer** | 웹 GUI | 무료 | ★★★★★ | 전체 관리 |
| **Lazydocker** | TUI | 무료 | ★★★★☆ | 빠른 모니터링 |
| **Docker Desktop** | 네이티브 앱 | 조건부 무료 | ★★★★★ | 공식 GUI |
| **Dockge** | 웹 GUI | 무료 | ★★★★☆ | Compose 관리 |
| **DockStation** | 네이티브 앱 | 무료 | ★★★☆☆ | 프로젝트 관리 |
| **Podman Desktop** | 네이티브 앱 | 무료 | ★★★★☆ | Docker 대안 |
| **Rancher Desktop** | 네이티브 앱 | 무료 | ★★★★☆ | Kubernetes 통합 |
| **Dive** | TUI | 무료 | ★★★★☆ | 이미지 분석 |

---

## 추천 조합

### 시나리오 1: Colima + Portainer (최고 추천 🏆)
```bash
# 1. Colima 설치 및 시작
brew install colima docker docker-compose
colima start --cpu 4 --memory 8

# 2. Portainer 설치
docker run -d \
  -p 9001:9000 \
  --name portainer \
  --restart=always \
  -v $HOME/.colima/default/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:latest

# 3. 브라우저에서 http://localhost:9000 접속
```

**장점:**
- 가볍고 무료
- 강력한 웹 GUI
- 모든 기능 사용 가능

---

### 시나리오 2: Colima + Lazydocker (개발자 추천)
```bash
# 1. Colima 시작
colima start

# 2. Lazydocker 설치
brew install lazydocker

# 3. 실행
lazydocker
```

**장점:**
- 매우 가볍고 빠름
- 터미널만으로 모든 작업
- 키보드 중심 워크플로우

---

### 시나리오 3: Docker Desktop (초보자 추천)
```bash
# Docker Desktop 설치
brew install --cask docker

# 실행 후 GUI에서 모든 작업
```

**장점:**
- 가장 쉬움
- 공식 지원
- 모든 기능 통합

---

### 시나리오 4: Colima + Portainer + Lazydocker (완벽 조합)
```bash
# 1. 모두 설치
brew install colima docker docker-compose lazydocker

# 2. Colima 시작
colima start --cpu 4 --memory 8

# 3. Portainer 실행
docker run -d \
  -p 9001:9000 \
  --name portainer \
  --restart=always \
  -v $HOME/.colima/default/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:latest

# 4. 상황에 따라 선택
# - 상세한 관리: Portainer (http://localhost:9000)
# - 빠른 확인: lazydocker (터미널)
```

**사용 시나리오:**
- **Portainer**: 복잡한 설정, 스택 배포, 모니터링
- **Lazydocker**: 빠른 상태 확인, 로그 확인, 간단한 조작

---

## 결론 및 추천

### 🥇 1순위: Colima + Portainer
**이유:**
- 완전 무료
- 가장 강력한 웹 GUI
- Colima의 가벼움 + Portainer의 강력함

### 🥈 2순위: Docker Desktop
**이유:**
- 가장 쉬움
- 공식 지원
- 라이센스 조건 충족 시 최선의 선택

### 🥉 3순위: Colima + Lazydocker
**이유:**
- 개발자 친화적
- 매우 가볍고 빠름
- 터미널 중심 워크플로우

---

## 빠른 시작 가이드 (Portainer)

```bash
# 1단계: Colima 설치
brew install colima docker docker-compose

# 2단계: Colima 시작
colima start --cpu 4 --memory 8 --disk 100

# 3단계: Portainer 설치
docker volume create portainer_data
docker run -d \
  -p 9001:9000 \
  --name portainer \
  --restart=always \
  -v $HOME/.colima/default/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:latest

# 4단계: 브라우저에서 접속
open http://localhost:9000

# 5단계: 초기 설정
# - 관리자 계정 생성 (username: admin, password: 8자 이상)
# - "Get Started" 클릭
# - Local 환경 선택

# 완료! 🎉
```

---

## 참고 자료

- [Portainer 공식 문서](https://docs.portainer.io/)
- [Lazydocker GitHub](https://github.com/jesseduffield/lazydocker)
- [Docker Desktop 다운로드](https://www.docker.com/products/docker-desktop/)
- [Dockge GitHub](https://github.com/louislam/dockge)
- [Rancher Desktop](https://rancherdesktop.io/)
- [Podman Desktop](https://podman-desktop.io/)
