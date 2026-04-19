# AGENTS.md

Guide for agentic coding agents working in this repository.

## Project Overview

Agentic DevOps is a monorepo with two main components:
- **Python backend** (`agentic_devops/`) — AI-powered DevOps platform using OpenAI Agents SDK, boto3 (AWS), PyGithub, and pydantic
- **React/TypeScript frontend** (`ui/`) — Retro terminal-style UI using Vite, React, shadcn/ui, and TailwindCSS

## Build / Lint / Test Commands

### Python Backend

```bash
# From repo root, enter the backend directory
cd agentic_devops

# Install dependencies
pip install -e .

# Run all tests
pytest

# Run a single test file
pytest tests/aws/test_ec2.py

# Run a single test function
pytest tests/aws/test_ec2.py::test_list_instances_empty

# Run tests by marker
pytest -m unit
pytest -m aws
pytest -m integration
pytest -m github

# Type check
mypy src/
```

### Frontend (ui/)

```bash
# From repo root, enter the UI directory
cd ui

# Install dependencies
npm install   # or bun install

# Dev server (runs on port 8080)
npm run dev

# Build for production
npm run build

# Build for development
npm run build:dev

# Lint
npm run lint

# Preview production build
npm run preview
```

**No frontend tests are currently configured.**

## Code Style Guidelines

### Python Backend

**Imports:**
- Standard library imports first, then third-party, then local (PEP 257 order)
- Use relative imports within the package: `from ..core.config import get_config`
- Use absolute imports for external packages: `import boto3`, `from pydantic import BaseModel`
- Group imports with blank lines between stdlib, third-party, and local

**Formatting:**
- Follow PEP 8 style
- Use 4-space indentation
- Max line length ~100 characters
- Use double quotes for strings in most cases
- Trailing commas in multi-line collections

**Types:**
- Use Python type hints on all function signatures
- Use `Optional[T]` for optional parameters, not `T | None` (Python 3.8+ compat)
- Use `Dict[str, Any]`, `List[str]`, etc. from `typing` module
- Pydantic models for data structures (e.g., `DevOpsContext`, request/response models)

**Naming:**
- Classes: `PascalCase` (e.g., `EC2Service`, `DevOpsContext`, `ResourceNotFoundError`)
- Functions/methods: `snake_case` (e.g., `list_instances`, `get_config`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `DEFAULT_API_URL`, `SERVICE_NAME`)
- Private methods: `_leading_underscore` (e.g., `_verify_access`, `_make_request`)

**Error Handling:**
- Use custom exception hierarchy: `AWSServiceError` -> `ResourceNotFoundError`, `PermissionDeniedError`, `ValidationError`, `RateLimitError`, `ResourceLimitError`
- GitHub errors: `GitHubError` -> `ResourceNotFoundError`, `AuthenticationError`, `ValidationError`, `RateLimitError`
- Use the `@aws_operation` decorator on AWS service methods for automatic error handling
- Include `suggestion` fields on exceptions for user guidance
- Log with `logging.getLogger(__name__)`, not `print()`

**Class Pattern:**
- Service classes inherit from `AWSBaseService` (for AWS) or standalone (for GitHub)
- Set `SERVICE_NAME` class attribute on AWS service subclasses
- Use `__init__` with optional credentials, region, and profile parameters
- Call `super().__init__()` after setting instance attributes

**Testing:**
- Test files in `tests/` mirror `src/` structure
- Use `pytest` with `pytest-mock` and `moto` for AWS mocking
- Use `@mock_aws` decorator from moto for AWS service tests
- Fixtures for common setup (e.g., `aws_credentials`, `ec2_service`)
- Set mock AWS env vars at module level: `AWS_ACCESS_KEY_ID=testing`, etc.
- Test class names: `TestClassName`
- Test function names: `test_descriptive_name`
- Use `skip_verification=True` when constructing test service instances

### Frontend (ui/)

**Imports:**
- Use `@/` path alias for src imports: `import { Button } from "@/components/ui/button"`
- React imports first, then third-party, then local components
- Group and separate import categories with blank lines

**Formatting:**
- TypeScript with strict mode (but `noImplicitAny: false`, `strictNullChecks: false`)
- Single quotes for JSX string attributes
- Use `const` by default, `function` for React components
- Self-closing tags for components without children

**Types:**
- TypeScript `.tsx` for components, `.ts` for utilities
- Prefer interfaces for component props
- Use shadcn/ui component types as-is

**Naming:**
- Components: `PascalCase.tsx` (e.g., `CommandPrompt.tsx`, `InstanceList.tsx`)
- Hooks: `useCamelCase` in `hooks/` directory
- Utils: `camelCase.ts` in `utils/` directory
- CSS classes: Tailwind utility classes; custom theme uses `cyber` prefix (e.g., `cyber-neon`)

**Styling:**
- TailwindCSS with shadcn/ui design system
- Custom theme colors: `cyber-black`, `cyber-darkgray`, `cyber-neon`, `cyber-muted`, `cyber-dim`
- Custom fonts: `font-mono` (JetBrains Mono), `font-micro` (VT323)
- Custom animations: `animate-pulse-neon`, `animate-float-in`, `animate-glow`
- Use `cn()` utility from `@/lib/utils` for conditional class merging

**Components:**
- shadcn/ui components live in `src/components/ui/` — do not manually edit these
- Custom app components in `src/components/` (e.g., `CommandPrompt.tsx`)
- Pages in `src/pages/`
- Contexts in `src/contexts/`
- Services in `src/services/`

## Repository Structure

```
agentic_devops/
  src/
    aws/          # AWS service modules (EC2, etc.)
    github/       # GitHub service module
    core/         # Shared: config, context, credentials, guardrails
    __init__.py   # Public API exports
    cli.py        # CLI entry point
  tests/
    aws/          # AWS service tests
    github/       # GitHub service tests
    core/         # Core module tests
    custom/       # Custom/agent tests
  pytest.ini
  setup.py
  requirements.txt

ui/
  src/
    components/   # App components + shadcn/ui components
    contexts/     # React context providers
    hooks/        # Custom React hooks
    pages/        # Page-level components
    services/     # API service layer
    utils/        # Utility functions
  public/
  package.json
  vite.config.ts
  tailwind.config.ts
  tsconfig.json
```

## Key Conventions

- **Backend:** All public API is exported through `agentic_devops/src/__init__.py`
- **Backend:** Services use dependency injection for credentials; default to credential manager
- **Backend:** The `DevOpsContext` pydantic model carries user/operation context
- **Frontend:** `DevOpsContext` React context manages app state
- **Both:** Never hardcode secrets; use environment variables or credential managers
- **Git:** Use descriptive commit messages; branch naming: `feature/`, `fix/`, `docs/`