#!/usr/bin/env python3
"""
CI/CD Pipeline Management Agent Example

This example demonstrates a complex multi-step workflow for managing CI/CD pipelines
using the OpenAI Agents SDK with the DevOps agent. It shows how to:

1. Create specialized agents for different parts of the CI/CD pipeline
2. Orchestrate them to work together
3. Implement guardrails for security and validation
4. Handle multi-step workflows with dependencies

Prerequisites:
- Install the OpenAI Agents SDK: pip install openai-agents
- Set the OPENAI_API_KEY environment variable
"""

import os
import sys
import asyncio
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# Add the parent directory to the path so we can import the agentic_devops module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import the agents module
try:
    from agents import Agent, Runner, GuardrailFunctionOutput, InputGuardrail, input_guardrail, RunContextWrapper
    # The RunContext might not be available in the installed version
    try:
        from agents.types import RunContext
    except ImportError:
        # Create a simple RunContext replacement if it's not available
        class RunContext:
            """Simple replacement for RunContext if it's not available."""
            pass
except ImportError as e:
    print(f"Error importing agents module: {e}")
    print("Please install it using: pip install openai-agents")
    print("Then set your OPENAI_API_KEY environment variable")
    exit(1)

# Import DevOps agent components
try:
    from agentic_devops.src.core import DevOpsContext, security_guardrail, sensitive_info_guardrail
    from agentic_devops.src.aws import (
        list_ec2_instances,
        start_ec2_instances,
        stop_ec2_instances,
        create_ec2_instance
    )
    from agentic_devops.src.github import (
        get_repository,
        list_issues,
        create_issue,
        list_pull_requests
    )
except ImportError as e:
    print(f"Error importing agentic_devops modules: {e}")
    print("Make sure you're running this script from the root of the repository.")
    exit(1)

# Define custom models for CI/CD pipeline management
class DeploymentEnvironment(BaseModel):
    """Model representing a deployment environment."""
    name: str = Field(..., description="Name of the environment (e.g., dev, staging, production)")
    instance_id: str = Field(..., description="EC2 instance ID for the environment")
    region: str = Field(..., description="AWS region for the environment")
    repository: str = Field(..., description="GitHub repository for deployment")
    branch: str = Field(..., description="Branch to deploy")

class DeploymentPlan(BaseModel):
    """Model representing a deployment plan."""
    environments: List[DeploymentEnvironment] = Field(..., description="Environments to deploy to")
    sequential: bool = Field(True, description="Whether to deploy sequentially or in parallel")
    approval_required: bool = Field(False, description="Whether approval is required between environments")

# Define custom tools for CI/CD pipeline management
async def validate_deployment_plan(plan: DeploymentPlan, context: Optional[Any] = None) -> dict:
    """
    Validate a deployment plan to ensure it's safe and follows best practices.
    
    Args:
        plan: The deployment plan to validate
        
    Returns:
        A dictionary with validation results
    """
    # In a real implementation, this would check for various conditions
    issues = []
    
    # Check for production deployments
    for env in plan.environments:
        if env.name.lower() == "production" and not plan.approval_required:
            issues.append("Production deployments should require approval")
    
    return {
        "valid": len(issues) == 0,
        "issues": issues
    }

async def create_deployment_issue(
    repository: str, 
    title: str, 
    body: str, 
    context: Optional[Any] = None
) -> dict:
    """
    Create a deployment tracking issue in GitHub.
    
    Args:
        repository: The GitHub repository (owner/repo)
        title: Issue title
        body: Issue body
        
    Returns:
        The created issue
    """
    # This would use the GitHub API in a real implementation
    return {
        "number": 123,
        "title": title,
        "body": body,
        "html_url": f"https://github.com/{repository}/issues/123"
    }

async def execute_deployment(
    environment: DeploymentEnvironment,
    context: Optional[Any] = None
) -> dict:
    """
    Execute a deployment to an environment.
    
    Args:
        environment: The environment to deploy to
        
    Returns:
        Deployment results
    """
    # This would perform the actual deployment in a real implementation
    return {
        "status": "success",
        "environment": environment.name,
        "instance_id": environment.instance_id,
        "repository": environment.repository,
        "branch": environment.branch,
        "timestamp": "2023-01-01T12:00:00Z"
    }

# Define a guardrail for deployment safety
class DeploymentSafetyOutput(BaseModel):
    """Output model for deployment safety check guardrail."""
    is_unsafe: bool = Field(
        description="Whether the deployment practice is unsafe"
    )
    reasoning: str = Field(
        description="Reasoning for the safety determination"
    )

@input_guardrail
async def deployment_safety_guardrail(
    ctx: RunContextWrapper,
    agent: Agent,
    input_text: str
) -> GuardrailFunctionOutput:
    """
    Guardrail to prevent unsafe deployment practices.
    
    Args:
        ctx: Run context
        agent: The agent being used
        input_text: The user input to check
        
    Returns:
        GuardrailFunctionOutput indicating if the input is safe
    """
    unsafe_patterns = [
        "force deploy",
        "skip tests",
        "bypass approval",
        "ignore checks"
    ]
    
    for pattern in unsafe_patterns:
        if pattern in input_text.lower():
            output_info = DeploymentSafetyOutput(
                is_unsafe=True,
                reasoning=f"Unsafe deployment practice detected: '{pattern}'. "
                        f"This could lead to unstable deployments or security issues."
            )
            return GuardrailFunctionOutput(
                tripwire_triggered=True,
                output_info=output_info
            )
    
    output_info = DeploymentSafetyOutput(
        is_unsafe=False,
        reasoning="No unsafe deployment practices detected."
    )
    return GuardrailFunctionOutput(
        tripwire_triggered=False,
        output_info=output_info
    )

async def main():
    """Run the CI/CD pipeline management example."""
    # Set up the OpenAI API key
    if "OPENAI_API_KEY" not in os.environ:
        print("Please set the OPENAI_API_KEY environment variable")
        return
    
    # Create a DevOps context
    context = DevOpsContext(
        user_id="ci-cd-user",
        aws_region="us-west-2",
        github_org="example-org"
    )
    
    # Create specialized agents for different aspects of CI/CD
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
    
    code_agent = Agent(
        name="Code Agent",
        instructions="""
        You are a code management agent that helps with GitHub repositories, pull requests, and code quality.
        You check for open pull requests, recent commits, and workflow runs to ensure code is ready for deployment.
        Always verify that CI checks have passed before recommending deployments.
        """,
        tools=[get_repository, list_pull_requests],
        model="gpt-4o"
    )
    
    deployment_agent = Agent(
        name="Deployment Agent",
        instructions="""
        You are a deployment agent that helps execute deployments to different environments.
        You create deployment plans, validate them, and execute them safely.
        Always follow the deployment sequence: dev -> staging -> production.
        Always create tracking issues for deployments and update them with results.
        """,
        tools=[
            validate_deployment_plan, 
            create_deployment_issue, 
            execute_deployment
        ],
        model="gpt-4o"
    )
    
    # Create an orchestrator agent with handoffs to specialized agents
    ci_cd_agent = Agent(
        name="CI/CD Pipeline Orchestrator",
        instructions="""
        You are a CI/CD pipeline orchestrator that helps users manage their continuous integration and deployment workflows.
        You can delegate tasks to specialized agents for infrastructure, code, and deployment operations.
        
        Help users understand the current state of their infrastructure and code, and guide them through the deployment process.
        
        Always follow these principles:
        1. Safety first - never recommend unsafe deployment practices
        2. Verify before deploy - check infrastructure and code status
        3. Follow proper sequence - dev -> staging -> production
        4. Track everything - create issues for deployments and update them
        
        When a user wants to deploy, help them create a proper deployment plan and execute it safely.
        """,
        handoffs=[
            {
                "agent": infrastructure_agent,
                "description": "Handles infrastructure management tasks"
            },
            {
                "agent": code_agent,
                "description": "Handles code and repository management tasks"
            },
            {
                "agent": deployment_agent,
                "description": "Handles deployment execution tasks"
            }
        ],
        input_guardrails=[security_guardrail, deployment_safety_guardrail],
        output_guardrails=[sensitive_info_guardrail],
        model="gpt-4o"
    )
    
    # Run the CI/CD agent with a complex multi-step workflow
    print("Running CI/CD Pipeline Orchestrator agent...")
    result = await Runner.run(
        ci_cd_agent,
        """
        I need to deploy our latest code from the main branch of example-org/web-app repository.
        First, I want to check if our infrastructure is ready in all environments.
        Then, verify that all CI checks are passing on the main branch.
        Finally, create a deployment plan to deploy sequentially to dev, staging, and production,
        with approval required before production deployment.
        """,
        context=context
    )
    
    # Print the result
    print("\nFinal output:")
    print(result.final_output)


if __name__ == "__main__":
    asyncio.run(main())