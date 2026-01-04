# Python 프로젝트 구조 가이드

## 목차
1. [프로젝트 구조의 중요성](#프로젝트-구조의-중요성)
2. [구조 유형별 비교](#구조-유형별-비교)
3. [src Layout 상세 가이드](#src-layout-상세-가이드)
4. [실전 예시: PyTorch 프로젝트](#실전-예시-pytorch-프로젝트)
5. [주요 파일 설명](#주요-파일-설명)
6. [uv를 활용한 프로젝트 세팅](#uv를-활용한-프로젝트-세팅)

---

## 프로젝트 구조의 중요성

좋은 프로젝트 구조는:
- **유지보수성**: 코드 위치를 쉽게 찾을 수 있음
- **확장성**: 새 기능 추가가 용이
- **테스트**: 테스트 코드 작성 및 관리 편리
- **협업**: 팀원들이 일관된 구조로 작업
- **배포**: 패키징 및 배포가 간편

---

## 구조 유형별 비교

### 1. Flat Layout (단순 프로젝트)

```
simple_project/
├── .gitignore
├── README.md
├── pyproject.toml
├── main.py
├── utils.py
└── tests/
    └── test_main.py
```

**사용 시기:**
- 단일 스크립트 프로젝트
- 학습용 코드
- 빠른 프로토타입

**장점:**
- 매우 단순
- 빠른 시작

**단점:**
- 확장성 부족
- 모듈 분리 어려움

---

### 2. Package Layout (중규모 프로젝트)

```
medium_project/
├── .gitignore
├── README.md
├── pyproject.toml
├── my_package/
│   ├── __init__.py
│   ├── __main__.py
│   ├── core.py
│   └── utils.py
├── tests/
│   ├── __init__.py
│   └── test_core.py
└── scripts/
    └── setup.py
```

**사용 시기:**
- 여러 모듈로 구성된 프로젝트
- 라이브러리 개발
- 중간 규모 애플리케이션

**장점:**
- 모듈화된 구조
- 패키지로 관리 가능

**단점:**
- import 경로 문제 가능성
- 테스트 시 editable install 필요

---

### 3. src Layout (대규모 프로젝트 - 권장)

```
large_project/
├── .gitignore
├── README.md
├── pyproject.toml
├── src/
│   └── my_package/
│       ├── __init__.py
│       ├── __main__.py
│       └── core/
│           ├── __init__.py
│           └── engine.py
├── tests/
│   ├── conftest.py
│   └── test_core.py
├── docs/
│   └── index.md
└── examples/
    └── basic.py
```

**사용 시기:**
- 프로덕션 레벨 애플리케이션
- 오픈소스 라이브러리
- 팀 프로젝트

**장점:**
- 명확한 소스/테스트 분리
- import 문제 방지
- 배포 시 안전성
- 업계 표준

**단점:**
- 초기 설정 복잡도

---

## src Layout 상세 가이드

### 전체 구조

```
project_name/
├── .git/
├── .gitignore
├── .github/                    # GitHub 관련 설정
│   ├── workflows/
│   │   └── ci.yml             # CI/CD 파이프라인
│   └── PULL_REQUEST_TEMPLATE.md
├── .venv/                     # 가상환경 (gitignore)
├── README.md
├── LICENSE
├── pyproject.toml
├── uv.lock
│
├── src/                       # 소스 코드
│   └── project_name/
│       ├── __init__.py
│       ├── __main__.py        # CLI 진입점
│       ├── cli.py             # CLI 구현
│       │
│       ├── core/              # 핵심 비즈니스 로직
│       │   ├── __init__.py
│       │   ├── engine.py
│       │   └── processor.py
│       │
│       ├── models/            # 데이터 모델
│       │   ├── __init__.py
│       │   ├── base.py
│       │   ├── user.py
│       │   └── database.py
│       │
│       ├── services/          # 서비스 레이어
│       │   ├── __init__.py
│       │   ├── auth.py
│       │   └── api.py
│       │
│       ├── utils/             # 유틸리티 함수
│       │   ├── __init__.py
│       │   ├── logger.py
│       │   ├── validators.py
│       │   └── helpers.py
│       │
│       └── config/            # 설정 관리
│           ├── __init__.py
│           ├── settings.py
│           └── constants.py
│
├── tests/                     # 테스트 코드
│   ├── __init__.py
│   ├── conftest.py           # pytest fixtures
│   │
│   ├── unit/                 # 단위 테스트
│   │   ├── __init__.py
│   │   ├── test_core.py
│   │   └── test_utils.py
│   │
│   ├── integration/          # 통합 테스트
│   │   ├── __init__.py
│   │   └── test_api.py
│   │
│   └── e2e/                  # E2E 테스트
│       └── test_workflow.py
│
├── docs/                      # 문서
│   ├── index.md
│   ├── getting_started.md
│   ├── api_reference.md
│   └── architecture.md
│
├── examples/                  # 사용 예시
│   ├── basic_usage.py
│   └── advanced_usage.py
│
├── scripts/                   # 유틸리티 스크립트
│   ├── setup.sh
│   ├── deploy.sh
│   └── migrate.py
│
├── data/                      # 데이터 파일 (gitignore)
│   ├── raw/
│   ├── processed/
│   └── models/
│
└── notebooks/                 # Jupyter notebooks
    └── exploration.ipynb
```

---

## 실전 예시: PyTorch 프로젝트

### 구조

```
pytorch_ml_project/
├── .gitignore
├── README.md
├── pyproject.toml
├── uv.lock
│
├── src/
│   └── ml_project/
│       ├── __init__.py
│       ├── __main__.py
│       │
│       ├── data/              # 데이터 처리
│       │   ├── __init__.py
│       │   ├── dataset.py
│       │   ├── transforms.py
│       │   └── dataloader.py
│       │
│       ├── models/            # 모델 정의
│       │   ├── __init__.py
│       │   ├── base_model.py
│       │   ├── resnet.py
│       │   └── custom_net.py
│       │
│       ├── training/          # 학습 로직
│       │   ├── __init__.py
│       │   ├── trainer.py
│       │   ├── evaluator.py
│       │   └── callbacks.py
│       │
│       ├── utils/
│       │   ├── __init__.py
│       │   ├── metrics.py
│       │   ├── logger.py
│       │   └── visualization.py
│       │
│       └── config/
│           ├── __init__.py
│           ├── train_config.py
│           └── model_config.py
│
├── tests/
│   ├── test_dataset.py
│   ├── test_model.py
│   └── test_trainer.py
│
├── configs/                   # 설정 파일
│   ├── default.yaml
│   ├── resnet18.yaml
│   └── experiment_01.yaml
│
├── data/                      # 데이터 (gitignore)
│   ├── raw/
│   ├── processed/
│   └── .gitkeep
│
├── checkpoints/               # 모델 체크포인트 (gitignore)
│   └── .gitkeep
│
├── logs/                      # 로그 (gitignore)
│   └── .gitkeep
│
└── notebooks/
    ├── eda.ipynb
    └── model_analysis.ipynb
```

### 핵심 파일 예시

#### `src/ml_project/__init__.py`
```python
"""ML Project - PyTorch Machine Learning Project."""

__version__ = "0.1.0"

from ml_project.models import ResNet
from ml_project.training import Trainer

__all__ = ["ResNet", "Trainer"]
```

#### `src/ml_project/__main__.py`
```python
"""CLI entry point."""

import argparse
from ml_project.training.trainer import Trainer
from ml_project.config.train_config import load_config


def main():
    parser = argparse.ArgumentParser(description="Train ML model")
    parser.add_argument("--config", type=str, required=True)
    parser.add_argument("--epochs", type=int, default=10)
    args = parser.parse_args()

    config = load_config(args.config)
    trainer = Trainer(config)
    trainer.train(epochs=args.epochs)


if __name__ == "__main__":
    main()
```

#### `src/ml_project/models/base_model.py`
```python
"""Base model class."""

import torch.nn as nn
from abc import ABC, abstractmethod


class BaseModel(nn.Module, ABC):
    """Abstract base model."""

    def __init__(self):
        super().__init__()

    @abstractmethod
    def forward(self, x):
        """Forward pass."""
        pass

    def count_parameters(self):
        """Count trainable parameters."""
        return sum(p.numel() for p in self.parameters() if p.requires_grad)
```

#### `src/ml_project/data/dataset.py`
```python
"""Dataset classes."""

import torch
from torch.utils.data import Dataset
from torchvision import datasets, transforms


class CustomDataset(Dataset):
    """Custom dataset implementation."""

    def __init__(self, data_dir, transform=None):
        self.data_dir = data_dir
        self.transform = transform
        # Load data here

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        # Return single item
        pass
```

#### `src/ml_project/training/trainer.py`
```python
"""Training logic."""

import torch
from torch import nn, optim
from tqdm import tqdm


class Trainer:
    """Model trainer."""

    def __init__(self, model, train_loader, test_loader, device):
        self.model = model.to(device)
        self.train_loader = train_loader
        self.test_loader = test_loader
        self.device = device

        self.criterion = nn.CrossEntropyLoss()
        self.optimizer = optim.Adam(model.parameters())

    def train_epoch(self):
        """Train one epoch."""
        self.model.train()
        total_loss = 0

        for batch_idx, (data, target) in enumerate(self.train_loader):
            data, target = data.to(self.device), target.to(self.device)

            self.optimizer.zero_grad()
            output = self.model(data)
            loss = self.criterion(output, target)
            loss.backward()
            self.optimizer.step()

            total_loss += loss.item()

        return total_loss / len(self.train_loader)

    def evaluate(self):
        """Evaluate model."""
        self.model.eval()
        correct = 0
        total = 0

        with torch.no_grad():
            for data, target in self.test_loader:
                data, target = data.to(self.device), target.to(self.device)
                output = self.model(data)
                _, predicted = torch.max(output.data, 1)
                total += target.size(0)
                correct += (predicted == target).sum().item()

        return 100 * correct / total

    def train(self, epochs):
        """Training loop."""
        for epoch in range(epochs):
            train_loss = self.train_epoch()
            accuracy = self.evaluate()
            print(f"Epoch {epoch+1}/{epochs}: Loss={train_loss:.4f}, Acc={accuracy:.2f}%")
```

#### `pyproject.toml` (PyTorch 프로젝트)
```toml
[project]
name = "ml-project"
version = "0.1.0"
description = "PyTorch Machine Learning Project"
requires-python = ">=3.9"
dependencies = [
    "torch>=2.0.0",
    "torchvision>=0.15.0",
    "numpy>=1.24.0",
    "pandas>=2.0.0",
    "matplotlib>=3.7.0",
    "tqdm>=4.65.0",
    "pyyaml>=6.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.3.0",
    "pytest-cov>=4.1.0",
    "black>=23.3.0",
    "ruff>=0.0.270",
    "mypy>=1.3.0",
]

[project.scripts]
ml-train = "ml_project.__main__:main"

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py"]
python_classes = ["Test*"]
python_functions = ["test_*"]

[tool.black]
line-length = 88
target-version = ["py39"]

[tool.ruff]
line-length = 88
select = ["E", "F", "W", "I"]
```

---

## 주요 파일 설명

### 1. `__init__.py`
패키지를 Python 모듈로 인식하게 하는 파일

```python
"""Package description."""

__version__ = "0.1.0"

# Public API 정의
from .core import MainClass
from .utils import helper_function

__all__ = ["MainClass", "helper_function"]
```

### 2. `__main__.py`
`python -m package_name`으로 실행 시 진입점

```python
"""CLI entry point."""

def main():
    print("Running package as script")

if __name__ == "__main__":
    main()
```

### 3. `conftest.py` (pytest)
테스트 fixtures 정의

```python
"""pytest configuration and fixtures."""

import pytest

@pytest.fixture
def sample_data():
    return {"key": "value"}
```

### 4. `.gitignore`
```
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
.venv/
env/
venv/

# Data
data/
*.csv
*.h5
*.pkl

# Models
checkpoints/
*.pth
*.ckpt

# Logs
logs/
*.log

# IDE
.idea/
.vscode/
*.swp

# OS
.DS_Store
```

---

## uv를 활용한 프로젝트 세팅

### 1. 새 프로젝트 생성 (src layout)

```bash
# 프로젝트 디렉토리 생성
mkdir my_ml_project
cd my_ml_project

# uv 초기화
uv init

# Python 버전 설정
uv python pin 3.11

# src layout으로 구조 생성
mkdir -p src/my_ml_project/{core,models,utils,config}
mkdir -p tests/{unit,integration}
mkdir -p {docs,examples,scripts,data,notebooks}

# __init__.py 파일 생성
touch src/my_ml_project/__init__.py
touch src/my_ml_project/core/__init__.py
touch src/my_ml_project/models/__init__.py
touch src/my_ml_project/utils/__init__.py
touch src/my_ml_project/config/__init__.py
touch tests/__init__.py
```

### 2. pyproject.toml 설정

```bash
# pyproject.toml 수정하여 src layout 설정
cat > pyproject.toml << 'EOF'
[project]
name = "my-ml-project"
version = "0.1.0"
description = "Machine Learning Project"
requires-python = ">=3.9"
dependencies = [
    "torch>=2.0.0",
    "torchvision>=0.15.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.3.0",
    "black>=23.3.0",
    "ruff>=0.0.270",
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.hatch.build.targets.wheel]
packages = ["src/my_ml_project"]
EOF
```

### 3. 패키지 설치

```bash
# 기본 의존성 설치
uv add torch torchvision

# 개발 의존성 설치
uv add --dev pytest black ruff

# editable 모드로 패키지 설치 (개발용)
uv pip install -e .
```

### 4. 테스트 실행

```bash
# pytest 실행
uv run pytest

# coverage와 함께
uv run pytest --cov=src/my_ml_project
```

### 5. 코드 포맷팅

```bash
# black으로 포맷팅
uv run black src/ tests/

# ruff로 린팅
uv run ruff check src/ tests/
```

---

## 디렉토리 역할 정리

| 디렉토리 | 역할 | gitignore |
|---------|------|-----------|
| `src/` | 소스 코드 | ❌ |
| `tests/` | 테스트 코드 | ❌ |
| `docs/` | 문서 | ❌ |
| `examples/` | 예제 코드 | ❌ |
| `scripts/` | 유틸리티 스크립트 | ❌ |
| `data/` | 데이터 파일 | ✅ |
| `notebooks/` | Jupyter notebooks | 선택 |
| `checkpoints/` | 모델 체크포인트 | ✅ |
| `logs/` | 로그 파일 | ✅ |
| `.venv/` | 가상환경 | ✅ |

---

## 프로젝트 구조 선택 가이드

### 언제 Flat Layout?
- 단일 스크립트 (< 200줄)
- 학습/실험용
- 일회성 프로젝트

### 언제 Package Layout?
- 여러 모듈 (3-10개 파일)
- 개인 도구
- 작은 라이브러리

### 언제 src Layout?
- 프로덕션 코드
- 팀 프로젝트
- 오픈소스 라이브러리
- 10개 이상 파일

---

## 추가 리소스

- [Python Packaging User Guide](https://packaging.python.org/)
- [PyPA Sample Projects](https://github.com/pypa/sampleproject)
- [uv Documentation](https://docs.astral.sh/uv/)
- [pytest Documentation](https://docs.pytest.org/)
