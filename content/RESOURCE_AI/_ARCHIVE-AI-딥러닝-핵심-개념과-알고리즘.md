# 딥러닝 핵심 개념과 알고리즘 상세 가이드

> 신경망 학습의 수학적 원리와 주요 알고리즘 완벽 정리

## 목차

1. [역전파 알고리즘 (Backpropagation)](#1-역전파-알고리즘-backpropagation)
2. [활성화 함수 (Activation Functions)](#2-활성화-함수-activation-functions)
3. [손실 함수 (Loss Functions)](#3-손실-함수-loss-functions)
4. [최적화 알고리즘 (Optimizers)](#4-최적화-알고리즘-optimizers)
5. [정규화 기법 (Regularization)](#5-정규화-기법-regularization)
6. [실전 가이드라인](#6-실전-가이드라인)

---

## 1. 역전파 알고리즘 (Backpropagation)

### 개요

**역전파(Backpropagation, Backward Propagation of Errors)**는 신경망 학습의 핵심 알고리즘입니다. 예측값과 실제값의 차이를 줄이기 위해 네트워크의 가중치를 조정하는 과정입니다.

### 동작 원리

#### 1단계: 순전파 (Forward Pass)
```
입력 → 은닉층1 → 은닉층2 → ... → 출력층 → 예측값
```

각 층에서:
```python
# 선형 변환
z = W·x + b

# 활성화 함수 적용
a = σ(z)  # σ는 ReLU, sigmoid 등
```

#### 2단계: 손실 계산
```python
loss = L(y_pred, y_true)  # 예: CrossEntropyLoss
```

#### 3단계: 역전파 (Backward Pass)

**체인 룰(Chain Rule)** 사용하여 gradient 계산:

```
∂L/∂W = ∂L/∂a × ∂a/∂z × ∂z/∂W
```

출력층에서 입력층 방향으로 gradient를 전파합니다.

#### 4단계: 가중치 업데이트
```python
W_new = W_old - learning_rate × ∂L/∂W
```

### 수학적 예제

간단한 2층 신경망:

```
입력(x) → 은닉층(h) → 출력(y)
```

**순전파:**
```
h = σ(W1·x + b1)
y = σ(W2·h + b2)
```

**역전파:**
```
# 출력층 gradient
δ2 = (y - y_true) × σ'(W2·h + b2)
∂L/∂W2 = δ2 × h^T
∂L/∂b2 = δ2

# 은닉층 gradient
δ1 = (W2^T × δ2) × σ'(W1·x + b1)
∂L/∂W1 = δ1 × x^T
∂L/∂b1 = δ1
```

### PyTorch에서의 구현

```python
# 순전파
output = model(input)
loss = loss_fn(output, target)

# 역전파 (자동으로 모든 gradient 계산)
loss.backward()

# 가중치 업데이트
optimizer.step()
```

### 장점

- **효율성**: 모든 파라미터의 gradient를 한 번에 계산
- **자동화**: 복잡한 네트워크도 자동으로 미분 가능
- **딥러닝 핵심**: 대부분의 딥러닝 학습 알고리즘의 기반

### 문제점과 해결책

#### Vanishing Gradient Problem (기울기 소실)

깊은 네트워크에서 gradient가 0에 가까워지는 문제

**원인:**
```
∂L/∂W1 = ∂L/∂a_n × ∂a_n/∂a_(n-1) × ... × ∂a_2/∂a_1 × ∂a_1/∂W1
```
sigmoid/tanh의 미분값이 최대 0.25이므로, 층이 깊어질수록 곱셈으로 gradient가 급격히 감소

**해결책:**
- ReLU 활성화 함수 사용
- Batch Normalization
- Residual Connection (ResNet)
- LSTM/GRU (RNN의 경우)

#### Exploding Gradient Problem (기울기 폭발)

Gradient가 너무 커지는 문제

**해결책:**
- Gradient Clipping
- 적절한 가중치 초기화
- Batch Normalization

---

## 2. 활성화 함수 (Activation Functions)

### 개요

활성화 함수는 신경망에 **비선형성(non-linearity)**을 도입하여 복잡한 패턴을 학습할 수 있게 합니다.

활성화 함수가 없다면:
```python
# 선형 변환만 있는 경우
h1 = W1·x + b1
h2 = W2·h1 + b2
# h2 = W2·(W1·x + b1) + b2 = (W2·W1)·x + (W2·b1 + b2)
# 결국 단일 선형 변환과 동일
```

---

### 2.1 Sigmoid

#### 수식
```
σ(x) = 1 / (1 + e^(-x))
```

#### 그래프 특성
```
출력 범위: (0, 1)
중심값: 0.5

  1.0 ┤     ╭─────
      │   ╭─╯
  0.5 ┤ ╭─╯
      │╭╯
  0.0 ┼╯
      └─────────────
     -∞  0  +∞
```

#### 미분
```
σ'(x) = σ(x) × (1 - σ(x))
최대값: 0.25 (x=0일 때)
```

#### 장점
- 출력이 확률로 해석 가능 (0~1)
- 부드러운 gradient
- 이진 분류 출력층에 적합

#### 단점
- **Vanishing Gradient**: 큰 양수/음수에서 gradient ≈ 0
- **Not Zero-Centered**: 출력이 항상 양수 → 가중치 업데이트 비효율
- **계산 비용**: 지수 함수 연산

#### 사용 예
```python
import torch.nn as nn

# 이진 분류 출력층
output = nn.Sigmoid()(logits)
```

---

### 2.2 Tanh (Hyperbolic Tangent)

#### 수식
```
tanh(x) = (e^x - e^(-x)) / (e^x + e^(-x))
       = 2·σ(2x) - 1
```

#### 그래프 특성
```
출력 범위: (-1, 1)
중심값: 0

  1.0 ┤     ╭─────
      │   ╭─╯
  0.0 ┼─╭─╯
      │╭╯
 -1.0 ┼╯
      └─────────────
     -∞  0  +∞
```

#### 미분
```
tanh'(x) = 1 - tanh²(x)
최대값: 1 (x=0일 때)
```

#### 장점
- **Zero-Centered**: 평균이 0에 가까움 → 최적화 효율적
- Sigmoid보다 강한 gradient

#### 단점
- Sigmoid와 동일한 Vanishing Gradient 문제
- 계산 비용

#### 사용 예
```python
# RNN/LSTM 내부 게이트
hidden = nn.Tanh()(cell_state)
```

---

### 2.3 ReLU (Rectified Linear Unit)

#### 수식
```
ReLU(x) = max(0, x) = {
    x,  if x > 0
    0,  if x ≤ 0
}
```

#### 그래프 특성
```
      │    ╱
      │  ╱
      │╱
  ────┼────
      │
```

#### 미분
```
ReLU'(x) = {
    1,  if x > 0
    0,  if x ≤ 0
}
```

#### 장점
- **Vanishing Gradient 해결**: 양수 영역에서 gradient = 1
- **계산 효율**: 단순한 max 연산
- **Sparsity**: 음수를 0으로 만들어 희소성 증가 → 일반화 성능 향상
- **생물학적 타당성**: 실제 뉴런과 유사

#### 단점
- **Dying ReLU**: 음수 입력에 대해 뉴런이 "죽음" (항상 0 출력)
  ```python
  # 예: 큰 learning rate로 가중치가 음수로 크게 이동
  # → 이후 모든 입력에 대해 음수 출력 → gradient = 0
  ```
- **Not Zero-Centered**: 출력이 항상 0 이상

#### 변형들

##### Leaky ReLU
```python
LeakyReLU(x) = max(αx, x)  # α = 0.01 등

# 장점: Dying ReLU 완화
output = nn.LeakyReLU(negative_slope=0.01)(x)
```

##### PReLU (Parametric ReLU)
```python
PReLU(x) = max(αx, x)  # α는 학습 가능한 파라미터

output = nn.PReLU()(x)
```

##### ELU (Exponential Linear Unit)
```python
ELU(x) = {
    x,              if x > 0
    α(e^x - 1),    if x ≤ 0
}

# 장점: Zero-centered에 가까움
output = nn.ELU(alpha=1.0)(x)
```

#### 사용 예
```python
class NeuralNetwork(nn.Module):
    def __init__(self):
        super().__init__()
        self.hidden = nn.Sequential(
            nn.Linear(784, 512),
            nn.ReLU(),  # 은닉층에 ReLU 사용
            nn.Linear(512, 256),
            nn.ReLU()
        )
```

---

### 2.4 Softmax

#### 수식
```
Softmax(x_i) = e^(x_i) / Σ(e^(x_j)) for all j
```

#### 특성
```
입력: [2.0, 1.0, 0.1]
출력: [0.659, 0.242, 0.099]  # 합 = 1.0
```

#### 장점
- 출력을 확률 분포로 변환 (합 = 1)
- 다중 클래스 분류에 필수

#### 사용 예
```python
# 주의: CrossEntropyLoss는 내부에 Softmax 포함
loss_fn = nn.CrossEntropyLoss()  # Softmax + NLLLoss

# 명시적 사용
probabilities = nn.Softmax(dim=1)(logits)
```

---

### 활성화 함수 선택 가이드

| 위치 | 추천 | 이유 |
|------|------|------|
| 은닉층 | **ReLU** | 빠르고 효과적, Vanishing Gradient 해결 |
| 은닉층 (대안) | Leaky ReLU, ELU | Dying ReLU 방지 |
| 이진 분류 출력 | Sigmoid | 확률 출력 (0~1) |
| 다중 분류 출력 | Softmax | 확률 분포 출력 |
| RNN/LSTM | Tanh | Zero-centered, 게이트 메커니즘 |
| 회귀 출력 | 없음 (선형) | 제한 없는 실수 출력 |

---

## 3. 손실 함수 (Loss Functions)

### 개요

손실 함수는 모델 예측과 실제 값의 차이를 정량화합니다. 학습 목표를 정의하는 핵심 요소입니다.

---

### 3.1 Mean Squared Error (MSE)

#### 수식
```
MSE = (1/n) × Σ(y_pred - y_true)²
```

#### 특성
- **회귀 문제**에 주로 사용
- L2 Loss라고도 함
- 오차의 제곱을 사용 → 큰 오차에 더 큰 패널티

#### PyTorch 구현
```python
loss_fn = nn.MSELoss()
loss = loss_fn(predictions, targets)
```

#### 수학적 직관

MSE는 **Gaussian 분포를 가정한 Maximum Likelihood Estimation**과 동일:

```
가정: y_true = y_pred + ε, ε ~ N(0, σ²)

최대 우도 추정:
maximize P(y_true | y_pred) = (1/√(2πσ²)) × exp(-(y_true - y_pred)²/(2σ²))

log를 취하고 최대화 → 최소화 문제로 변환:
minimize (y_true - y_pred)² = MSE
```

#### 장점
- 미분 가능하고 부드러움
- 수학적으로 명확
- 연속값 예측에 적합

#### 단점
- **이상치(Outlier)에 민감**: 제곱 때문에 큰 오차의 영향 증폭
- 분류 문제에는 부적합

#### 사용 예
```python
# 주택 가격 예측
model = LinearRegression()
loss_fn = nn.MSELoss()

predictions = model(features)  # [100.5, 205.3, ...]
targets = actual_prices        # [98.0, 210.0, ...]
loss = loss_fn(predictions, targets)
```

---

### 3.2 Cross-Entropy Loss

#### 수식

**Binary Cross-Entropy** (이진 분류):
```
BCE = -(y·log(p) + (1-y)·log(1-p))

y: 실제 라벨 (0 or 1)
p: 예측 확률 (0~1)
```

**Categorical Cross-Entropy** (다중 분류):
```
CE = -Σ(y_i × log(p_i))

y: one-hot 인코딩된 실제 라벨
p: 예측 확률 분포 (Softmax 출력)
```

#### 특성
- **분류 문제**에 사용
- 정보 이론의 엔트로피 개념 기반
- 확률 분포 간의 차이를 측정

#### PyTorch 구현

```python
# 이진 분류
loss_fn = nn.BCELoss()
# 입력: Sigmoid 적용된 확률
loss = loss_fn(torch.sigmoid(logits), targets)

# 다중 분류 (추천)
loss_fn = nn.CrossEntropyLoss()  # Softmax + NLLLoss 포함
# 입력: Raw logits (Softmax 미적용)
loss = loss_fn(logits, targets)

# 다중 분류 (수동)
loss_fn = nn.NLLLoss()
log_probs = torch.log_softmax(logits, dim=1)
loss = loss_fn(log_probs, targets)
```

#### 수학적 직관

Cross-Entropy는 **두 확률 분포의 차이**를 측정:

```
실제 분포 P = [0, 0, 1, 0, ...]  # one-hot
예측 분포 Q = [0.1, 0.2, 0.6, 0.1, ...]  # softmax 출력

Cross-Entropy(P, Q) = -Σ P(x)·log(Q(x))
                    = -log(Q(정답 인덱스))
                    = -log(0.6) = 0.51

완벽한 예측: -log(1.0) = 0
잘못된 예측: -log(0.01) = 4.61
```

#### 왜 log를 사용할까?

1. **수치 안정성**: 확률이 0에 가까워도 log로 증폭
2. **gradient가 선형적**: sigmoid/softmax와 조합 시 gradient 단순화
3. **정보 이론**: "놀라움(surprise)"의 척도

#### 예제: FashionMNIST

```python
# 실제 라벨: 3 (Dress)
# 예측 logits: [1.2, 0.3, 0.8, 5.1, 0.4, ...]

loss_fn = nn.CrossEntropyLoss()
loss = loss_fn(logits.unsqueeze(0), torch.tensor([3]))

# 내부 동작:
# 1. Softmax: [0.05, 0.02, 0.03, 0.89, 0.01, ...]
# 2. Log: [-2.99, -3.91, -3.51, -0.12, -4.61, ...]
# 3. 정답 인덱스(3) 선택: -0.12
# 4. 부호 반전: 0.12 (loss)
```

#### MSE vs Cross-Entropy

| 특성 | MSE | Cross-Entropy |
|------|-----|---------------|
| 용도 | 회귀 | 분류 |
| 출력 범위 | 제한 없음 | 확률 (0~1) |
| Gradient | 선형적 | 지수적 (큰 오차에 강한 gradient) |
| 이론적 배경 | Gaussian MLE | Multinomial MLE |

---

### 3.3 기타 손실 함수

#### MAE (Mean Absolute Error)
```python
MAE = (1/n) × Σ|y_pred - y_true|

# L1 Loss
loss_fn = nn.L1Loss()
```
- **장점**: 이상치에 덜 민감
- **단점**: 0에서 미분 불가능

#### Huber Loss
```python
# MSE와 MAE의 조합
loss_fn = nn.HuberLoss(delta=1.0)
```
- 작은 오차: MSE처럼 동작
- 큰 오차: MAE처럼 동작

#### Focal Loss
```python
# 불균형 데이터셋용
# 쉬운 예제의 가중치를 낮춤
```

---

## 4. 최적화 알고리즘 (Optimizers)

### 개요

Optimizer는 손실 함수를 최소화하기 위해 **모델 파라미터를 어떻게 업데이트할지** 결정합니다.

---

### 4.1 Gradient Descent (경사 하강법)

#### 기본 개념

손실 함수의 gradient(기울기) 반대 방향으로 파라미터를 이동:

```
W_new = W_old - η × ∂L/∂W

η: learning rate (학습률)
∂L/∂W: 손실에 대한 가중치의 gradient
```

#### 시각화

```
Loss
  ▲
  │     ╱╲
  │    ╱  ╲
  │   ╱    ╲
  │  ╱  ●   ╲     ● 현재 위치
  │ ╱   ↓    ╲    ↓ Gradient 방향
  │╱    ●     ╲
  └──────────────► Weight
```

#### 변형

##### Batch Gradient Descent
```python
# 전체 데이터셋으로 gradient 계산
for epoch in range(epochs):
    predictions = model(X_train)  # 전체 데이터
    loss = loss_fn(predictions, y_train)
    loss.backward()
    optimizer.step()
```
- **장점**: 안정적인 수렴
- **단점**: 큰 데이터셋에서 매우 느림

##### Stochastic Gradient Descent (SGD)
```python
# 샘플 하나씩 gradient 계산
for epoch in range(epochs):
    for x, y in dataset:  # 샘플 단위
        prediction = model(x)
        loss = loss_fn(prediction, y)
        loss.backward()
        optimizer.step()
```
- **장점**: 빠른 업데이트, 지역 최소값 탈출 가능
- **단점**: 노이즈가 많음, 불안정한 수렴

##### Mini-Batch Gradient Descent (가장 일반적)
```python
# 작은 배치로 gradient 계산
for epoch in range(epochs):
    for X_batch, y_batch in dataloader:  # 배치 단위
        predictions = model(X_batch)
        loss = loss_fn(predictions, y_batch)
        loss.backward()
        optimizer.step()
```
- **장점**: 속도와 안정성의 균형, GPU 활용 효율적
- **일반적 배치 크기**: 32, 64, 128, 256

---

### 4.2 SGD with Momentum

#### 수식
```
v_t = β × v_(t-1) + (1-β) × ∂L/∂W
W_new = W_old - η × v_t

v: velocity (속도)
β: momentum (보통 0.9)
```

#### 직관

공이 언덕을 굴러 내려가는 것처럼 **이전 방향을 기억**:

```
Loss
  ▲
  │     ╱╲
  │    ╱  ●─→  이전 방향 유지
  │   ╱  ╱ ╲    → 진동 감소
  │  ╱  ●   ╲   → 빠른 수렴
  │ ╱  ╱     ╲
  │╱  ●       ╲
  └──────────────► Weight
```

#### PyTorch 구현
```python
optimizer = torch.optim.SGD(
    model.parameters(),
    lr=0.01,
    momentum=0.9  # 모멘텀 추가
)
```

#### 장점
- 지역 최소값 탈출
- 진동 감소
- 더 빠른 수렴

---

### 4.3 Adam (Adaptive Moment Estimation)

#### 수식

```
# 1차 모멘트 (평균)
m_t = β1 × m_(t-1) + (1-β1) × ∂L/∂W

# 2차 모멘트 (분산)
v_t = β2 × v_(t-1) + (1-β2) × (∂L/∂W)²

# Bias 보정
m̂_t = m_t / (1 - β1^t)
v̂_t = v_t / (1 - β2^t)

# 파라미터 업데이트
W_new = W_old - η × m̂_t / (√v̂_t + ε)

β1 = 0.9   # 1차 모멘텀
β2 = 0.999 # 2차 모멘텀
ε = 1e-8   # 0으로 나누기 방지
```

#### 핵심 아이디어

1. **Momentum**: 이전 gradient의 방향 기억
2. **RMSProp**: 파라미터별로 학습률 적응적 조정
3. **Bias Correction**: 초기 모멘트 추정 보정

#### PyTorch 구현
```python
optimizer = torch.optim.Adam(
    model.parameters(),
    lr=0.001,        # 기본값도 잘 작동
    betas=(0.9, 0.999),
    eps=1e-8
)
```

#### 장점
- **적응적 학습률**: 각 파라미터마다 다른 학습률
- **하이퍼파라미터 튜닝 불필요**: 기본값이 대부분 잘 작동
- **빠른 수렴**: 대부분의 문제에서 우수
- **희소 Gradient 처리**: NLP, 추천 시스템 등에 효과적

#### 단점
- 일부 경우 **일반화 성능**이 SGD보다 낮을 수 있음
- 메모리 사용량이 더 큼 (1차/2차 모멘트 저장)

---

### 4.4 기타 Optimizer

#### AdamW
```python
optimizer = torch.optim.AdamW(
    model.parameters(),
    lr=0.001,
    weight_decay=0.01  # L2 정규화
)
```
- Adam + 개선된 Weight Decay
- **2025년 현재 가장 권장**되는 optimizer

#### RMSProp
```python
optimizer = torch.optim.RMSprop(
    model.parameters(),
    lr=0.01
)
```
- RNN에 효과적

#### Adagrad
```python
optimizer = torch.optim.Adagrad(
    model.parameters(),
    lr=0.01
)
```
- 희소 데이터에 효과적
- 학습률이 단조 감소 (장기 학습에 불리)

---

### Optimizer 비교

| Optimizer | 속도 | 안정성 | 일반화 | 하이퍼파라미터 튜닝 | 추천 용도 |
|-----------|------|--------|--------|---------------------|-----------|
| **SGD** | 느림 | 낮음 | 높음 | 많이 필요 | 최종 성능 극대화 |
| **SGD + Momentum** | 중간 | 중간 | 높음 | 필요 | 컴퓨터 비전 |
| **Adam** | 빠름 | 높음 | 중간 | 거의 불필요 | 프로토타이핑, NLP |
| **AdamW** | 빠름 | 높음 | 높음 | 거의 불필요 | **대부분의 경우** |
| **RMSProp** | 빠름 | 중간 | 중간 | 필요 | RNN, 강화학습 |

### 실전 가이드

#### 시작 단계
```python
# 빠른 실험용
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
```

#### 성능 최적화 단계
```python
# 최고 성능 추구
optimizer = torch.optim.AdamW(
    model.parameters(),
    lr=1e-3,
    weight_decay=0.01
)

# 학습률 스케줄러 추가
scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(
    optimizer,
    T_max=epochs
)
```

#### 최종 미세 조정
```python
# 일반화 성능 극대화
optimizer = torch.optim.SGD(
    model.parameters(),
    lr=0.01,
    momentum=0.9,
    weight_decay=1e-4
)
```

---

## 5. 정규화 기법 (Regularization)

### 개요

정규화는 **과적합(Overfitting)**을 방지하여 테스트 데이터에 대한 일반화 성능을 향상시킵니다.

---

### 5.1 Dropout

#### 개념

학습 중 **랜덤하게 뉴런을 비활성화**하여 특정 뉴런에 대한 의존성을 줄입니다.

```
학습 시:
[1.0, 0.8, 0.0, 1.2, 0.0, 0.5]  # 50% 확률로 0
         ↓
[1.0, 0.8,  X , 1.2,  X , 0.5]  # 드롭아웃

추론 시:
[1.0, 0.8, 0.6, 1.2, 0.9, 0.5]  # 모든 뉴런 사용
         ↓ (scaling)
[0.5, 0.4, 0.3, 0.6, 0.45, 0.25]  # p=0.5로 스케일
```

#### PyTorch 구현

```python
class NeuralNetwork(nn.Module):
    def __init__(self, dropout_rate=0.5):
        super().__init__()
        self.layer1 = nn.Linear(784, 512)
        self.dropout1 = nn.Dropout(dropout_rate)
        self.layer2 = nn.Linear(512, 256)
        self.dropout2 = nn.Dropout(dropout_rate)
        self.output = nn.Linear(256, 10)

    def forward(self, x):
        x = F.relu(self.layer1(x))
        x = self.dropout1(x)  # 학습 시에만 적용
        x = F.relu(self.layer2(x))
        x = self.dropout2(x)
        return self.output(x)

# 학습 모드
model.train()  # Dropout 활성화

# 추론 모드
model.eval()   # Dropout 비활성화
```

#### 원리

**앙상블 효과**: 매 배치마다 다른 서브네트워크 학습 → 여러 모델의 앙상블과 유사

```
Epoch 1: [○ ● ○ ●]  서브네트워크 A
Epoch 2: [● ○ ● ○]  서브네트워크 B
Epoch 3: [○ ● ● ○]  서브네트워크 C
...
→ 최종 모델 = 모든 서브네트워크의 평균
```

#### 장점
- 강력한 과적합 방지
- 간단하고 효과적
- 계산 비용 낮음

#### 단점
- 학습 시간 증가 (더 많은 epoch 필요)
- Dropout rate 튜닝 필요 (보통 0.2~0.5)

#### 권장 사항
```python
# 큰 레이어: 높은 dropout
nn.Dropout(0.5)

# 작은 레이어: 낮은 dropout
nn.Dropout(0.2)

# 출력층 직전: dropout 사용 안 함
```

---

### 5.2 Batch Normalization

#### 개념

각 층의 입력을 **배치 단위로 정규화**하여 학습 안정화:

```
배치: [x1, x2, x3, ..., xn]

1. 평균 계산: μ = mean(배치)
2. 분산 계산: σ² = variance(배치)
3. 정규화: x̂ = (x - μ) / √(σ² + ε)
4. 스케일 & 시프트: y = γ × x̂ + β

γ, β: 학습 가능한 파라미터
```

#### PyTorch 구현

```python
class NeuralNetwork(nn.Module):
    def __init__(self):
        super().__init__()
        self.layer1 = nn.Linear(784, 512)
        self.bn1 = nn.BatchNorm1d(512)  # 1D: Fully Connected
        self.layer2 = nn.Linear(512, 256)
        self.bn2 = nn.BatchNorm1d(256)
        self.output = nn.Linear(256, 10)

    def forward(self, x):
        x = self.layer1(x)
        x = self.bn1(x)      # Activation 전후 모두 가능
        x = F.relu(x)
        x = self.layer2(x)
        x = self.bn2(x)
        x = F.relu(x)
        return self.output(x)

# CNN용
nn.BatchNorm2d(num_channels)  # 2D: Convolutional
```

#### 학습 vs 추론

```python
# 학습 모드
model.train()
# → 현재 배치의 평균/분산 사용
# → Running 평균/분산 업데이트

# 추론 모드
model.eval()
# → Running 평균/분산 사용 (고정)
```

#### 장점
- **빠른 학습**: 더 큰 학습률 사용 가능
- **Gradient 안정화**: Internal Covariate Shift 감소
- **정규화 효과**: 약간의 과적합 방지
- **초기화 민감도 감소**

#### 단점
- 작은 배치에서 불안정 (배치 크기 ≥ 32 권장)
- 추론 시 배치 의존성

#### Layer Normalization (대안)
```python
# RNN/Transformer에 적합
nn.LayerNorm(normalized_shape)
```
- 배치 크기와 무관
- 시퀀스 모델에 효과적

---

### 5.3 Batch Normalization + Dropout 조합

#### 논쟁

두 기법을 함께 사용할 때 순서와 효과에 대한 논쟁이 있습니다.

#### 추천 순서 (2025년 기준)

```python
# 권장 1: BN → ReLU → Dropout
x = nn.Linear(in_features, out_features)(x)
x = nn.BatchNorm1d(out_features)(x)
x = nn.ReLU()(x)
x = nn.Dropout(0.5)(x)

# 권장 2: BN만 사용 (Dropout 제거)
x = nn.Linear(in_features, out_features)(x)
x = nn.BatchNorm1d(out_features)(x)
x = nn.ReLU()(x)
```

#### 실전 가이드

```python
# 일반적인 경우: BN만으로 충분
class SimpleNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.layers = nn.Sequential(
            nn.Linear(784, 512),
            nn.BatchNorm1d(512),
            nn.ReLU(),
            nn.Linear(512, 256),
            nn.BatchNorm1d(256),
            nn.ReLU(),
            nn.Linear(256, 10)
        )

# 강한 정규화 필요 시: BN + Dropout
class RegularizedNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(784, 512)
        self.bn1 = nn.BatchNorm1d(512)
        self.dropout1 = nn.Dropout(0.3)

        self.fc2 = nn.Linear(512, 256)
        self.bn2 = nn.BatchNorm1d(256)
        self.dropout2 = nn.Dropout(0.3)

        self.output = nn.Linear(256, 10)

    def forward(self, x):
        x = self.bn1(self.fc1(x))
        x = F.relu(x)
        x = self.dropout1(x)

        x = self.bn2(self.fc2(x))
        x = F.relu(x)
        x = self.dropout2(x)

        return self.output(x)
```

---

### 5.4 Weight Decay (L2 Regularization)

#### 개념

손실 함수에 가중치의 크기에 대한 페널티 추가:

```
Loss_total = Loss_data + λ × Σ(W²)

λ: weight decay 계수
```

#### PyTorch 구현

```python
optimizer = torch.optim.AdamW(
    model.parameters(),
    lr=1e-3,
    weight_decay=0.01  # L2 regularization
)
```

#### 효과
- 가중치를 작게 유지 → 단순한 모델 선호
- 과적합 방지

---

### 5.5 Data Augmentation

#### 개념

학습 데이터를 인위적으로 변형하여 데이터 다양성 증가

#### 이미지 예제

```python
from torchvision import transforms

transform = transforms.Compose([
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.RandomRotation(degrees=15),
    transforms.ColorJitter(brightness=0.2, contrast=0.2),
    transforms.RandomCrop(size=28, padding=4),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5], std=[0.5])
])

train_data = datasets.FashionMNIST(
    root="data",
    train=True,
    transform=transform  # Augmentation 적용
)
```

---

## 6. 실전 가이드라인

### 6.1 학습 파이프라인 체크리스트

```python
# ✓ 1. 데이터 준비
train_loader = DataLoader(train_data, batch_size=64, shuffle=True)
test_loader = DataLoader(test_data, batch_size=64)

# ✓ 2. 모델 정의 (BN + Dropout)
class Model(nn.Module):
    def __init__(self):
        super().__init__()
        self.features = nn.Sequential(
            nn.Linear(784, 512),
            nn.BatchNorm1d(512),
            nn.ReLU(),
            nn.Dropout(0.3),

            nn.Linear(512, 256),
            nn.BatchNorm1d(256),
            nn.ReLU(),
            nn.Dropout(0.3),

            nn.Linear(256, 10)
        )

    def forward(self, x):
        return self.features(x)

model = Model().to(device)

# ✓ 3. 손실 함수 선택
loss_fn = nn.CrossEntropyLoss()  # 분류
# loss_fn = nn.MSELoss()         # 회귀

# ✓ 4. Optimizer 선택
optimizer = torch.optim.AdamW(
    model.parameters(),
    lr=1e-3,
    weight_decay=0.01
)

# ✓ 5. 학습률 스케줄러 (선택)
scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(
    optimizer,
    mode='min',
    factor=0.5,
    patience=5
)

# ✓ 6. 학습 루프
for epoch in range(epochs):
    model.train()  # 필수!
    for X, y in train_loader:
        X, y = X.to(device), y.to(device)

        optimizer.zero_grad()
        outputs = model(X)
        loss = loss_fn(outputs, y)
        loss.backward()
        optimizer.step()

    # ✓ 7. 검증
    model.eval()  # 필수!
    with torch.no_grad():
        val_loss = 0
        for X, y in test_loader:
            X, y = X.to(device), y.to(device)
            outputs = model(X)
            val_loss += loss_fn(outputs, y).item()

    scheduler.step(val_loss)  # 학습률 조정
```

---

### 6.2 문제별 권장 설정

#### 이미지 분류 (CIFAR-10, ImageNet)

```python
# 모델
ResNet / EfficientNet with BatchNorm

# Optimizer
optimizer = torch.optim.AdamW(lr=1e-3, weight_decay=0.01)

# Augmentation
transforms.RandomHorizontalFlip()
transforms.RandomCrop(32, padding=4)
transforms.Normalize(mean, std)

# 정규화
Batch Normalization + Light Dropout(0.2)
```

#### 자연어 처리 (텍스트 분류)

```python
# 모델
Transformer with LayerNorm

# Optimizer
optimizer = torch.optim.AdamW(lr=5e-5, weight_decay=0.01)

# 정규화
Dropout(0.1-0.3) + Label Smoothing
```

#### 회귀 (주택 가격 예측)

```python
# 손실 함수
nn.MSELoss() or nn.HuberLoss()

# Optimizer
optimizer = torch.optim.Adam(lr=1e-3)

# 정규화
Weight Decay + Dropout(0.2)
```

---

### 6.3 디버깅 팁

#### 과적합 체크
```python
# 학습 loss는 감소하지만 검증 loss는 증가
if val_loss > train_loss * 1.5:
    print("Overfitting detected!")
    # → Dropout 증가 / Weight Decay 증가
```

#### 과소적합 체크
```python
# 학습 loss가 높음
if train_loss > threshold:
    print("Underfitting detected!")
    # → 모델 크기 증가 / 정규화 감소
```

#### Gradient 확인
```python
# Vanishing Gradient
for name, param in model.named_parameters():
    if param.grad is not None:
        print(f"{name}: {param.grad.abs().mean()}")
# → ReLU 사용 / BatchNorm 추가
```

---

### 6.4 하이퍼파라미터 튜닝 우선순위

1. **Learning Rate** (가장 중요)
   ```python
   lr_candidates = [1e-4, 3e-4, 1e-3, 3e-3, 1e-2]
   ```

2. **Batch Size**
   ```python
   batch_candidates = [32, 64, 128, 256]
   ```

3. **Weight Decay**
   ```python
   wd_candidates = [0, 1e-4, 1e-3, 1e-2]
   ```

4. **Dropout Rate**
   ```python
   dropout_candidates = [0.1, 0.3, 0.5]
   ```

5. **네트워크 구조**
   - 레이어 수
   - 각 레이어의 뉴런 수

---

## 요약

### 핵심 알고리즘

| 알고리즘 | 역할 | 핵심 요점 |
|----------|------|----------|
| **Backpropagation** | Gradient 계산 | Chain Rule로 효율적 미분 |
| **ReLU** | 비선형성 | Vanishing Gradient 해결 |
| **Cross-Entropy** | 분류 손실 | 확률 분포 간 차이 측정 |
| **Adam** | 최적화 | 적응적 학습률, 기본 선택 |
| **Batch Normalization** | 안정화 | 학습 가속, 정규화 효과 |
| **Dropout** | 정규화 | 과적합 방지, 앙상블 효과 |

### 기본 설정 템플릿

```python
# 대부분의 경우에 잘 작동하는 설정
model = YourModel()  # with BatchNorm + ReLU
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=0.01)
loss_fn = nn.CrossEntropyLoss()  # 분류
scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs)
```

---

*생성일: 2025-11-11*
*참고: PyTorch 공식 문서, 최신 연구 논문 (2025)*
