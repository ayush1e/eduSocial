import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Avatar,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Alert
} from '@mui/material';
import {
  Delete,
  Add
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { socialService } from '../services/apiService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sessionError, setSessionError] = useState('');
  const [newPost, setNewPost] = useState({
    content: '',
    subject: '',
    examType: '',
    topic: '',
    questionText: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correctAnswer: '',
    explanation: '',
    difficultyLevel: 'MEDIUM'
  });

  // Check session validity on component mount
  React.useEffect(() => {
    const validateSession = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');

      if (!token) {
        setSessionError('No authentication token found. Please log in.');
        return;
      }

      // Check if token is expired (basic JWT expiration check)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        if (payload.exp && payload.exp < currentTime) {
          setSessionError('Authentication token has expired. Please log in again.');
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          return;
        }
      } catch (e) {
        setSessionError('Invalid authentication token. Please log in again.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        return;
      }

      if (!userData) {
        setSessionError('User data not found. Please log in again.');
        return;
      }

      try {
        const parsedUser = JSON.parse(userData);

        // Check for old nested format and suggest migration
        if (parsedUser.tokenType && parsedUser.user) {
          setSessionError('Old session format detected. Please log out and log in again, or use the "Fix Session" button.');
          return;
        }

        // Handle nested user structure
        const actualUser = parsedUser.user || parsedUser;
        if (!actualUser.id && !actualUser.userId && !actualUser.user_id) {
          setSessionError('Invalid user session. Please log in again.');
          return;
        }
      } catch (e) {
        setSessionError('Corrupted user data. Please log in again.');
        return;
      }

      if (!user) {
        setSessionError('Authentication context not available. Please refresh the page.');
        return;
      }

      // Clear any previous session errors
      setSessionError('');
    };

    validateSession();
  }, [user]);

  // Constants for subjects and exam types
  const subjects = [
    'MATHEMATICS', 'PHYSICS', 'CHEMISTRY', 'BIOLOGY', 'ENGLISH',
    'HISTORY', 'GEOGRAPHY', 'ECONOMICS', 'COMPUTER_SCIENCE', 'GENERAL_KNOWLEDGE'
  ];

  const examTypes = [
    'JEE_MAIN', 'JEE_ADVANCED', 'NEET', 'GATE', 'CAT', 'UPSC_CIVIL_SERVICES',
    'SSC_CGL', 'IBPS_PO', 'SBI_PO', 'RRB_NTPC', 'NDA', 'CDS', 'AFCAT',
    'SAT', 'GRE', 'GMAT', 'TOEFL', 'IELTS'
  ];

  const handleCreatePost = async () => {
    // Check for session errors first
    if (sessionError) {
      toast.error('Please resolve session issues before creating a post');
      return;
    }

    // Validate required MCQ fields
    if (!newPost.questionText?.trim()) {
      toast.error('Please enter the question text');
      return;
    }

    if (!newPost.option1?.trim() || !newPost.option2?.trim() ||
      !newPost.option3?.trim() || !newPost.option4?.trim()) {
      toast.error('Please fill in all four options');
      return;
    }

    if (!newPost.correctAnswer) {
      toast.error('Please select the correct answer');
      return;
    }

    if (!newPost.subject) {
      toast.error('Please select a subject');
      return;
    }

    if (!newPost.examType) {
      toast.error('Please select an exam type');
      return;
    }

    setLoading(true);

    try {
      // Debug: Check user object structure
      console.log('User object from context:', user);
      console.log('User from localStorage:', localStorage.getItem('user'));

      // Check if user is authenticated - be more flexible with user object structure
      if (!user) {
        toast.error('Please log in to create MCQ questions');
        navigate('/login');
        return;
      }

      // Also check localStorage for user data as backup
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('Stored user object:', storedUser);

      // With the fixed AuthContext, user should be the direct user object
      // But we'll still handle both cases for backward compatibility
      const actualUser = user.user || user; // Handle nested if still present
      const actualStoredUser = storedUser.user || storedUser; // Handle nested stored user

      console.log('Actual user object:', actualUser);
      console.log('Actual stored user object:', actualStoredUser);

      // Check user ID from the actual user objects
      const userId = actualUser.id || actualUser.userId || actualUser.user_id ||
        actualStoredUser.id || actualStoredUser.userId || actualStoredUser.user_id;
      console.log('Extracted user ID:', userId);

      if (!userId) {
        console.error('No user ID found. User context:', user, 'Stored user:', storedUser, 'Actual user:', actualUser, 'Actual stored user:', actualStoredUser);
        toast.error('User session issue. Please log in again.');
        navigate('/login');
        return;
      }

      // Create post with MCQ question using the existing backend structure
      const postData = {
        title: newPost.content?.trim() || `MCQ Question: ${newPost.questionText.substring(0, 50)}...`,
        description: newPost.content?.trim() || '',
        subject: newPost.subject,
        examType: newPost.examType || 'JEE_MAIN', // Default to JEE_MAIN instead of GENERAL
        difficultyLevel: newPost.difficultyLevel,
        questions: [{
          questionText: newPost.questionText.trim(),
          optionA: newPost.option1.trim(),
          optionB: newPost.option2.trim(),
          optionC: newPost.option3.trim(),
          optionD: newPost.option4.trim(),
          correctAnswer: newPost.correctAnswer,
          explanation: newPost.explanation?.trim() || '',
          section: newPost.topic?.trim() || newPost.subject,
          timeLimit: 60, // Default 60 seconds
          points: 1 // Default 1 point
        }]
      };

      console.log('Creating MCQ post with data:', postData);
      const createdPost = await socialService.createPost(postData);
      console.log('MCQ post created successfully:', createdPost);

      toast.success('MCQ question created successfully!');
      navigate('/social');
    } catch (error) {
      console.error('Failed to create MCQ question:', error);

      // Enhanced error handling for session errors
      let errorMessage = 'Failed to create MCQ question';

      if (error.response?.status === 401) {
        errorMessage = 'Session expired. Please log in again.';
        // Clear user data and redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setTimeout(() => navigate('/login'), 2000);
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to create posts. Please verify your account.';
      } else if (error.message?.toLowerCase().includes('session')) {
        errorMessage = 'Session error occurred. Please refresh the page and try again.';
      } else if (error.message?.toLowerCase().includes('user must be logged in')) {
        errorMessage = 'Authentication required. Please log in to continue.';
        setTimeout(() => navigate('/login'), 2000);
      } else if (error.message?.toLowerCase().includes('user id')) {
        errorMessage = 'User session issue detected. Please log out and log in again.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);

      // Additional debugging for session issues
      if (error.response?.status === 401 || error.message?.toLowerCase().includes('session') ||
        error.message?.toLowerCase().includes('user must be logged in')) {
        console.error('Session error details:', {
          userFromContext: user,
          userFromStorage: localStorage.getItem('user'),
          authToken: localStorage.getItem('authToken'),
          errorResponse: error.response?.data,
          errorStatus: error.response?.status
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewPost({
      content: '',
      subject: '',
      examType: '',
      topic: '',
      questionText: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      correctAnswer: '',
      explanation: '',
      difficultyLevel: 'MEDIUM'
    });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          📚 Create MCQ Question
        </Typography>
        <Typography variant="subtitle1" sx={{ textAlign: 'center', mt: 1, opacity: 0.9 }}>
          Share your knowledge by creating multiple choice questions for the community
        </Typography>
      </Paper>

      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          {/* User Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Avatar src={user?.profilePicture || user?.user?.profilePicture} sx={{ width: 50, height: 50 }}>
              {(user?.username || user?.user?.username)?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {user?.username || user?.user?.username}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Creating MCQ Question
              </Typography>
            </Box>
          </Box>

          {/* Session Error Alert */}
          {sessionError && (
            <Alert
              severity="error"
              sx={{ mb: 3, borderRadius: 2 }}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
              }
            >
              <Typography variant="body2" component="div">
                <strong>Session Error</strong>
                <br />
                {sessionError}
              </Typography>
            </Alert>
          )}

          {/* Debug info - only show in development */}
          {import.meta.env.NODE_ENV === 'development' && (
            <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                Debug Info:
              </Typography>
              <Typography variant="caption" sx={{ display: 'block' }}>
                User ID: {user?.id || user?.userId || user?.user_id || 'No ID found'}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block' }}>
                Username: {user?.username || 'No username'}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block' }}>
                User Type: {user?.user ? 'Legacy Nested Format' : 'Direct Format'}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block' }}>
                Auth Token: {localStorage.getItem('authToken') ? '✓ Present' : '✗ Missing'}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                Session Error: {sessionError || 'None'}
              </Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  // Test backend connectivity
                  fetch('/api/health')
                    .then(r => r.text())
                    .then(data => alert(`Backend: ${data}`))
                    .catch(e => alert(`Backend Error: ${e.message}`));
                }}
                sx={{ mr: 1 }}
              >
                Test Backend
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  setSessionError('');
                  window.location.reload();
                }}
              >
                Refresh Session
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  const userData = localStorage.getItem('user');
                  if (userData) {
                    try {
                      const parsed = JSON.parse(userData);
                      if (parsed.tokenType && parsed.user) {
                        localStorage.setItem('user', JSON.stringify(parsed.user));
                        setSessionError('');
                        window.location.reload();
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
                sx={{ ml: 1 }}
              >
                Fix Session Format
              </Button>
            </Box>
          )}          <Grid container spacing={3}>
            {/* MCQ Question Section - Main Focus */}
            <Grid item xs={12}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  mb: 2
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  📝 Question Details
                </Typography>

                <TextField
                  fullWidth
                  label="Question Text *"
                  multiline
                  rows={4}
                  required
                  value={newPost.questionText}
                  onChange={(e) => setNewPost(prev => ({ ...prev, questionText: e.target.value }))}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      borderRadius: 2
                    }
                  }}
                  placeholder="Enter your multiple choice question here... (e.g., What is the capital of France?)"
                />

                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                  📋 Answer Options
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Option A *"
                      required
                      value={newPost.option1}
                      onChange={(e) => setNewPost(prev => ({ ...prev, option1: e.target.value }))}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(255,255,255,0.95)',
                          borderRadius: 2
                        }
                      }}
                      placeholder="First option"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Option B *"
                      required
                      value={newPost.option2}
                      onChange={(e) => setNewPost(prev => ({ ...prev, option2: e.target.value }))}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(255,255,255,0.95)',
                          borderRadius: 2
                        }
                      }}
                      placeholder="Second option"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Option C *"
                      required
                      value={newPost.option3}
                      onChange={(e) => setNewPost(prev => ({ ...prev, option3: e.target.value }))}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(255,255,255,0.95)',
                          borderRadius: 2
                        }
                      }}
                      placeholder="Third option"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Option D *"
                      required
                      value={newPost.option4}
                      onChange={(e) => setNewPost(prev => ({ ...prev, option4: e.target.value }))}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(255,255,255,0.95)',
                          borderRadius: 2
                        }
                      }}
                      placeholder="Fourth option"
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel sx={{ color: 'white' }}>Correct Answer *</InputLabel>
                      <Select
                        value={newPost.correctAnswer}
                        label="Correct Answer *"
                        onChange={(e) => setNewPost(prev => ({ ...prev, correctAnswer: e.target.value }))}
                        sx={{
                          backgroundColor: 'rgba(255,255,255,0.95)',
                          borderRadius: 2
                        }}
                      >
                        <MenuItem value="A">A - {newPost.option1 || 'Option A'}</MenuItem>
                        <MenuItem value="B">B - {newPost.option2 || 'Option B'}</MenuItem>
                        <MenuItem value="C">C - {newPost.option3 || 'Option C'}</MenuItem>
                        <MenuItem value="D">D - {newPost.option4 || 'Option D'}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ color: 'white' }}>Difficulty Level</InputLabel>
                      <Select
                        value={newPost.difficultyLevel}
                        label="Difficulty Level"
                        onChange={(e) => setNewPost(prev => ({ ...prev, difficultyLevel: e.target.value }))}
                        sx={{
                          backgroundColor: 'rgba(255,255,255,0.95)',
                          borderRadius: 2
                        }}
                      >
                        <MenuItem value="EASY">🟢 Easy</MenuItem>
                        <MenuItem value="MEDIUM">🟡 Medium</MenuItem>
                        <MenuItem value="HARD">🔴 Hard</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <TextField
                  fullWidth
                  label="Explanation (Recommended)"
                  multiline
                  rows={3}
                  value={newPost.explanation}
                  onChange={(e) => setNewPost(prev => ({ ...prev, explanation: e.target.value }))}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      borderRadius: 2
                    }
                  }}
                  placeholder="Explain why this is the correct answer and help students understand the concept..."
                />
              </Paper>
            </Grid>

            {/* Required Classification */}
            <Grid item xs={12}>
              <Paper elevation={1} sx={{ p: 3, borderRadius: 2, bgcolor: 'grey.50' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                  🏷️ Question Classification
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Subject *</InputLabel>
                      <Select
                        value={newPost.subject}
                        label="Subject *"
                        onChange={(e) => setNewPost(prev => ({ ...prev, subject: e.target.value }))}
                      >
                        {subjects.map(subject => (
                          <MenuItem key={subject} value={subject}>
                            {subject.replace('_', ' ')}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Exam Type *</InputLabel>
                      <Select
                        value={newPost.examType}
                        label="Exam Type *"
                        onChange={(e) => setNewPost(prev => ({ ...prev, examType: e.target.value }))}
                      >
                        {examTypes.map(exam => (
                          <MenuItem key={exam} value={exam}>
                            {exam.replace('_', ' ')}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Topic/Chapter (Optional)"
                      placeholder="Enter specific topic, chapter, or concept (e.g., Quadratic Equations, Cell Division, etc.)"
                      value={newPost.topic}
                      onChange={(e) => setNewPost(prev => ({ ...prev, topic: e.target.value }))}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Additional Context (Optional)"
                      placeholder="Add any additional context, study tips, or references for this question..."
                      value={newPost.content}
                      onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              * Required fields must be completed
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                onClick={resetForm}
                variant="outlined"
                sx={{ textTransform: 'none', px: 3 }}
                startIcon={<Delete />}
              >
                Clear All
              </Button>
              <Button
                onClick={() => navigate('/social')}
                variant="outlined"
                sx={{ textTransform: 'none', px: 3 }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreatePost}
                variant="contained"
                disabled={
                  loading ||
                  !newPost.questionText?.trim() ||
                  !newPost.option1?.trim() ||
                  !newPost.option2?.trim() ||
                  !newPost.option3?.trim() ||
                  !newPost.option4?.trim() ||
                  !newPost.correctAnswer ||
                  !newPost.subject ||
                  !newPost.examType
                }
                sx={{
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6b4190 100%)'
                  },
                  px: 4,
                  py: 1.2
                }}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Add />}
              >
                {loading ? 'Publishing Question...' : 'Publish MCQ Question'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default CreatePost;
