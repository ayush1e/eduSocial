import React from 'react';
import { Chip, Box } from '@mui/material';
import { Wifi, WifiOff, Error, CheckCircle } from '@mui/icons-material';
import { useConnectionStatus } from '../utils/healthCheck';

const ConnectionStatus = () => {
  const { isOnline, backendStatus } = useConnectionStatus();

  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        label: 'Offline',
        color: 'error',
        icon: <WifiOff />
      };
    }

    if (backendStatus === 'healthy') {
      return {
        label: 'Connected',
        color: 'success',
        icon: <CheckCircle />
      };
    }

    if (backendStatus === 'unhealthy') {
      return {
        label: 'Server Offline',
        color: 'error',
        icon: <Error />
      };
    }

    return {
      label: 'Checking...',
      color: 'default',
      icon: <Wifi />
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <Box sx={{ position: 'fixed', bottom: 16, left: 16, zIndex: 1000 }}>
      <Chip
        icon={statusInfo.icon}
        label={statusInfo.label}
        color={statusInfo.color}
        size="small"
        sx={{
          backgroundColor: statusInfo.color === 'success' ? 'success.light' : undefined,
          color: statusInfo.color === 'success' ? 'success.contrastText' : undefined
        }}
      />
    </Box>
  );
};

export default ConnectionStatus;
