# UI Integration Plan: Phase 3 - GitHub Integration & Deployment Workflows

## Overview

Building on the foundation established in Phases 1 and 2, this phase focuses on implementing GitHub repository management, integration with AWS deployment functions, and creating a unified deployment dashboard. This completes the core Agentic DevOps UI implementation.

## Goals

1. Create GitHub repository management components and views
2. Implement repository exploration functionality
3. Design and implement deployment workflow for GitHub to EC2/S3
4. Integrate GitHub and AWS services for end-to-end deployment
5. Build deployment monitoring and status tracking
6. Create a unified dashboard for DevOps operations

## Implementation Details

### 1. GitHub Repository Management

#### GitHubDashboard.tsx - Main GitHub management page

```typescript
import React, { useEffect, useState } from 'react';
import { useDevOps } from '@/context/DevOpsContext';
import { listRepositories, getRepository } from '@/services/githubService';
import RepositoryList from '@/components/github/RepositoryList';
import RepositoryDetails from '@/components/github/RepositoryDetails';
import RepositoryFiles from '@/components/github/RepositoryFiles';
import { Button } from '@/components/ui/button';
import { RefreshCw, GitBranch, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const GitHubDashboard: React.FC = () => {
  const { repositories, setRepositories, loading, setLoading, error, setError } = useDevOps();
  const [selectedRepo, setSelectedRepo] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'files' | 'branches'>('details');

  const fetchRepositories = async () => {
    setLoading(true);
    try {
      const response = await listRepositories();
      setRepositories(response.repositories);
      setError(null);
    } catch (err) {
      setError('Failed to fetch GitHub repositories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepositories();
  }, []);

  const filteredRepos = repositories.filter(repo => 
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelectRepo = async (repo: any) => {
    setLoading(true);
    try {
      const details = await getRepository(repo.owner, repo.name);
      setSelectedRepo(details);
      setError(null);
    } catch (err) {
      setError(`Failed to fetch details for ${repo.name}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#111] border-2 border-[#33FF00]/30 rounded-sm p-4 font-micro text-[#33FF00] h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg uppercase tracking-wider">GitHub Repository Management</h2>
        <Button 
          variant="outline" 
          size="sm" 
          className="border-[#33FF00]/50 text-[#33FF00]"
          onClick={() => fetchRepositories()}
          disabled={loading}
        >
          <RefreshCw size={16} className="mr-2" />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 text-red-500 p-2 rounded-sm mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-[#33FF00]/50" />
              <Input
                type="text"
                placeholder="Search repositories..."
                className="bg-[#111] border-[#33FF00]/30 text-[#33FF00] pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <RepositoryList 
            repositories={filteredRepos} 
            onSelect={handleSelectRepo}
            loading={loading}
            selectedRepoFullName={selectedRepo ? `${selectedRepo.owner}/${selectedRepo.name}` : ''}
          />
        </div>
        
        <div className="md:col-span-2">
          {selectedRepo ? (
            <div>
              <div className="flex border-b border-[#33FF00]/30 mb-4">
                <button
                  className={`px-4 py-2 ${activeTab === 'details' ? 'text-[#33FF00] border-b-2 border-[#33FF00]' : 'text-[#33FF00]/50'}`}
                  onClick={() => setActiveTab('details')}
                >
                  Overview
                </button>
                <button
                  className={`px-4 py-2 ${activeTab === 'files' ? 'text-[#33FF00] border-b-2 border-[#33FF00]' : 'text-[#33FF00]/50'}`}
                  onClick={() => setActiveTab('files')}
                >
                  Files
                </button>
                <button
                  className={`px-4 py-2 ${activeTab === 'branches' ? 'text-[#33FF00] border-b-2 border-[#33FF00]' : 'text-[#33FF00]/50'}`}
                  onClick={() => setActiveTab('branches')}
                >
                  <GitBranch size={16} className="inline mr-1" />
                  Branches
                </button>
              </div>
              
              {activeTab === 'details' && <RepositoryDetails repository={selectedRepo} />}
              {activeTab === 'files' && <RepositoryFiles repository={selectedRepo} />}
              {activeTab === 'branches' && <RepositoryBranches repository={selectedRepo} />}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full border border-[#33FF00]/30 rounded-sm p-4">
              <p className="text-[#33FF00]/70">Select a repository to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GitHubDashboard;
```

#### RepositoryDetails.tsx - Repository overview component

```typescript
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Star, GitFork, Clock, Lock, Globe, AlertCircle } from 'lucide-react';

interface RepositoryDetailsProps {
  repository: any;
}

const RepositoryDetails: React.FC<RepositoryDetailsProps> = ({ repository }) => {
  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="border border-[#33FF00]/30 rounded-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-md uppercase tracking-wider">{repository.name}</h3>
        <div className="flex items-center">
          {repository.private ? (
            <Lock size={16} className="text-[#33FF00]/70 mr-2" />
          ) : (
            <Globe size={16} className="text-[#33FF00]/70 mr-2" />
          )}
          <span className="text-[#33FF00]/70 text-sm">
            {repository.private ? 'Private' : 'Public'}
          </span>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-[#33FF00]/90">
          {repository.description || 'No description provided'}
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="text-[#33FF00]/70">Owner:</div>
        <div>{repository.owner}</div>
        
        <div className="text-[#33FF00]/70">Default Branch:</div>
        <div>{repository.defaultBranch || 'main'}</div>
        
        <div className="text-[#33FF00]/70">Created:</div>
        <div>{formatDate(repository.createdAt || new Date().toISOString())}</div>
        
        <div className="text-[#33FF00]/70">Last Updated:</div>
        <div>{formatDate(repository.updatedAt || new Date().toISOString())}</div>
        
        <div className="text-[#33FF00]/70">Language:</div>
        <div>{repository.language || 'N/A'}</div>
      </div>
      
      <div className="flex space-x-4 mb-4 border-y border-[#33FF00]/30 py-2">
        <div className="flex items-center">
          <Star size={16} className="text-[#33FF00]/70 mr-1" />
          <span>{repository.stars || 0}</span>
        </div>
        <div className="flex items-center">
          <Eye size={16} className="text-[#33FF00]/70 mr-1" />
          <span>{repository.watchers || 0}</span>
        </div>
        <div className="flex items-center">
          <GitFork size={16} className="text-[#33FF00]/70 mr-1" />
          <span>{repository.forks || 0}</span>
        </div>
        <div className="flex items-center">
          <AlertCircle size={16} className="text-[#33FF00]/70 mr-1" />
          <span>{repository.issues || 0}</span>
        </div>
      </div>
      
      <div className="mt-4 flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="border-[#33FF00]/50 text-[#33FF00]"
          onClick={() => window.open(repository.url, '_blank')}
        >
          View on GitHub
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="border-[#33FF00]/50 text-[#33FF00]"
          onClick={() => {
            // This would link to the deployment page with this repository pre-selected
            window.location.href = `/deploy?repo=${repository.owner}/${repository.name}`;
          }}
        >
          Deploy This Repository
        </Button>
      </div>
    </div>
  );
};

export default RepositoryDetails;
```

#### RepositoryFiles.tsx - File explorer for repositories

```typescript
import React, { useState, useEffect } from 'react';
import { getRepositoryContents } from '@/services/githubService';
import { Button } from '@/components/ui/button';
import { Folder, File, ChevronRight, ChevronDown, ArrowLeft } from 'lucide-react';

interface RepositoryFilesProps {
  repository: any;
}

const RepositoryFiles: React.FC<RepositoryFilesProps> = ({ repository }) => {
  const [path, setPath] = useState<string>('');
  const [contents, setContents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<any | null>(null);
  
  const fetchContents = async (path: string = '') => {
    setLoading(true);
    setCurrentFile(null);
    try {
      const response = await getRepositoryContents(repository.owner, repository.name, path);
      setContents(response.contents);
      setError(null);
    } catch (err) {
      setError(`Failed to fetch contents for ${path || 'root directory'}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchContents(path);
  }, [repository.owner, repository.name, path]);
  
  const handleFileClick = async (item: any) => {
    if (item.type === 'dir') {
      setPath(item.path);
    } else {
      setLoading(true);
      try {
        const file = await getRepositoryContents(repository.owner, repository.name, item.path, true);
        setCurrentFile(file);
        setError(null);
      } catch (err) {
        setError(`Failed to fetch file: ${item.path}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const navigateUp = () => {
    const pathParts = path.split('/');
    pathParts.pop();
    const newPath = pathParts.join('/');
    setPath(newPath);
  };

  return (
    <div className="border border-[#33FF00]/30 rounded-sm p-4">
      <div className="flex items-center justify-between mb-4 border-b border-[#33FF00]/30 pb-2">
        <div className="flex items-center">
          <h3 className="text-md uppercase tracking-wider">Repository Files</h3>
          {path && (
            <button
              onClick={navigateUp}
              className="ml-4 text-[#33FF00]/70 hover:text-[#33FF00] transition-colors"
            >
              <ArrowLeft size={16} />
            </button>
          )}
        </div>
        <div className="text-sm text-[#33FF00]/70">
          {path || 'root'}
        </div>
      </div>
      
      {error && (
        <div className="bg-red-900/20 border border-red-500/50 text-red-500 p-2 rounded-sm mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-[#33FF00]/70">Loading...</p>
        </div>
      ) : currentFile ? (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <h4 className="text-sm font-bold">{currentFile.name}</h4>
            <Button
              variant="outline"
              size="sm"
              className="border-[#33FF00]/50 text-[#33FF00]"
              onClick={() => setCurrentFile(null)}
            >
              Back to file list
            </Button>
          </div>
          
          <pre className="bg-[#0A0A0A] border border-[#33FF00]/30 p-2 rounded-sm overflow-x-auto text-xs text-[#33FF00]/90 max-h-[400px]">
            {currentFile.content}
          </pre>
        </div>
      ) : (
        <div className="max-h-[400px] overflow-y-auto">
          {contents.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-[#33FF00]/70">This directory is empty</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-1">
              {contents
                .sort((a, b) => {
                  // Directories first, then files
                  if (a.type === 'dir' && b.type !== 'dir') return -1;
                  if (a.type !== 'dir' && b.type === 'dir') return 1;
                  // Then alphabetically
                  return a.name.localeCompare(b.name);
                })
                .map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleFileClick(item)}
                    className="flex items-center px-2 py-1 hover:bg-[#33FF00]/20 transition-colors text-left rounded-sm"
                  >
                    {item.type === 'dir' ? (
                      <>
                        <Folder size={16} className="text-yellow-500 mr-2" />
                        <span>{item.name}</span>
                        <ChevronRight size={14} className="ml-auto text-[#33FF00]/50" />
                      </>
                    ) : (
                      <>
                        <File size={16} className="text-[#33FF00]/70 mr-2" />
                        <span>{item.name}</span>
                      </>
                    )}
                  </button>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RepositoryFiles;
```

#### RepositoryBranches.tsx - Branch management

```typescript
import React, { useEffect, useState } from 'react';
import { getRepositoryBranches } from '@/services/githubService';
import { GitBranch, Star } from 'lucide-react';

interface RepositoryBranchesProps {
  repository: any;
}

const RepositoryBranches: React.FC<RepositoryBranchesProps> = ({ repository }) => {
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true);
      try {
        const response = await getRepositoryBranches(repository.owner, repository.name);
        setBranches(response.branches);
        setError(null);
      } catch (err) {
        setError('Failed to fetch branches');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBranches();
  }, [repository.owner, repository.name]);
  
  return (
    <div className="border border-[#33FF00]/30 rounded-sm p-4">
      <h3 className="text-md uppercase tracking-wider border-b border-[#33FF00]/30 pb-2 mb-4">
        Repository Branches
      </h3>
      
      {error && (
        <div className="bg-red-900/20 border border-red-500/50 text-red-500 p-2 rounded-sm mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-[#33FF00]/70">Loading branches...</p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm">
            <p>Default branch: <span className="text-[#33FF00]">{repository.defaultBranch || 'main'}</span></p>
          </div>
          
          <div className="max-h-[320px] overflow-y-auto">
            {branches.length === 0 ? (
              <div className="flex items-center justify-center h-20">
                <p className="text-[#33FF00]/70">No branches found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {branches.map((branch) => (
                  <div
                    key={branch.name}
                    className={`px-3 py-2 border ${
                      branch.name === repository.defaultBranch
                        ? 'border-[#33FF00]/50 bg-[#33FF00]/10'
                        : 'border-[#33FF00]/30'
                    } rounded-sm`}
                  >
                    <div className="flex items-center">
                      <GitBranch size={16} className="text-[#33FF00]/70 mr-2" />
                      <span className="font-bold">{branch.name}</span>
                      {branch.name === repository.defaultBranch && (
                        <Star size={14} className="ml-2 text-yellow-500" />
                      )}
                    </div>
                    <div className="mt-1 text-xs text-[#33FF00]/70">
                      Last commit: {branch.lastCommit?.message || 'N/A'}
                    </div>
                    <div className="mt-1 text-xs text-[#33FF00]/70">
                      Updated: {new Date(branch.lastCommit?.date || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default RepositoryBranches;
```

### 2. GitHub Service Enhancement

Extended GitHub service with additional functionality:

#### githubService.ts (extended)

```typescript
import { fetchWithAuth } from './api';

// Repository listing and details
export async function listRepositories() {
  return fetchWithAuth('/github/repos');
}

export async function getRepository(owner: string, repo: string) {
  return fetchWithAuth(`/github/repos/${owner}/${repo}`);
}

// Repository contents
export async function getRepositoryContents(owner: string, repo: string, path: string = '', getContent: boolean = false) {
  const endpoint = `/github/repos/${owner}/${repo}/contents${path ? `/${path}` : ''}${getContent ? '?content=true' : ''}`;
  return fetchWithAuth(endpoint);
}

// Branch management
export async function getRepositoryBranches(owner: string, repo: string) {
  return fetchWithAuth(`/github/repos/${owner}/${repo}/branches`);
}

export async function getBranch(owner: string, repo: string, branch: string) {
  return fetchWithAuth(`/github/repos/${owner}/${repo}/branches/${branch}`);
}

// Commit history
export async function getCommits(owner: string, repo: string, branch: string = '', path: string = '') {
  let endpoint = `/github/repos/${owner}/${repo}/commits`;
  const params = [];
  
  if (branch) params.push(`branch=${branch}`);
  if (path) params.push(`path=${path}`);
  
  if (params.length > 0) {
    endpoint += `?${params.join('&')}`;
  }
  
  return fetchWithAuth(endpoint);
}

// Repository cloning for deployment
export async function cloneRepository(owner: string, repo: string, branch: string = '') {
  return fetchWithAuth(`/github/clone`, {
    method: 'POST',
    body: JSON.stringify({ owner, repo, branch }),
  });
}
```

### 3. Deployment Components and Workflows

#### DeploymentDashboard.tsx - Main deployment page

```typescript
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDevOps } from '@/context/DevOpsContext';
import { listRepositories } from '@/services/githubService';
import { listInstances } from '@/services/ec2Service';
import DeploymentForm from '@/components/deployment/DeploymentForm';
import DeploymentHistory from '@/components/deployment/DeploymentHistory';
import DeploymentStatus from '@/components/deployment/DeploymentStatus';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const DeploymentDashboard: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const preselectedRepo = queryParams.get('repo');
  
  const { 
    repositories, setRepositories,
    ec2Instances, setEc2Instances,
    deployments, setDeployments,
    loading, setLoading, 
    error, setError 
  } = useDevOps();
  
  const [activeDeployment, setActiveDeployment] = useState<any | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch repositories and instances in parallel
      const [reposResponse, instancesResponse] = await Promise.all([
        listRepositories(),
        listInstances(),
      ]);
      
      setRepositories(reposResponse.repositories);
      setEc2Instances(instancesResponse.instances);
      setError(null);
    } catch (err) {
      setError('Failed to fetch deployment data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-[#111] border-2 border-[#33FF00]/30 rounded-sm p-4 font-micro text-[#33FF00] h-full overflow-y-auto">
      <h2 className="text-lg uppercase tracking-wider mb-4">Deployment Center</h2>
      
      {error && (
        <div className="bg-red-900/20 border border-red-500/50 text-red-500 p-2 rounded-sm mb-4">
          {error}
        </div>
      )}
      
      <Tabs defaultValue="deploy">
        <TabsList className="mb-4">
          <TabsTrigger value="deploy">New Deployment</TabsTrigger>
          <TabsTrigger value="history">Deployment History</TabsTrigger>
          {activeDeployment && (
            <TabsTrigger value="status">Current Deployment</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="deploy">
          <DeploymentForm 
            repositories={repositories}
            ec2Instances={ec2Instances}
            loading={loading}
            onDeploy={(deploymentData) => {
              // This would typically call an API to start the deployment
              console.log('Starting deployment with data:', deploymentData);
              
              // For demo purposes, create a mock deployment
              const newDeployment = {
                id: `deploy-${Date.now()}`,
                repository: `${deploymentData.owner}/${deploymentData.repo}`,
                branch: deploymentData.branch,
                target: deploymentData.instanceId ? 'EC2' : 'S3',
                targetId: deploymentData.instanceId || deploymentData.bucketName,
                status: 'in_progress',
                startTime: new Date().toISOString(),
                steps: [
                  { name: 'Initialize', status: 'completed', timestamp: new Date().toISOString() },
                  { name: 'Clone Repository', status: 'in_progress', timestamp: new Date().toISOString() },
                  { name: 'Build Project', status: 'pending' },
                  { name: 'Deploy to Target', status: 'pending' },
                  { name: 'Verify Deployment', status: 'pending' }
                ]
              };
              
              setDeployments([newDeployment, ...deployments]);
              setActiveDeployment(newDeployment);
            }}
            preselectedRepo={preselectedRepo}
          />
        </TabsContent>
        
        <TabsContent value="history">
          <DeploymentHistory 
            deployments={deployments}
            onViewDetails={(deployment) => {
              setActiveDeployment(deployment);
            }}
          />
        </TabsContent>
        
        {activeDeployment && (
          <TabsContent value="status">
            <DeploymentStatus deployment={activeDeployment} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default DeploymentDashboard;
```

#### DeploymentForm.tsx - Form for initiating deployments

```typescript
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { getBranch, getRepositoryBranches } from '@/services/githubService';
import { GitMerge, Server, Upload, RefreshCw } from 'lucide-react';

interface DeploymentFormProps {
  repositories: any[];
  ec2Instances: any[];
  loading: boolean;
  onDeploy: (deploymentData: any) => void;
  preselectedRepo?: string | null;
}

const DeploymentForm: React.FC<DeploymentFormProps> = ({ 
  repositories, 
  ec2Instances, 
  loading, 
  onDeploy,
  preselectedRepo 
}) => {
  const [deploymentType, setDeploymentType] = useState<'ec2' | 's3'>('ec2');
  const [selectedRepo, setSelectedRepo] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [targetInstanceId, setTargetInstanceId] = useState<string>('');
  const [targetBucket, setTargetBucket] = useState<string>('');
  const [branches, setBranches] = useState<any[]>([]);
  const [loadingBranches, setLoadingBranches] = useState<boolean>(false);
  
  useEffect(() => {
    // If a repo is preselected from URL params, set it as selected
    if (preselectedRepo && repositories.some(r => `${r.owner}/${r.name}` === preselectedRepo)) {
      setSelectedRepo(preselectedRepo);
      fetchBranches(preselectedRepo);
    }
  }, [preselectedRepo, repositories]);
  
  const fetchBranches = async (repoFullName: string) => {
    if (!repoFullName) return;
    
    setLoadingBranches(true);
    const [owner, repo] = repoFullName.split('/');
    
    try {
      const response = await getRepositoryBranches(owner, repo);
      setBranches(response.branches);
      
      // Select default branch if available
      const defaultBranch = repositories.find(r => 
        `${r.owner}/${r.name}` === repoFullName
      )?.defaultBranch;
      
      if (defaultBranch && response.branches.some((b: any) => b.name === defaultBranch)) {
        setSelectedBranch(defaultBranch);
      } else if (response.branches.length > 0) {
        setSelectedBranch(response.branches[0].name);
      }
    } catch (error) {
      console.error('Failed to fetch branches:', error);
    } finally {
      setLoadingBranches(false);
    }
  };
  
  const handleRepoChange = (repoFullName: string) => {
    setSelectedRepo(repoFullName);
    setSelectedBranch('');
    setBranches([]);
    
    if (repoFullName) {
      fetchBranches(repoFullName);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRepo || !selectedBranch) return;
    
    const [owner, repo] = selectedRepo.split('/');
    
    const deploymentData: any = {
      owner,
      repo,
      branch: selectedBranch,
      deploymentType
    };
    
    if (deploymentType === 'ec2') {
      deploymentData.instanceId = targetInstanceId;
    } else {
      deploymentData.bucketName = targetBucket;
    }
    
    onDeploy(deploymentData);
  };
  
  return (
    <div className="border border-[#33FF00]/30 rounded-sm p-4">
      <h3 className="text-md uppercase tracking-wider border-b border-[#33FF00]/30 pb-2 mb-4">
        Deploy from GitHub
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <div className="flex space-x-2 mb-4">
            <Button
              type="button"
              variant={deploymentType === 'ec2' ? 'default' : 'outline'}
              className={deploymentType === 'ec2' 
                ? 'bg-[#33FF00]/20 text-[#33FF00]' 
                : 'border-[#33FF00]/30 text-[#33FF00]/70'}
              onClick={() => setDeploymentType('ec2')}
            >
              <Server size={16} className="mr-2" />
              Deploy to EC2
            </Button>
            <Button
              type="button"
              variant={deploymentType === 's3' ? 'default' : 'outline'}
              className={deploymentType === 's3' 
                ? 'bg-[#33FF00]/20 text-[#33FF00]' 
                : 'border-[#33FF00]/30 text-[#33FF00]/70'}
              onClick={() => setDeploymentType('s3')}
            >
              <Upload size={16} className="mr-2" />
              Deploy to S3
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="repository" className="block text-sm text-[#33FF00]/70 mb-1">
              Repository
            </label>
            <Select
              id="repository"
              value={selectedRepo}
              onValueChange={handleRepoChange}
              options={repositories.map(repo => ({
                value: `${repo.owner}/${repo.name}`,
                label: `${repo.owner}/${repo.name}`
              }))}
              placeholder="Select a repository"
              className="bg-[#111] border-[#33FF00]/30 text-[#33FF00]"
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="branch" className="block text-sm text-[#33FF00]/70 mb-1">
              Branch
            </label>
            <div className="relative">
              <Select
                id="branch"
                value={selectedBranch}
                onValueChange={setSelectedBranch}
                options={branches.map(branch => ({
                  value: branch.name,
                  label: branch.name
                }))}
                placeholder={loadingBranches ? "Loading branches..." : "Select a branch"}
                className="bg-[#111] border-[#33FF00]/30 text-[#33FF00]"
                disabled={!selectedRepo || loadingBranches}
              />
              {loadingBranches && (
                <RefreshCw size={16} className="absolute right-10 top-2.5 text-[#33FF00]/50 animate-spin" />
              )}
            </div>
          </div>
          
          {deploymentType === 'ec2' ? (
            <div className="md:col-span-2">
              <label htmlFor="instance" className="block text-sm text-[#33FF00]/70 mb-1">
                Target EC2 Instance
              </label>
              <Select
                id="instance"
                value={targetInstanceId}
                onValueChange={setTargetInstanceId}
                options={ec2Instances.map(instance => ({
                  value: instance.id,
                  label: `${instance.id} (${instance.type || 'Unknown'}) - ${instance.state}`
                }))}
                placeholder="Select an EC2 instance"
                className="bg-[#111] border-[#33FF00]/30 text-[#33FF00]"
                disabled={loading}
              />
            </div>
          ) : (
            <div className="md:col-span-2">
              <label htmlFor="bucket" className="block text-sm text-[#33FF00]/70 mb-1">
                Target S3 Bucket
              </label>
              <Input
                id="bucket"
                value={targetBucket}
                onChange={(e) => setTargetBucket(e.target.value)}
                placeholder="Enter S3 bucket name"
                className="bg-[#111] border-[#33FF00]/30 text-[#33FF00]"
              />
            </div>
          )}
        </div>
        
        <div className="pt-4 border-t border-[#33FF00]/30">
          <Button
            type="submit"
            variant="outline"
            className="border-[#33FF00]/50 text-[#33FF00] hover:bg-[#33FF00]/20"
            disabled={!selectedRepo || !selectedBranch || (deploymentType === 'ec2' && !targetInstanceId) || (deploymentType === 's3' && !targetBucket)}
          >
            <GitMerge size={16} className="mr-2" />
            Start Deployment
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DeploymentForm;
```

#### DeploymentHistory.tsx - History of deployments

```typescript
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, RefreshCw, Check, AlertTriangle, X } from 'lucide-react';

interface DeploymentHistoryProps {
  deployments: any[];
  onViewDetails: (deployment: any) => void;
}

const DeploymentHistory: React.FC<DeploymentHistoryProps> = ({ deployments, onViewDetails }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check size={16} className="text-green-500" />;
      case 'in_progress':
        return <RefreshCw size={16} className="text-[#33FF00] animate-spin" />;
      case 'failed':
        return <X size={16} className="text-red-500" />;
      default:
        return <AlertTriangle size={16} className="text-yellow-500" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="border border-[#33FF00]/30 rounded-sm p-4">
      <h3 className="text-md uppercase tracking-wider border-b border-[#33FF00]/30 pb-2 mb-4">
        Deployment History
      </h3>
      
      {deployments.length === 0 ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-[#33FF00]/70">No deployments found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          {deployments.map((deployment) => (
            <div
              key={deployment.id}
              className="border border-[#33FF00]/30 rounded-sm p-3 flex flex-col md:flex-row md:items-center md:justify-between hover:bg-[#33FF00]/10 transition-colors"
            >
              <div className="space-y-1 mb-2 md:mb-0">
                <div className="flex items-center">
                  {getStatusIcon(deployment.status)}
                  <span className="ml-2 font-bold">{deployment.repository}</span>
                </div>
                <div className="text-xs text-[#33FF00]/70">
                  Branch: {deployment.branch}
                </div>
                <div className="text-xs text-[#33FF00]/70">
                  Target: {deployment.target} ({deployment.targetId})
                </div>
                <div className="text-xs text-[#33FF00]/70">
                  Started: {formatDate(deployment.startTime)}
                </div>
                {deployment.endTime && (
                  <div className="text-xs text-[#33FF00]/70">
                    Completed: {formatDate(deployment.endTime)}
                  </div>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="border-[#33FF00]/50 text-[#33FF00]"
                onClick={() => onViewDetails(deployment)}
              >
                <Eye size={16} className="mr-2" />
                View Details
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeploymentHistory;
```

#### DeploymentStatus.tsx - Real-time deployment tracking

```typescript
import React, { useEffect, useState } from 'react';
import { getDeploymentStatus } from '@/services/deploymentService';
import { RefreshCw, Check, AlertTriangle, X, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeploymentStatusProps {
  deployment: any;
}

const DeploymentStatus: React.FC<DeploymentStatusProps> = ({ deployment }) => {
  const [liveDeployment, setLiveDeployment] = useState(deployment);
  const [logs, setLogs] = useState<string[]>([]);
  
  // Simulate polling for updated deployment status
  useEffect(() => {
    let interval: any = null;
    
    if (deployment.status === 'in_progress') {
      // Initial load
      fetchDeploymentStatus();
      
      // Set up polling
      interval = setInterval(fetchDeploymentStatus, 3000);
    } else {
      setLiveDeployment(deployment);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [deployment.id]);
  
  const fetchDeploymentStatus = async () => {
    try {
      // For demo, simulate a real API call
      // const response = await getDeploymentStatus(deployment.id);
      
      // Instead, simulate progressing steps
      const now = new Date().toISOString();
      const newLogs = [...logs];
      let updatedDeployment = { ...liveDeployment };
      
      const inProgressIndex = updatedDeployment.steps.findIndex((s: any) => s.status === 'in_progress');
      if (inProgressIndex >= 0) {
        // Complete current step
        updatedDeployment.steps[inProgressIndex].status = 'completed';
        updatedDeployment.steps[inProgressIndex].endTime = now;
        newLogs.push(`Step '${updatedDeployment.steps[inProgressIndex].name}' completed successfully.`);
        
        // Start next step if available
        if (inProgressIndex < updatedDeployment.steps.length - 1) {
          updatedDeployment.steps[inProgressIndex + 1].status = 'in_progress';
          updatedDeployment.steps[inProgressIndex + 1].timestamp = now;
          newLogs.push(`Starting step '${updatedDeployment.steps[inProgressIndex + 1].name}'...`);
        } else {
          // All steps completed
          updatedDeployment.status = 'completed';
          updatedDeployment.endTime = now;
          newLogs.push('Deployment completed successfully.');
        }
      }
      
      setLiveDeployment(updatedDeployment);
      setLogs(newLogs);
    } catch (error) {
      console.error('Failed to fetch deployment status:', error);
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check size={16} className="text-green-500" />;
      case 'in_progress':
        return <RefreshCw size={16} className="text-[#33FF00] animate-spin" />;
      case 'failed':
        return <X size={16} className="text-red-500" />;
      case 'pending':
        return <Clock size={16} className="text-[#33FF00]/50" />;
      default:
        return <AlertTriangle size={16} className="text-yellow-500" />;
    }
  };
  
  const formatTime = (timestamp: string) => {
    if (!timestamp) return '';
    
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="border border-[#33FF00]/30 rounded-sm p-4">
      <div className="flex justify-between items-center mb-4 border-b border-[#33FF00]/30 pb-2">
        <h3 className="text-md uppercase tracking-wider">
          Deployment Status
        </h3>
        <div className="flex items-center">
          {getStatusIcon(liveDeployment.status)}
          <span className="ml-2">
            {liveDeployment.status === 'in_progress' ? 'In Progress' : 
             liveDeployment.status === 'completed' ? 'Completed' : 
             liveDeployment.status === 'failed' ? 'Failed' : 
             'Pending'}
          </span>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="mb-1">
          <span className="text-[#33FF00]/70">Repository:</span> {liveDeployment.repository}
        </div>
        <div className="mb-1">
          <span className="text-[#33FF00]/70">Branch:</span> {liveDeployment.branch}
        </div>
        <div className="mb-1">
          <span className="text-[#33FF00]/70">Target:</span> {liveDeployment.target} ({liveDeployment.targetId})
        </div>
        <div className="mb-1">
          <span className="text-[#33FF00]/70">Started:</span> {formatTime(liveDeployment.startTime)}
        </div>
        {liveDeployment.endTime && (
          <div>
            <span className="text-[#33FF00]/70">Completed:</span> {formatTime(liveDeployment.endTime)}
          </div>
        )}
      </div>
      
      <div className="mb-4 border-t border-b border-[#33FF00]/30 py-4">
        <h4 className="text-sm uppercase tracking-wider mb-2">Deployment Steps</h4>
        <ul className="space-y-4">
          {liveDeployment.steps.map((step: any, index: number) => (
            <li key={step.name} className="flex items-start">
              <div className="mr-2 mt-1">{getStatusIcon(step.status)}</div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <div className="font-bold">{step.name}</div>
                  {step.timestamp && (
                    <div className="text-xs text-[#33FF00]/70">
                      {formatTime(step.timestamp)}
                    </div>
                  )}
                </div>
                {step.details && (
                  <div className="text-sm text-[#33FF00]/90 mt-1">{step.details}</div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="border border-[#33FF00]/30 rounded-sm p-2 h-40 overflow-y-auto bg-[#0A0A0A] font-mono text-xs">
        <h4 className="text-sm uppercase tracking-wider mb-2">Deployment Logs</h4>
        {logs.length === 0 ? (
          <div className="text-[#33FF00]/50">No logs available</div>
        ) : (
          <div className="space-y-1">
            {logs.map((log, index) => (
              <div key={index} className="flex">
                <span className="text-[#33FF00]/50 mr-2">{index+1}</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {liveDeployment.status === 'completed' && (
        <div className="mt-4 flex justify-end">
          <Button
            variant="outline"
            className="border-[#33FF00]/50 text-[#33FF00]"
            onClick={() => {
              const url = `https://${liveDeployment.targetId}`;
              window.open(liveDeployment.target === 'S3' ? url : `http://${liveDeployment.targetId}`, '_blank');
            }}
          >
            <ArrowRight size={16} className="mr-2" />
            View Deployed Site
          </Button>
        </div>
      )}
    </div>
  );
};

export default DeploymentStatus;
```

### 4. Deployment Service

Create a deployment service for handling deployments:

#### deploymentService.ts

```typescript
import { fetchWithAuth } from './api';

// Get list of deployments
export async function listDeployments() {
  return fetchWithAuth('/deployments');
}

// Get single deployment details
export async function getDeployment(id: string) {
  return fetchWithAuth(`/deployments/${id}`);
}

// Get deployment status updates
export async function getDeploymentStatus(id: string) {
  return fetchWithAuth(`/deployments/${id}/status`);
}

// Create new deployment
export async function createDeployment(deploymentData: any) {
  return fetchWithAuth('/deployments', {
    method: 'POST',
    body: JSON.stringify(deploymentData),
  });
}

// GitHub to EC2 deployment
export async function deployGithubToEC2(owner: string, repo: string, branch: string, instanceId: string) {
  return fetchWithAuth('/deployments/github-to-ec2', {
    method: 'POST',
    body: JSON.stringify({ owner, repo, branch, instanceId }),
  });
}

// GitHub to S3 deployment
export async function deployGithubToS3(owner: string, repo: string, branch: string, bucketName: string) {
  return fetchWithAuth('/deployments/github-to-s3', {
    method: 'POST',
    body: JSON.stringify({ owner, repo, branch, bucketName }),
  });
}
```

### 5. App Routing Updates

Update App.tsx to include all new routes:

```typescript
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import EC2Dashboard from "./pages/EC2Dashboard";
import GitHubDashboard from "./pages/GitHubDashboard";
import DeploymentDashboard from "./pages/DeploymentDashboard";
import { DevOpsProvider } from './context/DevOpsContext';
import NavigationWrapper from './components/NavigationWrapper';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DevOpsProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<NavigationWrapper><Index /></NavigationWrapper>} />
            <Route path="/ec2" element={<NavigationWrapper><EC2Dashboard /></NavigationWrapper>} />
            <Route path="/github" element={<NavigationWrapper><GitHubDashboard /></NavigationWrapper>} />
            <Route path="/deploy" element={<NavigationWrapper><DeploymentDashboard /></NavigationWrapper>} />
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

#### NavigationWrapper.tsx - Shared navigation component

```typescript
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Cloud, GitBranch, Upload } from 'lucide-react';

interface NavigationWrapperProps {
  children: React.ReactNode;
}

const NavigationWrapper: React.FC<NavigationWrapperProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-[100dvh] bg-black flex flex-col items-center justify-between p-2 md:p-4 lg:p-8 overflow-hidden">
      <div className="w-full max-w-3xl md:max-w-4xl flex flex-col h-[100dvh]">
        {/* Terminal header */}
        <div className="bg-[#111] border border-[#33FF00]/30 rounded-sm p-2 mb-2 md:mb-4 flex justify-between items-center">
          <div className="text-[#33FF00]/70 font-micro text-[10px] md:text-xs tracking-widest flex items-center">
            <span className="hidden sm:inline">AGENTIC DEVOPS TERMINAL</span>
            <span className="inline sm:hidden">DEVOPS</span>
          </div>
          <div className="text-[#33FF00] font-micro text-[10px] md:text-xs tracking-widest blink-text">
            {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
        </div>
        
        {/* Navigation tabs */}
        <div className="flex space-x-1 md:space-x-2 mb-2 md:mb-4">
          <Button
            variant="ghost"
            className={`${location.pathname === '/' ? 'bg-[#33FF00]/20 text-[#33FF00]' : 'text-[#33FF00]/50'} rounded-t-md rounded-b-none border-t border-l border-r border-[#33FF00]/30 px-2 md:px-4 py-1 text-xs md:text-sm`}
            onClick={() => navigate('/')}
          >
            <Home size={14} className="mr-1 md:mr-2" />
            <span className="hidden sm:inline">Dashboard</span>
            <span className="inline sm:hidden">Home</span>
          </Button>
          <Button
            variant="ghost"
            className={`${location.pathname === '/ec2' ? 'bg-[#33FF00]/20 text-[#33FF00]' : 'text-[#33FF00]/50'} rounded-t-md rounded-b-none border-t border-l border-r border-[#33FF00]/30 px-2 md:px-4 py-1 text-xs md:text-sm`}
            onClick={() => navigate('/ec2')}
          >
            <Cloud size={14} className="mr-1 md:mr-2" />
            <span>EC2</span>
          </Button>
          <Button
            variant="ghost"
            className={`${location.pathname === '/github' ? 'bg-[#33FF00]/20 text-[#33FF00]' : 'text-[#33FF00]/50'} rounded-t-md rounded-b-none border-t border-l border-r border-[#33FF00]/30 px-2 md:px-4 py-1 text-xs md:text-sm`}
            onClick={() => navigate('/github')}
          >
            <GitBranch size={14} className="mr-1 md:mr-2" />
            <span>GitHub</span>
          </Button>
          <Button
            variant="ghost"
            className={`${location.pathname === '/deploy' ? 'bg-[#33FF00]/20 text-[#33FF00]' : 'text-[#33FF00]/50'} rounded-t-md rounded-b-none border-t border-l border-r border-[#33FF00]/30 px-2 md:px-4 py-1 text-xs md:text-sm`}
            onClick={() => navigate('/deploy')}
          >
            <Upload size={14} className="mr-1 md:mr-2" />
            <span>Deploy</span>
          </Button>
        </div>
        
        {/* Main content area */}
        <div className="flex-1 overflow-hidden relative">
          {children}
        </div>
        
        {/* Terminal footer */}
        <div className="bg-[#111] border border-[#33FF00]/30 rounded-sm mt-2 md:mt-4 p-1 md:p-2 flex justify-between items-center">
          <div className="text-[#33FF00]/70 font-micro text-[8px] md:text-xs tracking-widest">
            MEM: 64K
          </div>
          <div className="text-[#33FF00]/70 font-micro text-[8px] md:text-xs tracking-widest">
            AGENTIC DEVOPS v1.0
          </div>
          <div className="text-[#33FF00]/70 font-micro text-[8px] md:text-xs tracking-widest">
            SYS: READY
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationWrapper;
```

## Testing Strategy

### Unit Tests

Test the core components:

```typescript
// GitHubDashboard tests
test('GitHubDashboard loads repositories on mount', async () => {
  // Mock GitHub service
  jest.mock('@/services/githubService', () => ({
    listRepositories: jest.fn().mockResolvedValue({
      repositories: [
        { owner: 'username', name: 'repo1', description: 'First repository' },
        { owner: 'username', name: 'repo2', description: 'Second repository' }
      ]
    })
  }));
  
  render(
    <DevOpsProvider>
      <GitHubDashboard />
    </DevOpsProvider>
  );
  
  // Check loading state
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  
  // Wait for repositories to load
  await waitFor(() => {
    expect(screen.getByText('repo1')).toBeInTheDocument();
    expect(screen.getByText('repo2')).toBeInTheDocument();
  });
});

// DeploymentForm tests
test('DeploymentForm validates required fields', async () => {
  const handleDeploy = jest.fn();
  
  render(
    <DeploymentForm
      repositories={[{ owner: 'username', name: 'repo1' }]}
      ec2Instances={[{ id: 'i-1234', state: 'running' }]}
      loading={false}
      onDeploy={handleDeploy}
    />
  );
  
  // Submit button should be disabled initially
  expect(screen.getByText('Start Deployment')).toBeDisabled();
  
  // Fill out form
  await userEvent.selectOptions(screen.getByLabelText('Repository'), ['username/repo1']);
  await userEvent.selectOptions(screen.getByLabelText('Branch'), ['main']);
  await userEvent.selectOptions(screen.getByLabelText('Target EC2 Instance'), ['i-1234']);
  
  // Submit button should be enabled
  expect(screen.getByText('Start Deployment')).not.toBeDisabled();
  
  // Submit form
  await userEvent.click(screen.getByText('Start Deployment'));
  
  // Check submission
  expect(handleDeploy).toHaveBeenCalledWith({
    owner: 'username',
    repo: 'repo1',
    branch: 'main',
    deploymentType: 'ec2',
    instanceId: 'i-1234'
  });
});
```

### Integration Tests

Test the end-to-end deployment workflow:

```typescript
test('End-to-end deployment workflow', async () => {
  render(
    <DevOpsProvider>
      <DeploymentDashboard />
    </DevOpsProvider>
  );
  
  // Fill out deployment form
  await userEvent.selectOptions(screen.getByLabelText('Repository'), ['username/repo1']);
  await userEvent.selectOptions(screen.getByLabelText('Branch'), ['main']);
  await userEvent.selectOptions(screen.getByLabelText('Target EC2 Instance'), ['i-1234']);
  
  // Start deployment
  await userEvent.click(screen.getByText('Start Deployment'));
  
  // Verify deployment is in progress
  expect(screen.getByText('Deployment Status')).toBeInTheDocument();
  expect(screen.getByText('In Progress')).toBeInTheDocument();
  
  // Verify deployment steps are shown
  expect(screen.getByText('Initialize')).toBeInTheDocument();
  expect(screen.getByText('Clone Repository')).toBeInTheDocument();
  
  // Wait for deployment to complete (simulated)
  await waitFor(() => {
    expect(screen.getByText('Completed')).toBeInTheDocument();
  }, { timeout: 10000 });
  
  // Verify view deployed site button appears
  expect(screen.getByText('View Deployed Site')).toBeInTheDocument();
});
```

## Next Steps

After completing Phase 3, we will proceed to Phase 4, which focuses on enhancing the application with error handling, user authentication and authorization, and advanced DevOps features like continuous integration and monitoring dashboards.