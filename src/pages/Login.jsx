import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  Grid,
  Avatar,
  Divider
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Instagram,
  Google,
  Facebook,
  Phone
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import EduSocialLogo from '../components/EduSocialLogo';

const Login = () => {
  const [credentials, setCredentials] = useState({
    usernameOrEmail: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showSessionMigration, setShowSessionMigration] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/social';

  // Check for old session format on component mount
  React.useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        if (parsed.tokenType && parsed.user) {
          setShowSessionMigration(true);
        }
      } catch (e) {
        // Invalid session data
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });

    // Clear field-specific errors when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: ''
      });
    }

    // Clear general error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);

    // Client-side validation
    const errors = {};
    if (!credentials.usernameOrEmail.trim()) {
      errors.usernameOrEmail = 'Username or email is required';
    }
    if (!credentials.password.trim()) {
      errors.password = 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      await login(credentials);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error details:', {
        error: error,
        response: error.response,
        data: error.response?.data,
        status: error.response?.status,
        message: error.message
      });

      // Extract error message with priority order
      let errorMessage = 'Login failed. Please try again.';

      if (error.response?.data) {
        // Check for different error response formats
        if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Handle specific error cases
      if (errorMessage.toLowerCase().includes('network error') || error.code === 'ERR_NETWORK') {
        errorMessage = 'Unable to connect to server. Please check your internet connection and ensure the backend is running.';
      } else if (errorMessage.toLowerCase().includes('timeout')) {
        errorMessage = 'Request timed out. Please try again.';
      } else if (errorMessage.toLowerCase().includes('invalid username') ||
        errorMessage.toLowerCase().includes('invalid password')) {
        errorMessage = 'Invalid username/email or password. Please check your credentials.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error occurred. Please try again later.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Invalid credentials. Please check your username/email and password.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied. Your account may be disabled.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 4
      }}
    >
      <Container component="main" maxWidth="sm">
        <Grid container spacing={4} alignItems="center">
          {/* Left side - App Showcase */}
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'center', color: 'white' }} onClick={() => navigate('/')} >
              <EduSocialLogo
                size="large"
                showText={true}
                sx={{ cursor: 'pointer' }}
                
                
              />
            </Box>
          </Grid>

          {/* Right side - Login Form */}
          <Grid item xs={12} md={6}>
            <Card
              elevation={20}
              sx={{
                p: 2,
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <CardContent>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: 'primary.main',
                      mx: 'auto',
                      mb: 2
                    }}
                  >
                    <EduSocialLogo size="large" showText={false} />
                  </Avatar>
                  <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
                    Welcome Back
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Sign in to continue your learning journey
                  </Typography>
                </Box>

                {showSessionMigration && (
                  <Alert
                    severity="warning"
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      '& .MuiAlert-message': {
                        width: '100%'
                      }
                    }}
                    action={
                      <Box>
                        <Button
                          color="inherit"
                          size="small"
                          onClick={() => {
                            const userData = localStorage.getItem('user');
                            if (userData) {
                              try {
                                const parsed = JSON.parse(userData);
                                if (parsed.tokenType && parsed.user) {
                                  localStorage.setItem('user', JSON.stringify(parsed.user));
                                  setShowSessionMigration(false);
                                  alert('Session updated! You can now use the app normally.');
                                }
                              } catch (e) {
                                alert('Error updating session.');
                              }
                            }
                          }}
                          sx={{ minWidth: 'auto', mr: 1 }}
                        >
                          Fix
                        </Button>
                        <Button
                          color="inherit"
                          size="small"
                          onClick={() => {
                            localStorage.removeItem('authToken');
                            localStorage.removeItem('user');
                            setShowSessionMigration(false);
                            alert('Session cleared! Please log in again.');
                          }}
                          sx={{ minWidth: 'auto' }}
                        >
                          Clear
                        </Button>
                      </Box>
                    }
                  >
                    <Typography variant="body2" component="div">
                      <strong>Session Update Required</strong>
                      <br />
                      Your session is in an old format. Click "Fix" to update it, or "Clear" to log in fresh.
                    </Typography>
                  </Alert>
                )}

                {error && (
                  <Alert
                    severity="error"
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      '& .MuiAlert-message': {
                        width: '100%'
                      }
                    }}
                    action={
                      <Button
                        color="inherit"
                        size="small"
                        onClick={() => setError('')}
                        sx={{ minWidth: 'auto' }}
                      >
                        ✕
                      </Button>
                    }
                  >
                    <Typography variant="body2" component="div">
                      <strong>Login Failed</strong>
                      <br />
                      {error}
                    </Typography>
                    {error.toLowerCase().includes('invalid username') && (
                      <Typography variant="caption" sx={{ mt: 1, display: 'block', opacity: 0.8 }}>
                        💡 Tip: You can use either your username or email address to log in
                      </Typography>
                    )}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    required
                    fullWidth
                    label="Username or Email"
                    name="usernameOrEmail"
                    value={credentials.usernameOrEmail}
                    onChange={handleChange}
                    error={!!fieldErrors.usernameOrEmail}
                    helperText={fieldErrors.usernameOrEmail}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />

                  <TextField
                    required
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={credentials.password}
                    onChange={handleChange}
                    error={!!fieldErrors.password}
                    helperText={fieldErrors.password}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 2,
                      mb: 3,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      borderRadius: 2,
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1976D2 30%, #0288D1 90%)',
                      },
                      '&:disabled': {
                        background: 'linear-gradient(45deg, #ccc 30%, #ddd 90%)',
                      }
                    }}
                    disabled={loading}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>

                  {/* Debug Information - Remove in production */}
                  {import.meta.env.NODE_ENV === 'development' && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        🔧 Debug Info:<br />
                        API Base URL: {import.meta.env.VITE_API_BASE_URL || 'Not set (using proxy)'}<br />
                        Current Values: {credentials.usernameOrEmail ? '✓' : '✗'} Username, {credentials.password ? '✓' : '✗'} Password<br />
                        Backend Status: <Button
                          size="small"
                          onClick={async () => {
                            try {
                              const response = await fetch('/api/health');
                              const data = await response.text();
                              alert(`Backend Status: ${response.status} - ${data}`);
                            } catch (e) {
                              alert(`Backend Error: ${e.message}`);
                            }
                          }}
                          sx={{ mr: 1 }}
                        >
                          Test Connection
                        </Button>
                        <Button
                          size="small"
                          onClick={() => {
                            const userData = localStorage.getItem('user');
                            if (userData) {
                              try {
                                const parsed = JSON.parse(userData);
                                if (parsed.tokenType && parsed.user) {
                                  localStorage.setItem('user', JSON.stringify(parsed.user));
                                  alert('Session migrated! Please refresh the page.');
                                } else {
                                  alert('Session is already in correct format.');
                                }
                              } catch (e) {
                                alert('Error parsing session data.');
                              }
                            } else {
                              alert('No session data found.');
                            }
                          }}
                          sx={{ mr: 1 }}
                        >
                          Fix Session
                        </Button>
                        <Button
                          size="small"
                          onClick={() => {
                            localStorage.removeItem('authToken');
                            localStorage.removeItem('user');
                            alert('Session cleared! You can now log in fresh.');
                            window.location.reload();
                          }}
                        >
                          Clear Session
                        </Button>
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Link
                      component={RouterLink}
                      to="/forgot-password"
                      sx={{
                        color: 'primary.main',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      Forgot Password?
                    </Link>
                  </Box>

                  <Divider sx={{ my: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      OR
                    </Typography>
                  </Divider>

                  <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Google />}
                      sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        py: 1.2
                      }}
                    >
                      Google
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Facebook />}
                      sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        py: 1.2
                      }}
                    >
                      Facebook
                    </Button>
                    
                  </Box>

                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Don't have an account?{' '}
                      <Link
                        component={RouterLink}
                        to="/register"
                        sx={{
                          fontWeight: 'bold',
                          color: 'primary.main',
                          textDecoration: 'none',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                      >
                        Sign up
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Footer Links */}
            
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login;
