# Core Module

The `core` module provides essential components for the Agentic DevOps framework, including configuration management, credential handling, context management, and security guardrails.

## Submodules

- [Config](#config)
- [Credentials](#credentials)
- [Context](#context)
- [Guardrails](#guardrails)

## Config

The `config` submodule provides functionalities for loading, accessing, and managing the agent's configuration. It allows you to:

- Load configuration from a file or environment variables.
- Get specific configuration values.
- Set configuration values programmatically.

### Functions

- `get_config()`: Retrieves the entire configuration object.
- `get_config_value(key: str)`: Retrieves a specific configuration value by key.
- `set_config_value(key: str, value: Any)`: Sets a configuration value.
- `load_config(path: str)`: Loads configuration from a file.

## Credentials

The `credentials` submodule handles the management of credentials for accessing various services like AWS and GitHub. It provides:

- Classes for storing credentials (`AWSCredentials`, `GitHubCredentials`).
- A `CredentialManager` class for managing and retrieving credentials.
- Functions to get and set the global `CredentialManager`.

### Classes

- `AWSCredentials`: Represents AWS credentials (access key, secret key, region).
- `GitHubCredentials`: Represents GitHub credentials (token).
- `CredentialManager`: Manages credentials, allowing you to load, store, and retrieve credentials for different services.

### Functions

- `get_credential_manager()`: Retrieves the global `CredentialManager` instance.
- `set_credential_manager(manager: CredentialManager)`: Sets the global `CredentialManager` instance.

## Context

The `context` submodule, already partially documented in `openai-agents-integration.md`, provides the `DevOpsContext` class.

## Guardrails

The `guardrails` submodule, already partially documented in `openai-agents-integration.md`, provides security guardrail functionalities.