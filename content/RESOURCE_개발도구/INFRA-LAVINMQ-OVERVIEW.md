# LavinMQ 개요

> [!info] 정보 출처 표시
> - ✅ **공식**: 공식 사이트/문서에서 확인된 정보
> - 💡 **추측/참고**: 일반적인 경험 기반 제안

## 공식 출처

| 출처 | URL |
|------|-----|
| **공식 사이트** | https://www.lavinmq.com |
| **문서** | https://lavinmq.com/documentation |
| **GitHub** | https://github.com/cloudamqp/lavinmq |
| **CloudAMQP** | https://www.cloudamqp.com (호스팅 서비스) |

---

## LavinMQ란? ✅

LavinMQ는 **Crystal 언어로 작성된 초고속 메시지 브로커**입니다. CloudAMQP 팀이 RabbitMQ를 10년간 호스팅하면서 겪은 문제들을 해결하기 위해 개발했습니다.

### 핵심 특징
- **AMQP 0.9.1 프로토콜** 완벽 지원
- **초당 100만+ 메시지** 처리 가능
- **최소한의 리소스** 사용
- **단일 바이너리** 배포
- **RabbitMQ 호환** (기존 클라이언트 그대로 사용)

---

## 왜 LavinMQ인가? ✅

### 1. 압도적인 성능

| 메트릭 | 수치 |
|--------|------|
| **최대 처리량** | 600,000 msg/s (단일 m6g.large EC2) |
| **Producer 최대** | 1,200,000 msg/s |
| **Consumer 최대** | 1,000,000 msg/s (auto-ack) |
| **16바이트 메시지** | 400,000+ msg/s |
| **1KB 메시지** | 200,000+ msg/s |
| **Raspberry Pi 5** | 600,000 msg/s |

> RabbitMQ 대비 **5~10배 빠른** 처리량

### 2. 극한의 리소스 효율성 ✅

| 작업 | 메모리 사용량 |
|------|--------------|
| **1,000만 메시지 큐잉** | ~80 MB RAM |
| **100,000 큐 선언** | ~100 MB RAM |
| **8,000 연결** | ~400 MB RAM |

- 메시지를 **디스크에 직접 기록** (메모리 부담 최소화)
- OS 파일 시스템 캐시 활용
- 무제한 큐 길이 지원 (디스크 한도까지)

### 3. 단순한 운영 ✅

- **단일 바이너리** 설치
- **최소한의 설정**으로 즉시 실행
- 의존성 거의 없음
- Docker 이미지 제공

### 4. RabbitMQ 완벽 호환 ✅

- 기존 AMQP 0.9.1 클라이언트 **그대로 사용**
- RabbitMQ에서 **마이그레이션 용이**
- 모든 주요 언어 SDK 지원

### 5. 스트림 큐 지원 ✅

- Kafka 스타일의 **메시지 재생** 가능
- 오프셋 기반 소비
- 비파괴적 읽기

---

## RabbitMQ vs LavinMQ vs Kafka ✅

| 특성 | LavinMQ | RabbitMQ | Kafka |
|------|---------|----------|-------|
| **언어** | Crystal | Erlang | Scala/Java |
| **프로토콜** | AMQP 0.9.1 | AMQP 0.9.1+ | 자체 프로토콜 |
| **처리량** | 매우 높음 | 중간 | 매우 높음 |
| **메모리 효율** | 매우 높음 | 중간 | 중간 |
| **설정 복잡도** | 낮음 | 중간 | 높음 |
| **스트림 지원** | O | O | O (네이티브) |
| **클러스터링** | O (v2.0+) | O | O |
| **플러그인** | 제한적 | 풍부함 | 풍부함 |
| **학습 곡선** | 낮음 | 중간 | 높음 |

### 언제 LavinMQ를 선택? 💡

**LavinMQ 추천**:
- 높은 처리량 + 낮은 지연 필요
- 리소스 제약 환경 (IoT, 엣지)
- 간단한 메시징 요구사항
- RabbitMQ에서 성능 병목 발생

**RabbitMQ 추천**:
- 복잡한 라우팅 로직 필요
- 다양한 플러그인 활용
- 기존 RabbitMQ 전문성 보유

**Kafka 추천**:
- 이벤트 소싱/CQRS 아키텍처
- 로그 압축 필요
- Kafka Streams 활용
- 대규모 분산 시스템

---

## 핵심 개념 ✅

### AMQP 0.9.1 기본 구조

```
Producer → Exchange → Binding → Queue → Consumer
```

### Exchange 타입

| 타입 | 설명 |
|------|------|
| **Direct** | 라우팅 키 정확히 일치 |
| **Fanout** | 모든 바인딩된 큐에 브로드캐스트 |
| **Topic** | 와일드카드 패턴 매칭 (`*.log`, `#.error`) |
| **Headers** | 헤더 속성 기반 라우팅 |
| **Consistent Hash** | 해시 기반 부하 분산 |

### 메시지 흐름 예시

```
[Order Service]
      │
      ▼ publish("order.created")
┌─────────────────┐
│  Topic Exchange │
│  "orders"       │
└─────────────────┘
      │
      ├─── "order.*" ───► [Notification Queue] → Email Service
      │
      └─── "order.created" ──► [Inventory Queue] → Inventory Service
```

---

## 스트림 큐 (Streams) ✅

LavinMQ 2.0+에서 지원하는 Kafka 스타일 기능

### 특징

- **비파괴적 읽기**: 메시지 소비 후에도 유지
- **오프셋 기반**: 특정 위치부터 재생 가능
- **다중 컨슈머**: 같은 메시지를 여러 컨슈머가 읽기
- **시간 기반 보존**: TTL 설정 가능

### vs 일반 큐

| 기능 | 일반 큐 | 스트림 큐 |
|------|---------|-----------|
| **소비 후 메시지** | 삭제됨 | 유지됨 |
| **재생** | 불가 | 가능 |
| **다중 컨슈머** | 경쟁적 | 독립적 |
| **사용 사례** | 작업 큐 | 이벤트 로그 |

### 스트림 vs Kafka

LavinMQ 스트림은 AMQP 0.9.1 위에서 동작하므로:
- ✅ 기존 AMQP 클라이언트 사용 가능
- ❌ Kafka 클라이언트 호환 안 됨
- ❌ 파티셔닝 전략 없음
- ❌ 로그 압축 없음

---

## 설치 및 실행 ✅

### Docker (가장 간단)

```bash
docker run -d \
  --name lavinmq \
  -p 5672:5672 \
  -p 15672:15672 \
  cloudamqp/lavinmq
```

### Docker Compose

```yaml
version: '3.8'
services:
  lavinmq:
    image: cloudamqp/lavinmq
    ports:
      - "5672:5672"    # AMQP
      - "15672:15672"  # Management UI
    volumes:
      - lavinmq_data:/var/lib/lavinmq
    environment:
      - LAVINMQ_ADMIN_PASSWORD=admin

volumes:
  lavinmq_data:
```

### 바이너리 설치 (Linux)

```bash
# Debian/Ubuntu
curl -fsSL https://packagecloud.io/cloudamqp/lavinmq/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/lavinmq.gpg
echo "deb [signed-by=/usr/share/keyrings/lavinmq.gpg] https://packagecloud.io/cloudamqp/lavinmq/ubuntu focal main" | sudo tee /etc/apt/sources.list.d/lavinmq.list
sudo apt update && sudo apt install lavinmq
```

### Management UI

- URL: `http://localhost:15672`
- 기본 계정: `guest` / `guest`

---

## 클라이언트 코드 예시 💡

### Node.js (amqplib)

```javascript
const amqp = require('amqplib');

// 연결
const connection = await amqp.connect('amqp://localhost');
const channel = await connection.createChannel();

// 큐 선언
await channel.assertQueue('tasks', { durable: true });

// 메시지 발행
channel.sendToQueue('tasks', Buffer.from('Hello LavinMQ!'), {
  persistent: true
});

// 메시지 소비
channel.consume('tasks', (msg) => {
  console.log('Received:', msg.content.toString());
  channel.ack(msg);
});
```

### Python (pika)

```python
import pika

# 연결
connection = pika.BlockingConnection(
    pika.ConnectionParameters('localhost')
)
channel = connection.channel()

# 큐 선언
channel.queue_declare(queue='tasks', durable=True)

# 메시지 발행
channel.basic_publish(
    exchange='',
    routing_key='tasks',
    body='Hello LavinMQ!',
    properties=pika.BasicProperties(delivery_mode=2)
)

# 메시지 소비
def callback(ch, method, properties, body):
    print(f"Received: {body}")
    ch.basic_ack(delivery_tag=method.delivery_tag)

channel.basic_consume(queue='tasks', on_message_callback=callback)
channel.start_consuming()
```

### Go (amqp091-go)

```go
package main

import (
    "log"
    amqp "github.com/rabbitmq/amqp091-go"
)

func main() {
    conn, _ := amqp.Dial("amqp://localhost")
    ch, _ := conn.Channel()

    q, _ := ch.QueueDeclare("tasks", true, false, false, false, nil)

    // 발행
    ch.Publish("", q.Name, false, false, amqp.Publishing{
        ContentType: "text/plain",
        Body:        []byte("Hello LavinMQ!"),
    })

    // 소비
    msgs, _ := ch.Consume(q.Name, "", false, false, false, false, nil)
    for msg := range msgs {
        log.Printf("Received: %s", msg.Body)
        msg.Ack(false)
    }
}
```

---

## 성능 튜닝 팁 💡

### Prefetch 설정

```javascript
// Consumer당 한 번에 가져올 메시지 수
channel.prefetch(10);
```

- **낮은 값 (1-10)**: 공정한 분배, 처리량 낮음
- **높은 값 (100+)**: 높은 처리량, 메모리 사용 증가

### Publisher Confirms

```javascript
await channel.confirmSelect();
channel.sendToQueue('tasks', Buffer.from('msg'));
await channel.waitForConfirms(); // 확인 대기
```

### Batch 처리

```javascript
// 여러 메시지를 한 번에 발행
for (const msg of messages) {
  channel.sendToQueue('tasks', Buffer.from(msg));
}
await channel.waitForConfirms(); // 한 번만 확인
```

---

## 사용 사례 💡

### 1. 작업 큐 (Task Queue)

```
[Web Server] → [LavinMQ] → [Worker 1]
                         → [Worker 2]
                         → [Worker 3]
```

이미지 처리, 이메일 발송, 보고서 생성 등 비동기 작업

### 2. 이벤트 버스

```
[User Service] ──┐
[Order Service] ─┼──► [LavinMQ] ──► [Analytics]
[Payment Service]┘                 ─► [Notification]
```

마이크로서비스 간 이벤트 기반 통신

### 3. IoT 데이터 파이프라인

```
[Sensors] → [Edge Gateway] → [LavinMQ] → [Time Series DB]
                                       → [Alert Service]
```

수백만 센서 데이터 실시간 수집

### 4. 실시간 알림

```
[Event Source] → [LavinMQ] → [WebSocket Server] → [Clients]
```

푸시 알림, 실시간 대시보드

---

## 모니터링 💡

### Prometheus 메트릭

LavinMQ는 Prometheus 호환 메트릭 엔드포인트 제공:

```
http://localhost:15692/metrics
```

### 주요 메트릭

| 메트릭 | 설명 |
|--------|------|
| `lavinmq_messages_published` | 발행된 메시지 수 |
| `lavinmq_messages_delivered` | 전달된 메시지 수 |
| `lavinmq_queue_messages` | 큐에 대기 중인 메시지 |
| `lavinmq_connections` | 현재 연결 수 |

### Grafana 대시보드

CloudAMQP에서 제공하는 대시보드 템플릿 활용 가능

---

## CloudAMQP 호스팅 ✅

직접 운영하기 어려우면 CloudAMQP의 관리형 서비스 이용:

| 플랜 | 메시지/월 | 연결 | 가격 |
|------|----------|------|------|
| **Little Lemur** | 1M | 20 | 무료 |
| **Tough Tiger** | 25M | 100 | $19/월 |
| **Big Bunny** | 100M | 500 | $99/월 |

---

## 한계점 💡

### LavinMQ가 부족한 부분

1. **플러그인 생태계**: RabbitMQ 대비 제한적
2. **지연 큐**: 네이티브 지원 없음 (workaround 필요)
3. **Priority Queue**: 제한적 지원
4. **Shovel/Federation**: 제한적 지원
5. **커뮤니티 규모**: RabbitMQ/Kafka 대비 작음

### 마이그레이션 시 주의

- 일부 RabbitMQ 플러그인 기능 사용 불가
- 복잡한 라우팅 로직은 재검토 필요

---

## 관련 문서

- [[rabbitmq-overview]] - RabbitMQ 비교용
- [[kafka-overview]] - Kafka 비교용
- [[message-queue-patterns]] - 메시지 큐 패턴

---

## 참고 자료

- [LavinMQ vs RabbitMQ vs Kafka 비교](https://medium.com/@lovisajohansson/message-broker-showdown-rabbitmq-vs-lavinmq-vs-apache-kafka-5a12d0d41993)
- [LavinMQ 벤치마크](https://www.cloudamqp.com/blog/lavinmq-benchmarks.html)
- [LavinMQ 선택 이유 5가지](https://www.cloudamqp.com/blog/five-reasons-to-consider-lavinmq-when-choosing-message-broker.html)
- [2024 AMQP 리포트](https://www.cloudamqp.com/blog/annual-amqp-report-2024-by-cloudamqp.html)

---

*마지막 업데이트: 2025-12-23*
