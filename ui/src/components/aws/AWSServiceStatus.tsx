import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  message?: string;
  lastUpdated: string;
}

const AWSServiceStatus: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<ServiceStatus[]>([]);

  useEffect(() => {
    // In a real app, we would fetch the actual AWS service status
    // For demo purposes, we'll use mock data
    const mockServices: ServiceStatus[] = [
      {
        name: 'EC2',
        status: 'operational',
        lastUpdated: new Date().toISOString()
      },
      {
        name: 'S3',
        status: 'operational',
        lastUpdated: new Date().toISOString()
      },
      {
        name: 'RDS',
        status: 'degraded',
        message: 'Increased API error rates in us-east-1',
        lastUpdated: new Date().toISOString()
      },
      {
        name: 'Lambda',
        status: 'operational',
        lastUpdated: new Date().toISOString()
      },
      {
        name: 'CloudFront',
        status: 'maintenance',
        message: 'Scheduled maintenance in progress',
        lastUpdated: new Date().toISOString()
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setServices(mockServices);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'operational':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'degraded':
        return <AlertTriangle size={16} className="text-yellow-500" />;
      case 'outage':
        return <XCircle size={16} className="text-red-500" />;
      case 'maintenance':
        return <Clock size={16} className="text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'operational':
        return 'Operational';
      case 'degraded':
        return 'Degraded';
      case 'outage':
        return 'Outage';
      case 'maintenance':
        return 'Maintenance';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="border border-[#33FF00]/30 rounded-sm p-4">
      <h3 className="text-md uppercase tracking-wider border-b border-[#33FF00]/30 pb-2 mb-4 text-[#33FF00]">
        AWS Service Status
      </h3>
      
      {loading ? (
        <div className="text-center text-[#33FF00]/70 animate-pulse py-4">
          Loading service status...
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <div key={service.name} className="flex items-center justify-between">
              <div className="flex items-center">
                {getStatusIcon(service.status)}
                <span className="ml-2 text-[#33FF00]">{service.name}</span>
              </div>
              <div className={`text-sm ${
                service.status === 'operational' ? 'text-green-500' :
                service.status === 'degraded' ? 'text-yellow-500' :
                service.status === 'outage' ? 'text-red-500' :
                'text-blue-500'
              }`}>
                {getStatusText(service.status)}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 pt-2 border-t border-[#33FF00]/30 text-xs text-[#33FF00]/50">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default AWSServiceStatus;