import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Paper,
  LinearProgress,
  Chip,
  IconButton,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Quiz,
  People,
  
  TrendingUp,
  Settings,
  Add,
  Favorite,
  
  PhotoCamera,
  Timeline,
  EmojiEvents,
  AutoAwesome,
   
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { mcqService, socialService } from '../services/apiService';
import ConnectionTestDialog from '../components/ConnectionTestDialog';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    accuracy: 0,
    totalPosts: 0,
    followers: 0,
    following: 0
  });
  const [loading, setLoading] = useState(true);
  const [connectionTestOpen, setConnectionTestOpen] = useState(false);
  const [recentActivity, setRecentActivity] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load user progress and social stats
      const [progressData] = await Promise.allSettled([
        mcqService.getProgress(),
      ]);

      if (progressData.status === 'fulfilled') {
        setStats(prev => ({
          ...prev,
          ...progressData.value
        }));
      }

      // Load recent activity
      setRecentActivity([
        { id: 1, type: 'mcq', content: 'Completed Physics Quiz #12', time: '2 hours ago', score: 85 },
        { id: 2, type: 'social', content: 'Liked a post by @student123', time: '4 hours ago' },
        { id: 3, type: 'achievement', content: 'Earned "Quick Learner" badge', time: '1 day ago' },
        { id: 4, type: 'mcq', content: 'Attempted Chemistry Practice Test', time: '2 days ago', score: 92 }
      ]);

      // Load suggestions
      setSuggestions([
        { id: 1, username: 'physics_expert', avatar: 'https://i.pravatar.cc/40?img=1', mutual: 3 },
        { id: 2, username: 'chem_master', avatar: 'https://i.pravatar.cc/40?img=2', mutual: 7 },
        { id: 3, username: 'math_genius', avatar: 'https://i.pravatar.cc/40?img=3', mutual: 2 }
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Practice MCQs',
      description: 'Start practicing multiple choice questions',
      icon: <Quiz />,
      color: 'primary',
      action: () => navigate('/mcq')
    },
    {
      title: 'Social Feed',
      description: 'Check out posts from the community',
      icon: <People />,
      color: 'secondary',
      action: () => navigate('/social')
    },
    {
      title: 'Create Post',
      description: 'Share your thoughts and MCQ questions',
      icon: <Add />,
      color: 'success',
      action: () => navigate('/create-post')
    },
    {
      title: 'AI Questions',
      description: 'Generate questions using AI',
      icon: <AutoAwesome />,
      color: 'error',
      action: () => navigate('/generate-questions')
    },
    {
      title: 'Leaderboard',
      description: 'See how you rank against others',
      icon: <TrendingUp />,
      color: 'warning',
      action: () => navigate('/leaderboard')
    }
  ];

  const progressCards = [
    {
      title: 'Questions Attempted',
      value: stats.totalQuestions || 0,
      color: 'primary'
    },
    {
      title: 'Correct Answers',
      value: stats.correctAnswers || 0,
      color: 'success'
    },
    {
      title: 'Accuracy Rate',
      value: `${stats.accuracy || 0}%`,
      color: 'info'
    },
    {
      title: 'Followers',
      value: stats.followers || 0,
      color: 'secondary'
    }
  ];

  if (loading) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <LinearProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Welcome Section with Instagram-like Header */}
      <Paper sx={{
        p: 4,
        mb: 4,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{ position: 'absolute', top: 0, right: 0, opacity: 0.1 }}>
          <PhotoCamera sx={{ fontSize: 200 }} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              src={user?.profilePicture}
              sx={{
                width: 80,
                height: 80,
                border: '4px solid rgba(255,255,255,0.3)',
                fontSize: 30
              }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h4" color="white" gutterBottom fontWeight="bold">
                Welcome back, {user?.username}!
              </Typography>
              <Typography variant="h6" color="white" sx={{ opacity: 0.9, mb: 1 }}>
                Ready to continue your learning journey?
              </Typography>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="white" fontWeight="bold">
                    {stats.totalQuestions || 42}
                  </Typography>
                  <Typography variant="caption" color="white" sx={{ opacity: 0.8 }}>
                    Questions
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="white" fontWeight="bold">
                    {stats.followers || 156}
                  </Typography>
                  <Typography variant="caption" color="white" sx={{ opacity: 0.8 }}>
                    Followers
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="white" fontWeight="bold">
                    {stats.following || 89}
                  </Typography>
                  <Typography variant="caption" color="white" sx={{ opacity: 0.8 }}>
                    Following
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          <IconButton
            onClick={() => setConnectionTestOpen(true)}
            sx={{
              color: 'white',
              opacity: 0.8,
              bgcolor: 'rgba(255,255,255,0.1)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
            }}
            title="Test Backend Connection"
          >
            <Settings />
          </IconButton>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          {/* Progress Overview */}
          <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
            Your Progress
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {progressCards.map((card, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{
                  height: '100%',
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${card.color === 'primary' ? '#0e86e8ff' : card.color === 'success' ? '#4CAF50' : card.color === 'info' ? '#00BCD4' : '#9C27B0'} 0%, rgba(255,255,255,0.1) 100%)`,
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <CardContent sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <Box sx={{ position: 'absolute', top: -10, right: -10, opacity: 0.2 }}>
                      {index === 0 && <Quiz sx={{ fontSize: 60 }} />}
                      {index === 1 && <EmojiEvents sx={{ fontSize: 60 }} />}
                      {index === 2 && <Timeline sx={{ fontSize: 60 }} />}
                      {index === 3 && <People sx={{ fontSize: 60 }} />}
                    </Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                      {card.value}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {card.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Quick Actions */}
          <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
            Quick Actions
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {quickActions.map((action, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    borderRadius: 3,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6
                    }
                  }}
                  onClick={action.action}
                >
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Box sx={{
                      color: `${action.color}.main`,
                      mb: 2,
                      p: 2,
                      borderRadius: '50%',
                      bgcolor: `${action.color}.50`,
                      display: 'inline-flex'
                    }}>
                      {React.cloneElement(action.icon, { sx: { fontSize: 40 } })}
                    </Box>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      {action.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {action.description}
                    </Typography>
                    <Button
                      variant="contained"
                      color={action.color}
                      size="small"
                      sx={{ borderRadius: 5, textTransform: 'none', fontWeight: 'bold' }}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Recent Activity */}
          <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
            Recent Activity
          </Typography>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              {recentActivity.length > 0 ? (
                <Box>
                  {recentActivity.map((activity, index) => (
                    <Box key={activity.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
                        <Avatar sx={{
                          bgcolor: activity.type === 'mcq' ? 'primary.main' : activity.type === 'social' ? 'secondary.main' : 'success.main',
                          width: 40,
                          height: 40
                        }}>
                          {activity.type === 'mcq' && <Quiz />}
                          {activity.type === 'social' && <Favorite />}
                          {activity.type === 'achievement' && <EmojiEvents />}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1">
                            {activity.content}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {activity.time}
                          </Typography>
                        </Box>
                        {activity.score && (
                          <Chip
                            label={`${activity.score}%`}
                            color={activity.score >= 80 ? 'success' : activity.score >= 60 ? 'warning' : 'error'}
                            size="small"
                          />
                        )}
                      </Box>
                      {index < recentActivity.length - 1 && <Divider />}
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No recent activity
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Start practicing MCQs or engage with the community to see your activity here.
                  </Typography>
                  <Button variant="contained" onClick={() => navigate('/mcq')} sx={{ borderRadius: 5 }}>
                    Start Practicing
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Suggestions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Suggestions for you
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Based on your interests
              </Typography>

              {suggestions.map((suggestion) => (
                <Box key={suggestion.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={suggestion.avatar} sx={{ width: 40, height: 40 }} />
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {suggestion.username}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {suggestion.mutual} mutual connections
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{
                      borderRadius: 5,
                      textTransform: 'none',
                      minWidth: 'auto',
                      px: 2
                    }}
                  >
                    Follow
                  </Button>
                </Box>
              ))}

              <Button
                fullWidth
                variant="text"
                sx={{ mt: 2, textTransform: 'none', borderRadius: 5 }}
                onClick={() => navigate('/social')}
              >
                See All Suggestions
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Quick Stats
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Learning Streak</Typography>
                  <Typography variant="body2" fontWeight="bold">7 days 🔥</Typography>
                </Box>
                <LinearProgress variant="determinate" value={70} sx={{ borderRadius: 1 }} />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">This Week</Typography>
                  <Typography variant="body2" fontWeight="bold">12 questions</Typography>
                </Box>
                <LinearProgress variant="determinate" value={60} color="secondary" sx={{ borderRadius: 1 }} />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Accuracy</Typography>
                  <Typography variant="body2" fontWeight="bold">{stats.accuracy || 85}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={stats.accuracy || 85} color="success" sx={{ borderRadius: 1 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Connection Test Dialog */}
      <ConnectionTestDialog
        open={connectionTestOpen}
        onClose={() => setConnectionTestOpen(false)}
      />
    </Container>
  );
};

export default Dashboard;
