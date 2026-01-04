# Python 타입 힌트 완벽 가이드
## TypeScript처럼 타입 안전하게 Python 사용하기

## 목차
1. [타입 힌트 기본](#타입-힌트-기본)
2. [기본 타입](#기본-타입)
3. [컬렉션 타입](#컬렉션-타입)
4. [함수 타입](#함수-타입)
5. [클래스와 타입](#클래스와-타입)
6. [고급 타입](#고급-타입)
7. [mypy로 타입 체크하기](#mypy로-타입-체크하기)
8. [실전 예시](#실전-예시)
9. [TypeScript vs Python 비교](#typescript-vs-python-비교)

---

## 타입 힌트 기본

Python 3.5+부터 타입 힌트를 지원합니다. 타입 힌트는 **런타임에 영향을 주지 않으며**, 정적 분석 도구(mypy, pyright)가 사용합니다.

### 기본 문법

```python
# TypeScript
function greet(name: string): string {
    return `Hello, ${name}`;
}

# Python
def greet(name: str) -> str:
    return f"Hello, {name}"
```

---

## 기본 타입

### 1. 원시 타입 (Primitive Types)

```python
# 정수
age: int = 25
count: int = 0

# 실수
price: float = 19.99
temperature: float = 36.5

# 문자열
name: str = "John"
message: str = "Hello"

# 불리언
is_active: bool = True
has_permission: bool = False

# None (TypeScript의 null/undefined)
result: None = None
```

### 2. 변수 선언 (타입만 명시)

```python
# 나중에 할당할 변수
name: str
age: int

name = "Alice"
age = 30
```

---

## 컬렉션 타입

### 1. List (Array)

```python
from typing import List

# TypeScript: string[]
# Python:
names: List[str] = ["Alice", "Bob", "Charlie"]
numbers: List[int] = [1, 2, 3, 4, 5]

# 중첩 리스트
matrix: List[List[int]] = [[1, 2], [3, 4]]

# Python 3.9+ (간단한 문법)
names: list[str] = ["Alice", "Bob"]
```

### 2. Dict (Object/Record)

```python
from typing import Dict

# TypeScript: { [key: string]: number }
# Python:
scores: Dict[str, int] = {"Alice": 95, "Bob": 87}

# TypeScript: { [key: string]: any }
# Python:
from typing import Any
data: Dict[str, Any] = {"name": "Alice", "age": 30}

# Python 3.9+
scores: dict[str, int] = {"Alice": 95}
```

### 3. Tuple (고정 길이 배열)

```python
from typing import Tuple

# TypeScript: [string, number]
# Python:
person: Tuple[str, int] = ("Alice", 30)

# 가변 길이
coordinates: Tuple[float, ...] = (1.0, 2.0, 3.0)

# Python 3.9+
person: tuple[str, int] = ("Alice", 30)
```

### 4. Set

```python
from typing import Set

# 중복 없는 집합
tags: Set[str] = {"python", "typescript", "go"}

# Python 3.9+
tags: set[str] = {"python", "typescript"}
```

---

## 함수 타입

### 1. 기본 함수

```python
def add(a: int, b: int) -> int:
    """두 정수를 더합니다."""
    return a + b

def greet(name: str, greeting: str = "Hello") -> str:
    """인사말을 반환합니다."""
    return f"{greeting}, {name}"

# 반환값이 없는 함수
def log_message(message: str) -> None:
    print(message)
```

### 2. Optional 매개변수

```python
from typing import Optional

# TypeScript: (name: string, age?: number) => void
# Python:
def create_user(name: str, age: Optional[int] = None) -> None:
    if age is None:
        print(f"User: {name}")
    else:
        print(f"User: {name}, Age: {age}")

# Python 3.10+ (더 간단)
def create_user(name: str, age: int | None = None) -> None:
    pass
```

### 3. Union 타입

```python
from typing import Union

# TypeScript: string | number
# Python:
def process_id(id: Union[str, int]) -> str:
    return str(id)

# Python 3.10+
def process_id(id: str | int) -> str:
    return str(id)
```

### 4. 가변 인자

```python
from typing import List

def sum_numbers(*numbers: int) -> int:
    """가변 개수의 정수를 더합니다."""
    return sum(numbers)

def merge_dicts(**kwargs: str) -> dict[str, str]:
    """키워드 인자를 딕셔너리로 병합합니다."""
    return kwargs
```

### 5. Callable (함수 타입)

```python
from typing import Callable

# TypeScript: (a: number, b: number) => number
# Python:
def apply_operation(a: int, b: int, operation: Callable[[int, int], int]) -> int:
    return operation(a, b)

def add(x: int, y: int) -> int:
    return x + y

result = apply_operation(5, 3, add)  # 8
```

---

## 클래스와 타입

### 1. 기본 클래스

```python
from typing import List, Optional

class User:
    """사용자 클래스."""

    def __init__(self, name: str, age: int, email: Optional[str] = None) -> None:
        self.name: str = name
        self.age: int = age
        self.email: Optional[str] = email

    def greet(self) -> str:
        return f"Hello, I'm {self.name}"

    def is_adult(self) -> bool:
        return self.age >= 18

# 사용
user: User = User("Alice", 25, "alice@example.com")
```

### 2. dataclass (TypeScript interface와 유사)

```python
from dataclasses import dataclass
from typing import Optional

# TypeScript
# interface User {
#     name: string;
#     age: number;
#     email?: string;
# }

# Python
@dataclass
class User:
    name: str
    age: int
    email: Optional[str] = None

    def is_adult(self) -> bool:
        return self.age >= 18

# 사용
user = User(name="Alice", age=25)
print(user.name)  # Alice
```

### 3. TypedDict (딕셔너리 타입)

```python
from typing import TypedDict, Optional

# TypeScript
# interface UserData {
#     name: string;
#     age: number;
#     email?: string;
# }

# Python
class UserData(TypedDict):
    name: str
    age: int
    email: Optional[str]

def create_user(data: UserData) -> None:
    print(f"Creating user: {data['name']}")

# 사용
user_data: UserData = {
    "name": "Alice",
    "age": 25,
    "email": "alice@example.com"
}
create_user(user_data)
```

### 4. Protocol (인터페이스)

```python
from typing import Protocol

# TypeScript
# interface Drawable {
#     draw(): void;
# }

# Python
class Drawable(Protocol):
    """그릴 수 있는 객체의 프로토콜."""

    def draw(self) -> None:
        ...

class Circle:
    def draw(self) -> None:
        print("Drawing circle")

class Square:
    def draw(self) -> None:
        print("Drawing square")

def render(shape: Drawable) -> None:
    shape.draw()

# 둘 다 Drawable 프로토콜을 만족
render(Circle())
render(Square())
```

---

## 고급 타입

### 1. Generic (제네릭)

```python
from typing import TypeVar, Generic, List

# TypeScript: function identity<T>(value: T): T
# Python:
T = TypeVar('T')

def identity(value: T) -> T:
    return value

# 제네릭 클래스
class Stack(Generic[T]):
    def __init__(self) -> None:
        self._items: List[T] = []

    def push(self, item: T) -> None:
        self._items.append(item)

    def pop(self) -> T:
        return self._items.pop()

    def is_empty(self) -> bool:
        return len(self._items) == 0

# 사용
int_stack: Stack[int] = Stack()
int_stack.push(1)
int_stack.push(2)

str_stack: Stack[str] = Stack()
str_stack.push("hello")
```

### 2. Literal (리터럴 타입)

```python
from typing import Literal

# TypeScript: type Direction = "north" | "south" | "east" | "west"
# Python:
Direction = Literal["north", "south", "east", "west"]

def move(direction: Direction) -> None:
    print(f"Moving {direction}")

move("north")  # OK
# move("up")   # mypy error!
```

### 3. TypeAlias (타입 별칭)

```python
from typing import TypeAlias, Union

# TypeScript: type ID = string | number
# Python:
ID: TypeAlias = Union[str, int]
# Python 3.10+
ID: TypeAlias = str | int

UserId: TypeAlias = int
Username: TypeAlias = str

def get_user(user_id: UserId) -> Username:
    return f"user_{user_id}"
```

### 4. NewType (구별되는 타입)

```python
from typing import NewType

# 내부적으로는 int지만, 타입 체커는 다른 타입으로 인식
UserId = NewType('UserId', int)
ProductId = NewType('ProductId', int)

def get_user(user_id: UserId) -> str:
    return f"User {user_id}"

def get_product(product_id: ProductId) -> str:
    return f"Product {product_id}"

user_id = UserId(123)
product_id = ProductId(456)

get_user(user_id)        # OK
# get_user(product_id)   # mypy error! ProductId는 UserId가 아님
# get_user(123)          # mypy error! int는 UserId가 아님
```

### 5. Awaitable (비동기)

```python
from typing import Awaitable
import asyncio

async def fetch_data() -> str:
    await asyncio.sleep(1)
    return "data"

async def process(coro: Awaitable[str]) -> None:
    result = await coro
    print(result)

# 사용
asyncio.run(process(fetch_data()))
```

---

## mypy로 타입 체크하기

### 1. 설치

```bash
# uv로 설치
uv add --dev mypy

# 또는
uv pip install mypy
```

### 2. 기본 사용

```bash
# 단일 파일 체크
uv run mypy script.py

# 디렉토리 전체 체크
uv run mypy src/

# 엄격 모드
uv run mypy --strict src/
```

### 3. mypy 설정 (pyproject.toml)

```toml
[tool.mypy]
python_version = "3.11"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true
disallow_any_generics = true
disallow_subclassing_any = true
disallow_untyped_calls = true
disallow_incomplete_defs = true
check_untyped_defs = true
disallow_untyped_decorators = true
no_implicit_optional = true
warn_redundant_casts = true
warn_unused_ignores = true
warn_no_return = true
warn_unreachable = true
strict_equality = true

# 특정 모듈 무시
[[tool.mypy.overrides]]
module = "torch.*"
ignore_missing_imports = true
```

### 4. mypy.ini 파일 (대안)

```ini
[mypy]
python_version = 3.11
warn_return_any = True
warn_unused_configs = True
disallow_untyped_defs = True

[mypy-torch.*]
ignore_missing_imports = True
```

### 5. 인라인 타입 무시

```python
# 특정 라인만 무시
result = some_untyped_function()  # type: ignore

# 특정 에러만 무시
result = some_function()  # type: ignore[arg-type]
```

---

## 실전 예시

### 예시 1: PyTorch 모델 (타입 힌트 포함)

```python
from typing import Tuple, Optional
import torch
import torch.nn as nn
from torch import Tensor
from torch.utils.data import DataLoader

class NeuralNetwork(nn.Module):
    """신경망 모델."""

    def __init__(self, input_size: int, hidden_size: int, num_classes: int) -> None:
        super().__init__()
        self.flatten = nn.Flatten()
        self.linear_relu_stack = nn.Sequential(
            nn.Linear(input_size, hidden_size),
            nn.ReLU(),
            nn.Linear(hidden_size, hidden_size),
            nn.ReLU(),
            nn.Linear(hidden_size, num_classes)
        )

    def forward(self, x: Tensor) -> Tensor:
        """순전파."""
        x = self.flatten(x)
        logits = self.linear_relu_stack(x)
        return logits

class Trainer:
    """모델 트레이너."""

    def __init__(
        self,
        model: nn.Module,
        train_loader: DataLoader,
        test_loader: DataLoader,
        device: torch.device,
        learning_rate: float = 1e-3
    ) -> None:
        self.model = model.to(device)
        self.train_loader = train_loader
        self.test_loader = test_loader
        self.device = device

        self.criterion = nn.CrossEntropyLoss()
        self.optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)

    def train_epoch(self) -> float:
        """한 에포크 학습."""
        self.model.train()
        total_loss: float = 0.0

        for batch_idx, (data, target) in enumerate(self.train_loader):
            data, target = data.to(self.device), target.to(self.device)

            self.optimizer.zero_grad()
            output: Tensor = self.model(data)
            loss: Tensor = self.criterion(output, target)
            loss.backward()
            self.optimizer.step()

            total_loss += loss.item()

        return total_loss / len(self.train_loader)

    def evaluate(self) -> Tuple[float, float]:
        """모델 평가."""
        self.model.eval()
        test_loss: float = 0.0
        correct: int = 0
        total: int = 0

        with torch.no_grad():
            for data, target in self.test_loader:
                data, target = data.to(self.device), target.to(self.device)
                output: Tensor = self.model(data)

                test_loss += self.criterion(output, target).item()
                _, predicted = torch.max(output.data, 1)
                total += target.size(0)
                correct += (predicted == target).sum().item()

        avg_loss = test_loss / len(self.test_loader)
        accuracy = 100.0 * correct / total

        return avg_loss, accuracy

    def train(self, epochs: int) -> None:
        """전체 학습 루프."""
        for epoch in range(epochs):
            train_loss = self.train_epoch()
            test_loss, accuracy = self.evaluate()

            print(f"Epoch {epoch+1}/{epochs}:")
            print(f"  Train Loss: {train_loss:.4f}")
            print(f"  Test Loss: {test_loss:.4f}, Accuracy: {accuracy:.2f}%")
```

### 예시 2: API 클라이언트

```python
from typing import Dict, List, Optional, Any, TypeAlias
from dataclasses import dataclass
import requests

# 타입 별칭
JSON: TypeAlias = Dict[str, Any]
Headers: TypeAlias = Dict[str, str]

@dataclass
class User:
    """사용자 데이터 모델."""
    id: int
    name: str
    email: str
    is_active: bool = True

@dataclass
class APIResponse:
    """API 응답 데이터."""
    status_code: int
    data: Optional[JSON] = None
    error: Optional[str] = None

class APIClient:
    """API 클라이언트."""

    def __init__(self, base_url: str, api_key: str) -> None:
        self.base_url = base_url
        self.api_key = api_key
        self.session = requests.Session()

    def _get_headers(self) -> Headers:
        """공통 헤더 반환."""
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

    def get(self, endpoint: str, params: Optional[Dict[str, str]] = None) -> APIResponse:
        """GET 요청."""
        url = f"{self.base_url}/{endpoint}"

        try:
            response = self.session.get(
                url,
                headers=self._get_headers(),
                params=params
            )
            response.raise_for_status()

            return APIResponse(
                status_code=response.status_code,
                data=response.json()
            )
        except requests.RequestException as e:
            return APIResponse(
                status_code=500,
                error=str(e)
            )

    def get_user(self, user_id: int) -> Optional[User]:
        """사용자 정보 조회."""
        response = self.get(f"users/{user_id}")

        if response.error or not response.data:
            return None

        return User(**response.data)

    def list_users(self, limit: int = 10) -> List[User]:
        """사용자 목록 조회."""
        response = self.get("users", params={"limit": str(limit)})

        if response.error or not response.data:
            return []

        users_data: List[JSON] = response.data.get("users", [])
        return [User(**user_data) for user_data in users_data]
```

### 예시 3: 데이터 처리 파이프라인

```python
from typing import TypeVar, Callable, List, Iterator, Protocol
from dataclasses import dataclass

T = TypeVar('T')
U = TypeVar('U')

class Validator(Protocol[T]):
    """검증자 프로토콜."""

    def validate(self, value: T) -> bool:
        ...

@dataclass
class DataPoint:
    """데이터 포인트."""
    x: float
    y: float
    label: str

class Pipeline:
    """데이터 처리 파이프라인."""

    def __init__(self, data: List[DataPoint]) -> None:
        self.data = data

    def filter(self, predicate: Callable[[DataPoint], bool]) -> 'Pipeline':
        """조건에 맞는 데이터만 필터링."""
        filtered_data = [item for item in self.data if predicate(item)]
        return Pipeline(filtered_data)

    def map(self, transform: Callable[[DataPoint], DataPoint]) -> 'Pipeline':
        """데이터 변환."""
        transformed_data = [transform(item) for item in self.data]
        return Pipeline(transformed_data)

    def collect(self) -> List[DataPoint]:
        """결과 수집."""
        return self.data

    def __iter__(self) -> Iterator[DataPoint]:
        """이터레이터."""
        return iter(self.data)

# 사용
data = [
    DataPoint(1.0, 2.0, "A"),
    DataPoint(3.0, 4.0, "B"),
    DataPoint(5.0, 6.0, "A"),
]

result = (Pipeline(data)
    .filter(lambda p: p.label == "A")
    .map(lambda p: DataPoint(p.x * 2, p.y * 2, p.label))
    .collect())
```

---

## TypeScript vs Python 비교

### 1. 기본 타입

| TypeScript | Python |
|-----------|--------|
| `string` | `str` |
| `number` | `int`, `float` |
| `boolean` | `bool` |
| `null`, `undefined` | `None` |
| `any` | `Any` |
| `void` | `None` |
| `never` | `NoReturn` |

### 2. 컬렉션

| TypeScript | Python |
|-----------|--------|
| `string[]` | `List[str]` or `list[str]` |
| `Array<string>` | `List[str]` |
| `[string, number]` | `Tuple[str, int]` |
| `{ [key: string]: number }` | `Dict[str, int]` |
| `Set<string>` | `Set[str]` |

### 3. 유니온/옵셔널

| TypeScript | Python |
|-----------|--------|
| `string \| number` | `Union[str, int]` or `str \| int` |
| `string \| null` | `Optional[str]` or `str \| None` |
| `type ID = string \| number` | `ID = Union[str, int]` |

### 4. 함수

```typescript
// TypeScript
function add(a: number, b: number): number {
    return a + b;
}

const multiply = (a: number, b: number): number => a * b;

type Operation = (a: number, b: number) => number;
```

```python
# Python
def add(a: int, b: int) -> int:
    return a + b

multiply: Callable[[int, int], int] = lambda a, b: a * b

Operation = Callable[[int, int], int]
```

### 5. 인터페이스/클래스

```typescript
// TypeScript
interface User {
    name: string;
    age: number;
    email?: string;
}

class UserImpl implements User {
    constructor(
        public name: string,
        public age: number,
        public email?: string
    ) {}
}
```

```python
# Python (TypedDict)
class User(TypedDict):
    name: str
    age: int
    email: Optional[str]

# Python (dataclass)
@dataclass
class UserImpl:
    name: str
    age: int
    email: Optional[str] = None
```

### 6. 제네릭

```typescript
// TypeScript
function identity<T>(value: T): T {
    return value;
}

class Box<T> {
    constructor(private value: T) {}
    getValue(): T { return this.value; }
}
```

```python
# Python
T = TypeVar('T')

def identity(value: T) -> T:
    return value

class Box(Generic[T]):
    def __init__(self, value: T) -> None:
        self._value = value

    def get_value(self) -> T:
        return self._value
```

---

## 추가 도구

### 1. Pydantic (런타임 검증)

```bash
uv add pydantic
```

```python
from pydantic import BaseModel, EmailStr, validator

class User(BaseModel):
    name: str
    age: int
    email: EmailStr

    @validator('age')
    def age_must_be_positive(cls, v):
        if v < 0:
            raise ValueError('Age must be positive')
        return v

# 런타임에 검증됨
user = User(name="Alice", age=25, email="alice@example.com")
# user = User(name="Alice", age=-5, email="invalid")  # 에러!
```

### 2. pyright (빠른 타입 체커)

```bash
uv add --dev pyright
```

```bash
uv run pyright src/
```

### 3. ruff (린터에 타입 체크 포함)

```bash
uv add --dev ruff
```

```bash
uv run ruff check --select ANN src/  # 타입 annotation 체크
```

---

## 프로젝트 설정 예시 (pyproject.toml)

```toml
[project]
name = "typed-project"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
    "torch>=2.0.0",
    "pydantic>=2.0.0",
]

[project.optional-dependencies]
dev = [
    "mypy>=1.5.0",
    "pyright>=1.1.320",
    "ruff>=0.0.290",
    "pytest>=7.4.0",
]

[tool.mypy]
python_version = "3.11"
strict = true
warn_return_any = true
disallow_untyped_defs = true

[[tool.mypy.overrides]]
module = "torch.*"
ignore_missing_imports = true

[tool.pyright]
pythonVersion = "3.11"
typeCheckingMode = "strict"

[tool.ruff]
select = ["E", "F", "I", "ANN"]
line-length = 88
target-version = "py311"

[tool.ruff.per-file-ignores]
"tests/*" = ["ANN"]  # 테스트는 타입 체크 완화
```

---

## 체크리스트

### ✅ 기본
- [ ] 모든 함수에 타입 힌트 추가
- [ ] 반환 타입 명시 (`-> ReturnType`)
- [ ] 변수에 타입 명시 (복잡한 경우)

### ✅ 중급
- [ ] `Optional`, `Union` 사용
- [ ] 컬렉션 타입 제네릭 사용 (`List[str]`)
- [ ] `TypedDict` 또는 `dataclass` 사용

### ✅ 고급
- [ ] `Protocol` 사용 (인터페이스)
- [ ] `Generic` 사용 (제네릭 클래스)
- [ ] `Literal`, `TypeAlias` 활용
- [ ] mypy strict 모드 통과

---

## 추가 리소스

- [Python Typing 공식 문서](https://docs.python.org/3/library/typing.html)
- [mypy Documentation](https://mypy.readthedocs.io/)
- [PEP 484 - Type Hints](https://peps.python.org/pep-0484/)
- [Real Python - Type Checking](https://realpython.com/python-type-checking/)
