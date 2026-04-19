# Data Flow

## Overview

This document describes the data flow within the Agentic DevOps framework, illustrating how data is processed and passed between different components during typical operations.

## Data Flow Diagrams

### 1. Command Execution Data Flow

```mermaid
sequenceDiagram
    participant User
    participant CLI (cli.py)
    participant ArgumentParser
    participant Config Module
    participant Credential Manager
    participant EC2 Service
    participant GitHub Service
    participant AWS API
    participant GitHub API

    User->>CLI: Executes CLI command (e.g., `run_cli.py ec2 list-instances`)
    CLI->>ArgumentParser: Parse command and arguments (using argparse)
    ArgumentParser->>CLI: Returns parsed arguments
    CLI->>Config Module: Get configuration (e.g., AWS region)
    Config Module->>CLI: Returns configuration data
    CLI->>Credential Manager: Get credentials (e.g., AWS credentials)
    Credential Manager->>CLI: Returns credentials
    alt EC2 Command
        CLI->>EC2 Service: Call EC2 service function (e.g., `list_instances`) with arguments and context
        EC2 Service->>AWS API: Call AWS API (e.g., `ec2.describe_instances`) with credentials
        AWS API->>EC2 Service: Returns AWS API response data (e.g., instance details)
        EC2 Service->>CLI: Returns processed instance data
    else GitHub Command
        CLI->>GitHub Service: Call GitHub service function (e.g., `list_repositories`) with arguments and context
        GitHub Service->>GitHub API: Call GitHub API (e.g., `GET /user/repos`) with credentials
        GitHub API->>GitHub Service: Returns GitHub API response data (e.g., repository list)
        GitHub Service->>CLI: Returns processed repository data
    end
    CLI->>User: Display formatted output to user (e.g., table or JSON)
```

### 2. Agent Workflow Data Flow

```mermaid
sequenceDiagram
    participant Agent
    participant Runner
    participant Tool Registry
    participant Tool (e.g., list_ec2_instances)
    participant RunContext
    participant Guardrail System
    participant External Service (AWS, GitHub)

    User->>Runner: Start agent workflow with task input
    Runner->>Agent: Initialize agent with task and context
    Agent->>Tool Registry: Select appropriate tool based on task
    Agent->>RunContext: Access context information (e.g., region, credentials)
    Runner->>Guardrail System: Input Guardrail Check (e.g., security_guardrail)
    Guardrail System->>Runner: Returns guardrail check result
    alt Guardrail Passed
        Runner->>Tool: Execute tool (e.g., `list_ec2_instances`) with context
        Tool->>External Service: Interact with external service API (AWS, GitHub)
        External Service->>Tool: Returns API response data
        Tool->>Runner: Returns processed tool output
        Runner->>Agent: Provide tool output to agent
        Agent->>Runner: Generate final output or next action
        Runner->>Guardrail System: Output Guardrail Check (e.g., sensitive_info_guardrail)
        Guardrail System->>Runner: Returns output guardrail check result
        alt Guardrail Passed
            Runner->>User: Return final result to user
        else Guardrail Failed
            Runner->>User: Return guardrail violation message
        end
    else Guardrail Failed
        Runner->>User: Return guardrail violation message
    end
```

## Data Entities

- **Configuration Data**: Loaded from YAML/JSON files or environment variables. Managed by `config.py`. Includes settings for AWS, GitHub, logging, etc.
- **Credential Data**: AWS credentials (access key, secret key, token, region, profile) and GitHub token, managed by `credentials.py` and `CredentialManager`.
- **Context Data**: `DevOpsContext` object containing `user_id`, `aws_region`, `github_org`, `environment`, and metadata, managed by `context.py`.
- **Request Data**: User commands from CLI or task inputs for agents, typically strings or structured data.
- **Response Data**: JSON responses from AWS and GitHub APIs, processed by service modules and tools.
- **Output Data**: Formatted CLI output (JSON, table) or agent workflow results, which can be text, structured data, or actions.

This document provides a detailed overview of the data flow within the Agentic DevOps framework for both command execution and agent workflows.