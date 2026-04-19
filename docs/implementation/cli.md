# Command Line Interface (CLI) Module (`cli.py`)

## Overview

The `cli.py` module provides a command-line interface (CLI) for the Agentic DevOps framework. It allows users to interact with the framework's functionalities directly from the terminal, enabling DevOps operations to be executed through simple commands. The CLI is built using `argparse` and supports various command groups and options for managing AWS EC2 instances, GitHub repositories, and deployment workflows.

## Getting Started

To use the CLI, ensure that the `agentic_devops` package is installed in your Python environment. You can then execute the `run_cli.py` script from the project root or, if installed as a package, use the `devops-agent` command directly from your terminal.

## Command Structure

The CLI is organized into main command groups, each focusing on a specific area of DevOps operations:

```
run_cli.py <command_group> <command> [options]
```

### Command Groups

1. **`ec2`**: Commands for managing Amazon EC2 instances.
2. **`github`**: Commands for interacting with GitHub repositories and issues.
3. **`deploy`**: Commands for deployment-related operations.

## Commands and Options

### 1. `ec2` Command Group

Provides commands for managing EC2 instances.

- **`list-instances`**: Lists EC2 instances based on specified filters.
    - Options:
        - `--state <instance_state>`: Filter instances by state (e.g., `running`, `stopped`).
        - `--region <aws_region>`: Specify the AWS region.
        - `--output <format>`: Output format (`json` or `table`, default: `table`).
    - Example: `run_cli.py ec2 list-instances --state running --region us-west-2 --output table`

- **`get-instance`**: Retrieves details of a specific EC2 instance.
    - Arguments:
        - `<instance_id>`: EC2 instance ID.
    - Options:
        - `--region <aws_region>`: Specify the AWS region.
        - `--output <format>`: Output format (`json` or `table`, default: `table`).
    - Example: `run_cli.py ec2 get-instance i-xxxxxxxxxxxxx --region us-east-1 --output json`

- **`create-instance`**: Creates a new EC2 instance.
    - Options:
        - `--name <instance_name>`: Name tag for the instance.
        - `--type <instance_type>`: Instance type (e.g., `t2.micro`).
        - `--ami-id <ami_id>`: AMI ID for the instance.
        - `--subnet-id <subnet_id>`: Subnet ID to launch the instance in.
        - `--security-group-ids <sg_ids>`: Comma-separated security group IDs.
        - `--key-name <key_name>`: Key pair name for SSH access.
        - `--region <aws_region>`: Specify the AWS region.
        - `--wait`: Wait for instance to be in `running` state (default: True).
    - Example: `run_cli.py ec2 create-instance --name my-instance --type t2.micro --ami-id ami-xxxxxxxx --region us-east-1 --key-name my-key`

- **`start-instance`**: Starts an EC2 instance.
    - Arguments:
        - `<instance_id>`: EC2 instance ID.
    - Options:
        - `--region <aws_region>`: Specify the AWS region.
        - `--wait`: Wait for instance to be in `running` state (default: True).
    - Example: `run_cli.py ec2 start-instance i-xxxxxxxxxxxxx --region us-west-2 --wait`

- **`stop-instance`**: Stops an EC2 instance.
    - Arguments:
        - `<instance_id>`: EC2 instance ID.
    - Options:
        - `--region <aws_region>`: Specify the AWS region.
        - `--force`: Force stop instance (default: False).
        - `--wait`: Wait for instance to be in `stopped` state (default: True).
    - Example: `run_cli.py ec2 stop-instance i-xxxxxxxxxxxxx --region us-east-1 --force --wait`

- **`terminate-instance`**: Terminates an EC2 instance.
    - Arguments:
        - `<instance_id>`: EC2 instance ID.
    - Options:
        - `--region <aws_region>`: Specify the AWS region.
        - `--wait`: Wait for instance to be in `terminated` state (default: True).
    - Example: `run_cli.py ec2 terminate-instance i-xxxxxxxxxxxxx --region us-west-2 --wait`

- **`deploy-from-github`**: Deploys an application from a GitHub repository to an EC2 instance.
    - Options:
        - `--instance-id <instance_id>`: EC2 instance ID.
        - `--repo <github_repo>`: GitHub repository path (`owner/repo`).
        - `--branch <branch_name>`: GitHub branch to deploy (default: `main`).
        - `--path <deploy_path>`: Deployment path on the EC2 instance (default: `/var/www/html`).
        - `--setup-script <script_path>`: Path to a setup script to run after deployment.
        - `--region <aws_region>`: Specify the AWS region.
    - Example: `run_cli.py ec2 deploy-from-github --instance-id i-xxxxxxxxxxxxx --repo owner/repo --branch main --path /var/www/html --region us-east-1`

### 2. `github` Command Group

Provides commands for interacting with GitHub repositories.

- **`list-repos`**: Lists GitHub repositories for an organization or user.
    - Options:
        - `--org <github_org>`: GitHub organization name.
        - `--user <github_user>`: GitHub username.
        - `--output <format>`: Output format (`json` or `table`, default: `table`).
    - Example: `run_cli.py github list-repos --org example-org --output table`

- **`get-repo`**: Retrieves details of a specific GitHub repository.
    - Arguments:
        - `<repo_path>`: GitHub repository path (`owner/repo` or `repo_name` if `--owner` is provided).
    - Options:
        - `--owner <github_owner>`: Repository owner (if `repo_path` is just the repo name).
        - `--output <format>`: Output format (`json` or `table`, default: `table`).
    - Example: `run_cli.py github get-repo owner/repo-name --output json`

- **`get-readme`**: Retrieves the README content of a GitHub repository.
    - Arguments:
        - `<repo_path>`: GitHub repository path (`owner/repo` or `repo_name` if `--owner` is provided).
    - Options:
        - `--owner <github_owner>`: Repository owner (if `repo_path` is just the repo name).
        - `--ref <branch/tag/commit>`: Git reference (branch, tag, or commit SHA).
    - Example: `run_cli.py github get-readme owner/repo-name --ref main`

- **`list-branches`**: Lists branches in a GitHub repository.
    - Arguments:
        - `<repo_path>`: GitHub repository path (`owner/repo` or `repo_name` if `--owner` is provided).
    - Options:
        - `--owner <github_owner>`: Repository owner (if `repo_path` is just the repo name).
        - `--output <format>`: Output format (`json` or `table`, default: `table`).
    - Example: `run_cli.py github list-branches owner/repo-name --output table`

### 3. `deploy` Command Group

Provides commands for deployment operations.

- **`github-to-ec2`**: Deploys an application from a GitHub repository to an EC2 instance (same as `ec2 deploy-from-github`).
    - Options: (same as `ec2 deploy-from-github`)
    - Example: `run_cli.py deploy github-to-ec2 --instance-id i-xxxxxxxxxxxxx --repo owner/repo --branch main --path /var/www/html --region us-east-1`

- **`github-to-s3`**: Deploys a static website from a GitHub repository to an AWS S3 bucket (not yet implemented).
    - Options:
        - `--repo <github_repo>`: GitHub repository path (`owner/repo`).
        - `--bucket <s3_bucket_name>`: AWS S3 bucket name.
        - `--branch <branch_name>`: GitHub branch to deploy (default: `main`).
        - `--source-dir <source_directory>`: Source directory within the repository (default: root).
        - `--region <aws_region>`: Specify the AWS region.
    - Example: `run_cli.py deploy github-to-s3 --repo owner/repo --bucket my-bucket --branch main --region us-west-2`

## Global Options

- `--debug`: Enables debug logging for verbose output.

## Error Handling

The CLI provides informative error messages for common issues, including credential errors, AWS and GitHub API errors, and validation errors. It also provides suggestions to resolve common problems.

## Examples

For more usage examples, refer to the [examples directory](../../examples). You can also use `run_cli.py --help` or `run_cli.py <command-group> --help` to get detailed help on commands and options.

This document provides a comprehensive guide to using the Agentic DevOps CLI, including command structure, options, and examples.