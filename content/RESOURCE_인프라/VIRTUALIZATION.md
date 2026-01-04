# 가상화 개념 가이드

> 홈랩을 위한 가상화 기술 이해

## 가상화란?

하나의 물리 서버에서 여러 개의 독립된 환경을 실행하는 기술

```mermaid
graph TB
    subgraph 물리서버
        HW[Hardware]
        HV[Hypervisor / Container Runtime]
        VM1[환경 1]
        VM2[환경 2]
        VM3[환경 3]
    end

    HW --> HV --> VM1 & VM2 & VM3
```

## 가상화 종류

### 1. VM (Virtual Machine)

```mermaid
graph TB
    subgraph VM["가상 머신"]
        APP1[App]
        LIB1[Libraries]
        OS1[Guest OS]
    end

    subgraph Host
        HV[Hypervisor]
        HOS[Host OS - 선택적]
        HW[Hardware]
    end

    VM --> HV --> HOS --> HW
```

**특징:**
- 완전한 OS 포함 (커널 별도)
- 높은 격리 수준
- 무거움 (GB 단위)
- 부팅 시간 분 단위

**용도:**
- Windows 실행
- 다른 Linux 배포판
- 완전한 격리 필요 시

### 2. Container

```mermaid
graph TB
    subgraph Containers
        C1[App 1]
        C2[App 2]
        C3[App 3]
    end

    subgraph Host
        CR[Container Runtime]
        K[Kernel - 공유]
        HW[Hardware]
    end

    C1 & C2 & C3 --> CR --> K --> HW
```

**특징:**
- 커널 공유
- 가벼움 (MB 단위)
- 즉시 시작
- Linux만 가능 (커널 공유)

## 컨테이너 종류: LXC vs Docker

```mermaid
graph LR
    subgraph LXC["LXC (시스템 컨테이너)"]
        L1[init]
        L2[systemd]
        L3[여러 프로세스]
        L4[SSH 가능]
    end

    subgraph Docker["Docker (앱 컨테이너)"]
        D1[단일 프로세스]
        D2[앱 하나]
    end
```

| 항목 | LXC | Docker |
|-----|-----|--------|
| **목적** | 가벼운 VM처럼 사용 | 앱 패키징/배포 |
| **프로세스** | 여러 개 (systemd) | 보통 1개 |
| **SSH** | 가능 | 보통 안 함 |
| **용량** | 수백 MB | 수십~수백 MB |
| **용도** | Pi-hole, DNS 서버 | 웹앱, API 서버 |
| **이미지** | 배포판 기반 | 앱 기반 |

### 언제 뭘 쓸까?

```mermaid
graph TD
    Q1{Windows 필요?}
    Q1 -->|Yes| VM
    Q1 -->|No| Q2{SSH 접속 필요?}
    Q2 -->|Yes| Q3{무거운 서비스?}
    Q3 -->|Yes| VM
    Q3 -->|No| LXC
    Q2 -->|No| Docker
```

| 상황 | 선택 |
|-----|------|
| Windows 설치 | **VM** |
| GPU 사용 (Ollama) | **VM** (passthrough) |
| Pi-hole, DNS | **LXC** |
| 웹앱, API | **Docker** |
| K3s 노드 | **VM** (안정성) |
| 간단한 서비스 | **LXC** |

## Hypervisor 종류

### Type 1 (Bare-metal)

```mermaid
graph TB
    VM[VM / Container] --> HV[Hypervisor] --> HW[Hardware]
```

- 하드웨어에 직접 설치
- **Proxmox**, ESXi, Hyper-V Server
- 성능 좋음

### Type 2 (Hosted)

```mermaid
graph TB
    VM[VM] --> HV[Hypervisor] --> OS[Host OS] --> HW[Hardware]
```

- OS 위에 설치
- VirtualBox, VMware Workstation
- 데스크탑용

## Proxmox가 제공하는 것

```mermaid
graph TB
    subgraph Proxmox["Proxmox VE"]
        WEB[웹 UI]
        KVM[KVM - VM]
        LXC[LXC - Container]
        CLUSTER[클러스터링]
        BACKUP[백업/스냅샷]
    end

    subgraph HW[Hardware]
        CPU
        RAM
        DISK
        GPU
    end

    Proxmox --> HW
```

| 기능 | 설명 |
|-----|------|
| **KVM** | 완전한 VM 지원 |
| **LXC** | 시스템 컨테이너 |
| **웹 UI** | 브라우저로 관리 |
| **클러스터** | 여러 노드 통합 관리 |
| **스냅샷** | 즉시 상태 저장 |
| **백업** | 정기 백업 스케줄 |
| **마이그레이션** | VM/LXC 노드 간 이동 |
| **GPU Passthrough** | VM에 GPU 직접 할당 |

## 우리 구성 예시

```mermaid
graph TB
    subgraph polaris[polaris - Proxmox]
        P_VM1[VM: k3s-master]
        P_LXC1[LXC: pi-hole]
        P_LXC2[LXC: minio]
    end

    subgraph sirius[sirius - Proxmox]
        S_VM1[VM: k3s-worker]
        S_VM1 -->|GPU Passthrough| GPU[RTX GPU]
    end

    polaris <-->|Cluster| sirius
```

---

## 참고

- [[PROXMOX]] - Proxmox 상세
- [[개인/PROJECT_HOME-INFRA/SETUP/02-PROXMOX|Proxmox 설치 가이드]]
- [[개인/PROJECT_HOME-INFRA/README|HOME-INFRA 프로젝트]]

---

#virtualization #homelab #proxmox
