# Core Components Module (`core`)

## Overview

The `core` module is the foundation of the Agentic DevOps framework, providing essential components that are used throughout the system. It includes submodules for configuration management, credential handling, context management, and security guardrails. These components ensure consistency, security, and proper context for all DevOps operations performed by agents and tools.

## Submodules

### 1. Config Submodule (`core.config`)

- **Purpose**: Manages the framework's configuration settings.
- **Key Features**:
    - **Configuration Loading**: Loads configuration from multiple sources:
        - YAML or JSON configuration files.
        - Environment variables (prefixed with `DEVOPS_`).
        - Default configurations.
    - **Hierarchical Configuration**: Supports nested configuration settings using dictionaries.
    - **Configuration Access**: Provides functions to access configuration values by key path.
    - **Configuration Setting**: Allows programmatic setting of configuration values.
- **Classes**:
    - `ConfigError(Exception)`:
        - Custom exception class raised for configuration-related errors, such as file not found or invalid format.
- **Functions**:
    - `load_config(config_file: Optional[str] = None, env_prefix: str = "DEVOPS", merge_defaults: bool = True) -> Dict[str, Any]`:
        - Loads configuration from a specified file and environment variables.
        - Merges loaded configuration with default settings if `merge_defaults` is True.
        - Returns a dictionary containing the loaded configuration.
    - `get_config() -> Dict[str, Any]`:
        - Retrieves the current global configuration dictionary.
        - If configuration is not loaded yet, it loads default configuration.
    - `get_config_value(key_path: str, default: Any = None) -> Any`:
        - Retrieves a specific configuration value using a dot-separated `key_path` (e.g., `"aws.region"`).
        - Returns the value if found, otherwise returns the `default` value.
    - `set_config_value(key_path: str, value: Any) -> None`:
        - Sets a configuration value at the specified `key_path`.
        - Creates nested dictionaries as needed to set the value.

### 2. Credentials Submodule (`core.credentials`)

- **Purpose**: Securely manages credentials for accessing external services like AWS and GitHub.
- **Key Features**:
    - **Credential Models**: Defines Pydantic models for storing credentials.
        - `AWSCredentials`: Stores AWS access key ID, secret access key, session token, region, and profile.
        - `GitHubCredentials`: Stores GitHub Personal Access Token and API URL.
    - **Credential Manager**: `CredentialManager` class handles loading and retrieving credentials.
    - **Secure Loading**: Loads credentials from environment variables, AWS profiles, and optional credentials file (`~/.devops/credentials.json`).
    - **Error Handling**: Uses `CredentialError` exception for credential-related issues.
- **Classes**:
    - `AWSCredentials(BaseModel)`: Model for AWS credentials.
    - `GitHubCredentials(BaseModel)`: Model for GitHub credentials.
    - `CredentialManager`: Manages and retrieves service credentials.
    - `CredentialError(Exception)`: Custom exception for credential errors.
- **Functions**:
    - `get_credential_manager() -> CredentialManager`:
        - Returns the global `CredentialManager` instance (creates one if it doesn't exist).
    - `set_credential_manager(manager: CredentialManager) -> None`:
        - Sets the global `CredentialManager` instance, allowing replacement of the default manager.

### 3. Context Submodule (`core.context`)

- **Purpose**: Provides context management for DevOps operations, encapsulating user and environment information.
- **Key Features**:
    - **DevOpsContext Class**: Defines the `DevOpsContext` class to hold contextual information.
    - **Contextual Attributes**: Includes attributes for `user_id`, `aws_region`, `github_org`, `environment`, and metadata.
    - **Metadata Management**: Allows storing and retrieving additional metadata within the context.
    - **Context Modification**: Provides methods to create new contexts with updated AWS region, GitHub organization, or environment.
- **Classes**:
    - `DevOpsContext(BaseModel)`:
        - Encapsulates context for DevOps operations.
        - Attributes include user ID, AWS region, GitHub organization, environment, and metadata.
        - Methods for getting/setting metadata and creating modified contexts.

### 4. Guardrails Submodule (`core.guardrails`)

- **Purpose**: Implements security and safety guardrails to prevent harmful operations and sensitive information leaks.
- **Key Features**:
    - **Input Guardrail**: Uses `@input_guardrail` decorator and `security_guardrail` function to validate user inputs and prevent malicious commands.
    - **Output Guardrail**: Uses `@output_guardrail` decorator and `sensitive_info_guardrail` function to scan outputs and prevent sensitive data leaks.
    - **Security Checks**: Includes functions `check_security` and `check_sensitive_info` with regular expressions to detect dangerous patterns and sensitive information.
    - **Guardrail Outputs**: Defines `SecurityCheckOutput` and `SensitiveInfoOutput` models to structure guardrail check results.
- **Classes**:
    - `SecurityCheckOutput(BaseModel)`: Model for output of security checks (is_malicious, reasoning).
    - `SensitiveInfoOutput(BaseModel)`: Model for output of sensitive info checks (contains_sensitive_info, reasoning).
- **Functions**:
    - `check_security(input_text: str) -> SecurityCheckOutput`: Checks input text for malicious content.
    - `check_sensitive_info(output_text: str) -> SensitiveInfoOutput`: Checks output text for sensitive information.
    - `security_guardrail(ctx: RunContextWrapper, agent: Agent, input_text: str) -> GuardrailFunctionOutput`: Input guardrail function.
    - `sensitive_info_guardrail(ctx: RunContextWrapper, agent: Agent, output_text: str) -> GuardrailFunctionOutput`: Output guardrail function.

This document provides a detailed overview of the core components module, outlining the purpose, features, classes, and functions of each submodule. These core components are fundamental to the operation and security of the Agentic DevOps framework.