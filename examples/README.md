# Agentic DevOps Examples

This directory contains example scripts that demonstrate how to use the Agentic DevOps framework. These examples range from simple CLI usage to complex multi-step agent workflows.

## CLI Examples

These scripts demonstrate how to use the command-line interface:

- `run_cli.py` - Main CLI runner script
- `run_cli_help.py` - Shows main help information
- `run_cli_ec2_help.py` - Shows EC2 commands help
- `run_cli_ec2_list_help.py` - Shows EC2 list-instances help
- `run_cli_github_help.py` - Shows GitHub commands help
- `run_cli_deploy_help.py` - Shows deployment commands help

### Running the CLI Examples

```bash
# Show main help
python run_cli.py --help

# Show EC2 commands
python run_cli.py ec2 --help

# List EC2 instances
python run_cli.py ec2 list-instances --output table

# Get GitHub repository details
python run_cli.py github get-repo owner/repo-name

# Deploy from GitHub to EC2
python run_cli.py deploy github-to-ec2 --repo owner/repo-name --instance-id i-1234567890abcdef0
```

## OpenAI Agents Examples

These examples demonstrate how to use the OpenAI Agents SDK integration:

### Prerequisites for Agent Examples

Before running the agent examples, you need to:

1. Install the OpenAI Agents SDK:
   ```bash
   pip install openai-agents
   ```

2. Set your OpenAI API key as an environment variable:
   ```bash
   export OPENAI_API_KEY=your_api_key_here
   ```

### Basic Examples

- `hello_world.py` - Simple example showing basic agent usage
- `openai_agents_example.py` - Basic example of using agents for DevOps tasks
- `openai_agents_ec2_example.py` - Example focused on EC2 operations
- `openai_agents_github_example.py` - Example focused on GitHub operations
- `openai_agents_deployment_example.py` - Example focused on deployment operations
- `github_to_ec2_deployment.py` - Example of deploying from GitHub to EC2

### Advanced Multi-Step Workflow Examples

- `ci_cd_pipeline_agent.py` - Complex CI/CD pipeline management with multiple specialized agents
- `disaster_recovery_agent.py` - Disaster recovery operations with backup and recovery agents
- `security_compliance_agent.py` - Security compliance operations with scanning, remediation, and reporting agents

### Running the Agent Examples

After installing the prerequisites, you can run any of the examples:

```bash
# Run the hello world example
python hello_world.py

# Run the basic DevOps agent example
python openai_agents_example.py

# Run the CI/CD pipeline agent example
python ci_cd_pipeline_agent.py

# Run the disaster recovery agent example
python disaster_recovery_agent.py

# Run the security compliance agent example
python security_compliance_agent.py
```

If you encounter an error about missing modules, make sure you've installed all the required dependencies:

```bash
pip install -r agentic_devops/requirements.txt
```

## Example Features

### CI/CD Pipeline Management Agent

This example demonstrates a complex multi-step workflow for managing CI/CD pipelines using specialized agents:
- Infrastructure Agent: Manages EC2 instances and other AWS resources
- Code Agent: Handles GitHub repositories, pull requests, and code quality
- Deployment Agent: Executes deployments to different environments

Features:
- Custom models for deployment environments and plans
- Custom tools for validating and executing deployments
- Guardrails for deployment safety
- Multi-step workflow with dependencies between environments
- Error handling and prerequisite checking

### Disaster Recovery Agent

This example demonstrates a complex multi-step workflow for disaster recovery operations using specialized agents:
- Backup Agent: Manages backup information and selection
- Infrastructure Agent: Manages EC2 instances and other AWS resources
- Recovery Agent: Executes recovery operations

Features:
- Custom models for backups, recovery targets, and plans
- Custom tools for listing backups, validating and executing recovery plans
- Guardrails for recovery safety
- Prioritization of critical resources and dependency management
- Error handling and prerequisite checking

### Security Compliance Agent

This example demonstrates a complex multi-step workflow for security compliance operations using specialized agents:
- Security Scanner Agent: Identifies security issues in infrastructure
- Compliance Agent: Checks infrastructure against security frameworks
- Remediation Agent: Creates and executes remediation plans
- Security Reporting Agent: Generates comprehensive security reports

Features:
- Custom models for security findings, compliance checks, and remediation actions
- Custom tools for scanning, compliance checking, remediation, and reporting
- Guardrails for security operations
- Risk-based prioritization and comprehensive reporting
- Error handling and prerequisite checking

## Prerequisites

- Python 3.8+
- OpenAI API key (for agent examples)
- AWS credentials (for AWS operations)
- GitHub token (for GitHub operations)

## Configuration

The examples use the configuration and credential management from the Agentic DevOps framework. See the main documentation for details on setting up credentials and configuration.

## Troubleshooting

If you encounter issues running the examples:

1. Make sure you have installed all required dependencies:
   ```bash
   pip install -r agentic_devops/requirements.txt
   ```

2. Ensure your OpenAI API key is set correctly:
   ```bash
   export OPENAI_API_KEY=your_api_key_here
   ```

3. Check that you're running the examples from the root directory of the repository.

4. For AWS and GitHub operations, ensure you have the appropriate credentials configured.