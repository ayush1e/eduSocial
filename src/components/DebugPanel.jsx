import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { ExpandMore, BugReport } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const DebugPanel = () => {
  const { user, isAuthenticated } = useAuth();
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const collectDebugInfo = () => {
      const info = {
        timestamp: new Date().toISOString(),
        environment: {
          nodeEnv: import.meta.env.NODE_ENV,
          mode: import.meta.env.MODE,
          apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
          backendUrl: import.meta.env.VITE_BACKEND_URL,
        },
        browser: {
          userAgent: navigator.userAgent,
          url: window.location.href,
          pathname: window.location.pathname,
        },
        localStorage: {
          authToken: localStorage.getItem('authToken') ? 'Present' : 'Missing',
          userData: localStorage.getItem('user') ? 'Present' : 'Missing',
        },
        authentication: {
          isAuthenticated,
          userObject: user,
          userId: user?.id || user?.userId || user?.user_id || 'Not found',
        },
        navigation: {
          currentPath: window.location.pathname,
          origin: window.location.origin,
        }
      };
      setDebugInfo(info);
    };

    collectDebugInfo();

    // Update debug info every 5 seconds
    const interval = setInterval(collectDebugInfo, 5000);
    return () => clearInterval(interval);
  }, [user, isAuthenticated]);

  // Only show in development
  if (import.meta.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Box sx={{ position: 'fixed', bottom: 80, right: 16, width: 350, zIndex: 2000 }}>
      <Paper elevation={8} sx={{ maxHeight: 400, overflow: 'auto' }}>
        <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BugReport fontSize="small" />
            Debug Panel
          </Typography>
        </Box>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle2">Authentication Status</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Status"
                  secondary={
                    <Chip
                      label={isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                      color={isAuthenticated ? 'success' : 'error'}
                      size="small"
                    />
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="User ID"
                  secondary={debugInfo.authentication?.userId || 'N/A'}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Username"
                  secondary={user?.username || 'N/A'}
                />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle2">Environment</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Mode"
                  secondary={debugInfo.environment?.mode || 'N/A'}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="API Base URL"
                  secondary={debugInfo.environment?.apiBaseUrl || 'N/A'}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Backend URL"
                  secondary={debugInfo.environment?.backendUrl || 'N/A'}
                />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle2">Storage</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Auth Token"
                  secondary={
                    <Chip
                      label={debugInfo.localStorage?.authToken || 'Missing'}
                      color={debugInfo.localStorage?.authToken === 'Present' ? 'success' : 'error'}
                      size="small"
                    />
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="User Data"
                  secondary={
                    <Chip
                      label={debugInfo.localStorage?.userData || 'Missing'}
                      color={debugInfo.localStorage?.userData === 'Present' ? 'success' : 'error'}
                      size="small"
                    />
                  }
                />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        <Box sx={{ p: 1, bgcolor: 'grey.100' }}>
          <Typography variant="caption" color="text.secondary">
            Last updated: {new Date(debugInfo.timestamp).toLocaleTimeString()}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default DebugPanel;
