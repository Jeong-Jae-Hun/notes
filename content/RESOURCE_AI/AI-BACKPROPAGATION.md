# Backpropagation (역전파)

> Created: 2025-12-29

신경망 학습의 핵심 알고리즘. 예측값과 실제값의 차이를 줄이기 위해 **Chain Rule**로 gradient를 계산하고 가중치를 조정한다.

## 동작 원리

```
1. Forward Pass: 입력 → 출력 → 예측값
2. Loss 계산: loss = L(y_pred, y_true)
3. Backward Pass: 출력 → 입력 방향으로 gradient 전파
4. 가중치 업데이트: W_new = W_old - lr × ∂L/∂W
```

## 수학적 핵심

**Chain Rule**:
```
∂L/∂W = ∂L/∂a × ∂a/∂z × ∂z/∂W
```

출력층에서 입력층 방향으로 gradient를 곱해나간다.

## PyTorch 구현

```python
# 순전파
output = model(input)
loss = loss_fn(output, target)

# 역전파 (자동 미분)
loss.backward()

# 가중치 업데이트
optimizer.step()
```

## 문제점과 해결책

### Vanishing Gradient
깊은 네트워크에서 gradient가 0에 가까워지는 문제.

**원인**: sigmoid/tanh 미분값이 최대 0.25 → 층마다 곱해지면서 급감

**해결**:
- [[AI-ACTIVATION-FUNCTIONS#ReLU|ReLU]] 사용
- [[AI-REGULARIZATION#Batch Normalization|Batch Normalization]]
- Residual Connection (ResNet)

### Exploding Gradient
Gradient가 너무 커지는 문제.

**해결**:
- Gradient Clipping
- 적절한 가중치 초기화

---

## Connections
- 핵심 개념: [[AI-DEEPLEARNING-MOC]]
- 활성화 함수: [[AI-ACTIVATION-FUNCTIONS]]
- 최적화: [[AI-OPTIMIZERS]]

#topic/deeplearning #topic/ai
