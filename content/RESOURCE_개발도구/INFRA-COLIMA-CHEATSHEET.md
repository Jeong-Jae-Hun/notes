---
tags:
  - type/cheatsheet
  - topic/docker
  - topic/devops
---

# Colima Cheat Sheet

## Colima란?

Colima는 **macOS와 Linux에서 컨테이너 런타임을 실행할 수 있게 해주는 경량 오픈소스 도구**입니다.
Docker Desktop의 가볍고 무료인 대안으로, Lima(Linux Virtual Machines)를 기반으로 합니다.

### 주요 특징
- ✅ 완전 무료 & 오픈소스
- ✅ Docker Desktop보다 가벼움
- ✅ Docker CLI와 완벽 호환
- ✅ M1/M2/M3 Mac (Apple Silicon) 지원
- ✅ Docker, containerd, Kubernetes 지원
- ❌ GUI 없음 (CLI만 사용)

## 설치

### 1. Homebrew를 통한 설치 (권장)

```bash
# Colima 설치
brew install colima

# Docker CLI 설치 (아직 설치하지 않았다면)
brew install docker

# Docker Compose 설치 (선택사항)
brew install docker-compose

# 설치 확인
colima version
docker --version
```

### 2. 바이너리 직접 설치

```bash
# 최신 버전 다운로드 및 설치
curl -LO https://github.com/abiosoft/colima/releases/latest/download/colima-Darwin-x86_64
sudo install colima-Darwin-x86_64 /usr/local/bin/colima
rm colima-Darwin-x86_64

# Apple Silicon (M1/M2/M3)의 경우
curl -LO https://github.com/abiosoft/colima/releases/latest/download/colima-Darwin-arm64
sudo install colima-Darwin-arm64 /usr/local/bin/colima
rm colima-Darwin-arm64
```

## 기본 사용법

### Colima 시작 및 중지

```bash
# 기본 설정으로 시작
colima start

# 리소스를 지정하여 시작
colima start --cpu 4 --memory 8 --disk 100

# 아키텍처 지정 (Apple Silicon에서 x86_64 필요 시)
colima start --arch x86_64

# 런타임 지정 (기본값: docker)
colima start --runtime docker
colima start --runtime containerd

# Kubernetes와 함께 시작
colima start --kubernetes

# 중지
colima stop

# 재시작
colima restart

# 강제 종료
colima stop --force
```

### 상태 확인

```bash
# Colima 상태 확인
colima status

# 상세 정보 확인
colima list

# 버전 확인
colima version
```

### Colima 삭제

```bash
# Colima VM 삭제 (데이터 포함)
colima delete

# 강제 삭제
colima delete --force
```

## 고급 설정

### 프로파일 사용 (여러 환경 관리)

```bash
# 특정 프로파일로 시작
colima start --profile development
colima start --profile production

# 프로파일 목록 확인
colima list

# 특정 프로파일 중지
colima stop --profile development

# 특정 프로파일 삭제
colima delete --profile development
```

### 리소스 설정

```bash
# CPU 코어 수 지정 (기본값: 2)
colima start --cpu 4

# 메모리 크기 지정 (기본값: 2GB)
colima start --memory 8

# 디스크 크기 지정 (기본값: 60GB)
colima start --disk 100

# 조합 예시
colima start --cpu 4 --memory 8 --disk 100
```

### 네트워크 설정

```bash
# 네트워크 주소 지정
colima start --network-address

# DNS 서버 지정
colima start --dns 8.8.8.8 --dns 8.8.4.4
```

### 볼륨 마운트 설정

```bash
# 추가 디렉토리 마운트
colima start --mount /Users/username/projects:w

# 읽기 전용 마운트
colima start --mount /Users/username/data:r

# 기본적으로 $HOME이 자동 마운트됨
```

### SSH 접속

```bash
# Colima VM에 SSH 접속
colima ssh

# 특정 프로파일의 VM에 접속
colima ssh --profile development

# SSH를 통해 명령 실행
colima ssh -- uname -a
colima ssh -- docker ps
```

## Docker 사용

Colima가 실행 중이면 일반적인 Docker 명령어를 그대로 사용할 수 있습니다.

```bash
# Colima 시작
colima start

# Docker 명령어 사용
docker ps
docker run hello-world
docker-compose up -d

# 컨테이너 빌드 및 실행
docker build -t myapp .
docker run -p 8080:80 myapp
```

## Kubernetes 사용

```bash
# Kubernetes와 함께 시작
colima start --kubernetes

# kubectl 설치 (아직 설치하지 않았다면)
brew install kubectl

# Kubernetes 클러스터 확인
kubectl cluster-info
kubectl get nodes

# Kubernetes 비활성화하고 재시작
colima stop
colima start
```

## 설정 파일 편집

```bash
# 설정 파일 경로
~/.colima/default/colima.yaml

# 설정 파일 직접 편집
vim ~/.colima/default/colima.yaml

# 프로파일별 설정 파일
~/.colima/{profile-name}/colima.yaml
```

### 설정 파일 예시 (colima.yaml)

```yaml
# CPU 코어 수
cpu: 4

# 메모리 (GB)
memory: 8

# 디스크 크기 (GB)
disk: 100

# 아키텍처 (x86_64, aarch64)
arch: aarch64

# 컨테이너 런타임 (docker, containerd)
runtime: docker

# Kubernetes 활성화
kubernetes:
  enabled: false
  version: v1.28.3

# 포트 포워딩
forwardAgent: false

# 추가 마운트
mounts:
  - location: ~/projects
    writable: true
  - location: /tmp/data
    writable: false

# 환경변수
env:
  DOCKER_BUILDKIT: "1"
```

## 문제 해결

### Colima가 시작되지 않을 때

```bash
# 로그 확인
colima status
cat ~/.colima/default/colima.log

# 기존 인스턴스 삭제 후 재시작
colima delete
colima start
```

### Docker 명령어가 작동하지 않을 때

```bash
# Docker context 확인
docker context ls

# Colima context로 변경
docker context use colima

# 또는 환경변수 설정
export DOCKER_HOST=unix://$HOME/.colima/default/docker.sock
```

### 디스크 공간 부족

```bash
# Colima VM 내부 디스크 정리
colima ssh
docker system prune -a --volumes
exit

# 또는
colima ssh -- docker system prune -a --volumes
```

### 포트 충돌 문제

```bash
# 다른 포트로 SSH 포트 변경
colima start --ssh-port 2222
```

### 네트워크 문제

```bash
# Colima 재시작
colima restart

# 완전히 삭제 후 재설치
colima delete
colima start
```

## 성능 최적화

### 빌드 성능 향상

```bash
# BuildKit 활성화 (환경변수)
export DOCKER_BUILDKIT=1

# 또는 Docker Compose에서
export COMPOSE_DOCKER_CLI_BUILD=1
export DOCKER_BUILDKIT=1
```

### 리소스 조정

```bash
# 현재 프로젝트에 맞게 리소스 조정
colima stop
colima start --cpu 6 --memory 12 --disk 120
```

### 캐시 위치 변경

```bash
# SSD에 캐시 저장되도록 설정
# ~/.docker/config.json 편집
{
  "builder": {
    "gc": {
      "defaultKeepStorage": "20GB"
    }
  }
}
```

## 유용한 팁

### 1. 자동 시작 설정

```bash
# macOS 로그인 시 자동 시작 (launchd 사용)
# ~/Library/LaunchAgents/com.colima.plist 생성

cat > ~/Library/LaunchAgents/com.colima.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.colima</string>
    <key>ProgramArguments</key>
    <array>
        <string>/opt/homebrew/bin/colima</string>
        <string>start</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>
EOF

launchctl load ~/Library/LaunchAgents/com.colima.plist
```

### 2. Shell Alias 설정

```bash
# ~/.zshrc 또는 ~/.bashrc에 추가
alias colima-start='colima start --cpu 4 --memory 8 --disk 100'
alias colima-stop='colima stop'
alias colima-restart='colima restart'
alias colima-status='colima status'
alias colima-ssh='colima ssh'
```

### 3. 여러 프로파일 관리

```bash
# 개발 환경
colima start --profile dev --cpu 2 --memory 4

# 프로덕션 환경 테스트
colima start --profile prod --cpu 4 --memory 8

# 전환
colima stop --profile dev
colima start --profile prod
```

### 4. Docker Hub 로그인 유지

```bash
# Colima 시작 후 Docker 로그인
colima start
docker login
```

### 5. 볼륨 퍼포먼스 최적화

```bash
# 캐시된 마운트 사용 (docker run 시)
docker run -v $(pwd):/app:cached myimage
```

## Colima vs Docker Desktop 비교

| 특징 | Colima | Docker Desktop |
|------|--------|----------------|
| 가격 | 무료 | 기업 사용 시 유료 |
| GUI | ❌ | ✅ |
| 리소스 사용량 | 낮음 | 높음 |
| 시작 속도 | 빠름 | 느림 |
| 설정 복잡도 | 보통 | 쉬움 |
| CLI 호환성 | ✅ | ✅ |
| Kubernetes | ✅ | ✅ |
| 확장 프로그램 | ❌ | ✅ |
| 라이센스 | MIT | 제한적 |

## 언제 Colima를 사용하면 좋은가?

✅ **사용 권장:**
- Docker Desktop 라이센스 비용 절감
- 가벼운 개발 환경 필요
- CLI만으로 충분한 경우
- 리소스 절약이 중요할 때
- 여러 Docker 환경 전환 필요

❌ **사용 비권장:**
- GUI가 꼭 필요한 경우
- Docker Desktop의 확장 프로그램 사용
- 팀 전체가 Docker Desktop 사용 중
- 초보자에게 복잡할 수 있음

## 참고 자료

- [Colima GitHub](https://github.com/abiosoft/colima)
- [Lima GitHub](https://github.com/lima-vm/lima)
- [Docker 공식 문서](https://docs.docker.com/)

## 빠른 시작 가이드

```bash
# 1. 설치
brew install colima docker docker-compose

# 2. 시작
colima start --cpu 4 --memory 8 --disk 100

# 3. 확인
docker ps

# 4. 테스트
docker run hello-world

# 5. 중지
colima stop

# 성공! 🎉
```
