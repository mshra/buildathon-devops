# GitHub Module API Reference (`github`)

## Overview

This document provides a detailed API reference for the `github` module in the Agentic DevOps framework. This module offers functionalities to interact with the GitHub API, allowing agents to manage repositories, issues, and pull requests.

## Submodules

### 1. GitHub Service Submodule (`github.github`)

Provides classes and functions for interacting with GitHub API.

#### Models

- `GitHubRepoRequest(BaseModel)`: Model for requesting repository information.
    - `repo_path: str`: Repository path (e.g., `owner/repo-name`).
    - `owner: Optional[str]`: Repository owner (optional if `repo_path` is full path).

- `GitHubIssueRequest(BaseModel)`: Model for requesting issue information.
    - `repo_path: str`: Repository path.
    - `owner: Optional[str]`: Repository owner.
    - `issue_number: int`: Issue number.

- `GitHubCreateIssueRequest(BaseModel)`: Model for creating a new issue.
    - `title: str`: Issue title.
    - `body: Optional[str]`: Issue body/description.
    - `assignees: Optional[List[str]]`: List of usernames to assign.
    - `labels: Optional[List[str]]`: List of labels to apply.

- `GitHubPRRequest(BaseModel)`: Model for requesting pull request information.
    - `repo_path: str`: Repository path.
    - `owner: Optional[str]`: Repository owner.
    - `pr_number: int`: Pull request number.

- `GitHubRepository(BaseModel)`: Model representing a GitHub repository.
    - `name: str`: Repository name.
    - `full_name: str`: Full repository name (owner/repo-name).
    - `description: Optional[str]`: Repository description.
    - `default_branch: str`: Default branch name.
    - `clone_url: str`: Clone URL.
    - `html_url: str`: HTML URL.
    - `created_at: datetime`: Created at timestamp.
    - `updated_at: datetime`: Updated at timestamp.
    - `pushed_at: datetime`: Pushed at timestamp.
    - `stargazers_count: int`: Star count.
    - `forks_count: int`: Fork count.
    - `language: Optional[str]`: Primary language.

- `GitHubIssue(BaseModel)`: Model representing a GitHub issue.
    - `number: int`: Issue number.
    - `title: str`: Issue title.
    - `body: Optional[str]`: Issue body.
    - `state: str`: Issue state (`open`, `closed`).
    - `html_url: str`: HTML URL.
    - `created_at: datetime`: Created at timestamp.
    - `updated_at: datetime`: Updated at timestamp.
    - `closed_at: Optional[datetime]`: Closed at timestamp.
    - `assignees: Optional[List[Dict[str, str]]]`: List of assignees.
    - `labels: Optional[List[Dict[str, str]]]`: List of labels.
    - `user: Optional[Dict[str, str]]`: User who created the issue.

- `GitHubPullRequest(BaseModel)`: Model representing a GitHub pull request.
    - `number: int`: PR number.
    - `title: str`: PR title.
    - `body: Optional[str]`: PR body.
    - `state: str`: PR state (`open`, `closed`).
    - `html_url: str`: HTML URL.
    - `created_at: datetime`: Created at timestamp.
    - `updated_at: datetime`: Updated at timestamp.
    - `closed_at: Optional[datetime]`: Closed at timestamp.
    - `merged_at: Optional[datetime]`: Merged at timestamp.
    - `user: Optional[Dict[str, str]]`: User who created the PR.
    - `head: Dict[str, str]`: Head branch information.
    - `base: Dict[str, str]`: Base branch information.

#### Functions

- `get_repository(repo_path: str, owner: Optional[str] = None, context: Optional[DevOpsContext] = None) -> GitHubRepository`:
    - Gets a GitHub repository.
    - Parameters:
        - `repo_path (str)`: Repository path.
        - `owner (Optional[str])`: Repository owner (optional).
        - `context (Optional[DevOpsContext])`: DevOps context.
    - Returns: `GitHubRepository`: GitHubRepository object.

- `list_repositories(org: Optional[str] = None, user: Optional[str] = None, context: Optional[DevOpsContext] = None) -> List[GitHubRepository]`:
    - Lists GitHub repositories for an organization or user.
    - Parameters:
        - `org (Optional[str])`: Organization name (optional).
        - `user (Optional[str])`: Username (optional).
        - `context (Optional[DevOpsContext])`: DevOps context.
    - Returns: `List[GitHubRepository]`: List of GitHubRepository objects.

- `get_readme(repo_path: str, owner: Optional[str] = None, ref: Optional[str] = None, context: Optional[DevOpsContext] = None) -> Dict[str, Optional[str]]`:
    - Gets README file content from a GitHub repository.
    - Parameters:
        - `repo_path (str)`: Repository path.
        - `owner (Optional[str])`: Repository owner (optional).
        - `ref (Optional[str])`: Git reference (branch, tag, commit) (optional).
        - `context (Optional[DevOpsContext])`: DevOps context.
    - Returns: `Dict[str, Optional[str]]`: Dictionary with 'decoded_content' and 'encoding'.

- `list_issues(repo_path: str, owner: Optional[str] = None, filters: Optional[Dict[str, str]] = None, context: Optional[DevOpsContext] = None) -> List[GitHubIssue]`:
    - Lists issues in a GitHub repository.
    - Parameters:
        - `repo_path (str)`: Repository path.
        - `owner (Optional[str])`: Repository owner (optional).
        - `filters (Optional[Dict[str, str]])`: Filters (e.g., `{'state': 'open'}`).
        - `context (Optional[DevOpsContext])`: DevOps context.
    - Returns: `List[GitHubIssue]`: List of GitHubIssue objects.

- `create_issue(request: GitHubCreateIssueRequest, repo_path: str, owner: Optional[str] = None, context: Optional[DevOpsContext] = None) -> GitHubIssue`:
    - Creates a new issue in a GitHub repository.
    - Parameters:
        - `request (GitHubCreateIssueRequest)`: Issue creation request.
        - `repo_path (str)`: Repository path.
        - `owner (Optional[str])`: Repository owner (optional).
        - `context (Optional[DevOpsContext])`: DevOps context.
    - Returns: `GitHubIssue`: Created GitHubIssue object.

- `list_pull_requests(repo_path: str, owner: Optional[str] = None, filters: Optional[Dict[str, str]] = None, context: Optional[DevOpsContext] = None) -> List[GitHubPullRequest]`:
    - Lists pull requests in a GitHub repository.
    - Parameters:
        - `repo_path (str)`: Repository path.
        - `owner (Optional[str])`: Repository owner (optional).
        - `filters (Optional[Dict[str, str]])`: Filters (e.g., `{'state': 'open'}`).
        - `context (Optional[DevOpsContext])`: DevOps context.
    - Returns: `List[GitHubPullRequest]`: List of GitHubPullRequest objects.

### 2. Base Submodule (`github.github`)

Provides base classes and exceptions for GitHub module.

#### Classes

- `GitHubError(Exception)`: Base class for GitHub exceptions.
- `AuthenticationError(GitHubError)`: Authentication error exception.
- `RepositoryNotFoundError(GitHubError)`: Repository not found exception.
- `IssueNotFoundError(GitHubError)`: Issue not found exception.
- `PullRequestNotFoundError(GitHubError)`: Pull request not found exception.

This document provides a comprehensive API reference for the GitHub module, detailing its submodules, classes, models, and functions.