# AWS Integration Module (`aws`)

## Overview

The `aws` module provides tools and functionalities for integrating with Amazon Web Services (AWS). It focuses on providing agents with the ability to manage and interact with various AWS services, currently emphasizing EC2 (Elastic Compute Cloud). This module enables DevOps agents to automate tasks related to AWS infrastructure.

## Submodules

### 1. EC2 Submodule (`aws.ec2`)

- **Purpose**: Provides tools for managing EC2 instances and related resources.
- **Key Features**:
    - **Instance Management**: Functions to list, start, stop, create, and terminate EC2 instances.
    - **Deployment**: Functionality to deploy applications from GitHub repositories to EC2 instances.
    - **Models**: Defines Pydantic models for EC2 requests and resources.
    - **Error Handling**: Uses custom exceptions for AWS service-related errors.
- **Models**:
    - `EC2InstanceFilter(BaseModel)`:
        - Model for filtering EC2 instances based on attributes like instance state, tags, etc.
        - Attributes: `filters: Optional[List[Dict[str, List[str]]]]` (AWS filter format).
    - `EC2StartStopRequest(BaseModel)`:
        - Model for requesting to start or stop EC2 instances.
        - Attributes: `instance_ids: List[str]`, `force: bool = False` (for stop requests).
    - `EC2CreateRequest(BaseModel)`:
        - Model for requesting the creation of a new EC2 instance.
        - Attributes: `name: str`, `instance_type: str`, `ami_id: str`, `subnet_id: Optional[str]`, `security_group_ids: Optional[List[str]]`, `key_name: Optional[str]`, `tags: Optional[Dict[str, str]]`.
    - `EC2Instance(BaseModel)`:
        - Model representing an EC2 instance with its key attributes.
        - Attributes: `instance_id: str`, `instance_type: str`, `image_id: str`, `state: Dict[str, str]`, `public_ip_address: Optional[str]`, `private_ip_address: Optional[str]`, `tags: Optional[List[Dict[str, str]]]`, `launch_time: datetime`.
- **Tools (Functions)**:
    - `list_ec2_instances(region: Optional[str] = None, filters: Optional[EC2InstanceFilter] = None, context: Optional[DevOpsContext] = None) -> List[EC2Instance]`:
        - Lists EC2 instances in a given region, with optional filtering.
        - Returns a list of `EC2Instance` objects.
    - `start_ec2_instances(instance_ids: List[str], region: Optional[str] = None, wait: bool = True, context: Optional[DevOpsContext] = None) -> List[EC2Instance]`:
        - Starts specified EC2 instances.
        - Waits for instances to reach 'running' state if `wait` is True.
        - Returns a list of `EC2Instance` objects.
    - `stop_ec2_instances(instance_ids: List[str], region: Optional[str] = None, force: bool = False, wait: bool = True, context: Optional[DevOpsContext] = None) -> List[EC2Instance]`:
        - Stops specified EC2 instances.
        - Forces stop if `force` is True.
        - Waits for instances to reach 'stopped' state if `wait` is True.
        - Returns a list of `EC2Instance` objects.
    - `create_ec2_instance(request: EC2CreateRequest, region: Optional[str] = None, wait: bool = True, context: Optional[DevOpsContext] = None) -> EC2Instance`:
        - Creates a new EC2 instance based on the provided `EC2CreateRequest`.
        - Waits for instance to reach 'running' state if `wait` is True.
        - Returns the created `EC2Instance` object.
    - `deploy_from_github(instance_id: str, repository: str, branch: str, deploy_path: str, setup_script: Optional[str], github_token: str, region: Optional[str] = None, context: Optional[DevOpsContext] = None) -> Dict[str, Any]`:
        - Deploys an application from a GitHub repository to an EC2 instance.
        - Parameters include instance ID, repository details, deployment path, and optional setup script.
        - Returns a dictionary containing deployment status, output, and error information.

### 2. AWS Base Submodule (`aws.base`)

- **Purpose**: Provides base classes and error handling for AWS service interactions.
- **Key Features**:
    - **Custom Exceptions**: Defines custom exception classes for different AWS service error scenarios.
        - `AWSServiceError`: Base class for AWS service errors.
        - `ResourceNotFoundError`: Raised when an AWS resource is not found.
        - `PermissionDeniedError`: Raised for AWS permission errors.
        - `ValidationError`: Raised for input validation errors.
        - `RateLimitError`: Raised for AWS API rate limit errors.
        - `ResourceLimitError`: Raised for AWS resource limit errors.
- **Classes**:
    - `AWSServiceError(Exception)`: Base exception class for AWS service errors.
    - `ResourceNotFoundError(AWSServiceError)`: Exception for resource not found errors.
    - `PermissionDeniedError(AWSServiceError)`: Exception for permission denied errors.
    - `ValidationError(AWSServiceError)`: Exception for validation errors.
    - `RateLimitError(AWSServiceError)`: Exception for rate limit errors.
    - `ResourceLimitError(AWSServiceError)`: Exception for resource limit errors.

This document provides a detailed overview of the AWS integration module, outlining its submodules, models, tools, and functionalities for interacting with Amazon Web Services, particularly EC2.