# Agentic DevOps Backend Architecture

## Overview

Agentic DevOps is a Python backend that deploys GitHub repositories to Docker containers. The system is composed of:

- **Docker layer** — Builds images, runs containers, streams logs
- **GitHub layer** — Reads repository metadata, branches, and issues
- **Core layer** — Shared configuration, credentials, context, and guardrails
- **FastAPI layer** — REST API for deployments, containers, and GitHub passthrough
- **CLI layer** — Command-line interface mirroring API capabilities
- **OpenAI function tools** — Allow agents to call Docker and GitHub operations directly

## Architecture Diagram

```
┌─────────────────────────────────────────┐
│           FastAPI & CLI Layer           │
│  (HTTP routes, command handlers)        │
├─────────────────────────────────────────┤
│            Service Layer                │
│  DockerService, DockerDeployService,    │
│  GitHubService                          │
├─────────────────────────────────────────┤
│           Integration Layer             │
│  docker-py SDK, GitHub REST API         │
├─────────────────────────────────────────┤
│              Core Layer                 │
│  config, credentials, context, guardrails│
└─────────────────────────────────────────┘

Function tools bridge the AI agent runtime to the service layer.
```

## Core Modules (`src/core/`)

### Configuration (`config.py`)

- Default configuration includes Docker workspace path, restart policy, and GitHub API URL
- `load_config()` merges defaults, optional file (`~/.devops/config.yaml` / `.json`), and environment variables (`DEVOPS_DOCKER__BASE_URL`, etc.)
- `get_config_value("docker.base_url")` and `set_config_value()` provide dot-path access

### Credentials (`credentials.py`)

- `DockerCredentials` holds remote daemon configuration (base URL, TLS options)
- `GitHubCredentials` stores personal access token and API URL
- `CredentialManager` lazily loads credentials from environment variables or `~/.devops/credentials.json`

### Context (`context.py`)

- `DevOpsContext` captures `user_id`, optional `github_org`, environment, and arbitrary metadata
- Helper methods (`with_github_org`, `with_environment`) return immutable copies with overrides

### Guardrails (`guardrails.py`)

- Input guardrail blocks destructive shell commands and dangerous Docker flags (`--privileged`, host networking, sensitive mounts)
- Output guardrail scans for secrets (GitHub tokens, Docker credentials, private keys)

## Docker Service Layer (`src/docker_svc/`)

### `DockerService`

- Wraps `docker` SDK (`docker.from_env`) with higher-level helpers:
  - `build_image(path, tag, build_args)`
  - `run_container(image, ports, env, labels)`
  - `list_containers(all=False, label_filter)`
  - `stop_container`, `start_container`, `restart_container`, `remove_container`
  - `get_logs(container_id, tail)`
  - `list_images()`, `remove_image()`
- `_allocate_free_port()` obtains an ephemeral host port via sockets
- Errors surface as custom exceptions (`DockerServiceError`, `ContainerNotFoundError`, `ImageBuildError`, ...)

### `DockerDeployService`

- Orchestrates end-to-end deployment:
  1. Create workspace directory (`/tmp/devops-deploys/<id>`)
  2. Clone GitHub repository (supports token injection for private repos)
  3. Validate presence of `Dockerfile`
  4. Build Docker image (`devops-<repo>:<branch>-<id>`)
  5. Allocate host port and run container with labels (`managed-by=devops-agent`)
  6. Store `Deployment` metadata in-memory (id, repo, ports, URL)
- Provides lifecycle operations: `list_deployments`, `get_deployment`, `stop/start/restart`, `remove_deployment`, `redeploy`, `get_deployment_logs`

### Pydantic Models (`models.py`)

- `DeployRequest` — repository, branch, container port, environment, build args
- `Deployment` — runtime metadata returned to API/CLI users
- `ContainerFilter`, `ContainerAction`, `ContainerLogRequest` — helper DTOs for agents and API

### Function Tools (`tools.py`)

- All Docker operations are decorated with `@function_tool()` for OpenAI agents:
  - `deploy_repository`, `list_deployments`, `get_deployment`, `stop_deployment`, `start_deployment`, `restart_deployment`, `remove_deployment`
  - `list_containers`, `get_container`, `stop_container`, `start_container`, `restart_container`, `remove_container`, `get_container_logs`
  - `list_images`

## GitHub Service Layer (`src/github/`)

### `GitHubService`

- Authenticates via REST API token and caches selected responses
- Supports:
  - Repository CRUD and metadata (`list_repositories`, `get_repository`, `create_repository`, `delete_repository`)
  - Content operations (`get_readme`, `get_content`, `create_file`, `update_file`, `delete_file`)
  - Branch management (`list_branches`, `get_branch`, `create_branch`)
  - Issue workflow (`list_issues`, `create_issue`)
  - Pull requests (`list_pull_requests`)
  - Docker deployment shortcut `deploy_to_docker()` for higher-level integrations

### GitHub Tools (`github_tools.py`)

- Agent-optimized wrappers using PyGithub for simple tasks (list issues, create issue, list pull requests, get repository)

## FastAPI Layer (`src/api/`)

- `app.py` defines the FastAPI application, CORS, health endpoints, and `run()` helper (used by CLI)
- Dependency injection (`dependencies.py`) exposes cached `DockerService`/`DockerDeployService` instances
- Routes:
  - `/deployments` — create, list, fetch, logs, stop/start/restart/remove, redeploy
  - `/containers` — list, inspect, logs, stop/start/restart/remove
  - `/github` — lightweight passthrough to `GitHubService` (repos, issues, branches, pull requests)

## CLI (`src/cli.py`)

- `devops-agent docker ...` commands mirror API capabilities (`deploy`, `list`, `logs`, `stop`, `start`, `rm`, `ps`)
- `devops-agent github ...` provides repository metadata operations
- `devops-agent serve` launches FastAPI (`uvicorn`)

## Data Flow

1. **Deployment Request**
   - CLI/API/Agent → `DockerDeployService.deploy_from_github`
   - Repository cloned → image built → container started → `Deployment` returned
2. **Container Management**
   - CLI/API/Agent → `DockerService` methods → Docker daemon via socket
3. **GitHub Metadata**
   - CLI/API/Agent → `GitHubService` → GitHub REST API (token scoped)

## Error Handling

- Service layer wraps SDK exceptions into descriptive `DockerServiceError`/`GitHubError` derivatives with human-readable suggestions
- API converts service errors into HTTP 4xx responses
- CLI prints color-coded error messages with suggestions
- Guardrails prevent dangerous inputs and sensitive output leakage

## Testing Strategy

- Unit tests rely on `pytest` with mocks for Docker/GitHub interactions (`MagicMock`, `TestClient`)
- `tests/docker_svc/` — verifies deploy orchestration and lifecycle methods
- `tests/api/` — validates FastAPI routes via dependency overrides
- `tests/core/` — ensures configuration and credentials behave with env variables/files

## Extension Points

- **Docker variants** — Add additional deployment strategies (compose, Kubernetes) by implementing new services and plugging them into function tools
- **Persistent metadata** — Swap in a database-backed deployment store; `DockerDeployService` centralizes state
- **Authentication** — FastAPI layer is ready for JWT/API-key middleware additions
- **Agent tools** — Add new `@function_tool` definitions for custom workflows
