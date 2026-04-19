import React, { useEffect, useState, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

interface LoadingMessage {
  message: string;
  delay: number;
}

// Updated loading messages to focus on Agentic DevOps
const loadingMessages: LoadingMessage[] = [
  { message: "AGENTIC DEVOPS SYSTEM BOOT SEQUENCE INITIALIZING...", delay: 300 },
  { message: "LOADING DEVOPS KERNEL MODULES...", delay: 400 },
  { message: "INITIALIZING AWS INTEGRATION SERVICES...", delay: 500 },
  { message: "CALIBRATING GITHUB CONNECTION MATRIX...", delay: 600 },
  { message: "ESTABLISHING CLOUD INFRASTRUCTURE UPLINK...", delay: 700 },
  { message: "LOADING DEPLOYMENT PROTOCOLS...", delay: 800 },
  { message: "MOUNTING INFRASTRUCTURE-AS-CODE SECTORS...", delay: 900 },
  { message: "INITIALIZING CI/CD PIPELINE PROTOCOLS...", delay: 1000 },
  { message: "RUNNING SECURITY COMPLIANCE VERIFICATION...", delay: 1100 },
  { message: "OPTIMIZING DEVOPS AUTOMATION ALGORITHMS...", delay: 1200 },
  { message: "AGENTIC DEVOPS SYSTEM READY...", delay: 1300 }
];

interface LoadingScreenProps {
  open: boolean;
  onComplete?: () => void;
}

const LoadingScreen = ({ open, onComplete }: LoadingScreenProps) => {
  const [visibleMessages, setVisibleMessages] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the bottom when new messages appear
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    if (visibleMessages.length > 0) {
      scrollToBottom();
    }
  }, [visibleMessages]);

  useEffect(() => {
    if (!open) {
      setVisibleMessages([]);
      setProgress(0);
      setLoadingComplete(false);
      return;
    }
    
    // Reset states when opened
    setVisibleMessages([]);
    setProgress(0);
    setLoadingComplete(false);
    
    let currentMessageIndex = 0;
    const timeoutIds: NodeJS.Timeout[] = [];
    
    // Function to add messages one by one
    const addNextMessage = () => {
      if (currentMessageIndex < loadingMessages.length) {
        const currentMsg = loadingMessages[currentMessageIndex];
        
        const timeoutId = setTimeout(() => {
          // Only add the message if it's not already in the list
          setVisibleMessages(prev => {
            if (prev.includes(currentMsg.message)) {
              return prev;
            }
            return [...prev, currentMsg.message];
          });
          
          // Update progress based on how many messages have been shown
          const newProgress = Math.floor(((currentMessageIndex + 1) / loadingMessages.length) * 100);
          setProgress(newProgress);
          
          currentMessageIndex++;
          
          // If we've shown the last message, mark as complete after a short delay
          if (currentMessageIndex === loadingMessages.length) {
            // Reduced completion delay from 1000ms to 500ms
            const completionTimeoutId = setTimeout(() => {
              setLoadingComplete(true);
              if (onComplete) {
                // Reduced final timeout from 800ms to 300ms
                const finalTimeoutId = setTimeout(onComplete, 300);
                timeoutIds.push(finalTimeoutId);
              }
            }, 500);
            timeoutIds.push(completionTimeoutId);
          } else {
            addNextMessage();
          }
        }, currentMsg.delay);
        
        timeoutIds.push(timeoutId);
      }
    };
    
    // Start the sequence
    addNextMessage();
    
    // Cleanup function to clear all timeouts on unmount or when dialog closes
    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, [open, onComplete]);

  // Smaller ASCII art logo for Agentic DevOps
  const devOpsLogo = (
    <div className="text-center my-2 font-micro text-[#33FF00] text-xs leading-tight">
      <pre className="inline-block text-[8px] md:text-[10px]">
{`
 █████╗   ██████╗ ███████╗███╗  ██╗████████╗██╗ ██████╗
██╔══██╗ ██╔════╝ ██╔════╝████╗ ██║╚══██╔══╝██║██╔════╝
███████║ ██║  ███╗█████╗  ██╔██╗██║   ██║   ██║██║     
██╔══██║ ██║   ██║██╔══╝  ██║╚████║   ██║   ██║██║     
██║  ██║ ╚██████╔╝███████╗██║ ╚███║   ██║   ██║╚██████╗
╚═╝  ╚═╝  ╚═════╝ ╚══════╝╚═╝  ╚══╝   ╚═╝   ╚═╝ ╚═════╝
██████╗  ███████╗██╗   ██╗ ██████╗ ██████╗  ███████╗   
██╔══██╗ ██╔════╝██║   ██║██╔═══██╗██╔══██╗ ██╔════╝   
██║  ██║ █████╗  ██║   ██║██║   ██║██████╔╝ ███████╗   
██║  ██║ ██╔══╝  ╚██╗ ██╔╝██║   ██║██╔═══╝  ╚════██║   
██████╔╝ ███████╗ ╚████╔╝ ╚██████╔╝██║      ███████║   
╚═════╝  ╚══════╝  ╚═══╝   ╚═════╝ ╚═╝      ╚══════╝   
`}
      </pre>
      <div className="text-[8px] md:text-[10px] mt-1">INFRASTRUCTURE AUTOMATION SINCE 2025</div>
    </div>
  );

  return (
    <Dialog open={open} modal>
      <DialogContent className="bg-cyber-black border-[#33FF00]/30 p-4 max-w-md mx-auto font-micro text-[#33FF00] dot-matrix-container" aria-describedby="loading-description">
        <DialogTitle className="sr-only">Agentic DevOps Loading Screen</DialogTitle>
        <div id="loading-description" className="flex flex-col space-y-2">
          <div className="text-center text-lg tracking-widest border-b border-[#33FF00]/30 pb-2 mb-1">
            AGENTIC DEVOPS v1.0
          </div>
          
          {/* ASCII art logo for Agentic DevOps */}
          {devOpsLogo}
          
          <div className="h-40 md:h-48 overflow-y-auto mb-2 text-xs pr-1">
            {visibleMessages.map((message, index) => (
              <div key={index} className="mb-1 fade-in">
                {"> "}{message}
              </div>
            ))}
            {!loadingComplete && <span className="blink-text">_</span>}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>LOADING DEVOPS SYSTEM</span>
              <span>{progress}%</span>
            </div>
            <Progress 
              value={progress} 
              className="h-2 bg-[#111] border border-[#33FF00]/30"
              indicatorClassName="bg-[#33FF00]" 
            />
          </div>
          
          {loadingComplete && (
            <div className="text-center text-sm mt-1 animate-pulse-slow">
              AGENTIC DEVOPS READY - PRESS ANY KEY
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoadingScreen;
