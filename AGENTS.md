# AGENTS.md

Guide for agentic coding agents working in this repository.

## Project Overview

Agentic DevOps is a hackathon-scoped DevOps agent that runs locally and
deploys a target repository as a Docker Compose stack on the local Docker
daemon.

- **Python backend** (`agentic_devops/`) — AI-powered Docker deployment platform using OpenAI Agents SDK, docker-py (optional), PyGithub (optional), and pydantic
- **No frontend** — Backend exposes FastAPI HTTP endpoints

The primary (MVP) deployment flow is local-only: given a local path to a
repo that contains a `Dockerfile`, a compose file, and optionally an
`AGENTS.md`, the agent runs `docker compose up -d` on the local Docker
daemon. No auth, no cloud, no remote hosts, no registry push.

## Target Repository Contract

When the agent is asked to deploy a repo, that repo is expected to contain:

| File | Required | Notes |
| ---- | -------- | ----- |
| `Dockerfile` | Yes (or referenced from compose `build:`) | Image definition |
| `compose.yml` or `docker-compose.yml` | Yes | Compose v2 file the CLI understands |
| `AGENTS.md` | Optional | Free-form advisory notes; a short excerpt is surfaced back in the deploy result. No schema is enforced. |

The agent operates on a **local directory path** passed by the caller. It
does not clone from GitHub in the MVP flow.

## Build / Lint / Test Commands

### Python Backend

```bash
# From repo root, enter the backend directory
cd agentic_devops

# Install dependencies (full)
pip install -e .

# Minimum for the local-compose MVP flow
pip install pydantic pytest pytest-mock pytest-asyncio

# Run all tests
pytest

# Run tests by marker
pytest -m unit
pytest -m docker            # compose/local-deploy unit tests (mocked)
pytest -m integration

# Type check
mypy src/

# CLI — local compose flow (hackathon MVP)
python -m src.cli docker compose up    --path ./path/to/repo
python -m src.cli docker compose status --path ./path/to/repo
python -m src.cli docker compose logs   --path ./path/to/repo --tail 100
python -m src.cli docker compose down   --path ./path/to/repo

# CLI — legacy GitHub-clone + single-container flow (requires docker-py + PyGithub)
python -m src.cli docker deploy --repo owner/repo
python -m src.cli serve --port 8000
```

Actually running a deploy (not just unit tests) needs a local Docker daemon
plus the `docker compose` CLI on PATH. Unit tests mock `subprocess.run` so
they run anywhere.

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
- Classes: `PascalCase` (e.g., `DockerService`, `ComposeDeployService`, `Deployment`)
- Functions/methods: `snake_case` (e.g., `deploy_local_project`, `get_config`)

**Error Handling:**
- Custom exception hierarchy: `DockerServiceError` -> `ContainerNotFoundError`, `ImageBuildError`, `DockerDaemonError`, `ComposeDeployError`, ...
- Use the `@docker_operation` decorator for automatic error handling (legacy flow)
- Include `suggestion` fields on exceptions

**Class Pattern:**
- Legacy service classes: `DockerService`, `DockerDeployService`, `GitHubService` (depend on docker-py / PyGithub)
- Local-compose MVP service: `ComposeDeployService` — pure subprocess wrapping `docker compose`, no docker-py dependency
- Use dependency injection for credentials where applicable; the local-compose flow needs no credentials

**Docker Compose Service (MVP):**
- `ComposeDeployService` lives in `src/docker_svc/compose_service.py` and is pure-subprocess
- The single point of subprocess execution is `ComposeDeployService._run`, which tests patch via `mocker.patch("src.docker_svc.compose_service.subprocess.run", ...)`
- Compose filename auto-detection order: explicit → `compose.yml` → `compose.yaml` → `docker-compose.yml` → `docker-compose.yaml`
- Default project name: `<basename(path)>-<sha1(abs_path)[:6]>`

**Testing:**
- Test files in `tests/` mirror `src/` structure
- `pytest-mock` patches `subprocess.run` — no real Docker daemon needed for unit tests
- Test class names: `TestClassName`; test function names: `test_descriptive_name`
- Mark Docker/compose tests with `@pytest.mark.docker` (or module-level `pytestmark = pytest.mark.docker`)

## Repository Structure

```
agentic_devops/
  src/
    docker_svc/
      __init__.py
      base.py              # Exception hierarchy + @docker_operation
      models.py            # Legacy single-container models
      service.py           # Legacy DockerService (docker-py, optional)
      deploy.py            # Legacy GitHub-clone + single container (optional)
      tools.py             # Legacy agent tools (requires `agents`, optional)
      compose_models.py    # Local-compose MVP pydantic models
      compose_service.py   # ComposeDeployService (pure subprocess)
      compose_tools.py     # Agent tools for the MVP flow
    github/         # GitHub service module (optional)
    core/           # Shared: config, context, credentials, guardrails
    api/            # FastAPI HTTP layer
    __init__.py     # Public API exports
    cli.py          # CLI entry point
  tests/
    docker_svc/
      conftest.py         # tmp_project / mock_run fixtures
      test_compose_service.py
      test_deploy.py      # Legacy tests
    github/
    core/
  pytest.ini
  setup.py
  requirements.txt
```

## Key Conventions

- **Backend:** All public API is exported through `agentic_devops/src/__init__.py`
- **Backend:** Services use dependency injection for credentials; default to credential manager
- **Backend:** Optional heavy dependencies (`docker`, `agents`, `PyGithub`) are imported defensively so the local-compose flow stays usable in minimal environments
- **Backend:** The `DevOpsContext` pydantic model carries user/operation context
- **Docker (MVP):** `ComposeDeployService` shells out to `docker compose` — no docker-py required
- **Docker (legacy):** Uses docker-py SDK for container operations
- **API:** FastAPI serves HTTP endpoints on port 8000 by default
- **Never hardcode secrets:** Use environment variables or credential managers

## Git Branch Naming

- `feature/` — new features
- `fix/` — bug fixes
- `docs/` — documentation
