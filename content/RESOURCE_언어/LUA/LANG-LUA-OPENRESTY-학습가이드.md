# OpenResty & Lua 학습 가이드

> OpenResty와 Lua를 처음 접하는 TypeScript 개발자를 위한 종합 학습 가이드

---

## 목차

1. [[#1. OpenResty란?]]
2. [[#2. Lua 기초 문법]]
3. [[#3. TypeScript vs Lua 비교]]
4. [[#4. ngx_lua 핵심 개념]]
5. [[#5. Nginx 처리 단계(Phase)]]
6. [[#6. 학습 로드맵]]
7. [[#7. 참고 자료]]

---

## 1. OpenResty란?

### 한 문장 정의

**OpenResty = Nginx + Lua**

Nginx 웹서버에 Lua 스크립팅 기능을 추가한 플랫폼입니다.

### 왜 OpenResty를 쓰나요?

| 구분          | 기존 Nginx                      | OpenResty                              |
| ------------- | ------------------------------- | -------------------------------------- |
| 설정 방식     | 정적 설정만 가능                | **동적 로직** 작성 가능                |
| 복잡한 조건   | C 모듈 개발 필요                | **Lua 스크립트**로 간단히 구현         |
| 외부 서비스   | 연동 어려움                     | Redis, MySQL, HTTP API 등 **쉽게 연동** |

### 핵심 구성요소

```
┌─────────────────────────────────────────────────────────────┐
│                       OpenResty                              │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │    Nginx    │  │   LuaJIT    │  │    ngx_lua 모듈     │  │
│  │  (웹서버)   │  │ (Lua 엔진)  │  │ (Nginx-Lua 연결)    │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              lua-resty-* 라이브러리                      │ │
│  │  • resty.http (HTTP 클라이언트)                          │ │
│  │  • resty.redis (Redis 클라이언트)                        │ │
│  │  • resty.mysql (MySQL 클라이언트)                        │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Lua 기초 문법

> Lua는 간단하고 가벼운 스크립트 언어입니다. 30분이면 기본을 익힐 수 있습니다.

### 2.1 변수와 데이터 타입

```lua
-- 변수 선언 (local 키워드 권장)
local name = "홍길동"        -- 문자열
local age = 25               -- 숫자
local is_admin = true        -- 불린
local nothing = nil          -- null과 같음

-- 전역 변수 (local 없이) - 사용 자제
global_var = "피하세요"
```

### 2.2 테이블 (Table)

Lua에서 **가장 중요한** 자료구조입니다. 배열과 객체(딕셔너리) 역할을 모두 합니다.

```lua
-- 배열처럼 사용 (인덱스는 1부터 시작!)
local fruits = {"사과", "바나나", "포도"}
print(fruits[1])  -- "사과" (주의: 0이 아니라 1부터!)

-- 딕셔너리처럼 사용
local user = {
    name = "홍길동",
    age = 25,
    email = "hong@example.com"
}
print(user.name)       -- "홍길동"
print(user["email"])   -- "hong@example.com"

-- 중첩 테이블
local config = {
    server = {
        host = "localhost",
        port = 8080
    },
    timeout = 30
}
print(config.server.port)  -- 8080
```

### 2.3 제어문

```lua
-- if 문
local score = 85

if score >= 90 then
    print("A")
elseif score >= 80 then
    print("B")
else
    print("C")
end

-- for 문 (숫자 범위)
for i = 1, 5 do
    print(i)  -- 1, 2, 3, 4, 5
end

-- for 문 (테이블 순회)
local colors = {"빨강", "파랑", "노랑"}
for index, color in ipairs(colors) do
    print(index, color)
end

-- for 문 (딕셔너리 순회)
local user = {name = "홍길동", age = 25}
for key, value in pairs(user) do
    print(key, value)
end
```

### 2.4 함수

```lua
-- 기본 함수
local function greet(name)
    return "안녕하세요, " .. name .. "님!"
end

print(greet("홍길동"))  -- "안녕하세요, 홍길동님!"

-- 여러 값 반환 (Lua의 강점!)
local function divide(a, b)
    if b == 0 then
        return nil, "0으로 나눌 수 없습니다"
    end
    return a / b, nil
end

local result, err = divide(10, 0)
if err then
    print("에러:", err)
else
    print("결과:", result)
end
```

### 2.5 모듈 시스템

```lua
-- ===== 모듈 정의 (mymodule.lua) =====
local _M = {}  -- 모듈 테이블

-- private 함수 (외부에서 접근 불가)
local function internal_helper()
    return "내부 함수"
end

-- public 함수 (외부에서 사용 가능)
function _M.hello(name)
    return "Hello, " .. name
end

return _M  -- 모듈 반환


-- ===== 모듈 사용 =====
local mymodule = require("mymodule")
print(mymodule.hello("Lua"))  -- "Hello, Lua"
```

### 2.6 에러 처리 (pcall)

```lua
-- pcall: protected call (안전한 함수 호출)
local function risky_function()
    error("뭔가 잘못됨!")
end

-- pcall로 안전하게 호출
local ok, err = pcall(risky_function)
if not ok then
    print("에러 발생:", err)
end

-- 실제 사용 예: JSON 파싱
local cjson = require("cjson")
local json_str = '{"invalid": json}'  -- 잘못된 JSON

local ok, data = pcall(cjson.decode, json_str)
if not ok then
    print("JSON 파싱 실패")
end
```

---

## 3. TypeScript vs Lua 비교

> TypeScript 개발자를 위한 빠른 Lua 적응 가이드입니다.

### 3.1 한눈에 보는 차이점

| 구분             | TypeScript                 | Lua                          |
| ---------------- | -------------------------- | ---------------------------- |
| 타입 시스템      | 정적 타입                  | 동적 타입 (타입 없음)        |
| 배열 인덱스      | 0부터 시작                 | **1부터 시작**               |
| 문자열 연결      | `+` 또는 템플릿 리터럴     | `..` (두 개의 점)            |
| null/undefined   | `null`, `undefined`        | `nil` (하나만 있음)          |
| 객체/배열        | `{}`, `[]` 구분            | `{}` 테이블 하나로 통일      |
| 블록 구분        | `{ }` 중괄호               | `then/do/end` 키워드         |
| 주석             | `//`, `/* */`              | `--`, `--[[ ]]`              |
| 같음 비교        | `===` (엄격)               | `==` (하나만 있음)           |
| 다름 비교        | `!==`                      | `~=`                         |
| 논리 연산        | `&&`, `\|\|`, `!`          | `and`, `or`, `not`           |
| 모듈             | `import/export`            | `require()` / `return`       |
| 클래스           | `class` 키워드             | 테이블 + 메타테이블          |
| 화살표 함수      | `() => {}`                 | 없음 (`function() end`)      |
| 스프레드         | `...arr`                   | 없음                         |
| 구조분해         | `const {a, b} = obj`       | 없음 (수동 할당)             |

### 3.2 변수 선언

```typescript
// TypeScript
const name: string = "홍길동";
let age: number = 25;
const isAdmin: boolean = true;
const nothing: null = null;
```

```lua
-- Lua
local name = "홍길동"      -- 타입 선언 없음
local age = 25
local is_admin = true
local nothing = nil        -- null 대신 nil

-- 전역 변수 (local 없으면 전역 - 피할 것!)
global_var = "위험"
```

### 3.3 배열/리스트

```typescript
// TypeScript - 0부터 시작
const fruits: string[] = ["사과", "바나나", "포도"];
console.log(fruits[0]);  // "사과"
console.log(fruits.length);  // 3

// 배열 메서드
fruits.push("딸기");
fruits.forEach((fruit, i) => console.log(i, fruit));
```

```lua
-- Lua - 1부터 시작!
local fruits = {"사과", "바나나", "포도"}
print(fruits[1])  -- "사과" (0이 아님!)
print(#fruits)    -- 3 (# = 길이 연산자)

-- 배열에 추가
table.insert(fruits, "딸기")

-- 순회 (ipairs = 배열용)
for i, fruit in ipairs(fruits) do
    print(i, fruit)
end
```

### 3.4 객체/딕셔너리

```typescript
// TypeScript
const user = {
    name: "홍길동",
    age: 25,
};

// 구조 분해
const { name, age } = user;

// 스프레드
const newUser = { ...user, age: 26 };

// Optional chaining
const email = user?.email ?? "없음";
```

```lua
-- Lua (테이블 = 객체 + 배열)
local user = {
    name = "홍길동",
    age = 25,
}

-- 구조 분해 없음 - 수동으로
local name = user.name
local age = user.age

-- 스프레드 없음 - 수동 복사
local new_user = {}
for k, v in pairs(user) do
    new_user[k] = v
end
new_user.age = 26

-- Optional chaining 없음
local email = user.email or "없음"
```

### 3.5 조건문

```typescript
// TypeScript
if (score >= 90) {
    console.log("A");
} else if (score >= 80) {
    console.log("B");
} else {
    console.log("C");
}

// 삼항 연산자
const grade = score >= 90 ? "A" : "B";
```

```lua
-- Lua (중괄호 대신 then/end)
if score >= 90 then
    print("A")
elseif score >= 80 then
    print("B")
else
    print("C")
end

-- 삼항 연산자 없음 - and/or 패턴 사용
local grade = score >= 90 and "A" or "B"
```

### 3.6 반복문

```typescript
// TypeScript
for (let i = 0; i < 5; i++) {
    console.log(i);
}

for (const item of items) {
    console.log(item);
}

for (const key in obj) {
    console.log(key, obj[key]);
}
```

```lua
-- Lua
-- 숫자 범위 (1부터 5까지, 포함)
for i = 1, 5 do
    print(i)  -- 1, 2, 3, 4, 5
end

-- 배열 순회 (ipairs)
for index, item in ipairs(items) do
    print(index, item)
end

-- 딕셔너리 순회 (pairs)
for key, value in pairs(obj) do
    print(key, value)
end
```

### 3.7 함수

```typescript
// TypeScript
function greet(name: string): string {
    return `Hello, ${name}!`;
}

// 화살표 함수
const add = (a: number, b: number): number => a + b;

// 기본값 파라미터
function greet(name: string = "Guest"): string {
    return `Hello, ${name}!`;
}

// 여러 값 반환 (튜플)
function getMinMax(arr: number[]): [number, number] {
    return [Math.min(...arr), Math.max(...arr)];
}
const [min, max] = getMinMax([1, 2, 3]);
```

```lua
-- Lua
local function greet(name)
    return "Hello, " .. name .. "!"
end

-- 변수에 함수 할당 (화살표 함수 대체)
local add = function(a, b)
    return a + b
end

-- 기본값 파라미터 (or 패턴)
local function greet(name)
    name = name or "Guest"
    return "Hello, " .. name .. "!"
end

-- 여러 값 반환 (Lua의 강점!)
local function get_min_max(arr)
    return math.min(unpack(arr)), math.max(unpack(arr))
end
local min, max = get_min_max({1, 2, 3})
```

### 3.8 문자열

```typescript
// TypeScript
const name = "홍길동";

// 템플릿 리터럴
const message = `안녕하세요, ${name}님!`;

// 문자열 연결
const full = "Hello" + " " + "World";
```

```lua
-- Lua
local name = "홍길동"

-- 템플릿 리터럴 없음 - string.format 사용
local message = string.format("안녕하세요, %s님!", name)

-- 문자열 연결 (..)
local full = "Hello" .. " " .. "World"

-- 길이
print(#str)  -- string.len(str)
```

### 3.9 에러 처리

```typescript
// TypeScript
try {
    const result = riskyOperation();
} catch (error) {
    console.error("에러:", error);
} finally {
    cleanup();
}
```

```lua
-- Lua (try-catch 없음 - pcall 사용)
local ok, result = pcall(function()
    return risky_operation()
end)

if ok then
    print(result)
else
    print("에러:", result)
end

-- finally 없음 - 수동으로
cleanup()  -- 항상 실행
```

### 3.10 모듈 시스템

```typescript
// TypeScript
// user.ts
export function createUser(name: string) {
    return { name, age: 0 };
}

// main.ts
import { createUser } from './user';
```

```lua
-- Lua
-- user.lua
local _M = {}

function _M.create_user(name)
    return { name = name, age = 0 }
end

return _M

-- main.lua
local user = require("user")
local new_user = user.create_user("홍길동")
```

### 3.11 자주 하는 실수 요약

| TypeScript 습관    | Lua에서 잘못된 점       | Lua 올바른 방법           |
| ------------------ | ----------------------- | ------------------------- |
| `arr[0]`           | 배열은 1부터 시작       | `arr[1]`                  |
| `str + str`        | `+`는 숫자 연산용       | `str .. str`              |
| `!value`           | `!` 연산자 없음         | `not value`               |
| `a && b`           | `&&` 없음               | `a and b`                 |
| `a \|\| b`         | `\|\|` 없음             | `a or b`                  |
| `a !== b`          | `!==` 없음              | `a ~= b`                  |
| `{ }` 블록         | 중괄호로 블록 안됨      | `then/do ... end`         |
| `// 주석`          | `//` 안됨               | `-- 주석`                 |
| `null`             | `null` 없음             | `nil`                     |
| `arr.length`       | `.length` 없음          | `#arr`                    |
| `obj?.prop`        | Optional chaining 없음  | `obj and obj.prop`        |

### 3.12 마인드셋 전환

**TypeScript → Lua 전환 시 기억할 것:**

1. **타입을 버려라**: Lua는 동적 타입. 타입 걱정 대신 테스트로 검증
2. **테이블이 전부다**: 배열, 객체, 클래스 모두 테이블 하나로 해결
3. **1부터 시작**: 배열 인덱스. 정말 중요!
4. **nil은 친구**: undefined/null 구분 없이 nil 하나
5. **함수는 일급 객체**: 변수에 담고, 전달하고, 반환하기 자유로움
6. **여러 값 반환**: `return a, b, c` - 이건 TypeScript보다 편함!
7. **키워드로 블록**: `{ }` 대신 `then/do ... end`
8. **간결함 추구**: Lua는 미니멀. 내장 기능 적음 → 필요하면 직접 구현

---

## 4. ngx_lua 핵심 개념

### 4.1 ngx 객체

OpenResty에서 Lua는 `ngx` 전역 객체를 통해 Nginx와 상호작용합니다.

```lua
-- ngx 객체 = Nginx에 대한 모든 것
ngx.var.*      -- Nginx 변수 접근
ngx.req.*      -- 요청 정보 접근/조작
ngx.resp.*     -- 응답 정보
ngx.log()      -- 로그 출력
ngx.say()      -- 응답 바디 출력
ngx.exit()     -- 요청 처리 종료
ngx.shared.*   -- 공유 메모리
```

### 4.2 요청 정보 읽기

```lua
-- 기본 요청 정보
local uri = ngx.var.uri                   -- /api/users
local args = ngx.var.args                 -- id=123&name=test
local method = ngx.var.request_method     -- GET, POST 등
local host = ngx.var.host                 -- example.com
local remote_addr = ngx.var.remote_addr   -- 클라이언트 IP

-- 헤더 읽기
local headers = ngx.req.get_headers()
local content_type = headers["Content-Type"]
local auth = headers["Authorization"]

-- POST 바디 읽기
ngx.req.read_body()  -- 먼저 호출 필수!
local body = ngx.req.get_body_data()
```

### 4.3 응답 생성

```lua
-- 상태 코드 설정
ngx.status = 200

-- 헤더 설정
ngx.header["Content-Type"] = "application/json"
ngx.header["X-Custom-Header"] = "custom-value"

-- 바디 출력
ngx.say('{"status": "ok"}')   -- 줄바꿈 포함
ngx.print('raw output')       -- 줄바꿈 없음

-- 요청 처리 종료
ngx.exit(200)

-- 한 번에 처리하는 패턴
ngx.status = 404
ngx.header["Content-Type"] = "application/json"
ngx.say('{"error": "Not found"}')
return ngx.exit(404)
```

### 4.4 로깅

```lua
-- 로그 레벨 (중요도 순)
ngx.log(ngx.ERR,    "에러")         -- 일반적인 에러
ngx.log(ngx.WARN,   "경고")         -- 경고
ngx.log(ngx.INFO,   "정보")         -- 일반 정보
ngx.log(ngx.DEBUG,  "디버그")       -- 디버깅용

-- 실제 사용 예시
ngx.log(ngx.INFO, "요청 처리 시작: ", ngx.var.uri)
ngx.log(ngx.ERR, "백엔드 연결 실패: ", err)
```

### 4.5 공유 메모리 (Shared Dict)

**워커 프로세스 간 데이터 공유**를 위한 메커니즘입니다.

```nginx
# nginx.conf에서 정의
lua_shared_dict my_cache 10m;  # 10MB 캐시 공간
```

```lua
-- Lua에서 사용
local cache = ngx.shared.my_cache

-- 값 저장 (TTL 60초)
cache:set("user:123", '{"name":"홍길동"}', 60)

-- 값 조회
local value = cache:get("user:123")
if value then
    print("캐시 히트:", value)
else
    print("캐시 미스")
end

-- 값 삭제
cache:delete("user:123")

-- 카운터 (Rate Limiting에 유용)
local new_count, err = cache:incr("request_count", 1, 0)
```

### 4.6 비동기 HTTP 요청

```lua
local http = require("resty.http")

local function fetch_user(user_id)
    local httpc = http.new()

    -- 타임아웃 설정 (밀리초)
    httpc:set_timeouts(3000, 3000, 10000)

    local res, err = httpc:request_uri("http://api.internal/users/" .. user_id, {
        method = "GET",
        headers = {
            ["Content-Type"] = "application/json",
        }
    })

    if not res then
        ngx.log(ngx.ERR, "HTTP 요청 실패: ", err)
        return nil, err
    end

    return res.body, nil
end
```

---

## 5. Nginx 처리 단계(Phase)

OpenResty의 핵심! 요청이 **어떤 순서로 처리되는지** 이해해야 합니다.

### 5.1 Phase 순서

```
요청 도착
    │
    ▼
┌──────────────────────────────────────────────────────────────┐
│ 1. set_by_lua          변수 설정                              │
│    └─ 예: 계산된 값을 Nginx 변수에 저장                       │
├──────────────────────────────────────────────────────────────┤
│ 2. rewrite_by_lua      URL 재작성                             │
│    └─ 예: /old-path → /new-path 리다이렉트                    │
├──────────────────────────────────────────────────────────────┤
│ 3. access_by_lua       ★ 접근 제어 (인증/인가) ★              │
│    └─ 예: IP 검사, JWT 토큰 검증, Rate Limiting               │
├──────────────────────────────────────────────────────────────┤
│ 4. content_by_lua      ★ 응답 생성 ★                          │
│    └─ 예: API 응답, 프록시, 정적 파일 서빙                    │
├──────────────────────────────────────────────────────────────┤
│ 5. header_filter_by_lua   응답 헤더 수정                      │
│    └─ 예: CORS 헤더 추가, 캐시 헤더 설정                      │
├──────────────────────────────────────────────────────────────┤
│ 6. body_filter_by_lua     응답 바디 수정                      │
│    └─ 예: 응답 압축, 내용 변환                                │
├──────────────────────────────────────────────────────────────┤
│ 7. log_by_lua          로깅                                   │
│    └─ 예: 커스텀 로그 작성, 메트릭 수집                       │
└──────────────────────────────────────────────────────────────┘
    │
    ▼
응답 전송
```

### 5.2 Phase 활용 예시

```nginx
# nginx.conf

location / {
    # Phase 3: 접근 제어
    access_by_lua_file /mnt/efs/lua/middleware/access.lua;

    # Phase 4: 응답 생성 (라우팅 및 프록시)
    content_by_lua_file /mnt/efs/lua/handlers/router.lua;
}
```

**access.lua가 하는 일:**
1. 클라이언트 IP 확인
2. IP 화이트리스트 검사
3. 차단 시 403 반환, 통과 시 다음 Phase로

**router.lua가 하는 일:**
1. 요청 Host 헤더로 도메인 식별
2. 도메인 설정에서 백엔드 찾기
3. 백엔드로 프록시 요청
4. 응답을 클라이언트에 전달

### 5.3 Phase 간 데이터 전달

```lua
-- ngx.ctx: 요청별 데이터 저장 (Phase 간 공유)

-- access_by_lua에서
ngx.ctx.user_id = "12345"
ngx.ctx.start_time = ngx.now()

-- content_by_lua에서
local user_id = ngx.ctx.user_id  -- "12345"
local elapsed = ngx.now() - ngx.ctx.start_time
```

---

## 6. 학습 로드맵

### 1단계: 기초 (1-2일)

1. **Lua 기본 문법** 익히기
   - 변수, 테이블, 함수, 반복문
   - 모듈 시스템 (`local _M = {}`, `require`)
   - 권장: [Learn Lua in 15 Minutes](https://learnxinyminutes.com/docs/lua/)

2. **nginx.conf** 구조 이해
   - worker, http, server, location 블록
   - include 지시자

### 2단계: 핵심 개념 (2-3일)

1. **ngx_lua API** 핵심
   - `ngx.var.*`, `ngx.req.*`, `ngx.header.*`
   - `ngx.say()`, `ngx.exit()`, `ngx.log()`

2. **Phase 이해**
   - access_by_lua vs content_by_lua 차이
   - 언제 어떤 Phase를 쓰는지

3. **프로젝트 코드 읽기**
   - `middleware/access.lua` 분석
   - `handlers/router.lua` 분석

### 3단계: 실전 (3-5일)

1. **로컬 환경 설정**
   - Docker로 OpenResty 실행
   - 간단한 Hello World 작성

2. **수정 실습**
   - 새 도메인 추가해보기
   - 로깅 추가해보기
   - 에러 처리 개선해보기

3. **테스트**
   - busted로 유닛 테스트 작성
   - curl로 통합 테스트

### 4단계: 심화 (필요 시)

1. **lua-resty 라이브러리**
   - resty.http (HTTP 클라이언트)
   - resty.redis (Redis 연동)
   - resty.jwt (JWT 처리)

2. **성능 최적화**
   - 공유 메모리 활용
   - 코드 캐싱
   - 커넥션 풀링

---

## 7. 참고 자료

### 공식 문서

| 자료             | URL                                                  | 설명                    |
| ---------------- | ---------------------------------------------------- | ----------------------- |
| OpenResty 공식   | https://openresty.org/en/                            | OpenResty 홈페이지      |
| lua-nginx-module | https://github.com/openresty/lua-nginx-module        | ngx_lua API 레퍼런스    |
| lua-resty-http   | https://github.com/ledgetech/lua-resty-http          | HTTP 클라이언트 문서    |

### 튜토리얼

| 자료             | URL                                                           | 설명                         |
| ---------------- | ------------------------------------------------------------- | ---------------------------- |
| Lua 튜토리얼     | https://www.lua.org/pil/contents.html                         | Programming in Lua (공식 책) |
| OpenResty 가이드 | https://openresty.org/download/agentzh-nginx-tutorials-en.html | agentzh의 Nginx 튜토리얼     |

### 디버깅 팁

```bash
# Docker 로그 확인
docker logs -f openresty

# Lua 에러 로그
tail -f /usr/local/openresty/nginx/logs/error.log

# 설정 테스트
nginx -t

# 설정 리로드 (무중단)
nginx -s reload
```

---

## Quick Reference

### 자주 쓰는 ngx API

```lua
-- 요청 정보
ngx.var.uri              -- 요청 경로
ngx.var.args             -- 쿼리스트링
ngx.var.host             -- Host 헤더
ngx.var.remote_addr      -- 클라이언트 IP
ngx.req.get_headers()    -- 모든 헤더

-- 응답
ngx.status = 200         -- 상태 코드
ngx.header["Key"] = "V"  -- 헤더 설정
ngx.say("body")          -- 바디 출력
ngx.exit(200)            -- 종료

-- 로깅
ngx.log(ngx.ERR, "msg")  -- 에러 로그
ngx.log(ngx.INFO, "msg") -- 정보 로그

-- 유틸리티
ngx.re.match(s, pattern) -- 정규표현식
ngx.encode_args(t)       -- 테이블 → 쿼리스트링
ngx.decode_args(s)       -- 쿼리스트링 → 테이블
```

### 흔한 실수

```lua
-- ❌ 잘못된 예 (배열 인덱스 0)
local arr = {"a", "b", "c"}
print(arr[0])  -- nil!

-- ✅ 올바른 예 (Lua는 1부터)
print(arr[1])  -- "a"


-- ❌ 잘못된 예 (문자열 연결)
local s = "Hello" + "World"  -- 에러!

-- ✅ 올바른 예
local s = "Hello" .. "World"  -- ".." 사용


-- ❌ 잘못된 예
if value == nil then  -- nil 체크

-- ✅ 올바른 예
if not value then     -- falsy 체크 (nil, false 모두)
```

---

> **시작하기 좋은 방법**: 먼저 `middleware/access.lua`를 읽어보세요.
> 가장 짧고 이해하기 쉬운 파일입니다. 그 다음 `handlers/router.lua`를 읽으면
> 전체 흐름이 파악됩니다.
