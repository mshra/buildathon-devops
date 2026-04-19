import React, { useState, useEffect } from 'react';
import { getInstanceMetrics } from '@/services/ec2Service';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select } from '@/components/ui/select';

interface InstanceMetricsProps {
  instanceId: string;
}

interface MetricDataPoint {
  timestamp: string;
  value: number;
}

interface MetricsData {
  cpu: MetricDataPoint[];
  memory: MetricDataPoint[];
  network: MetricDataPoint[];
  disk: MetricDataPoint[];
}

const InstanceMetrics: React.FC<InstanceMetricsProps> = ({ instanceId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [timeRange, setTimeRange] = useState('1h');
  
  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        // In a real app, we would fetch actual metrics data
        // For demo, we'll use mockup data
        const mockMetrics: MetricsData = {
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
      } catch (err: Error | unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(`Failed to fetch instance metrics: ${errorMessage}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMetrics();
    // In a real app, you'd set up an interval to fetch metrics periodically
  }, [instanceId, timeRange]);

  // Function to render a simple ASCII chart
  const renderAsciiChart = (data: MetricDataPoint[], maxHeight: number = 10) => {
    if (!data || data.length === 0) return null;
    
    const values = data.map(d => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    
    return (
      <div className="font-mono text-xs leading-none mt-2">
        {Array.from({ length: maxHeight }).map((_, i) => {
          const threshold = max - (range * i) / maxHeight;
          return (
            <div key={i} className="flex">
              <div className="w-10 text-right pr-1 text-[#33FF00]/50">
                {i === 0 ? Math.ceil(max) : i === maxHeight - 1 ? Math.floor(min) : ''}
              </div>
              <div className="flex-1 flex">
                {values.map((val, j) => (
                  <div 
                    key={j} 
                    className={`w-1 ${val >= threshold ? 'text-[#33FF00]' : 'text-[#33FF00]/20'}`}
                  >
                    {val >= threshold ? '█' : '·'}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <div className="flex mt-1">
          <div className="w-10"></div>
          <div className="flex-1 flex justify-between text-[#33FF00]/50">
            <span>{new Date(data[0].timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            <span>{new Date(data[data.length - 1].timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="border border-[#33FF00]/30 rounded-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md uppercase tracking-wider text-[#33FF00]">Instance Metrics</h3>
        <div className="flex items-center">
          <span className="text-[#33FF00]/70 text-sm mr-2">Time Range:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-[#111] border border-[#33FF00]/30 text-[#33FF00] rounded-sm p-1 text-sm"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="h-40 flex items-center justify-center">
          <div className="text-[#33FF00]/70 animate-pulse">Loading metrics...</div>
        </div>
      ) : error ? (
        <div className="h-40 flex items-center justify-center">
          <div className="text-red-500">{error}</div>
        </div>
      ) : metrics ? (
        <Tabs defaultValue="cpu" className="w-full">
          <TabsList className="mb-4 border border-[#33FF00]/30 bg-[#111]">
            <TabsTrigger value="cpu" className="data-[state=active]:bg-[#222] data-[state=active]:text-[#33FF00]">CPU</TabsTrigger>
            <TabsTrigger value="memory" className="data-[state=active]:bg-[#222] data-[state=active]:text-[#33FF00]">Memory</TabsTrigger>
            <TabsTrigger value="network" className="data-[state=active]:bg-[#222] data-[state=active]:text-[#33FF00]">Network</TabsTrigger>
            <TabsTrigger value="disk" className="data-[state=active]:bg-[#222] data-[state=active]:text-[#33FF00]">Disk</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cpu" className="border border-[#33FF00]/30 p-3 rounded-sm">
            <div className="text-[#33FF00] mb-1">CPU Usage (%)</div>
            {renderAsciiChart(metrics.cpu)}
          </TabsContent>
          
          <TabsContent value="memory" className="border border-[#33FF00]/30 p-3 rounded-sm">
            <div className="text-[#33FF00] mb-1">Memory Usage (%)</div>
            {renderAsciiChart(metrics.memory)}
          </TabsContent>
          
          <TabsContent value="network" className="border border-[#33FF00]/30 p-3 rounded-sm">
            <div className="text-[#33FF00] mb-1">Network Traffic (KB/s)</div>
            {renderAsciiChart(metrics.network)}
          </TabsContent>
          
          <TabsContent value="disk" className="border border-[#33FF00]/30 p-3 rounded-sm">
            <div className="text-[#33FF00] mb-1">Disk Usage (%)</div>
            {renderAsciiChart(metrics.disk)}
          </TabsContent>
        </Tabs>
      ) : null}
    </div>
  );
};

export default InstanceMetrics;