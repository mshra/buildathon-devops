# Agentic DevOps

An AI-powered Docker deployment platform with GitHub integration and OpenAI Agents SDK.

## Introduction

Agentic DevOps is an autonomous DevOps platform that deploys GitHub repositories to Docker containers. It provides a unified interface for container management and deployments through CLI, HTTP API, and AI agents.

## Features

- **Docker Deployment**: Deploy any GitHub repository with a Dockerfile to a container
- **Container Management**: Start, stop, restart, and remove containers via CLI or API
- **GitHub Integration**: List repos, issues, branches, and pull requests
- **Real-time Logs**: Stream container logs
- **FastAPI HTTP API**: Full REST API for integrations
- **OpenAI Agents**: Function tools for AI-powered deployments

## Installation

```bash
cd agentic_devops
pip install -e .
```

## Quick Start

### CLI - Deploy a Repository

```bash
# Deploy a GitHub repository
devops-agent docker deploy --repo owner/repo --branch main --port 80

# List deployments
devops-agent docker list

# Get logs
devops-agent docker logs <deploy_id>

# Stop a deployment
devops-agent docker stop <deploy_id>
```

### CLI - GitHub Operations

```bash
# List repositories
devops-agent github list-repos --org myorg

# Get repository details
devops-agent github get-repo owner/repo
```

### Start the API Server

```bash
# Start API server
devops-agent serve --port 8000

# Or use the module
python -m agentic_devops.src.api.app
```

### API Endpoints

```bash
# Deploy a repository
curl -X POST http://localhost:8000/deployments \
  -H "Content-Type: application/json" \
  -d '{"repository": "owner/repo", "branch": "main", "container_port": 80}'

# List deployments
curl http://localhost:8000/deployments

# Get deployment logs
curl http://localhost:8000/deployments/<id>/logs

# Stop deployment
curl -X POST http://localhost:8000/deployments/<id>/stop
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GITHUB_TOKEN` | GitHub Personal Access Token |
| `GITHUB_API_URL` | GitHub API URL (default: https://api.github.com) |
| `DOCKER_BASE_URL` | Docker daemon URL |
| `DEVOPS_CONFIG_FILE` | Config file path |

## Configuration

Create `~/.devops/credentials.json`:

```json
{
  "github": {
    "token": "ghp_..."
  }
}
```

Or set environment variables:

```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxx
```

## Requirements

- Python 3.9+
- Docker daemon running
- GitHub token (for private repos and GitHub operations)

## License

MIT