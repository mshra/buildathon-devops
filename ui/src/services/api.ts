// API configuration and base methods
export const API_BASE_URL = '/api';

export async function fetchWithAuth<T>(endpoint: string, options = {}): Promise<T> {
  // For demo/mock implementation, returns dummy data
  const mockResponses: Record<string, unknown> = {
    '/ec2/list': { 
      instances: [
        { 
          id: 'i-1234abcd', 
          state: 'running', 
          type: 't2.micro', 
          zone: 'us-east-1a',
          publicIp: '54.123.45.67',
          privateIp: '172.31.45.67'
        },
        { 
          id: 'i-5678efgh', 
          state: 'stopped', 
          type: 't2.small', 
          zone: 'us-east-1b',
          publicIp: null,
          privateIp: '172.31.89.10'
        },
        { 
          id: 'i-9012ijkl', 
          state: 'pending', 
          type: 't3.medium', 
          zone: 'us-east-1c',
          publicIp: null,
          privateIp: '172.31.12.34'
        }
      ] 
    },
    '/ec2/i-1234abcd': { 
      instance: { 
        id: 'i-1234abcd', 
        state: 'running', 
        type: 't2.micro', 
        zone: 'us-east-1a',
        publicIp: '54.123.45.67',
        privateIp: '172.31.45.67'
      } 
    },
    '/ec2/i-5678efgh': { 
      instance: { 
        id: 'i-5678efgh', 
        state: 'stopped', 
        type: 't2.small', 
        zone: 'us-east-1b',
        publicIp: null,
        privateIp: '172.31.89.10'
      } 
    },
    '/ec2/create': { 
      instance: { 
        id: 'i-newinstance', 
        state: 'pending', 
        type: 't2.micro', 
        zone: 'us-east-1a',
        publicIp: null,
        privateIp: '172.31.99.99'
      } 
    },
    '/ec2/i-1234abcd/start': { success: true },
    '/ec2/i-1234abcd/stop': { success: true },
    '/ec2/i-1234abcd/terminate': { success: true },
    '/ec2/i-1234abcd/metrics': {
      cpu: Array.from({ length: 60 }, (_, i) => ({
        timestamp: new Date(Date.now() - (60 - i) * 60000).toISOString(),
        value: Math.floor(Math.random() * 100)
      })),
      memory: Array.from({ length: 60 }, (_, i) => ({
        timestamp: new Date(Date.now() - (60 - i) * 60000).toISOString(),
        value: Math.floor(Math.random() * 100)
      })),
      network: Array.from({ length: 60 }, (_, i) => ({
        timestamp: new Date(Date.now() - (60 - i) * 60000).toISOString(),
        value: Math.floor(Math.random() * 1000)
      })),
      disk: Array.from({ length: 60 }, (_, i) => ({
        timestamp: new Date(Date.now() - (60 - i) * 60000).toISOString(),
        value: Math.floor(Math.random() * 100)
      }))
    },
    '/github/repos': { 
      repos: [
        { name: 'agentic-devops', owner: 'username', description: 'DevOps automation with AI' },
        { name: 'web-app', owner: 'username', description: 'Web application project' },
        { name: 'api-service', owner: 'username', description: 'Backend API service' }
      ] 
    },
    '/github/repos/username/agentic-devops': { 
      repo: { 
        name: 'agentic-devops', 
        owner: 'username', 
        description: 'DevOps automation with AI' 
      } 
    }
  };
  
  // Check if the endpoint starts with a pattern we have mock data for
  for (const key in mockResponses) {
    if (endpoint === key || 
        (endpoint.startsWith('/ec2/') && endpoint.endsWith('/start') && key.endsWith('/start')) ||
        (endpoint.startsWith('/ec2/') && endpoint.endsWith('/stop') && key.endsWith('/stop')) ||
        (endpoint.startsWith('/ec2/') && endpoint.endsWith('/terminate') && key.endsWith('/terminate')) ||
        (endpoint.startsWith('/ec2/') && endpoint.includes('/metrics') && key.includes('/metrics'))) {
      return mockResponses[key] as T;
    }
  }
  
  // In real implementation, this would make actual API calls
  // return fetch(`${API_BASE_URL}${endpoint}`, {
  //   ...options,
  //   headers: {
  //     'Content-Type': 'application/json',
  //     ...options.headers
  //   }
  // }).then(res => res.json());
  
  // For now, return a mock empty response
  console.warn(`No mock data found for endpoint: ${endpoint}`);
  return {} as T;
}