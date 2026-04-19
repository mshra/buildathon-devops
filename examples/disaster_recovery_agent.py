#!/usr/bin/env python3
"""
Disaster Recovery Agent Example

This example demonstrates a complex multi-step workflow for disaster recovery operations
using the OpenAI Agents SDK with the DevOps agent. It shows how to:

1. Create specialized agents for backup, monitoring, and recovery operations
2. Implement a decision-making process for recovery scenarios
3. Use guardrails to ensure safe recovery operations
4. Handle complex recovery workflows with multiple dependencies

Prerequisites:
- Install the OpenAI Agents SDK: pip install openai-agents
- Set the OPENAI_API_KEY environment variable
"""

import os
import sys
import asyncio
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

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
        create_issue
    )
except ImportError as e:
    print(f"Error importing agentic_devops modules: {e}")
    print("Make sure you're running this script from the root of the repository.")
    exit(1)

# Define custom models for disaster recovery
class RecoveryPriority(str, Enum):
    """Priority levels for recovery operations."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class BackupInfo(BaseModel):
    """Model representing backup information."""
    id: str = Field(..., description="Backup ID")
    resource_id: str = Field(..., description="ID of the backed-up resource")
    resource_type: str = Field(..., description="Type of resource (e.g., ec2, rds)")
    timestamp: str = Field(..., description="Timestamp of the backup")
    size_gb: float = Field(..., description="Size of the backup in GB")
    status: str = Field(..., description="Status of the backup")
    encrypted: bool = Field(..., description="Whether the backup is encrypted")

class RecoveryTarget(BaseModel):
    """Model representing a recovery target."""
    resource_id: str = Field(..., description="ID of the resource to recover")
    resource_type: str = Field(..., description="Type of resource (e.g., ec2, rds)")
    region: str = Field(..., description="AWS region for the resource")
    priority: RecoveryPriority = Field(..., description="Recovery priority")
    dependencies: List[str] = Field(default_factory=list, description="Dependencies that must be recovered first")

class RecoveryPlan(BaseModel):
    """Model representing a recovery plan."""
    targets: List[RecoveryTarget] = Field(..., description="Targets to recover")
    backup_id: Optional[str] = Field(None, description="Specific backup ID to use, if any")
    point_in_time: Optional[str] = Field(None, description="Point-in-time to recover to, if applicable")
    notify_on_completion: bool = Field(True, description="Whether to send notifications on completion")

# Define custom tools for disaster recovery
async def list_available_backups(
    resource_type: Optional[str] = None,
    resource_id: Optional[str] = None,
    context: Optional[Any] = None
) -> List[BackupInfo]:
    """
    List available backups for resources.
    
    Args:
        resource_type: Optional filter by resource type
        resource_id: Optional filter by resource ID
        
    Returns:
        List of available backups
    """
    # This would query actual backup systems in a real implementation
    backups = [
        BackupInfo(
            id="bkp-12345",
            resource_id="i-abcdef123456",
            resource_type="ec2",
            timestamp="2023-01-01T00:00:00Z",
            size_gb=50.0,
            status="available",
            encrypted=True
        ),
        BackupInfo(
            id="bkp-67890",
            resource_id="i-abcdef123456",
            resource_type="ec2",
            timestamp="2023-01-02T00:00:00Z",
            size_gb=50.5,
            status="available",
            encrypted=True
        ),
        BackupInfo(
            id="bkp-54321",
            resource_id="db-12345",
            resource_type="rds",
            timestamp="2023-01-01T00:00:00Z",
            size_gb=100.0,
            status="available",
            encrypted=True
        )
    ]
    
    # Apply filters
    if resource_type:
        backups = [b for b in backups if b.resource_type == resource_type]
    if resource_id:
        backups = [b for b in backups if b.resource_id == resource_id]
        
    return backups

async def validate_recovery_plan(
    plan: RecoveryPlan,
    context: Optional[Any] = None
) -> dict:
    """
    Validate a recovery plan to ensure it's feasible and safe.
    
    Args:
        plan: The recovery plan to validate
        
    Returns:
        Validation results
    """
    # This would perform actual validation in a real implementation
    issues = []
    warnings = []
    
    # Check if specified backup exists
    if plan.backup_id:
        backups = await list_available_backups()
        if plan.backup_id not in [b.id for b in backups]:
            issues.append(f"Backup {plan.backup_id} not found")
    
    # Check for circular dependencies
    dependency_graph = {target.resource_id: target.dependencies for target in plan.targets}
    for resource_id, deps in dependency_graph.items():
        for dep in deps:
            if dep not in [t.resource_id for t in plan.targets]:
                warnings.append(f"Dependency {dep} for {resource_id} is not in the recovery plan")
    
    # Check for critical resources
    critical_targets = [t for t in plan.targets if t.priority == RecoveryPriority.CRITICAL]
    if critical_targets and not plan.notify_on_completion:
        warnings.append("Critical resources are being recovered but notifications are disabled")
    
    return {
        "valid": len(issues) == 0,
        "issues": issues,
        "warnings": warnings
    }

async def execute_recovery(
    plan: RecoveryPlan,
    context: Optional[Any] = None
) -> dict:
    """
    Execute a recovery plan.
    
    Args:
        plan: The recovery plan to execute
        
    Returns:
        Recovery results
    """
    # This would perform actual recovery in a real implementation
    results = []
    
    # Sort targets by priority and dependencies
    sorted_targets = sorted(
        plan.targets,
        key=lambda t: (
            {"critical": 0, "high": 1, "medium": 2, "low": 3}[t.priority],
            len(t.dependencies)
        )
    )
    
    for target in sorted_targets:
        # Simulate recovery
        results.append({
            "resource_id": target.resource_id,
            "resource_type": target.resource_type,
            "status": "recovered",
            "timestamp": "2023-01-03T12:00:00Z",
            "backup_used": plan.backup_id or "latest"
        })
    
    return {
        "status": "success",
        "recovered_resources": len(results),
        "results": results
    }

async def create_recovery_report(
    recovery_results: dict,
    repository: str,
    context: Optional[Any] = None
) -> dict:
    """
    Create a recovery report as a GitHub issue.
    
    Args:
        recovery_results: Results from the recovery operation
        repository: GitHub repository to create the issue in
        
    Returns:
        The created issue
    """
    # Format the report
    report_body = f"# Disaster Recovery Report\n\n"
    report_body += f"Status: {recovery_results['status']}\n"
    report_body += f"Recovered Resources: {recovery_results['recovered_resources']}\n\n"
    report_body += "## Details\n\n"
    
    for result in recovery_results['results']:
        report_body += f"- {result['resource_type']} {result['resource_id']}: {result['status']}\n"
    
    # Create the issue
    return {
        "number": 456,
        "title": "Disaster Recovery Report",
        "body": report_body,
        "html_url": f"https://github.com/{repository}/issues/456"
    }

# Define a guardrail for recovery safety
class RecoverySafetyOutput(BaseModel):
    """Output model for recovery safety check guardrail."""
    is_unsafe: bool = Field(
        description="Whether the recovery operation is unsafe"
    )
    reasoning: str = Field(
        description="Reasoning for the safety determination"
    )

@input_guardrail
async def recovery_safety_guardrail(
    ctx: RunContextWrapper,
    agent: Agent,
    input_text: str
) -> GuardrailFunctionOutput:
    """
    Guardrail to prevent unsafe recovery operations.
    
    Args:
        ctx: Run context
        agent: The agent being used
        input_text: The user input to check
        
    Returns:
        GuardrailFunctionOutput indicating if the input is safe
    """
    unsafe_patterns = [
        "delete backup",
        "remove all backups",
        "overwrite production",
        "force recovery without validation"
    ]
    
    for pattern in unsafe_patterns:
        if pattern in input_text.lower():
            output_info = RecoverySafetyOutput(
                is_unsafe=True,
                reasoning=f"Unsafe recovery operation detected: '{pattern}'. "
                        f"This could lead to data loss or service disruption."
            )
            return GuardrailFunctionOutput(
                tripwire_triggered=True,
                output_info=output_info
            )
    
    output_info = RecoverySafetyOutput(
        is_unsafe=False,
        reasoning="No unsafe recovery operations detected."
    )
    return GuardrailFunctionOutput(
        tripwire_triggered=False,
        output_info=output_info
    )

async def main():
    """Run the disaster recovery agent example."""
    # Set up the OpenAI API key
    if "OPENAI_API_KEY" not in os.environ:
        print("Please set the OPENAI_API_KEY environment variable")
        return
    
    # Create a DevOps context
    context = DevOpsContext(
        user_id="recovery-admin",
        aws_region="us-west-2",
        github_org="example-org"
    )
    
    # Create specialized agents for different aspects of disaster recovery
    backup_agent = Agent(
        name="Backup Agent",
        instructions="""
        You are a backup management agent that helps users find and manage their backups.
        You can list available backups, provide details about them, and recommend which ones to use for recovery.
        Always prioritize the most recent successful backups unless there's a specific reason not to.
        """,
        tools=[list_available_backups],
        model="gpt-4o"
    )
    
    infrastructure_agent = Agent(
        name="Infrastructure Agent",
        instructions="""
        You are an infrastructure management agent that helps with EC2 instances and other AWS resources.
        You help assess the current state of infrastructure and assist with recovery operations.
        Always verify the state of infrastructure before and after recovery operations.
        """,
        tools=[list_ec2_instances, start_ec2_instances, stop_ec2_instances],
        model="gpt-4o"
    )
    
    recovery_agent = Agent(
        name="Recovery Agent",
        instructions="""
        You are a recovery agent that helps execute recovery operations.
        You create recovery plans, validate them, and execute them safely.
        Always prioritize critical resources and respect dependencies.
        Always create detailed reports of recovery operations.
        """,
        tools=[
            validate_recovery_plan, 
            execute_recovery, 
            create_recovery_report
        ],
        model="gpt-4o"
    )
    
    # Create an orchestrator agent with handoffs to specialized agents
    disaster_recovery_agent = Agent(
        name="Disaster Recovery Orchestrator",
        instructions="""
        You are a disaster recovery orchestrator that helps users recover from incidents and outages.
        You can delegate tasks to specialized agents for backups, infrastructure, and recovery operations.
        
        Help users understand the current state of their backups and infrastructure, and guide them through the recovery process.
        
        Always follow these principles:
        1. Safety first - never recommend operations that could cause data loss
        2. Validate before recovery - check backup status and recovery plan
        3. Follow proper sequence - respect dependencies between resources
        4. Document everything - create detailed reports of recovery operations
        
        When a user wants to recover resources, help them create a proper recovery plan and execute it safely.
        """,
        handoffs=[
            {
                "agent": backup_agent,
                "description": "Handles backup management tasks"
            },
            {
                "agent": infrastructure_agent,
                "description": "Handles infrastructure management tasks"
            },
            {
                "agent": recovery_agent,
                "description": "Handles recovery execution tasks"
            }
        ],
        input_guardrails=[security_guardrail, recovery_safety_guardrail],
        output_guardrails=[sensitive_info_guardrail],
        model="gpt-4o"
    )
    
    # Run the disaster recovery agent with a complex multi-step workflow
    print("Running Disaster Recovery Orchestrator agent...")
    result = await Runner.run(
        disaster_recovery_agent,
        """
        We had an incident with our web application infrastructure in us-west-2.
        I need to recover our web servers (i-abcdef123456) and database (db-12345).
        
        First, check what backups we have available for these resources.
        Then, create a recovery plan with the database recovering first (it's critical),
        followed by the web servers (high priority).
        
        Use the most recent backups and make sure to create a detailed report in our
        example-org/incident-response GitHub repository when done.
        """,
        context=context
    )
    
    # Print the result
    print("\nFinal output:")
    print(result.final_output)


if __name__ == "__main__":
    asyncio.run(main())