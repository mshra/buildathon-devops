# Docker Deployment Guide

This guide provides detailed instructions for deploying the Agentic DevOps framework using Docker containers.

## Overview

Docker provides a consistent and isolated environment for running applications, making it an excellent choice for deploying the Agentic DevOps framework. Using Docker offers several benefits:

- **Consistency**: Same environment across development, testing, and production
- **Isolation**: Application and dependencies are isolated from the host system
- **Portability**: Run anywhere Docker is supported
- **Scalability**: Easily scale with container orchestration tools
- **Version Control**: Container images can be versioned and stored in registries

## Prerequisites

Before deploying with Docker, ensure you have:

1. **Docker**: Installed on your system (Docker Desktop for Windows/Mac, Docker Engine for Linux)
2. **Docker Compose** (optional): For multi-container deployments
3. **Docker Hub Account** (optional): For publishing images
4. **Git**: For cloning the repository

## Basic Docker Deployment

### Step 1: Create a Dockerfile

Create a `Dockerfile` in the root of the project:

```dockerfile
# Use Python 3.9 as the base image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy requirements file
COPY agentic_devops/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Set environment variables
ENV PYTHONPATH=/app

# Set the entrypoint
ENTRYPOINT ["python", "run_cli.py"]

# Default command (can be overridden)
CMD ["--help"]
```

### Step 2: Build the Docker Image

Build the Docker image from the project root:

```bash
docker build -t agentic-devops:latest .
```

### Step 3: Run the Docker Container

Run the container with the appropriate command:

```bash
docker run -it --rm \
  -e OPENAI_API_KEY=your-openai-api-key \
  -e AWS_ACCESS_KEY_ID=your-aws-access-key \
  -e AWS_SECRET_ACCESS_KEY=your-aws-secret-key \
  -e GITHUB_TOKEN=your-github-token \
  agentic-devops:latest ec2 list-instances --region us-east-1
```

## Docker Compose Deployment

For more complex deployments with multiple services, use Docker Compose.

### Step 1: Create a Docker Compose File

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  agentic-devops:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
      - AWS_REGION=${AWS_REGION:-us-east-1}
      - GITHUB_TOKEN=${GITHUB_TOKEN}
    volumes:
      - ./data:/app/data
    command: --help

  api:
    build:
      context: .
      dockerfile: Dockerfile.api
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
      - AWS_REGION=${AWS_REGION:-us-east-1}
      - GITHUB_TOKEN=${GITHUB_TOKEN}
    depends_on:
      - agentic-devops
```

### Step 2: Create an API Dockerfile

Create a `Dockerfile.api` for the API service:

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY agentic_devops/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install fastapi uvicorn

COPY . .

ENV PYTHONPATH=/app

EXPOSE 8000

CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Step 3: Create a Simple API

Create an `api/main.py` file:

```python
import os
import asyncio
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

# Import the CLI processor
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from agentic_devops.src.cli import process_command

app = FastAPI(title="Agentic DevOps API")

class CommandRequest(BaseModel):
    command: str
    async_mode: bool = False

class CommandResponse(BaseModel):
    result: str
    status: str

@app.post("/command", response_model=CommandResponse)
async def run_command(request: CommandRequest):
    try:
        # Process the command
        result = await process_command(request.command.split())
        
        return {
            "result": result,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "healthy"}
```

### Step 4: Run with Docker Compose

Start the services:

```bash
docker-compose up -d
```

## Production Deployment Considerations

### Security

1. **Environment Variables**: Use environment variables for sensitive information
2. **Secrets Management**: Consider using Docker secrets or external secrets management
3. **Non-root User**: Run containers as a non-root user
4. **Read-only Filesystem**: Mount filesystems as read-only when possible
5. **Minimal Base Image**: Use slim or alpine base images to reduce attack surface

Example of running as non-root user:

```dockerfile
# Add a non-root user
RUN adduser --disabled-password --gecos "" appuser

# Switch to non-root user
USER appuser

# Set the entrypoint
ENTRYPOINT ["python", "run_cli.py"]
```

### Performance Optimization

1. **Multi-stage Builds**: Use multi-stage builds to reduce image size
2. **Layer Caching**: Organize Dockerfile to leverage layer caching
3. **Alpine Images**: Consider using Alpine-based images for smaller footprint
4. **Dependencies**: Only install necessary dependencies

Example of multi-stage build:

```dockerfile
# Build stage
FROM python:3.9-slim AS builder

WORKDIR /app
COPY agentic_devops/requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Runtime stage
FROM python:3.9-slim

WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY . .

ENV PATH=/root/.local/bin:$PATH
ENV PYTHONPATH=/app

ENTRYPOINT ["python", "run_cli.py"]
```

### Container Orchestration

For production deployments, consider using container orchestration:

1. **Kubernetes**: For complex, scalable deployments
2. **AWS ECS/EKS**: For AWS-based deployments
3. **Docker Swarm**: For simpler orchestration needs
4. **Azure Container Instances/AKS**: For Azure-based deployments
5. **Google Cloud Run/GKE**: For Google Cloud-based deployments

## Llama Deployment

[Llama](https://github.com/run-llama/llama_index) is a framework for building AI applications. Here's how to deploy the Agentic DevOps framework with Llama:

### Step 1: Create a Llama Dockerfile

```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install Llama and dependencies
COPY agentic_devops/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install llama-index openai

COPY . .

ENV PYTHONPATH=/app

# Copy Llama deployment script
COPY llama_deploy.py .

CMD ["python", "llama_deploy.py"]
```

### Step 2: Create a Llama Deployment Script

Create a `llama_deploy.py` file:

```python
import os
import sys
import asyncio
from llama_index import VectorStoreIndex, SimpleDirectoryReader, ServiceContext
from llama_index.llms import OpenAI
from llama_index.agent import ReActAgent

# Import Agentic DevOps components
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from agentic_devops.src.aws import list_ec2_instances, start_ec2_instances, stop_ec2_instances
from agentic_devops.src.github import get_repository, list_issues, create_issue

# Configure OpenAI
os.environ["OPENAI_API_KEY"] = os.environ.get("OPENAI_API_KEY", "")

# Create a service context
service_context = ServiceContext.from_defaults(
    llm=OpenAI(model="gpt-4o")
)

# Define tools
tools = [
    list_ec2_instances,
    start_ec2_instances,
    stop_ec2_instances,
    get_repository,
    list_issues,
    create_issue
]

# Create an agent
agent = ReActAgent.from_tools(
    tools,
    llm=OpenAI(model="gpt-4o"),
    verbose=True
)

# Run the agent
async def main():
    response = await agent.aquery(
        "List all EC2 instances in us-east-1 and then get information about the 'example/repo' GitHub repository"
    )
    print(response)

if __name__ == "__main__":
    asyncio.run(main())
```

### Step 3: Build and Run the Llama Container

```bash
docker build -t agentic-devops-llama:latest -f Dockerfile.llama .

docker run -it --rm \
  -e OPENAI_API_KEY=your-openai-api-key \
  -e AWS_ACCESS_KEY_ID=your-aws-access-key \
  -e AWS_SECRET_ACCESS_KEY=your-aws-secret-key \
  -e GITHUB_TOKEN=your-github-token \
  agentic-devops-llama:latest
```

## CI/CD Integration

Integrate Docker builds into your CI/CD pipeline:

### GitHub Actions Example

Create a `.github/workflows/docker-build.yml` file:

```yaml
name: Docker Build and Push

on:
  push:
    branches: [ main ]
    tags: [ 'v*' ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v1

      - name: Login to DockerHub
        if: github.event_name != 'pull_request'
        uses: docker/login-action@v1
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v3
        with:
          images: yourusername/agentic-devops
          tags: |
            type=semver,pattern={{version}}
            type=ref,event=branch
            type=sha,format=short

      - name: Build and push
        uses: docker/build-push-action@v2
        with:
          context: .
          push: ${{ github.event_name != 'pull_request' }}
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=registry,ref=yourusername/agentic-devops:buildcache
          cache-to: type=registry,ref=yourusername/agentic-devops:buildcache,mode=max
```

## Monitoring and Logging

Configure monitoring and logging for Docker containers:

### Docker Logging

```bash
docker run -it --rm \
  --log-driver=json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  agentic-devops:latest ec2 list-instances
```

### Prometheus Monitoring

Add Prometheus metrics to your API:

```python
from fastapi import FastAPI
from prometheus_fastapi_instrumentator import Instrumentator

app = FastAPI()

# Add Prometheus metrics
Instrumentator().instrument(app).expose(app)
```

## Troubleshooting

Common issues and solutions:

1. **Container Exits Immediately**: Check entrypoint and command configuration
2. **Missing Environment Variables**: Ensure all required environment variables are set
3. **Permission Issues**: Check file permissions and user configuration
4. **Network Issues**: Verify network configuration and connectivity
5. **Resource Constraints**: Monitor CPU, memory, and disk usage

## Related Documentation

- [AWS Lambda Deployment](aws-lambda.md)
- [CI/CD Pipeline Setup](ci-cd-pipeline.md)
- [Local Development Setup](local-development.md)
- [Llama Deployment](llama-deployment.md)