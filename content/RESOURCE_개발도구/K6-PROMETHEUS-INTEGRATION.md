# k6 Prometheus 메트릭 연동

> 작성일: 2026-02-19

## 개요

k6 부하테스트 도구에서 생성한 메트릭을 Prometheus로 전송하는 방법. Remote Write 및 Push Gateway 두 가지 방식 지원. k6 v0.42.0+ 이상에서 기본 내장됨.

## 1. k6 → Prometheus Remote Write

Prometheus Remote Write는 k6가 생성한 메트릭을 직접 Prometheus의 remote write endpoint로 전송하는 방식.

### 설정 방법

**기본 명령어:**
```bash
k6 run -o experimental-prometheus-rw script.js
```

**환경 변수 설정:**
```bash
K6_PROMETHEUS_RW_SERVER_URL=http://localhost:9090/api/v1/write \
k6 run -o experimental-prometheus-rw script.js
```

### 필수 환경 변수

| 변수 | 설명 | 예시 |
|------|------|------|
| `K6_PROMETHEUS_RW_SERVER_URL` | Remote write endpoint URL (필수) | `http://localhost:9090/api/v1/write` |
| `K6_PROMETHEUS_RW_USERNAME` | Basic auth 사용자명 (선택) | `admin` |
| `K6_PROMETHEUS_RW_PASSWORD` | Basic auth 비밀번호 (선택) | `password123` |

### 선택 환경 변수

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `K6_PROMETHEUS_RW_TREND_STATS` | Trend 메트릭 통계 함수 (쉼표 구분) | `p(99)` |
| `K6_PROMETHEUS_RW_TREND_AS_NATIVE_HISTOGRAM` | Native Histogram으로 변환 | `false` |
| `K6_PROMETHEUS_RW_STALE_MARKERS` | 테스트 종료 시 stale marker 표시 | `false` |

### Trend 통계 옵션

```bash
K6_PROMETHEUS_RW_TREND_STATS=p(95),p(99),min,max,avg,med,count,sum \
k6 run -o experimental-prometheus-rw script.js
```

**사용 가능한 함수:**
- `count` - 샘플 개수
- `sum` - 합계
- `min` - 최소값
- `max` - 최대값
- `avg` - 평균
- `med` - 중앙값
- `p(x)` - x 백분위수 (예: `p(95)`, `p(99)`)

### 인증 설정

**Basic Auth:**
```bash
K6_PROMETHEUS_RW_SERVER_URL=http://prometheus.example.com/api/v1/write \
K6_PROMETHEUS_RW_USERNAME=admin \
K6_PROMETHEUS_RW_PASSWORD=secretpassword \
k6 run -o experimental-prometheus-rw script.js
```

**TLS 인증서 (k6 스크립트):**
```javascript
import http from 'k6/http';

export const options = {
  tlsAuth: [
    {
      domains: ['prometheus.example.com'],
      cert: open('path/to/cert.pem'),
      key: open('path/to/key.pem'),
    },
  ],
};
```

### 실행 예시

**Grafana Cloud용 (API token 기반):**
```bash
K6_PROMETHEUS_RW_SERVER_URL=https://prometheus-blocks-prod-us-central1.grafana.net/api/prom/push \
K6_PROMETHEUS_RW_USERNAME=<PROMETHEUS_USER_ID> \
K6_PROMETHEUS_RW_PASSWORD=<PROMETHEUS_API_TOKEN> \
k6 run -o experimental-prometheus-rw --tag testid=loadtest-001 script.js
```

**로컬 환경:**
```bash
K6_PROMETHEUS_RW_SERVER_URL=http://localhost:9090/api/v1/write \
K6_PROMETHEUS_RW_TREND_AS_NATIVE_HISTOGRAM=true \
k6 run -o experimental-prometheus-rw script.js
```

## 2. k6 → Prometheus Push Gateway

Push Gateway는 Prometheus가 직접 scrape하지 못하는 단기 작업의 메트릭을 수신하는 방식. k6는 테스트 완료 후 메트릭을 push gateway로 전송.

### 설정 방법

**확장 설치 (xk6-output-prometheus-pushgateway):**
```bash
xk6 build --with github.com/martymarron/xk6-output-prometheus-pushgateway@latest
```

**기본 명령어:**
```bash
./k6 run -o output-prometheus-pushgateway script.js
```

### 필수 환경 변수

| 변수 | 설명 | 예시 |
|------|------|------|
| `K6_PUSHGATEWAY_URL` | Push Gateway endpoint | `http://localhost:9091` |
| `K6_JOB_NAME` | 작업 이름 (Prometheus 레이블) | `k6_load_testing` |

### 선택 환경 변수

| 변수 | 설명 |
|------|------|
| `K6_PUSHGATEWAY_NAMESPACE` | 메트릭 prefix |
| `K6_LABEL_*` | 커스텀 Prometheus 레이블 (예: `K6_LABEL_APP=myapp`) |

### 실행 예시

**기본 설정:**
```bash
K6_PUSHGATEWAY_URL=http://localhost:9091 \
K6_JOB_NAME=k6_load_testing \
./k6 run ./script.js -o output-prometheus-pushgateway
```

**레이블 추가:**
```bash
K6_PUSHGATEWAY_URL=http://localhost:9091 \
K6_JOB_NAME=k6_load_testing \
K6_LABEL_APP=myapp \
K6_LABEL_ENV=prod \
./k6 run ./script.js -o output-prometheus-pushgateway
```

**스크립트 내 옵션 설정:**
```javascript
export const options = {
  ext: {
    pushgateway: {
      app: "myapp",
      env: "production"
    }
  }
};
```

### Remote Write vs Push Gateway 비교

| 항목 | Remote Write | Push Gateway |
|------|--------------|---------------|
| **필요 조건** | Prometheus remote write receiver 활성화 | Pushgateway 별도 서버 필요 |
| **초기 구성** | 간단 (Prometheus 설정 변경) | 복잡 (새 서버 배포) |
| **지연시간** | 낮음 (직접 전송) | 높음 (gateway 거쳐서) |
| **스케일** | 많은 작업 권장 | 단기 작업/배치 권장 |
| **신뢰성** | Prometheus 직접 수신 | Gateway 버퍼링 제공 |
| **공식 지원** | v0.42.0+ 기본 내장 | 커뮤니티 확장 |

**선택 기준:**
- Remote Write: 실시간 모니터링, 많은 테스트 작업, 직접 제어 필요할 때
- Push Gateway: 간단한 설정, 기존 Pushgateway 인프라 보유할 때

## 3. Prometheus 필요 설정

### Remote Write Receiver 활성화

**Prometheus 시작 시 플래그 추가:**
```bash
prometheus --web.enable-remote-write-receiver
```

**Docker 실행:**
```bash
docker run -d \
  -p 9090:9090 \
  prom/prometheus \
  --web.enable-remote-write-receiver
```

**kubernetes (Helm) - values.yaml:**
```yaml
prometheus:
  server:
    extraArgs:
      web.enable-remote-write-receiver: ""
```

### prometheus.yml 설정 (필요시)

Remote Write Receiver 활성화만으로 충분하지만, 추가 설정 예시:

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

# Remote write를 위한 별도 설정 (선택)
remote_write:
  - url: http://long-storage:9009/api/v1/write
    queue_config:
      capacity: 10000
```

### scrape_config vs remote_write 차이

| 항목 | scrape_config | remote_write |
|------|---------------|--------------|
| **방향** | Pull (Prometheus → 타겟) | Push (타겟 → Prometheus) |
| **용도** | 일반적인 메트릭 수집 | 다른 Prometheus/저장소로 전송 |
| **기본 활성** | 기본 활성 | `--web.enable-remote-write-receiver` 필수 |
| **설정 파일** | `prometheus.yml`의 `scrape_configs` | `prometheus.yml`의 `remote_write` |

## 4. k6 메트릭 명명 규칙

k6 메트릭을 Prometheus로 전송할 때의 이름 변환 규칙:

### 메트릭 Prefix
- 모든 k6 메트릭은 `k6_` prefix 추가
- 예: `http_reqs` → `k6_http_reqs`

### 단위 Suffix
- Prometheus 권장 단위 suffix 추가
- 예: `http_req_duration` → `k6_http_req_duration_ms`

### 주요 메트릭 예시

| k6 메트릭 | Prometheus 메트릭 | 타입 |
|----------|------------------|------|
| `http_reqs` | `k6_http_reqs_total` | Counter |
| `http_req_duration` | `k6_http_req_duration_ms` | Histogram |
| `http_req_blocked` | `k6_http_req_blocked_ms` | Histogram |
| `vus` | `k6_vus` | Gauge |
| `vus_max` | `k6_vus_max` | Gauge |
| `data_received` | `k6_data_received_bytes` | Counter |
| `data_sent` | `k6_data_sent_bytes` | Counter |

## 5. Grafana 대시보드

### 공식 대시보드 ID

| ID | 이름 | 설명 |
|----|----|------|
| **19665** | k6 Prometheus | 표준 Trend 메트릭용 (권장) |
| **18030** | k6 Prometheus Native Histograms | Native Histogram 변환 사용 시 |
| **18595** | k6 Load Testing Results | 추가 시각화 패널 |
| **24483** | k6 Prometheus Next Gen | 최신 버전 대시보드 |

### 대시보드 임포트 방법

**Grafana UI:**
1. Dashboards → New → Import
2. Dashboard ID 입력 (예: 19665)
3. 데이터 소스 선택 (Prometheus)
4. Import

**API:**
```bash
curl -X POST http://grafana:3000/api/dashboards/db \
  -H "Authorization: Bearer $GRAFANA_TOKEN" \
  -H "Content-Type: application/json" \
  -d @dashboard.json
```

### 주요 패널 구성

**대시보드 19665 포함:**
- VU (Virtual Users) 시계열
- 요청 처리량 (requests/sec)
- 평균 응답 시간
- 응답 시간 백분위수 (p95, p99)
- 오류율
- 데이터 전송량 (송수신)
- 점검 통과율

## 6. 메트릭 데이터 집계

### Trend 메트릭 집계 원리

k6는 나노초(ns) 정밀도로 데이터 수집하지만 Prometheus는 밀리초(ms) 정밀도 저장. 메모리 효율을 위해 집계:

```
Raw data (nanoseconds)
    ↓
k6 집계 (설정된 통계 함수 적용)
    ↓
Prometheus 메트릭 (시계열)
```

### 집계 사례

**K6_PROMETHEUS_RW_TREND_STATS=p(95),p(99),min,max,avg 설정 시:**
```
http_req_duration_p(95)_ms
http_req_duration_p(99)_ms
http_req_duration_min_ms
http_req_duration_max_ms
http_req_duration_avg_ms
```

각각 별도의 Prometheus 시계열로 저장됨.

## 7. 실제 사용 예시

### 로컬 전체 스택 (k6 + Prometheus + Grafana)

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--web.enable-remote-write-receiver'
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana

volumes:
  prometheus_data:
  grafana_data:
```

**k6 스크립트 (script.js):**
```javascript
import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  http.get('http://example.com');
  sleep(1);
}
```

**실행:**
```bash
docker-compose up -d

K6_PROMETHEUS_RW_SERVER_URL=http://localhost:9090/api/v1/write \
K6_PROMETHEUS_RW_TREND_STATS=p(95),p(99),min,max,avg \
k6 run -o experimental-prometheus-rw script.js
```

**Grafana 접속:** http://localhost:3000 (admin/admin)
- Datasource: Prometheus (http://prometheus:9090)
- Dashboard: ID 19665 import

### 클라우드 환경 (Grafana Cloud)

```bash
K6_PROMETHEUS_RW_SERVER_URL=https://prometheus-blocks-prod-us-central1.grafana.net/api/prom/push \
K6_PROMETHEUS_RW_USERNAME=<USER_ID> \
K6_PROMETHEUS_RW_PASSWORD=<API_TOKEN> \
K6_PROMETHEUS_RW_TREND_AS_NATIVE_HISTOGRAM=true \
k6 run -o experimental-prometheus-rw --tag scenario=api_load_test script.js
```

## 8. 트러블슈팅

### 문제: HTTP 404 오류 (Prometheus에 메트릭이 안 들어옴)

**원인:** Remote write receiver가 활성화되지 않음

**해결:**
```bash
# Prometheus 시작 시 플래그 확인
prometheus --web.enable-remote-write-receiver
```

### 문제: Basic Auth 실패

**확인:**
```bash
# URL이 정확한지 확인
curl -u username:password http://prometheus:9090/api/v1/write

# k6 환경 변수 확인
echo $K6_PROMETHEUS_RW_USERNAME
echo $K6_PROMETHEUS_RW_PASSWORD
```

### 문제: 과도한 메트릭 데이터 (저장소 증가)

**원인:** Trend 통계가 너무 많음

**해결:**
```bash
# 필요한 통계만 선택
K6_PROMETHEUS_RW_TREND_STATS=p(95),p(99),avg,max \
k6 run -o experimental-prometheus-rw script.js
```

### 문제: Grafana에 대시보드 데이터 안 보임

**확인 사항:**
1. 데이터 소스가 올바른 Prometheus 가리키는지 확인
2. 시간 범위가 맞는지 확인 (테스트 실행 시간)
3. PromQL 쿼리 테스트: `k6_http_reqs_total`

## 참고

- [k6 Prometheus Remote Write 공식 문서](https://grafana.com/docs/k6/latest/results-output/real-time/prometheus-remote-write/)
- [xk6-output-prometheus-remote GitHub](https://github.com/grafana/xk6-output-prometheus-remote)
- [xk6-output-prometheus-pushgateway GitHub](https://github.com/martymarron/xk6-output-prometheus-pushgateway)
- [Prometheus Remote Write Spec](https://prometheus.io/docs/specs/prw/remote_write_spec/)
- [k6 공식 대시보드 모음](https://grafana.com/grafana/dashboards/?search=k6)

#tool/k6 #tool/prometheus #monitoring/metrics #devops
