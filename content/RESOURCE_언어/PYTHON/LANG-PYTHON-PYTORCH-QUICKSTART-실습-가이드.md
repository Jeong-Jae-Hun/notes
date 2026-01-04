# PyTorch Quickstart 실습 가이드

## 목차
1. [환경 설정](#1-환경-설정)
2. [데이터 준비하기](#2-데이터-준비하기)
3. [모델 만들기](#3-모델-만들기)
4. [모델 학습하기](#4-모델-학습하기)
5. [모델 저장 및 로드](#5-모델-저장-및-로드)
6. [예측하기](#6-예측하기)

---

## 1. 환경 설정

### 1.1 프로젝트 초기화 (uv 사용)

이 가이드는 uv 패키지 매니저를 사용합니다. uv는 Rust로 작성된 빠른 Python 패키지 매니저입니다.

```bash
# uv 설치 (없는 경우)
curl -LsSf https://astral.sh/uv/install.sh | sh

# 프로젝트 디렉토리 생성 및 이동
mkdir pytorch-quickstart
cd pytorch-quickstart

# uv 프로젝트 초기화
uv init

# Python 버전 설정 (3.9 이상 권장)
uv python pin 3.11
```

### 1.2 필요한 라이브러리 설치

```bash
# PyTorch와 torchvision 설치
uv add torch torchvision

# 또는 개발 환경에서 직접 실행하려면
uv pip install torch torchvision
```

**pyproject.toml 예시:**
```toml
[project]
name = "pytorch-quickstart"
version = "0.1.0"
description = "PyTorch Quickstart Tutorial"
requires-python = ">=3.9"
dependencies = [
    "torch>=2.0.0",
    "torchvision>=0.15.0",
]
```

### 1.3 가상환경 활성화

```bash
# uv로 스크립트 실행
uv run python main.py

# 또는 가상환경 진입
source .venv/bin/activate  # macOS/Linux
# .venv\Scripts\activate    # Windows
```

### 1.4 기본 import

```python
import torch
from torch import nn
from torch.utils.data import DataLoader
from torchvision import datasets
from torchvision.transforms import ToTensor
```

---

## 2. 데이터 준비하기

### 2.1 FashionMNIST 데이터셋 다운로드

FashionMNIST는 10가지 의류 카테고리의 28x28 그레이스케일 이미지로 구성된 데이터셋입니다.

```python
# 학습 데이터 다운로드
training_data = datasets.FashionMNIST(
    root="data",
    train=True,
    download=True,
    transform=ToTensor(),
)

# 테스트 데이터 다운로드
test_data = datasets.FashionMNIST(
    root="data",
    train=False,
    download=True,
    transform=ToTensor(),
)
```

**설명:**
- `root`: 데이터를 저장할 디렉토리
- `train`: True면 학습 데이터, False면 테스트 데이터
- `download`: True면 데이터를 자동으로 다운로드
- `transform`: 이미지를 텐서로 변환

### 2.2 DataLoader 생성

```python
batch_size = 64

# DataLoader 생성
train_dataloader = DataLoader(training_data, batch_size=batch_size)
test_dataloader = DataLoader(test_data, batch_size=batch_size)
```

### 2.3 데이터 확인하기

```python
for X, y in test_dataloader:
    print(f"Shape of X [N, C, H, W]: {X.shape}")
    print(f"Shape of y: {y.shape} {y.dtype}")
    break
```

**예상 출력:**
```
Shape of X [N, C, H, W]: torch.Size([64, 1, 28, 28])
Shape of y: torch.Size([64]) torch.int64
```

**설명:**
- X: 이미지 데이터 (배치크기=64, 채널=1, 높이=28, 너비=28)
- y: 라벨 데이터 (배치크기=64)

---

## 3. 모델 만들기

### 3.1 디바이스 설정

GPU가 있으면 GPU를 사용하고, 없으면 CPU를 사용합니다.

```python
device = (
    "cuda"
    if torch.cuda.is_available()
    else "mps"
    if torch.backends.mps.is_available()
    else "cpu"
)
print(f"Using {device} device")
```

### 3.2 신경망 모델 정의

```python
class NeuralNetwork(nn.Module):
    def __init__(self):
        super().__init__()
        self.flatten = nn.Flatten()
        self.linear_relu_stack = nn.Sequential(
            nn.Linear(28*28, 512),
            nn.ReLU(),
            nn.Linear(512, 512),
            nn.ReLU(),
            nn.Linear(512, 10)
        )

    def forward(self, x):
        x = self.flatten(x)
        logits = self.linear_relu_stack(x)
        return logits
```

**모델 구조:**
1. **Flatten**: 28x28 이미지를 784 크기의 1차원 벡터로 변환
2. **Linear(784, 512)**: 첫 번째 은닉층 (512개 뉴런)
3. **ReLU**: 활성화 함수
4. **Linear(512, 512)**: 두 번째 은닉층 (512개 뉴런)
5. **ReLU**: 활성화 함수
6. **Linear(512, 10)**: 출력층 (10개 클래스)

### 3.3 모델 생성 및 확인

```python
model = NeuralNetwork().to(device)
print(model)
```

---

## 4. 모델 학습하기

### 4.1 손실 함수와 옵티마이저 정의

```python
loss_fn = nn.CrossEntropyLoss()
optimizer = torch.optim.SGD(model.parameters(), lr=1e-3)
```

**설명:**
- `CrossEntropyLoss`: 다중 클래스 분류를 위한 손실 함수
- `SGD`: Stochastic Gradient Descent 옵티마이저
- `lr=1e-3`: 학습률 0.001

### 4.2 학습 함수 정의

```python
def train(dataloader, model, loss_fn, optimizer):
    size = len(dataloader.dataset)
    model.train()
    for batch, (X, y) in enumerate(dataloader):
        X, y = X.to(device), y.to(device)

        # 예측 오류 계산
        pred = model(X)
        loss = loss_fn(pred, y)

        # 역전파
        loss.backward()
        optimizer.step()
        optimizer.zero_grad()

        if batch % 100 == 0:
            loss, current = loss.item(), (batch + 1) * len(X)
            print(f"loss: {loss:>7f}  [{current:>5d}/{size:>5d}]")
```

**학습 과정:**
1. 모델을 학습 모드로 설정 (`model.train()`)
2. 데이터를 디바이스로 이동
3. 순전파: 예측값 계산
4. 손실 계산
5. 역전파: 그래디언트 계산
6. 옵티마이저로 가중치 업데이트
7. 그래디언트 초기화

### 4.3 테스트 함수 정의

```python
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
```

**테스트 과정:**
1. 모델을 평가 모드로 설정 (`model.eval()`)
2. 그래디언트 계산 비활성화 (`torch.no_grad()`)
3. 전체 테스트 데이터에 대해 예측
4. 정확도와 평균 손실 계산

### 4.4 학습 실행

```python
epochs = 5
for t in range(epochs):
    print(f"Epoch {t+1}\n-------------------------------")
    train(train_dataloader, model, loss_fn, optimizer)
    test(test_dataloader, model, loss_fn)
print("Done!")
```

**예상 출력:**
```
Epoch 1
-------------------------------
loss: 2.304477  [   64/60000]
loss: 2.289532  [ 6464/60000]
...
Test Error:
 Accuracy: 35.8%, Avg loss: 2.289532

Epoch 2
-------------------------------
...
Test Error:
 Accuracy: 50.2%, Avg loss: 1.523456

...

Epoch 5
-------------------------------
...
Test Error:
 Accuracy: 64.5%, Avg loss: 1.100000

Done!
```

---

## 5. 모델 저장 및 로드

### 5.1 모델 저장

```python
torch.save(model.state_dict(), "model.pth")
print("Saved PyTorch Model State to model.pth")
```

### 5.2 모델 로드

```python
model = NeuralNetwork().to(device)
model.load_state_dict(torch.load("model.pth", weights_only=True))
```

**주의사항:**
- 모델을 로드하기 전에 동일한 구조의 모델 인스턴스를 먼저 생성해야 합니다.
- `weights_only=True`는 보안을 위해 가중치만 로드합니다.

---

## 6. 예측하기

### 6.1 클래스 라벨 정의

```python
classes = [
    "T-shirt/top",
    "Trouser",
    "Pullover",
    "Dress",
    "Coat",
    "Sandal",
    "Shirt",
    "Sneaker",
    "Bag",
    "Ankle boot",
]
```

### 6.2 예측 실행

```python
model.eval()
x, y = test_data[0][0], test_data[0][1]
with torch.no_grad():
    x = x.to(device)
    pred = model(x)
    predicted, actual = classes[pred[0].argmax(0)], classes[y]
    print(f'Predicted: "{predicted}", Actual: "{actual}"')
```

**예상 출력:**
```
Predicted: "Ankle boot", Actual: "Ankle boot"
```

---

## 전체 코드 예제

### 프로젝트 구조
```
pytorch-quickstart/
├── .venv/              # uv가 생성한 가상환경
├── data/               # 데이터셋이 다운로드될 디렉토리
├── main.py             # 메인 스크립트
├── model.pth           # 저장된 모델 (학습 후 생성)
├── pyproject.toml      # 프로젝트 설정 및 의존성
└── uv.lock             # 의존성 잠금 파일
```

### main.py 전체 코드

```python
import torch
from torch import nn
from torch.utils.data import DataLoader
from torchvision import datasets
from torchvision.transforms import ToTensor

# 1. 데이터 준비
training_data = datasets.FashionMNIST(
    root="data",
    train=True,
    download=True,
    transform=ToTensor(),
)

test_data = datasets.FashionMNIST(
    root="data",
    train=False,
    download=True,
    transform=ToTensor(),
)

batch_size = 64
train_dataloader = DataLoader(training_data, batch_size=batch_size)
test_dataloader = DataLoader(test_data, batch_size=batch_size)

# 2. 모델 정의
device = (
    "cuda"
    if torch.cuda.is_available()
    else "mps"
    if torch.backends.mps.is_available()
    else "cpu"
)
print(f"Using {device} device")

class NeuralNetwork(nn.Module):
    def __init__(self):
        super().__init__()
        self.flatten = nn.Flatten()
        self.linear_relu_stack = nn.Sequential(
            nn.Linear(28*28, 512),
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

# 3. 학습 설정
loss_fn = nn.CrossEntropyLoss()
optimizer = torch.optim.SGD(model.parameters(), lr=1e-3)

def train(dataloader, model, loss_fn, optimizer):
    size = len(dataloader.dataset)
    model.train()
    for batch, (X, y) in enumerate(dataloader):
        X, y = X.to(device), y.to(device)
        pred = model(X)
        loss = loss_fn(pred, y)
        loss.backward()
        optimizer.step()
        optimizer.zero_grad()
        if batch % 100 == 0:
            loss, current = loss.item(), (batch + 1) * len(X)
            print(f"loss: {loss:>7f}  [{current:>5d}/{size:>5d}]")

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

# 4. 학습 실행
epochs = 5
for t in range(epochs):
    print(f"Epoch {t+1}\n-------------------------------")
    train(train_dataloader, model, loss_fn, optimizer)
    test(test_dataloader, model, loss_fn)
print("Done!")

# 5. 모델 저장
torch.save(model.state_dict(), "model.pth")
print("Saved PyTorch Model State to model.pth")

# 6. 예측
classes = [
    "T-shirt/top",
    "Trouser",
    "Pullover",
    "Dress",
    "Coat",
    "Sandal",
    "Shirt",
    "Sneaker",
    "Bag",
    "Ankle boot",
]

model.eval()
x, y = test_data[0][0], test_data[0][1]
with torch.no_grad():
    x = x.to(device)
    pred = model(x)
    predicted, actual = classes[pred[0].argmax(0)], classes[y]
    print(f'Predicted: "{predicted}", Actual: "{actual}"')
```

### 실행 방법

```bash
# uv로 실행 (권장)
uv run python main.py

# 또는 가상환경 활성화 후 실행
source .venv/bin/activate
python main.py
```

### 실행 결과 예시

```
Using mps device
Epoch 1
-------------------------------
loss: 2.299493  [   64/60000]
loss: 2.283532  [ 6464/60000]
loss: 2.267890  [12864/60000]
loss: 2.259234  [19264/60000]
loss: 2.251456  [25664/60000]
loss: 2.228765  [32064/60000]
loss: 2.231234  [38464/60000]
loss: 2.194532  [44864/60000]
loss: 2.189876  [51264/60000]
loss: 2.162345  [57664/60000]
Test Error:
 Accuracy: 41.2%, Avg loss: 2.151234

Epoch 2
-------------------------------
...
Test Error:
 Accuracy: 52.6%, Avg loss: 1.823456

...

Epoch 5
-------------------------------
...
Test Error:
 Accuracy: 64.3%, Avg loss: 1.102345

Done!
Saved PyTorch Model State to model.pth
Predicted: "Ankle boot", Actual: "Ankle boot"
```

---

## 연습 문제

1. **학습률 변경**: `lr=1e-3`을 `lr=1e-2`나 `lr=1e-4`로 변경해보고 결과를 비교해보세요.

2. **에포크 수 조정**: `epochs = 10`으로 늘려서 학습하고 정확도가 어떻게 변하는지 확인해보세요.

3. **모델 구조 변경**: 은닉층의 크기를 512에서 256으로 줄이거나 1024로 늘려보세요.

4. **다른 옵티마이저**: `torch.optim.Adam(model.parameters(), lr=1e-3)`을 사용해보세요.

5. **배치 크기 조정**: `batch_size`를 32나 128로 변경하고 학습 속도와 성능을 비교해보세요.

---

## 추가 학습 자료

### PyTorch 관련
- [PyTorch 공식 문서](https://pytorch.org/docs/stable/index.html)
- [PyTorch 튜토리얼](https://pytorch.org/tutorials/)
- [FashionMNIST 데이터셋](https://github.com/zalandoresearch/fashion-mnist)

### uv 패키지 매니저
- [uv 공식 문서](https://docs.astral.sh/uv/)
- [uv GitHub Repository](https://github.com/astral-sh/uv)
- [uv 주요 명령어](https://docs.astral.sh/uv/reference/cli/)

### uv 주요 명령어 정리

```bash
# 프로젝트 초기화
uv init

# Python 버전 설정
uv python pin 3.11

# 패키지 추가
uv add <package-name>

# 패키지 제거
uv remove <package-name>

# 개발 의존성 추가
uv add --dev <package-name>

# 스크립트 실행
uv run python script.py

# 의존성 동기화
uv sync

# 설치된 패키지 목록
uv pip list

# 가상환경 생성 (자동으로 수행됨)
uv venv
```
