# AWS Module API Reference (`aws`)

## Overview

This document provides a detailed API reference for the `aws` module in the Agentic DevOps framework. This module includes functionalities for interacting with various AWS services, with a primary focus on EC2.

## Submodules

### 1. EC2 Submodule (`aws.ec2`)

Provides classes and functions for interacting with Amazon EC2 service.

#### Models

- `EC2InstanceFilter(BaseModel)`: Model for filtering EC2 instances.
    - `filters: Optional[List[Dict[str, List[str]]]]`: List of filters in AWS format.

- `EC2StartStopRequest(BaseModel)`: Model for starting/stopping EC2 instances.
    - `instance_ids: List[str]`: List of instance IDs to start/stop.
    - `force: bool = False`: Force stop flag (for stopping instances).

- `EC2CreateRequest(BaseModel)`: Model for creating EC2 instances.
    - `name: str`: Instance name (for tags).
    - `instance_type: str`: EC2 instance type (e.g., `t2.micro`).
    - `ami_id: str`: AMI ID.
    - `subnet_id: Optional[str]`: Subnet ID.
    - `security_group_ids: Optional[List[str]]`: List of security group IDs.
    - `key_name: Optional[str]`: Key pair name.
    - `tags: Optional[Dict[str, str]]`: Tags to apply to the instance.

- `EC2Instance(BaseModel)`: Model representing an EC2 instance.
    - `instance_id: str`: Instance ID.
    - `instance_type: str`: Instance type.
    - `image_id: str`: Image ID (AMI ID).
    - `state: Dict[str, str]`: Instance state (e.g., `{'Name': 'running'}`).
    - `public_ip_address: Optional[str]`: Public IP address.
    - `private_ip_address: Optional[str]`: Private IP address.
    - `tags: Optional[List[Dict[str, str]]]`: List of tags.
    - `launch_time: datetime`: Instance launch time.

#### Functions

- `list_ec2_instances(region: Optional[str] = None, filters: Optional[EC2InstanceFilter] = None, context: Optional[DevOpsContext] = None) -> List[EC2Instance]`:
    - Lists EC2 instances.
    - Parameters:
        - `region (Optional[str])`: AWS region (default from config).
        - `filters (Optional[EC2InstanceFilter])`: Filters to apply.
        - `context (Optional[DevOpsContext])`: DevOps context.
    - Returns: `List[EC2Instance]`: List of EC2Instance objects.

- `start_ec2_instances(instance_ids: List[str], region: Optional[str] = None, wait: bool = True, context: Optional[DevOpsContext] = None) -> List[EC2Instance]`:
    - Starts EC2 instances.
    - Parameters:
        - `instance_ids (List[str])`: List of instance IDs.
        - `region (Optional[str])`: AWS region (default from config).
        - `wait (bool)`: Wait for instances to start (default: True).
        - `context (Optional[DevOpsContext])`: DevOps context.
    - Returns: `List[EC2Instance]`: List of EC2Instance objects.

- `stop_ec2_instances(instance_ids: List[str], region: Optional[str] = None, force: bool = False, wait: bool = True, context: Optional[DevOpsContext] = None) -> List[EC2Instance]`:
    - Stops EC2 instances.
    - Parameters:
        - `instance_ids (List[str])`: List of instance IDs.
        - `region (Optional[str])`: AWS region (default from config).
        - `force (bool)`: Force stop (default: False).
        - `wait (bool)`: Wait for instances to stop (default: True).
        - `context (Optional[DevOpsContext])`: DevOps context.
    - Returns: `List[EC2Instance]`: List of EC2Instance objects.

- `create_ec2_instance(request: EC2CreateRequest, region: Optional[str] = None, wait: bool = True, context: Optional[DevOpsContext] = None) -> EC2Instance`:
    - Creates a new EC2 instance.
    - Parameters:
        - `request (EC2CreateRequest)`: Instance creation request.
        - `region (Optional[str])`: AWS region (default from config).
        - `wait (bool)`: Wait for instance to be created (default: True).
        - `context (Optional[DevOpsContext])`: DevOps context.
    - Returns: `EC2Instance`: Created EC2Instance object.

- `deploy_from_github(instance_id: str, repository: str, branch: str, deploy_path: str, setup_script: Optional[str], github_token: str, region: Optional[str] = None, context: Optional[DevOpsContext] = None) -> Dict[str, Any]`:
    - Deploys application from GitHub to EC2 instance.
    - Parameters:
        - `instance_id (str)`: EC2 instance ID.
        - `repository (str)`: GitHub repository path (`owner/repo`).
        - `branch (str)`: GitHub branch.
        - `deploy_path (str)`: Deployment path on EC2 instance.
        - `setup_script (Optional[str])`: Path to setup script on EC2 instance.
        - `github_token (str)`: GitHub API token.
        - `region (Optional[str])`: AWS region (default from config).
        - `context (Optional[DevOpsContext])`: DevOps context.
    - Returns: `Dict[str, Any]`: Deployment result (status, output, error).

### 2. Base Submodule (`aws.base`)

Provides base classes and exceptions for AWS module.

#### Classes

- `AWSServiceError(Exception)`: Base class for AWS service exceptions.
- `ResourceNotFoundError(AWSServiceError)`: Resource not found exception.
- `PermissionDeniedError(AWSServiceError)`: Permission denied exception.
- `ValidationError(AWSServiceError)`: Validation error exception.
- `RateLimitError(AWSServiceError)`: Rate limit exception.
- `ResourceLimitError(AWSServiceError)`: Resource limit exception.

This document provides a comprehensive API reference for the AWS module, detailing its submodules, classes, models, and functions.