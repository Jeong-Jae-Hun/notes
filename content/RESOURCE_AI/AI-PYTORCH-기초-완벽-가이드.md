# PyTorch 기초 완벽 가이드

> FashionMNIST 데이터셋을 활용한 딥러닝 전체 워크플로우

## 목차

1. [개요](#개요)
2. [Tensors - 기본 데이터 구조](#1-tensors---기본-데이터-구조)
3. [Datasets & DataLoaders - 데이터 처리](#2-datasets--dataloaders---데이터-처리)
4. [Transforms - 데이터 전처리](#3-transforms---데이터-전처리)
5. [모델 구축](#4-모델-구축)
6. [Autograd - 자동 미분](#5-autograd---자동-미분)
7. [최적화](#6-최적화)
8. [모델 저장 및 로드](#7-모델-저장-및-로드)
9. [전체 워크플로우 예제](#전체-워크플로우-예제)

---

## 개요

PyTorch는 7가지 핵심 개념을 통해 머신러닝 워크플로우를 구현합니다:

**학습 목표**: FashionMNIST 데이터셋으로 의류 이미지를 10개 카테고리로 분류
- T-shirt/top, Trouser, Pullover, Dress, Coat, Sandal, Shirt, Sneaker, Bag, Ankle boot

---

## 1. Tensors - 기본 데이터 구조

### 정의
Tensors는 배열 및 행렬과 유사한 특수 데이터 구조입니다. NumPy의 ndarray와 비슷하지만 **GPU 가속**과 **자동 미분**을 지원합니다.

### 생성 방법

#### 1.1 직접 생성
```python
import torch

# 데이터로부터 생성 (자동 타입 추론)
data = [[1, 2], [3, 4]]
tensor = torch.tensor(data)

# NumPy 배열로부터 변환
import numpy as np
np_array = np.array(data)
tensor = torch.from_numpy(np_array)

# 기존 텐서로부터 생성 (shape 유지)
ones_tensor = torch.ones_like(tensor)  # 모두 1로 채움
rand_tensor = torch.rand_like(tensor, dtype=torch.float)  # 랜덤값

# 특정 값으로 초기화
shape = (2, 3)
rand_tensor = torch.rand(shape)   # 랜덤 [0, 1)
ones_tensor = torch.ones(shape)   # 모두 1
zeros_tensor = torch.zeros(shape) # 모두 0
```

### 주요 속성

```python
tensor = torch.rand(3, 4)

print(f"Shape: {tensor.shape}")        # torch.Size([3, 4])
print(f"Datatype: {tensor.dtype}")     # torch.float32
print(f"Device: {tensor.device}")      # cpu 또는 cuda
```

### 연산

#### 인덱싱 & 슬라이싱 (NumPy 스타일)
```python
tensor = torch.ones(4, 4)
tensor[:, 0] = 0      # 첫 번째 열을 0으로
tensor[0, :] = 0      # 첫 번째 행을 0으로
tensor[..., -1] = 0   # 마지막 열을 0으로
```

#### 텐서 결합
```python
# 차원을 따라 연결
t1 = torch.cat([tensor, tensor, tensor], dim=1)

# 새로운 차원으로 쌓기
t2 = torch.stack([tensor, tensor], dim=0)
```

#### 산술 연산
```python
# 행렬 곱셈
result = tensor @ tensor.T
result = tensor.matmul(tensor.T)

# 요소별 곱셈
result = tensor * tensor
result = tensor.mul(tensor)

# In-place 연산 (메모리 효율적이지만 gradient 계산 시 주의)
tensor.add_(5)  # tensor에 5를 더함 (원본 수정)
tensor.t_()     # 전치 (원본 수정)
```

#### 단일 요소 변환
```python
agg = tensor.sum()
agg_item = agg.item()  # Python 숫자로 변환
```

### GPU 사용

```python
# GPU 사용 가능 여부 확인 및 텐서 이동
if torch.accelerator.is_available():
    device = torch.accelerator.current_accelerator().type
    tensor = tensor.to(device)
```

**지원 가속기**: CUDA, MPS (Apple Silicon), MTIA, XPU

### NumPy 브릿지

CPU의 텐서와 NumPy 배열은 **메모리를 공유**하므로 하나를 변경하면 다른 하나도 변경됩니다.

```python
# Tensor → NumPy
t = torch.ones(5)
n = t.numpy()
t.add_(1)  # n도 함께 변경됨

# NumPy → Tensor
n = np.ones(5)
t = torch.from_numpy(n)
np.add(n, 1, out=n)  # t도 함께 변경됨
```

**주의**: GPU 텐서는 NumPy 변환 시 CPU로 먼저 복사해야 함

---

## 2. Datasets & DataLoaders - 데이터 처리

### 핵심 개념

- `torch.utils.data.Dataset`: 샘플과 라벨을 저장
- `torch.utils.data.DataLoader`: Dataset을 순회 가능한 객체로 감싸서 배치 처리, 셔플링, 멀티프로세싱 지원

### 사전 구축된 데이터셋 로드

```python
from torchvision import datasets
from torchvision.transforms import ToTensor

# FashionMNIST 다운로드 및 로드
training_data = datasets.FashionMNIST(
    root="data",           # 데이터 저장 경로
    train=True,            # 학습 데이터
    download=True,         # 없으면 다운로드
    transform=ToTensor()   # PIL Image → Tensor 변환
)

test_data = datasets.FashionMNIST(
    root="data",
    train=False,           # 테스트 데이터
    download=True,
    transform=ToTensor()
)
```

### 커스텀 Dataset 생성

3가지 필수 메서드를 구현해야 합니다:

```python
import os
import pandas as pd
from torch.utils.data import Dataset
from torchvision.io import decode_image

class CustomImageDataset(Dataset):
    def __init__(self, annotations_file, img_dir, transform=None):
        """데이터셋 초기화"""
        self.img_labels = pd.read_csv(annotations_file)
        self.img_dir = img_dir
        self.transform = transform

    def __len__(self):
        """데이터셋의 총 샘플 수 반환"""
        return len(self.img_labels)

    def __getitem__(self, idx):
        """주어진 인덱스의 샘플 로드 및 반환"""
        img_path = os.path.join(self.img_dir, self.img_labels.iloc[idx, 0])
        image = decode_image(img_path)
        label = self.img_labels.iloc[idx, 1]

        if self.transform:
            image = self.transform(image)

        return image, label
```

### DataLoader 사용

```python
from torch.utils.data import DataLoader

train_dataloader = DataLoader(
    training_data,
    batch_size=64,      # 배치당 샘플 수
    shuffle=True        # 에폭마다 데이터 순서 랜덤화 (과적합 방지)
)

test_dataloader = DataLoader(
    test_data,
    batch_size=64,
    shuffle=False       # 테스트는 셔플 불필요
)
```

### 데이터 순회

```python
# 첫 번째 배치 가져오기
train_features, train_labels = next(iter(train_dataloader))

print(f"Feature batch shape: {train_features.size()}")  # [64, 1, 28, 28]
print(f"Labels batch shape: {train_labels.size()}")      # [64]

# 전체 데이터 순회
for batch, (X, y) in enumerate(train_dataloader):
    # X: [batch_size, channels, height, width]
    # y: [batch_size]
    pass
```

---

## 3. Transforms - 데이터 전처리

### 개요

원시 데이터는 머신러닝에 바로 사용할 수 없는 경우가 많습니다. Transforms를 사용하여 데이터를 전처리합니다.

### 주요 Transform

#### ToTensor
PIL 이미지나 NumPy 배열을 PyTorch 텐서로 변환하고 픽셀값을 [0.0, 1.0] 범위로 정규화합니다.

```python
from torchvision.transforms import ToTensor

training_data = datasets.FashionMNIST(
    root="data",
    train=True,
    download=True,
    transform=ToTensor()  # PIL Image → Tensor, [0, 255] → [0.0, 1.0]
)
```

#### Lambda Transforms
사용자 정의 함수로 커스텀 전처리를 수행합니다.

```python
from torchvision.transforms import Lambda

# 정수 라벨 → One-hot 인코딩
target_transform = Lambda(
    lambda y: torch.zeros(10, dtype=torch.float).scatter_(
        0, torch.tensor(y), value=1
    )
)

# 예: 라벨 3 → [0, 0, 0, 1, 0, 0, 0, 0, 0, 0]
```

### TorchVision에서 적용

```python
training_data = datasets.FashionMNIST(
    root="data",
    train=True,
    download=True,
    transform=ToTensor(),            # 이미지 변환
    target_transform=target_transform # 라벨 변환
)
```

### 일반적인 Transforms

```python
from torchvision import transforms

# 여러 Transform 조합
transform = transforms.Compose([
    transforms.Resize(256),           # 크기 조정
    transforms.CenterCrop(224),       # 중앙 크롭
    transforms.ToTensor(),            # Tensor 변환
    transforms.Normalize(             # 정규화 (평균, 표준편차)
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])
```

---

## 4. 모델 구축

### 기본 구조

PyTorch 신경망은 `nn.Module`을 상속하여 구축합니다.

```python
import torch
from torch import nn

class NeuralNetwork(nn.Module):
    def __init__(self):
        super().__init__()
        self.flatten = nn.Flatten()
        self.linear_relu_stack = nn.Sequential(
            nn.Linear(28 * 28, 512),  # 입력층 → 은닉층1
            nn.ReLU(),
            nn.Linear(512, 512),       # 은닉층1 → 은닉층2
            nn.ReLU(),
            nn.Linear(512, 10)         # 은닉층2 → 출력층
        )

    def forward(self, x):
        """순전파 정의"""
        x = self.flatten(x)
        logits = self.linear_relu_stack(x)
        return logits
```

### 핵심 레이어

#### nn.Flatten
다차원 텐서를 1D로 펼칩니다 (배치 차원은 유지).

```python
flatten = nn.Flatten()
# 입력: [batch_size, 1, 28, 28]
# 출력: [batch_size, 784]
```

#### nn.Linear
선형 변환 (y = xW^T + b)을 수행합니다.

```python
layer = nn.Linear(in_features=784, out_features=512)
# 가중치: [512, 784], 편향: [512]
```

#### nn.ReLU
비선형 활성화 함수로 복잡한 패턴 학습을 가능하게 합니다.

```python
relu = nn.ReLU()
# 음수 → 0, 양수 → 그대로
```

#### nn.Sequential
레이어들을 순서대로 실행하는 컨테이너입니다.

```python
seq_modules = nn.Sequential(
    flatten,
    nn.Linear(784, 512),
    nn.ReLU(),
    nn.Linear(512, 10)
)
```

#### nn.Softmax
로짓(unbounded 값)을 확률 분포로 변환합니다.

```python
softmax = nn.Softmax(dim=1)
# 입력: [batch, 10] (로짓)
# 출력: [batch, 10] (확률, 합=1)
```

### 모델 파라미터 확인

```python
model = NeuralNetwork()

# 모든 파라미터 출력
for name, param in model.named_parameters():
    print(f"{name}: {param.size()}")

# 출력 예:
# linear_relu_stack.0.weight: torch.Size([512, 784])
# linear_relu_stack.0.bias: torch.Size([512])
# linear_relu_stack.2.weight: torch.Size([512, 512])
# linear_relu_stack.2.bias: torch.Size([512])
# linear_relu_stack.4.weight: torch.Size([10, 512])
# linear_relu_stack.4.bias: torch.Size([10])
```

### 디바이스로 이동

```python
device = (
    torch.accelerator.current_accelerator().type
    if torch.accelerator.is_available()
    else "cpu"
)

model = NeuralNetwork().to(device)
```

---

## 5. Autograd - 자동 미분

### 개요

`torch.autograd`는 자동으로 미분을 계산하는 엔진입니다. 역전파 알고리즘에 필수적입니다.

### 계산 그래프

PyTorch는 순전파 시 **방향 비순환 그래프(DAG)**를 생성합니다:
- **Leaf 노드**: 입력 텐서
- **Root 노드**: 출력 텐서
- 역전파 시 체인 룰을 사용하여 gradient 계산

### requires_grad 속성

Gradient 추적을 활성화합니다.

```python
x = torch.ones(5, requires_grad=True)
# 이 텐서와 관련된 연산의 gradient가 계산됨
```

**중요**: Leaf 노드이면서 `requires_grad=True`인 텐서만 `.grad` 속성에 접근 가능

### grad_fn

각 텐서는 생성 연산의 역전파 함수를 `grad_fn`에 저장합니다.

```python
y = x + 2
print(y.grad_fn)  # <AddBackward0 object>

z = y * y * 3
print(z.grad_fn)  # <MulBackward0 object>
```

### Gradient 계산

```python
# 간단한 예제
x = torch.ones(2, 2, requires_grad=True)
y = x + 2
z = y * y * 3
out = z.mean()

# 역전파
out.backward()

# Gradient 확인
print(x.grad)  # dout/dx
```

**주의**: PyTorch는 gradient를 누적하므로 매번 `.zero_grad()`로 초기화해야 합니다.

### Gradient 추적 비활성화

#### 방법 1: torch.no_grad() 컨텍스트
```python
with torch.no_grad():
    y = x + 2
print(y.requires_grad)  # False
```

#### 방법 2: .detach()
```python
y = x.detach()
print(y.requires_grad)  # False
```

**사용 사례**:
- 파라미터 고정 (특정 레이어 학습 중지)
- 추론 가속 (순전파만 필요)

### 동적 그래프

`.backward()` 호출 후 그래프는 초기화되고 매번 새로 생성됩니다. 이를 통해 동적 제어 흐름이 가능합니다.

---

## 6. 최적화

### 학습 프로세스

1. 예측 수행
2. 손실(loss) 계산
3. Gradient 계산
4. 파라미터 업데이트

### 하이퍼파라미터

```python
epochs = 10           # 전체 데이터셋 반복 횟수
batch_size = 64       # 파라미터 업데이트 전 처리할 샘플 수
learning_rate = 1e-3  # 각 단계에서 파라미터 조정 크기
```

### 손실 함수

모델 예측과 실제 값의 차이를 정량화합니다.

```python
# 회귀 문제
loss_fn = nn.MSELoss()

# 분류 문제 (일반)
loss_fn = nn.NLLLoss()

# 분류 문제 (LogSoftmax + NLLLoss 통합)
loss_fn = nn.CrossEntropyLoss()
```

### 옵티마이저

파라미터를 조정하는 알고리즘입니다.

```python
from torch.optim import SGD, Adam, RMSProp

# SGD (Stochastic Gradient Descent)
optimizer = SGD(model.parameters(), lr=learning_rate)

# Adam (적응적 학습률)
optimizer = Adam(model.parameters(), lr=learning_rate)

# RMSProp
optimizer = RMSProp(model.parameters(), lr=learning_rate)
```

### 최적화 3단계

각 학습 반복마다:

```python
# 1. Gradient 초기화 (누적 방지)
optimizer.zero_grad()

# 2. 역전파 (gradient 계산)
loss.backward()

# 3. 파라미터 업데이트
optimizer.step()
```

### 학습 루프

```python
def train_loop(dataloader, model, loss_fn, optimizer):
    size = len(dataloader.dataset)
    model.train()  # 학습 모드 (dropout, batch norm 활성화)

    for batch, (X, y) in enumerate(dataloader):
        # 예측 및 손실 계산
        pred = model(X)
        loss = loss_fn(pred, y)

        # 역전파 및 최적화
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        if batch % 100 == 0:
            loss_value = loss.item()
            current = (batch + 1) * len(X)
            print(f"loss: {loss_value:>7f}  [{current:>5d}/{size:>5d}]")
```

### 검증 루프

```python
def test_loop(dataloader, model, loss_fn):
    model.eval()  # 평가 모드 (dropout, batch norm 비활성화)
    size = len(dataloader.dataset)
    num_batches = len(dataloader)
    test_loss, correct = 0, 0

    with torch.no_grad():  # Gradient 계산 비활성화
        for X, y in dataloader:
            pred = model(X)
            test_loss += loss_fn(pred, y).item()
            correct += (pred.argmax(1) == y).type(torch.float).sum().item()

    test_loss /= num_batches
    correct /= size
    print(f"Test Error: \n Accuracy: {(100*correct):>0.1f}%, Avg loss: {test_loss:>8f} \n")
```

### 전체 학습 파이프라인

```python
# 모델, 손실, 옵티마이저 초기화
model = NeuralNetwork().to(device)
loss_fn = nn.CrossEntropyLoss()
optimizer = torch.optim.SGD(model.parameters(), lr=1e-3)

# 학습 실행
for epoch in range(epochs):
    print(f"Epoch {epoch+1}\n-------------------------------")
    train_loop(train_dataloader, model, loss_fn, optimizer)
    test_loop(test_dataloader, model, loss_fn)
print("Done!")
```

**FashionMNIST 결과 예시** (10 에폭):
- 초기: Accuracy 42.9%, Loss 2.155
- 최종: Accuracy 70.9%, Loss 0.785

---

## 7. 모델 저장 및 로드

### state_dict

PyTorch 모델은 학습된 파라미터를 `state_dict`라는 내부 구조에 저장합니다.

### 모델 가중치 저장 (권장)

```python
# 가중치만 저장
torch.save(model.state_dict(), 'model_weights.pth')
```

**장점**:
- 파일 크기가 작음
- 이식성이 높음
- 보안상 안전

### 모델 가중치 로드

```python
# 1. 동일한 아키텍처의 모델 생성
model = NeuralNetwork()

# 2. 가중치 로드
model.load_state_dict(
    torch.load('model_weights.pth', weights_only=True)
)

# 3. 평가 모드로 전환 (필수!)
model.eval()
```

**`weights_only=True`**: 보안을 위해 가중치만 언피클링

**`model.eval()` 필수 이유**:
- Dropout 비활성화
- Batch Normalization을 평가 모드로 전환
- 일관된 예측 결과 보장

### 전체 모델 저장 (대안)

```python
# 아키텍처 + 가중치 함께 저장
torch.save(model, 'model.pth')

# 로드
model = torch.load('model.pth', weights_only=False)
model.eval()
```

**단점**:
- Python pickle 모듈 의존
- 원본 클래스 정의가 필요 (이식성 떨어짐)
- 보안 위험

**권장**: `state_dict` 방식 사용

---

## 전체 워크플로우 예제

```python
import torch
from torch import nn
from torch.utils.data import DataLoader
from torchvision import datasets
from torchvision.transforms import ToTensor

# ===== 1. 데이터 준비 =====
training_data = datasets.FashionMNIST(
    root="data",
    train=True,
    download=True,
    transform=ToTensor()
)

test_data = datasets.FashionMNIST(
    root="data",
    train=False,
    download=True,
    transform=ToTensor()
)

train_dataloader = DataLoader(training_data, batch_size=64, shuffle=True)
test_dataloader = DataLoader(test_data, batch_size=64)

# ===== 2. 디바이스 설정 =====
device = (
    torch.accelerator.current_accelerator().type
    if torch.accelerator.is_available()
    else "cpu"
)
print(f"Using {device} device")

# ===== 3. 모델 정의 =====
class NeuralNetwork(nn.Module):
    def __init__(self):
        super().__init__()
        self.flatten = nn.Flatten()
        self.linear_relu_stack = nn.Sequential(
            nn.Linear(28 * 28, 512),
            nn.ReLU(),
            nn.Linear(512, 512),
            nn.ReLU(),
            nn.Linear(512, 10)
        )

    def forward(self, x):
        x = self.flatten(x)
        logits = self.linear_relu_stack(x)
        return logits

model = NeuralNetwork().to(device)
print(model)

# ===== 4. 손실 함수 및 옵티마이저 =====
loss_fn = nn.CrossEntropyLoss()
optimizer = torch.optim.SGD(model.parameters(), lr=1e-3)

# ===== 5. 학습 및 검증 함수 =====
def train(dataloader, model, loss_fn, optimizer):
    size = len(dataloader.dataset)
    model.train()
    for batch, (X, y) in enumerate(dataloader):
        X, y = X.to(device), y.to(device)

        pred = model(X)
        loss = loss_fn(pred, y)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        if batch % 100 == 0:
            loss_value, current = loss.item(), (batch + 1) * len(X)
            print(f"loss: {loss_value:>7f}  [{current:>5d}/{size:>5d}]")

def test(dataloader, model, loss_fn):
    size = len(dataloader.dataset)
    num_batches = len(dataloader)
    model.eval()
    test_loss, correct = 0, 0

    with torch.no_grad():
        for X, y in dataloader:
            X, y = X.to(device), y.to(device)
            pred = model(X)
            test_loss += loss_fn(pred, y).item()
            correct += (pred.argmax(1) == y).type(torch.float).sum().item()

    test_loss /= num_batches
    correct /= size
    print(f"Test Error: \n Accuracy: {(100*correct):>0.1f}%, Avg loss: {test_loss:>8f} \n")

# ===== 6. 학습 실행 =====
epochs = 10
for t in range(epochs):
    print(f"Epoch {t+1}\n-------------------------------")
    train(train_dataloader, model, loss_fn, optimizer)
    test(test_dataloader, model, loss_fn)
print("Done!")

# ===== 7. 모델 저장 =====
torch.save(model.state_dict(), "model.pth")
print("Saved PyTorch Model State to model.pth")

# ===== 8. 모델 로드 및 추론 =====
model = NeuralNetwork().to(device)
model.load_state_dict(torch.load("model.pth", weights_only=True))
model.eval()

classes = [
    "T-shirt/top", "Trouser", "Pullover", "Dress", "Coat",
    "Sandal", "Shirt", "Sneaker", "Bag", "Ankle boot"
]

x, y = test_data[0][0], test_data[0][1]
with torch.no_grad():
    x = x.to(device)
    pred = model(x.unsqueeze(0))  # 배치 차원 추가
    predicted_class = classes[pred[0].argmax(0)]
    actual_class = classes[y]
    print(f"Predicted: {predicted_class}, Actual: {actual_class}")
```

---

## 핵심 요약

### 데이터 흐름
```
원본 데이터
    ↓ (Dataset + Transform)
Tensor 데이터
    ↓ (DataLoader)
배치 데이터
    ↓ (Model)
예측값
    ↓ (Loss Function)
손실값
    ↓ (Autograd)
Gradient
    ↓ (Optimizer)
파라미터 업데이트
```

### 주요 개념 맵핑

| 개념 | PyTorch 구성 요소 | 역할 |
|------|------------------|------|
| 데이터 구조 | `torch.Tensor` | NumPy + GPU + Autograd |
| 데이터 로딩 | `Dataset`, `DataLoader` | 배치 처리, 셔플링 |
| 전처리 | `transforms` | 정규화, 증강 |
| 모델 | `nn.Module` | 레이어 조합 |
| 순전파 | `forward()` | 입력 → 출력 |
| 역전파 | `autograd`, `.backward()` | Gradient 계산 |
| 손실 | `nn.CrossEntropyLoss` 등 | 오차 측정 |
| 최적화 | `torch.optim.SGD` 등 | 파라미터 조정 |
| 저장/로드 | `state_dict` | 모델 영속성 |

### 모범 사례

1. **학습 전**:
   - `model.train()` 호출
   - `optimizer.zero_grad()` 호출

2. **추론 전**:
   - `model.eval()` 호출
   - `with torch.no_grad():` 사용

3. **저장**:
   - `state_dict` 방식 사용
   - `weights_only=True` 옵션

4. **GPU 사용**:
   - 모델과 데이터를 같은 디바이스로 이동

---

## 참고 자료

- [PyTorch 공식 튜토리얼](https://docs.pytorch.org/tutorials/beginner/basics/intro.html)
- [Deep Learning with PyTorch: A 60 Minute Blitz](https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html)
- [Learning PyTorch with Examples](https://pytorch.org/tutorials/beginner/pytorch_with_examples.html)

---

*생성일: 2025-11-11*
*대상: FashionMNIST 분류 작업*

https://news.hada.io/topic?id=24757