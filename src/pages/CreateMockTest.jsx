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
  Card,
  CardContent,
  Chip,
  Divider
} from '@mui/material';
import {
  Add,
  Quiz,
  Timer,
  School
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateMockTest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [testData, setTestData] = useState({
    title: '',
    description: '',
    subject: '',
    examType: '',
    difficultyLevel: 'MEDIUM',
    duration: 60,
    totalQuestions: 10,
    instructions: ''
  });

  const subjects = [
    'MATHEMATICS', 'PHYSICS', 'CHEMISTRY', 'BIOLOGY', 'ENGLISH',
    'HISTORY', 'GEOGRAPHY', 'ECONOMICS', 'COMPUTER_SCIENCE', 'GENERAL_KNOWLEDGE'
  ];

  const examTypes = [
    'JEE_MAIN', 'JEE_ADVANCED', 'NEET', 'GATE', 'CAT', 'UPSC_CIVIL_SERVICES',
    'SSC_CGL', 'IBPS_PO', 'SBI_PO', 'RRB_NTPC', 'NDA', 'CDS', 'AFCAT',
    'SAT', 'GRE', 'GMAT', 'TOEFL', 'IELTS'
  ];

  const handleCreateTest = async () => {
    // Validate required fields
    if (!testData.title?.trim()) {
      toast.error('Please enter a test title');
      return;
    }

    if (!testData.subject) {
      toast.error('Please select a subject');
      return;
    }

    if (!testData.examType) {
      toast.error('Please select an exam type');
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement mock test creation API call
      toast.info('Mock test creation feature is coming soon!');

      // For now, just navigate back to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Failed to create mock test:', error);
      toast.error('Failed to create mock test');
    } finally {
      setLoading(false);
    }
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
          background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
          color: 'white'
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          🎯 Create Mock Test
        </Typography>
        <Typography variant="subtitle1" sx={{ textAlign: 'center', mt: 1, opacity: 0.9 }}>
          Design comprehensive mock tests for exam preparation
        </Typography>
      </Paper>

      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          {/* Coming Soon Notice */}
          <Box sx={{ mb: 4, p: 3, bgcolor: 'info.light', borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: 'info.dark', mb: 1 }}>
              🚧 Feature Under Development
            </Typography>
            <Typography variant="body2" sx={{ color: 'info.dark' }}>
              The mock test creation feature is currently being developed.
              For now, you can create individual MCQ questions using the "Create Post" feature.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Paper elevation={1} sx={{ p: 3, borderRadius: 2, bgcolor: 'grey.50' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                  📝 Test Information
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Test Title *"
                      placeholder="Enter mock test title (e.g., JEE Main Mock Test - Physics)"
                      value={testData.title}
                      onChange={(e) => setTestData(prev => ({ ...prev, title: e.target.value }))}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Description"
                      placeholder="Describe the mock test, its scope, and target audience..."
                      value={testData.description}
                      onChange={(e) => setTestData(prev => ({ ...prev, description: e.target.value }))}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Subject *</InputLabel>
                      <Select
                        value={testData.subject}
                        label="Subject *"
                        onChange={(e) => setTestData(prev => ({ ...prev, subject: e.target.value }))}
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
                    <FormControl fullWidth>
                      <InputLabel>Exam Type *</InputLabel>
                      <Select
                        value={testData.examType}
                        label="Exam Type *"
                        onChange={(e) => setTestData(prev => ({ ...prev, examType: e.target.value }))}
                      >
                        {examTypes.map(exam => (
                          <MenuItem key={exam} value={exam}>
                            {exam.replace('_', ' ')}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Test Configuration */}
            <Grid item xs={12}>
              <Paper elevation={1} sx={{ p: 3, borderRadius: 2, bgcolor: 'grey.50' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                  ⚙️ Test Configuration
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Duration (minutes)"
                      value={testData.duration}
                      onChange={(e) => setTestData(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                      InputProps={{
                        startAdornment: <Timer sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Total Questions"
                      value={testData.totalQuestions}
                      onChange={(e) => setTestData(prev => ({ ...prev, totalQuestions: parseInt(e.target.value) || 10 }))}
                      InputProps={{
                        startAdornment: <Quiz sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel>Difficulty Level</InputLabel>
                      <Select
                        value={testData.difficultyLevel}
                        label="Difficulty Level"
                        onChange={(e) => setTestData(prev => ({ ...prev, difficultyLevel: e.target.value }))}
                      >
                        <MenuItem value="EASY">🟢 Easy</MenuItem>
                        <MenuItem value="MEDIUM">🟡 Medium</MenuItem>
                        <MenuItem value="HARD">🔴 Hard</MenuItem>
                        <MenuItem value="MIXED">🎯 Mixed</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Test Instructions"
                      placeholder="Enter instructions for test takers (e.g., marking scheme, negative marking, etc.)"
                      value={testData.instructions}
                      onChange={(e) => setTestData(prev => ({ ...prev, instructions: e.target.value }))}
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
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<School />}
                label="Feature Coming Soon"
                color="info"
                variant="outlined"
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                onClick={() => navigate('/dashboard')}
                variant="outlined"
                sx={{ textTransform: 'none', px: 3 }}
              >
                Back to Dashboard
              </Button>
              <Button
                onClick={() => navigate('/create-post')}
                variant="contained"
                sx={{
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
                  px: 4
                }}
                startIcon={<Add />}
              >
                Create MCQ Question Instead
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default CreateMockTest;
