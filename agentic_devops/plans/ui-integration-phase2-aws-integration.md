# UI Integration Plan: Phase 2 - AWS EC2 Integration

## Overview

Building on the foundation established in Phase 1, this phase focuses on implementing comprehensive AWS EC2 functionality in the UI. We'll create a dedicated AWS dashboard, detailed instance management interfaces, and real-time monitoring features.

## Goals

1. Create a dedicated AWS EC2 dashboard page
2. Implement detailed EC2 instance management UI components
3. Add real-time instance monitoring capabilities
4. Implement instance creation workflow with configuration options
5. Add visualization components for EC2 status and metrics

## Implementation Details

### 1. AWS EC2 Dashboard Page

Create a new page component for EC2 operations:

#### EC2Dashboard.tsx

```typescript
import React, { useEffect, useState } from 'react';
import { useDevOps } from '@/context/DevOpsContext';
import { listInstances } from '@/services/ec2Service';
import InstanceList from '@/components/aws/InstanceList';
import InstanceDetails from '@/components/aws/InstanceDetails';
import InstanceMetrics from '@/components/aws/InstanceMetrics';
import CreateInstanceForm from '@/components/aws/CreateInstanceForm';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCw } from 'lucide-react';

const EC2Dashboard: React.FC = () => {
  const { ec2Instances, setEc2Instances, loading, setLoading, error, setError } = useDevOps();
  const [selectedInstance, setSelectedInstance] = useState<any | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchInstances = async () => {
    setLoading(true);
    try {
      const response = await listInstances();
      setEc2Instances(response.instances);
      setError(null);
    } catch (err) {
      setError('Failed to fetch EC2 instances');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstances();
  }, []);

  return (
    <div className="bg-[#111] border-2 border-[#33FF00]/30 rounded-sm p-4 font-micro text-[#33FF00] h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg uppercase tracking-wider">EC2 Instance Management</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-[#33FF00]/50 text-[#33FF00]"
            onClick={() => fetchInstances()}
            disabled={loading}
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-[#33FF00]/50 text-[#33FF00]"
            onClick={() => setShowCreateForm(true)}
          >
            <PlusCircle size={16} className="mr-2" />
            New Instance
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 text-red-500 p-2 rounded-sm mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <InstanceList 
            instances={ec2Instances} 
            onSelect={setSelectedInstance}
            loading={loading}
            selectedInstanceId={selectedInstance?.id}
          />
        </div>
        
        <div className="md:col-span-2">
          {selectedInstance ? (
            <div className="space-y-4">
              <InstanceDetails instance={selectedInstance} />
              <InstanceMetrics instanceId={selectedInstance.id} />
            </div>
          ) : showCreateForm ? (
            <CreateInstanceForm 
              onSubmit={(data) => {
                console.log('Create instance with data:', data);
                // Would call API to create instance
                setShowCreateForm(false);
                fetchInstances();
              }}
              onCancel={() => setShowCreateForm(false)}
            />
          ) : (
            <div className="flex items-center justify-center h-full border border-[#33FF00]/30 rounded-sm p-4">
              <p className="text-[#33FF00]/70">Select an instance or create a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EC2Dashboard;
```

### 2. Enhanced EC2 Instance Components

#### InstanceDetails.tsx - Detailed view of a single instance

```typescript
import React from 'react';
import { startInstance, stopInstance, terminateInstance } from '@/services/ec2Service';
import { Button } from '@/components/ui/button';
import { Play, Square, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InstanceDetailsProps {
  instance: any;
}

const InstanceDetails: React.FC<InstanceDetailsProps> = ({ instance }) => {
  const { toast } = useToast();
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);

  const handleAction = async (action: 'start' | 'stop' | 'terminate') => {
    setActionLoading(action);
    try {
      let response;
      if (action === 'start') {
        response = await startInstance(instance.id);
      } else if (action === 'stop') {
        response = await stopInstance(instance.id);
      } else {
        response = await terminateInstance(instance.id);
      }
      
      toast({
        title: `Instance ${action} operation initiated`,
        description: `Instance ${instance.id} is now ${action === 'start' ? 'starting' : 
                                                      action === 'stop' ? 'stopping' : 
                                                      'terminating'}`,
      });
    } catch (error) {
      toast({
        title: `Failed to ${action} instance`,
        description: `Error: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const isRunning = instance.state.toLowerCase() === 'running';
  const isStopped = instance.state.toLowerCase() === 'stopped';

  return (
    <div className="border border-[#33FF00]/30 rounded-sm p-4">
      <h3 className="text-md uppercase tracking-wider border-b border-[#33FF00]/30 pb-2 mb-4">
        Instance Details
      </h3>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="text-[#33FF00]/70">ID:</div>
        <div>{instance.id}</div>
        
        <div className="text-[#33FF00]/70">State:</div>
        <div className={`${
          isRunning ? 'text-green-500' : 
          isStopped ? 'text-yellow-500' : 
          'text-red-500'
        }`}>
          {instance.state}
        </div>
        
        <div className="text-[#33FF00]/70">Type:</div>
        <div>{instance.type || 'N/A'}</div>
        
        <div className="text-[#33FF00]/70">Zone:</div>
        <div>{instance.zone || 'N/A'}</div>
        
        <div className="text-[#33FF00]/70">Public IP:</div>
        <div>{instance.publicIp || 'N/A'}</div>
        
        <div className="text-[#33FF00]/70">Private IP:</div>
        <div>{instance.privateIp || 'N/A'}</div>
      </div>
      
      <div className="flex gap-2 mt-4">
        {!isRunning && (
          <Button 
            variant="outline" 
            size="sm"
            className="border-green-500/50 text-green-500 hover:bg-green-950"
            disabled={actionLoading !== null}
            onClick={() => handleAction('start')}
          >
            <Play size={16} className="mr-2" />
            Start
          </Button>
        )}
        
        {isRunning && (
          <Button 
            variant="outline" 
            size="sm"
            className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-950"
            disabled={actionLoading !== null}
            onClick={() => handleAction('stop')}
          >
            <Square size={16} className="mr-2" />
            Stop
          </Button>
        )}
        
        <Button 
          variant="outline" 
          size="sm"
          className="border-red-500/50 text-red-500 hover:bg-red-950"
          disabled={actionLoading !== null}
          onClick={() => handleAction('terminate')}
        >
          <Trash2 size={16} className="mr-2" />
          Terminate
        </Button>
      </div>
    </div>
  );
};

export default InstanceDetails;
```

#### InstanceMetrics.tsx - Display instance metrics in retro-styled charts

```typescript
import React, { useState, useEffect } from 'react';
import { getInstanceMetrics } from '@/services/ec2Service';
import { Select } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Chart } from '@/components/ui/chart';

interface InstanceMetricsProps {
  instanceId: string;
}

const InstanceMetrics: React.FC<InstanceMetricsProps> = ({ instanceId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<any>({});
  const [timeRange, setTimeRange] = useState('1h');
  
  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        // In a real app, we would fetch actual metrics data
        // For demo, we'll use mockup data
        const mockMetrics = {
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
        };
        
        setMetrics(mockMetrics);
        setError(null);
      } catch (err) {
        setError('Failed to fetch instance metrics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMetrics();
    // In a real app, you'd set up an interval to fetch metrics periodically
  }, [instanceId, timeRange]);
  
  return (
    <div className="border border-[#33FF00]/30 rounded-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md uppercase tracking-wider">Instance Metrics</h3>
        <Select
          value={timeRange}
          onValueChange={setTimeRange}
          options={[
            { value: '1h', label: 'Last Hour' },
            { value: '24h', label: 'Last 24 Hours' },
            { value: '7d', label: 'Last 7 Days' }
          ]}
          className="w-40"
        />
      </div>
      
      {loading ? (
        <div className="h-40 flex items-center justify-center">
          <div className="text-[#33FF00]/70">Loading metrics...</div>
        </div>
      ) : error ? (
        <div className="h-40 flex items-center justify-center">
          <div className="text-red-500">{error}</div>
        </div>
      ) : (
        <Tabs defaultValue="cpu">
          <TabsList className="mb-4">
            <TabsTrigger value="cpu">CPU</TabsTrigger>
            <TabsTrigger value="memory">Memory</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
            <TabsTrigger value="disk">Disk</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cpu">
            <Chart
              type="line"
              data={metrics.cpu}
              xKey="timestamp"
              yKey="value"
              height={200}
              color="#33FF00"
              label="CPU Usage (%)"
            />
          </TabsContent>
          
          <TabsContent value="memory">
            <Chart
              type="line"
              data={metrics.memory}
              xKey="timestamp"
              yKey="value"
              height={200}
              color="#33FF00"
              label="Memory Usage (%)"
            />
          </TabsContent>
          
          <TabsContent value="network">
            <Chart
              type="line"
              data={metrics.network}
              xKey="timestamp"
              yKey="value"
              height={200}
              color="#33FF00"
              label="Network Traffic (KB/s)"
            />
          </TabsContent>
          
          <TabsContent value="disk">
            <Chart
              type="line"
              data={metrics.disk}
              xKey="timestamp"
              yKey="value"
              height={200}
              color="#33FF00"
              label="Disk Usage (%)"
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default InstanceMetrics;
```

### 3. Instance Creation Form

#### CreateInstanceForm.tsx - Form for creating new EC2 instances

```typescript
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Check, X } from 'lucide-react';

interface CreateInstanceFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const INSTANCE_TYPES = [
  { value: 't2.micro', label: 't2.micro (1 vCPU, 1 GiB RAM)' },
  { value: 't2.small', label: 't2.small (1 vCPU, 2 GiB RAM)' },
  { value: 't2.medium', label: 't2.medium (2 vCPU, 4 GiB RAM)' },
  { value: 't3.micro', label: 't3.micro (2 vCPU, 1 GiB RAM)' },
  { value: 't3.small', label: 't3.small (2 vCPU, 2 GiB RAM)' },
];

const REGIONS = [
  { value: 'us-east-1', label: 'US East (N. Virginia)' },
  { value: 'us-east-2', label: 'US East (Ohio)' },
  { value: 'us-west-1', label: 'US West (N. California)' },
  { value: 'us-west-2', label: 'US West (Oregon)' },
  { value: 'eu-west-1', label: 'EU (Ireland)' },
];

const IMAGES = [
  { value: 'ami-12345', label: 'Amazon Linux 2 AMI' },
  { value: 'ami-23456', label: 'Ubuntu Server 20.04 LTS' },
  { value: 'ami-34567', label: 'Red Hat Enterprise Linux 8' },
  { value: 'ami-45678', label: 'Windows Server 2019' },
];

const CreateInstanceForm: React.FC<CreateInstanceFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    instanceType: 't2.micro',
    region: 'us-east-1',
    image: 'ami-12345',
    keyPair: '',
    securityGroup: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <div className="border border-[#33FF00]/30 rounded-sm p-4">
      <h3 className="text-md uppercase tracking-wider border-b border-[#33FF00]/30 pb-2 mb-4">
        Create EC2 Instance
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm text-[#33FF00]/70 mb-1">
              Instance Name
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="my-ec2-instance"
              className="bg-[#111] border-[#33FF00]/30 text-[#33FF00]"
              required
            />
          </div>
          
          <div>
            <label htmlFor="instanceType" className="block text-sm text-[#33FF00]/70 mb-1">
              Instance Type
            </label>
            <Select
              id="instanceType"
              value={formData.instanceType}
              onValueChange={(value) => handleSelectChange('instanceType', value)}
              options={INSTANCE_TYPES}
              className="bg-[#111] border-[#33FF00]/30 text-[#33FF00]"
            />
          </div>
          
          <div>
            <label htmlFor="region" className="block text-sm text-[#33FF00]/70 mb-1">
              Region
            </label>
            <Select
              id="region"
              value={formData.region}
              onValueChange={(value) => handleSelectChange('region', value)}
              options={REGIONS}
              className="bg-[#111] border-[#33FF00]/30 text-[#33FF00]"
            />
          </div>
          
          <div>
            <label htmlFor="image" className="block text-sm text-[#33FF00]/70 mb-1">
              Amazon Machine Image (AMI)
            </label>
            <Select
              id="image"
              value={formData.image}
              onValueChange={(value) => handleSelectChange('image', value)}
              options={IMAGES}
              className="bg-[#111] border-[#33FF00]/30 text-[#33FF00]"
            />
          </div>
          
          <div>
            <label htmlFor="keyPair" className="block text-sm text-[#33FF00]/70 mb-1">
              Key Pair (optional)
            </label>
            <Input
              id="keyPair"
              name="keyPair"
              value={formData.keyPair}
              onChange={handleChange}
              placeholder="my-key-pair"
              className="bg-[#111] border-[#33FF00]/30 text-[#33FF00]"
            />
          </div>
          
          <div>
            <label htmlFor="securityGroup" className="block text-sm text-[#33FF00]/70 mb-1">
              Security Group (optional)
            </label>
            <Input
              id="securityGroup"
              name="securityGroup"
              value={formData.securityGroup}
              onChange={handleChange}
              placeholder="my-security-group"
              className="bg-[#111] border-[#33FF00]/30 text-[#33FF00]"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4 border-t border-[#33FF00]/30">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-red-500/50 text-red-500 hover:bg-red-950"
          >
            <X size={16} className="mr-2" />
            Cancel
          </Button>
          <Button
            type="submit"
            variant="outline"
            className="border-[#33FF00]/50 text-[#33FF00] hover:bg-[#33FF00]/20"
          >
            <Check size={16} className="mr-2" />
            Create Instance
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateInstanceForm;
```

### 4. AWS Integration Service Enhancements

Enhanced EC2 service with additional functionality:

#### ec2Service.ts (extended)

```typescript
import { fetchWithAuth } from './api';

// Basic instance operations
export async function listInstances() {
  return fetchWithAuth('/ec2/list');
}

export async function getInstance(id: string) {
  return fetchWithAuth(`/ec2/${id}`);
}

export async function createInstance(instanceData: any) {
  return fetchWithAuth('/ec2/create', {
    method: 'POST',
    body: JSON.stringify(instanceData),
  });
}

// Instance state management
export async function startInstance(id: string) {
  return fetchWithAuth(`/ec2/${id}/start`, {
    method: 'POST',
  });
}

export async function stopInstance(id: string) {
  return fetchWithAuth(`/ec2/${id}/stop`, {
    method: 'POST',
  });
}

export async function terminateInstance(id: string) {
  return fetchWithAuth(`/ec2/${id}/terminate`, {
    method: 'POST',
  });
}

// Instance metrics
export async function getInstanceMetrics(id: string, metricType: string, timeRange: string) {
  return fetchWithAuth(`/ec2/${id}/metrics?type=${metricType}&timeRange=${timeRange}`);
}
```

### 5. App Routing Updates

Update App.tsx to include the EC2 dashboard:

```typescript
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import EC2Dashboard from "./pages/EC2Dashboard";
import { DevOpsProvider } from './context/DevOpsContext';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DevOpsProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/ec2" element={<EC2Dashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </DevOpsProvider>
  </QueryClientProvider>
);

export default App;
```

## Testing Strategy

### Unit Tests

For EC2Dashboard.tsx:

```typescript
test('EC2Dashboard loads instances on mount', async () => {
  // Mock EC2 service
  jest.mock('@/services/ec2Service', () => ({
    listInstances: jest.fn().mockResolvedValue({
      instances: [
        { id: 'i-1234', state: 'running', type: 't2.micro', zone: 'us-east-1a' },
        { id: 'i-5678', state: 'stopped', type: 't2.small', zone: 'us-east-1b' }
      ]
    })
  }));
  
  render(
    <DevOpsProvider>
      <EC2Dashboard />
    </DevOpsProvider>
  );
  
  // Check loading state
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  
  // Wait for instances to load
  await waitFor(() => {
    expect(screen.getByText('i-1234')).toBeInTheDocument();
    expect(screen.getByText('i-5678')).toBeInTheDocument();
  });
});
```

For InstanceDetails.tsx:

```typescript
test('InstanceDetails shows correct buttons based on instance state', () => {
  // Test running instance
  const runningInstance = { id: 'i-1234', state: 'running' };
  render(<InstanceDetails instance={runningInstance} />);
  
  expect(screen.queryByText('Start')).not.toBeInTheDocument();
  expect(screen.getByText('Stop')).toBeInTheDocument();
  expect(screen.getByText('Terminate')).toBeInTheDocument();
  
  // Test stopped instance
  cleanup();
  const stoppedInstance = { id: 'i-5678', state: 'stopped' };
  render(<InstanceDetails instance={stoppedInstance} />);
  
  expect(screen.getByText('Start')).toBeInTheDocument();
  expect(screen.queryByText('Stop')).not.toBeInTheDocument();
  expect(screen.getByText('Terminate')).toBeInTheDocument();
});
```

For CreateInstanceForm.tsx:

```typescript
test('CreateInstanceForm submits correct data', async () => {
  const handleSubmit = jest.fn();
  render(<CreateInstanceForm onSubmit={handleSubmit} onCancel={jest.fn()} />);
  
  // Fill out form
  await userEvent.type(screen.getByLabelText('Instance Name'), 'test-instance');
  await userEvent.selectOptions(screen.getByLabelText('Instance Type'), ['t2.micro']);
  await userEvent.selectOptions(screen.getByLabelText('Region'), ['us-east-1']);
  
  // Submit form
  await userEvent.click(screen.getByText('Create Instance'));
  
  // Check submission
  expect(handleSubmit).toHaveBeenCalledWith({
    name: 'test-instance',
    instanceType: 't2.micro',
    region: 'us-east-1',
    image: 'ami-12345',
    keyPair: '',
    securityGroup: ''
  });
});
```

### Integration Tests

Test the workflow of creating and managing EC2 instances:

```typescript
test('EC2 instance creation workflow', async () => {
  render(<EC2Dashboard />);
  
  // Click create new instance button
  await userEvent.click(screen.getByText('New Instance'));
  
  // Fill out form
  await userEvent.type(screen.getByLabelText('Instance Name'), 'integration-test-instance');
  await userEvent.selectOptions(screen.getByLabelText('Instance Type'), ['t2.micro']);
  
  // Submit form
  await userEvent.click(screen.getByText('Create Instance'));
  
  // Check for toast notification
  expect(screen.getByText('Instance creation initiated')).toBeInTheDocument();
  
  // Wait for instance to appear in list
  await waitFor(() => {
    expect(screen.getByText('integration-test-instance')).toBeInTheDocument();
  });
});
```

## Next Steps

After completing Phase 2, we will proceed to Phase 3, which focuses on GitHub repository management and integration with EC2 deployments, implementing the deployment workflows, and creating a unified deployment dashboard.