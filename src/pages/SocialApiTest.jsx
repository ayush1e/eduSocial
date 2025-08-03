import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  TextField,
  Card,
  CardContent,
  Divider,
  Chip,
  Alert
} from '@mui/material';
import { socialService } from '../services/apiService';
import { toast } from 'react-toastify';

const SocialApiTest = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState({});
  const [testData, setTestData] = useState({
    userId: '1',
    postId: '1',
    questionId: '1',
    selectedOption: 'A'
  });

  const runTest = async (testName, testFunction) => {
    setLoading(prev => ({ ...prev, [testName]: true }));
    try {
      const result = await testFunction();
      setTestResults(prev => ({
        ...prev,
        [testName]: { success: true, data: result, error: null }
      }));
      toast.success(`${testName} - SUCCESS`);
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [testName]: { success: false, data: null, error: error.message }
      }));
      toast.error(`${testName} - FAILED: ${error.message}`);
    } finally {
      setLoading(prev => ({ ...prev, [testName]: false }));
    }
  };

  const tests = [
    {
      name: 'Get Feed',
      description: 'Test general feed endpoint',
      action: () => runTest('getFeed', () => socialService.getFeed(0, 5))
    },
    {
      name: 'Get Trending Feed',
      description: 'Test trending feed endpoint',
      action: () => runTest('getTrendingFeed', () => socialService.getTrendingFeed(0, 5, testData.userId))
    },
    {
      name: 'Get Following Feed',
      description: 'Test following feed endpoint',
      action: () => runTest('getFollowingFeed', () => socialService.getFollowingFeed(testData.userId, 0, 5))
    },
    {
      name: 'Get Personalized Feed',
      description: 'Test personalized feed endpoint',
      action: () => runTest('getPersonalizedFeed', () => socialService.getPersonalizedFeed(testData.userId, 0, 5))
    },
    {
      name: 'Search Posts',
      description: 'Test post search endpoint',
      action: () => runTest('searchPosts', () => socialService.searchPosts('test', 0, 5, testData.userId))
    },
    {
      name: 'Get User Profile',
      description: 'Test user profile endpoint',
      action: () => runTest('getUserProfile', () => socialService.getUserProfile(testData.userId))
    },
    {
      name: 'Get User Posts',
      description: 'Test user posts endpoint',
      action: () => runTest('getUserPosts', () => socialService.getUserPosts(testData.userId, 0, 5))
    },
    {
      name: 'Get Top Users',
      description: 'Test top users endpoint',
      action: () => runTest('getTopUsers', () => socialService.getTopUsers(0, 5))
    },
    {
      name: 'Search Users',
      description: 'Test user search endpoint',
      action: () => runTest('searchUsers', () => socialService.searchUsers('test', 0, 5))
    },
    {
      name: 'Get User Status',
      description: 'Test user status endpoint',
      action: () => runTest('getUserStatus', () => socialService.getUserStatus(testData.userId))
    },
    {
      name: 'Get User Analytics',
      description: 'Test user analytics endpoint',
      action: () => runTest('getUserAnalytics', () => socialService.getUserAnalytics(testData.userId))
    },
    {
      name: 'Get User Revenue',
      description: 'Test user revenue endpoint',
      action: () => runTest('getUserRevenue', () => socialService.getUserRevenue(testData.userId))
    },
    {
      name: 'Get Post Analytics',
      description: 'Test post analytics endpoint',
      action: () => runTest('getPostAnalytics', () => socialService.getPostAnalytics(testData.postId))
    },
    {
      name: 'Submit Question Answer',
      description: 'Test question answer submission',
      action: () => runTest('submitQuestionAnswer', () =>
        socialService.submitQuestionAnswer(testData.questionId, testData.userId, testData.selectedOption))
    },
    {
      name: 'Get User Answer',
      description: 'Test get user answer for question',
      action: () => runTest('getUserAnswer', () =>
        socialService.getUserAnswerForQuestion(testData.questionId, testData.userId))
    },
    {
      name: 'Generate Questions',
      description: 'Test question generation',
      action: () => runTest('generateQuestions', () =>
        socialService.generateSocialQuestions('COMPUTER_SCIENCE', 'GENERAL', 'MEDIUM', 3))
    }
  ];

  const renderTestResult = (testName, result) => {
    if (!result) return null;

    return (
      <Alert
        severity={result.success ? 'success' : 'error'}
        sx={{ mt: 1, mb: 1 }}
      >
        <Typography variant="subtitle2" fontWeight="bold">
          {testName} - {result.success ? 'SUCCESS' : 'FAILED'}
        </Typography>
        {result.error && (
          <Typography variant="body2" color="error">
            Error: {result.error}
          </Typography>
        )}
        {result.data && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Response: {JSON.stringify(result.data, null, 2).substring(0, 200)}...
          </Typography>
        )}
      </Alert>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          🧪 Social Media API Test Suite
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" sx={{ mb: 4 }}>
          Test all SocialMediaController endpoints to ensure proper integration
        </Typography>

        {/* Test Configuration */}
        <Paper elevation={1} sx={{ p: 3, mb: 4, backgroundColor: 'grey.50' }}>
          <Typography variant="h6" gutterBottom>
            Test Configuration
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <TextField
                label="User ID"
                value={testData.userId}
                onChange={(e) => setTestData(prev => ({ ...prev, userId: e.target.value }))}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Post ID"
                value={testData.postId}
                onChange={(e) => setTestData(prev => ({ ...prev, postId: e.target.value }))}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Question ID"
                value={testData.questionId}
                onChange={(e) => setTestData(prev => ({ ...prev, questionId: e.target.value }))}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Selected Option"
                value={testData.selectedOption}
                onChange={(e) => setTestData(prev => ({ ...prev, selectedOption: e.target.value }))}
                size="small"
                fullWidth
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Test Buttons */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {tests.map((test, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {test.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    {test.description}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={test.action}
                    disabled={loading[test.name.replace(/\s+/g, '')]}
                    fullWidth
                    sx={{ textTransform: 'none' }}
                  >
                    {loading[test.name.replace(/\s+/g, '')] ? 'Testing...' : 'Run Test'}
                  </Button>
                  {renderTestResult(test.name.replace(/\s+/g, ''), testResults[test.name.replace(/\s+/g, '')])}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Run All Tests */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={async () => {
              for (const test of tests) {
                await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between tests
                await test.action();
              }
            }}
            sx={{
              textTransform: 'none',
              px: 4,
              py: 1.5
            }}
          >
            🚀 Run All Tests
          </Button>
        </Box>

        {/* Summary */}
        <Paper elevation={1} sx={{ p: 3, mt: 4, backgroundColor: 'primary.50' }}>
          <Typography variant="h6" gutterBottom>
            Test Summary
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              label={`Total Tests: ${tests.length}`}
              color="info"
            />
            <Chip
              label={`Passed: ${Object.values(testResults).filter(r => r.success).length}`}
              color="success"
            />
            <Chip
              label={`Failed: ${Object.values(testResults).filter(r => !r.success).length}`}
              color="error"
            />
          </Box>
        </Paper>
      </Paper>
    </Container>
  );
};

export default SocialApiTest;
