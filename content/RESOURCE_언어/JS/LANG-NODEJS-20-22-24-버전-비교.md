# Node.js 20 vs 22 vs 24 버전 비교 가이드

> 작성일: 2025-12-15

## 개요

Node.js의 주요 LTS 버전인 20, 22, 24의 차이점을 정리한 문서입니다. Node.js 24는 2025년 5월 6일에 출시되었으며, 2025년 10월에 LTS로 전환될 예정입니다.

## 버전별 지원 기간

| 버전 | 코드명 | 출시일 | LTS 시작 | 지원 종료 | 상태 |
|------|--------|--------|----------|-----------|------|
| Node.js 20 | Iron | 2023-04 | 2023-10 | 2026-04 | Maintenance LTS |
| Node.js 22 | - | 2024-04-24 | 2024-10 | 2027-04 | Active LTS |
| Node.js 24 | - | 2025-05-06 | 2025-10 (예정) | 2028-04 | Current |

## V8 엔진 버전

V8 엔진 업그레이드는 각 버전의 JavaScript 기능과 성능에 직접적인 영향을 미칩니다.

| Node.js 버전 | V8 엔진 버전 | 주요 특징 |
|--------------|-------------|-----------|
| 20 | V8 11.3 | 안정적인 네이티브 모듈 성능 |
| 22 | V8 12.4 | Maglev JIT 컴파일러 도입 |
| 24 | V8 13.6 | Float16Array, RegExp.escape() 등 |

---

## Node.js 20 주요 기능

### Permission Model (실험적)
- 파일 시스템 접근 제한 기능 최초 도입
- `--allow-fs-read`, `--allow-fs-write` 플래그로 제어
- 실험적 상태로 `--experimental-permission` 플래그 필요

### Stable Test Runner
- Node.js 19에서 실험적이었던 `test_runner` 모듈이 안정화
- 프로덕션 환경에서 사용 가능

### ESM Loader Hooks
- 커스텀 ES 모듈 로더가 별도 스레드에서 실행
- 로더와 애플리케이션 코드 간 격리 보장

### V8 11.3 새 기능
- `String.prototype.isWellFormed()`
- `String.prototype.toWellFormed()`
- RegExp v 플래그 (Set notation)
- Resizable ArrayBuffer
- Growable SharedArrayBuffer

### 기타
- ARM64 Windows 지원 (Tier 2)
- 동기 `import.meta.resolve()` 지원
- `require(esm)` 백포트 (예외적으로 추가됨)

---

## Node.js 22 주요 기능

### ESM과 CommonJS 상호운용성
- `require()`로 ESM 모듈 로드 지원 (실험적)
- `--experimental-require-module` 플래그로 활성화
- 조건: "type": "module" 명시, 완전 동기 모듈

### WebSocket 클라이언트 (기본 활성화)
- 브라우저 호환 WebSocket 클라이언트 내장
- 별도 설정 없이 기본 사용 가능

### Watch Mode 안정화
- `--watch` 옵션이 안정 상태로 승격
- 파일 변경 감지 및 자동 재시작

### 스트림 성능 개선
- `highWaterMark` 기본값: 16KB → 64KB
- 전반적인 스트림 성능 향상
- 메모리 사용량 약간 증가 가능성

### AbortSignal 성능 개선
- AbortSignal 인스턴스 생성 속도 대폭 향상
- `fetch()`, Test Runner 등에서 성능 이점

### Import Assertions 제거
- `assert` 키워드를 사용한 Import Assertions 제거
- `with` 키워드를 사용한 Import Attributes로 대체

### package.json 스크립트 실행
- `node --run <script>` 명령으로 package.json 스크립트 실행 (실험적)

### V8 12.4 새 기능
- Set 메서드 (`union`, `intersection`, `difference` 등)
- `Array.fromAsync()`
- WebAssembly Garbage Collection
- Iterator Helpers

---

## Node.js 24 주요 기능

### V8 13.6 새 JavaScript 기능

#### Float16Array
```javascript
// 16비트 부동소수점 배열 - 메모리 효율 2배 향상
const float16 = new Float16Array(1024);
// 머신러닝, 그래픽 처리, 과학 계산에 유용
```

#### RegExp.escape()
```javascript
// 정규식 특수문자 자동 이스케이프
const userInput = "hello.world?";
const pattern = new RegExp(RegExp.escape(userInput));
// 결과: /hello\.world\?/
```

#### Explicit Resource Management
```javascript
// await using으로 자동 리소스 정리
await using file = await openFile('data.txt');
// 스코프 종료 시 자동으로 파일 핸들 해제
// 메모리 누수 방지에 효과적
```

#### Error.isError()
```javascript
// Error 객체 여부 안전하게 확인
if (Error.isError(err)) {
  console.log(err.message);
}
```

### URLPattern Global API
```javascript
// 전역 객체로 URLPattern 사용 가능 (import 불필요)
const pattern = new URLPattern({ pathname: '/users/:id' });
const match = pattern.exec('https://example.com/users/123');
// match.pathname.groups.id === '123'
```

### Permission Model 성숙
- `--experimental-permission` → `--permission`으로 변경
- 실험적 단계에서 더 안정적인 상태로 발전
- 보안 중심 애플리케이션에 적합

### AsyncLocalStorage 개선
- AsyncContextFrame 기본 사용
- 비동기 컨텍스트 추적 성능 향상
- 레거시 동작 필요 시: `--no-async-context-frame`

### Test Runner 개선
```javascript
// 서브테스트 자동 대기 - await 불필요
test('parent', () => {
  test('child 1', () => { /* ... */ });
  test('child 2', () => { /* ... */ });
  // 서브테스트 완료 자동 대기
});
```

### npm 11
- 성능 및 보안 개선
- `npm init`에 type 프롬프트 추가
- `npm hook` 명령 제거

### Undici 7
- HTTP 클라이언트 업그레이드
- 최신 HTTP 표준 지원
- 성능 개선

### WebAssembly Memory64
- 64비트 메모리 주소 지원
- 기존 4GB 제한 → 최대 16GB까지 확장
- 대규모 WebAssembly 애플리케이션에 유용

---

## Breaking Changes (Node.js 24)

### 빌드 요구사항
- **Windows**: MSVC 지원 제거, ClangCL 필수
- **macOS**: 최소 macOS 13.5 필요

### OpenSSL 3.5 보안 변경
- 기본 보안 레벨 2 적용
- RSA, DSA, DH 키: 최소 2048비트 필요
- ECC 키: 최소 224비트 필요
- RC4 암호화 금지

### 폐기/제거된 API

| API | 상태 | 대안 |
|-----|------|------|
| `url.parse()` | Runtime Deprecation | WHATWG URL API |
| `tls.createSecurePair()` | 완전 제거 | 최신 TLS API |
| `SlowBuffer` | Deprecation | Buffer 클래스 |
| `fs.F_OK`, `fs.R_OK` 등 | Runtime Deprecation | `fs.constants.*` |

---

## 성능 비교

### JavaScript 실행 성능
- Node.js 24는 복잡한 연산에서 Node.js 22 대비 **최대 30% 빠름**

### 테스트 실행 속도
- Node.js 24는 Node.js 20 대비 **최대 40% 빠른** 테스트 실행

### Buffer 성능
- `Buffer.byteLength`: Node.js 20 대비 **67% 향상**
- `buffer.compare()`: Node.js 20 대비 **200% 이상 향상**

### 주의사항
> [!warning] 네이티브 모듈 성능 저하 사례
> C++ 네이티브 모듈을 많이 사용하는 워크로드에서 일부 성능 저하 사례가 보고됨. 해당 경우 Node.js 20 LTS가 더 안정적일 수 있음.

---

## 버전 선택 가이드

| 상황 | 권장 버전 | 이유 |
|------|-----------|------|
| **프로덕션 안정성** | Node.js 22 LTS | Active LTS, 검증된 안정성 |
| **최신 기능 필요** | Node.js 24 | 최신 V8, JavaScript 기능 |
| **네이티브 모듈 중심** | Node.js 20 | 안정적인 네이티브 성능 |
| **보안 중심 앱** | Node.js 24 | 성숙한 Permission Model |
| **레거시 시스템 유지** | Node.js 20 | 2026년 4월까지 지원 |

---

## 마이그레이션 체크리스트

### Node.js 20 → 22
- [ ] `assert` 키워드 Import Assertions → `with` 키워드로 변경
- [ ] 스트림 메모리 사용량 확인 (highWaterMark 변경)
- [ ] 실험적 기능 플래그 확인

### Node.js 22 → 24
- [ ] `url.parse()` → WHATWG URL API로 마이그레이션
- [ ] `tls.createSecurePair()` 사용 여부 확인 (제거됨)
- [ ] `fs.F_OK` 등 → `fs.constants.*`로 변경
- [ ] OpenSSL 키 길이 요구사항 확인 (최소 2048비트)
- [ ] Windows 빌드 시 ClangCL 설치
- [ ] macOS 13.5 이상 확인

---

## 참고 자료

- [Node.js v24.0.0 Release Notes](https://nodejs.org/en/blog/release/v24.0.0)
- [Node.js v22 to v24 Migration Guide](https://nodejs.org/en/blog/migrations/v22-to-v24)
- [Node.js 22 Release Announcement](https://nodejs.org/en/blog/announcements/v22-release-announce)
- [Node.js 20 Release Announcement](https://nodejs.org/en/blog/announcements/v20-release-announce)
- [Node.js Releases Schedule](https://nodejs.org/en/about/previous-releases)
- [NodeSource Blog - Node.js 24](https://nodesource.com/blog/Node.js-version-24)
- [LogRocket - Node.js 24 Guide](https://blog.logrocket.com/node-js-24-new/)
- [AppSignal - What's New in Node.js 24](https://blog.appsignal.com/2025/05/09/whats-new-in-nodejs-24.html)
