#!/usr/bin/env python3
"""
Security Compliance Agent Example

This example demonstrates a complex multi-step workflow for security compliance operations
using the OpenAI Agents SDK with the DevOps agent. It shows how to:

1. Create specialized agents for security scanning, compliance checking, and remediation
2. Implement a workflow for security auditing and remediation
3. Use guardrails to ensure secure operations
4. Generate comprehensive security reports

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
from datetime import datetime

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
        list_ec2_instances
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

# Define custom models for security compliance
class SeverityLevel(str, Enum):
    """Severity levels for security findings."""
    INFO = "info"
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class ComplianceStatus(str, Enum):
    """Compliance status values."""
    COMPLIANT = "compliant"
    NON_COMPLIANT = "non-compliant"
    UNKNOWN = "unknown"

class SecurityFinding(BaseModel):
    """Model representing a security finding."""
    id: str = Field(..., description="Finding ID")
    resource_id: str = Field(..., description="ID of the affected resource")
    resource_type: str = Field(..., description="Type of resource (e.g., ec2, sg)")
    title: str = Field(..., description="Title of the finding")
    description: str = Field(..., description="Description of the finding")
    severity: SeverityLevel = Field(..., description="Severity level")
    compliance_requirement: Optional[str] = Field(None, description="Related compliance requirement")
    remediation_steps: Optional[str] = Field(None, description="Steps to remediate the finding")
    status: str = Field("open", description="Status of the finding")

class ComplianceCheck(BaseModel):
    """Model representing a compliance check."""
    id: str = Field(..., description="Check ID")
    title: str = Field(..., description="Title of the check")
    description: str = Field(..., description="Description of the check")
    framework: str = Field(..., description="Compliance framework (e.g., CIS, NIST)")
    status: ComplianceStatus = Field(..., description="Compliance status")
    related_findings: List[str] = Field(default_factory=list, description="Related finding IDs")
    last_checked: str = Field(..., description="Timestamp of last check")

class RemediationAction(BaseModel):
    """Model representing a remediation action."""
    finding_id: str = Field(..., description="ID of the finding to remediate")
    action_type: str = Field(..., description="Type of action (e.g., update, delete, create)")
    resource_id: str = Field(..., description="ID of the resource to remediate")
    resource_type: str = Field(..., description="Type of resource")
    description: str = Field(..., description="Description of the remediation")
    automated: bool = Field(..., description="Whether the remediation can be automated")

class SecurityAuditReport(BaseModel):
    """Model representing a security audit report."""
    report_id: str = Field(..., description="Report ID")
    timestamp: str = Field(..., description="Timestamp of the report")
    findings: List[SecurityFinding] = Field(..., description="Security findings")
    compliance_checks: List[ComplianceCheck] = Field(..., description="Compliance checks")
    summary: Dict[str, Any] = Field(..., description="Summary statistics")

# Define custom tools for security compliance
async def scan_infrastructure(
    resource_type: Optional[str] = None,
    region: Optional[str] = None,
    context: Optional[Any] = None
) -> List[SecurityFinding]:
    """
    Scan infrastructure for security issues.
    
    Args:
        resource_type: Optional filter by resource type
        region: AWS region to scan
        
    Returns:
        List of security findings
    """
    # This would perform actual security scanning in a real implementation
    findings = [
        SecurityFinding(
            id="finding-001",
            resource_id="sg-12345",
            resource_type="security-group",
            title="Security group allows unrestricted access",
            description="Security group sg-12345 allows unrestricted access (0.0.0.0/0) to port 22 (SSH).",
            severity=SeverityLevel.HIGH,
            compliance_requirement="CIS AWS Foundations 4.1",
            remediation_steps="Restrict SSH access to specific IP ranges or use a bastion host."
        ),
        SecurityFinding(
            id="finding-002",
            resource_id="i-abcdef123456",
            resource_type="ec2",
            title="Unencrypted EBS volume",
            description="EC2 instance i-abcdef123456 has an unencrypted EBS volume attached.",
            severity=SeverityLevel.MEDIUM,
            compliance_requirement="CIS AWS Foundations 2.2.1",
            remediation_steps="Enable EBS encryption for the volume."
        ),
        SecurityFinding(
            id="finding-003",
            resource_id="iam-policy-123",
            resource_type="iam-policy",
            title="Overly permissive IAM policy",
            description="IAM policy iam-policy-123 grants administrative privileges to multiple users.",
            severity=SeverityLevel.CRITICAL,
            compliance_requirement="CIS AWS Foundations 1.16",
            remediation_steps="Restrict administrative privileges to only necessary users."
        )
    ]
    
    # Apply filters
    if resource_type:
        findings = [f for f in findings if f.resource_type == resource_type]
        
    return findings

async def run_compliance_checks(
    framework: Optional[str] = None,
    region: Optional[str] = None,
    context: Optional[Any] = None
) -> List[ComplianceCheck]:
    """
    Run compliance checks against a specific framework.
    
    Args:
        framework: Compliance framework to check against
        region: AWS region to check
        
    Returns:
        List of compliance check results
    """
    # This would perform actual compliance checks in a real implementation
    now = datetime.now().isoformat()
    checks = [
        ComplianceCheck(
            id="check-001",
            title="Ensure no security groups allow ingress from 0.0.0.0/0 to port 22",
            description="Security groups should not allow unrestricted access to SSH (port 22).",
            framework="CIS AWS Foundations",
            status=ComplianceStatus.NON_COMPLIANT,
            related_findings=["finding-001"],
            last_checked=now
        ),
        ComplianceCheck(
            id="check-002",
            title="Ensure EBS volumes are encrypted",
            description="All EBS volumes should be encrypted to protect data at rest.",
            framework="CIS AWS Foundations",
            status=ComplianceStatus.NON_COMPLIANT,
            related_findings=["finding-002"],
            last_checked=now
        ),
        ComplianceCheck(
            id="check-003",
            title="Ensure IAM policies are restrictive",
            description="IAM policies should follow the principle of least privilege.",
            framework="CIS AWS Foundations",
            status=ComplianceStatus.NON_COMPLIANT,
            related_findings=["finding-003"],
            last_checked=now
        ),
        ComplianceCheck(
            id="check-004",
            title="Ensure CloudTrail is enabled",
            description="CloudTrail should be enabled in all regions.",
            framework="CIS AWS Foundations",
            status=ComplianceStatus.COMPLIANT,
            related_findings=[],
            last_checked=now
        )
    ]
    
    # Apply filters
    if framework:
        checks = [c for c in checks if c.framework == framework]
        
    return checks

async def create_remediation_plan(
    findings: List[SecurityFinding],
    context: Optional[Any] = None
) -> List[RemediationAction]:
    """
    Create a remediation plan for security findings.
    
    Args:
        findings: List of security findings to remediate
        
    Returns:
        List of remediation actions
    """
    # This would create an actual remediation plan in a real implementation
    remediation_actions = []
    
    for finding in findings:
        if finding.resource_type == "security-group" and "unrestricted access" in finding.description:
            remediation_actions.append(
                RemediationAction(
                    finding_id=finding.id,
                    action_type="update",
                    resource_id=finding.resource_id,
                    resource_type=finding.resource_type,
                    description="Update security group rules to restrict access to specific IP ranges",
                    automated=True
                )
            )
        elif finding.resource_type == "ec2" and "unencrypted" in finding.description:
            remediation_actions.append(
                RemediationAction(
                    finding_id=finding.id,
                    action_type="update",
                    resource_id=finding.resource_id,
                    resource_type=finding.resource_type,
                    description="Create encrypted volume, attach to instance, migrate data, detach and delete unencrypted volume",
                    automated=False
                )
            )
        elif finding.resource_type == "iam-policy" and "permissive" in finding.description:
            remediation_actions.append(
                RemediationAction(
                    finding_id=finding.id,
                    action_type="update",
                    resource_id=finding.resource_id,
                    resource_type=finding.resource_type,
                    description="Update IAM policy to restrict permissions following least privilege principle",
                    automated=True
                )
            )
    
    return remediation_actions

async def execute_remediation(
    action: RemediationAction,
    context: Optional[Any] = None
) -> dict:
    """
    Execute a remediation action.
    
    Args:
        action: The remediation action to execute
        
    Returns:
        Result of the remediation
    """
    # This would perform actual remediation in a real implementation
    if not action.automated:
        return {
            "status": "manual_required",
            "action_id": action.finding_id,
            "message": f"Manual remediation required for {action.resource_type} {action.resource_id}: {action.description}"
        }
    
    # Simulate automated remediation
    return {
        "status": "success",
        "action_id": action.finding_id,
        "message": f"Successfully remediated {action.resource_type} {action.resource_id}: {action.description}"
    }

async def generate_security_report(
    findings: List[SecurityFinding],
    compliance_checks: List[ComplianceCheck],
    repository: str,
    context: Optional[Any] = None
) -> dict:
    """
    Generate a comprehensive security report and create a GitHub issue.
    
    Args:
        findings: Security findings to include in the report
        compliance_checks: Compliance checks to include in the report
        repository: GitHub repository to create the issue in
        
    Returns:
        The created issue with report
    """
    # Generate summary statistics
    total_findings = len(findings)
    severity_counts = {
        "critical": len([f for f in findings if f.severity == SeverityLevel.CRITICAL]),
        "high": len([f for f in findings if f.severity == SeverityLevel.HIGH]),
        "medium": len([f for f in findings if f.severity == SeverityLevel.MEDIUM]),
        "low": len([f for f in findings if f.severity == SeverityLevel.LOW]),
        "info": len([f for f in findings if f.severity == SeverityLevel.INFO])
    }
    
    compliance_status = {
        "compliant": len([c for c in compliance_checks if c.status == ComplianceStatus.COMPLIANT]),
        "non_compliant": len([c for c in compliance_checks if c.status == ComplianceStatus.NON_COMPLIANT]),
        "unknown": len([c for c in compliance_checks if c.status == ComplianceStatus.UNKNOWN])
    }
    
    # Create the report
    report = SecurityAuditReport(
        report_id=f"report-{datetime.now().strftime('%Y%m%d%H%M%S')}",
        timestamp=datetime.now().isoformat(),
        findings=findings,
        compliance_checks=compliance_checks,
        summary={
            "total_findings": total_findings,
            "severity_counts": severity_counts,
            "compliance_status": compliance_status,
            "compliance_percentage": round(compliance_status["compliant"] / len(compliance_checks) * 100, 2) if compliance_checks else 0
        }
    )
    
    # Format the report for GitHub
    report_body = f"# Security Audit Report\n\n"
    report_body += f"Report ID: {report.report_id}\n"
    report_body += f"Timestamp: {report.timestamp}\n\n"
    
    report_body += "## Summary\n\n"
    report_body += f"Total Findings: {report.summary['total_findings']}\n"
    report_body += f"Compliance: {report.summary['compliance_percentage']}% compliant\n\n"
    
    report_body += "### Findings by Severity\n\n"
    for severity, count in report.summary['severity_counts'].items():
        report_body += f"- {severity.capitalize()}: {count}\n"
    
    report_body += "\n### Compliance Status\n\n"
    for status, count in report.summary['compliance_status'].items():
        report_body += f"- {status.replace('_', ' ').capitalize()}: {count}\n"
    
    report_body += "\n## Critical and High Severity Findings\n\n"
    for finding in findings:
        if finding.severity in [SeverityLevel.CRITICAL, SeverityLevel.HIGH]:
            report_body += f"### {finding.title}\n"
            report_body += f"- ID: {finding.id}\n"
            report_body += f"- Resource: {finding.resource_type} {finding.resource_id}\n"
            report_body += f"- Severity: {finding.severity}\n"
            report_body += f"- Description: {finding.description}\n"
            if finding.remediation_steps:
                report_body += f"- Remediation: {finding.remediation_steps}\n"
            report_body += "\n"
    
    # Create the issue
    return {
        "number": 789,
        "title": f"Security Audit Report: {report.summary['total_findings']} findings, {report.summary['compliance_percentage']}% compliant",
        "body": report_body,
        "html_url": f"https://github.com/{repository}/issues/789"
    }

# Define a guardrail for security operations
class SecurityOperationsOutput(BaseModel):
    """Output model for security operations check guardrail."""
    is_unsafe: bool = Field(
        description="Whether the security operation is unsafe"
    )
    reasoning: str = Field(
        description="Reasoning for the safety determination"
    )

@input_guardrail
async def security_operations_guardrail(
    ctx: RunContextWrapper,
    agent: Agent,
    input_text: str
) -> GuardrailFunctionOutput:
    """
    Guardrail to prevent unsafe security operations.
    
    Args:
        ctx: Run context
        agent: The agent being used
        input_text: The user input to check
        
    Returns:
        GuardrailFunctionOutput indicating if the input is safe
    """
    unsafe_patterns = [
        "ignore critical findings",
        "skip compliance checks",
        "bypass security",
        "disable security groups",
        "remove encryption"
    ]
    
    for pattern in unsafe_patterns:
        if pattern in input_text.lower():
            output_info = SecurityOperationsOutput(
                is_unsafe=True,
                reasoning=f"Unsafe security operation detected: '{pattern}'. "
                        f"This could introduce security vulnerabilities."
            )
            return GuardrailFunctionOutput(
                tripwire_triggered=True,
                output_info=output_info
            )
    
    output_info = SecurityOperationsOutput(
        is_unsafe=False,
        reasoning="No unsafe security operations detected."
    )
    return GuardrailFunctionOutput(
        tripwire_triggered=False,
        output_info=output_info
    )

async def main():
    """Run the security compliance agent example."""
    # Set up the OpenAI API key
    if "OPENAI_API_KEY" not in os.environ:
        print("Please set the OPENAI_API_KEY environment variable")
        return
    
    # Create a DevOps context
    context = DevOpsContext(
        user_id="security-admin",
        aws_region="us-west-2",
        github_org="example-org"
    )
    
    # Create specialized agents for different aspects of security compliance
    scanner_agent = Agent(
        name="Security Scanner Agent",
        instructions="""
        You are a security scanning agent that helps identify security issues in infrastructure.
        You can scan for vulnerabilities, misconfigurations, and compliance violations.
        Always prioritize findings by severity and provide clear descriptions of the issues.
        """,
        tools=[scan_infrastructure, list_ec2_instances],
        model="gpt-4o"
    )
    
    compliance_agent = Agent(
        name="Compliance Agent",
        instructions="""
        You are a compliance agent that helps check infrastructure against security frameworks.
        You can run compliance checks and interpret the results.
        Always explain compliance requirements clearly and provide context for violations.
        """,
        tools=[run_compliance_checks],
        model="gpt-4o"
    )
    
    remediation_agent = Agent(
        name="Remediation Agent",
        instructions="""
        You are a remediation agent that helps fix security issues.
        You can create remediation plans and execute remediation actions.
        Always prioritize critical and high severity findings and explain the remediation steps clearly.
        """,
        tools=[
            create_remediation_plan, 
            execute_remediation
        ],
        model="gpt-4o"
    )
    
    reporting_agent = Agent(
        name="Security Reporting Agent",
        instructions="""
        You are a security reporting agent that helps create comprehensive security reports.
        You can generate reports with findings, compliance status, and remediation recommendations.
        Always make reports clear, actionable, and prioritized by risk.
        """,
        tools=[
            generate_security_report,
            create_issue
        ],
        model="gpt-4o"
    )
    
    # Create an orchestrator agent with handoffs to specialized agents
    security_compliance_agent = Agent(
        name="Security Compliance Orchestrator",
        instructions="""
        You are a security compliance orchestrator that helps users manage security and compliance.
        You can delegate tasks to specialized agents for scanning, compliance checking, remediation, and reporting.
        
        Help users understand the security posture of their infrastructure and guide them through the process of
        identifying, prioritizing, and remediating security issues.
        
        Always follow these principles:
        1. Security first - never recommend operations that could weaken security
        2. Prioritize by risk - focus on critical and high severity findings first
        3. Compliance as a baseline - use compliance frameworks as a minimum standard
        4. Clear reporting - ensure findings and recommendations are clearly communicated
        
        When a user wants to assess their security posture, help them scan their infrastructure,
        check compliance, create a remediation plan, and generate a comprehensive report.
        """,
        handoffs=[
            {
                "agent": scanner_agent,
                "description": "Handles security scanning tasks"
            },
            {
                "agent": compliance_agent,
                "description": "Handles compliance checking tasks"
            },
            {
                "agent": remediation_agent,
                "description": "Handles remediation tasks"
            },
            {
                "agent": reporting_agent,
                "description": "Handles reporting tasks"
            }
        ],
        input_guardrails=[security_guardrail, security_operations_guardrail],
        output_guardrails=[sensitive_info_guardrail],
        model="gpt-4o"
    )
    
    # Run the security compliance agent with a complex multi-step workflow
    print("Running Security Compliance Orchestrator agent...")
    result = await Runner.run(
        security_compliance_agent,
        """
        I need to perform a security audit of our AWS infrastructure in us-west-2.
        
        First, scan our infrastructure for security issues.
        Then, check compliance against the CIS AWS Foundations framework.
        Next, create a remediation plan for any critical or high severity findings.
        Finally, generate a comprehensive security report and create an issue in our
        example-org/security-reports GitHub repository.
        
        Please prioritize findings related to IAM permissions and encryption.
        """,
        context=context
    )
    
    # Print the result
    print("\nFinal output:")
    print(result.final_output)


if __name__ == "__main__":
    asyncio.run(main())