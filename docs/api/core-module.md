# Core Module API Reference

## Overview

This document provides the API reference for the `core` module in the Agentic DevOps framework.

## Submodules

- [Config Submodule](#config-submodule)
- [Credentials Submodule](#credentials-submodule)
- [Context Submodule](#context-submodule)
- [Guardrails Submodule](#guardrails-submodule)

## Config Submodule

Provides functionalities for configuration management.

### Functions

- `load_config(config_file: Optional[str] = None, env_prefix: str = "DEVOPS", merge_defaults: bool = True) -> Dict[str, Any]`: Loads configuration from file and environment variables.
- `get_config() -> Dict[str, Any]`: Gets the current configuration.
- `get_config_value(key_path: str, default: Any = None) -> Any`: Gets a configuration value by key path.
- `set_config_value(key_path: str, value: Any) -> None`: Sets a configuration value by key path.

### Classes

- `ConfigError(Exception)`: Exception raised for configuration errors.

## Credentials Submodule

Provides functionalities for credential management.

### Classes

- `AWSCredentials(BaseModel)`: AWS credentials model.
  - Attributes:
    - `access_key_id: Optional[str]`
    - `secret_access_key: Optional[str]`
    - `session_token: Optional[str]`
    - `region: str = "us-west-2"`
    - `profile: Optional[str]`
- `GitHubCredentials(BaseModel)`: GitHub credentials model.
  - Attributes:
    - `token: str`
    - `api_url: str = "https://api.github.com"`
- `CredentialManager`: Credential Manager for securely accessing and managing service credentials.
  - Methods:
    - `get_aws_credentials(region: Optional[str] = None) -> AWSCredentials`: Get AWS credentials.
    - `get_github_credentials() -> GitHubCredentials`: Get GitHub credentials.
- `CredentialError(Exception)`: Exception raised for credential-related errors.

### Functions

- `get_credential_manager() -> CredentialManager`: Get the global credential manager instance.
- `set_credential_manager(manager: CredentialManager) -> None`: Set the global credential manager instance.

## Context Submodule

Provides functionalities for context management.

### Classes

- `DevOpsContext(BaseModel)`: Context class for DevOps operations.
  - Attributes:
    - `user_id: str`
    - `aws_region: Optional[str] = None`
    - `github_org: Optional[str] = None`
    - `environment: str = "dev"`
    - `metadata: Dict[str, Any] = Field(default_factory=dict)`
  - Methods:
    - `get_metadata(key: str, default: Any = None) -> Any`: Get a metadata value by key.
    - `set_metadata(key: str, value: Any) -> None`: Set a metadata value.
    - `with_aws_region(self, region: str) -> 'DevOpsContext'`: Create a new context with the specified AWS region.
    - `with_github_org(self, org: str) -> 'DevOpsContext'`: Create a new context with the specified GitHub organization.
    - `with_environment(self, env: str) -> 'DevOpsContext'`: Create a new context with the specified environment.

## Guardrails Submodule

Provides functionalities for security and safety guardrails.

### Functions

- `check_security(input_text: str) -> SecurityCheckOutput`: Check if input text contains potentially malicious content.
- `check_sensitive_info(output_text: str) -> SensitiveInfoOutput`: Check if output text contains sensitive information.
- `security_guardrail(ctx: RunContextWrapper, agent: Agent, input_text: str) -> GuardrailFunctionOutput`: Security guardrail to prevent potentially harmful operations.
- `sensitive_info_guardrail(ctx: RunContextWrapper, agent: Agent, output_text: str) -> GuardrailFunctionOutput`: Sensitive information guardrail to prevent leaking sensitive data.

### Classes

- `SecurityCheckOutput(BaseModel)`: Output model for security check guardrail.
  - Attributes:
    - `is_malicious: bool`
    - `reasoning: str`
- `SensitiveInfoOutput(BaseModel)`: Output model for sensitive information check guardrail.
  - Attributes:
    - `contains_sensitive_info: bool`
    - `reasoning: str`
- `GuardrailFunctionOutput(BaseModel)`: Output model for guardrail functions (from agents SDK).
- `RunContextWrapper`: Run context wrapper (from agents SDK).
- `Agent`: Agent class (from agents SDK).
- `Runner`: Runner class (from agents SDK).