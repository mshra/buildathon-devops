# AGENTS.md

Guide for agentic coding agents working in this repository.

## Project Overview

Agentic DevOps is a monorepo with:
- **Python backend** (`agentic_devops/`) — AI-powered Docker deployment platform using OpenAI Agents SDK, docker-py, PyGithub, and pydantic
- **No frontend** — Backend exposes FastAPI HTTP endpoints

## Build / Lint / Test Commands

### Python Backend

```bash
# From repo root, enter the backend directory
cd agentic_devops

# Install dependencies
pip install -e .

# Run all tests
pytest

# Run tests by marker
pytest -m unit
pytest -m integration

# Type check
mypy src/

# Run CLI
python -m devops_agent.docker deploy --repo owner/repo
python -m devops_agent serve --port 8000
```

## Code Style Guidelines

### Python Backend

**Imports:**
- Standard library imports first, then third-party, then local (PEP 257 order)
- Use relative imports within the package: `from ..core.config import get_config`
- Use absolute imports for external packages: `import docker`, `from pydantic import BaseModel`

**Formatting:**
- Follow PEP 8 style
- Use 4-space indentation
- Max line length ~100 characters

**Types:**
- Use Python type hints on all function signatures
- Use `Optional[T]` for optional parameters
- Pydantic models for data structures

**Naming:**
- Classes: `PascalCase` (e.g., `DockerService`, `Deployment`)
- Functions/methods: `snake_case` (e.g., `deploy_from_github`, `get_config`)

**Error Handling:**
- Custom exception hierarchy: `DockerServiceError` -> `ContainerNotFoundError`, `ImageBuildError`, `DockerDaemonError`
- Use the `@docker_operation` decorator for automatic error handling
- Include `suggestion` fields on exceptions

**Class Pattern:**
- Service classes: `DockerService`, `DockerDeployService`, `GitHubService`
- Use dependency injection for credentials

## Repository Structure

```
agentic_devops/
  src/
    docker_svc/      # Docker service module
    github/         # GitHub service module
    core/           # Shared: config, context, credentials, guardrails
    api/            # FastAPI HTTP layer
    __init__.py     # Public API exports
    cli.py          # CLI entry point
  tests/
    docker_svc/     # Docker service tests (to be added)
    github/        # GitHub service tests
    core/           # Core module tests
  pytest.ini
  setup.py
  requirements.txt
```

## Key Conventions

- **Backend:** All public API is exported through `agentic_devops/src/__init__.py`
- **Backend:** Services use dependency injection for credentials; default to credential manager
- **Backend:** The `DevOpsContext` pydantic model carries user/operation context
- **Docker:** Uses docker-py SDK for container operations
- **API:** FastAPI serves HTTP endpoints on port 8000 by default
- **Never hardcode secrets:** Use environment variables or credential managers

## Git Branch Naming

- `feature/` — new features
- `fix/` — bug fixes
- `docs/` — documentation