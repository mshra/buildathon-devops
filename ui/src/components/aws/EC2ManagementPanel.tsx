import React, { useEffect, useState } from 'react';
import { useDevOps } from '@/contexts/DevOpsContext';
import { listInstances, Instance } from '@/services/ec2Service';
import { RefreshCw, Server, DollarSign, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  InstanceList, 
  InstanceDetails, 
  InstanceMetrics, 
  CreateInstanceForm,
  NewInstanceButton,
  AWSServiceStatus,
  AWSCostOverview
} from '@/components/aws';

interface EC2ManagementPanelProps {
  onClose?: () => void;
}

const EC2ManagementPanel: React.FC<EC2ManagementPanelProps> = ({ onClose }) => {
  const { ec2Instances, setEc2Instances, loading, setLoading, error, setError } = useDevOps();
  const [selectedInstance, setSelectedInstance] = useState<Instance | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'instances' | 'status' | 'cost'>('instances');

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

  const returnToInstanceList = () => {
    setSelectedInstance(null);
    setShowCreateForm(false);
  };

  return (
    <div className="bg-[#111]/80 border border-[#33FF00]/20 p-4 pt-2 w-full h-full mx-auto flex flex-col fade-in-delay-1 relative overflow-hidden">
      {/* Console Header Bar */}
      <div className="flex items-center justify-between mb-4 border-b border-[#33FF00]/30 pb-2">
        <div className="flex items-center">
          <div className="h-2 w-2 bg-[#33FF00] mr-2 animate-pulse-slow"></div>
          <h2 className="text-[#33FF00]/70 font-micro uppercase tracking-widest text-sm md:text-lg">
            EC2 INSTANCE MANAGEMENT
          </h2>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="ghost"
            size="sm" 
            className="text-[#33FF00]/70 hover:text-[#33FF00] p-0 h-6"
            onClick={() => fetchInstances()}
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 text-red-500 p-2 rounded-sm mb-4 text-sm">
          {error}
        </div>
      )}

      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as 'instances' | 'status' | 'cost')}
        className="flex-1 flex flex-col min-h-0"
      >
        <TabsList className="mb-4 border border-[#33FF00]/30 bg-[#111]">
          <TabsTrigger 
            value="instances" 
            className="data-[state=active]:bg-[#222] data-[state=active]:text-[#33FF00] flex items-center"
          >
            <Server size={14} className="mr-1 md:mr-2" />
            <span className="hidden md:inline">Instances</span>
            <span className="md:hidden">EC2</span>
          </TabsTrigger>
          <TabsTrigger 
            value="status" 
            className="data-[state=active]:bg-[#222] data-[state=active]:text-[#33FF00] flex items-center"
          >
            <Activity size={14} className="mr-1 md:mr-2" />
            <span className="hidden md:inline">Service Status</span>
            <span className="md:hidden">Status</span>
          </TabsTrigger>
          <TabsTrigger 
            value="cost" 
            className="data-[state=active]:bg-[#222] data-[state=active]:text-[#33FF00] flex items-center"
          >
            <DollarSign size={14} className="mr-1 md:mr-2" />
            <span className="hidden md:inline">Cost Overview</span>
            <span className="md:hidden">Cost</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="instances" className="flex-1 min-h-0 relative">
          {selectedInstance ? (
            <div className="space-y-4 h-full flex flex-col">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#33FF00]/70 hover:text-[#33FF00] hover:bg-transparent p-0 mb-2 w-fit"
                onClick={returnToInstanceList}
              >
                ← Back to Instance List
              </Button>
              <ScrollArea className="flex-1 pr-2">
                <InstanceDetails instance={selectedInstance} />
                <div className="h-4"></div>
                <InstanceMetrics instanceId={selectedInstance.id} />
              </ScrollArea>
            </div>
          ) : showCreateForm ? (
            <div className="h-full flex flex-col">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#33FF00]/70 hover:text-[#33FF00] hover:bg-transparent p-0 mb-2 w-fit"
                onClick={returnToInstanceList}
              >
                ← Back to Instance List
              </Button>
              <ScrollArea className="flex-1 pr-2">
                <CreateInstanceForm 
                  onSubmit={(data) => {
                    console.log('Create instance with data:', data);
                    // Would call API to create instance
                    setShowCreateForm(false);
                    fetchInstances();
                  }}
                  onCancel={() => setShowCreateForm(false)}
                />
              </ScrollArea>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-3">
                <div className="text-[#33FF00]/70 font-micro text-sm">
                  {ec2Instances.length} instance{ec2Instances.length !== 1 ? 's' : ''} available
                </div>
                <NewInstanceButton 
                  size="sm"
                  onClick={() => setShowCreateForm(true)}
                />
              </div>
              
              {loading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-[#33FF00]/70 animate-pulse">Loading instances...</div>
                </div>
              ) : ec2Instances.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center border border-[#33FF00]/30 rounded-sm p-4">
                  <p className="text-[#33FF00]/70 mb-4">No EC2 instances found</p>
                  <NewInstanceButton 
                    onClick={() => setShowCreateForm(true)}
                    fullWidth
                  />
                </div>
              ) : (
                <ScrollArea className="flex-1 pr-2">
                  <InstanceList 
                    instances={ec2Instances} 
                    onSelect={setSelectedInstance}
                    loading={loading}
                    selectedInstanceId={selectedInstance?.id}
                  />
                </ScrollArea>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="status" className="flex-1 min-h-0">
          <ScrollArea className="h-full pr-2">
            <AWSServiceStatus />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="cost" className="flex-1 min-h-0">
          <ScrollArea className="h-full pr-2">
            <AWSCostOverview />
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Console Footer */}
      <div className="mt-4 border-t border-[#33FF00]/30 pt-2 text-[10px] font-micro text-[#33FF00]/70 flex justify-between">
        <span>
          {activeTab === 'instances' 
            ? (selectedInstance ? `INSTANCE: ${selectedInstance.id}` : showCreateForm ? "NEW INSTANCE" : "EC2 INSTANCES")
            : activeTab === 'status' 
              ? "SERVICE STATUS" 
              : "COST OVERVIEW"
          }
        </span>
        <span className="blink-text">{">"}</span>
        <span>AWS</span>
      </div>
      
      {/* Screen Overlay Effects */}
      <div className="screen-glitch absolute inset-0 pointer-events-none"></div>
      <div className="screen-vignette absolute inset-0 pointer-events-none"></div>
    </div>
  );
};

export default EC2ManagementPanel;