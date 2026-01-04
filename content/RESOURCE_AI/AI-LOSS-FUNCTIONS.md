# Loss Functions (손실 함수)

> Created: 2025-12-29

모델 예측과 실제 값의 차이를 정량화. **학습 목표를 정의**하는 핵심 요소.

---

## MSE (Mean Squared Error)

**회귀 문제**에 사용.

```python
MSE = (1/n) × Σ(y_pred - y_true)²

loss_fn = nn.MSELoss()
```

**특징**:
- 오차의 제곱 → 큰 오차에 더 큰 패널티
- Gaussian 분포 가정한 Maximum Likelihood와 동일

**단점**: 이상치(Outlier)에 민감

**대안**:
```python
nn.L1Loss()  # MAE, 이상치에 덜 민감
nn.HuberLoss()  # MSE + MAE 조합
```

---

## Cross-Entropy Loss

**분류 문제**에 사용. 확률 분포 간 차이를 측정.

### Binary Cross-Entropy (이진 분류)
```python
BCE = -(y·log(p) + (1-y)·log(1-p))

loss_fn = nn.BCELoss()
# 입력: Sigmoid 적용된 확률
```

### Categorical Cross-Entropy (다중 분류)
```python
CE = -Σ(y_i × log(p_i))

loss_fn = nn.CrossEntropyLoss()  # Softmax 포함
# 입력: Raw logits (Softmax 미적용)
```

**왜 log?**
1. 수치 안정성
2. gradient가 선형적
3. "놀라움(surprise)"의 척도

---

## MSE vs Cross-Entropy

| 특성 | MSE | Cross-Entropy |
|------|-----|---------------|
| 용도 | 회귀 | 분류 |
| 출력 범위 | 제한 없음 | 확률 (0~1) |
| Gradient | 선형 | 지수적 (큰 오차에 강함) |
| 이론 | Gaussian MLE | Multinomial MLE |

---

## PyTorch 예제

```python
# 분류
loss_fn = nn.CrossEntropyLoss()
loss = loss_fn(logits, labels)  # logits: [batch, classes], labels: [batch]

# 회귀
loss_fn = nn.MSELoss()
loss = loss_fn(predictions, targets)
```

---

## Connections
- 핵심 개념: [[AI-DEEPLEARNING-MOC]]
- 활성화 함수: [[AI-ACTIVATION-FUNCTIONS#Softmax]]
- 최적화: [[AI-OPTIMIZERS]]

#topic/deeplearning #topic/ai
