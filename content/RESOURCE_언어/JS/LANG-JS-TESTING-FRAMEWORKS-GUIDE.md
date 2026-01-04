# JavaScript/TypeScript 테스트 프레임워크 가이드

> 작성일: 2025-12-15

## 개요

JavaScript/TypeScript 프로젝트에서 사용할 수 있는 테스트 프레임워크들을 비교 분석한 가이드입니다. 특히 Vitest와 Jest의 차이점을 중심으로 정리하고, 그 외 고려해볼 만한 프레임워크들도 함께 소개합니다.

---

## Vitest vs Jest 상세 비교

### 핵심 차이점 요약

| 항목 | Vitest | Jest |
|------|--------|------|
| **출시** | 2022년 | 2014년 |
| **개발사** | Vite 팀 | Facebook (Meta) |
| **모듈 시스템** | ESM 네이티브 | CommonJS 기반 |
| **설정** | Vite 설정 재사용 | 별도 설정 필요 |
| **TypeScript** | 기본 지원 | ts-jest 등 추가 설정 |
| **Watch 모드** | HMR 기반 (빠름) | 전체 재실행 |
| **성능** | 최대 4배 빠름 | 상대적으로 느림 |
| **메모리** | ~800MB (50K LOC) | ~1.2GB (50K LOC) |

---

### 성능 비교

#### 실행 속도
```
┌─────────────────────────────────────────────────────────┐
│ Cold Run 속도 (Vitest 기준)                              │
├─────────────────────────────────────────────────────────┤
│ Vitest  ████████████████████████████████████████  1x    │
│ Jest    ████████████████                          4x    │
└─────────────────────────────────────────────────────────┘
```

- **Cold Run**: Vitest가 Jest 대비 최대 **4배 빠름**
- **Watch Mode**: HMR 활용으로 변경된 코드/테스트만 재실행
- **전반적 테스트 시간**: 30~70% 단축 효과

#### 메모리 사용량
- 50,000줄 규모 코드베이스 기준:
  - **Jest**: ~1.2GB
  - **Vitest**: ~800MB (약 30% 절감)
- CI 비용 절감 및 개발 환경 부담 감소

---

### 기능 비교

#### Vitest 주요 기능
```javascript
// 1. ESM 네이티브 지원 - import/export 그대로 사용
import { describe, it, expect } from 'vitest'

// 2. TypeScript 기본 지원 - 추가 설정 불필요
describe('Calculator', () => {
  it('adds numbers correctly', () => {
    expect(1 + 1).toBe(2)
  })
})

// 3. In-source Testing - 소스 코드 내 테스트 작성 가능
// src/math.ts
export function add(a: number, b: number) {
  return a + b
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest
  it('add', () => {
    expect(add(1, 2)).toBe(3)
  })
}
```

#### Jest vs Vitest API 호환성
```javascript
// Jest API와 95% 호환
// 대부분의 코드가 그대로 동작

// Jest
jest.fn()
jest.mock('./module')
jest.spyOn(object, 'method')

// Vitest (동일한 방식 지원)
vi.fn()
vi.mock('./module')
vi.spyOn(object, 'method')
```

---

### 설정 비교

#### Vitest 설정 (vite.config.ts 재사용)
```typescript
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
})
```

#### Jest 설정 (별도 설정 파일 필요)
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
}

// 추가로 필요한 패키지
// ts-jest, @types/jest, babel-jest (경우에 따라)
```

---

### 선택 가이드

#### Vitest를 선택해야 할 때

| 상황 | 이유 |
|------|------|
| **Vite 기반 프로젝트** | 설정 재사용, 완벽한 통합 |
| **새 프로젝트** | 현대적 DX, 빠른 피드백 루프 |
| **성능이 중요한 경우** | CI 시간/비용 절감 |
| **ESM/TypeScript 중심** | 네이티브 지원, 추가 설정 불필요 |
| **TDD 개발 방식** | Watch 모드 성능 우수 |

#### Jest를 유지해야 할 때

| 상황 | 이유 |
|------|------|
| **React Native 프로젝트** | Jest 필수 |
| **대규모 레거시 코드베이스** | 마이그레이션 비용 대비 이점 적음 |
| **대규모 모노레포** | Jest의 multi-project runner 성숙도 |
| **특수한 Jest 플러그인 의존** | 일부 플러그인 Vitest 미지원 |

---

### Jest → Vitest 마이그레이션

#### 1. 패키지 교체
```bash
# Jest 관련 패키지 제거
npm uninstall jest ts-jest @types/jest babel-jest

# Vitest 설치
npm install -D vitest @vitest/ui @vitest/coverage-v8
```

#### 2. 설정 파일 변환
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,  // describe, it, expect 전역 사용
    environment: 'jsdom',
    include: ['**/*.{test,spec}.{js,ts,jsx,tsx}'],
  },
})
```

#### 3. 코드 수정 (필요한 경우)
```javascript
// Before (Jest)
jest.fn()
jest.mock('./module')

// After (Vitest)
import { vi } from 'vitest'
vi.fn()
vi.mock('./module')
```

#### 4. package.json 스크립트
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

---

## 고려해볼 만한 테스트 프레임워크

### 1. Node.js 내장 Test Runner (`node:test`)

#### 개요
- Node.js 18에서 실험적 도입, **Node.js 20에서 안정화**
- 외부 의존성 없이 테스트 가능
- 가장 가벼운 옵션

#### 특징
```javascript
import { test, describe, it } from 'node:test'
import assert from 'node:assert'

describe('Math operations', () => {
  it('should add numbers', () => {
    assert.strictEqual(1 + 1, 2)
  })
})

// 실행
// node --test
// node --test --watch (watch 모드)
// node --experimental-test-coverage (커버리지)
```

#### 장점
- **제로 의존성**: Node.js 내장
- **빠른 실행**: Node.js에 최적화
- **스냅샷 테스팅**: v22.3.0부터 지원
- **실패 테스트 재실행**: `--test-rerun-failures`

#### 단점
- TypeScript 설정이 다소 번거로움
- 생태계/플러그인 부족
- Vitest/Jest 대비 기능 제한적

#### 추천 상황
- 순수 Node.js 프로젝트
- 최소한의 의존성 원하는 경우
- 간단한 유닛 테스트

---

### 2. Bun Test Runner

#### 개요
- Bun 런타임 내장 테스트 러너
- Jest/Vitest API 호환
- **극한의 속도**

#### 특징
```javascript
// Jest/Vitest와 동일한 API
import { test, expect, describe } from 'bun:test'

describe('Bun Test', () => {
  test('should be fast', () => {
    expect(true).toBe(true)
  })
})

// 실행
// bun test
```

#### 벤치마크
- **266개 React SSR 테스트**: Jest가 버전 출력하는 시간 안에 완료
- **56개 테스트 (11파일)**: M1 Mac에서 0.25초

#### 장점
- **압도적 속도**: Node.js 대비 2배 이상 빠름
- **TypeScript/JSX 기본 지원**
- **Jest/Vitest API 호환**
- **제로 설정**

#### 단점
- **테스트 격리 부족**: 사이드 이펙트가 다른 테스트에 영향
- **Fake Timer 미지원** (일부 기능 미구현)
- **생태계 미성숙**
- **프론트엔드 지원 부족**

#### 추천 상황
- Bun 런타임 사용 프로젝트
- 백엔드 API 테스트
- 속도가 최우선인 경우

> [!tip] Bun + Vitest 조합
> 프론트엔드 프로젝트에서는 Bun 런타임에서 Vitest를 실행하는 것이 좋은 균형점입니다.
> ```bash
> bun run test  # Vitest 실행 (package.json scripts)
> bun test      # Bun 내장 테스트 러너 실행
> ```

---

### 3. Mocha

#### 개요
- 가장 오래된 JavaScript 테스트 프레임워크 중 하나
- **유연한 구조**: Assertion 라이브러리 선택 가능
- **Node.js 백엔드**에 적합

#### 특징
```javascript
// Mocha + Chai 조합
const { expect } = require('chai')

describe('Array', () => {
  it('should return -1 when not found', () => {
    expect([1, 2, 3].indexOf(4)).to.equal(-1)
  })
})
```

#### 장점
- 높은 커스터마이징 자유도
- 다양한 Assertion 라이브러리 선택 (Chai, Should.js 등)
- 대규모 Node.js 프로젝트에서 검증됨

#### 단점
- 별도 설정 필요 (Assertion, Mock 라이브러리)
- 신기능 업데이트 느림
- Jest/Vitest 대비 DX 열세

#### 추천 상황
- 테스트 스택 완전 커스터마이징 필요
- Node.js API, 마이크로서비스
- 레거시 프로젝트 유지보수

---

### 4. Jasmine

#### 개요
- **BDD(Behavior-Driven Development)** 스타일 테스트
- Angular 프로젝트의 기본 선택
- 올인원 솔루션 (Assertion, Mock, Spy 내장)

#### 특징
```javascript
describe('Calculator', () => {
  let calculator

  beforeEach(() => {
    calculator = new Calculator()
  })

  it('should add two numbers', () => {
    expect(calculator.add(1, 2)).toBe(3)
  })
})
```

#### 장점
- 설정 없이 바로 사용 가능
- BDD 스타일로 가독성 좋음
- Spy, Mock 내장

#### 단점
- 커뮤니티 활성도 감소
- 현대적 기능 부족 (ESM, TypeScript 지원 미흡)

#### 추천 상황
- Angular 프로젝트 (Karma + Jasmine 조합)
- BDD 방식 선호
- 간단한 프로젝트

---

## 프레임워크 선택 매트릭스

### 프로젝트 유형별 추천

| 프로젝트 유형 | 1순위 | 2순위 | 비고 |
|--------------|-------|-------|------|
| **Vite + React/Vue** | Vitest | - | Vitest 압도적 |
| **Next.js** | Vitest | Jest | 둘 다 좋음 |
| **React Native** | Jest | - | Jest 필수 |
| **Angular** | Jasmine | Jest | 기본 설정 Jasmine |
| **순수 Node.js** | node:test | Vitest | 의존성 최소화 |
| **Bun 백엔드** | Bun test | Vitest | 속도 우선시 Bun |
| **레거시 Node.js** | Mocha | Jest | 기존 선택 유지 |

### 우선순위별 추천

| 우선순위 | 추천 프레임워크 |
|---------|----------------|
| **속도** | Bun test > Vitest > Jest |
| **생태계** | Jest > Vitest > Mocha |
| **DX (개발 경험)** | Vitest > Jest > Bun test |
| **TypeScript** | Vitest > Bun test > Jest |
| **제로 설정** | Bun test = Vitest > Jest |
| **최소 의존성** | node:test > Bun test > 나머지 |

---

## 2025년 트렌드 및 전망

### 현재 트렌드
1. **Vitest 급부상**: Vite 생태계 확장과 함께 빠르게 성장
2. **ESM 전환 가속화**: CommonJS에서 ESM으로 이동
3. **런타임 내장 테스트러너**: Node.js, Bun 모두 내장 지원
4. **속도 경쟁**: 빠른 피드백 루프 중요성 증가

### 권장 사항
- **신규 프로젝트**: Vitest 우선 고려
- **기존 Jest 프로젝트**: 급하게 마이그레이션할 필요 없음
- **Bun 채택**: 백엔드 위주로 시작, 프론트엔드는 Vitest 병행
- **Node.js 내장**: 간단한 유틸리티/라이브러리에 적합

---

## 참고 자료

### 공식 문서
- [Vitest 공식 문서](https://vitest.dev/)
- [Jest 공식 문서](https://jestjs.io/)
- [Node.js Test Runner 문서](https://nodejs.org/api/test.html)
- [Bun Test Runner 문서](https://bun.sh/docs/cli/test)

### 비교 분석
- [Vitest vs Jest - Speakeasy](https://www.speakeasy.com/blog/vitest-vs-jest)
- [Vitest vs Jest - Better Stack](https://betterstack.com/community/guides/scaling-nodejs/vitest-vs-jest/)
- [Vitest Comparisons - 공식](https://vitest.dev/guide/comparisons)
- [Jest vs Vitest 2025 - Medium](https://medium.com/@ruverd/jest-vs-vitest-which-test-runner-should-you-use-in-2025-5c85e4f2bda9)

### 기타
- [Top JavaScript Testing Frameworks - BrowserStack](https://www.browserstack.com/guide/top-javascript-testing-frameworks)
- [Node.js Test Framework Benchmarks](https://romeerez.hashnode.dev/best-nodejs-test-framework-with-benchmarks)
- [Jest to Vitest Migration Guide](https://www.tatvasoft.com/outsourcing/2025/06/convert-jest-to-vitest.html)
