import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useDevOps } from '../contexts/DevOpsContext';
import { listInstances } from '../services/ec2Service';
import { listRepositories } from '../services/githubService';
import { parseCommand, getCommandHelp } from '../utils/commandParser';
import { ScrollArea } from './ui/scroll-area';

interface CommandPromptProps {
  isOpen: boolean;
  onClose: () => void;
}

// Expanded menu items to demonstrate scrolling
const MENU_ITEMS = [
  { id: 'AWS', description: 'Cloud Infrastructure' },
  { id: 'GITHUB', description: 'Source Control' },
  { id: 'DEPLOY', description: 'Deployment Tools' },
  { id: 'TERRAFORM', description: 'Infrastructure as Code' },
  { id: 'KUBERNETES', description: 'Container Orchestration' },
  { id: 'DOCKER', description: 'Containerization' },
  { id: 'JENKINS', description: 'CI/CD Pipeline' },
  { id: 'ANSIBLE', description: 'Configuration Management' },
  { id: 'PROMETHEUS', description: 'Monitoring' },
  { id: 'GRAFANA', description: 'Visualization' },
  { id: 'ELASTICSEARCH', description: 'Logging' },
  { id: 'VAULT', description: 'Secrets Management' },
  { id: 'EXIT', description: 'Disconnect' },
];

const COMMAND_CATEGORIES = [
  { id: 'SYSTEM', commands: ['HELP', 'CLEAR', 'VERSION', 'EXIT'] },
  { id: 'AWS', commands: ['EC2', 'S3', 'IAM'] },
  { id: 'GITHUB', commands: ['REPOS', 'BRANCHES'] },
  { id: 'DEPLOY', commands: ['GITHUB-TO-EC2', 'GITHUB-TO-S3'] }
];

const CommandPrompt: React.FC<CommandPromptProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState<string>('');
  const [history, setHistory] = useState<string[]>([
    'AGENTIC DEVOPS v0.1 (c) 2025',
    'INFRASTRUCTURE: READY',
    'Type HELP for available commands'
  ]);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setEc2Instances, setRepositories, setLoading, setError } = useDevOps();

  // Removed auto-focus effect to prevent keyboard from automatically appearing on mobile
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommand();
    }
  };

  const handleCommand = async () => {
    if (!input.trim()) return;
    
    setHistory(prev => [...prev, `C:\\> ${input}`]);
    
    const { command, subCommand, args } = parseCommand(input);
    
    // Process command
    try {
      switch (command) {
        case 'HELP':
          if (subCommand) {
            setHistory(prev => [...prev, ...getCommandHelp(subCommand)]);
          } else {
            setHistory(prev => [...prev, ...getCommandHelp('')]);
          }
          break;
        case 'MENU':
          setShowMenu(true);
          setHistory(prev => [...prev, 'Loading DevOps system menu...']);
          break;
        case 'CLEAR':
          setHistory(['Screen cleared', 'Type HELP for available commands']);
          break;
        case 'VERSION':
          showVersion();
          break;
        case 'EXIT':
          setHistory(prev => [...prev, 'Closing terminal...']);
          setTimeout(onClose, 1000);
          break;
        case 'EC2':
          await handleEC2Command(subCommand, args);
          break;
        case 'GITHUB':
          await handleGithubCommand(subCommand, args);
          break;
        case 'DEPLOY':
          await handleDeployCommand(subCommand, args);
          break;
        default:
          if (command.startsWith('MENU ') && command.length > 5) {
            const option = command.substring(5);
            handleMenuOption(option);
          } else {
            setHistory(prev => [...prev, `Unknown command: ${input}`]);
          }
      }
    } catch (error) {
      setHistory(prev => [...prev, `Error: ${error instanceof Error ? error.message : 'Unknown error'}`]);
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
    
    setInput('');
  };

  const showVersion = () => {
    setHistory(prev => [
      ...prev,
      'AGENTIC DEVOPS v0.1',
      'INFRASTRUCTURE: AWS, GITHUB, KUBERNETES',
      'DEPLOYMENT: AUTOMATED CI/CD',
      'MONITORING: ENABLED',
      'SECURITY: ACTIVE'
    ]);
  };

  const handleEC2Command = async (subCommand: string, args: string[]) => {
    switch (subCommand) {
      case 'LIST':
        setHistory(prev => [...prev, 'Fetching EC2 instances...']);
        setLoading(true);
        try {
          const result = await listInstances();
          setEc2Instances(result.instances);
          setHistory(prev => [
            ...prev,
            `Found ${result.instances.length} instances:`,
            ...result.instances.map(instance => `${instance.id} - ${instance.state}`)
          ]);
        } catch (error) {
          setHistory(prev => [...prev, `Error fetching instances: ${error instanceof Error ? error.message : 'Unknown error'}`]);
        } finally {
          setLoading(false);
        }
        break;
      case 'CREATE':
        if (args.length < 2) {
          setHistory(prev => [...prev, 'Usage: EC2 CREATE <instance-type> <zone>']);
          return;
        }
        setHistory(prev => [...prev, `Creating EC2 instance (${args[0]}) in ${args[1]}...`]);
        // Implementation would go here
        setHistory(prev => [...prev, 'Instance creation initiated. Use EC2 LIST to check status.']);
        break;
      default:
        setHistory(prev => [...prev, ...getCommandHelp('EC2')]);
    }
  };

  const handleGithubCommand = async (subCommand: string, args: string[]) => {
    switch (subCommand) {
      case 'REPOS':
        setHistory(prev => [...prev, 'Fetching GitHub repositories...']);
        setLoading(true);
        try {
          const result = await listRepositories();
          setRepositories(result.repos);
          setHistory(prev => [
            ...prev,
            `Found ${result.repos.length} repositories:`,
            ...result.repos.map(repo => `${repo.owner}/${repo.name}`)
          ]);
        } catch (error) {
          setHistory(prev => [...prev, `Error fetching repositories: ${error instanceof Error ? error.message : 'Unknown error'}`]);
        } finally {
          setLoading(false);
        }
        break;
      case 'BRANCHES':
        if (args.length < 2) {
          setHistory(prev => [...prev, 'Usage: GITHUB BRANCHES <owner> <repo>']);
          return;
        }
        setHistory(prev => [...prev, `Fetching branches for ${args[0]}/${args[1]}...`]);
        // Implementation would go here
        setHistory(prev => [...prev, 'Branch listing functionality will be implemented in Phase 2.']);
        break;
      default:
        setHistory(prev => [...prev, ...getCommandHelp('GITHUB')]);
    }
  };

  const handleDeployCommand = async (subCommand: string, args: string[]) => {
    switch (subCommand) {
      case 'GITHUB-TO-EC2':
        setHistory(prev => [...prev, 'GitHub to EC2 deployment functionality will be implemented in Phase 3.']);
        break;
      case 'GITHUB-TO-S3':
        setHistory(prev => [...prev, 'GitHub to S3 deployment functionality will be implemented in Phase 3.']);
        break;
      default:
        setHistory(prev => [...prev, ...getCommandHelp('DEPLOY')]);
    }
  };

  const handleMenuOption = (option: string) => {
    const menuItem = MENU_ITEMS.find(item => item.id === option);
    
    if (menuItem) {
      setHistory(prev => [...prev, `Loading ${menuItem.id}...`, `${menuItem.description} module activated`]);
      setShowMenu(false);
    } else {
      setHistory(prev => [...prev, `Invalid menu option: ${option}`]);
    }
  };

  const handleMenuSelect = (itemId: string) => {
    handleMenuOption(itemId);
  };

  if (!isOpen) return null;

  return (
    <div className="bg-black border-2 border-[#33FF00]/30 rounded-sm p-3 font-micro text-[#33FF00] w-full h-[300px] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#33FF00]/0 via-[#33FF00]/50 to-[#33FF00]/0"></div>
      
      {/* Header with title and close button */}
      <div className="flex justify-between items-center mb-2 border-b border-[#33FF00]/30 pb-1">
        <div className="text-xs uppercase tracking-widest">DevOps Terminal</div>
        <button 
          onClick={onClose} 
          className="text-[#33FF00] hover:text-[#33FF00]/70 transition-colors"
          aria-label="Close terminal"
        >
          <X size={16} />
        </button>
      </div>
      
      {/* Command history area */}
      <div className="h-[220px] overflow-y-auto mb-2 font-mono text-sm scrollbar-none">
        {history.map((line, index) => (
          <div key={index} className="mb-1 break-words">{line}</div>
        ))}
        
        {/* Show menu if active - Now with ScrollArea */}
        {showMenu && (
          <div className="mt-2 mb-2 border border-[#33FF00]/30 p-2">
            <div className="text-center mb-2 border-b border-[#33FF00]/30 pb-1">DEVOPS SYSTEM MENU</div>
            {/* Fixed height container with overflow auto */}
            <div className="h-[150px] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 gap-1">
                {MENU_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMenuSelect(item.id)}
                    className="text-left px-2 py-1 hover:bg-[#33FF00]/20 transition-colors text-sm flex justify-between"
                  >
                    <span>{item.id}</span>
                    <span className="text-[#33FF00]/70">{item.description}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Command input area with larger font size */}
      <div className="flex items-center border-t border-[#33FF00]/30 pt-1">
        <span className="text-[#33FF00] mr-2">C:\&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none outline-none text-[#33FF00] font-micro text-base md:text-lg w-full"
          placeholder="Type command..."
          spellCheck="false"
          autoComplete="off"
          autoFocus={false} // Prevent auto focus
        />
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-[#33FF00]/0 via-[#33FF00]/50 to-[#33FF00]/0"></div>
    </div>
  );
};

export default CommandPrompt;
