# Optimizers (최적화 알고리즘)

> Created: 2025-12-29

[[AI-LOSS-FUNCTIONS|손실 함수]]를 최소화하기 위해 **모델 파라미터를 어떻게 업데이트할지** 결정한다.

---

## Gradient Descent

기본 원리: 손실 함수의 gradient **반대 방향**으로 이동.

```python
W_new = W_old - lr × ∂L/∂W
```

### Mini-Batch (가장 일반적)
```python
for X_batch, y_batch in dataloader:
    loss = loss_fn(model(X_batch), y_batch)
    loss.backward()
    optimizer.step()
```
- 일반적 배치 크기: 32, 64, 128, 256

---

## SGD with Momentum

이전 gradient의 방향을 기억. 진동 감소, 빠른 수렴.

```python
optimizer = torch.optim.SGD(
    model.parameters(),
    lr=0.01,
    momentum=0.9
)
```

---

## Adam (Adaptive Moment Estimation)

**1차 모멘트(평균)** + **2차 모멘트(분산)**으로 적응적 학습률.

```python
optimizer = torch.optim.Adam(
    model.parameters(),
    lr=0.001,  # 기본값도 잘 작동
    betas=(0.9, 0.999)
)
```

**장점**:
- 적응적 학습률 (파라미터마다 다름)
- 하이퍼파라미터 튜닝 거의 불필요
- 빠른 수렴

---

## AdamW (권장)

Adam + 개선된 Weight Decay. **2025년 가장 권장**.

```python
optimizer = torch.optim.AdamW(
    model.parameters(),
    lr=1e-3,
    weight_decay=0.01
)
```

---

## 비교

| Optimizer | 속도 | 안정성 | 일반화 | 튜닝 | 추천 용도 |
|-----------|------|--------|--------|------|-----------|
| SGD | 느림 | 낮음 | 높음 | 많이 | 최종 성능 극대화 |
| SGD+Momentum | 중간 | 중간 | 높음 | 필요 | 컴퓨터 비전 |
| Adam | 빠름 | 높음 | 중간 | 거의 불필요 | 프로토타입, NLP |
| **AdamW** | 빠름 | 높음 | 높음 | 거의 불필요 | **대부분** |

---

## 실전 가이드

```python
# 1. 시작 (빠른 실험)
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)

# 2. 성능 최적화
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=0.01)
scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs)

# 3. 최종 미세 조정 (일반화)
optimizer = torch.optim.SGD(model.parameters(), lr=0.01, momentum=0.9)
```

---

## Connections
- 핵심 개념: [[AI-DEEPLEARNING-MOC]]
- 역전파: [[AI-BACKPROPAGATION]]
- 정규화: [[AI-REGULARIZATION]]

#topic/deeplearning #topic/ai
