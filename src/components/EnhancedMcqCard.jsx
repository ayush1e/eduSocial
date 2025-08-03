import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Avatar,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Paper,
  LinearProgress,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Tooltip,
  Collapse,
  Alert,
  Stack,
  Badge,
  Skeleton
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Comment,
  Share,
  Bookmark,
  BookmarkBorder,
  QuestionAnswer,
  TrendingUp,
  CheckCircle,
  Cancel,
  Timer,
  Psychology,
  School,
  ExpandMore,
  ExpandLess,
  Lightbulb,
  EmojiEvents,
  BarChart
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { socialService } from '../services/apiService';
import { toast } from 'react-toastify';

// Enhanced MCQ Question Card with better UX
const EnhancedMcqCard = ({ post, onAnswerSubmit, userAnswers, onInteraction }) => {
  const { user } = useAuth();
  const [selectedOption, setSelectedOption] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());

  // Get user's answer for this question
  const question = post.questions && post.questions[0];
  const userAnswer = userAnswers[`${post.id}_${question?.id}`];
  const hasAnswered = !!userAnswer;

  useEffect(() => {
    if (!hasAnswered) {
      const timer = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [hasAnswered, startTime]);

  const handleOptionSelect = (event) => {
    if (hasAnswered) return;
    setSelectedOption(event.target.value);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedOption) {
      toast.error('Please select an answer');
      return;
    }

    setSubmitting(true);
    try {
      await onAnswerSubmit(post.id, question.id, selectedOption, timeSpent);
      setShowExplanation(true);
    } catch (error) {
      toast.error('Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  const getOptionColor = (optionKey) => {
    if (!hasAnswered) {
      return selectedOption === optionKey ? 'primary' : 'default';
    }

    // Show correct/incorrect after answering
    if (optionKey === userAnswer.correctAnswer) {
      return 'success';
    }
    if (optionKey === userAnswer.selectedOption && !userAnswer.isCorrect) {
      return 'error';
    }
    return 'default';
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'EASY': return 'success';
      case 'MEDIUM': return 'warning';
      case 'HARD': return 'error';
      default: return 'default';
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!question) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography color="error">No question data available</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      elevation={hasAnswered ? 1 : 3}
      sx={{
        mb: 3,
        borderRadius: 3,
        border: hasAnswered ? '2px solid #4caf50' : '2px solid transparent',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Post Header */}
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar src={post.author?.profilePicture} sx={{ width: 48, height: 48 }}>
              {post.author?.username?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {post.author?.username}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(post.createdAt).toLocaleDateString()} • {post.subject}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip
              label={post.difficultyLevel}
              color={getDifficultyColor(post.difficultyLevel)}
              size="small"
              icon={<Psychology />}
            />
            <Chip
              label={post.examType}
              variant="outlined"
              size="small"
              icon={<School />}
            />
          </Box>
        </Box>

        {/* Question */}
        <Paper
          elevation={1}
          sx={{
            p: 3,
            mb: 2,
            bgcolor: hasAnswered ? 'rgba(76, 175, 80, 0.05)' : 'rgba(103, 126, 234, 0.05)',
            borderRadius: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ flex: 1, fontWeight: 600 }}>
              {question.questionText}
            </Typography>
            {!hasAnswered && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 80 }}>
                <Timer fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">
                  {formatTime(timeSpent)}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Answer Options */}
          <FormControl component="fieldset" fullWidth disabled={hasAnswered}>
            <RadioGroup value={selectedOption} onChange={handleOptionSelect}>
              {[
                { key: 'A', text: question.optionA },
                { key: 'B', text: question.optionB },
                { key: 'C', text: question.optionC },
                { key: 'D', text: question.optionD }
              ].map((option) => (
                <FormControlLabel
                  key={option.key}
                  value={option.key}
                  control={<Radio color={getOptionColor(option.key)} />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                      <Typography sx={{ flex: 1 }}>
                        <strong>{option.key}.</strong> {option.text}
                      </Typography>
                      {hasAnswered && option.key === userAnswer.correctAnswer && (
                        <CheckCircle color="success" fontSize="small" />
                      )}
                      {hasAnswered && option.key === userAnswer.selectedOption && !userAnswer.isCorrect && (
                        <Cancel color="error" fontSize="small" />
                      )}
                    </Box>
                  }
                  sx={{
                    margin: 0.5,
                    padding: 1,
                    borderRadius: 1,
                    border: hasAnswered && option.key === userAnswer.correctAnswer ? '2px solid #4caf50' :
                      hasAnswered && option.key === userAnswer.selectedOption && !userAnswer.isCorrect ? '2px solid #f44336' :
                        '1px solid transparent',
                    bgcolor: hasAnswered && option.key === userAnswer.correctAnswer ? 'rgba(76, 175, 80, 0.1)' :
                      hasAnswered && option.key === userAnswer.selectedOption && !userAnswer.isCorrect ? 'rgba(244, 67, 54, 0.1)' :
                        'transparent',
                    '&:hover': {
                      bgcolor: hasAnswered ? undefined : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>

          {/* Submit Button */}
          {!hasAnswered && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                onClick={handleSubmitAnswer}
                disabled={!selectedOption || submitting}
                startIcon={submitting ? <CircularProgress size={20} /> : <QuestionAnswer />}
                sx={{
                  minWidth: 200,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Answer'}
              </Button>
            </Box>
          )}

          {/* Results Display */}
          {hasAnswered && (
            <Box sx={{ mt: 2 }}>
              <Alert
                severity={userAnswer.isCorrect ? 'success' : 'error'}
                icon={userAnswer.isCorrect ? <EmojiEvents /> : <Psychology />}
                sx={{ borderRadius: 2 }}
              >
                <Typography variant="subtitle2" fontWeight="bold">
                  {userAnswer.isCorrect ?
                    '🎉 Correct! Well done!' :
                    `❌ Incorrect. The correct answer is ${userAnswer.correctAnswer}`
                  }
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  Time taken: {formatTime(userAnswer.timeSpent || 0)} •
                  Points earned: {userAnswer.isCorrect ? question.points || 1 : 0}
                </Typography>
              </Alert>

              {/* Explanation Toggle */}
              {question.explanation && (
                <Box sx={{ mt: 2 }}>
                  <Button
                    onClick={() => setShowExplanation(!showExplanation)}
                    startIcon={<Lightbulb />}
                    endIcon={showExplanation ? <ExpandLess /> : <ExpandMore />}
                    variant="outlined"
                    size="small"
                  >
                    {showExplanation ? 'Hide' : 'Show'} Explanation
                  </Button>

                  <Collapse in={showExplanation}>
                    <Paper elevation={0} sx={{ mt: 2, p: 2, bgcolor: 'rgba(103, 126, 234, 0.05)' }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>💡 Explanation:</strong> {question.explanation}
                      </Typography>
                    </Paper>
                  </Collapse>
                </Box>
              )}
            </Box>
          )}
        </Paper>
      </CardContent>

      {/* Social Actions */}
      <CardActions sx={{ px: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={() => onInteraction(post.id, 'like')}
              color={post.isLiked ? 'error' : 'default'}
            >
              {post.isLiked ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
              {post.likesCount || 0}
            </Typography>

            <IconButton onClick={() => onInteraction(post.id, 'comment')}>
              <Comment />
            </IconButton>
            <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
              {post.commentsCount || 0}
            </Typography>

            <IconButton
              onClick={() => onInteraction(post.id, 'bookmark')}
              color={post.isBookmarked ? 'primary' : 'default'}
            >
              {post.isBookmarked ? <Bookmark /> : <BookmarkBorder />}
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BarChart fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              {post.totalAttempts || 0} attempts
            </Typography>
          </Box>
        </Box>
      </CardActions>
    </Card>
  );
};

export default EnhancedMcqCard;
