import { fetchWithAuth } from './api';

export interface Instance {
  id: string;
  name?: string;
  state: string;
  type?: string;
  zone?: string;
  publicIp?: string;
  privateIp?: string;
  launchTime?: string;
  tags?: Record<string, string>;
}

export interface InstanceMetric {
  timestamp: string;
  value: number;
}

export interface InstanceMetrics {
  cpu: InstanceMetric[];
  memory: InstanceMetric[];
  network: InstanceMetric[];
  disk: InstanceMetric[];
}

export interface CreateInstanceParams {
  name: string;
  instanceType: string;
  region: string;
  image: string;
  keyPair?: string;
  securityGroup?: string;
  userData?: string;
  tags?: Record<string, string>;
}

// Basic instance operations
export async function listInstances() {
  // For demo purposes, return mock data
  const mockInstances: Instance[] = [
    {
      id: 'i-1234567890abcdef0',
      name: 'web-server-1',
      state: 'running',
      type: 't2.micro',
      zone: 'us-east-1a',
      publicIp: '54.123.45.67',
      privateIp: '172.31.45.67',
      launchTime: '2025-03-15T10:30:00Z',
      tags: { Name: 'web-server-1', Environment: 'production' }
    },
    {
      id: 'i-0abcdef1234567890',
      name: 'db-server-1',
      state: 'stopped',
      type: 't2.medium',
      zone: 'us-east-1b',
      privateIp: '172.31.67.89',
      launchTime: '2025-03-10T14:20:00Z',
      tags: { Name: 'db-server-1', Environment: 'production' }
    },
    {
      id: 'i-1234567890abcdef1',
      name: 'dev-server',
      state: 'running',
      type: 't3.small',
      zone: 'us-east-1c',
      publicIp: '54.234.56.78',
      privateIp: '172.31.78.90',
      launchTime: '2025-03-18T09:15:00Z',
      tags: { Name: 'dev-server', Environment: 'development' }
    }
  ];

  return { instances: mockInstances };
  
  // In a real app, we would call the API
  // return fetchWithAuth('/ec2/list');
}

export async function getInstance(id: string) {
  // For demo purposes, return mock data
  const mockInstance: Instance = {
    id,
    name: 'web-server-1',
    state: 'running',
    type: 't2.micro',
    zone: 'us-east-1a',
    publicIp: '54.123.45.67',
    privateIp: '172.31.45.67',
    launchTime: '2025-03-15T10:30:00Z',
    tags: { Name: 'web-server-1', Environment: 'production' }
  };

  return { instance: mockInstance };
  
  // In a real app, we would call the API
  // return fetchWithAuth(`/ec2/${id}`);
}

export async function createInstance(instanceData: CreateInstanceParams) {
  console.log('Creating instance with data:', instanceData);
  
  // For demo purposes, return mock data
  const mockInstance: Instance = {
    id: `i-${Math.random().toString(36).substring(2, 15)}`,
    name: instanceData.name,
    state: 'pending',
    type: instanceData.instanceType,
    zone: `${instanceData.region}a`,
    launchTime: new Date().toISOString(),
    tags: instanceData.tags
  };

  return { instance: mockInstance };
  
  // In a real app, we would call the API
  // return fetchWithAuth('/ec2/create', {
  //   method: 'POST',
  //   body: JSON.stringify(instanceData),
  // });
}

// Instance state management
export async function startInstance(id: string) {
  console.log(`Starting instance ${id}`);
  
  // For demo purposes, return mock data
  return { success: true, message: `Instance ${id} is starting` };
  
  // In a real app, we would call the API
  // return fetchWithAuth(`/ec2/${id}/start`, {
  //   method: 'POST',
  // });
}

export async function stopInstance(id: string) {
  console.log(`Stopping instance ${id}`);
  
  // For demo purposes, return mock data
  return { success: true, message: `Instance ${id} is stopping` };
  
  // In a real app, we would call the API
  // return fetchWithAuth(`/ec2/${id}/stop`, {
  //   method: 'POST',
  // });
}

export async function terminateInstance(id: string) {
  console.log(`Terminating instance ${id}`);
  
  // For demo purposes, return mock data
  return { success: true, message: `Instance ${id} is terminating` };
  
  // In a real app, we would call the API
  // return fetchWithAuth(`/ec2/${id}/terminate`, {
  //   method: 'POST',
  // });
}

// Instance metrics
export async function getInstanceMetrics(id: string, metricType: string = 'all', timeRange: string = '1h') {
  console.log(`Getting ${metricType} metrics for instance ${id} over ${timeRange}`);
  
  // For demo purposes, return mock data
  const generateMetrics = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      timestamp: new Date(Date.now() - (count - i) * 60000).toISOString(),
      value: Math.floor(Math.random() * 100)
    }));
  };
  
  const mockMetrics: InstanceMetrics = {
    cpu: generateMetrics(60),
    memory: generateMetrics(60),
    network: generateMetrics(60).map(m => ({ ...m, value: m.value * 10 })), // Higher values for network
    disk: generateMetrics(60)
  };

  return { metrics: mockMetrics };
  
  // In a real app, we would call the API
  // return fetchWithAuth(`/ec2/${id}/metrics?type=${metricType}&timeRange=${timeRange}`);
}