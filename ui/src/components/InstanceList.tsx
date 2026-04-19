import React from 'react';
import { Instance } from '../services/ec2Service';
import { cn } from '@/lib/utils';

interface InstanceListProps {
  instances: Instance[];
  onSelect?: (instance: Instance) => void;
  loading?: boolean;
  selectedInstanceId?: string;
}

const InstanceList: React.FC<InstanceListProps> = ({ 
  instances, 
  onSelect, 
  loading = false,
  selectedInstanceId 
}) => {
  return (
    <div className="border border-[#33FF00]/30 p-2 rounded-sm">
      <div className="text-center mb-2 border-b border-[#33FF00]/30 pb-1 text-[#33FF00] font-micro uppercase tracking-wider text-sm">
        EC2 INSTANCES
      </div>
      
      {loading ? (
        <div className="text-[#33FF00]/70 text-center py-2 animate-pulse">
          Loading instances...
        </div>
      ) : instances.length === 0 ? (
        <div className="text-[#33FF00]/70 text-center py-2">
          No instances found
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-1">
          {instances.map((instance) => (
            <button
              key={instance.id}
              onClick={() => onSelect?.(instance)}
              className={cn(
                "text-left px-2 py-1 hover:bg-[#33FF00]/20 transition-colors text-sm flex justify-between items-center",
                selectedInstanceId === instance.id && "bg-[#33FF00]/20 border-l-2 border-[#33FF00]"
              )}
            >
              <span className={cn(
                selectedInstanceId === instance.id && "text-[#33FF00]"
              )}>
                {instance.id}
              </span>
              <span className={cn(
                "text-[#33FF00]/70",
                instance.state.toLowerCase() === 'running' && "text-green-500",
                instance.state.toLowerCase() === 'stopped' && "text-yellow-500",
                instance.state.toLowerCase() === 'terminated' && "text-red-500",
                selectedInstanceId === instance.id && "opacity-100"
              )}>
                {instance.state}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstanceList;