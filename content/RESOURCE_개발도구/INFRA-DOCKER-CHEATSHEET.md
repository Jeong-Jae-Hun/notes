---
tags:
  - type/cheatsheet
  - topic/docker
---

# Docker Cheat Sheet

## 기본 명령어

### Docker 버전 및 정보
```bash
# Docker 버전 확인
docker --version
docker version

# Docker 시스템 정보
docker info

# Docker 디스크 사용량 확인
docker system df
```

## 이미지 관리

### 이미지 조회 및 검색
```bash
# 로컬 이미지 목록
docker images
docker image ls

# 이미지 검색 (Docker Hub)
docker search [IMAGE_NAME]
```

### 이미지 다운로드 및 삭제
```bash
# 이미지 다운로드
docker pull [IMAGE_NAME]:[TAG]

# 이미지 삭제
docker rmi [IMAGE_ID]
docker image rm [IMAGE_ID]

# 사용하지 않는 이미지 모두 삭제
docker image prune -a
```

### 이미지 빌드
```bash
# Dockerfile로 이미지 빌드
docker build -t [IMAGE_NAME]:[TAG] .

# 특정 Dockerfile 지정하여 빌드
docker build -f [DOCKERFILE_PATH] -t [IMAGE_NAME]:[TAG] .

# 캐시 없이 빌드
docker build --no-cache -t [IMAGE_NAME]:[TAG] .
```

### 이미지 태그 및 푸시
```bash
# 이미지 태그 추가
docker tag [IMAGE_ID] [NEW_IMAGE_NAME]:[TAG]

# 이미지 푸시 (Docker Hub)
docker push [IMAGE_NAME]:[TAG]
```

## 컨테이너 관리

### 컨테이너 실행
```bash
# 기본 실행
docker run [IMAGE_NAME]

# 백그라운드 실행
docker run -d [IMAGE_NAME]

# 포트 매핑하여 실행
docker run -p [HOST_PORT]:[CONTAINER_PORT] [IMAGE_NAME]

# 이름 지정하여 실행
docker run --name [CONTAINER_NAME] [IMAGE_NAME]

# 환경변수 설정
docker run -e [KEY]=[VALUE] [IMAGE_NAME]

# 볼륨 마운트
docker run -v [HOST_PATH]:[CONTAINER_PATH] [IMAGE_NAME]

# 인터랙티브 모드 (터미널 접속)
docker run -it [IMAGE_NAME] /bin/bash

# 컨테이너 종료 시 자동 삭제
docker run --rm [IMAGE_NAME]

# 조합 예시
docker run -d -p 8080:80 --name myapp -v $(pwd):/app myimage:latest
```

### 컨테이너 조회
```bash
# 실행 중인 컨테이너 목록
docker ps

# 모든 컨테이너 목록 (중지된 것 포함)
docker ps -a

# 최근 생성된 컨테이너
docker ps -l

# 컨테이너 상세 정보
docker inspect [CONTAINER_ID]
```

### 컨테이너 제어
```bash
# 컨테이너 시작
docker start [CONTAINER_ID]

# 컨테이너 중지
docker stop [CONTAINER_ID]

# 컨테이너 재시작
docker restart [CONTAINER_ID]

# 컨테이너 강제 종료
docker kill [CONTAINER_ID]

# 컨테이너 일시 정지
docker pause [CONTAINER_ID]

# 컨테이너 재개
docker unpause [CONTAINER_ID]
```

### 컨테이너 삭제
```bash
# 컨테이너 삭제
docker rm [CONTAINER_ID]

# 강제 삭제 (실행 중인 컨테이너도 삭제)
docker rm -f [CONTAINER_ID]

# 중지된 컨테이너 모두 삭제
docker container prune
```

### 컨테이너 접속 및 로그
```bash
# 실행 중인 컨테이너에 접속
docker exec -it [CONTAINER_ID] /bin/bash
docker exec -it [CONTAINER_ID] /bin/sh

# 컨테이너에서 명령 실행
docker exec [CONTAINER_ID] [COMMAND]

# 컨테이너 로그 확인
docker logs [CONTAINER_ID]

# 실시간 로그 확인
docker logs -f [CONTAINER_ID]

# 마지막 N개 로그만 확인
docker logs --tail [N] [CONTAINER_ID]
```

### 컨테이너 파일 복사
```bash
# 호스트 → 컨테이너
docker cp [HOST_PATH] [CONTAINER_ID]:[CONTAINER_PATH]

# 컨테이너 → 호스트
docker cp [CONTAINER_ID]:[CONTAINER_PATH] [HOST_PATH]
```

### 컨테이너 통계
```bash
# 리소스 사용량 확인
docker stats

# 특정 컨테이너 통계
docker stats [CONTAINER_ID]
```

## 볼륨 관리

```bash
# 볼륨 목록
docker volume ls

# 볼륨 생성
docker volume create [VOLUME_NAME]

# 볼륨 상세 정보
docker volume inspect [VOLUME_NAME]

# 볼륨 삭제
docker volume rm [VOLUME_NAME]

# 사용하지 않는 볼륨 모두 삭제
docker volume prune
```

## 네트워크 관리

```bash
# 네트워크 목록
docker network ls

# 네트워크 생성
docker network create [NETWORK_NAME]

# 네트워크 상세 정보
docker network inspect [NETWORK_NAME]

# 컨테이너를 네트워크에 연결
docker network connect [NETWORK_NAME] [CONTAINER_ID]

# 컨테이너를 네트워크에서 분리
docker network disconnect [NETWORK_NAME] [CONTAINER_ID]

# 네트워크 삭제
docker network rm [NETWORK_NAME]

# 사용하지 않는 네트워크 모두 삭제
docker network prune
```

## Docker Compose

### 기본 명령어
```bash
# 서비스 시작 (백그라운드)
docker-compose up -d

# 서비스 시작 (포그라운드)
docker-compose up

# 서비스 중지 및 컨테이너 제거
docker-compose down

# 서비스 중지 및 볼륨까지 제거
docker-compose down -v

# 서비스 중지
docker-compose stop

# 서비스 시작
docker-compose start

# 서비스 재시작
docker-compose restart
```

### 서비스 관리
```bash
# 실행 중인 서비스 확인
docker-compose ps

# 서비스 로그 확인
docker-compose logs

# 특정 서비스 로그 확인
docker-compose logs [SERVICE_NAME]

# 실시간 로그 확인
docker-compose logs -f

# 서비스 빌드
docker-compose build

# 캐시 없이 빌드
docker-compose build --no-cache

# 특정 서비스만 실행
docker-compose up [SERVICE_NAME]

# 서비스 스케일링
docker-compose up -d --scale [SERVICE_NAME]=[N]
```

### 설정 파일 관리
```bash
# docker-compose.yml 검증
docker-compose config

# 실행 중인 서비스에서 명령 실행
docker-compose exec [SERVICE_NAME] [COMMAND]
```

## 시스템 정리

```bash
# 중지된 컨테이너 모두 삭제
docker container prune

# 사용하지 않는 이미지 모두 삭제
docker image prune -a

# 사용하지 않는 볼륨 모두 삭제
docker volume prune

# 사용하지 않는 네트워크 모두 삭제
docker network prune

# 시스템 전체 정리 (컨테이너, 이미지, 네트워크, 캐시)
docker system prune

# 볼륨 포함 전체 정리
docker system prune -a --volumes
```

## Dockerfile 주요 명령어

```dockerfile
# 베이스 이미지 지정
FROM [IMAGE]:[TAG]

# 작업 디렉토리 설정
WORKDIR /app

# 파일 복사
COPY [SOURCE] [DEST]
ADD [SOURCE] [DEST]

# 명령 실행 (이미지 빌드 시)
RUN [COMMAND]

# 환경변수 설정
ENV [KEY]=[VALUE]

# 포트 노출
EXPOSE [PORT]

# 볼륨 마운트 포인트
VOLUME [PATH]

# 컨테이너 시작 시 실행할 명령 (덮어쓰기 가능)
CMD ["executable", "param1", "param2"]

# 컨테이너 시작 시 실행할 명령 (덮어쓰기 불가)
ENTRYPOINT ["executable", "param1", "param2"]

# 사용자 지정
USER [USERNAME]

# 빌드 인자
ARG [NAME]=[DEFAULT_VALUE]

# 레이블 추가
LABEL [KEY]=[VALUE]

# 헬스체크
HEALTHCHECK CMD [COMMAND]
```

## 유용한 팁

### 이미지 크기 최적화
```bash
# 멀티 스테이지 빌드 사용
FROM golang:1.20 AS builder
WORKDIR /app
COPY . .
RUN go build -o main .

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/main .
CMD ["./main"]
```

### .dockerignore 활용
```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.DS_Store
```

### 컨테이너 리소스 제한
```bash
# 메모리 제한
docker run -m 512m [IMAGE_NAME]

# CPU 제한
docker run --cpus=".5" [IMAGE_NAME]

# CPU 및 메모리 제한
docker run -m 512m --cpus=".5" [IMAGE_NAME]
```

### 환경변수 파일 사용
```bash
# .env 파일 사용
docker run --env-file .env [IMAGE_NAME]
```

### 컨테이너 자동 재시작 설정
```bash
# 항상 재시작
docker run --restart=always [IMAGE_NAME]

# 실패 시에만 재시작
docker run --restart=on-failure [IMAGE_NAME]

# 최대 재시작 횟수 지정
docker run --restart=on-failure:3 [IMAGE_NAME]
```

## 문제 해결

### 컨테이너가 바로 종료되는 경우
```bash
# 로그 확인
docker logs [CONTAINER_ID]

# 인터랙티브 모드로 디버깅
docker run -it [IMAGE_NAME] /bin/bash
```

### 디스크 공간 부족
```bash
# 디스크 사용량 확인
docker system df

# 불필요한 리소스 정리
docker system prune -a --volumes
```

### 네트워크 문제
```bash
# 컨테이너 네트워크 정보 확인
docker inspect [CONTAINER_ID] | grep IPAddress

# 네트워크 목록 확인
docker network ls
```

### 빌드 캐시 문제
```bash
# 캐시 없이 다시 빌드
docker build --no-cache -t [IMAGE_NAME] .
```

## 보안 모범 사례

1. **최소 권한 원칙**: root 사용자로 실행하지 않기
2. **이미지 스캔**: `docker scan [IMAGE_NAME]`로 취약점 확인
3. **비밀 정보 관리**: Docker secrets 또는 환경변수 사용
4. **최신 베이스 이미지 사용**: 보안 패치가 적용된 최신 버전 사용
5. **읽기 전용 파일시스템**: `--read-only` 플래그 사용

## 참고 자료

- [Docker 공식 문서](https://docs.docker.com/)
- [Docker Hub](https://hub.docker.com/)
- [Dockerfile 레퍼런스](https://docs.docker.com/engine/reference/builder/)
- [Docker Compose 문서](https://docs.docker.com/compose/)
