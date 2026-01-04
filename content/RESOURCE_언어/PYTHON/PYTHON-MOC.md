# Python MOC

> Python 학습 자료 맵

## Guides

- [[LANG-PYTHON-타입-힌트-완벽-가이드|Type Hints Guide]] - TypeScript처럼 타입 안전하게
- [[LANG-PYTHON-프로젝트-구조-가이드|Project Structure]] - 프로젝트 구조 가이드

## PyTorch

- [[AI-PYTORCH-기초-완벽-가이드|PyTorch Basics]] - FashionMNIST로 배우는 딥러닝
- [[AI-DEEPLEARNING-MOC|Deep Learning MOC]] - 딥러닝 핵심 개념

## Quick Reference

### Type Hints
```python
def greet(name: str) -> str:
    return f"Hello, {name}"

names: list[str] = ["Alice", "Bob"]  # 3.9+
scores: dict[str, int] = {"Alice": 95}
```

### Common Patterns
```python
from typing import Optional, Union, Callable

def find(id: int) -> Optional[User]: ...
def process(data: Union[str, bytes]) -> None: ...
handler: Callable[[int], str] = lambda x: str(x)
```

---

#type/moc #topic/python
