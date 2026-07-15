# PostgreSQL 파티셔닝과 ORM

> Last Updated: 2026-02-19 11:34 (목요일)

## 파티셔닝이란

대용량 테이블을 특정 기준(날짜, 범위, 해시 등)으로 물리적으로 분할하는 기법.
채팅, 로그, 결제 내역 같은 **시계열/이벤트성 데이터**에 주로 적용한다.

### 장점

- **파티션 프루닝**: `WHERE send_time_at BETWEEN ...` 조건 시 해당 파티션만 스캔
- **인덱스 비대화 방지**: 각 파티션별로 작은 인덱스 유지
- **VACUUM 부하 분산**: 파티션 단위로 VACUUM 실행
- **오래된 데이터 관리**: 파티션 단위 DROP/DETACH로 빠른 삭제 가능

### 파티션 타입

| 타입 | 기준 | 예시 |
|------|------|------|
| Range | 범위 | 월별 `send_time_at` |
| List | 값 목록 | 국가별 `country_code` |
| Hash | 해시 | `user_id % N` |

---

## 핵심 제약: PK에 파티션 키 포함 필수

PostgreSQL 파티셔닝의 가장 중요한 규칙:

> **파티션 키 컬럼이 반드시 PK(또는 UNIQUE 제약)에 포함되어야 한다.**

### 왜?

PostgreSQL은 파티션별로 독립적인 인덱스를 관리한다.
UNIQUE/PK 제약은 **단일 파티션 내에서만** 보장할 수 있고, 파티션 키가 포함되어야 어떤 파티션에서 체크할지 결정할 수 있다.

### 연쇄 영향

```
파티션 키가 PK에 포함
  → PK가 복합키로 변경 (id → id + partition_key)
    → 이 테이블을 참조하는 FK가 깨짐 (단일 컬럼 → 복합 컬럼 불일치)
      → FK 제거 필요
        → DB 레벨 참조 무결성 상실
```

---

## FK가 깨지는 이유

**파티셔닝 전:**
```sql
-- t_live_chats PK: (id)
-- t_live_chat_notices FK: live_chat_id → t_live_chats.id  ✅ 동작
```

**파티셔닝 후:**
```sql
-- t_live_chats PK: (id, send_time_at)  -- 복합키
-- t_live_chat_notices FK: live_chat_id → t_live_chats.id  ❌ 불가
-- (id 단독으로는 UNIQUE가 아님)
```

FK를 유지하려면 참조하는 쪽에도 `send_time_at` 컬럼을 추가하고 복합 FK를 걸어야 하는데, 이는 설계를 크게 변경해야 한다.

---

## ORM과의 충돌

### 문제

ORM은 논리적 모델 레이어를 추상화하는 도구인데, 파티셔닝은 물리적 스토리지 레이어의 관심사다. 본질적으로 잘 맞지 않는다.

### ORM별 파티셔닝 지원 현황

| ORM | 지원 수준 |
|-----|----------|
| **Prisma** | 없음. raw SQL 마이그레이션 직접 작성 |
| **TypeORM** | 없음. 동일하게 raw SQL 필요 |
| **Django ORM** | 기본 없음. `django-postgres-extra` 서드파티로 부분 지원 |
| **SQLAlchemy** | 가장 나은 편. `postgresql_partition_by` 옵션으로 테이블 생성 가능. 파티션 자동 관리는 직접 해야 함 |
| **Rails ActiveRecord** | `pgpartman` 확장과 조합하는 패턴이 일반적 |

---

## 실무 패턴: "DB FK 제거 + ORM Relation 유지"

파티셔닝 시 사실상 표준적인 접근:

### 구조

```
[DB 레벨]
  - FK 제약 제거 (파티셔닝 PK와 호환 불가)
  - 참조 무결성은 앱에서 보장

[ORM 레벨]
  - relation 정의 유지
  - ORM이 생성하는 JOIN 쿼리는 FK 없이도 정상 동작
  - ORM은 파티셔닝을 "모른 채" 평소처럼 쿼리
```

### Prisma 예시 (실무 프로젝트)

```prisma
// Prisma schema — 변경 없이 유지
model LiveChat {
  id BigInt @id @default(autoincrement())  // DB PK는 (id, send_time_at) 복합키
  // ...
  liveChatNotices LiveChatNotice[]
}

model LiveChatNotice {
  liveChatId BigInt   @map("live_chat_id")
  liveChat   LiveChat @relation(fields: [liveChatId], references: [id])
  // DB에서 FK는 제거됨, 하지만 Prisma JOIN은 정상 동작
}
```

### 주의점

- **스키마 드리프트 발생**: DB 실제 상태와 Prisma schema가 다름
- `prisma migrate dev` 실행 시 **반드시 `--create-only`** 후 SQL 리뷰 필요 (Prisma가 PK를 되돌리려 할 수 있음)
- DB 레벨 참조 무결성이 없으므로 **잘못된 FK 값 INSERT 방지는 앱 로직에서 책임**

---

## 파티션 관리 전략

파티셔닝은 생성만으로 끝나지 않는다. 새 파티션을 계속 만들어야 한다.

### 방법 1: 스케줄러 (앱 레벨)

```typescript
// 매월 1일 06:00에 미래 3개월치 파티션 자동 생성
scheduler.addCronJob({
  name: "라이브 채팅 파티션 자동 생성",
  task: () => ensureLiveChatPartitions(),
  asterisks: "0 6 1 * *",
});
```

### 방법 2: pg_partman (DB 확장)

```sql
SELECT partman.create_parent(
  'public.t_live_chats',
  'send_time_at',
  'native',
  'monthly'
);
```

### 안전망: DEFAULT 파티션

```sql
CREATE TABLE "t_live_chats_default" PARTITION OF "t_live_chats" DEFAULT;
```

매칭되는 파티션이 없는 데이터는 DEFAULT로 들어간다. 파티션 생성이 늦어져도 INSERT 실패를 방지.

---

## 참고

- [PostgreSQL Table Partitioning 공식 문서](https://www.postgresql.org/docs/current/ddl-partitioning.html)
