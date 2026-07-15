# Stackflow DOM 관리 전략

> 작성일: 2026-02-08

## 개요

Stackflow는 모바일 브라우저에서 네이티브 앱과 유사한 화면 전환(push/back)을 제공하는 React 기반 네비게이션 프레임워크입니다. 핵심은 **플러그인 기반 아키텍처**로 DOM 관리, 애니메이션, 스타일을 분리한 설계입니다.

## 핵심 질문에 대한 답변

### 1. Push 시 이전 화면 DOM 처리

**결론: 제거하지 않고 `display: none`으로 숨김**

```typescript
// useStyleEffectHide.ts
if (activityTransitionState === "enter-done") {
  refs.forEach((ref) => {
    if (ref.current) {
      ref.current.style.display = "none";  // ← 핵심
    }
  });
}
```

**동작 흐름:**
1. 새 화면 push → 이전 화면은 `transitionState`가 `"enter-done"`으로 전환
2. `useStyleEffectHide` 훅이 해당 화면의 DOM에 `display: none` 적용
3. DOM은 유지되지만 렌더링에서 제외됨

**장점:**
- 화면 복원 시 빠른 재표시 (DOM 재생성 불필요)
- 컴포넌트 상태 유지 (React state, 스크롤 위치 등)

### 2. Back 시 이전 화면 복원

**`display` 속성 초기화로 즉시 복원**

```typescript
// useStyleEffectHide.ts - cleanup
refs.forEach((ref) => {
  if (ref.current) {
    ref.current.style.display = "";  // 빈 문자열로 초기화
  }
});
```

**복원 흐름:**
1. Back 액션 → 상위 화면의 `transitionState`가 `"enter-done"` → `"enter-active"` 전환
2. cleanup 함수 실행으로 `display` 속성 제거
3. 기존 DOM이 즉시 표시됨 (CSS transition과 함께)

### 3. 스크롤 위치 저장/복원

**브라우저 기본 동작 활용 + ref를 통한 수동 제어**

```typescript
// AppScreen.tsx
const paperContentRef = useRef<HTMLDivElement>(null);

// Context로 스크롤 제어 제공
scroll({ top }) {
  paperContentRef?.current?.scroll({
    top,
    behavior: "smooth",
  });
}
```

**스크롤 관리 전략:**
- **기본 전략**: DOM이 유지되므로 브라우저가 자동으로 스크롤 위치 보존
- **명시적 제어**: `paperContentRef`를 통해 필요 시 수동 스크롤 가능
- **앱바 클릭**: 앱바 상단 클릭 시 자동으로 맨 위로 스크롤

**CSS 설정:**
```typescript
// AppScreen.css.ts
overflowY: "scroll",
WebkitOverflowScrolling: "touch",  // iOS 모멘텀 스크롤
```

### 4. 검은 프레임 방지 전략

**CSS transform + opacity 전환으로 매끄러운 애니메이션**

```typescript
// useStyleEffectOffset.ts
if (activityTransitionState === "enter-active" || activityTransitionState === "enter-done") {
  refs.forEach((ref) => {
    if (ref.current) {
      ref.current.style.transition = `transform ${transitionDuration}, opacity ${transitionDuration}`;
      ref.current.style.transform = offsetStyles.transform;
      ref.current.style.opacity = offsetStyles.opacity;
    }
  });
}
```

**애니메이션 흐름:**
1. **초기 상태**: 새 화면은 `transform: translate3d(100%, 0, 0)` (화면 밖)
2. **전환 시작**: `enter-active` 상태로 전환 + CSS transition 적용
3. **전환 완료**: `transform` 제거로 제자리 위치 (`translate3d(0, 0, 0)`)
4. **cleanup**: `transitionend` 이벤트 후 transition 속성 제거

**핵심 기법:**
- `translate3d` 사용으로 GPU 가속 활용
- `will-change` 없이 transform만으로 최적화
- `requestNextFrame` 유틸로 정확한 타이밍 제어

### 5. CSS 전략 (Position, Z-Index, Overflow)

#### Position 전략

```typescript
// AppScreen.css.ts
position: "absolute",
top: 0,
left: 0,
width: "100%",
height: "100%",
```

**모든 화면을 absolute positioning으로 레이어 관리**

#### Z-Index 계층

```typescript
// vars contract
zIndexes: {
  dim: null,      // 배경 어두워짐
  paper: null,    // 실제 콘텐츠
  edge: null,     // 스와이프 영역
  appBar: null,   // 앱바
}
```

**동적 z-index 계산:**
- 각 Activity의 스택 순서에 따라 동적 할당
- Theme(cupertino/android) 및 presentation 스타일에 따라 조정
- Modal/BottomSheet는 별도 z-index 레벨

**cupertino 예시:**
```typescript
zIndexes: {
  dim: 1,
  paper: 2,
  edge: 3,
  appBar: 4,
}
```

#### Overflow 전략

```css
/* 루트 컨테이너 */
.appScreen {
  overflow: hidden;  /* 화면 밖 콘텐츠 숨김 */
}

/* 스크롤 영역 */
.paperContent {
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;

  /* 스크롤바 숨김 */
  &::-webkit-scrollbar {
    display: none;
  }
}
```

## 아키텍처 설계

### 핵심 레이어

```
MainRenderer
  ↓
PluginRenderer (plugin.render)
  ↓
AppScreen (활동별 컴포넌트)
  ↓
ActivityProvider (context)
  ↓
실제 화면 컴포넌트
```

### 플러그인 시스템

**1. Renderer Plugin** (`plugin-renderer-basic`)
- 역할: 어떤 활동을 렌더링할지 결정
- 로직: `transitionState !== "exit-done"`인 활동만 렌더링

```typescript
// basicRendererPlugin.tsx
stack
  .render()
  .activities.filter((activity) => activity.transitionState !== "exit-done")
  .map((activity) => (
    <Fragment key={activity.key}>{activity.render()}</Fragment>
  ))
```

**2. UI Plugin** (`plugin-basic-ui`)
- 역할: 각 활동의 UI 래퍼 제공
- 기능: 앱바, 배경, 제스처, 애니메이션
- 구성: AppScreen, Modal, BottomSheet

**3. 커스텀 훅으로 관심사 분리**

| 훅 | 역할 |
|---|---|
| `useStyleEffectHide` | `display: none` 제어 |
| `useStyleEffectOffset` | transform/opacity 애니메이션 |
| `useStyleEffectSwipeBack` | iOS 스와이프 제스처 |
| `usePreventTouchDuringTransition` | 전환 중 터치 차단 |

### 상태 관리

**Activity Transition States:**
```
enter-active → enter-done → exit-active → exit-done
```

**각 상태의 의미:**
- `enter-active`: 진입 애니메이션 중
- `enter-done`: 진입 완료 (화면에 표시)
- `exit-active`: 퇴장 애니메이션 중
- `exit-done`: 퇴장 완료 (DOM 제거 대상)

**useStyleEffect 메커니즘:**

```typescript
// connections 구조
connections[styleName]: Map<zIndex, { refs, hasEffect }>
```

- z-index 기반으로 활동 계층 관리
- 하위 활동들에게 자동으로 효과 전파
- 상위 활동의 `hasEffect`가 true면 전파 중단

## 성능 최적화

### 1. DOM 재사용
- 화면 전환 시 DOM 제거하지 않음
- `display: none`으로 숨기고 필요 시 재표시
- React 컴포넌트 언마운트/마운트 비용 절감

### 2. GPU 가속
- `transform: translate3d()` 사용
- CSS transition으로 부드러운 애니메이션
- Composite layer 분리로 repaint 최소화

### 3. 이벤트 최적화
```typescript
// requestNextFrame 유틸
const cleanup = requestNextFrame(() => {
  refs.forEach((ref) => {
    ref.current?.style.removeProperty("transition");
  });
});
```

- `transitionend` 이벤트로 정확한 타이밍 제어
- cleanup 함수로 메모리 누수 방지

### 4. 터치 성능
```typescript
// 전환 중 터치 차단
usePreventTouchDuringTransition([appScreenRef]);
```

- 애니메이션 중 터치 입력 차단
- 레이스 컨디션 방지

## 플랫폼별 차이

### Cupertino (iOS)
- 슬라이드 애니메이션: 오른쪽에서 왼쪽
- 스와이프 백 제스처 지원
- 앱바 블러 효과

### Android
- 페이드 애니메이션 또는 슬라이드
- 뒤로가기 버튼 대응
- Material Design 그림자

```typescript
// AppScreen.css.ts
variants: {
  cupertino: {
    // iOS 스타일
  },
  android: {
    // Android 스타일
  }
}
```

## 비교: 사내 Navigator 구현과 차이점

| 항목 | Stackflow | 사내 Navigator |
|------|-----------|-----------------|
| DOM 관리 | `display: none` | 미확인 (조사 필요) |
| 스크롤 복원 | 브라우저 기본 + ref | 명시적 저장/복원? |
| 애니메이션 | CSS transition | CSS transition |
| 상태 관리 | Core store (이벤트 기반) | Context API? |
| 플러그인 | 완전 분리 | 전략 패턴 |
| z-index | 동적 계산 | 고정 레이어? |

## 참고

- [Stackflow GitHub](https://github.com/daangn/stackflow)
- [공식 문서](https://stackflow.so)
- 핵심 파일:
  - `extensions/plugin-basic-ui/src/components/AppScreen.tsx`
  - `extensions/react-ui-core/src/useStyleEffectHide.ts`
  - `extensions/plugin-renderer-basic/src/basicRendererPlugin.tsx`

#topic/frontend #type/concept #tech/stackflow #tech/react
