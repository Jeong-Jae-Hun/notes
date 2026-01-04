# VSCode 개발 완벽 가이드

VSCode를 활용한 효율적인 개발 환경 구축 및 생산성 향상 가이드.

## 필수 단축키

### 기본 네비게이션

| 단축키 | 기능 | 용도 |
|--------|------|------|
| `Cmd + P` | Quick Open | 파일 빠른 열기 |
| `Cmd + Shift + P` | Command Palette | 모든 명령 실행 |
| `Cmd + Shift + F` | 전체 검색 | 프로젝트 전체에서 텍스트 검색 |
| `Cmd + Shift + E` | 탐색기 포커스 | 파일 탐색기로 이동 |
| `Cmd + B` | 사이드바 토글 | 사이드바 열기/닫기 |
| `Cmd + J` | 터미널 토글 | 통합 터미널 열기/닫기 |
| `Cmd + \` | 편집기 분할 | 화면 분할 |
| `Cmd + 1/2/3` | 편집기 그룹 포커스 | 분할된 편집기 간 이동 |
| `Ctrl + Tab` | 탭 전환 | 열린 파일 간 전환 |
| `Cmd + W` | 탭 닫기 | 현재 파일 닫기 |

### 코드 편집

| 단축키 | 기능 | 용도 |
|--------|------|------|
| `Cmd + D` | 다음 일치 항목 선택 | 같은 단어 멀티 커서 |
| `Cmd + Shift + L` | 모든 일치 항목 선택 | 같은 단어 전체 선택 |
| `Option + Click` | 멀티 커서 | 여러 위치 동시 편집 |
| `Option + Shift + 드래그` | 박스 선택 | 사각형 영역 선택 |
| `Cmd + Shift + K` | 줄 삭제 | 현재 줄 삭제 |
| `Option + Up/Down` | 줄 이동 | 현재 줄 위/아래로 이동 |
| `Option + Shift + Up/Down` | 줄 복사 | 현재 줄 위/아래로 복사 |
| `Cmd + /` | 주석 토글 | 줄 주석 처리 |
| `Cmd + Shift + /` | 블록 주석 | 블록 주석 처리 |
| `Cmd + [/]` | 들여쓰기 | 선택 영역 들여쓰기/내어쓰기 |
| `Cmd + Enter` | 아래에 줄 삽입 | 커서 위치 상관없이 다음 줄로 |
| `Cmd + Shift + Enter` | 위에 줄 삽입 | 커서 위치 상관없이 이전 줄로 |

### 코드 인텔리전스

| 단축키 | 기능 | 용도 |
|--------|------|------|
| `F12` | 정의로 이동 | 함수/변수 정의 위치 |
| `Cmd + Click` | 정의로 이동 | 마우스로 정의 이동 |
| `Option + F12` | 정의 미리보기 | 인라인으로 정의 확인 |
| `Shift + F12` | 참조 찾기 | 모든 참조 위치 |
| `F2` | 이름 변경 | 심볼 리팩토링 |
| `Cmd + .` | Quick Fix | 자동 수정 제안 |
| `Ctrl + Space` | IntelliSense | 자동완성 트리거 |
| `Cmd + Shift + Space` | 파라미터 힌트 | 함수 파라미터 정보 |
| `Cmd + K Cmd + I` | 호버 정보 | 타입/문서 정보 표시 |

### 검색 및 대체

| 단축키 | 기능 | 용도 |
|--------|------|------|
| `Cmd + F` | 찾기 | 현재 파일에서 검색 |
| `Cmd + H` | 찾기 및 바꾸기 | 현재 파일에서 대체 |
| `Cmd + Shift + F` | 전체 검색 | 프로젝트 전체 검색 |
| `Cmd + Shift + H` | 전체 대체 | 프로젝트 전체 대체 |
| `Cmd + G` | 다음 찾기 | 다음 검색 결과 |
| `Cmd + Shift + G` | 이전 찾기 | 이전 검색 결과 |
| `Cmd + Option + F` | 정규식 토글 | 정규식 검색 활성화 |

### 터미널

| 단축키 | 기능 | 용도 |
|--------|------|------|
| `Cmd + J` | 터미널 토글 | 터미널 패널 열기/닫기 |
| `Ctrl + Shift + \`` | 새 터미널 | 새 터미널 인스턴스 |
| `Cmd + \` (터미널) | 터미널 분할 | 터미널 화면 분할 |
| `Cmd + Option + Up/Down` | 터미널 간 이동 | 분할된 터미널 전환 |

### Git 통합

| 단축키 | 기능 | 용도 |
|--------|------|------|
| `Cmd + Shift + G` | Git 패널 | 소스 컨트롤 열기 |
| `Cmd + Enter` (Git 패널) | 커밋 | 스테이징된 변경사항 커밋 |

---

## settings.json 필수 설정

`Cmd + Shift + P` → "Preferences: Open User Settings (JSON)"

```json
{
  // 에디터 기본 설정
  "editor.fontSize": 14,
  "editor.fontFamily": "'JetBrains Mono', 'Fira Code', Menlo, monospace",
  "editor.fontLigatures": true,
  "editor.lineHeight": 1.6,
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.wordWrap": "on",
  "editor.minimap.enabled": false,
  "editor.renderWhitespace": "boundary",
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": "active",
  "editor.linkedEditing": true,
  "editor.stickyScroll.enabled": true,
  "editor.cursorBlinking": "smooth",
  "editor.cursorSmoothCaretAnimation": "on",
  "editor.smoothScrolling": true,

  // 저장 시 자동 포맷
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },

  // 파일 설정
  "files.autoSave": "onFocusChange",
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "files.trimFinalNewlines": true,
  "files.exclude": {
    "**/node_modules": true,
    "**/.git": true,
    "**/.DS_Store": true,
    "**/dist": true,
    "**/.next": true,
    "**/coverage": true
  },

  // 탐색기 설정
  "explorer.confirmDragAndDrop": false,
  "explorer.confirmDelete": false,
  "explorer.compactFolders": false,

  // 터미널 설정
  "terminal.integrated.fontSize": 13,
  "terminal.integrated.fontFamily": "'JetBrains Mono', monospace",
  "terminal.integrated.defaultProfile.osx": "zsh",
  "terminal.integrated.cursorStyle": "line",
  "terminal.integrated.cursorBlinking": true,

  // 검색 설정
  "search.exclude": {
    "**/node_modules": true,
    "**/bower_components": true,
    "**/*.code-search": true,
    "**/dist": true,
    "**/coverage": true,
    "**/.terraform": true
  },

  // Breadcrumbs
  "breadcrumbs.enabled": true,

  // Workbench
  "workbench.editor.enablePreview": false,
  "workbench.startupEditor": "none",
  "workbench.tree.indent": 16,
  "workbench.iconTheme": "material-icon-theme",
  "workbench.colorTheme": "One Dark Pro",

  // Git 설정
  "git.autofetch": true,
  "git.confirmSync": false,
  "git.enableSmartCommit": true
}
```

---

## 언어별 설정

### TypeScript / JavaScript

```json
{
  // TypeScript 설정
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.tabSize": 2
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },

  // TypeScript 언어 서버
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "typescript.inlayHints.parameterNames.enabled": "all",
  "typescript.inlayHints.functionLikeReturnTypes.enabled": true,

  // JavaScript
  "javascript.updateImportsOnFileMove.enabled": "always"
}
```

#### 추천 확장

- **ESLint** (`dbaeumer.vscode-eslint`) - 코드 린팅
- **Prettier** (`esbenp.prettier-vscode`) - 코드 포맷팅
- **TypeScript Importer** - 자동 import
- **Pretty TypeScript Errors** - 에러 메시지 가독성 향상
- **Error Lens** - 인라인 에러 표시

### Docker

```json
{
  "[dockerfile]": {
    "editor.defaultFormatter": "ms-azuretools.vscode-docker",
    "editor.tabSize": 4
  },
  "[dockercompose]": {
    "editor.defaultFormatter": "ms-azuretools.vscode-docker"
  },

  "docker.containers.sortBy": "Label",
  "docker.images.sortBy": "Label"
}
```

#### 추천 확장

- **Docker** (`ms-azuretools.vscode-docker`) - Docker 지원
- **Docker Compose** - compose 파일 지원
- **Hadolint** - Dockerfile 린터

### Lua

```json
{
  "[lua]": {
    "editor.defaultFormatter": "sumneko.lua",
    "editor.tabSize": 2
  },

  "Lua.diagnostics.globals": [
    "vim",
    "use",
    "require"
  ],
  "Lua.workspace.library": [],
  "Lua.telemetry.enable": false
}
```

#### 추천 확장

- **Lua** (`sumneko.lua`) - Lua 언어 서버
- **vscode-lua** - 추가 Lua 지원
- **Neovim용**: `"Lua.workspace.library": ["${3rd}/luv/library"]`

### Terraform / HCL

```json
{
  "[terraform]": {
    "editor.defaultFormatter": "hashicorp.terraform",
    "editor.formatOnSave": true,
    "editor.tabSize": 2
  },
  "[terraform-vars]": {
    "editor.defaultFormatter": "hashicorp.terraform"
  },

  "terraform.languageServer.enable": true,
  "terraform.codelens.referenceCount": true
}
```

#### 추천 확장

- **HashiCorp Terraform** (`hashicorp.terraform`) - 공식 Terraform 지원
- **Terraform Autocomplete** - 자동완성 강화
- **Terraform doc snippets** - 문서 스니펫

### 설정 파일 (JSON, YAML, TOML)

```json
{
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.tabSize": 2
  },
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[yaml]": {
    "editor.defaultFormatter": "redhat.vscode-yaml",
    "editor.tabSize": 2,
    "editor.autoIndent": "full"
  },
  "[toml]": {
    "editor.defaultFormatter": "tamasfe.even-better-toml"
  },

  // YAML 스키마 연결
  "yaml.schemas": {
    "https://raw.githubusercontent.com/compose-spec/compose-spec/master/schema/compose-spec.json": [
      "docker-compose*.yml",
      "docker-compose*.yaml"
    ],
    "https://json.schemastore.org/github-workflow.json": ".github/workflows/*.yml"
  }
}
```

#### 추천 확장

- **YAML** (`redhat.vscode-yaml`) - YAML 지원
- **Even Better TOML** (`tamasfe.even-better-toml`) - TOML 지원
- **JSON5** - JSON5 형식 지원

### Go

```json
{
  "[go]": {
    "editor.defaultFormatter": "golang.go",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.organizeImports": "explicit"
    },
    "editor.tabSize": 4,
    "editor.insertSpaces": false
  },
  "[go.mod]": {
    "editor.defaultFormatter": "golang.go"
  },

  "go.useLanguageServer": true,
  "go.lintTool": "golangci-lint",
  "go.lintFlags": ["--fast"],
  "gopls": {
    "ui.semanticTokens": true,
    "ui.completion.usePlaceholders": true
  }
}
```

#### 추천 확장

- **Go** (`golang.go`) - 공식 Go 지원
- **Go Test Explorer** - 테스트 탐색기

### Swift (iOS/macOS)

```json
{
  "[swift]": {
    "editor.defaultFormatter": "vknabel.vscode-apple-swift-format",
    "editor.tabSize": 4
  },

  "swift.path": "/usr/bin/swift",
  "lldb.library": "/Applications/Xcode.app/Contents/SharedFrameworks/LLDB.framework/Versions/A/LLDB",
  "lldb.launch.expressions": "native"
}
```

#### 추천 확장

- **Swift** (`sswg.swift-lang`) - Swift 언어 서버
- **Apple Swift Format** - 코드 포맷팅
- **CodeLLDB** - 디버깅

### Kotlin (Android)

```json
{
  "[kotlin]": {
    "editor.defaultFormatter": "mathiasfrohlich.Kotlin",
    "editor.tabSize": 4
  },

  "kotlin.languageServer.enabled": true,
  "kotlin.debugAdapter.enabled": true
}
```

#### 추천 확장

- **Kotlin Language** (`mathiasfrohlich.Kotlin`)
- **Kotlin** (`fwcd.kotlin`) - 언어 서버

---

## 필수 확장 목록

### 범용 (필수)

| 확장 | ID | 용도 |
|------|-----|------|
| Prettier | `esbenp.prettier-vscode` | 코드 포맷팅 |
| ESLint | `dbaeumer.vscode-eslint` | JavaScript/TypeScript 린팅 |
| GitLens | `eamodio.gitlens` | Git 기능 강화 |
| Error Lens | `usernamehw.errorlens` | 인라인 에러 표시 |
| Path Intellisense | `christian-kohler.path-intellisense` | 파일 경로 자동완성 |
| Auto Rename Tag | `formulahendry.auto-rename-tag` | HTML 태그 자동 변경 |
| Material Icon Theme | `PKief.material-icon-theme` | 파일 아이콘 |
| One Dark Pro | `zhuangtongfa.material-theme` | 테마 |

### 생산성

| 확장 | ID | 용도 |
|------|-----|------|
| TODO Highlight | `wayou.vscode-todo-highlight` | TODO 강조 표시 |
| Code Spell Checker | `streetsidesoftware.code-spell-checker` | 오타 검사 |
| Better Comments | `aaron-bond.better-comments` | 주석 색상 구분 |
| Bracket Select | `chunsen.bracket-select` | 괄호 기반 선택 |
| Multiple cursor case preserve | `cardinal90.multi-cursor-case-preserve` | 대소문자 유지 다중 편집 |
| Partial Diff | `ryu1kn.partial-diff` | 선택 영역 비교 |
| Project Manager | `alefragnani.project-manager` | 프로젝트 빠른 전환 |

### Remote Development

| 확장 | ID | 용도 |
|------|-----|------|
| Remote - SSH | `ms-vscode-remote.remote-ssh` | SSH 원격 개발 |
| Remote - Containers | `ms-vscode-remote.remote-containers` | 컨테이너 내 개발 |
| Dev Containers | `ms-vscode-remote.remote-containers` | devcontainer 지원 |
| WSL | `ms-vscode-remote.remote-wsl` | WSL 지원 (Windows) |

### AI 보조

| 확장 | ID | 용도 |
|------|-----|------|
| GitHub Copilot | `GitHub.copilot` | AI 코드 제안 |
| GitHub Copilot Chat | `GitHub.copilot-chat` | AI 채팅 |

---

## 유용한 팁

### 1. Workspace 설정

프로젝트별 설정은 `.vscode/settings.json`에 저장:

```json
{
  "editor.tabSize": 4,
  "files.exclude": {
    "**/__pycache__": true
  }
}
```

### 2. 스니펫 만들기

`Cmd + Shift + P` → "Snippets: Configure User Snippets"

```json
// typescript.json
{
  "Console Log": {
    "prefix": "clg",
    "body": ["console.log('$1:', $1);"],
    "description": "Console log with label"
  },
  "React Functional Component": {
    "prefix": "rfc",
    "body": [
      "interface ${1:Component}Props {",
      "  $2",
      "}",
      "",
      "export const ${1:Component} = ({ $3 }: ${1:Component}Props) => {",
      "  return (",
      "    <div>",
      "      $0",
      "    </div>",
      "  );",
      "};"
    ]
  }
}
```

### 3. Task 자동화

`.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Build",
      "type": "npm",
      "script": "build",
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "problemMatcher": ["$tsc"]
    },
    {
      "label": "Test",
      "type": "npm",
      "script": "test",
      "group": {
        "kind": "test",
        "isDefault": true
      }
    },
    {
      "label": "Docker Build",
      "type": "shell",
      "command": "docker build -t ${input:imageName} .",
      "problemMatcher": []
    }
  ],
  "inputs": [
    {
      "id": "imageName",
      "type": "promptString",
      "description": "Docker image name"
    }
  ]
}
```

실행: `Cmd + Shift + B` (빌드) 또는 `Cmd + Shift + P` → "Tasks: Run Task"

### 4. 디버깅 설정

`.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Node.js",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/src/index.ts",
      "preLaunchTask": "npm: build",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"]
    },
    {
      "name": "Go",
      "type": "go",
      "request": "launch",
      "mode": "auto",
      "program": "${workspaceFolder}/main.go"
    },
    {
      "name": "Chrome",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

### 5. 키보드 단축키 커스터마이징

`Cmd + K Cmd + S`로 키보드 단축키 설정 열기.

`keybindings.json` 직접 편집:

```json
[
  {
    "key": "cmd+shift+d",
    "command": "editor.action.copyLinesDownAction"
  },
  {
    "key": "ctrl+`",
    "command": "workbench.action.terminal.toggleTerminal"
  },
  {
    "key": "cmd+k cmd+d",
    "command": "editor.action.formatDocument"
  }
]
```

### 6. 멀티 루트 워크스페이스

여러 폴더를 하나의 워크스페이스로:

```json
// myproject.code-workspace
{
  "folders": [
    { "path": "./frontend", "name": "Frontend" },
    { "path": "./backend", "name": "Backend" },
    { "path": "./shared", "name": "Shared" }
  ],
  "settings": {
    "editor.tabSize": 2
  }
}
```

### 7. 파일 연관 설정

확장자 없는 파일이나 특수 파일 언어 연결:

```json
{
  "files.associations": {
    "*.conf": "nginx",
    "*.env.*": "dotenv",
    "Dockerfile.*": "dockerfile",
    ".prettierrc": "json",
    "*.tfvars": "terraform"
  }
}
```

---

## 성능 최적화

### 대규모 프로젝트 설정

```json
{
  "files.watcherExclude": {
    "**/.git/objects/**": true,
    "**/.git/subtree-cache/**": true,
    "**/node_modules/**": true,
    "**/dist/**": true,
    "**/.terraform/**": true
  },
  "search.followSymlinks": false,
  "typescript.disableAutomaticTypeAcquisition": true,
  "git.autorefresh": false
}
```

### 메모리 사용량 줄이기

```json
{
  "editor.minimap.enabled": false,
  "editor.renderWhitespace": "none",
  "editor.occurrencesHighlight": "off",
  "extensions.autoUpdate": false
}
```

---

## 참고

- [VSCode 공식 문서](https://code.visualstudio.com/docs)
- [VSCode 키보드 단축키 PDF (macOS)](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-macos.pdf)
- [Awesome VSCode](https://github.com/viatsko/awesome-vscode)
