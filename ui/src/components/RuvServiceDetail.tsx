import React from 'react';
import { ScrollArea } from './ui/scroll-area';
import { X, ExternalLink } from 'lucide-react';

interface RuvServiceDetailProps {
  onClose: () => void;
}

const RuvServiceDetail: React.FC<RuvServiceDetailProps> = ({ onClose }) => {
  return (
    <div className="flex-1 mb-4 relative flex flex-col min-h-0 animate-float-in">
      <button 
        className="absolute right-0 top-0 text-[#33FF00]/70 hover:text-[#33FF00] z-10"
        onClick={onClose}
      >
        <X size={16} />
      </button>
      
      <div className="mb-3 pb-2 border-b border-[#33FF00]/30">
        <div className="text-[#FF33CC] font-micro uppercase text-sm md:text-base tracking-wide">
          AGENTIC DEVOPS • INFRASTRUCTURE AUTOMATION
        </div>
        <div className="text-[#33FF00]/50 font-micro text-xs uppercase mt-1">
          SERVICES OVERVIEW • LAST UPDATED: 03.21.2025
        </div>
      </div>
      
      <ScrollArea className="flex-1 pr-2 max-h-full touch-auto overflow-y-auto">
        <div className="font-micro text-[#33FF00]/90 text-xs md:text-sm space-y-4">
          <div className="p-2 border border-[#33FF00]/30 bg-[#111]/50">
            <h3 className="text-[#FF33CC] uppercase tracking-wide mb-1">:: AWS ARCHITECTURE REVIEW ::</h3>
            <p className="whitespace-pre-line">
              COMPREHENSIVE ANALYSIS OF YOUR AWS INFRASTRUCTURE WITH 
              OPTIMIZATION RECOMMENDATIONS. OUR EXPERT ARCHITECTS WILL
              EVALUATE YOUR CURRENT SETUP AND PROVIDE ACTIONABLE INSIGHTS
              FOR IMPROVED PERFORMANCE, SECURITY, AND COST EFFICIENCY.

              "TRANSFORM YOUR CLOUD INFRASTRUCTURE WITH DATA-DRIVEN DECISIONS."
            </p>
            
            <div className="mt-4 space-y-2">
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 border border-[#FF33CC]/50 hover:border-[#FF33CC] hover:bg-[#FF33CC]/10 transition-colors cursor-pointer"
              >
                <span>BASIC REVIEW • $499</span>
                <ExternalLink size={14} className="text-[#FF33CC]" />
              </a>
              
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 border border-[#FF33CC]/50 hover:border-[#FF33CC] hover:bg-[#FF33CC]/10 transition-colors cursor-pointer"
              >
                <span>COMPREHENSIVE REVIEW • $999</span>
                <ExternalLink size={14} className="text-[#FF33CC]" />
              </a>
              
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 border border-[#FF33CC]/50 hover:border-[#FF33CC] hover:bg-[#FF33CC]/10 transition-colors cursor-pointer"
              >
                <span>ENTERPRISE ASSESSMENT • $2,499</span>
                <ExternalLink size={14} className="text-[#FF33CC]" />
              </a>
            </div>
          </div>
          
          <div className="p-2 border border-[#33FF00]/30 bg-[#111]/50">
            <h3 className="text-[#FF33CC] uppercase tracking-wide mb-1">:: CI/CD PIPELINE OPTIMIZATION ::</h3>
            <p className="whitespace-pre-line">
              CUSTOM PACKAGES AVAILABLE

              STREAMLINE YOUR DEVELOPMENT WORKFLOW WITH AUTOMATED
              CONTINUOUS INTEGRATION AND DEPLOYMENT PIPELINES. OUR
              EXPERTS WILL CONFIGURE GITHUB ACTIONS, AWS CODEPIPELINE,
              OR YOUR PREFERRED CI/CD TOOLS FOR MAXIMUM EFFICIENCY.

              INCLUDES AUTOMATED TESTING, SECURITY SCANNING, AND
              DEPLOYMENT STRATEGIES TAILORED TO YOUR SPECIFIC NEEDS.
            </p>
            
            <div className="mt-4 space-y-2">
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 border border-[#FF33CC]/50 hover:border-[#FF33CC] hover:bg-[#FF33CC]/10 transition-colors cursor-pointer"
              >
                <span>GITHUB ACTIONS SETUP • $299</span>
                <ExternalLink size={14} className="text-[#FF33CC]" />
              </a>
              
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 border border-[#FF33CC]/50 hover:border-[#FF33CC] hover:bg-[#FF33CC]/10 transition-colors cursor-pointer"
              >
                <span>AWS CODEPIPELINE IMPLEMENTATION • $699</span>
                <ExternalLink size={14} className="text-[#FF33CC]" />
              </a>
            </div>
          </div>
          
          <div className="p-2 border border-[#33FF00]/30 bg-[#111]/50">
            <h3 className="text-[#FF33CC] uppercase tracking-wide mb-1">:: KUBERNETES MANAGEMENT ::</h3>
            <p className="whitespace-pre-line">
              EXPERT KUBERNETES CLUSTER SETUP, MANAGEMENT, AND OPTIMIZATION.
              FROM INITIAL DEPLOYMENT TO SCALING STRATEGIES, OUR TEAM WILL
              ENSURE YOUR CONTAINERIZED APPLICATIONS RUN EFFICIENTLY AND
              RELIABLY IN ANY ENVIRONMENT.

              SERVICES INCLUDE:
              * CLUSTER SETUP AND CONFIGURATION
              * DEPLOYMENT STRATEGIES
              * AUTO-SCALING IMPLEMENTATION
              * MONITORING AND LOGGING INTEGRATION
              * SECURITY HARDENING
            </p>
            
            <div className="mt-4 space-y-2">
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 border border-[#FF33CC]/50 hover:border-[#FF33CC] hover:bg-[#FF33CC]/10 transition-colors cursor-pointer"
              >
                <span>CLUSTER SETUP • $899</span>
                <ExternalLink size={14} className="text-[#FF33CC]" />
              </a>
              
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 border border-[#FF33CC]/50 hover:border-[#FF33CC] hover:bg-[#FF33CC]/10 transition-colors cursor-pointer"
              >
                <span>PRODUCTION READINESS ASSESSMENT • $599</span>
                <ExternalLink size={14} className="text-[#FF33CC]" />
              </a>
            </div>
          </div>
          
          <div className="p-2 border border-[#33FF00]/30 bg-[#111]/50">
            <h3 className="text-[#FF33CC] uppercase tracking-wide mb-1">:: CLIENT TESTIMONIALS ::</h3>
            <p className="whitespace-pre-line">
              "THE AGENTIC DEVOPS TEAM REDUCED OUR AWS COSTS BY 35% WHILE 
              IMPROVING PERFORMANCE. THEIR ARCHITECTURE RECOMMENDATIONS
              WERE GAME-CHANGING." 
              - QUANTUM TECHNOLOGIES

              "OUR DEPLOYMENT TIME WENT FROM HOURS TO MINUTES AFTER
              IMPLEMENTING THEIR CI/CD PIPELINE RECOMMENDATIONS." 
              - NEXUS INNOVATIONS

              "THE KUBERNETES IMPLEMENTATION WAS FLAWLESS. OUR APPLICATIONS
              NOW SCALE AUTOMATICALLY WITH ZERO DOWNTIME."
              - STELLAR SYSTEMS
            </p>
          </div>
          
          <div className="p-2 border border-[#33FF00]/30 bg-[#111]/50">
            <h3 className="text-[#FF33CC] uppercase tracking-wide mb-1">:: METHODOLOGY ::</h3>
            <p className="whitespace-pre-line">
              OUR APPROACH COMBINES INFRASTRUCTURE-AS-CODE PRINCIPLES
              WITH AUTOMATED TESTING AND CONTINUOUS MONITORING. THE
              AGENTIC DEVOPS FRAMEWORK ENSURES YOUR SYSTEMS ARE:

              KEY PRINCIPLES:
              * INFRASTRUCTURE AS CODE (TERRAFORM, CLOUDFORMATION)
              * AUTOMATED TESTING AND VALIDATION
              * SECURITY-FIRST DESIGN
              * OBSERVABILITY AND MONITORING
              * COST OPTIMIZATION
              * DISASTER RECOVERY PLANNING
            </p>
          </div>
          
          <div className="p-2 border border-[#33FF00]/30 bg-[#111]/50 flex flex-col items-center">
            <h3 className="text-[#FF33CC] uppercase tracking-wide mb-1">:: REQUEST CONSULTATION ::</h3>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block border border-[#FF33CC] p-3 text-[#FF33CC] text-center mb-2 animate-pulse-slow cursor-pointer hover:bg-[#FF33CC]/10 transition-colors"
            >
              SCHEDULE FREE ASSESSMENT
            </a>
            <p className="text-center">
              CUSTOM SOLUTIONS AVAILABLE • ENTERPRISE DISCOUNTS
              <br/>
              CONTACT: devops@agentic.example.com
            </p>
          </div>

          <div className="mt-6 text-center text-[#33FF00]/50 text-xs">
            © 2025 AGENTIC DEVOPS. ALL RIGHTS RESERVED.
            <br/>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-[#33FF00]/70 hover:text-[#33FF00] mt-2 transition-colors"
            >
              <span>DOCUMENTATION</span>
              <ExternalLink size={10} className="ml-1" />
            </a>
            <span className="mx-2">•</span>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-[#33FF00]/70 hover:text-[#33FF00] transition-colors"
            >
              <span>GITHUB</span>
              <ExternalLink size={10} className="ml-1" />
            </a>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default RuvServiceDetail;
