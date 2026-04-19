# Local Development Setup

## Overview

This document provides instructions for setting up a local development environment for the Agentic DevOps framework.

## Prerequisites

- Python 3.8+
- pip package manager
- Virtual environment (venv or conda)

## Setup Steps

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd devops
   ```

2. **Create a virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Linux/macOS
   venv\Scripts\activate  # On Windows
   ```

3. **Install dependencies:**
   ```bash
   pip install -r agentic_devops/requirements.txt
   pip install -e agentic_devops # Install the package in editable mode
   ```

4. **Configuration:**
   - Create a `config.yaml` file in `~/.devops/` directory (or specify a different path using `DEVOPS_CONFIG_FILE` environment variable).
   - Configure AWS and GitHub credentials (see [Credential Management Documentation](implementation/core-components.md#credentials)).

5. **Run examples or CLI:**
   ```bash
   python examples/hello_world.py
   run_cli.py --help
   ```

## Development Workflow

- Make code changes in the `agentic_devops/src` directory.
- Run tests using `pytest agentic_devops/tests`.
- Build documentation using `cd docs && make html`.
- Use `run_cli.py` for CLI testing.

## VS Code Setup (Optional)

- Open the project in VS Code.
- Configure Python interpreter to use the virtual environment (`venv`).
- Install recommended extensions (Python, Pylance, etc.).
- Set up debugging configurations for examples and tests.

## Troubleshooting

[Troubleshooting tips and common issues will be added here]