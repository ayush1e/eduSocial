import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Fab,
  Skeleton,
  Alert,
  CircularProgress,
  Paper,
  Divider
} from '@mui/material';
import {
  Search,
  FilterList,
  Add,
  TrendingUp,
  Group,
  Psychology,
  School,
  Refresh,
  AutoAwesome,
  EmojiEvents,
  BarChart
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { socialService } from '../services/apiService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import EnhancedMcqCard from '../components/EnhancedMcqCard';
import InfiniteScroll from 'react-infinite-scroll-component';

// Enhanced Social Feed Component
const EnhancedSocialFeed = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State management
  const [posts, setPosts] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [feedType, setFeedType] = useState(0); // 0: All, 1: Following, 2: Trending, 3: Personalized

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [examTypeFilter, setExamTypeFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Statistics
  const [stats, setStats] = useState({
    totalAnswered: 0,
    correctAnswers: 0,
    streakCount: 0,
    pointsEarned: 0
  });

  // Constants
  const subjects = [
    'MATHEMATICS', 'PHYSICS', 'CHEMISTRY', 'BIOLOGY', 'ENGLISH',
    'HISTORY', 'GEOGRAPHY', 'ECONOMICS', 'COMPUTER_SCIENCE', 'GENERAL_KNOWLEDGE'
  ];

  const examTypes = [
    'JEE_MAIN', 'JEE_ADVANCED', 'NEET', 'GATE', 'CAT', 'UPSC_CIVIL_SERVICES',
    'SSC_CGL', 'IBPS_PO', 'SBI_PO', 'RRB_NTPC'
  ];

  // Feed type configurations
  const feedTypes = [
    { label: 'All Posts', icon: <School />, value: 'all' },
    { label: 'Following', icon: <Group />, value: 'following' },
    { label: 'Trending', icon: <TrendingUp />, value: 'trending' },
    { label: 'AI Recommended', icon: <AutoAwesome />, value: 'personalized' }
  ];

  // Load posts based on feed type
  const loadPosts = useCallback(async (pageNum = 0, resetPosts = false) => {
    try {
      setLoading(pageNum === 0);

      const feedConfig = {
        page: pageNum,
        size: 10,
        userId: user?.id,
        subject: subjectFilter || undefined,
        difficulty: difficultyFilter || undefined,
        examType: examTypeFilter || undefined,
        search: searchQuery || undefined
      };

      let response;
      switch (feedTypes[feedType].value) {
        case 'following':
          response = await socialService.getFollowingFeed(feedConfig);
          break;
        case 'trending':
          response = await socialService.getTrendingFeed(feedConfig);
          break;
        case 'personalized':
          response = await socialService.getPersonalizedFeed(feedConfig);
          break;
        default:
          response = await socialService.getFeed(feedConfig);
      }

      const newPosts = response.content || [];

      if (resetPosts || pageNum === 0) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }

      setHasMore(!response.last && newPosts.length > 0);
      setPage(pageNum);

      // Load user answers for new posts
      await loadUserAnswers(newPosts);

    } catch (error) {
      console.error('Failed to load posts:', error);
      toast.error('Failed to load feed');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [feedType, subjectFilter, difficultyFilter, examTypeFilter, searchQuery, user?.id]);

  // Load user's previous answers
  const loadUserAnswers = async (postsToCheck) => {
    if (!user?.id) return;

    try {
      const answersToLoad = [];
      postsToCheck.forEach(post => {
        if (post.questions) {
          post.questions.forEach(question => {
            answersToLoad.push({
              postId: post.id,
              questionId: question.id
            });
          });
        }
      });

      const answerPromises = answersToLoad.map(async ({ postId, questionId }) => {
        try {
          const answer = await socialService.getUserAnswerForQuestion(questionId, user.id);
          return {
            key: `${postId}_${questionId}`,
            answer: answer.hasAnswered ? answer : null
          };
        } catch (error) {
          return { key: `${postId}_${questionId}`, answer: null };
        }
      });

      const results = await Promise.all(answerPromises);
      const newAnswers = {};
      results.forEach(({ key, answer }) => {
        if (answer) newAnswers[key] = answer;
      });

      setUserAnswers(prev => ({ ...prev, ...newAnswers }));
    } catch (error) {
      console.error('Failed to load user answers:', error);
    }
  };

  // Handle answer submission
  const handleAnswerSubmit = async (postId, questionId, selectedOption, timeSpent) => {
    if (!user?.id) {
      toast.error('Please login to answer questions');
      return;
    }

    const answerKey = `${postId}_${questionId}`;

    try {
      const result = await socialService.submitQuestionAnswer(questionId, user.id, selectedOption);

      const answerData = {
        selectedOption,
        isCorrect: result.isCorrect,
        correctAnswer: result.correctAnswer,
        explanation: result.explanation,
        timeSpent,
        submittedAt: new Date().toISOString()
      };

      setUserAnswers(prev => ({
        ...prev,
        [answerKey]: answerData
      }));

      // Update statistics
      setStats(prev => ({
        ...prev,
        totalAnswered: prev.totalAnswered + 1,
        correctAnswers: result.isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
        pointsEarned: prev.pointsEarned + (result.isCorrect ? 1 : 0),
        streakCount: result.isCorrect ? prev.streakCount + 1 : 0
      }));

      if (result.isCorrect) {
        toast.success('🎉 Correct! +1 point');
      } else {
        toast.error(`❌ Incorrect. Correct answer: ${result.correctAnswer}`);
      }

    } catch (error) {
      console.error('Failed to submit answer:', error);
      toast.error('Failed to submit answer');
      throw error;
    }
  };

  // Handle social interactions
  const handleInteraction = async (postId, type) => {
    if (!user?.id) {
      toast.error('Please login to interact with posts');
      return;
    }

    try {
      switch (type) {
        case 'like':
          await socialService.togglePostLike(postId, user.id);
          setPosts(prev => prev.map(post =>
            post.id === postId
              ? {
                ...post,
                isLiked: !post.isLiked,
                likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1
              }
              : post
          ));
          break;
        case 'bookmark':
          await socialService.togglePostBookmark(postId, user.id);
          setPosts(prev => prev.map(post =>
            post.id === postId
              ? { ...post, isBookmarked: !post.isBookmarked }
              : post
          ));
          break;
        case 'comment':
          // TODO: Implement comment modal
          toast.info('Comments feature coming soon!');
          break;
      }
    } catch (error) {
      console.error('Failed to interact with post:', error);
      toast.error('Failed to update post');
    }
  };

  // Handle feed type change
  const handleFeedTypeChange = (event, newValue) => {
    setFeedType(newValue);
    setPage(0);
    setPosts([]);
    setLoading(true);
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    setPage(0);
    setPosts([]);
    loadPosts(0, true);
  };

  // Handle load more
  const loadMorePosts = () => {
    if (!loading && hasMore) {
      loadPosts(page + 1);
    }
  };

  // Apply filters
  const applyFilters = () => {
    setPage(0);
    setPosts([]);
    setLoading(true);
    loadPosts(0, true);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setSubjectFilter('');
    setDifficultyFilter('');
    setExamTypeFilter('');
    setPage(0);
    setPosts([]);
    setLoading(true);
    loadPosts(0, true);
  };

  // Initial load
  useEffect(() => {
    if (user) {
      loadPosts(0, true);
    }
  }, [loadPosts, user]);

  // Computed values
  const accuracy = stats.totalAnswered > 0 ? (stats.correctAnswers / stats.totalAnswered * 100).toFixed(1) : 0;

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      {/* Header with Stats */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" fontWeight="bold">
            📚 MCQ Practice Feed
          </Typography>
          <Button
            variant="outlined"
            onClick={handleRefresh}
            disabled={refreshing}
            startIcon={refreshing ? <CircularProgress size={20} /> : <Refresh />}
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </Box>

        {/* User Statistics */}
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="primary">{stats.totalAnswered}</Typography>
              <Typography variant="caption">Questions Answered</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="success.main">{accuracy}%</Typography>
              <Typography variant="caption">Accuracy</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="warning.main">{stats.streakCount}</Typography>
              <Typography variant="caption">Current Streak</Typography>
            </Box>
          </Grid>
           
        </Grid>
      </Paper>

      {/* Feed Type Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={feedType}
          onChange={handleFeedTypeChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {feedTypes.map((type, index) => (
            <Tab
              key={index}
              icon={type.icon}
              label={type.label}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Card>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                )
              }}
              sx={{ flexGrow: 1, minWidth: 300 }}
            />
            <Button
              variant="outlined"
              onClick={() => setShowFilters(!showFilters)}
              startIcon={<FilterList />}
            >
              Filters
            </Button>
            <Button
              variant="contained"
              onClick={applyFilters}
              disabled={loading}
            >
              Apply
            </Button>
          </Box>

          {/* Advanced Filters */}
          {showFilters && (
            <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Subject</InputLabel>
                    <Select
                      value={subjectFilter}
                      onChange={(e) => setSubjectFilter(e.target.value)}
                    >
                      <MenuItem value="">All Subjects</MenuItem>
                      {subjects.map(subject => (
                        <MenuItem key={subject} value={subject}>
                          {subject.replace('_', ' ')}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Difficulty</InputLabel>
                    <Select
                      value={difficultyFilter}
                      onChange={(e) => setDifficultyFilter(e.target.value)}
                    >
                      <MenuItem value="">All Difficulties</MenuItem>
                      <MenuItem value="EASY">Easy</MenuItem>
                      <MenuItem value="MEDIUM">Medium</MenuItem>
                      <MenuItem value="HARD">Hard</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Exam Type</InputLabel>
                    <Select
                      value={examTypeFilter}
                      onChange={(e) => setExamTypeFilter(e.target.value)}
                    >
                      <MenuItem value="">All Exams</MenuItem>
                      {examTypes.map(exam => (
                        <MenuItem key={exam} value={exam}>
                          {exam.replace('_', ' ')}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={clearFilters} color="secondary">
                  Clear All Filters
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <InfiniteScroll
        dataLength={posts.length}
        next={loadMorePosts}
        hasMore={hasMore}
        loader={
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress />
          </Box>
        }
        endMessage={
          <Paper sx={{ p: 2, textAlign: 'center', mt: 2 }}>
            <Typography color="text.secondary">
              {posts.length === 0 ? 'No questions found' : 'You\'ve reached the end!'}
            </Typography>
          </Paper>
        }
      >
        {loading && posts.length === 0 ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} sx={{ mb: 3 }}>
              <CardContent>
                <Skeleton variant="text" width="60%" height={40} />
                <Skeleton variant="rectangular" width="100%" height={200} sx={{ my: 2 }} />
                <Skeleton variant="text" width="80%" />
              </CardContent>
            </Card>
          ))
        ) : (
          posts.map((post) => (
            <EnhancedMcqCard
              key={post.id}
              post={post}
              userAnswers={userAnswers}
              onAnswerSubmit={handleAnswerSubmit}
              onInteraction={handleInteraction}
            />
          ))
        )}
      </InfiniteScroll>

      {/* Create Post FAB */}
      <Fab
        color="primary"
        onClick={() => navigate('/create-post')}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <Add />
      </Fab>
    </Container>
  );
};

export default EnhancedSocialFeed;
