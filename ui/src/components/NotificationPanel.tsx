import React, { useState } from 'react';
import NotificationCard from './NotificationCard';
import { Mail, Calendar, Settings, User, X, Globe } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
import RuvServiceDetail from './RuvServiceDetail';

const NotificationPanel: React.FC = () => {
  const [selectedNotification, setSelectedNotification] = useState<{
    title: string;
    content: string;
    type: string;
  } | null>(null);
  
  const [showRuvServices, setShowRuvServices] = useState(false);

  const handleCardClick = (title: string, type: string) => {
    if (type === 'ruvservices') {
      setShowRuvServices(true);
      return;
    }
    
    // Generate content based on the notification type and title
    const content = getContentForNotification(title, type);
    setSelectedNotification({ title, content, type });
  };

  const getContentForNotification = (title: string, type: string): string => {
    switch (type) {
      case 'email':
        if (title.includes('AWS EC2 COST OPTIMIZATION')) {
          return "Hello DevOps Team,\n\nOur automated cost analysis has identified potential savings of 23% on your AWS EC2 instances. Several instances are running at less than 10% utilization and could be downsized or converted to spot instances.\n\nRecommended actions:\n- Downsize 5 m5.xlarge instances to m5.large\n- Convert 3 development instances to spot instances\n- Schedule automatic shutdown for non-production instances outside business hours\n\nEstimated monthly savings: $1,245.00\n\nPlease review the attached detailed report and let me know if you'd like to proceed with these optimizations.\n\nBest regards,\nAgentic DevOps Cost Optimization Service";
        } else if (title.includes('GITHUB SECURITY ALERT')) {
          return "SECURITY ALERT: Critical vulnerability detected in your GitHub repository 'agentic-devops'.\n\nVulnerability details:\n- CVE-2023-45127: Remote code execution vulnerability in dependency 'log4j-core'\n- Severity: Critical (CVSS 9.8)\n- Affected version: 2.14.1\n- Recommended version: 2.17.1 or later\n\nThis vulnerability could allow attackers to execute arbitrary code on your systems. Please update this dependency immediately.\n\nAgentic DevOps Security Monitoring Service";
        } else if (title.includes('DEPLOYMENT PIPELINE')) {
          return "The Agentic DevOps deployment pipeline has been successfully configured for your project. Your code will now automatically flow through the following stages:\n\n1. Code Commit → GitHub Repository\n2. Build → AWS CodeBuild\n3. Test → Automated Test Suite\n4. Deploy → AWS EC2 Instances\n5. Monitor → CloudWatch Metrics\n\nAll stages include automated notifications and approval gates where specified. The first deployment is scheduled for tomorrow at 10:00 UTC.\n\nAgentic DevOps CI/CD Service";
        } else if (title.includes('INFRASTRUCTURE AUDIT')) {
          return "Infrastructure Audit Complete\n\nOur automated audit of your cloud infrastructure has been completed. Key findings:\n\n✅ 87% of resources properly tagged\n❌ 12 security groups with overly permissive rules\n⚠️ 3 S3 buckets without encryption\n✅ All RDS instances have backups enabled\n❌ 4 IAM users with unused access keys (>90 days)\n\nA detailed report with remediation steps has been attached. Would you like us to schedule automatic remediation of these issues?\n\nAgentic DevOps Compliance Team";
        } else if (title.includes('DISASTER RECOVERY')) {
          return "Disaster Recovery Plan Update\n\nYour disaster recovery plan has been updated and tested successfully. Current recovery metrics:\n\n- Recovery Time Objective (RTO): 45 minutes\n- Recovery Point Objective (RPO): 15 minutes\n- Estimated recovery cost: $850 per incident\n\nThe automated recovery procedure successfully restored all critical services during our simulated outage test. Backup verification is now performed daily with results logged to your secure dashboard.\n\nAgentic DevOps Resilience Team";
        }
        return "No additional information available for this email.";
      
      case 'calendar':
        if (title.includes('AWS ARCHITECTURE REVIEW')) {
          return "AWS Architecture Review Meeting\n\nAgenda:\n- Review current AWS infrastructure architecture\n- Identify optimization opportunities\n- Discuss high availability improvements\n- Plan migration to container-based services\n- Security posture assessment\n\nPlease prepare your current architecture diagrams and performance metrics. The Agentic DevOps architect will provide recommendations based on AWS best practices and your specific workload patterns.";
        } else if (title.includes('GITHUB WORKFLOW')) {
          return "GitHub Workflow Optimization Workshop\n\nIn this hands-on session, we'll optimize your GitHub Actions workflows to improve CI/CD performance. Topics include:\n\n- Parallel job execution strategies\n- Efficient matrix builds\n- Caching dependencies\n- Self-hosted runners vs. GitHub-hosted runners\n- Workflow security best practices\n\nPlease have administrator access to your GitHub repositories during this session.";
        } else if (title.includes('KUBERNETES CLUSTER')) {
          return "Kubernetes Cluster Upgrade Planning\n\nThis meeting will focus on planning the upgrade of your Kubernetes clusters from version 1.24 to 1.27. We'll cover:\n\n- Pre-upgrade assessment\n- Compatibility testing strategy\n- Upgrade sequence and timeline\n- Rollback procedures\n- Post-upgrade validation\n\nThe Agentic DevOps Kubernetes specialist will guide you through the process to ensure minimal disruption to your services.";
        } else if (title.includes('TERRAFORM MODULE')) {
          return "Terraform Module Development Session\n\nThis collaborative session will focus on creating reusable Terraform modules for your infrastructure. Agenda:\n\n- Module structure best practices\n- Input/output variable design\n- Version control and tagging strategy\n- Testing framework setup\n- Documentation standards\n\nPlease have your current Terraform configurations available for reference.";
        } else if (title.includes('SECURITY COMPLIANCE')) {
          return "Security Compliance Review\n\nQuarterly review of security compliance across your DevOps pipeline. We'll assess:\n\n- Secrets management practices\n- Infrastructure-as-Code security scanning\n- Container image vulnerability management\n- Compliance with regulatory requirements (SOC2, HIPAA, etc.)\n- Incident response procedures\n\nThe Agentic DevOps Security team will provide a compliance scorecard and remediation recommendations.";
        }
        return "No additional information available for this calendar event.";
      
      case 'system':
        if (title.includes('EC2 AUTO-SCALING')) {
          return "EC2 Auto-Scaling Event Detected\n\nTimestamp: 2025-03-21T16:42:18Z\nRegion: us-east-1\nAuto-Scaling Group: agentic-devops-production\nEvent: Scale-out\nDetails: Increased capacity from 5 to 8 instances\nTrigger: CPU utilization exceeded 75% threshold for 5 minutes\n\nNew instances:\n- i-0abc12345def67890 (us-east-1a)\n- i-0bcd23456efg78901 (us-east-1b)\n- i-0cde34567fgh89012 (us-east-1c)\n\nAll instances passed health checks and are now serving traffic.";
        } else if (title.includes('GITHUB ACTIONS')) {
          return "GitHub Actions Workflow Completed\n\nRepository: agentic-devops/infrastructure\nWorkflow: Deploy to Production\nCommit: 7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r\nAuthor: DevOps Engineer\nStatus: ✅ Success\nDuration: 4m 32s\n\nStages:\n- Lint: Passed (0 errors, 2 warnings)\n- Test: Passed (142 tests, 100% coverage)\n- Build: Passed (artifacts: deployment-package.zip)\n- Deploy: Passed (target: production)\n\nDeployment URL: https://agentic-devops-prod.example.com";
        } else if (title.includes('S3 BUCKET')) {
          return "S3 Bucket Policy Change Detected\n\nBucket: agentic-devops-artifacts\nChange Type: Policy Modification\nUser: arn:aws:iam::123456789012:user/admin\nTimestamp: 2025-03-21T15:37:42Z\n\nChanges:\n- Added public access block\n- Removed cross-account access for account 987654321098\n- Added encryption requirement for all objects\n\nThis change has been logged and added to the compliance audit trail. If this change was not authorized, please contact the security team immediately.";
        } else if (title.includes('CLOUDWATCH ALARM')) {
          return "CloudWatch Alarm: High Error Rate\n\nAlarm Name: API-Gateway-5XX-Errors\nState: ALARM\nReason: Threshold Exceeded\nMetric: 5XXError\nNamespace: AWS/ApiGateway\nDimensions: ApiName=agentic-devops-api\nPeriod: 60 seconds\nThreshold: > 5 errors per minute\nCurrent Value: 12 errors per minute\n\nThe Agentic DevOps incident response system has automatically created a ticket and notified the on-call engineer. Initial diagnostics suggest a database connection issue.";
        } else if (title.includes('TERRAFORM PLAN')) {
          return "Terraform Plan Summary\n\nDirectory: /infrastructure/production\nCommand: terraform plan\nTimestamp: 2025-03-21T14:22:15Z\n\nChanges:\n+ Create: 3 resources\n~ Modify: 5 resources\n- Destroy: 1 resource\n\nSignificant changes:\n+ aws_lambda_function.data_processor (new function)\n~ aws_ecs_service.api (update instance count from 2 to 3)\n~ aws_security_group.database (add new ingress rule)\n- aws_s3_bucket.temp_storage (will be destroyed)\n\nEstimated additional monthly cost: $45.20\nApproval required before applying these changes.";
        }
        return "No additional information available for this system notification.";
      
      case 'ruvservices':
        return "AGENTIC DEVOPS SERVICES OVERVIEW:\n\n* AWS ARCHITECTURE REVIEW - $499\n* GITHUB WORKFLOW OPTIMIZATION - $299\n* KUBERNETES CLUSTER MANAGEMENT - $699\n* TERRAFORM MODULE DEVELOPMENT - $399\n* SECURITY COMPLIANCE ASSESSMENT - $599\n\nContact: devops@agentic.example.com";
      
      default:
        return "No additional information available.";
    }
  };

  const handleCloseRuvServices = () => {
    setShowRuvServices(false);
  };

  const returnToMainView = () => {
    setSelectedNotification(null);
    setShowRuvServices(false);
  };

  return (
    <div className="bg-[#111]/80 border border-[#33FF00]/20 p-4 pt-2 w-full h-full mx-auto flex flex-col fade-in-delay-1 relative overflow-hidden">
      {/* Console Header Bar - Now Clickable */}
      <div 
        className="flex items-center justify-between mb-4 border-b border-[#33FF00]/30 pb-2 cursor-pointer hover:border-[#33FF00]/60 transition-colors"
        onClick={returnToMainView}
      >
        <div className="flex items-center">
          <div className="h-2 w-2 bg-[#33FF00] mr-2 animate-pulse-slow"></div>
          <h2 className="text-[#33FF00]/70 font-micro uppercase tracking-widest text-sm md:text-lg">
            MESSAGES
          </h2>
        </div>
        <div className="flex space-x-2">
          <div className="h-2 w-2 rounded-full bg-[#33FF00] animate-ping-slow"></div>
          <div className="h-2 w-2 rounded-full bg-red-500"></div>
          <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
        </div>
      </div>
      
      {showRuvServices ? (
        <RuvServiceDetail onClose={handleCloseRuvServices} />
      ) : selectedNotification ? (
        <div className="flex-1 mb-4 relative flex flex-col min-h-0">
          <button 
            className="absolute right-0 top-0 text-[#33FF00]/70 hover:text-[#33FF00] z-10"
            onClick={() => setSelectedNotification(null)}
          >
            <X size={16} />
          </button>
          
          <div className="mb-3 pb-2 border-b border-[#33FF00]/30">
            <div className="text-[#33FF00] font-micro uppercase text-sm md:text-base tracking-wide">
              {selectedNotification.title}
            </div>
            <div className="text-[#33FF00]/50 font-micro text-xs uppercase mt-1">
              {selectedNotification.type.toUpperCase()} • RECEIVED TODAY
            </div>
          </div>
          
          <ScrollArea className="flex-1 pr-2 max-h-full touch-auto overflow-y-auto">
            <div className="font-micro text-[#33FF00]/90 text-sm md:text-base whitespace-pre-line">
              {selectedNotification.content}
            </div>
          </ScrollArea>
        </div>
      ) : (
        <ScrollArea className="pr-4 flex-1 min-h-0 touch-auto overflow-y-auto">
          {/* Agentic DevOps Section */}
          <div className="mb-4 md:mb-6">
            <div className="flex items-center mb-2 md:mb-3">
              <User className="h-3 w-3 text-[#33FF00]/70 mr-2" />
              <h3 className="text-[#33FF00]/70 font-micro uppercase tracking-wider text-xs md:text-sm">
                AGENTIC DEVOPS
              </h3>
            </div>
            
            <NotificationCard 
              type="ruvservices"
              title="DEVOPS AUTOMATION SERVICES"
              subtitle="INFRASTRUCTURE AS CODE SPECIALISTS"
              className="fade-in-delay-1 border-l-[#FF33CC] animate-pulse-slow"
              onClick={() => handleCardClick("DEVOPS AUTOMATION SERVICES", "ruvservices")}
            />
            
            <NotificationCard 
              type="calendar"
              title="AWS ARCHITECTURE REVIEW"
              subtitle="TOMORROW • 14:30 HRS"
              className="fade-in-delay-1 border-l-[#FF33CC]"
              onClick={() => handleCardClick("AWS ARCHITECTURE REVIEW", "calendar")}
            />
            
            <NotificationCard
              type="email"
              title="DEPLOYMENT PIPELINE CONFIGURED"
              subtitle="CI/CD AUTOMATION COMPLETE"
              className="fade-in-delay-1 border-l-[#FF33CC]"
              onClick={() => handleCardClick("DEPLOYMENT PIPELINE CONFIGURED", "email")}
            />
            
            <NotificationCard
              type="system"
              title="GITHUB ACTIONS WORKFLOW COMPLETED"
              subtitle="DEPLOY TO PRODUCTION: SUCCESS"
              className="fade-in-delay-1 border-l-[#FF33CC] animate-pulse-slow"
              onClick={() => handleCardClick("GITHUB ACTIONS WORKFLOW COMPLETED", "system")}
            />
          </div>
          
          {/* Email Section */}
          <div className="mb-4 md:mb-6">
            <div className="flex items-center mb-2 md:mb-3">
              <Mail className="h-3 w-3 text-[#33FF00]/70 mr-2" />
              <h3 className="text-[#33FF00]/70 font-micro uppercase tracking-wider text-xs md:text-sm">
                EMAIL
              </h3>
            </div>
            <NotificationCard 
              type="email"
              title="AWS EC2 COST OPTIMIZATION REPORT"
              subtitle="POTENTIAL SAVINGS: 23%"
              className="fade-in-delay-1 border-l-[#FF33CC]"
              onClick={() => handleCardClick("AWS EC2 COST OPTIMIZATION REPORT", "email")}
            />
            <NotificationCard 
              type="email"
              title="GITHUB SECURITY ALERT: CRITICAL"
              subtitle="ACTION REQUIRED"
              className="fade-in-delay-1 border-l-[#FF33CC]"
              onClick={() => handleCardClick("GITHUB SECURITY ALERT: CRITICAL", "email")}
            />
            <NotificationCard 
              type="email"
              title="INFRASTRUCTURE AUDIT RESULTS"
              subtitle="87% COMPLIANCE SCORE"
              className="fade-in-delay-1"
              onClick={() => handleCardClick("INFRASTRUCTURE AUDIT RESULTS", "email")}
            />
            <NotificationCard 
              type="email"
              title="DISASTER RECOVERY PLAN UPDATED"
              subtitle="RTO: 45 MINUTES"
              className="fade-in-delay-1"
              onClick={() => handleCardClick("DISASTER RECOVERY PLAN UPDATED", "email")}
            />
          </div>
          
          {/* Calendar Section */}
          <div className="mb-4 md:mb-6">
            <div className="flex items-center mb-2 md:mb-3">
              <Calendar className="h-3 w-3 text-[#33FF00]/70 mr-2" />
              <h3 className="text-[#33FF00]/70 font-micro uppercase tracking-wider text-xs md:text-sm">
                CALENDAR
              </h3>
            </div>
            <NotificationCard 
              type="calendar"
              title="GITHUB WORKFLOW OPTIMIZATION"
              subtitle="VIRTUAL • 15:00 HRS"
              className="fade-in-delay-2 border-l-[#FF33CC]"
              onClick={() => handleCardClick("GITHUB WORKFLOW OPTIMIZATION", "calendar")}
            />
            <NotificationCard 
              type="calendar"
              title="KUBERNETES CLUSTER UPGRADE"
              subtitle="PLANNING MEETING • 09:00 HRS"
              className="fade-in-delay-2 border-l-[#FF33CC]"
              onClick={() => handleCardClick("KUBERNETES CLUSTER UPGRADE", "calendar")}
            />
            <NotificationCard 
              type="calendar"
              title="TERRAFORM MODULE DEVELOPMENT"
              subtitle="PAIR PROGRAMMING • 11:00 HRS"
              className="fade-in-delay-2"
              onClick={() => handleCardClick("TERRAFORM MODULE DEVELOPMENT", "calendar")}
            />
            <NotificationCard 
              type="calendar"
              title="SECURITY COMPLIANCE REVIEW"
              subtitle="QUARTERLY MEETING • 14:00 HRS"
              className="fade-in-delay-2"
              onClick={() => handleCardClick("SECURITY COMPLIANCE REVIEW", "calendar")}
            />
          </div>
          
          {/* System Section */}
          <div className="mb-4 md:mb-6">
            <div className="flex items-center mb-2 md:mb-3">
              <Settings className="h-3 w-3 text-[#33FF00]/70 mr-2" />
              <h3 className="text-[#33FF00]/70 font-micro uppercase tracking-wider text-xs md:text-sm">
                SYSTEM
              </h3>
            </div>
            <NotificationCard 
              type="system"
              title="EC2 AUTO-SCALING EVENT"
              subtitle="SCALED OUT: 5 → 8 INSTANCES"
              className="fade-in-delay-3 border-l-[#FF33CC]"
              onClick={() => handleCardClick("EC2 AUTO-SCALING EVENT", "system")}
            />
            <NotificationCard 
              type="system"
              title="S3 BUCKET POLICY CHANGED"
              subtitle="SECURITY ENHANCEMENT"
              className="fade-in-delay-3 border-l-[#FF33CC]"
              onClick={() => handleCardClick("S3 BUCKET POLICY CHANGED", "system")}
            />
            <NotificationCard 
              type="system"
              title="CLOUDWATCH ALARM: HIGH ERROR RATE"
              subtitle="API GATEWAY: 5XX ERRORS"
              className="fade-in-delay-3"
              onClick={() => handleCardClick("CLOUDWATCH ALARM: HIGH ERROR RATE", "system")}
            />
            <NotificationCard 
              type="system"
              title="TERRAFORM PLAN READY FOR REVIEW"
              subtitle="9 RESOURCE CHANGES"
              className="fade-in-delay-3"
              onClick={() => handleCardClick("TERRAFORM PLAN READY FOR REVIEW", "system")}
            />
          </div>
        </ScrollArea>
      )}
      
      {/* Console Footer */}
      <div className="mt-4 border-t border-[#33FF00]/30 pt-2 text-[10px] font-micro text-[#33FF00]/70 flex justify-between">
        <span>{showRuvServices ? "DEVOPS SERVICES" : selectedNotification ? "VIEWING" : "READY"}</span>
        <span className="blink-text">{">"}</span>
        <span>v1.0.3</span>
      </div>
      
      {/* Screen Overlay Effects */}
      <div className="screen-glitch absolute inset-0 pointer-events-none"></div>
      <div className="screen-vignette absolute inset-0 pointer-events-none"></div>
    </div>
  );
};

export default NotificationPanel;
