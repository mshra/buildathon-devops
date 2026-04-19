import React, { useState } from 'react';
import { startInstance, stopInstance, terminateInstance, Instance } from '@/services/ec2Service';
import { Button } from '@/components/ui/button';
import { Play, Square, Trash2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface InstanceDetailsProps {
  instance: Instance;
}

const InstanceDetails: React.FC<InstanceDetailsProps> = ({ instance }) => {
  const { toast } = useToast();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmTerminate, setConfirmTerminate] = useState(false);

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
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: `Failed to ${action} instance`,
        description: `Error: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
      setConfirmTerminate(false);
    }
  };

  const isRunning = instance.state.toLowerCase() === 'running';
  const isStopped = instance.state.toLowerCase() === 'stopped';
  const isTerminated = instance.state.toLowerCase() === 'terminated';

  return (
    <div className="border border-[#33FF00]/30 rounded-sm p-4">
      <h3 className="text-md uppercase tracking-wider border-b border-[#33FF00]/30 pb-2 mb-4 text-[#33FF00]">
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
      
      {!isTerminated && (
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
              {actionLoading === 'start' ? 'Starting...' : 'Start'}
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
              {actionLoading === 'stop' ? 'Stopping...' : 'Stop'}
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm"
            className="border-red-500/50 text-red-500 hover:bg-red-950"
            disabled={actionLoading !== null}
            onClick={() => setConfirmTerminate(true)}
          >
            <Trash2 size={16} className="mr-2" />
            Terminate
          </Button>
        </div>
      )}

      <AlertDialog open={confirmTerminate} onOpenChange={setConfirmTerminate}>
        <AlertDialogContent className="bg-black border-2 border-[#33FF00]/30 p-6 font-micro text-[#33FF00]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-red-500 uppercase tracking-widest text-lg mb-4 flex items-center justify-center">
              <AlertTriangle className="mr-2" /> Terminate Instance
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#33FF00]/80 mb-4 text-center">
              Are you sure you want to terminate instance {instance.id}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col space-y-3">
            <AlertDialogAction
              className="w-full p-3 border border-red-500/30 bg-[#111] text-red-500 hover:bg-red-950 font-micro uppercase text-sm transition-colors"
              onClick={() => handleAction('terminate')}
              disabled={actionLoading === 'terminate'}
            >
              {actionLoading === 'terminate' ? 'Terminating...' : 'Yes, Terminate Instance'}
            </AlertDialogAction>
            <AlertDialogCancel className="w-full p-3 border border-[#33FF00]/30 bg-[#111] hover:bg-[#222] text-[#33FF00] font-micro uppercase text-sm transition-colors">
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InstanceDetails;