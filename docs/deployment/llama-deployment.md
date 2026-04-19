# Llama Deployment Guide

This guide provides detailed instructions for deploying the Agentic DevOps framework using the Llama framework for AI applications.

## Overview

[Llama](https://github.com/run-llama/llama_index) is a data framework for LLM applications that provides tools for ingesting, structuring, and accessing data for use with large language models. Deploying the Agentic DevOps framework with Llama offers several benefits:

- **Enhanced Context**: Provide LLMs with relevant context from your data
- **RAG Capabilities**: Implement Retrieval Augmented Generation for more accurate responses
- **Structured Data Access**: Access structured data from various sources
- **Optimized Prompting**: Improve prompt efficiency and effectiveness
- **Agent Frameworks**: Leverage Llama's agent frameworks for complex workflows

## Prerequisites

Before deploying with Llama, ensure you have:

1. **Python 3.8+**: Required for Llama and Agentic DevOps
2. **OpenAI API Key**: For accessing OpenAI models
3. **Llama Index**: Install via `pip install llama-index`
4. **Docker** (optional): For containerized deployment
5. **Git**: For cloning the repository

## Basic Llama Integration

### Step 1: Install Dependencies

```bash
pip install llama-index openai pydantic
pip install -e /path/to/agentic-devops
```

### Step 2: Create a Basic Llama Agent

Create a Python script that integrates Agentic DevOps with Llama:

```python
import os
import sys
import asyncio
from llama_index import VectorStoreIndex, SimpleDirectoryReader, ServiceContext
from llama_index.llms import OpenAI
from llama_index.agent import ReActAgent
from typing import List, Dict, Any, Optional

# Import Agentic DevOps components
from agentic_devops.src.aws import list_ec2_instances, start_ec2_instances, stop_ec2_instances
from agentic_devops.src.github import get_repository, list_issues, create_issue
from agentic_devops.src.core import DevOpsContext

# Configure OpenAI
os.environ["OPENAI_API_KEY"] = os.environ.get("OPENAI_API_KEY", "")

# Create a DevOps context
context = DevOpsContext(
    user_id="llama-agent",
    aws_region="us-east-1",
    github_org="example-org"
)

# Define tools
tools = [
    list_ec2_instances,
    start_ec2_instances,
    stop_ec2_instances,
    get_repository,
    list_issues,
    create_issue
]

# Create an agent
agent = ReActAgent.from_tools(
    tools,
    llm=OpenAI(model="gpt-4o"),
    verbose=True,
    system_prompt="""
    You are a DevOps assistant that helps users manage their AWS infrastructure and GitHub repositories.
    You can perform various tasks such as listing EC2 instances, starting and stopping instances,
    retrieving repository information, and managing issues.
    
    Always think step by step and use the appropriate tools for each task.
    """
)

# Run the agent
async def main():
    response = await agent.aquery(
        "List all EC2 instances in us-east-1 and then get information about the 'example/repo' GitHub repository"
    )
    print(response)

if __name__ == "__main__":
    asyncio.run(main())
```

### Step 3: Run the Llama Agent

```bash
python llama_agent.py
```

## Advanced Llama Integration

### Document Indexing for DevOps Knowledge

Create a knowledge base from your DevOps documentation:

```python
import os
from llama_index import VectorStoreIndex, SimpleDirectoryReader, ServiceContext
from llama_index.llms import OpenAI

# Load documents
documents = SimpleDirectoryReader("./docs").load_data()

# Create a service context
service_context = ServiceContext.from_defaults(
    llm=OpenAI(model="gpt-4o")
)

# Create an index
index = VectorStoreIndex.from_documents(
    documents, 
    service_context=service_context
)

# Save the index
index.storage_context.persist("./data/devops_index")
```

### Creating a DevOps Query Engine

```python
from llama_index import StorageContext, load_index_from_storage

# Load the index
storage_context = StorageContext.from_defaults(persist_dir="./data/devops_index")
index = load_index_from_storage(storage_context)

# Create a query engine
query_engine = index.as_query_engine()

# Query the knowledge base
response = query_engine.query(
    "What are the best practices for EC2 instance management?"
)
print(response)
```

### Combining Tools and Knowledge

Create an agent that uses both tools and knowledge:

```python
from llama_index.agent import ReActAgent
from llama_index.tools import QueryEngineTool, ToolMetadata
from llama_index.llms import OpenAI

# Create a query engine tool
query_engine = index.as_query_engine()
query_tool = QueryEngineTool(
    query_engine=query_engine,
    metadata=ToolMetadata(
        name="devops_knowledge",
        description="Provides information about DevOps best practices, AWS services, and GitHub operations"
    )
)

# Combine with Agentic DevOps tools
all_tools = [query_tool] + tools

# Create an agent with all tools
agent = ReActAgent.from_tools(
    all_tools,
    llm=OpenAI(model="gpt-4o"),
    verbose=True,
    system_prompt="""
    You are a DevOps assistant that helps users manage their AWS infrastructure and GitHub repositories.
    You have access to DevOps knowledge and can perform various operations.
    
    Always think step by step and use the appropriate tools for each task.
    """
)

# Run the agent
response = await agent.aquery(
    "What are the best practices for EC2 instance security and can you list my current instances?"
)
print(response)
```

## Docker Deployment with Llama

### Step 1: Create a Dockerfile

```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install llama-index openai

# Copy application code
COPY . .

# Create data directory for indexes
RUN mkdir -p /app/data

# Set environment variables
ENV PYTHONPATH=/app
ENV OPENAI_API_KEY=""
ENV AWS_ACCESS_KEY_ID=""
ENV AWS_SECRET_ACCESS_KEY=""
ENV GITHUB_TOKEN=""

# Run the Llama agent
CMD ["python", "llama_agent.py"]
```

### Step 2: Create a requirements.txt file

```
llama-index>=0.8.0
openai>=1.0.0
pydantic>=2.0.0
boto3>=1.28.0
PyGithub>=2.0.0
python-dotenv>=1.0.0
```

### Step 3: Build and Run the Docker Container

```bash
docker build -t agentic-devops-llama:latest .

docker run -it --rm \
  -e OPENAI_API_KEY=your-openai-api-key \
  -e AWS_ACCESS_KEY_ID=your-aws-access-key \
  -e AWS_SECRET_ACCESS_KEY=your-aws-secret-key \
  -e GITHUB_TOKEN=your-github-token \
  -v $(pwd)/data:/app/data \
  agentic-devops-llama:latest
```

## Llama Web Application

Create a web interface for your Llama-powered DevOps assistant:

### Step 1: Create a FastAPI Application

```python
import os
import asyncio
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from llama_index.agent import ReActAgent
from llama_index.llms import OpenAI

# Import Agentic DevOps components
from agentic_devops.src.aws import list_ec2_instances, start_ec2_instances, stop_ec2_instances
from agentic_devops.src.github import get_repository, list_issues, create_issue

app = FastAPI()

# Define tools
tools = [
    list_ec2_instances,
    start_ec2_instances,
    stop_ec2_instances,
    get_repository,
    list_issues,
    create_issue
]

# Create an agent
agent = ReActAgent.from_tools(
    tools,
    llm=OpenAI(model="gpt-4o"),
    verbose=True
)

# Define request model
class QueryRequest(BaseModel):
    query: str

# Define response model
class QueryResponse(BaseModel):
    response: str

# API endpoint
@app.post("/query", response_model=QueryResponse)
async def query(request: QueryRequest):
    try:
        response = await agent.aquery(request.query)
        return {"response": str(response)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# WebSocket for streaming responses
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            query = await websocket.receive_text()
            response_stream = agent.astream_query(query)
            
            async for token in response_stream:
                await websocket.send_text(token)
            
            await websocket.send_text("[DONE]")
    except WebSocketDisconnect:
        pass

# Serve HTML
@app.get("/", response_class=HTMLResponse)
async def get():
    with open("static/index.html", "r") as f:
        return f.read()

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### Step 2: Create a Simple HTML Interface

Create a `static/index.html` file:

```html
<!DOCTYPE html>
<html>
<head>
    <title>DevOps Assistant</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        #chat-container {
            height: 400px;
            border: 1px solid #ccc;
            padding: 10px;
            overflow-y: auto;
            margin-bottom: 10px;
        }
        .user-message {
            background-color: #e6f7ff;
            padding: 8px;
            border-radius: 5px;
            margin-bottom: 10px;
        }
        .assistant-message {
            background-color: #f0f0f0;
            padding: 8px;
            border-radius: 5px;
            margin-bottom: 10px;
        }
        #input-container {
            display: flex;
        }
        #query-input {
            flex-grow: 1;
            padding: 8px;
            margin-right: 10px;
        }
    </style>
</head>
<body>
    <h1>DevOps Assistant</h1>
    <div id="chat-container"></div>
    <div id="input-container">
        <input type="text" id="query-input" placeholder="Ask a DevOps question...">
        <button onclick="sendQuery()">Send</button>
    </div>

    <script>
        const chatContainer = document.getElementById('chat-container');
        const queryInput = document.getElementById('query-input');
        let socket;

        function connectWebSocket() {
            socket = new WebSocket(`ws://${window.location.host}/ws`);
            
            socket.onmessage = function(event) {
                if (event.data === "[DONE]") {
                    return;
                }
                
                const lastMessage = chatContainer.lastElementChild;
                if (lastMessage && lastMessage.classList.contains('assistant-message')) {
                    lastMessage.textContent += event.data;
                } else {
                    const messageElement = document.createElement('div');
                    messageElement.classList.add('assistant-message');
                    messageElement.textContent = event.data;
                    chatContainer.appendChild(messageElement);
                }
                
                chatContainer.scrollTop = chatContainer.scrollHeight;
            };
            
            socket.onclose = function() {
                setTimeout(connectWebSocket, 1000);
            };
        }

        function sendQuery() {
            const query = queryInput.value.trim();
            if (!query) return;
            
            const messageElement = document.createElement('div');
            messageElement.classList.add('user-message');
            messageElement.textContent = query;
            chatContainer.appendChild(messageElement);
            
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(query);
            } else {
                fetch('/query', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ query })
                })
                .then(response => response.json())
                .then(data => {
                    const messageElement = document.createElement('div');
                    messageElement.classList.add('assistant-message');
                    messageElement.textContent = data.response;
                    chatContainer.appendChild(messageElement);
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                });
            }
            
            queryInput.value = '';
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        queryInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendQuery();
            }
        });

        connectWebSocket();
    </script>
</body>
</html>
```

### Step 3: Run the Web Application

```bash
pip install fastapi uvicorn
python app.py
```

## Deploying Llama with AWS Lambda

### Step 1: Create a Lambda Handler

```python
import os
import json
import asyncio
from llama_index.agent import ReActAgent
from llama_index.llms import OpenAI

# Import Agentic DevOps components
from agentic_devops.src.aws import list_ec2_instances, start_ec2_instances, stop_ec2_instances
from agentic_devops.src.github import get_repository, list_issues, create_issue

# Define tools
tools = [
    list_ec2_instances,
    start_ec2_instances,
    stop_ec2_instances,
    get_repository,
    list_issues,
    create_issue
]

# Create an agent
agent = ReActAgent.from_tools(
    tools,
    llm=OpenAI(model="gpt-4o"),
    verbose=True
)

def handler(event, context):
    """AWS Lambda handler function."""
    try:
        # Extract query from event
        body = json.loads(event.get('body', '{}'))
        query = body.get('query', '')
        
        # Run the agent
        response = asyncio.run(agent.aquery(query))
        
        # Return the result
        return {
            'statusCode': 200,
            'body': json.dumps({
                'response': str(response)
            }),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e)
            }),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }
```

### Step 2: Package for Lambda Deployment

Create a deployment package following the AWS Lambda deployment guide, ensuring all dependencies are included.

## Performance Optimization

### Optimizing Llama for Production

1. **Caching**: Implement caching for query results and embeddings
   ```python
   from llama_index import ServiceContext, set_global_service_context
   from llama_index.callbacks import CallbackManager, LlamaDebugHandler
   from llama_index.llms import OpenAI
   
   # Set up caching
   llm = OpenAI(model="gpt-4o", temperature=0, cache=True)
   service_context = ServiceContext.from_defaults(llm=llm)
   set_global_service_context(service_context)
   ```

2. **Batching**: Use batching for processing multiple documents
   ```python
   from llama_index import VectorStoreIndex
   
   # Process documents in batches
   batch_size = 10
   for i in range(0, len(documents), batch_size):
       batch = documents[i:i+batch_size]
       VectorStoreIndex.from_documents(batch, service_context=service_context)
   ```

3. **Streaming**: Use streaming for better user experience
   ```python
   # Stream responses
   response_stream = agent.astream_query("List all EC2 instances")
   async for token in response_stream:
       print(token, end="", flush=True)
   ```

4. **Quantization**: Use quantized models for faster inference
   ```python
   from llama_index.llms import LlamaCPP
   
   # Use quantized model
   llm = LlamaCPP(
       model_path="./models/llama-2-7b-chat.Q4_K_M.gguf",
       temperature=0.1,
       max_new_tokens=256,
       context_window=3900,
       generate_kwargs={},
       model_kwargs={"n_gpu_layers": -1},
       verbose=True,
   )
   ```

## Monitoring and Logging

### Llama Debug Handler

```python
from llama_index.callbacks import CallbackManager, LlamaDebugHandler

# Set up debug handler
debug_handler = LlamaDebugHandler()
callback_manager = CallbackManager([debug_handler])

# Create service context with callback manager
service_context = ServiceContext.from_defaults(
    llm=OpenAI(model="gpt-4o"),
    callback_manager=callback_manager
)

# Use the service context
agent = ReActAgent.from_tools(
    tools,
    llm=OpenAI(model="gpt-4o"),
    service_context=service_context
)

# After running queries, inspect the debug info
print(debug_handler.get_llm_inputs())
print(debug_handler.get_llm_outputs())
```

### Custom Callback Handler

```python
from llama_index.callbacks import CallbackManager
from llama_index.callbacks.base import BaseCallbackHandler
from typing import Dict, Any, List, Optional

class CustomCallbackHandler(BaseCallbackHandler):
    """Custom callback handler for monitoring and logging."""
    
    def __init__(self):
        super().__init__()
        self.logs = []
    
    def on_llm_start(
        self, serialized: Dict[str, Any], prompts: List[str], **kwargs: Any
    ) -> None:
        """Called when LLM starts running."""
        self.logs.append({"event": "llm_start", "prompts": prompts})
    
    def on_llm_end(
        self, serialized: Dict[str, Any], response: Optional[Any], **kwargs: Any
    ) -> None:
        """Called when LLM ends running."""
        self.logs.append({"event": "llm_end", "response": str(response)})
    
    def on_tool_start(
        self, serialized: Dict[str, Any], input_str: str, **kwargs: Any
    ) -> None:
        """Called when tool starts running."""
        self.logs.append({"event": "tool_start", "input": input_str})
    
    def on_tool_end(
        self, serialized: Dict[str, Any], output: Optional[str], **kwargs: Any
    ) -> None:
        """Called when tool ends running."""
        self.logs.append({"event": "tool_end", "output": output})
    
    def get_logs(self):
        """Get all logs."""
        return self.logs

# Use the custom handler
custom_handler = CustomCallbackHandler()
callback_manager = CallbackManager([custom_handler])

# Create service context with callback manager
service_context = ServiceContext.from_defaults(
    llm=OpenAI(model="gpt-4o"),
    callback_manager=callback_manager
)

# After running queries, get the logs
logs = custom_handler.get_logs()
print(json.dumps(logs, indent=2))
```

## Troubleshooting

Common issues and solutions:

1. **Memory Issues**: If you encounter memory issues with large indexes
   - Use chunking to break documents into smaller pieces
   - Implement streaming to process data incrementally
   - Use a smaller model or quantized version

2. **Slow Performance**:
   - Use caching for repeated queries
   - Optimize embeddings with dimensionality reduction
   - Use batching for processing multiple documents
   - Consider using local models for faster inference

3. **Integration Issues**:
   - Ensure tool signatures match Llama's expectations
   - Check for compatibility between Llama Index and OpenAI versions
   - Verify that all dependencies are correctly installed

4. **Deployment Issues**:
   - Check Lambda timeout and memory settings
   - Ensure all dependencies are included in the deployment package
   - Verify environment variables are correctly set

## Related Documentation

- [Docker Deployment](docker.md)
- [AWS Lambda Deployment](aws-lambda.md)
- [OpenAI Agents Integration](../implementation/openai-agents-integration.md)
- [API Reference](../api/agent-tools.md)