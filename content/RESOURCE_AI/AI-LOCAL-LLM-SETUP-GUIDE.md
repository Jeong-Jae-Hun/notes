# 로컬 LLM 올인원 세팅 가이드

> 작성일: 2025-12-15
> 환경: Windows 서버 (RTX 5080) + Mac 클라이언트 + 내부망/VPN
> 참고: 중국 모델(Qwen, DeepSeek 등) 제외, 서방 모델만 사용

## 개요

Windows PC(RTX 5080)를 LLM 서버로 두고, Mac에서 개발하면서 원격으로 LLM을 활용하는 환경을 구축합니다.

```
┌─────────────────────────────────────────────────────────────┐
│                      내부 네트워크                           │
│                                                             │
│   ┌─────────────────┐           ┌─────────────────┐        │
│   │  Windows PC     │           │  Mac (개발용)    │        │
│   │  - RTX 5080     │◄─────────►│  - VS Code      │        │
│   │  - Ollama       │  LAN/VPN  │  - Continue     │        │
│   │  - Open WebUI   │           │  - Aider        │        │
│   └─────────────────┘           └─────────────────┘        │
│         :11434                                              │
│         :3000                                               │
│                                                             │
│   ┌─────────────────┐                                       │
│   │  iptime 공유기   │ ◄─── WireGuard VPN ─── 외부 접속     │
│   └─────────────────┘                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Part 1: 추천 모델 (중국 모델 제외)

### 중국 모델 목록 (사용하지 않음)

| 모델 | 회사 | 국가 |
|------|------|------|
| Qwen | Alibaba | 중국 |
| DeepSeek | DeepSeek | 중국 |
| Yi | 01.AI | 중국 |
| Baichuan | Baichuan | 중국 |
| ChatGLM | Zhipu AI | 중국 |

### 추천 모델 (서방 모델)

#### 코딩 특화

| 모델 | 회사 | 국가 | 크기 | VRAM | 특징 |
|------|------|------|------|------|------|
| `codestral:22b` | Mistral AI | 프랑스 | 22B | ~14GB | **코딩 최강**, 80+ 언어, 256k 컨텍스트 |
| `codellama:34b` | Meta | 미국 | 34B | ~20GB | 안정적, 100k 컨텍스트 |
| `codellama:13b` | Meta | 미국 | 13B | ~8GB | 가성비 |
| `codellama:7b` | Meta | 미국 | 7B | ~5GB | 경량, 빠른 응답 |
| `starcoder2:15b` | BigCode | 국제 | 15B | ~10GB | 오픈소스 컨소시엄, IDE 통합 우수 |
| `starcoder2:3b` | BigCode | 국제 | 3B | ~3GB | 자동완성용 최적 |

#### 범용

| 모델 | 회사 | 국가 | 크기 | VRAM | 특징 |
|------|------|------|------|------|------|
| `llama3.2:8b` | Meta | 미국 | 8B | ~6GB | 범용 최고, 빠른 응답 |
| `llama3.2:70b-q4` | Meta | 미국 | 70B | ~40GB | 최고 품질 (양자화) |
| `llama3.3:70b-q4` | Meta | 미국 | 70B | ~40GB | 최신, 70B 중 최강 |
| `mistral:7b` | Mistral AI | 프랑스 | 7B | ~5GB | 경량, 효율적 |
| `mixtral:8x7b` | Mistral AI | 프랑스 | 47B | ~26GB | MoE, 품질 우수 |
| `gemma2:9b` | Google | 미국 | 9B | ~6GB | 균형 잡힌 성능 |
| `gemma2:27b` | Google | 미국 | 27B | ~17GB | 고품질 |
| `phi3:14b` | Microsoft | 미국 | 14B | ~9GB | 작지만 강력 |

### RTX 5080 (16GB VRAM) 추천 조합

```
메인 코딩:     codestral:22b (~14GB) - 코딩 품질 최고
자동완성:      starcoder2:3b (~3GB)  - 빠른 응답
경량/게임중:   mistral:7b (~5GB)     - VRAM 절약
범용 대화:     llama3.2:8b (~6GB)    - 한국어 괜찮음
```

> [!warning] 한국어 성능 주의
> 서방 모델은 중국 모델(Qwen)보다 한국어 성능이 다소 떨어집니다.
> 한국어가 중요하다면 `llama3.2`나 `gemma2`가 상대적으로 낫습니다.

---

## Part 2: VRAM 우선순위 관리 (게임 vs LLM)

### 자동 관리 원리

**NVIDIA 드라이버가 자동으로 VRAM을 관리합니다.** 게임이 VRAM을 요청하면 LLM 모델은 시스템 RAM으로 밀려납니다. Ollama 설정으로 더 적극적으로 관리 가능:

### 방법 1: KEEP_ALIVE로 자동 언로드 (권장)

```yaml
# docker-compose.yml
environment:
  - OLLAMA_KEEP_ALIVE=5m  # 5분 미사용시 VRAM에서 자동 해제
```

롤 시작 → 5분 후 모델이 VRAM에서 내려감 → 게임 쾌적

### 방법 2: 게임 전 수동 언로드

```powershell
# PowerShell에서 (게임 시작 전)
curl http://localhost:11434/api/generate -Method POST -Body '{"model": "codestral:22b", "keep_alive": 0}'
```

### 방법 3: 게임 감지 자동화 스크립트

```powershell
# C:\Scripts\game-llm-manager.ps1
$games = @("League of Legends", "RiotClientServices", "VALORANT", "steam")

while ($true) {
    $gameRunning = $false
    foreach ($game in $games) {
        if (Get-Process -Name $game -ErrorAction SilentlyContinue) {
            $gameRunning = $true
            break
        }
    }

    if ($gameRunning) {
        # 모든 모델 언로드
        try {
            $models = @("codestral:22b", "starcoder2:3b", "llama3.2:8b")
            foreach ($model in $models) {
                Invoke-RestMethod -Uri "http://localhost:11434/api/generate" `
                    -Method POST `
                    -Body "{`"model`": `"$model`", `"keep_alive`": 0}" `
                    -ErrorAction SilentlyContinue
            }
            Write-Host "$(Get-Date): Game detected, models unloaded"
        } catch {}
    }

    Start-Sleep -Seconds 30
}
```

작업 스케줄러 등록:
```powershell
# 관리자 권한으로 실행
$action = New-ScheduledTaskAction -Execute "PowerShell.exe" `
    -Argument "-WindowStyle Hidden -ExecutionPolicy Bypass -File C:\Scripts\game-llm-manager.ps1"
$trigger = New-ScheduledTaskTrigger -AtLogon
Register-ScheduledTask -TaskName "GameLLMManager" -Action $action -Trigger $trigger
```

### VRAM 사용량 참고

| 상황 | VRAM 사용량 |
|------|-------------|
| 롤 (1440p) | ~4-5GB |
| codestral:22b | ~14GB |
| mistral:7b | ~5GB |
| starcoder2:3b | ~3GB |
| **롤 + mistral:7b** | ~10GB ✅ |
| **롤 + codestral:22b** | ~19GB ❌ |

---

## Part 3: Windows 서버 세팅

### Step 1: WSL2 설치

PowerShell (관리자):

```powershell
# WSL 설치
wsl --install -d Ubuntu-24.04

# 업데이트 (GPU 지원 필수)
wsl --update

# 기본 버전 설정
wsl --set-default-version 2
```

재부팅 후 Ubuntu 초기 설정 (사용자명/비밀번호)

### Step 2: WSL 메모리 설정

`%USERPROFILE%\.wslconfig` 파일 생성:

```ini
[wsl2]
memory=24GB
swap=8GB
localhostForwarding=true
```

### Step 3: Docker 설치 (WSL2 내부)

```bash
# Docker 설치
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 사용자 그룹 추가
sudo usermod -aG docker $USER

# 재로그인
logout
```

### Step 4: NVIDIA Container Toolkit 설치

```bash
# GPG 키 추가
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | \
  sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg

# 저장소 추가
curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
  sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
  sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

# 설치
sudo apt-get update
sudo apt-get install -y nvidia-container-toolkit

# Docker에 등록
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker
```

### Step 5: GPU 테스트

```bash
docker run --rm --gpus all nvidia/cuda:12.2.0-base-ubuntu22.04 nvidia-smi
```

### Step 6: Ollama + Open WebUI 배포

```bash
mkdir -p ~/local-llm && cd ~/local-llm
```

`docker-compose.yml`:

```yaml
version: '3.8'

services:
  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    ports:
      - "0.0.0.0:11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    environment:
      - OLLAMA_HOST=0.0.0.0
      - OLLAMA_ORIGINS=*
      - OLLAMA_KEEP_ALIVE=5m
      - OLLAMA_NUM_PARALLEL=4
      - OLLAMA_MAX_LOADED_MODELS=2
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
    restart: unless-stopped

  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    container_name: open-webui
    ports:
      - "0.0.0.0:3000:8080"
    volumes:
      - open_webui_data:/app/backend/data
    environment:
      - OLLAMA_BASE_URL=http://ollama:11434
      - WEBUI_AUTH=true
    depends_on:
      - ollama
    restart: unless-stopped

volumes:
  ollama_data:
  open_webui_data:
```

```bash
docker compose up -d
docker compose logs -f
```

### Step 7: Windows 방화벽 설정

PowerShell (관리자):

```powershell
# Ollama API
New-NetFirewallRule -DisplayName "Ollama API" `
    -Direction Inbound -Protocol TCP -LocalPort 11434 `
    -Action Allow -Profile Private

# Open WebUI
New-NetFirewallRule -DisplayName "Open WebUI" `
    -Direction Inbound -Protocol TCP -LocalPort 3000 `
    -Action Allow -Profile Private
```

### Step 8: 모델 다운로드

```bash
# 코딩 메인 (Mistral, 프랑스)
docker exec -it ollama ollama pull codestral:22b

# 자동완성용 (BigCode, 국제)
docker exec -it ollama ollama pull starcoder2:3b

# 범용 (Meta, 미국)
docker exec -it ollama ollama pull llama3.2:8b

# 경량/게임중 (Mistral, 프랑스)
docker exec -it ollama ollama pull mistral:7b

# 코딩 대안 (Meta, 미국)
docker exec -it ollama ollama pull codellama:13b
```

### Step 9: Windows IP 확인

```powershell
ipconfig
# IPv4 주소 확인 (예: <YOUR_LOCAL_IP>)
```

---

## Part 4: Mac 클라이언트 세팅

### Step 1: 환경 변수 설정

`~/.zshrc`:

```bash
# Windows 서버 IP로 변경 (내부망)
export OLLAMA_HOST="http://<YOUR_LOCAL_IP>:11434"
export OLLAMA_API_BASE="http://<YOUR_LOCAL_IP>:11434"

# VPN 접속시 (iptime WireGuard 기본 대역)
# export OLLAMA_HOST="http://<YOUR_VPN_IP>:11434"
```

```bash
source ~/.zshrc
```

### Step 2: 연결 테스트

```bash
curl http://<YOUR_LOCAL_IP>:11434/api/tags
```

### Step 3: VS Code + Continue 설치

```bash
code --install-extension Continue.continue
```

`~/.continue/config.json`:

```json
{
  "models": [
    {
      "title": "Codestral 22B (코딩)",
      "provider": "ollama",
      "model": "codestral:22b",
      "apiBase": "http://<YOUR_LOCAL_IP>:11434"
    },
    {
      "title": "CodeLlama 13B (코딩 대안)",
      "provider": "ollama",
      "model": "codellama:13b",
      "apiBase": "http://<YOUR_LOCAL_IP>:11434"
    },
    {
      "title": "Llama 3.2 8B (범용)",
      "provider": "ollama",
      "model": "llama3.2:8b",
      "apiBase": "http://<YOUR_LOCAL_IP>:11434"
    },
    {
      "title": "Mistral 7B (경량)",
      "provider": "ollama",
      "model": "mistral:7b",
      "apiBase": "http://<YOUR_LOCAL_IP>:11434"
    }
  ],
  "tabAutocompleteModel": {
    "title": "StarCoder2 3B",
    "provider": "ollama",
    "model": "starcoder2:3b",
    "apiBase": "http://<YOUR_LOCAL_IP>:11434"
  },
  "contextProviders": [
    { "name": "code" },
    { "name": "docs" },
    { "name": "diff" },
    { "name": "terminal" },
    { "name": "problems" },
    { "name": "codebase" }
  ]
}
```

### Step 4: Aider 설치 (터미널 AI)

```bash
brew install pipx
pipx ensurepath
pipx install aider-chat
```

`~/.zshrc`에 alias 추가:

```bash
# 내부망용
alias aider-local='OLLAMA_API_BASE=http://<YOUR_LOCAL_IP>:11434 aider --model ollama_chat/codestral:22b'

# VPN용
alias aider-vpn='OLLAMA_API_BASE=http://<YOUR_VPN_IP>:11434 aider --model ollama_chat/codestral:22b'
```

사용:

```bash
cd ~/my-project
aider-local
```

---

## Part 5: WireGuard VPN 설정 (iptime)

### 사전 조건

- iptime 공유기 펌웨어 14.20.0 이상
- 지원 모델: AX/BE/AC 시리즈 대부분 ([지원 목록](https://iptime.com/iptime/?page_id=67&uid=25209&mod=document))

### Step 1: iptime WireGuard 서버 설정

1. 공유기 관리 페이지 접속: `http://<YOUR_LOCAL_IP>`
2. **고급 설정 > VPN 설정 > WireGuard 서버 설정**
3. 설정:
   - **WireGuard 서버**: 활성화
   - **VPN 내부 통신 NAT**: 활성화
   - **서버 포트**: 51820 (기본값)
   - **VPN IP 대역**: <YOUR_VPN_IP>/24 (기본값)

### Step 2: 피어(클라이언트) 추가

1. WireGuard 서버 설정 페이지에서 **피어 추가**
2. 피어 이름 입력 (예: "MacBook")
3. **피어 설정 파일 다운로드** 또는 **QR 코드 저장**

### Step 3: Mac에 WireGuard 설치

```bash
brew install wireguard-tools
```

또는 App Store에서 "WireGuard" 앱 설치 (GUI)

### Step 4: Mac WireGuard 설정

**방법 A: GUI 앱 사용**
1. WireGuard 앱 실행
2. "Import tunnel(s) from file" 선택
3. iptime에서 다운로드한 설정 파일 선택

**방법 B: CLI 사용**

iptime에서 다운로드한 설정 파일을 `/etc/wireguard/wg0.conf`로 복사:

```bash
sudo mkdir -p /etc/wireguard
sudo cp ~/Downloads/peer_macbook.conf /etc/wireguard/wg0.conf
```

설정 파일 예시 (iptime이 자동 생성):

```ini
[Interface]
PrivateKey = <자동생성된_개인키>
Address = <YOUR_VPN_IP>/24
DNS = <YOUR_LOCAL_IP>

[Peer]
PublicKey = <iptime_공개키>
AllowedIPs = <YOUR_LOCAL_IP>/24, <YOUR_VPN_IP>/24
Endpoint = <공인IP_또는_DDNS>:51820
PersistentKeepalive = 25
```

### Step 5: VPN 연결

**GUI:**
WireGuard 앱에서 토글로 연결/해제

**CLI:**
```bash
# 연결
sudo wg-quick up wg0

# 해제
sudo wg-quick down wg0

# 상태 확인
sudo wg show
```

### Step 6: VPN 연결 확인

```bash
# VPN 인터페이스 확인
ifconfig utun  # 또는 wg0

# 내부망 접근 테스트
ping <YOUR_LOCAL_IP>

# Ollama 접근 테스트
curl http://<YOUR_LOCAL_IP>:11434/api/tags
```

### Step 7: DDNS 설정 (선택)

공인 IP가 변경되는 환경이라면:

1. iptime 관리 페이지 > **고급 설정 > 특수 기능 > DDNS 설정**
2. iptime DDNS 또는 외부 DDNS 설정
3. WireGuard Endpoint를 DDNS 주소로 변경

### VPN 연결시 Continue 설정

VPN으로 접속할 때는 내부 IP를 그대로 사용:

```json
{
  "models": [
    {
      "title": "Codestral 22B",
      "provider": "ollama",
      "model": "codestral:22b",
      "apiBase": "http://<YOUR_LOCAL_IP>:11434"
    }
  ]
}
```

> [!tip] iptime WireGuard 특징
> - VPN IP (10.8.0.x)가 아닌 내부망 IP (192.168.0.x)로 직접 접근 가능
> - `AllowedIPs`에 `<YOUR_LOCAL_IP>/24`가 포함되어 있기 때문
> - 설정 변경 없이 내부망/VPN 동일하게 사용 가능

---

## Part 6: 활용 가이드

### 일상 워크플로우

```
┌──────────────────────────────────────────────────────────┐
│ 집 (내부망)                                               │
│ - 직접 연결: <YOUR_LOCAL_IP>:11434                          │
│ - codestral:22b로 코딩                                   │
└──────────────────────────────────────────────────────────┘
                        ▼
┌──────────────────────────────────────────────────────────┐
│ 외부 (VPN)                                                │
│ - WireGuard 연결                                         │
│ - 동일 IP로 접근: <YOUR_LOCAL_IP>:11434                     │
└──────────────────────────────────────────────────────────┘
                        ▼
┌──────────────────────────────────────────────────────────┐
│ 게임 중                                                   │
│ - 모델 자동 언로드 (KEEP_ALIVE=5m)                        │
│ - 필요시 mistral:7b 경량 모델 사용                        │
└──────────────────────────────────────────────────────────┘
```

### VS Code 단축키 (Continue)

| 단축키 | 기능 |
|--------|------|
| `Cmd+L` | 채팅 패널 열기 |
| `Cmd+I` | 인라인 편집 (선택 영역) |
| `Tab` | 자동완성 수락 |
| `Cmd+Shift+R` | 코드베이스 검색 |

### Aider 주요 명령

```bash
cd ~/my-project
aider-local  # 또는 aider-vpn

# 기본 명령
/add src/main.py    # 파일 추가
/drop src/main.py   # 파일 제거
/diff               # 변경사항 확인
/undo               # 실행 취소
/run pytest         # 명령 실행
```

### 상황별 모델 선택

| 상황 | 모델 | 이유 |
|------|------|------|
| 코딩 (일반) | codestral:22b | 코딩 품질 최고 |
| 코딩 (대안) | codellama:13b | 안정적, VRAM 적음 |
| 자동완성 | starcoder2:3b | 빠른 응답 |
| 범용 대화 | llama3.2:8b | 균형 잡힌 성능 |
| 게임 중 | mistral:7b | VRAM 절약 |

---

## Part 7: 문제 해결

### 연결 안 됨

```bash
# 1. 네트워크 확인
ping <YOUR_LOCAL_IP>

# 2. 포트 확인
nc -zv <YOUR_LOCAL_IP> 11434

# 3. VPN 상태 확인
sudo wg show

# 4. Windows 방화벽 확인 (PowerShell)
Get-NetFirewallRule -DisplayName "Ollama*"
```

### 모델 응답이 느림

```bash
# GPU 사용 확인 (WSL)
nvidia-smi

# 로드된 모델 확인
curl http://<YOUR_LOCAL_IP>:11434/api/ps
```

### 게임 중 프레임 드랍

```bash
# 수동 언로드
curl http://<YOUR_LOCAL_IP>:11434/api/generate -d '{"model": "codestral:22b", "keep_alive": 0}'
```

### VPN 연결 후에도 접근 안 됨

1. WireGuard 설정의 `AllowedIPs`에 `<YOUR_LOCAL_IP>/24` 포함 확인
2. iptime에서 "VPN 내부 통신 NAT" 활성화 확인
3. Windows 방화벽에서 Private 프로필 허용 확인

---

## 유용한 명령어

### Mac

```bash
# 서버 상태
curl http://<YOUR_LOCAL_IP>:11434/api/tags

# 로드된 모델
curl http://<YOUR_LOCAL_IP>:11434/api/ps

# VPN 연결/해제
sudo wg-quick up wg0
sudo wg-quick down wg0
```

### Windows (WSL)

```bash
# 서비스 상태
docker compose ps

# 모델 다운로드/삭제
docker exec ollama ollama pull <model>
docker exec ollama ollama rm <model>

# 재시작
docker compose restart
```

---

## 체크리스트

### Windows 서버
- [ ] WSL2 설치 및 업데이트
- [ ] .wslconfig 메모리 설정
- [ ] Docker + NVIDIA Container Toolkit
- [ ] docker-compose.yml 작성 및 실행
- [ ] 방화벽 포트 허용 (11434, 3000)
- [ ] 모델 다운로드 (codestral, starcoder2, llama3.2, mistral)

### Mac 클라이언트
- [ ] 환경 변수 설정
- [ ] Continue 확장 설치 및 config.json 설정
- [ ] Aider 설치 및 alias 설정
- [ ] 내부망 연결 테스트

### VPN (iptime WireGuard)
- [ ] iptime 펌웨어 14.20.0 이상 확인
- [ ] WireGuard 서버 활성화
- [ ] 피어 추가 및 설정 파일 다운로드
- [ ] Mac WireGuard 설치 및 설정
- [ ] VPN 연결 테스트

---

## 참고 자료

### 공식 문서
- [NVIDIA CUDA on WSL](https://docs.nvidia.com/cuda/wsl-user-guide/)
- [Ollama Documentation](https://docs.ollama.com/)
- [Continue.dev Ollama Guide](https://docs.continue.dev/guides/ollama-guide)
- [Aider + Ollama](https://aider.chat/docs/llms/ollama.html)

### iptime WireGuard
- [iptime WireGuard 공식 가이드](https://iptime.com/iptime/?page_id=67&uid=25209&mod=document)

### 모델 정보
- [Mistral AI - Codestral](https://mistral.ai/news/codestral/)
- [Meta - Code Llama](https://ai.meta.com/blog/code-llama-large-language-model-coding/)
- [BigCode - StarCoder2](https://huggingface.co/bigcode/starcoder2-15b)
