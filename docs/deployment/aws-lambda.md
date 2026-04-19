# AWS Lambda Deployment Guide

This guide provides detailed instructions for deploying the Agentic DevOps framework as AWS Lambda functions.

## Overview

AWS Lambda is a serverless compute service that lets you run code without provisioning or managing servers. Deploying the Agentic DevOps framework as Lambda functions provides several benefits:

- **Serverless**: No need to manage servers
- **Scalable**: Automatically scales with usage
- **Cost-effective**: Pay only for compute time used
- **Event-driven**: Can be triggered by various AWS events
- **Integrated**: Native integration with other AWS services

## Architecture

When deployed to AWS Lambda, the Agentic DevOps framework follows this architecture:

```
┌─────────────────────────────────────────────────────────────────┐
│                          API Gateway                            │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Lambda Functions                         │
├─────────────┬─────────────┬─────────────┬─────────────┬─────────┤
│             │             │             │             │         │
│  EC2        │  GitHub     │  Deployment │  Security   │  Agent  │
│  Operations │  Operations │  Operations │  Operations │  Runner │
│             │             │             │             │         │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────┘
        │             │             │             │           │
        ▼             ▼             ▼             ▼           ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ AWS SDK     │ │ GitHub API  │ │ Deployment  │ │ Security    │ │ OpenAI      │
│ Integration │ │ Integration │ │ Logic       │ │ Logic       │ │ API         │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

## Prerequisites

Before deploying to AWS Lambda, ensure you have:

1. **AWS Account**: Active AWS account with appropriate permissions
2. **AWS CLI**: Installed and configured with appropriate credentials
3. **Python 3.8+**: Lambda functions will use Python runtime
4. **Serverless Framework** (optional): For easier deployment management
5. **Docker**: For building Lambda deployment packages with dependencies

## Deployment Options

### Option 1: AWS SAM (Serverless Application Model)

AWS SAM is a framework for building serverless applications on AWS.

1. **Install AWS SAM CLI**:
   ```bash
   pip install aws-sam-cli
   ```

2. **Create SAM Template**:
   Create a `template.yaml` file:

   ```yaml
   AWSTemplateFormatVersion: '2010-09-09'
   Transform: AWS::Serverless-2016-10-31
   Resources:
     AgenticDevOpsFunction:
       Type: AWS::Serverless::Function
       Properties:
         CodeUri: ./
         Handler: lambda_handler.handler
         Runtime: python3.9
         Timeout: 30
         MemorySize: 1024
         Environment:
           Variables:
             OPENAI_API_KEY: !Ref OpenAIApiKey
             AWS_REGION: !Ref AWS::Region
         Policies:
           - AmazonEC2ReadOnlyAccess
           - AWSLambdaBasicExecutionRole
         Events:
           ApiEvent:
             Type: Api
             Properties:
               Path: /devops
               Method: post
   
   Parameters:
     OpenAIApiKey:
       Type: String
       NoEcho: true
       Description: OpenAI API Key
   ```

3. **Create Lambda Handler**:
   Create a `lambda_handler.py` file:

   ```python
   import json
   import os
   import asyncio
   from agentic_devops.src.cli import process_command

   def handler(event, context):
       """AWS Lambda handler function."""
       try:
           # Extract command from event
           body = json.loads(event.get('body', '{}'))
           command = body.get('command', '')
           
           # Process the command
           result = asyncio.run(process_command(command.split()))
           
           # Return the result
           return {
               'statusCode': 200,
               'body': json.dumps({
                   'result': result
               })
           }
       except Exception as e:
           return {
               'statusCode': 500,
               'body': json.dumps({
                   'error': str(e)
               })
           }
   ```

4. **Build and Deploy**:
   ```bash
   sam build --use-container
   sam deploy --guided
   ```

### Option 2: Serverless Framework

The Serverless Framework provides a simpler way to deploy serverless applications.

1. **Install Serverless Framework**:
   ```bash
   npm install -g serverless
   ```

2. **Create Serverless Configuration**:
   Create a `serverless.yml` file:

   ```yaml
   service: agentic-devops

   provider:
     name: aws
     runtime: python3.9
     region: us-east-1
     memorySize: 1024
     timeout: 30
     environment:
       OPENAI_API_KEY: ${env:OPENAI_API_KEY}
       AWS_REGION: ${self:provider.region}
     iamRoleStatements:
       - Effect: Allow
         Action:
           - ec2:Describe*
           - ec2:List*
         Resource: "*"

   functions:
     devops:
       handler: lambda_handler.handler
       events:
         - http:
             path: devops
             method: post
             cors: true
   
   plugins:
     - serverless-python-requirements

   custom:
     pythonRequirements:
       dockerizePip: true
       zip: true
   ```

3. **Install Plugins**:
   ```bash
   npm install --save-dev serverless-python-requirements
   ```

4. **Deploy**:
   ```bash
   serverless deploy
   ```

### Option 3: Manual Deployment with Docker

For more control over the deployment process, you can manually create a Lambda deployment package using Docker.

1. **Create Dockerfile**:
   ```dockerfile
   FROM public.ecr.aws/lambda/python:3.9

   COPY requirements.txt .
   RUN pip install -r requirements.txt

   COPY . .

   CMD ["lambda_handler.handler"]
   ```

2. **Create requirements.txt**:
   ```
   openai-agents
   boto3
   pyyaml
   python-dotenv
   pydantic
   PyGithub
   ```

3. **Build Docker Image**:
   ```bash
   docker build -t agentic-devops-lambda .
   ```

4. **Create Deployment Package**:
   ```bash
   docker run --rm -v $(pwd):/var/task agentic-devops-lambda \
     pip install -r requirements.txt -t python/
   zip -r deployment-package.zip lambda_handler.py python/
   ```

5. **Create Lambda Function**:
   ```bash
   aws lambda create-function \
     --function-name agentic-devops \
     --runtime python3.9 \
     --role arn:aws:iam::ACCOUNT_ID:role/lambda-execution-role \
     --handler lambda_handler.handler \
     --zip-file fileb://deployment-package.zip \
     --timeout 30 \
     --memory-size 1024 \
     --environment Variables="{OPENAI_API_KEY=your-api-key}"
   ```

## API Gateway Integration

To expose your Lambda function as an API:

1. **Create API Gateway**:
   ```bash
   aws apigateway create-rest-api --name "AgenticDevOpsAPI"
   ```

2. **Create Resource and Method**:
   ```bash
   aws apigateway create-resource --rest-api-id API_ID --parent-id ROOT_ID --path-part "devops"
   aws apigateway put-method --rest-api-id API_ID --resource-id RESOURCE_ID --http-method POST --authorization-type NONE
   ```

3. **Integrate with Lambda**:
   ```bash
   aws apigateway put-integration --rest-api-id API_ID --resource-id RESOURCE_ID --http-method POST --type AWS_PROXY --integration-http-method POST --uri arn:aws:apigateway:REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:REGION:ACCOUNT_ID:function:agentic-devops/invocations
   ```

4. **Deploy API**:
   ```bash
   aws apigateway create-deployment --rest-api-id API_ID --stage-name prod
   ```

## Environment Variables

Configure these environment variables for your Lambda function:

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |
| `AWS_REGION` | AWS region for operations | Yes |
| `GITHUB_TOKEN` | GitHub personal access token | For GitHub operations |
| `LOG_LEVEL` | Logging level (DEBUG, INFO, etc.) | No (defaults to INFO) |

## Security Considerations

1. **IAM Roles**: Use the principle of least privilege when configuring IAM roles
2. **API Keys**: Store API keys in AWS Secrets Manager or Parameter Store
3. **VPC**: Consider deploying Lambda functions within a VPC for enhanced security
4. **API Gateway**: Configure authentication and authorization for API Gateway
5. **Logging**: Enable CloudWatch Logs for monitoring and debugging

## Cold Start Optimization

Lambda functions experience "cold starts" when they haven't been used recently:

1. **Minimize Dependencies**: Include only necessary dependencies
2. **Increase Memory**: Higher memory allocation reduces cold start time
3. **Keep Warm**: Use scheduled events to keep functions warm
4. **Optimize Code**: Minimize initialization code outside the handler function
5. **Use Provisioned Concurrency**: For critical functions

## Monitoring and Logging

1. **CloudWatch Logs**: Lambda automatically logs to CloudWatch
2. **CloudWatch Metrics**: Monitor invocation count, duration, errors
3. **X-Ray**: Enable AWS X-Ray for tracing and performance analysis
4. **Custom Metrics**: Emit custom metrics for business-specific monitoring
5. **Alarms**: Set up CloudWatch Alarms for error rates and duration thresholds

## Cost Management

1. **Right-size Memory**: Allocate appropriate memory for your function
2. **Optimize Duration**: Minimize execution time to reduce costs
3. **Monitor Usage**: Regularly review Lambda usage and costs
4. **Reserved Concurrency**: Set maximum concurrency to control costs
5. **Cleanup**: Remove unused functions and versions

## Example Usage

Once deployed, you can invoke your Lambda function via API Gateway:

```bash
curl -X POST https://API_ID.execute-api.REGION.amazonaws.com/prod/devops \
  -H "Content-Type: application/json" \
  -d '{"command": "ec2 list-instances --region us-east-1 --output json"}'
```

## Troubleshooting

1. **Check Logs**: Review CloudWatch Logs for error messages
2. **Test Locally**: Use AWS SAM to test functions locally before deployment
3. **Increase Timeout**: If functions time out, increase the timeout setting
4. **Check Permissions**: Verify IAM roles have necessary permissions
5. **Memory Issues**: If you encounter out-of-memory errors, increase memory allocation

## Related Documentation

- [Docker Deployment](docker.md)
- [CI/CD Pipeline Setup](ci-cd-pipeline.md)
- [Local Development Setup](local-development.md)
- [AWS Integration](../implementation/aws-integration.md)