import React from 'react';
import { healthService } from '../services/apiService';

// Health check utility
export const performHealthCheck = async () => {
  try {
    await healthService.checkHealth();
    return { status: 'healthy', message: 'Backend is reachable' };
  } catch (error) {
    console.error('Health check failed:', error);
    return {
      status: 'unhealthy',
      message: 'Backend is not reachable. Please check if the server is running on http://localhost:8080'
    };
  }
};

// Connection status component
export const useConnectionStatus = () => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [backendStatus, setBackendStatus] = React.useState('unknown');

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check backend health on mount
    performHealthCheck().then(result => {
      setBackendStatus(result.status);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, backendStatus };
};
