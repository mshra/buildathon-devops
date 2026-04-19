# CLI Commands API Reference

This document provides a comprehensive reference for all CLI commands available in the Agentic DevOps framework.

## Command Structure

The Agentic DevOps CLI follows a hierarchical command structure:

```
agentic-devops [global options] <command group> <command> [options] [arguments]
```

- **Global Options**: Apply to all commands
- **Command Group**: Logical grouping of related commands (e.g., `ec2`, `github`)
- **Command**: Specific operation to perform (e.g., `list-instances`, `create-issue`)
- **Options**: Command-specific options
- **Arguments**: Command-specific arguments

## Global Options

| Option | Description | Default |
|--------|-------------|---------|
| `--help`, `-h` | Show help message and exit | - |
| `--debug` | Enable debug logging | `False` |
| `--version` | Show version information and exit | - |
| `--output` | Output format (json, yaml, table) | `table` |

## Command Groups

### EC2 Commands

Commands for managing AWS EC2 instances.

#### `ec2 list-instances`

List EC2 instances in a specified region.

```
agentic-devops ec2 list-instances [--region REGION] [--filters FILTERS] [--output FORMAT]
```

**Options:**
- `--region`: AWS region (default: from config or environment)
- `--filters`: Filters in JSON format (e.g., `{"state": "running"}`)
- `--output`: Output format (json, yaml, table)

**Example:**
```bash
agentic-devops ec2 list-instances --region us-east-1 --filters '{"state": "running"}' --output json
```

**Response:**
```json
[
  {
    "instance_id": "i-1234567890abcdef0",
    "instance_type": "t2.micro",
    "state": "running",
    "public_ip": "54.123.456.789",
    "private_ip": "172.31.45.67",
    "launch_time": "2023-01-01T12:00:00Z",
    "tags": {
      "Name": "web-server",
      "Environment": "production"
    }
  }
]
```

#### `ec2 start-instances`

Start one or more EC2 instances.

```
agentic-devops ec2 start-instances --instance-ids INSTANCE_IDS [--region REGION] [--wait]
```

**Options:**
- `--instance-ids`: Comma-separated list of instance IDs
- `--region`: AWS region (default: from config or environment)
- `--wait`: Wait for instances to start before returning

**Example:**
```bash
agentic-devops ec2 start-instances --instance-ids i-1234567890abcdef0,i-0987654321fedcba0 --region us-east-1 --wait
```

**Response:**
```
Successfully started instances: i-1234567890abcdef0, i-0987654321fedcba0
```

#### `ec2 stop-instances`

Stop one or more EC2 instances.

```
agentic-devops ec2 stop-instances --instance-ids INSTANCE_IDS [--region REGION] [--wait] [--force]
```

**Options:**
- `--instance-ids`: Comma-separated list of instance IDs
- `--region`: AWS region (default: from config or environment)
- `--wait`: Wait for instances to stop before returning
- `--force`: Force stop instances (similar to power off)

**Example:**
```bash
agentic-devops ec2 stop-instances --instance-ids i-1234567890abcdef0 --region us-east-1
```

**Response:**
```
Successfully stopped instances: i-1234567890abcdef0
```

#### `ec2 create-instance`

Create a new EC2 instance.

```
agentic-devops ec2 create-instance --name NAME --instance-type TYPE --ami-id AMI_ID [--region REGION] [--subnet-id SUBNET_ID] [--security-group-ids SG_IDS] [--key-name KEY_NAME] [--tags TAGS]
```

**Options:**
- `--name`: Name tag for the instance
- `--instance-type`: EC2 instance type (e.g., t2.micro)
- `--ami-id`: AMI ID to use
- `--region`: AWS region (default: from config or environment)
- `--subnet-id`: Subnet ID to launch in
- `--security-group-ids`: Comma-separated list of security group IDs
- `--key-name`: Key pair name for SSH access
- `--tags`: Tags in JSON format (e.g., `{"Environment": "production"}`)

**Example:**
```bash
agentic-devops ec2 create-instance --name web-server --instance-type t2.micro --ami-id ami-1234567890abcdef0 --region us-east-1 --key-name my-key --tags '{"Environment": "production"}'
```

**Response:**
```
Successfully created instance i-1234567890abcdef0 (web-server)
```

### GitHub Commands

Commands for managing GitHub repositories, issues, and pull requests.

#### `github get-repository`

Get information about a GitHub repository.

```
agentic-devops github get-repository --repo OWNER/REPO
```

**Options:**
- `--repo`: Repository in the format `owner/repo`

**Example:**
```bash
agentic-devops github get-repository --repo octocat/Hello-World
```

**Response:**
```json
{
  "name": "Hello-World",
  "owner": "octocat",
  "description": "My first repository on GitHub!",
  "stars": 1234,
  "forks": 567,
  "open_issues": 12,
  "default_branch": "main",
  "created_at": "2023-01-01T12:00:00Z",
  "updated_at": "2023-02-01T12:00:00Z",
  "html_url": "https://github.com/octocat/Hello-World"
}
```

#### `github list-issues`

List issues in a GitHub repository.

```
agentic-devops github list-issues --repo OWNER/REPO [--state STATE] [--labels LABELS]
```

**Options:**
- `--repo`: Repository in the format `owner/repo`
- `--state`: Issue state (open, closed, all) (default: open)
- `--labels`: Comma-separated list of labels

**Example:**
```bash
agentic-devops github list-issues --repo octocat/Hello-World --state open --labels bug,enhancement
```

**Response:**
```json
[
  {
    "number": 123,
    "title": "Fix login bug",
    "state": "open",
    "labels": ["bug", "priority:high"],
    "assignee": "developer1",
    "created_at": "2023-01-15T12:00:00Z",
    "updated_at": "2023-01-16T12:00:00Z",
    "html_url": "https://github.com/octocat/Hello-World/issues/123"
  }
]
```

#### `github create-issue`

Create a new issue in a GitHub repository.

```
agentic-devops github create-issue --repo OWNER/REPO --title TITLE [--body BODY] [--labels LABELS] [--assignees ASSIGNEES]
```

**Options:**
- `--repo`: Repository in the format `owner/repo`
- `--title`: Issue title
- `--body`: Issue body/description
- `--labels`: Comma-separated list of labels
- `--assignees`: Comma-separated list of assignees

**Example:**
```bash
agentic-devops github create-issue --repo octocat/Hello-World --title "Fix login bug" --body "The login form doesn't work in Safari" --labels bug,priority:high --assignees developer1
```

**Response:**
```json
{
  "number": 124,
  "title": "Fix login bug",
  "body": "The login form doesn't work in Safari",
  "state": "open",
  "labels": ["bug", "priority:high"],
  "assignees": ["developer1"],
  "created_at": "2023-03-01T12:00:00Z",
  "html_url": "https://github.com/octocat/Hello-World/issues/124"
}
```

#### `github list-pull-requests`

List pull requests in a GitHub repository.

```
agentic-devops github list-pull-requests --repo OWNER/REPO [--state STATE] [--base BASE]
```

**Options:**
- `--repo`: Repository in the format `owner/repo`
- `--state`: PR state (open, closed, all) (default: open)
- `--base`: Base branch filter

**Example:**
```bash
agentic-devops github list-pull-requests --repo octocat/Hello-World --state open --base main
```

**Response:**
```json
[
  {
    "number": 456,
    "title": "Add new feature",
    "state": "open",
    "user": "developer2",
    "base": "main",
    "head": "feature-branch",
    "created_at": "2023-02-15T12:00:00Z",
    "updated_at": "2023-02-16T12:00:00Z",
    "html_url": "https://github.com/octocat/Hello-World/pull/456"
  }
]
```

### Deployment Commands

Commands for managing deployments.

#### `deploy github-to-ec2`

Deploy code from a GitHub repository to an EC2 instance.

```
agentic-devops deploy github-to-ec2 --repo OWNER/REPO --branch BRANCH --instance-id INSTANCE_ID [--region REGION] [--setup-script SCRIPT] [--deploy-script SCRIPT]
```

**Options:**
- `--repo`: Repository in the format `owner/repo`
- `--branch`: Branch to deploy
- `--instance-id`: EC2 instance ID
- `--region`: AWS region (default: from config or environment)
- `--setup-script`: Path to setup script
- `--deploy-script`: Path to deployment script

**Example:**
```bash
agentic-devops deploy github-to-ec2 --repo octocat/Hello-World --branch main --instance-id i-1234567890abcdef0 --region us-east-1 --deploy-script ./deploy.sh
```

**Response:**
```
Deployment started:
- Repository: octocat/Hello-World
- Branch: main
- Instance: i-1234567890abcdef0
- Status: Success
- Deployment ID: dep-1234567890
```

## Agent Commands

Commands for working with AI agents.

#### `agent run`

Run an AI agent to perform a task.

```
agentic-devops agent run --task TASK [--agent-type TYPE] [--model MODEL]
```

**Options:**
- `--task`: Task description
- `--agent-type`: Type of agent (infrastructure, code, deployment, security)
- `--model`: LLM model to use (default: gpt-4o)

**Example:**
```bash
agentic-devops agent run --task "List all EC2 instances in us-east-1 and stop any that are tagged as 'temporary'" --agent-type infrastructure
```

**Response:**
```
Agent: Infrastructure Agent
Task: List all EC2 instances in us-east-1 and stop any that are tagged as 'temporary'

Found 3 instances in us-east-1:
- i-1234567890abcdef0 (web-server)
- i-0987654321fedcba0 (database)
- i-abcdef1234567890 (temporary-test)

Stopping instance i-abcdef1234567890 (temporary-test)...
Successfully stopped instance i-abcdef1234567890

Task completed successfully.
```

## Configuration Commands

Commands for managing configuration.

#### `config set`

Set a configuration value.

```
agentic-devops config set --key KEY --value VALUE
```

**Options:**
- `--key`: Configuration key
- `--value`: Configuration value

**Example:**
```bash
agentic-devops config set --key aws.region --value us-west-2
```

**Response:**
```
Configuration updated: aws.region = us-west-2
```

#### `config get`

Get a configuration value.

```
agentic-devops config get --key KEY
```

**Options:**
- `--key`: Configuration key

**Example:**
```bash
agentic-devops config get --key aws.region
```

**Response:**
```
aws.region = us-west-2
```

#### `config list`

List all configuration values.

```
agentic-devops config list
```

**Example:**
```bash
agentic-devops config list
```

**Response:**
```
Configuration:
- aws.region = us-west-2
- github.org = example-org
- output.format = json
```

## Error Handling

All commands follow a consistent error handling pattern:

- Non-zero exit code for errors
- Error message printed to stderr
- JSON error format when `--output json` is specified

Example error (standard output):
```
Error: Failed to list EC2 instances: AccessDenied - User is not authorized to perform ec2:DescribeInstances
```

Example error (JSON output):
```json
{
  "error": {
    "code": "AccessDenied",
    "message": "User is not authorized to perform ec2:DescribeInstances",
    "request_id": "abcd1234-ef56-7890-abcd-ef1234567890"
  }
}
```

## Environment Variables

The CLI respects the following environment variables:

| Variable | Description | Equivalent Config |
|----------|-------------|------------------|
| `OPENAI_API_KEY` | OpenAI API key | - |
| `AWS_ACCESS_KEY_ID` | AWS access key ID | - |
| `AWS_SECRET_ACCESS_KEY` | AWS secret access key | - |
| `AWS_REGION` | Default AWS region | `aws.region` |
| `GITHUB_TOKEN` | GitHub personal access token | - |
| `AGENTIC_DEVOPS_OUTPUT` | Default output format | `output.format` |
| `AGENTIC_DEVOPS_DEBUG` | Enable debug logging | `debug` |

## Using the CLI in Scripts

The CLI is designed to be easily used in scripts:

- JSON output format for easy parsing
- Consistent exit codes
- Minimal interactive prompts

Example bash script:
```bash
#!/bin/bash
set -e

# List running instances
INSTANCES=$(agentic-devops ec2 list-instances --region us-east-1 --filters '{"state": "running"}' --output json)

# Count instances
COUNT=$(echo $INSTANCES | jq length)
echo "Found $COUNT running instances"

# Stop each instance
for ID in $(echo $INSTANCES | jq -r '.[].instance_id'); do
  echo "Stopping instance $ID"
  agentic-devops ec2 stop-instances --instance-ids $ID --region us-east-1
done
```

## Related Documentation

- [AWS Module API](aws-module.md)
- [GitHub Module API](github-module.md)
- [Core Module API](core-module.md)
- [Agent Tools API](agent-tools.md)