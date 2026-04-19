# GitHub Integration Module (`github`)

## Overview

The `github` module provides tools and functionalities for integrating with GitHub. It enables agents to interact with GitHub repositories, issues, and pull requests, facilitating DevOps tasks related to code management, collaboration, and issue tracking. This module allows agents to automate GitHub-related workflows.

## Submodules

### 1. GitHub Service Submodule (`github.github`)

- **Purpose**: Provides tools for interacting with GitHub repositories, issues, and pull requests.
- **Key Features**:
    - **Repository Management**: Functions to get repository details, list repositories, and get README content.
    - **Issue Management**: Functions to list and create issues.
    - **Pull Request Management**: Functions to list pull requests.
    - **Models**: Defines Pydantic models for GitHub requests and resources.
    - **Error Handling**: Uses custom exceptions for GitHub API-related errors.
- **Models**:
    - `GitHubRepoRequest(BaseModel)`:
        - Model for requesting GitHub repository information.
        - Attributes: `repo_path: str`, `owner: Optional[str]`.
    - `GitHubIssueRequest(BaseModel)`:
        - Model for requesting GitHub issue information.
        - Attributes: `repo_path: str`, `owner: Optional[str]`, `issue_number: int`.
    - `GitHubCreateIssueRequest(BaseModel)`:
        - Model for requesting the creation of a GitHub issue.
        - Attributes: `title: str`, `body: Optional[str]`, `assignees: Optional[List[str]]`, `labels: Optional[List[str]]`.
    - `GitHubPRRequest(BaseModel)`:
        - Model for requesting GitHub pull request information.
        - Attributes: `repo_path: str`, `owner: Optional[str]`, `pr_number: int`.
    - `GitHubRepository(BaseModel)`:
        - Model representing a GitHub repository with its key attributes.
        - Attributes: `name: str`, `full_name: str`, `description: Optional[str]`, `default_branch: str`, `clone_url: str`, `html_url: str`, `created_at: datetime`, `updated_at: datetime`, `pushed_at: datetime`, `stargazers_count: int`, `forks_count: int`, `language: Optional[str]`.
    - `GitHubIssue(BaseModel)`:
        - Model representing a GitHub issue.
        - Attributes: `number: int`, `title: str`, `body: Optional[str]`, `state: str`, `html_url: str`, `created_at: datetime`, `updated_at: datetime`, `closed_at: Optional[datetime]`, `assignees: Optional[List[Dict[str, str]]]`, `labels: Optional[List[Dict[str, str]]]`, `user: Optional[Dict[str, str]]`.
    - `GitHubPullRequest(BaseModel)`:
        - Model representing a GitHub pull request.
        - Attributes: `number: int`, `title: str`, `body: Optional[str]`, `state: str`, `html_url: str`, `created_at: datetime`, `updated_at: datetime`, `closed_at: Optional[datetime]`, `merged_at: Optional[datetime]`, `user: Optional[Dict[str, str]]`, `head: Dict[str, str]`, `base: Dict[str, str]`.

- **Tools (Functions)**:
    - `get_repository(repo_path: str, owner: Optional[str] = None, context: Optional[DevOpsContext] = None) -> GitHubRepository`:
        - Retrieves details of a GitHub repository.
        - Returns a `GitHubRepository` object.
    - `list_repositories(org: Optional[str] = None, user: Optional[str] = None, context: Optional[DevOpsContext] = None) -> List[GitHubRepository]`:
        - Lists GitHub repositories for a given organization or user.
        - Returns a list of `GitHubRepository` objects.
    - `get_readme(repo_path: str, owner: Optional[str] = None, ref: Optional[str] = None, context: Optional[DevOpsContext] = None) -> Dict[str, Optional[str]]`:
        - Retrieves the README content of a GitHub repository.
        - Returns a dictionary containing `content` (decoded README content) and `encoding`.
    - `list_issues(repo_path: str, owner: Optional[str] = None, filters: Optional[Dict[str, str]] = None, context: Optional[DevOpsContext] = None) -> List[GitHubIssue]`:
        - Lists issues in a GitHub repository, with optional filters (e.g., `state`, `assignee`, `labels`).
        - Returns a list of `GitHubIssue` objects.
    - `create_issue(request: GitHubCreateIssueRequest, repo_path: str, owner: Optional[str] = None, context: Optional[DevOpsContext] = None) -> GitHubIssue`:
        - Creates a new issue in a GitHub repository based on `GitHubCreateIssueRequest`.
        - Returns the created `GitHubIssue` object.
    - `list_pull_requests(repo_path: str, owner: Optional[str] = None, filters: Optional[Dict[str, str]] = None, context: Optional[DevOpsContext] = None) -> List[GitHubPullRequest]`:
        - Lists pull requests in a GitHub repository, with optional filters (e.g., `state`, `head`, `base`).
        - Returns a list of `GitHubPullRequest` objects.

### 2. GitHub Base Submodule (`github.github`)

- **Purpose**: Provides base classes and error handling for GitHub API interactions.
- **Key Features**:
    - **Custom Exceptions**: Defines custom exception classes for different GitHub API error scenarios.
        - `GitHubError`: Base class for GitHub errors.
        - `AuthenticationError`: Raised for GitHub authentication failures.
        - `RepositoryNotFoundError`: Raised when a GitHub repository is not found.
        - `IssueNotFoundError`: Raised when a GitHub issue is not found.
        - `PullRequestNotFoundError`: Raised when a GitHub pull request is not found.
- **Classes**:
    - `GitHubError(Exception)`: Base exception class for GitHub errors.
    - `AuthenticationError(GitHubError)`: Exception for authentication failures.
    - `RepositoryNotFoundError(GitHubError)`: Exception for repository not found errors.
    - `IssueNotFoundError(GitHubError)`: Exception for issue not found errors.
    - `PullRequestNotFoundError(GitHubError)`: Exception for pull request not found errors.

This document provides a detailed overview of the GitHub integration module, outlining its submodules, models, tools, and functionalities for interacting with GitHub repositories, issues, and pull requests.