# UI Integration Plan: Phase 4 - Advanced Features and Polishing

## Overview

Building on the solid foundation established in Phases 1-3, this final phase focuses on implementing advanced DevOps features, comprehensive error handling, user authentication, enhanced monitoring capabilities, and UI polish to deliver a complete, production-ready Agentic DevOps UI experience.

## Goals

1. Implement user authentication and authorization
2. Create comprehensive error handling strategies
3. Add advanced DevOps monitoring dashboards
4. Implement CI/CD pipeline tracking
5. Add notification system for DevOps events
6. Enhance the terminal experience with AI assistance
7. Optimize performance and accessibility
8. Add comprehensive testing

## Implementation Details

### 1. User Authentication and Authorization

#### AuthContext.tsx - Authentication state management

```typescript
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login, logout, refreshToken, getCurrentUser } from '@/services/authService';

interface User {
  id: string;
  username: string;
  role: string;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthorized: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check for existing session on initial load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        // Not logged in or token expired
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);
  
  // Set up token refresh interval
  useEffect(() => {
    if (!user) return;
    
    const refreshInterval = setInterval(async () => {
      try {
        await refreshToken();
      } catch (err) {
        console.error('Token refresh error:', err);
        // Force logout if refresh fails
        handleLogout();
      }
    }, 15 * 60 * 1000); // Refresh every 15 minutes
    
    return () => clearInterval(refreshInterval);
  }, [user]);
  
  const handleLogin = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const loggedInUser = await login(username, password);
      setUser(loggedInUser);
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    setLoading(true);
    
    try {
      await logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const isAuthorized = (permission: string): boolean => {
    if (!user) return false;
    
    // Admin role has all permissions
    if (user.role === 'admin') return true;
    
    // Check specific permission
    return user.permissions.includes(permission);
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login: handleLogin,
        logout: handleLogout,
        isAuthorized
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

#### LoginPage.tsx - User authentication interface

```typescript
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Terminal, Lock, User } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the return URL from location state or default to home
  const from = (location.state as any)?.from?.pathname || '/';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await login(username, password);
    
    // If login was successful, redirect to the return URL
    if (!error) {
      navigate(from);
    }
  };
  
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#111] border-2 border-[#33FF00]/30 rounded-sm p-6 dot-matrix-container relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#33FF00]/0 via-[#33FF00]/50 to-[#33FF00]/0"></div>
          
          <div className="flex flex-col items-center mb-6">
            <Terminal className="h-12 w-12 text-[#33FF00] mb-2" />
            <h1 className="text-[#33FF00] font-micro text-2xl uppercase tracking-widest">
              Agentic DevOps
            </h1>
            <p className="text-[#33FF00]/70 text-sm mt-2">
              Enter credentials to access the terminal
            </p>
          </div>
          
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-500 p-2 rounded-sm mb-4 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm text-[#33FF00]/70 mb-1">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-2 top-2.5 h-4 w-4 text-[#33FF00]/50" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-[#111] border-[#33FF00]/30 text-[#33FF00] pl-8"
                  placeholder="Enter username"
                  autoComplete="username"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm text-[#33FF00]/70 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-2 top-2.5 h-4 w-4 text-[#33FF00]/50" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#111] border-[#33FF00]/30 text-[#33FF00] pl-8"
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#33FF00]/20 text-[#33FF00] border border-[#33FF00]/50 hover:bg-[#33FF00]/30"
            >
              {loading ? 'Authenticating...' : 'Access Terminal'}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-xs text-[#33FF00]/50">
            Unauthorized access is prohibited and monitored
          </div>
          
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-[#33FF00]/0 via-[#33FF00]/50 to-[#33FF00]/0"></div>
        </div>
        
        <div className="text-center text-[#33FF00]/30 text-xs mt-4">
          Agentic DevOps Terminal • v1.0.0
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
```

#### ProtectedRoute.tsx - Authorization-based route protection

```typescript
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermission 
}) => {
  const { user, loading, isAuthorized } = useAuth();
  const location = useLocation();
  
  if (loading) {
    // Show a loading state while checking authentication
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#33FF00] font-micro uppercase tracking-widest">
          Authenticating...
        </div>
      </div>
    );
  }
  
  // If not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If permission check is required and user doesn't have it
  if (requiredPermission && !isAuthorized(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  // User is authenticated and authorized
  return <>{children}</>;
};

export default ProtectedRoute;
```

#### Update App.tsx with Authentication

```typescript
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { DevOpsProvider } from './context/DevOpsContext';
import ProtectedRoute from './components/ProtectedRoute';
import NavigationWrapper from './components/NavigationWrapper';
import LoginPage from './pages/LoginPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import EC2Dashboard from "./pages/EC2Dashboard";
import GitHubDashboard from "./pages/GitHubDashboard";
import DeploymentDashboard from "./pages/DeploymentDashboard";
import MonitoringDashboard from "./pages/MonitoringDashboard";
import UserSettings from "./pages/UserSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DevOpsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <NavigationWrapper><Index /></NavigationWrapper>
                </ProtectedRoute>
              } />
              
              <Route path="/ec2" element={
                <ProtectedRoute requiredPermission="ec2:read">
                  <NavigationWrapper><EC2Dashboard /></NavigationWrapper>
                </ProtectedRoute>
              } />
              
              <Route path="/github" element={
                <ProtectedRoute requiredPermission="github:read">
                  <NavigationWrapper><GitHubDashboard /></NavigationWrapper>
                </ProtectedRoute>
              } />
              
              <Route path="/deploy" element={
                <ProtectedRoute requiredPermission="deploy:read">
                  <NavigationWrapper><DeploymentDashboard /></NavigationWrapper>
                </ProtectedRoute>
              } />
              
              <Route path="/monitoring" element={
                <ProtectedRoute requiredPermission="monitoring:read">
                  <NavigationWrapper><MonitoringDashboard /></NavigationWrapper>
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <NavigationWrapper><UserSettings /></NavigationWrapper>
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DevOpsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
```

### 2. Comprehensive Error Handling

#### ErrorBoundary.tsx - Generic error boundary component

```typescript
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can log the error to an error reporting service here
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="border-2 border-red-500/30 bg-red-950/20 rounded-sm p-4 text-[#33FF00]">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-red-400 mb-2">
                Something went wrong
              </h3>
              <div className="bg-black/50 p-2 rounded text-sm font-mono overflow-auto mb-4 text-red-300">
                {this.state.error?.message || 'Unknown error'}
              </div>
              <Button
                onClick={this.handleReset}
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-950"
              >
                <RefreshCw size={16} className="mr-2" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

#### ApiErrorHandler.tsx - Error handling for API requests

```typescript
import React from 'react';
import { AxiosError } from 'axios';
import { useToast } from '@/hooks/use-toast';

interface ApiErrorHandlerProps {
  children: React.ReactNode;
}

const ApiErrorHandler: React.FC<ApiErrorHandlerProps> = ({ children }) => {
  const { toast } = useToast();

  React.useEffect(() => {
    // Add a global error handler for uncaught promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      
      // Handle Axios errors
      if (event.reason instanceof AxiosError) {
        const axiosError = event.reason as AxiosError;
        
        // Handle different error status codes
        switch (axiosError.response?.status) {
          case 401:
            toast({
              title: 'Authentication Error',
              description: 'Your session has expired. Please log in again.',
              variant: 'destructive',
            });
            // Redirect to login page
            window.location.href = '/login';
            break;
            
          case 403:
            toast({
              title: 'Permission Denied',
              description: 'You do not have permission to perform this action.',
              variant: 'destructive',
            });
            break;
            
          case 404:
            toast({
              title: 'Resource Not Found',
              description: axiosError.response?.data?.message || 'The requested resource was not found.',
              variant: 'destructive',
            });
            break;
            
          case 500:
          case 502:
          case 503:
          case 504:
            toast({
              title: 'Server Error',
              description: 'The server encountered an error. Please try again later.',
              variant: 'destructive',
            });
            break;
            
          default:
            toast({
              title: 'Request Failed',
              description: axiosError.message || 'An unexpected error occurred.',
              variant: 'destructive',
            });
        }
      } else {
        // Handle generic errors
        console.error('Unhandled promise rejection:', event.reason);
        
        toast({
          title: 'Application Error',
          description: 'An unexpected error occurred. Please try again.',
          variant: 'destructive',
        });
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [toast]);

  return <>{children}</>;
};

export default ApiErrorHandler;
```

### 3. Advanced DevOps Monitoring Dashboard

#### MonitoringDashboard.tsx - DevOps monitoring center

```typescript
import React, { useState, useEffect } from 'react';
import SystemMetrics from '@/components/monitoring/SystemMetrics';
import DeploymentActivity from '@/components/monitoring/DeploymentActivity';
import ServiceHealth from '@/components/monitoring/ServiceHealth';
import AlertsOverview from '@/components/monitoring/AlertsOverview';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { RefreshCw, Calendar as CalendarIcon } from 'lucide-react';
import { 
  getSystemMetrics,
  getServiceHealth,
  getDeploymentActivity,
  getAlerts
} from '@/services/monitoringService';

const timeRanges = [
  { value: '1h', label: 'Last Hour' },
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: 'custom', label: 'Custom Range' },
];

const MonitoringDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('24h');
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | { from: Date; to?: Date }>({
    from: new Date(Date.now() - 24 * 60 * 60 * 1000),
    to: new Date()
  });
  const [refreshInterval, setRefreshInterval] = useState<number | null>(60000); // 1 minute
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<any>({});
  const [health, setHealth] = useState<any[]>([]);
  const [deployments, setDeployments] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      let start: Date;
      let end: Date = new Date();
      
      if (timeRange === 'custom') {
        start = dateRange.from;
        end = dateRange.to || end;
      } else {
        const milliseconds = timeRange === '1h' ? 60 * 60 * 1000 :
                            timeRange === '24h' ? 24 * 60 * 60 * 1000 :
                            timeRange === '7d' ? 7 * 24 * 60 * 60 * 1000 :
                            30 * 24 * 60 * 60 * 1000;
        start = new Date(Date.now() - milliseconds);
      }
      
      const [metricsData, healthData, deploymentData, alertsData] = await Promise.all([
        getSystemMetrics(start, end),
        getServiceHealth(start, end),
        getDeploymentActivity(start, end),
        getAlerts(start, end)
      ]);
      
      setMetrics(metricsData);
      setHealth(healthData);
      setDeployments(deploymentData);
      setAlerts(alertsData);
    } catch (error) {
      console.error('Failed to fetch monitoring data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [timeRange, dateRange]);
  
  useEffect(() => {
    if (!refreshInterval) return;
    
    const interval = setInterval(() => {
      fetchData();
    }, refreshInterval);
    
    return () => clearInterval(interval);
  }, [refreshInterval, timeRange, dateRange]);
  
  return (
    <div className="bg-[#111] border-2 border-[#33FF00]/30 rounded-sm p-4 font-micro text-[#33FF00] h-full overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <h2 className="text-lg uppercase tracking-wider">DevOps Monitoring</h2>
        
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-[#111] border border-[#33FF00]/30 text-[#33FF00] text-sm rounded-sm p-1.5 px-3 appearance-none cursor-pointer"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
            
            {timeRange === 'custom' && (
              <div className="mt-2 absolute z-10 right-0">
                <Button
                  variant="outline"
                  size="sm"
