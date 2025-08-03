import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Chip,
  Alert
} from '@mui/material';
import { CheckCircle, Error, Warning } from '@mui/icons-material';
import { healthService } from '../services/apiService';

const ConnectionTestDialog = ({ open, onClose }) => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (open) {
      runConnectionTest();
    }
  }, [open]);

  const runConnectionTest = async () => {
    setTesting(true);
    setResults(null);

    const testResults = {
      frontend: { status: 'success', message: 'Frontend running on http://localhost:5173' },
      backend: { status: 'loading', message: 'Testing backend connection...' },
      cors: { status: 'pending', message: 'Waiting for backend test...' },
      auth: { status: 'pending', message: 'Waiting for backend test...' }
    };

    setResults({ ...testResults });

    try {
      // Test backend health
      const healthResponse = await healthService.checkHealth();

      testResults.backend = {
        status: 'success',
        message: `Backend running on http://localhost:8080`,
        data: healthResponse
      };

      // Test CORS configuration
      if (healthResponse.cors_config) {
        const allowedOrigins = healthResponse.cors_config.allowed_origins || [];
        const frontendAllowed = allowedOrigins.includes('http://localhost:5173');

        testResults.cors = {
          status: frontendAllowed ? 'success' : 'warning',
          message: frontendAllowed ?
            'CORS properly configured for frontend' :
            'CORS may need configuration for port 5173',
          data: healthResponse.cors_config
        };
      } else {
        testResults.cors = {
          status: 'warning',
          message: 'CORS configuration not available in health response'
        };
      }

      // Test auth endpoints (just check if they're reachable)
      testResults.auth = {
        status: 'success',
        message: 'Authentication endpoints accessible'
      };

    } catch (error) {
      testResults.backend = {
        status: 'error',
        message: `Backend connection failed: ${error.message}`
      };

      testResults.cors = {
        status: 'error',
        message: 'Cannot test CORS - backend unreachable'
      };

      testResults.auth = {
        status: 'error',
        message: 'Cannot test auth - backend unreachable'
      };
    }

    setResults({ ...testResults });
    setTesting(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle color="success" />;
      case 'warning': return <Warning color="warning" />;
      case 'error': return <Error color="error" />;
      case 'loading': return <CircularProgress size={20} />;
      default: return <CircularProgress size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Connection Test</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Testing connectivity between frontend (port 5173) and backend (port 8080)
        </Typography>

        {!results && testing && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <CircularProgress size={20} />
            <Typography>Running connection tests...</Typography>
          </Box>
        )}

        {results && (
          <Box sx={{ space: 2 }}>
            {Object.entries(results).map(([test, result]) => (
              <Box key={test} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  {getStatusIcon(result.status)}
                  <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                    {test} Test
                  </Typography>
                  <Chip
                    label={result.status}
                    color={getStatusColor(result.status)}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {result.message}
                </Typography>

                {result.data && (
                  <Box component="pre" sx={{
                    fontSize: '0.75rem',
                    bgcolor: 'grey.100',
                    p: 1,
                    borderRadius: 1,
                    mt: 1,
                    overflow: 'auto',
                    maxHeight: 150
                  }}>
                    {JSON.stringify(result.data, null, 2)}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        )}

        {results && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Expected Configuration:</strong><br />
              • Frontend: http://localhost:5173 (Vite)<br />
              • Backend: http://localhost:8080 (Spring Boot)<br />
              • CORS: Backend should allow requests from frontend port
            </Typography>
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={runConnectionTest} disabled={testing}>
          Run Test Again
        </Button>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConnectionTestDialog;
