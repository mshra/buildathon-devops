import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Instance } from '@/services/ec2Service';
import { Repository } from '@/services/githubService';

interface DevOpsContextType {
  // EC2 state
  ec2Instances: Instance[];
  setEc2Instances: (instances: Instance[]) => void;
  
  // GitHub state
  repositories: Repository[];
  setRepositories: (repos: Repository[]) => void;
  
  // UI state
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const DevOpsContext = createContext<DevOpsContextType | undefined>(undefined);

export const DevOpsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // EC2 state
  const [ec2Instances, setEc2Instances] = useState<Instance[]>([]);
  
  // GitHub state
  const [repositories, setRepositories] = useState<Repository[]>([]);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <DevOpsContext.Provider
      value={{
        // EC2 state
        ec2Instances,
        setEc2Instances,
        
        // GitHub state
        repositories,
        setRepositories,
        
        // UI state
        loading,
        setLoading,
        error,
        setError,
      }}
    >
      {children}
    </DevOpsContext.Provider>
  );
};

export const useDevOps = (): DevOpsContextType => {
  const context = useContext(DevOpsContext);
  if (context === undefined) {
    throw new Error('useDevOps must be used within a DevOpsProvider');
  }
  return context;
};

export default DevOpsContext;