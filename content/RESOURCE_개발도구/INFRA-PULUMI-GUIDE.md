# Pulumi 가이드: Terraform과의 비교 및 활용법

> 작성일: 2025-12-16

## 개요

Pulumi는 TypeScript, Python, Go, C#, Java 등 **범용 프로그래밍 언어**를 사용해 클라우드 인프라를 정의하고 관리하는 오픈소스 IaC(Infrastructure as Code) 도구다. 2017년 출시 이후 개발자 친화적인 접근 방식으로 Terraform의 강력한 대안으로 자리잡았다.

## Terraform vs Pulumi 비교

### Pulumi의 장점

| 영역 | 설명 |
|------|------|
| **범용 언어 사용** | HCL 대신 TypeScript, Python, Go 등 익숙한 언어 사용. IDE 자동완성, 타입체킹, 리팩토링 도구 활용 가능 |
| **개발자 친화적** | 조건문, 반복문, 함수, 클래스 등 프로그래밍 구조 자연스럽게 사용 |
| **강력한 테스트** | 단위 테스트, 통합 테스트, 속성 테스트 지원. 기존 테스트 프레임워크(Jest, pytest 등) 활용 |
| **빠른 프로바이더 업데이트** | Dynamic Provider 지원으로 Terraform보다 새 클라우드 기능 빠르게 지원 |
| **서버리스 최적화** | TypeScript 서버리스 앱에서 함수 코드를 인프라 정의와 인라인 작성 가능 |
| **애플리케이션 통합** | Pulumi 코드를 앱 코드와 파이프라인에 함께 포함시켜 배포 가능 |
| **라이선스** | Apache 2.0 오픈소스 (Terraform의 BSL 라이선스 우려 없음) |

### Terraform의 장점

| 영역 | 설명 |
|------|------|
| **성숙한 생태계** | 수천 개의 프로바이더, 10년간 축적된 커뮤니티 지식 |
| **낮은 진입장벽** | HCL은 단순하고 선언적. 프로그래밍 경험 없어도 시작 가능 |
| **풍부한 문서** | 튜토리얼, 예제, 트러블슈팅 자료가 훨씬 많음 |
| **엔터프라이즈 스케일** | 모듈 시스템으로 대규모 인프라 관리에 적합 |
| **저렴한 비용** | Standard 플랜 $0.10/리소스/월 (Pulumi Enterprise $1.10) |
| **보안 스캐닝** | Snyk, Checkov 등 보안 도구 지원 |

### 상태(State) 관리 비교

```
Terraform:
├── 로컬 또는 원격(S3, GCS 등) 저장
├── 수동 설정 필요
├── 상태 잠금(locking) 직접 구성
└── 완전한 제어권

Pulumi:
├── Pulumi Cloud 기본 제공 (관리형)
├── 자동 암호화 및 백업
├── 로컬/S3/Azure Blob 대안 가능
└── 팀 환경에서 복잡할 수 있음
```

## Pulumi의 한계점

### 1. 생태계 및 커뮤니티

```
- Terraform 대비 작은 커뮤니티
- 문서와 튜토리얼이 상대적으로 부족
- Stack Overflow 등 Q&A 자료 적음
```

### 2. 보안 스캐닝 제한

```
- Snyk, Checkov 미지원
- CrossGuard(Policy as Code) 있으나 제한적
- CIS, ISO27001 정책팩은 TypeScript만 제공
- Python 사용자는 직접 정책 작성 필요
```

### 3. 스택 구조의 한계

```
- 스택 간 의존성 설정 어려움
- 여러 스택 집계하여 통합 인프라 구성 복잡
- Terraform의 모듈 시스템보다 유연성 낮음
```

### 4. Zero Downtime 배포 어려움

```
- 단일 스택에서 EC2/Droplet 무중단 교체 어려움
- Immutable Server 패턴 구현 복잡
- Terraform의 create_before_destroy보다 설정 난이도 높음
```

### 5. 학습 곡선

```
- 클라우드 서비스 + 프로그래밍 언어 동시 학습 필요
- 인프라 배경만 있는 사람에게 진입장벽
- 프로바이더별 추상화 수준 차이로 혼란 가능
```

### 6. 폐쇄망 환경 제약

```
- Pulumi Cloud 의존으로 네트워크 단절 환경 어려움
- Self-hosted 백엔드 구성 가능하나 추가 작업 필요
```

## 언제 Pulumi를 선택할까?

### Pulumi가 적합한 경우

```typescript
// ✅ TypeScript/Python 개발팀
// ✅ 서버리스 아키텍처 (Lambda, Cloud Functions)
// ✅ 복잡한 조건부 로직이 필요한 인프라
// ✅ 인프라와 애플리케이션 코드 통합 원할 때
// ✅ 테스트 주도 인프라 개발(TDD)
// ✅ 새 클라우드 기능 빠른 도입이 중요할 때
```

### Terraform이 적합한 경우

```hcl
# ✅ 기존 Terraform 자산이 많은 조직
# ✅ 인프라 전문팀 (프로그래밍 배경 약함)
# ✅ 전통적 VM/네트워크 중심 아키텍처
# ✅ 보안 스캐닝(Snyk, Checkov) 필수
# ✅ 비용 민감한 엔터프라이즈
# ✅ 폐쇄망/에어갭 환경
```

## Pulumi Cloud 없이 사용하기 (셀프호스트)

> **Pulumi Cloud 연동은 필수가 아니다.** DIY 백엔드를 사용하면 완전히 독립적으로 운영 가능.

### 백엔드 옵션 비교

| 백엔드 | 설명 | 적합한 경우 |
|--------|------|-------------|
| **Pulumi Cloud** | 관리형 서비스 (기본값) | 팀 협업, 빠른 시작 |
| **로컬 파일시스템** | `~/.pulumi/stacks/`에 JSON 저장 | 개인 프로젝트, 테스트 |
| **AWS S3** | S3 버킷에 상태 저장 | 팀 협업, AWS 환경 |
| **Minio/Ceph** | S3 호환 오브젝트 스토리지 | 온프레미스, 홈랩 |
| **Azure Blob** | Azure Storage 사용 | Azure 환경 |
| **GCS** | Google Cloud Storage | GCP 환경 |

### 로컬 백엔드 설정

```bash
# 로컬 파일시스템 백엔드로 로그인
pulumi login --local

# 상태 파일 위치: ~/.pulumi/stacks/<project>/

# 이후 일반적으로 사용
pulumi new typescript
pulumi up
```

### S3 백엔드 설정

```bash
# AWS S3 버킷을 백엔드로 사용
pulumi login s3://my-pulumi-state-bucket

# 폴더 구조 지정 가능
pulumi login s3://my-bucket/pulumi/project1

# 프로파일과 리전 지정
pulumi login 's3://my-bucket?region=ap-northeast-2&awssdk=v2&profile=myprofile'
```

### Minio 백엔드 (온프레미스 S3 호환)

```bash
# Minio 서버 실행 (Docker)
docker run -p 9000:9000 -p 9001:9001 \
  -e MINIO_ROOT_USER=admin \
  -e MINIO_ROOT_PASSWORD=password \
  minio/minio server /data --console-address ":9001"

# Minio를 백엔드로 사용
export AWS_ACCESS_KEY_ID=admin
export AWS_SECRET_ACCESS_KEY=password
pulumi login 's3://pulumi-state?endpoint=localhost:9000&disableSSL=true&s3ForcePathStyle=true'
```

### 환경변수로 백엔드 설정

```bash
# 환경변수로 기본 백엔드 지정
export PULUMI_BACKEND_URL="s3://my-bucket"
# 또는
export PULUMI_BACKEND_URL="file://~/.pulumi-local"

# 이후 pulumi login 없이 바로 사용 가능
pulumi new typescript
```

### 시크릿 암호화 (Passphrase)

```bash
# DIY 백엔드 사용 시 passphrase로 시크릿 암호화
pulumi stack init dev --secrets-provider passphrase

# 환경변수로 passphrase 설정
export PULUMI_CONFIG_PASSPHRASE="my-secret-passphrase"
```

### 주의사항

```
DIY 백엔드 사용 시 직접 관리해야 하는 것들:
├── 상태 파일 백업
├── 동시 접근 제어 (기본 파일 잠금 제공되나 제한적)
├── 암호화 설정
├── 팀 간 접근 권한 관리
└── 상태 파일 복구 계획
```

---

## 로컬/온프레미스 인프라 관리

> 클라우드가 아닌 **내 컴퓨터, 홈랩, 사내 서버**도 Pulumi로 관리 가능.

### 사용 가능한 프로바이더

| 프로바이더 | 용도 | 설치 |
|------------|------|------|
| **Command** | 로컬/원격 명령 실행, 파일 복사 | `@pulumi/command` |
| **Docker** | 컨테이너, 이미지, 네트워크 관리 | `@pulumi/docker` |
| **Libvirt** | KVM/QEMU 가상머신 관리 | `@pulumi/libvirt` |
| **Kubernetes** | K8s 클러스터 관리 | `@pulumi/kubernetes` |

### Command Provider - 로컬 명령 실행

```typescript
import * as command from "@pulumi/command";

// 로컬에서 스크립트 실행
const setupScript = new command.local.Command("setup", {
    create: "echo 'Setting up...' && ./setup.sh",
    delete: "echo 'Cleaning up...' && ./cleanup.sh",
    dir: "/home/user/scripts",
});

// 명령 실행 결과 캡처
export const output = setupScript.stdout;
```

### Command Provider - 원격 서버 SSH 명령

```typescript
import * as command from "@pulumi/command";

// SSH로 원격 서버에 명령 실행
const remoteCommand = new command.remote.Command("deploy", {
    connection: {
        host: "<YOUR_LOCAL_IP>",
        user: "admin",
        privateKey: fs.readFileSync("/home/user/.ssh/id_rsa", "utf-8"),
    },
    create: "sudo systemctl restart nginx",
});

// 원격 서버로 파일 복사
const copyConfig = new command.remote.CopyToRemote("config", {
    connection: {
        host: "<YOUR_LOCAL_IP>",
        user: "admin",
        privateKey: fs.readFileSync("/home/user/.ssh/id_rsa", "utf-8"),
    },
    source: new pulumi.asset.FileAsset("./nginx.conf"),
    remotePath: "/etc/nginx/nginx.conf",
});
```

### Docker Provider - 로컬 Docker 관리

```typescript
import * as docker from "@pulumi/docker";

// 로컬 Docker에 컨테이너 배포
const nginx = new docker.Container("nginx", {
    image: "nginx:latest",
    ports: [{
        internal: 80,
        external: 8080,
    }],
    volumes: [{
        hostPath: "/home/user/html",
        containerPath: "/usr/share/nginx/html",
    }],
});

// Docker 네트워크 생성
const network = new docker.Network("app-network", {
    name: "my-app-network",
});
```

### Docker Provider - 원격 Docker (SSH)

```typescript
import * as docker from "@pulumi/docker";

// SSH를 통한 원격 Docker 연결
const remoteDocker = new docker.Provider("remote-docker", {
    host: "ssh://admin@<YOUR_LOCAL_IP>:22",
});

// 원격 서버에 컨테이너 배포
const remoteNginx = new docker.Container("remote-nginx", {
    image: "nginx:latest",
    ports: [{
        internal: 80,
        external: 80,
    }],
}, { provider: remoteDocker });
```

### Libvirt Provider - KVM 가상머신 관리

```typescript
import * as libvirt from "@pulumi/libvirt";

// libvirt 프로바이더 설정 (로컬 또는 원격)
const libvirtProvider = new libvirt.Provider("local", {
    uri: "qemu:///system",  // 로컬 KVM
    // uri: "qemu+ssh://user@host/system",  // 원격 KVM
});

// Ubuntu VM 생성
const ubuntuVolume = new libvirt.Volume("ubuntu-volume", {
    pool: "default",
    source: "https://cloud-images.ubuntu.com/jammy/current/jammy-server-cloudimg-amd64.img",
    format: "qcow2",
}, { provider: libvirtProvider });

const vm = new libvirt.Domain("ubuntu-vm", {
    memory: 2048,
    vcpu: 2,
    disks: [{
        volumeId: ubuntuVolume.id,
    }],
    networkInterfaces: [{
        networkName: "default",
    }],
}, { provider: libvirtProvider });
```

### 홈랩 실전 예제

```typescript
// homelab/index.ts
import * as pulumi from "@pulumi/pulumi";
import * as command from "@pulumi/command";
import * as docker from "@pulumi/docker";

const config = new pulumi.Config();

// 서버 목록
const servers = [
    { name: "nas", host: "<YOUR_LOCAL_IP>", user: "admin" },
    { name: "media", host: "<YOUR_LOCAL_IP>", user: "admin" },
    { name: "dev", host: "<YOUR_LOCAL_IP>", user: "admin" },
];

// 각 서버에 Docker 프로바이더 생성
const dockerProviders = servers.map(server => ({
    name: server.name,
    provider: new docker.Provider(`docker-${server.name}`, {
        host: `ssh://${server.user}@${server.host}:22`,
    }),
}));

// 모든 서버에 Portainer Agent 배포
dockerProviders.forEach(({ name, provider }) => {
    new docker.Container(`portainer-agent-${name}`, {
        name: "portainer-agent",
        image: "portainer/agent:latest",
        restart: "always",
        volumes: [
            { hostPath: "/var/run/docker.sock", containerPath: "/var/run/docker.sock" },
            { hostPath: "/var/lib/docker/volumes", containerPath: "/var/lib/docker/volumes" },
        ],
        ports: [{ internal: 9001, external: 9001 }],
    }, { provider });
});

// NAS 서버에 Jellyfin 배포
new docker.Container("jellyfin", {
    name: "jellyfin",
    image: "jellyfin/jellyfin:latest",
    restart: "always",
    volumes: [
        { hostPath: "/srv/jellyfin/config", containerPath: "/config" },
        { hostPath: "/srv/media", containerPath: "/media" },
    ],
    ports: [{ internal: 8096, external: 8096 }],
}, { provider: dockerProviders.find(p => p.name === "nas")!.provider });
```

### 환경변수로 SSH 키 관리

```bash
# SSH 키를 config에서 관리
pulumi config set --secret sshPrivateKey "$(cat ~/.ssh/id_rsa)"
```

```typescript
const config = new pulumi.Config();
const sshKey = config.requireSecret("sshPrivateKey");

const connection = {
    host: "<YOUR_LOCAL_IP>",
    user: "admin",
    privateKey: sshKey,
};
```

---

## Pulumi 시작하기

### 설치

```bash
# macOS
brew install pulumi

# Linux/WSL
curl -fsSL https://get.pulumi.com | sh

# npm (Node.js)
npm install -g pulumi
```

### 프로젝트 생성

```bash
# 새 프로젝트 초기화
mkdir my-infra && cd my-infra
pulumi new aws-typescript  # 또는 aws-python, aws-go 등

# 기존 Terraform을 Pulumi로 변환
pulumi convert --from terraform --language typescript
```

### 기본 예제 (TypeScript)

```typescript
import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// S3 버킷 생성
const bucket = new aws.s3.Bucket("my-bucket", {
    website: {
        indexDocument: "index.html",
    },
});

// 조건부 리소스 생성 (Terraform에서 복잡한 작업)
const config = new pulumi.Config();
const enableCdn = config.getBoolean("enableCdn") ?? false;

if (enableCdn) {
    const cdn = new aws.cloudfront.Distribution("cdn", {
        origins: [{
            domainName: bucket.bucketRegionalDomainName,
            originId: bucket.id,
        }],
        // ... CDN 설정
    });
}

// Output 내보내기
export const bucketName = bucket.id;
export const bucketUrl = bucket.websiteEndpoint;
```

### 기본 명령어

```bash
# 스택 관리
pulumi stack init dev          # 새 스택 생성
pulumi stack select prod       # 스택 전환
pulumi stack ls                # 스택 목록

# 배포
pulumi preview                 # 변경사항 미리보기 (plan)
pulumi up                      # 인프라 배포 (apply)
pulumi refresh                 # 상태 동기화
pulumi destroy                 # 인프라 삭제

# 시크릿 관리
pulumi config set dbPassword --secret
pulumi config get dbPassword
```

## 베스트 프랙티스

### 1. 프로젝트 구조

```
my-infra/
├── Pulumi.yaml              # 프로젝트 설정
├── Pulumi.dev.yaml          # dev 스택 설정
├── Pulumi.prod.yaml         # prod 스택 설정
├── index.ts                 # 메인 진입점
├── components/              # 재사용 컴포넌트
│   ├── vpc.ts
│   └── database.ts
├── config/                  # 환경별 설정
│   └── settings.ts
└── __tests__/               # 테스트
    └── infra.test.ts
```

### 2. 스택 활용 전략

```typescript
// 스택으로 환경 분리
// dev, staging, prod 각각 별도 스택

const stack = pulumi.getStack();
const isProd = stack === "prod";

// 환경별 설정
const instanceType = isProd ? "t3.large" : "t3.micro";
const minSize = isProd ? 3 : 1;
```

### 3. 컴포넌트 패턴

```typescript
// components/secure-bucket.ts
import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

interface SecureBucketArgs {
    name: string;
    enableVersioning?: boolean;
}

export class SecureBucket extends pulumi.ComponentResource {
    public readonly bucket: aws.s3.Bucket;

    constructor(name: string, args: SecureBucketArgs, opts?: pulumi.ComponentResourceOptions) {
        super("custom:storage:SecureBucket", name, {}, opts);

        this.bucket = new aws.s3.Bucket(name, {
            versioning: {
                enabled: args.enableVersioning ?? true,
            },
            serverSideEncryptionConfiguration: {
                rule: {
                    applyServerSideEncryptionByDefault: {
                        sseAlgorithm: "AES256",
                    },
                },
            },
        }, { parent: this });

        // 퍼블릭 액세스 차단
        new aws.s3.BucketPublicAccessBlock(`${name}-block`, {
            bucket: this.bucket.id,
            blockPublicAcls: true,
            blockPublicPolicy: true,
        }, { parent: this });
    }
}
```

### 4. 테스트 작성

```typescript
// __tests__/infra.test.ts
import * as pulumi from "@pulumi/pulumi";

pulumi.runtime.setMocks({
    newResource: (args) => {
        return { id: `${args.name}-id`, state: args.inputs };
    },
    call: (args) => args.inputs,
});

describe("인프라 테스트", () => {
    let infra: typeof import("../index");

    beforeAll(async () => {
        infra = await import("../index");
    });

    test("S3 버킷이 암호화되어야 함", async () => {
        const encryption = await infra.bucket.serverSideEncryptionConfiguration;
        expect(encryption).toBeDefined();
    });

    test("버킷 이름 형식 확인", async () => {
        const name = await infra.bucketName;
        expect(name).toMatch(/^my-app-/);
    });
});
```

### 5. 시크릿 관리

```typescript
// 설정에서 시크릿 읽기
const config = new pulumi.Config();
const dbPassword = config.requireSecret("dbPassword");

// 시크릿 Output으로 사용
const database = new aws.rds.Instance("db", {
    password: dbPassword,  // 자동으로 암호화됨
    // ...
});

// 시크릿 조합
const connectionString = pulumi.interpolate`postgres://admin:${dbPassword}@${database.endpoint}`;
```

## Terraform에서 마이그레이션

### 변환 도구 사용

```bash
# Terraform 프로젝트를 Pulumi로 변환
cd my-terraform-project
pulumi convert --from terraform --language typescript --out ../my-pulumi-project
```

### 상태 가져오기

```bash
# 기존 리소스 Import
pulumi import aws:s3/bucket:Bucket my-bucket existing-bucket-name

# 대량 Import (JSON 파일 사용)
pulumi import --file resources.json
```

### 점진적 마이그레이션 전략

```
1단계: 새 리소스만 Pulumi로 생성
2단계: 기존 리소스 Import로 관리 이전
3단계: Terraform 상태 파일 백업 후 제거
4단계: 전체 Pulumi 전환 완료
```

## 참고 자료

### 공식 문서
- [Pulumi Docs](https://www.pulumi.com/docs/)
- [Pulumi Learn](https://www.pulumi.com/learn/)
- [Pulumi Tutorials](https://www.pulumi.com/tutorials/)

### 비교 및 가이드
- [Terraform vs Pulumi - Pulumi 공식](https://www.pulumi.com/docs/iac/comparisons/terraform/)
- [Pulumi vs Terraform - env0](https://www.env0.com/blog/pulumi-vs-terraform-an-in-depth-comparison)
- [IaC 도구 비교 2025](https://atmosly.com/knowledge/iac-tools-comparison-terraform-vs-pulumi-2025-guide)
- [Pulumi vs Terraform - Spacelift](https://spacelift.io/blog/pulumi-vs-terraform)

### 베스트 프랙티스
- [Pulumi Recommended Patterns](https://www.pulumi.com/blog/pulumi-recommended-patterns-the-basics/)
- [IaC 베스트 프랙티스 - 프로젝트 구조](https://www.pulumi.com/blog/iac-recommended-practices-structuring-pulumi-projects/)
- [Golden Paths 가이드](https://www.pulumi.com/blog/golden-paths-infrastructure-components-and-templates/)

### 한계 및 대안
- [Pulumi 장단점 분석](https://medium.com/@junjun231953_53717/pros-and-cons-of-pulumi-f341abcd5015)
- [Pulumi Alternatives 2025](https://spacelift.io/blog/pulumi-alternatives)

### 셀프호스트 및 온프레미스
- [State and Backends - Pulumi 공식](https://www.pulumi.com/docs/iac/concepts/state-and-backends/)
- [Pulumi State Management](https://spacelift.io/blog/pulumi-state-management)
- [Command Provider](https://www.pulumi.com/registry/packages/command/)
- [Docker Provider](https://www.pulumi.com/registry/packages/docker/)
- [Docker SSH 연결 가이드](https://blog.scottlowe.org/2024/01/22/using-ssh-with-the-pulumi-docker-provider/)
- [Libvirt로 홈랩 VM 관리](https://dustinspecker.com/posts/ubuntu-vm-pulumi-libvirt/)
- [Pulumi 홈랩 모듈러 접근](https://www.virtualthoughts.co.uk/2021/11/17/taking-a-modular-approach-to-my-homelab-with-pulumi/)

---

> **결론**: Pulumi는 개발자에게 친숙한 언어와 테스트 생태계를 활용할 수 있다는 점에서 강력하다. 하지만 Terraform의 성숙한 생태계, 보안 도구 지원, 문서화 수준을 따라잡으려면 시간이 필요하다. **팀의 기술 스택과 요구사항**에 따라 선택하되, 서버리스나 TypeScript 중심 프로젝트라면 Pulumi가, 전통적 인프라나 보안 컴플라이언스가 중요하다면 Terraform이 더 적합하다.
