import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listInstances, getInstance } from '../services/ec2Service';

// Mock the fetchWithAuth function
vi.mock('../services/api', () => ({
  fetchWithAuth: vi.fn().mockImplementation((endpoint) => {
    if (endpoint === '/ec2/list') {
      return Promise.resolve({
        instances: [
          { id: 'i-1234', state: 'running' },
          { id: 'i-5678', state: 'stopped' }
        ]
      });
    } else if (endpoint === '/ec2/i-1234') {
      return Promise.resolve({
        instance: { id: 'i-1234', state: 'running', type: 't2.micro', zone: 'us-east-1a' }
      });
    }
    return Promise.reject(new Error('Not found'));
  })
}));

describe('EC2 Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('listInstances should return EC2 instances', async () => {
    const result = await listInstances();
    expect(result.instances).toBeDefined();
    expect(result.instances.length).toBe(2);
    expect(result.instances[0].id).toBe('i-1234');
    expect(result.instances[0].state).toBe('running');
    expect(result.instances[1].id).toBe('i-5678');
    expect(result.instances[1].state).toBe('stopped');
  });

  it('getInstance should return a specific EC2 instance', async () => {
    const result = await getInstance('i-1234');
    expect(result.instance).toBeDefined();
    expect(result.instance.id).toBe('i-1234');
    expect(result.instance.state).toBe('running');
    expect(result.instance.type).toBe('t2.micro');
    expect(result.instance.zone).toBe('us-east-1a');
  });
});