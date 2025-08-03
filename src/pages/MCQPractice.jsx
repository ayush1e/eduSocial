import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress,
  Chip,
  Radio,
  RadioGroup,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper
} from '@mui/material';
import { Quiz, CheckCircle, Cancel } from '@mui/icons-material';
import { mcqService } from '../services/apiService';

const MCQPractice = () => {
  const [section, setSection] = useState('');
  const [count, setCount] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const [examType, setExamType] = useState('');

  const sections = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'General Knowledge',
    'English',
    'History',
    'Geography'
  ];

  const difficultyLevels = [
    'Easy',
    'Medium',
    'Hard'
  ];

  const examTypes = [
    'Mock Test',
    'Previous Year',
    'Sample Paper'
  ];

  // Helper: get token from localStorage
  const getAuthToken = () => localStorage.getItem('authToken');

  const handleGenerateQuestions = async () => {
    if (!section) {
      setError('Please select a section (subject).');
      return;
    }
    if (!difficultyLevel) {
      setError('Please select a difficulty level.');
      return;
    }
    if (!examType) {
      setError('Please select an exam type.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Pass token in headers if required by backend
      const response = await mcqService.generateQuestions(
        section,
        count,
        difficultyLevel,
        examType,
        getAuthToken && getAuthToken()
      );
      const questionsArr = Array.isArray(response)
        ? response
        : response.questions || [];
      if (!questionsArr.length) {
        setError('No questions found for this selection.');
        setQuestions([]);
        return;
      }
      setQuestions(questionsArr);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setShowResults(false);
    } catch (error) {
      // Handle 403 and show login message
      if (error.response?.status === 403) {
        setError('You are not authorized. Please login again.');
      } else {
        setError(error.response?.data?.message || error.message || 'Failed to generate questions');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, selectedOption) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: selectedOption
    });
  };

  const handleSubmitAnswers = async () => {
    try {
      setLoading(true);

      // Submit each answer individually as per backend API
      const submissionPromises = questions.map(async (question, index) => {
        const selectedOption = selectedAnswers[index];
        if (selectedOption) {
          try {
            await mcqService.submitAnswer(
              {
                questionId: question.id,
                selectedOption: selectedOption
              },
              getAuthToken && getAuthToken()
            );
            return {
              questionId: question.id,
              selectedOption: selectedOption,
              isCorrect: selectedOption === question.correctAnswer
            };
          } catch (error) {
            return null;
          }
        }
        return null;
      });

      const submittedAnswers = await Promise.all(submissionPromises);
      const validAnswers = submittedAnswers.filter(answer => answer !== null);

      // Calculate local results
      const correctCount = validAnswers.filter(answer => answer.isCorrect).length;
      const totalCount = validAnswers.length;
      const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

      setResults({
        correct: correctCount,
        total: totalCount,
        percentage: percentage,
        answers: validAnswers
      });

      setShowResults(true);
    } catch (error) {
      if (error.response?.status === 403) {
        setError('You are not authorized. Please login again.');
      } else {
        setError(error.message || 'Failed to submit answers');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleStartNew = () => {
    setQuestions([]);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setResults(null);
    setSection('');
    setCount(5);
    setDifficultyLevel('');
    setExamType('');
    setError('');
  };

  const calculateScore = () => {
    const answeredQuestions = Object.keys(selectedAnswers).length;
    const correct = questions.filter((question, index) =>
      selectedAnswers[index] === question.correctAnswer
    ).length;
    return {
      correct,
      total: answeredQuestions,
      totalQuestions: questions.length,
      percentage: answeredQuestions > 0 ? Math.round((correct / answeredQuestions) * 100) : 0
    };
  };
  const currentQuestion = questions[currentQuestionIndex];
  const score = calculateScore();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        MCQ Practice
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {questions.length === 0 ? (
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Quiz sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Start Your MCQ Practice
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Select a section and number of questions to begin practicing
              </Typography>
            </Box>

            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Select Section</InputLabel>
                  <Select
                    value={section}
                    label="Select Section"
                    onChange={(e) => setSection(e.target.value)}
                  >
                    {sections.map((sec) => (
                      <MenuItem key={sec} value={sec}>
                        {sec}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Number of Questions</InputLabel>
                  <Select
                    value={count}
                    label="Number of Questions"
                    onChange={(e) => setCount(e.target.value)}
                  >
                    {[5, 10, 15, 20].map((num) => (
                      <MenuItem key={num} value={num}>
                        {num} Questions
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Difficulty Level</InputLabel>
                  <Select
                    value={difficultyLevel}
                    label="Difficulty Level"
                    onChange={(e) => setDifficultyLevel(e.target.value)}
                  >
                    {difficultyLevels.map((level) => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Exam Type</InputLabel>
                  <Select
                    value={examType}
                    label="Exam Type"
                    onChange={(e) => setExamType(e.target.value)}
                  >
                    {examTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleGenerateQuestions}
                  disabled={loading}
                  sx={{ mt: 2, px: 4 }}
                >
                  {loading ? 'Generating Questions...' : 'Start Practice'}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {/* Progress Bar */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6">Progress</Typography>
                <Typography variant="body2">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(currentQuestionIndex + 1) / questions.length * 100}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Paper>
          </Grid>

          {/* Current Question */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Question {currentQuestionIndex + 1}
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem' }}>
                  {currentQuestion?.question}
                </Typography>

                <FormControl component="fieldset">
                  <RadioGroup
                    value={selectedAnswers[currentQuestionIndex] || ''}
                    onChange={(e) => handleAnswerSelect(currentQuestionIndex, e.target.value)}
                  >
                    {currentQuestion?.options?.map((option, index) => (
                      <FormControlLabel
                        key={index}
                        value={option}
                        control={<Radio />}
                        label={option}
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    variant="outlined"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={currentQuestionIndex === questions.length - 1}
                    variant="contained"
                  >
                    Next
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Question Navigation & Summary */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Question Summary
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Section: {section}
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" gutterBottom>
                    Answered: {Object.keys(selectedAnswers).length} / {questions.length}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Object.keys(selectedAnswers).length / questions.length * 100}
                    color="success"
                  />
                </Box>

                <Grid container spacing={1} sx={{ mb: 3 }}>
                  {questions.map((_, index) => (
                    <Grid item key={index}>
                      <Chip
                        label={index + 1}
                        size="small"
                        color={selectedAnswers[index] ? 'success' : 'default'}
                        variant={index === currentQuestionIndex ? 'filled' : 'outlined'}
                        onClick={() => setCurrentQuestionIndex(index)}
                        sx={{ cursor: 'pointer' }}
                      />
                    </Grid>
                  ))}
                </Grid>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSubmitAnswers}
                  color="success"
                  disabled={Object.keys(selectedAnswers).length === 0}
                >
                  Submit Answers
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Results Dialog */}
      <Dialog open={showResults} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Quiz Results
            </Typography>
            <Typography variant="h3" color="primary">
              {score.percentage}%
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              You scored {score.correct} out of {score.total} questions correctly!
            </Typography>
            <Chip
              icon={score.percentage >= 70 ? <CheckCircle /> : <Cancel />}
              label={score.percentage >= 70 ? 'Great Job!' : 'Keep Practicing!'}
              color={score.percentage >= 70 ? 'success' : 'error'}
              sx={{ mt: 1 }}
            />
          </Box>

          <Typography variant="h6" gutterBottom>
            Question Review:
          </Typography>
          {questions.map((question, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Q{index + 1}: {question.question}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Chip
                  label={`Your Answer: ${selectedAnswers[index] || 'Not answered'}`}
                  color={selectedAnswers[index] === question.correctAnswer ? 'success' : 'error'}
                  size="small"
                />
                <Chip
                  label={`Correct: ${question.correctAnswer}`}
                  color="success"
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Paper>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStartNew} variant="contained" color="primary">
            Start New Practice
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MCQPractice;