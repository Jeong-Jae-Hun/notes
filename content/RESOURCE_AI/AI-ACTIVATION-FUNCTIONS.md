# Activation Functions (활성화 함수)

> Created: 2025-12-29

신경망에 **비선형성**을 도입하여 복잡한 패턴을 학습하게 한다. 활성화 함수 없이는 아무리 층을 깊게 쌓아도 단일 선형 변환과 동일하다.

---

## ReLU (Rectified Linear Unit)

**가장 많이 사용**. 은닉층 기본 선택.

```python
ReLU(x) = max(0, x)
```

**장점**:
- [[AI-BACKPROPAGATION#Vanishing Gradient|Vanishing Gradient]] 해결 (양수에서 gradient=1)
- 계산 효율적 (단순 max 연산)
- Sparsity → 일반화 성능 향상

**단점**:
- Dying ReLU: 음수 입력에서 뉴런이 "죽음" (항상 0 출력)

**변형**:
```python
# Dying ReLU 방지
nn.LeakyReLU(negative_slope=0.01)
nn.PReLU()  # 학습 가능한 slope
nn.ELU(alpha=1.0)  # Zero-centered에 가까움
```

---

## Sigmoid

```python
σ(x) = 1 / (1 + e^(-x))
# 출력: (0, 1)
```

**장점**: 확률로 해석 가능
**단점**: Vanishing Gradient, Not Zero-Centered

**용도**: **이진 분류 출력층**

---

## Tanh

```python
tanh(x) = (e^x - e^(-x)) / (e^x + e^(-x))
# 출력: (-1, 1)
```

**장점**: Zero-Centered
**단점**: 여전히 Vanishing Gradient

**용도**: **RNN/LSTM 내부 게이트**

---

## Softmax

```python
Softmax(x_i) = e^(x_i) / Σ(e^(x_j))
# 출력 합 = 1
```

**용도**: **다중 분류 출력층** (확률 분포로 변환)

```python
# CrossEntropyLoss는 Softmax 포함
loss_fn = nn.CrossEntropyLoss()
```

---

## 선택 가이드

| 위치 | 추천 | 이유 |
|------|------|------|
| 은닉층 | **ReLU** | 빠르고 효과적 |
| 은닉층 (대안) | LeakyReLU, ELU | Dying ReLU 방지 |
| 이진 분류 출력 | Sigmoid | 0~1 확률 |
| 다중 분류 출력 | Softmax | 확률 분포 |
| RNN/LSTM | Tanh | Zero-centered |
| 회귀 출력 | 없음 (선형) | 제한 없는 실수 |

---

## Connections
- 핵심 개념: [[AI-DEEPLEARNING-MOC]]
- 역전파: [[AI-BACKPROPAGATION]]
- 손실 함수: [[AI-LOSS-FUNCTIONS]]

#topic/deeplearning #topic/ai
