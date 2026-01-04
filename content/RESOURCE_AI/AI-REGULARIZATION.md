# Regularization (정규화)

> Created: 2025-12-29

**과적합(Overfitting) 방지**하여 테스트 데이터에 대한 일반화 성능을 향상시킨다.

---

## Dropout

학습 중 **랜덤하게 뉴런을 비활성화**. 특정 뉴런에 대한 의존성을 줄인다.

```python
class Model(nn.Module):
    def __init__(self):
        self.dropout = nn.Dropout(0.5)

    def forward(self, x):
        x = F.relu(self.layer1(x))
        x = self.dropout(x)  # 학습 시에만 적용
        return x

# 학습: model.train()  → Dropout 활성화
# 추론: model.eval()   → Dropout 비활성화
```

**원리**: 매 배치마다 다른 서브네트워크 학습 → **앙상블 효과**

**권장**:
- 큰 레이어: 0.5
- 작은 레이어: 0.2
- 출력층 직전: 사용 안 함

---

## Batch Normalization

각 층의 입력을 **배치 단위로 정규화**.

```python
x = nn.Linear(in_features, out_features)(x)
x = nn.BatchNorm1d(out_features)(x)
x = nn.ReLU()(x)

# CNN용: nn.BatchNorm2d(num_channels)
```

**학습 vs 추론**:
- `model.train()` → 현재 배치의 평균/분산
- `model.eval()` → Running 평균/분산 (고정)

**장점**:
- 빠른 학습 (더 큰 lr 가능)
- Gradient 안정화
- 약간의 정규화 효과

**대안**: LayerNorm (RNN/Transformer에 적합)

---

## BN + Dropout 조합

**2025년 권장 순서**:
```python
x = nn.Linear()(x)
x = nn.BatchNorm1d()(x)
x = nn.ReLU()(x)
x = nn.Dropout(0.3)(x)  # 필요시
```

일반적으로 **BN만으로 충분**. 강한 정규화 필요시 Dropout 추가.

---

## Weight Decay (L2 Regularization)

가중치 크기에 패널티 추가.

```python
optimizer = torch.optim.AdamW(
    model.parameters(),
    weight_decay=0.01  # L2 regularization
)
```

---

## Data Augmentation

학습 데이터를 인위적으로 변형.

```python
transform = transforms.Compose([
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(15),
    transforms.ColorJitter(brightness=0.2),
    transforms.ToTensor(),
])
```

---

## 과적합 vs 과소적합

```python
# 과적합: train loss ↓, val loss ↑
→ Dropout 증가 / Weight Decay 증가

# 과소적합: train loss 높음
→ 모델 크기 증가 / 정규화 감소
```

---

## Connections
- 핵심 개념: [[AI-DEEPLEARNING-MOC]]
- 역전파 문제: [[AI-BACKPROPAGATION#Vanishing Gradient]]
- 최적화: [[AI-OPTIMIZERS]]

#topic/deeplearning #topic/ai
