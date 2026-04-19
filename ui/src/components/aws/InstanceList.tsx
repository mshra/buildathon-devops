import React from 'react';
import { Instance } from '@/services/ec2Service';

interface InstanceListProps {
  instances: Instance[];
  onSelect: (instance: Instance) => void;
  loading: boolean;
  selectedInstanceId?: string;
}

const InstanceList: React.FC<InstanceListProps> = ({ 
  instances, 
  onSelect, 
  loading, 
  selectedInstanceId 
}) => {
  return (
    <div className="border border-[#33FF00]/30 rounded-sm p-4 h-full">
      <h3 className="text-md uppercase tracking-wider border-b border-[#33FF00]/30 pb-2 mb-4">
        Instances
      </h3>
      
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="text-[#33FF00]/70 animate-pulse">Loading instances...</div>
        </div>
      ) : instances.length === 0 ? (
        <div className="flex items-center justify-center h-40">
          <div className="text-[#33FF00]/70">No instances found</div>
        </div>
      ) : (
        <div className="space-y-2">
          {instances.map((instance) => (
            <button
              key={instance.id}
              onClick={() => onSelect(instance)}
              className={`w-full text-left px-3 py-2 rounded-sm transition-colors flex justify-between items-center ${
                selectedInstanceId === instance.id 
                  ? 'bg-[#33FF00]/20 border-l-2 border-[#33FF00]' 
                  : 'hover:bg-[#33FF00]/10 border-l-2 border-transparent'
              }`}
            >
              <div>
                <div className="font-mono">{instance.id}</div>
                <div className="text-xs text-[#33FF00]/70">{instance.type || 'Unknown type'}</div>
              </div>
              <div className={`px-2 py-1 rounded-sm text-xs ${
                instance.state.toLowerCase() === 'running' 
                  ? 'bg-green-900/30 text-green-500' 
                  : instance.state.toLowerCase() === 'stopped' 
                  ? 'bg-yellow-900/30 text-yellow-500'
                  : instance.state.toLowerCase() === 'pending'
                  ? 'bg-blue-900/30 text-blue-500'
                  : 'bg-red-900/30 text-red-500'
              }`}>
                {instance.state}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstanceList;