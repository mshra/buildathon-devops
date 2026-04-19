import React, { useEffect, useState } from 'react';
import { useDevOps } from '@/contexts/DevOpsContext';
import { listInstances } from '@/services/ec2Service';
import { RefreshCw, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  InstanceList, 
  InstanceDetails, 
  InstanceMetrics, 
  CreateInstanceForm,
  NewInstanceButton
} from '@/components/aws';
import { Instance } from '@/services/ec2Service';

const EC2Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { ec2Instances, setEc2Instances, loading, setLoading, error, setError } = useDevOps();
  const [selectedInstance, setSelectedInstance] = useState<Instance | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchInstances = async () => {
    setLoading(true);
    try {
      const response = await listInstances();
      setEc2Instances(response.instances);
      setError(null);
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(`Failed to fetch EC2 instances: ${errorMessage}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstances();
  }, []);

  return (
    <div className="min-h-[100dvh] bg-black flex flex-col items-center justify-between p-2 md:p-4 lg:p-8 overflow-hidden">
      <div className="w-full max-w-3xl md:max-w-4xl flex flex-col h-[100dvh]">
        {/* Terminal header */}
        <div className="bg-[#111] border border-[#33FF00]/30 rounded-sm p-2 mb-2 md:mb-4 flex justify-between items-center">
          <div className="text-[#33FF00]/70 font-micro text-[10px] md:text-xs tracking-widest flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-[#33FF00]/70 hover:text-[#33FF00] hover:bg-transparent p-0 mr-2"
              onClick={() => navigate('/')}
            >
              <ChevronLeft className="h-3 w-3 mr-1" />
              <span className="font-micro uppercase text-xs">Back</span>
            </Button>
            <span className="hidden sm:inline">AGENTIC DEVOPS v0.1</span>
            <span className="inline sm:hidden">DEVOPS v0.1</span>
          </div>
          <div className="text-[#33FF00] font-micro text-[10px] md:text-xs tracking-widest blink-text">
            {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex-1 grid grid-cols-1 gap-2 md:gap-4 relative overflow-hidden">
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
                
                <NewInstanceButton 
                  size="sm"
                  onClick={() => setShowCreateForm(true)}
                />
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
                  <div className="flex flex-col items-center justify-center h-full border border-[#33FF00]/30 rounded-sm p-4">
                    <p className="text-[#33FF00]/70 mb-4">Select an instance or create a new one</p>
                    <NewInstanceButton 
                      onClick={() => setShowCreateForm(true)}
                      fullWidth
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Terminal footer */}
        <div className="bg-[#111] border border-[#33FF00]/30 rounded-sm mt-2 md:mt-4 p-1 md:p-2 flex justify-between items-center">
          <div className="text-[#33FF00]/70 font-micro text-[8px] md:text-xs tracking-widest mb-1">
            EC2: {ec2Instances.length} INSTANCE{ec2Instances.length !== 1 ? 'S' : ''}
          </div>
          <div className="text-[#33FF00]/70 font-micro text-[8px] md:text-xs tracking-widest mb-1">
            AWS CLOUD SERVICES
          </div>
        </div>
      </div>
    </div>
  );
};

export default EC2Dashboard;