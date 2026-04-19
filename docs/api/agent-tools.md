# Agent Tools API Reference

## Overview

This document provides the API reference for the agent tools used in the Agentic DevOps framework. These tools are designed to be used with the OpenAI Agents SDK.

## AWS EC2 Tools

- `list_ec2_instances(region: Optional[str] = None, filters: Optional[EC2InstanceFilter] = None)`
- `start_ec2_instances(instance_ids: List[str], region: Optional[str] = None)`
- `stop_ec2_instances(instance_ids: List[str], region: Optional[str] = None, force: bool = False)`
- `create_ec2_instance(request: EC2CreateRequest, region: Optional[str] = None)`
- `deploy_from_github(instance_id: str, repository: str, branch: str, deploy_path: str, setup_script: Optional[str], github_token: str, region: Optional[str] = None)`

## GitHub Tools

- `get_repository(repo_path: str, owner: Optional[str] = None)`
- `list_repositories(org: Optional[str] = None, user: Optional[str] = None)`
- `get_readme(repo_path: str, owner: Optional[str] = None, ref: Optional[str] = None)`
- `list_issues(repo_path: str, owner: Optional[str] = None, filters: Optional[Dict[str, str]] = None)`
- `create_issue(request: GitHubCreateIssueRequest, repo_path: str, owner: Optional[str] = None)`
- `list_pull_requests(repo_path: str, owner: Optional[str] = None, filters: Optional[Dict[str, str]] = None)`

## Core Tools (Guardrails)

- `security_guardrail(input_text: str, context: Optional[RunContext] = None)`
- `sensitive_info_guardrail(input_text: str, context: Optional[RunContext] = None)`