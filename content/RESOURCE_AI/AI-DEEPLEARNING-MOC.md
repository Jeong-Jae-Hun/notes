---
tags:
  - type/moc
  - topic/ai
---

# Deep Learning MOC

> 딥러닝 핵심 개념과 알고리즘 맵

## Overview

신경망 학습의 수학적 원리와 주요 알고리즘. [[PyTorch]]로 구현.

## Core Concepts

### Learning Process
- [[AI-BACKPROPAGATION|Backpropagation]] - 역전파, Chain Rule로 gradient 계산
- [[AI-LOSS-FUNCTIONS|Loss Functions]] - MSE, Cross-Entropy

### Activation Functions
- [[AI-ACTIVATION-FUNCTIONS|Activation Functions]] - ReLU, Sigmoid, Tanh, Softmax

### Optimization
- [[AI-OPTIMIZERS|Optimizers]] - SGD, Momentum, Adam, AdamW

### Regularization
- [[AI-REGULARIZATION|Regularization]] - Dropout, BatchNorm, Weight Decay

---

## Quick Reference

### Activation 선택
| 위치 | 추천 |
|------|------|
| 은닉층 | ReLU |
| 이진 분류 출력 | Sigmoid |
| 다중 분류 출력 | Softmax |
| RNN/LSTM | Tanh |

### Optimizer 선택
| 상황 | 추천 |
|------|------|
| 시작/프로토타입 | Adam |
| 최고 성능 | AdamW |
| 일반화 극대화 | SGD + Momentum |

### 기본 템플릿
```python
model = YourModel()  # with BatchNorm + ReLU
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=0.01)
loss_fn = nn.CrossEntropyLoss()
scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs)
```

---

## Related
- [[AI-PYTORCH-기초-완벽-가이드|PyTorch Guide]]
- [[AI-추천-시스템|Recommender Systems]]

---

#type/moc #topic/ai #topic/deeplearning
