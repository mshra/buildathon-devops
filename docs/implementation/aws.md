# AWS Module

The `aws` module provides tools and functionalities for interacting with Amazon Web Services (AWS). It currently focuses on EC2 (Elastic Compute Cloud) service.

## Submodules

- [EC2](#ec2)

## EC2

The `ec2` submodule provides tools for managing EC2 instances. It includes functionalities for:

- Listing EC2 instances
- Starting and stopping EC2 instances
- Creating new EC2 instances
- Terminating EC2 instances
- Deploying applications to EC2 instances from GitHub

### Models

- `EC2InstanceFilter`: Model for filtering EC2 instances based on various criteria.
- `EC2StartStopRequest`: Model for requesting to start or stop EC2 instances.
- `EC2CreateRequest`: Model for requesting the creation of new EC2 instances.
- `EC2Instance`: Model representing an EC2 instance with its attributes.

### Tools

- `list_ec2_instances(region: Optional[str] = None, filters: Optional[EC2InstanceFilter] = None)`: Lists EC2 instances, optionally filtering by region and filters.
- `start_ec2_instances(instance_ids: List[str], region: Optional[str] = None)`: Starts specified EC2 instances.
- `stop_ec2_instances(instance_ids: List[str], region: Optional[str] = None, force: bool = False)`: Stops specified EC2 instances, with an option to force stop.
- `create_ec2_instance(request: EC2CreateRequest, region: Optional[str] = None)`: Creates a new EC2 instance based on the provided request.

## Usage

For detailed usage examples, please refer to the [examples directory](../../examples).