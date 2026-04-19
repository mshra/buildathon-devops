# Agentic DevOps

A fully autonomous, AI-powered DevOps platform for managing cloud infrastructure across multiple providers, with AWS and GitHub integration, powered by OpenAI's Agents SDK.

- ⭐ Try it Here: agentic-devops.fly.dev 

- 🍕 Github Repo: https://github.com/agenticsorg/devops

- 🍺 Support Agentics Foundation: https://agentics.org/memberships

## Introduction

Agentic DevOps represents the next step in infrastructure management, a fully autonomous system that doesn't just assist with DevOps tasks but can independently plan, execute, and optimize your entire infrastructure lifecycle. 

Built on the foundation of advanced AI capabilities, this platform goes beyond traditional automation by incorporating true AI-driven decision-making capabilities.

The system can autonomously:

- Provision and configure infrastructure based on high-level requirements
- Monitor and detect anomalies across your environment
- Self-heal infrastructure issues without human intervention
- Optimize resource allocation and costs continuously
- Deploy applications with intelligent rollout strategies
- Manage complex multi-environment deployments
- Learn from past operations to improve future performance

Agentic DevOps serves as an intelligent co-pilot for your infrastructure, or even as a fully autonomous operator, understanding complex requirements, executing precise commands, adapting to changing conditions, and providing valuable insights across your entire DevOps workflow. Whether you're managing AWS resources, working with GitHub repositories, or orchestrating complex deployments, Agentic DevOps provides a unified, intelligent interface that simplifies these tasks while maintaining security and best practices.

## Overview

Agentic DevOps is designed to transform cloud infrastructure management through autonomous operation and intelligent decision-making. It provides a consistent interface for working with various cloud providers and services while adding a layer of AI-driven automation that can operate independently when needed.

Key benefits include:

- **Autonomous Operation**: Deploy infrastructure and applications with minimal human oversight
- **Self-Healing Systems**: Automatically detect and remediate issues before they impact users
- **Continuous Optimization**: Intelligently adjust resources based on actual usage patterns
- **Reduced Complexity**: Manage multiple cloud services through a single, intelligent interface
- **Increased Efficiency**: Eliminate repetitive tasks through true autonomous automation
- **Enhanced Security**: Built-in security guardrails with proactive vulnerability detection
- **Natural Language Control**: Interact with your infrastructure using plain English
- **Extensibility**: Easily add support for new services and providers
- **Comprehensive Documentation**: Detailed guides and examples for all features

## Table of Contents

- [Features & Core Capabilities](#features--core-capabilities)
- [UI Components](#ui-components)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Examples](#examples)
- [Architecture](#architecture)
- [Deployment Options](#deployment-options)
- [Contributing](#contributing)
- [License](#license)

## Features & Core Capabilities

| Category | Capabilities |
|----------|--------------|
| **Autonomous Infrastructure Management** | • Self-provisioning infrastructure based on application requirements<br>• Automatic scaling based on real-time demand<br>• Intelligent resource optimization for cost efficiency<br>• Anomaly detection and autonomous remediation<br>• Predictive capacity planning<br>• Self-documenting infrastructure changes |
| **Intelligent Agents** | • Specialized agents for different DevOps domains<br>• Multi-agent collaboration for complex tasks<br>• Contextual awareness of infrastructure state<br>• Memory of past operations and outcomes<br>• Reasoning capabilities for complex problem-solving<br>• Adaptive learning from operational patterns |
| **Natural Language Interaction** | • Infrastructure management via conversational commands<br>• Complex multi-step operations from simple instructions<br>• Contextual understanding of technical requirements<br>• Clarification requests when instructions are ambiguous<br>• Explanation of actions in plain language |
| **Multi-Cloud Support** | • AWS (primary support)<br>• Azure (planned)<br>• Google Cloud (planned)<br>• DigitalOcean (planned)<br>• Unified interface across all providers<br>• Cross-cloud resource management |
| **Security and Compliance** | • Secure credential management with keyring integration<br>• Least privilege access patterns<br>• Compliance checking for industry standards<br>• Security best practice enforcement<br>• Audit logging and reporting<br>• Automated vulnerability scanning<br>• Security posture recommendations |
| **Observability and Monitoring** | • Resource health monitoring<br>• Performance metrics collection<br>• Cost tracking and optimization<br>• Anomaly detection<br>• Custom alerting rules<br>• Predictive failure analysis<br>• Root cause determination |
| **Deployment Automation** | • CI/CD pipeline integration<br>• Blue/green deployment strategies<br>• Canary releases<br>• Rollback capabilities<br>• Deployment verification<br>• Feature flag management<br>• Release train orchestration |
| **Disaster Recovery** | • Automated backup management<br>• Cross-region replication<br>• Recovery time objective (RTO) optimization<br>• Disaster recovery testing<br>• Failover automation<br>• Recovery simulation and validation |
| **Workflow Orchestration** | • Complex multi-step workflow automation<br>• Conditional execution paths<br>• Error handling and recovery<br>• Parallel task execution<br>• Human-in-the-loop approvals<br>• Workflow visualization and monitoring |
| **Knowledge Management** | • Self-documenting operations<br>• Automated runbook generation<br>• Institutional knowledge capture<br>• Best practice recommendations<br>• Troubleshooting guidance<br>• Historical context preservation |

### Autonomous Capabilities in Detail

Agentic DevOps takes automation to the next level with true autonomous capabilities:

#### Autonomous Decision Making
The platform can make informed decisions about infrastructure changes, scaling operations, and resource allocation without human intervention. It evaluates multiple factors including performance metrics, cost implications, security considerations, and business priorities to determine the optimal course of action.

#### Self-Healing Infrastructure
When issues are detected, Agentic DevOps doesn't just alert—it takes action. The system can:
- Automatically restart failed services
- Replace unhealthy instances
- Adjust resource allocations to address performance bottlenecks
- Implement temporary workarounds while developing permanent solutions
- Roll back problematic deployments

#### Continuous Learning
The platform improves over time by:
- Learning from successful and unsuccessful operations
- Building patterns of normal vs. abnormal behavior
- Adapting to your specific environment and requirements
- Refining its decision-making based on outcomes
- Incorporating feedback from human operators

#### Predictive Operations
Rather than just reacting to events, Agentic DevOps can:
- Predict resource needs before they become critical
- Identify potential failures before they occur
- Recommend preemptive maintenance
- Suggest optimizations based on usage patterns
- Schedule operations during optimal time windows

#### Autonomous Security Management
The platform continuously monitors and enhances your security posture by:
- Detecting and remediating common security misconfigurations
- Implementing security patches and updates
- Enforcing security best practices across your infrastructure
- Identifying unusual access patterns that may indicate security threats
- Automatically rotating credentials and secrets

## UI Components

Agentic DevOps includes a modern, retro-inspired terminal interface that provides intuitive access to all platform capabilities. The UI is designed to be both functional and visually engaging, with a focus on providing clear information and efficient workflows.

### Core UI Components

| Component | Description |
|-----------|-------------|
| **CommandPrompt** | Interactive terminal interface for executing DevOps commands with syntax highlighting, command history, and auto-completion. Supports AWS, GitHub, and deployment operations through a unified command language. |
| **NavigationMenu** | Provides quick access to different sections of the application including AWS resources, GitHub repositories, and deployment tools. Features intuitive icons and responsive design for both desktop and mobile use. |
| **InstanceList** | Displays EC2 instances with key information including ID, state, type, and availability zone. Supports filtering, sorting, and direct instance management actions. |
| **RepositoryList** | Shows GitHub repositories with owner, name, and description. Enables quick access to repository details and branch information for deployment operations. |
| **NotificationPanel** | Real-time updates on infrastructure events, deployment status, and system alerts. Categorized by type (email, calendar, system) for easy monitoring of DevOps operations. |
| **DevOpsContext** | State management system that maintains the current operational context across the application, ensuring consistent data access for all components. |

### UI Features

- **Retro Terminal Aesthetic**: Nostalgic green-on-black terminal interface with modern functionality
- **Responsive Design**: Fully functional on both desktop and mobile devices
- **Command-Line Interface**: Natural language and structured commands for infrastructure management
- **Real-Time Updates**: Live notifications of infrastructure changes and deployment status
- **Scrollable Menus**: Access to extensive DevOps tools and services through scrollable system menus
- **Interactive Elements**: Clickable components for quick access to detailed information
- **Accessibility**: Keyboard navigation and screen reader support for inclusive usage
- **Dark Mode**: Eye-friendly interface designed for extended use in low-light environments

### UI Integration

The UI seamlessly integrates with the backend services through a well-defined API layer:

```
┌─────────────────────────────────────────────────────────────┐
│                     UI Components                           │
├───────────┬───────────┬────────────┬────────────┬──────────┤
│ Command   │ Navigation│ Resource   │ Deployment │ Notifi-  │
│ Prompt    │ Menu      │ Viewers    │ Tools      │ cations  │
└─────┬─────┴─────┬─────┴──────┬─────┴──────┬─────┴─────┬────┘
      │           │            │            │           │
┌─────▼───────────▼────────────▼────────────▼───────────▼────┐
│                     DevOps Context & State                  │
└─────┬───────────────┬────────────────┬──────────────────────┘
      │               │                │
┌─────▼───────┐ ┌─────▼───────┐ ┌─────▼───────┐
│ AWS Service │ │ GitHub      │ │ Deployment  │
│ Layer       │ │ Service     │ │ Service     │
└─────────────┘ └─────────────┘ └─────────────┘
```

## Installation

### Prerequisites

- Python 3.8 or higher
- OpenAI API key
- AWS credentials (for AWS operations)
- GitHub token (for GitHub operations)

### Install from PyPI

```bash
pip install agentic-devops
```

### Install from Source

```bash
git clone https://github.com/agenticsorg/devops.git
cd agentic-devops
pip install -e .
```

### Environment Setup

Create a `.env` file in your project directory:

```
OPENAI_API_KEY=your-openai-api-key
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
GITHUB_TOKEN=your-github-token
```

## Quick Start

### CLI Usage

```bash
# List EC2 instances
agentic-devops ec2 list-instances --region us-east-1

# Get GitHub repository information
agentic-devops github get-repository --repo owner/repo

# Deploy from GitHub to EC2
agentic-devops deploy github-to-ec2 --repo owner/repo --branch main --instance-id i-1234567890abcdef0
```

### Python API Usage

```python
import asyncio
from agentic_devops.src.aws import list_ec2_instances
from agentic_devops.src.github import get_repository
from agentic_devops.src.core import DevOpsContext

async def main():
    # Create a context
    context = DevOpsContext(
        user_id="example-user",
        aws_region="us-east-1",
        github_org="example-org"
    )
    
    # List EC2 instances
    instances = await list_ec2_instances(region="us-east-1", context=context)
    print(f"Found {len(instances)} instances")
    
    # Get repository information
    repo = await get_repository(repo="example-org/example-repo", context=context)
    print(f"Repository: {repo.name}, Stars: {repo.stars}")

if __name__ == "__main__":
    asyncio.run(main())
```

### Using AI Agents

```python
import os
import asyncio
from agents import Agent, Runner
from agentic_devops.src.aws import list_ec2_instances, start_ec2_instances, stop_ec2_instances
from agentic_devops.src.core import DevOpsContext

async def main():
    # Set up the OpenAI API key
    os.environ["OPENAI_API_KEY"] = "your-openai-api-key"
    
    # Create a DevOps context
    context = DevOpsContext(
        user_id="agent-user",
        aws_region="us-east-1"
    )
    
    # Create an infrastructure agent
    infrastructure_agent = Agent(
        name="Infrastructure Agent",
        instructions="""
        You are an infrastructure management agent that helps with EC2 instances and other AWS resources.
        You ensure that deployment targets are properly configured and available.
        Always verify the state of infrastructure before recommending deployments.
        """,
        tools=[list_ec2_instances, start_ec2_instances, stop_ec2_instances],
        model="gpt-4o"
    )
    
    # Run the agent
    result = await Runner.run(
        infrastructure_agent,
        "List all EC2 instances in us-east-1 and stop any that are tagged as 'temporary'",
        context=context
    )
    
    # Print the result
    print(result.final_output)

if __name__ == "__main__":
    asyncio.run(main())
```

### UI Usage

```bash
# Start the UI development server
cd ui
npm install
npm run dev
```

Access the UI at http://localhost:5173 to interact with the Agentic DevOps terminal interface.

## Documentation

Comprehensive documentation is available in the [docs](docs/README.md) directory:

- [Architecture Overview](docs/architecture/overview.md)
- [API Reference](docs/api/cli-commands.md)
- [Implementation Details](docs/implementation/openai-agents-integration.md)
- [Deployment Guides](docs/deployment/aws-lambda.md)
- [User Guides](docs/guides/getting-started.md)

## Examples

The [examples](examples/) directory contains various examples demonstrating the capabilities of the framework:

- [CI/CD Pipeline Agent](examples/ci_cd_pipeline_agent.py)
- [Disaster Recovery Agent](examples/disaster_recovery_agent.py)
- [Security Compliance Agent](examples/security_compliance_agent.py)
- [GitHub to EC2 Deployment](examples/github_to_ec2_deployment.py)
- [Hello World](examples/hello_world.py)

## Architecture

Agentic DevOps follows a modular architecture with several key components:

```
┌─────────────────────────────────────────────────────────────────┐
│                     Agentic DevOps Framework                     │
├─────────────┬─────────────┬─────────────┬─────────────┬─────────┤
│             │             │             │             │         │
│  Core       │  AWS        │  GitHub     │  OpenAI     │  CLI    │
│  Components │  Integration │  Integration│  Agents     │  Layer  │
│             │             │             │  Integration │         │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────┘
```

For more details, see the [Architecture Overview](docs/architecture/overview.md).

## Deployment Options

Agentic DevOps can be deployed in various ways:

- [Local Development](docs/deployment/local-development.md)
- [AWS Lambda](docs/deployment/aws-lambda.md)
- [Docker Containers](docs/deployment/docker.md)
- [Llama Deployment](docs/deployment/llama-deployment.md)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
