# GitHub Module

The `github` module provides tools and functionalities for interacting with GitHub. It allows agents to manage repositories, issues, and pull requests.

## Submodules

- [Repositories](#repositories)
- [Issues](#issues)
- [Pull Requests](#pull-requests)

## Repositories

The `repositories` submodule provides tools for managing GitHub repositories. It includes functionalities for:

- Getting repository details
- Listing repositories for an organization or user
- Getting repository README content

### Models

- `GitHubRepoRequest`: Model for requesting repository information.
- `GitHubRepository`: Model representing a GitHub repository with its attributes.

### Tools

- `get_repository(repo_path: str, owner: Optional[str] = None)`: Retrieves details of a GitHub repository.
- `list_repositories(org: Optional[str] = None, user: Optional[str] = None)`: Lists GitHub repositories for a given organization or user.
- `get_readme(repo_path: str, owner: Optional[str] = None, ref: Optional[str] = None)`: Retrieves the README content of a GitHub repository.

## Issues

The `issues` submodule provides tools for managing GitHub issues. It includes functionalities for:

- Listing issues in a repository
- Creating new issues

### Models

- `GitHubIssueRequest`: Model for requesting issue information.
- `GitHubCreateIssueRequest`: Model for requesting the creation of a new issue.
- `GitHubIssue`: Model representing a GitHub issue with its attributes.

### Tools

- `list_issues(repo_path: str, owner: Optional[str] = None, filters: Optional[Dict[str, str]] = None)`: Lists issues in a GitHub repository, optionally filtering by various criteria.
- `create_issue(request: GitHubCreateIssueRequest, repo_path: str, owner: Optional[str] = None)`: Creates a new issue in a GitHub repository.

## Pull Requests

The `pull-requests` submodule provides tools for managing GitHub pull requests. It includes functionalities for:

- Listing pull requests in a repository

### Models

- `GitHubPRRequest`: Model for requesting pull request information.
- `GitHubPullRequest`: Model representing a GitHub pull request with its attributes.

### Tools

- `list_pull_requests(repo_path: str, owner: Optional[str] = None, filters: Optional[Dict[str, str]] = None)`: Lists pull requests in a GitHub repository, optionally filtering by various criteria.

## Usage

For detailed usage examples, please refer to the [examples directory](../../examples).