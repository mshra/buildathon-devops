# Component Diagram

## Architecture Diagram (Textual Representation)

This diagram illustrates the main components of the Agentic DevOps Framework and their relationships.

```mermaid
graph LR
    subgraph CLI
        cli[cli.py]
        subgraph Argument Parsing
            argparse[argparse]
        end
        cli --> argparse
        cli --> config[Config Module]
        cli --> credentials[Credentials Module]
        cli --> ec2_service[EC2 Service]
        cli --> github_service[GitHub Service]
    end

    subgraph Core Module (core/)
        core_module[core]
        config[config.py]
        credentials[credentials.py]
        context[context.py]
        guardrails[guardrails.py]
    end

    subgraph AWS Module (aws/)
        aws_module[aws]
        ec2[ec2.py]
        ec2_tools[ec2_tools.py]
        ec2_models[ec2_models.py]
        aws_base[base.py]
    end

    subgraph GitHub Module (github/)
        github_module[github]
        github_service[github.py]
        github_tools[github_tools.py]
        github_models[github_models.py]
    end

    CoreModule --> config
    CoreModule --> credentials
    CoreModule --> context
    CoreModule --> guardrails

    cli --> CoreModule
    AWSModule --> CoreModule
    GitHubModule --> CoreModule

    aws_module --> ec2
    aws_module --> aws_base
    ec2 --> ec2_tools
    ec2 --> ec2_models

    github_module --> github_service
    github_module --> github_tools
    github_service --> github_tools
    github_service --> github_models

    ec2_service --> ec2
    github_service --> github_service

    style cli fill:#f9f,stroke:#333,stroke-width:2px
    style core_module fill:#ccf,stroke:#333,stroke-width:2px
    style aws_module fill:#cff,stroke:#333,stroke-width:2px
    style github_module fill:#cfc,stroke:#333,stroke-width:2px
```

## Components

- **CLI (Command Line Interface)**:
    - `cli.py`:  Handles command-line argument parsing using `argparse`, invokes relevant modules and services based on user commands.
    - **Argument Parsing**: Uses `argparse` to define and parse command-line arguments.
    - Interacts with: Config Module, Credentials Module, EC2 Service, GitHub Service.

- **Core Module (`core/`)**:
    - `core`:  Provides foundational components used across the framework.
    - `config.py` (Config Module): Loads, manages, and provides access to configuration settings from files and environment variables.
    - `credentials.py` (Credentials Module): Securely manages credentials for AWS, GitHub, and other services, using `CredentialManager`, `AWSCredentials`, and `GitHubCredentials`.
    - `context.py` (Context Module): Defines `DevOpsContext` to encapsulate user, environment, and operational context.
    - `guardrails.py` (Guardrails Module): Implements security and safety guardrails using `security_guardrail` and `sensitive_info_guardrail` to prevent harmful operations and sensitive data leaks.

- **AWS Module (`aws/`)**:
    - `aws`: Provides tools and services for interacting with Amazon Web Services.
    - `ec2.py` (EC2 Service): Implements EC2 functionalities, including instance management and deployment, using `EC2Service`.
    - `ec2_tools.py`: Contains tools and functions for EC2 operations.
    - `ec2_models.py`: Defines data models for EC2 resources like `EC2Instance`, `EC2InstanceFilter`, `EC2CreateRequest`, and `EC2StartStopRequest`.
    - `base.py` (AWS Base): Provides base classes and error handling for AWS interactions, including `AWSServiceError` and related exceptions.

- **GitHub Module (`github/`)**:
    - `github`: Provides tools and services for interacting with GitHub.
    - `github.py` (GitHub Service): Implements GitHub functionalities, including repository, issue, and pull request management, using `GitHubService`.
    - `github_tools.py`: Contains tools and functions for GitHub operations.
    - `github_models.py`: Defines data models for GitHub resources like `GitHubRepository`, `GitHubIssue`, `GitHubPullRequest`, `GitHubRepoRequest`, `GitHubIssueRequest`, and `GitHubPRRequest`.

## Interactions

- **CLI** acts as the entry point, orchestrating operations by using modules and services.
- **Core Module** provides essential services (config, credentials, context, guardrails) to all other modules.
- **AWS Module** and **GitHub Module** leverage the **Core Module** for configuration and credential management and provide service-specific functionalities.
- **EC2 Service** and **GitHub Service** encapsulate the logic for interacting with AWS EC2 and GitHub APIs, respectively, and utilize tools and models within their modules.

This component diagram and description offer a detailed view of the architecture for the `agentic_devops/src` directory, highlighting the components and their interactions.