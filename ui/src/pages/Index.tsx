import React, { useState, useEffect } from 'react';
import NotificationPanel from '@/components/NotificationPanel';
import { Terminal } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import NavigationMenu from '@/components/NavigationMenu';
import LoadingScreen from '@/components/LoadingScreen';
import CommandPrompt from '@/components/CommandPrompt';
import EC2ManagementPanel from '@/components/aws/EC2ManagementPanel';

const Index = () => {
  const isMobile = useIsMobile();
  const [showLoading, setShowLoading] = useState(true);
  const [showCommandPrompt, setShowCommandPrompt] = useState(false);
  const [activePanel, setActivePanel] = useState<'notifications' | 'ec2' | 'github'>('notifications');
  
  // Auto-hide loading screen after it completes with a reduced delay
  const handleLoadingComplete = () => {
    setTimeout(() => {
      setShowLoading(false);
    }, 200); // Reduced from 500ms to 200ms
  };
  
  const renderActivePanel = () => {
    if (showCommandPrompt) {
      return (
        <CommandPrompt 
          isOpen={showCommandPrompt} 
          onClose={() => setShowCommandPrompt(false)} 
        />
      );
    }
    
    switch (activePanel) {
      case 'ec2':
        return <EC2ManagementPanel onClose={() => setActivePanel('notifications')} />;
      case 'github':
        // Will be implemented in Phase 3
        return <NotificationPanel />;
      case 'notifications':
      default:
        return <NotificationPanel />;
    }
  };
  
  return (
    <div className="min-h-[100dvh] bg-black flex flex-col items-center justify-between p-2 md:p-4 lg:p-8 overflow-hidden">
      <div className="w-full max-w-3xl md:max-w-4xl flex flex-col h-[100dvh]">
        {/* Terminal header */}
        <div className="bg-[#111] border border-[#33FF00]/30 rounded-sm p-2 mb-2 md:mb-4 flex justify-between items-center">
          <div className="text-[#33FF00]/70 font-micro text-[10px] md:text-xs tracking-widest flex items-center">
            <Terminal className="h-3 w-3 mr-1 md:mr-2 text-[#33FF00]" />
            <span className="hidden sm:inline">AGENTIC DEVOPS v0.1</span>
            <span className="inline sm:hidden">DEVOPS v0.1</span>
          </div>
          <div className="text-[#33FF00] font-micro text-[10px] md:text-xs tracking-widest blink-text">
            {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
        </div>
        
        {/* Main content area - flex-1 to take available space */}
        <div className="flex-1 grid grid-cols-1 gap-2 md:gap-4 relative overflow-hidden">
          {/* Main terminal display with proper overflow handling */}
          <div className="bg-[#111] border-2 border-[#33FF00]/30 rounded-sm p-2 md:p-4 dot-matrix-container relative overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#33FF00]/0 via-[#33FF00]/50 to-[#33FF00]/0"></div>
            <div className="text-[#33FF00] font-micro uppercase tracking-widest text-center mb-2 md:mb-4 text-xs md:text-base">
              *** AGENTIC DEVOPS TERMINAL ***
            </div>
            
            <div className="flex-1 flex flex-col min-h-0">
              {renderActivePanel()}
            </div>
            
            <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-[#33FF00]/0 via-[#33FF00]/50 to-[#33FF00]/0"></div>
          </div>
        </div>
        
        {/* Navigation menu - sticky at bottom */}
        <div className="mt-2 md:mt-4 sticky bottom-0 z-10">
          <NavigationMenu 
            onSelectPanel={(panel) => {
              setActivePanel(panel as 'notifications' | 'ec2' | 'github');
              setShowCommandPrompt(false);
            }}
            activePanel={activePanel}
          />
        </div>
        
        {/* Terminal footer with command prompt toggle */}
        <div className="bg-[#111] border border-[#33FF00]/30 rounded-sm mt-2 md:mt-4 p-1 md:p-2 flex justify-between items-center">
          <div className="text-[#33FF00]/70 font-micro text-[8px] md:text-xs tracking-widest mb-1">
            INFRA: READY
          </div>
          <button
            onClick={() => {
              setShowCommandPrompt(!showCommandPrompt);
              if (showCommandPrompt) {
                setActivePanel('notifications');
              }
            }}
            className="text-[#33FF00]/70 font-micro text-[8px] md:text-xs tracking-widest hover:text-[#33FF00] transition-colors mb-1"
          >
            {showCommandPrompt ? "CLOSE CMD" : "OPEN CMD"}
          </button>
          <div className="text-[#33FF00]/70 font-micro text-[8px] md:text-xs tracking-widest mb-1">
            DEVOPS: ACTIVE
          </div>
        </div>
      </div>
      
      {/* Loading Screen */}
      <LoadingScreen open={showLoading} onComplete={handleLoadingComplete} />
    </div>
  );
};

export default Index;
