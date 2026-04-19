# UI Integration Plan: Phase 1 - Framework and Core Components

## Overview

This document outlines the first phase of integrating the Agentic DevOps functionality into the UI. This phase focuses on establishing the core framework needed to interact with the backend Agentic DevOps services while maintaining the existing retro terminal aesthetic.

## Goals

1. Extend the existing CommandPrompt interface to support Agentic DevOps commands
2. Implement a service layer for communicating with the Agentic DevOps backend
3. Create reusable UI components for displaying DevOps operation results
4. Establish a state management approach for DevOps operations
5. Update the navigation to include DevOps sections

## Implementation Details

### 1. Command Interface Extension

#### Updates to CommandPrompt.tsx

- Add new command categories to the existing terminal:
  ```typescript
  const COMMAND_CATEGORIES = [
    { id: 'SYSTEM', commands: ['HELP', 'CLEAR', 'VERSION', 'EXIT'] },
    { id: 'AWS', commands: ['EC2', 'S3', 'IAM'] },
    { id: 'GITHUB', commands: ['REPOS', 'BRANCHES'] },
    { id: 'DEPLOY', commands: ['GITHUB-TO-EC2', 'GITHUB-TO-S3'] }
  ];
  ```

- Implement command parsing for DevOps operations:
  ```typescript
  // Example command parsing for DevOps commands
  const parseCommand = (input: string) => {
    const parts = input.trim().toUpperCase().split(' ');
    const command = parts[0];
    const subCommand = parts[1] || '';
    const args = parts.slice(2);
    
    return { command, subCommand, args };
  };
  ```

- Add help documentation for DevOps commands:
  ```typescript
  const showDevOpsHelp = () => {
    return [
      'DevOps Commands:',
      'EC2 LIST - List EC2 instances',
      'EC2 CREATE - Create EC2 instance',
      'GITHUB REPOS - List GitHub repositories',
      'DEPLOY GITHUB-TO-EC2 - Deploy from GitHub to EC2',
      '...',
    ];
  };
  ```

### 2. Service Layer Implementation

Create a new services directory with the following files:

#### api.ts - Core API service

```typescript
// API configuration and base methods
export const API_BASE_URL = '/api';

export async function fetchWithAuth(endpoint: string, options = {}) {
  // For demo/mock implementation, returns dummy data
  const mockResponses = {
    '/ec2/list': { instances: [{ id: 'i-1234', state: 'running' }] },
    '/github/repos': { repos: [{ name: 'agentic-devops', owner: 'username' }] }
  };
  
  if (endpoint in mockResponses) {
    return mockResponses[endpoint];
  }
  
  // In real implementation, this would make actual API calls
  // return fetch(`${API_BASE_URL}${endpoint}`, {
  //   ...options,
  //   headers: {
  //     'Content-Type': 'application/json',
  //     ...options.headers
  //   }
  // }).then(res => res.json());
}
```

#### ec2Service.ts - EC2 operations

```typescript
import { fetchWithAuth } from './api';

export async function listInstances() {
  return fetchWithAuth('/ec2/list');
}

export async function getInstance(id: string) {
  return fetchWithAuth(`/ec2/${id}`);
}

// Additional EC2 functions would be implemented here
```

#### githubService.ts - GitHub operations

```typescript
import { fetchWithAuth } from './api';

export async function listRepositories() {
  return fetchWithAuth('/github/repos');
}

export async function getRepository(owner: string, repo: string) {
  return fetchWithAuth(`/github/repos/${owner}/${repo}`);
}

// Additional GitHub functions would be implemented here
```

### 3. UI Components for DevOps Operations

Create reusable components for displaying operation results:

#### InstanceList.tsx - Display EC2 instances

```typescript
interface Instance {
  id: string;
  state: string;
  type?: string;
  zone?: string;
}

interface InstanceListProps {
  instances: Instance[];
  onSelect?: (instance: Instance) => void;
}

const InstanceList: React.FC<InstanceListProps> = ({ instances, onSelect }) => {
  return (
    <div className="border border-[#33FF00]/30 p-2">
      <div className="text-center mb-2 border-b border-[#33FF00]/30 pb-1">EC2 INSTANCES</div>
      <div className="grid grid-cols-1 gap-1">
        {instances.length === 0 ? (
          <div className="text-[#33FF00]/70">No instances found</div>
        ) : (
          instances.map((instance) => (
            <button
              key={instance.id}
              onClick={() => onSelect?.(instance)}
              className="text-left px-2 py-1 hover:bg-[#33FF00]/20 transition-colors text-sm flex justify-between"
            >
              <span>{instance.id}</span>
              <span className="text-[#33FF00]/70">{instance.state}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
```

#### RepositoryList.tsx - Display GitHub repositories

```typescript
interface Repository {
  name: string;
  owner: string;
  description?: string;
}

interface RepositoryListProps {
  repositories: Repository[];
  onSelect?: (repo: Repository) => void;
}

const RepositoryList: React.FC<RepositoryListProps> = ({ repositories, onSelect }) => {
  return (
    <div className="border border-[#33FF00]/30 p-2">
      <div className="text-center mb-2 border-b border-[#33FF00]/30 pb-1">GITHUB REPOSITORIES</div>
      <div className="grid grid-cols-1 gap-1">
        {repositories.length === 0 ? (
          <div className="text-[#33FF00]/70">No repositories found</div>
        ) : (
          repositories.map((repo) => (
            <button
              key={`${repo.owner}/${repo.name}`}
              onClick={() => onSelect?.(repo)}
              className="text-left px-2 py-1 hover:bg-[#33FF00]/20 transition-colors text-sm flex justify-between"
            >
              <span>{repo.name}</span>
              <span className="text-[#33FF00]/70">{repo.owner}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
```

### 4. State Management

Implement context for managing DevOps operation state:

#### DevOpsContext.tsx

```typescript
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DevOpsContextType {
  ec2Instances: any[];
  repositories: any[];
  loading: boolean;
  error: string | null;
  setEc2Instances: (instances: any[]) => void;
  setRepositories: (repos: any[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const DevOpsContext = createContext<DevOpsContextType | undefined>(undefined);

export const DevOpsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ec2Instances, setEc2Instances] = useState<any[]>([]);
  const [repositories, setRepositories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <DevOpsContext.Provider
      value={{
        ec2Instances,
        repositories,
        loading,
        error,
        setEc2Instances,
        setRepositories,
        setLoading,
        setError
      }}
    >
      {children}
    </DevOpsContext.Provider>
  );
};

export const useDevOps = (): DevOpsContextType => {
  const context = useContext(DevOpsContext);
  if (context === undefined) {
    throw new Error('useDevOps must be used within a DevOpsProvider');
  }
  return context;
};
```

### 5. Navigation Updates

Update NavigationMenu.tsx to include DevOps sections:

```typescript
// Update the MENU_ITEMS in NavigationMenu.tsx
const MENU_ITEMS = [
  { id: 'DASHBOARD', icon: Home, label: 'Dashboard' },
  { id: 'AWS', icon: Cloud, label: 'AWS' },
  { id: 'GITHUB', icon: GitBranch, label: 'GitHub' },
  { id: 'DEPLOY', icon: Upload, label: 'Deploy' },
  // ... existing menu items
];
```

## Testing Strategy

1. **Unit Tests**
   - Test command parsing functionality
   - Test service layer mock responses
   - Test UI components rendering with different props

2. **Integration Tests**
   - Test CommandPrompt with DevOps commands
   - Test service integration with UI components
   - Test navigation flow between different sections

3. **End-to-End Tests**
   - Test complete workflows (e.g., list instances, select instance, start instance)
   - Test error handling and recovery

## Test Cases

### Command Interface Extension Tests

```typescript
// Example test for command parsing
test('parseCommand should correctly parse DevOps commands', () => {
  const result = parseCommand('EC2 LIST');
  expect(result.command).toBe('EC2');
  expect(result.subCommand).toBe('LIST');
  expect(result.args).toEqual([]);
  
  const resultWithArgs = parseCommand('EC2 CREATE t2.micro us-east-1');
  expect(resultWithArgs.command).toBe('EC2');
  expect(resultWithArgs.subCommand).toBe('CREATE');
  expect(resultWithArgs.args).toEqual(['T2.MICRO', 'US-EAST-1']);
});
```

### Service Layer Tests

```typescript
// Example test for EC2 service
test('listInstances should return mock instances in dev mode', async () => {
  const result = await listInstances();
  expect(result.instances).toBeDefined();
  expect(result.instances.length).toBeGreaterThan(0);
  expect(result.instances[0].id).toBeDefined();
});
```

### UI Component Tests

```typescript
// Example test for InstanceList component
test('InstanceList renders instances correctly', () => {
  const instances = [
    { id: 'i-1234', state: 'running' },
    { id: 'i-5678', state: 'stopped' }
  ];
  
  render(<InstanceList instances={instances} />);
  
  expect(screen.getByText('i-1234')).toBeInTheDocument();
  expect(screen.getByText('running')).toBeInTheDocument();
  expect(screen.getByText('i-5678')).toBeInTheDocument();
  expect(screen.getByText('stopped')).toBeInTheDocument();
});
```

## Next Steps

After completing Phase 1, we will proceed to Phase 2, which focuses on AWS EC2 integration with more detailed UI components and real-time operation handling.