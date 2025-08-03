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
  CircularProgress,
  Alert,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  AutoAwesome,
  Psychology,
  School,
  Quiz,
  ExpandMore,
  Refresh,
  Download,
  Share,
  BookmarkAdd,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { socialService } from '../services/apiService';
import { geminiService } from '../services/geminiService';
import { toast } from 'react-toastify';

const GenerateQuestionAI = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [questionData, setQuestionData] = useState({
    subject: '',
    examType: '',
    difficultyLevel: 'MEDIUM',
    count: 5,
    section: '',
    customTopic: ''
  });
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  // Constants
  const subjects = [
    'MATHEMATICS', 'PHYSICS', 'CHEMISTRY', 'BIOLOGY', 'ENGLISH',
    'HISTORY', 'GEOGRAPHY', 'ECONOMICS', 'COMPUTER_SCIENCE', 'GENERAL_KNOWLEDGE'
  ];

  const examTypes = [
    'JEE_MAIN', 'JEE_ADVANCED', 'NEET', 'GATE', 'CAT', 'UPSC',
    'SSC', 'BANK_PO', 'RAILWAYS', 'NDA', 'CDS', 'AFCAT'
  ];

  const difficultyLevels = ['EASY', 'MEDIUM', 'HARD'];

  const sections = [
    'Programming', 'Quantitative Aptitude', 'English Language',
    'General Awareness', 'Science', 'Banking', 'Reasoning'
  ];

  const handleGenerateQuestions = async () => {
    if (!questionData.subject && !questionData.section && !questionData.customTopic) {
      toast.error('Please select a subject, section, or enter a custom topic');
      return;
    }

    setGenerating(true);
    try {
      let questions;

      if (questionData.customTopic) {
        // Generate from custom topic
        questions = await geminiService.generateQuestionsFromTopic(
          questionData.customTopic,
          questionData.count,
          questionData.difficultyLevel
        );
      } else if (questionData.section) {
        // Generate from section
        questions = await geminiService.generateQuestions(
          questionData.section,
          questionData.count
        );
      } else {
        // Generate from subject and exam type
        const section = convertSubjectToSection(questionData.subject);
        questions = await geminiService.generateQuestions(
          section,
          questionData.count
        );
      }

      setGeneratedQuestions(questions);
      setSelectedQuestions(questions.map((_, index) => index)); // Select all by default
      toast.success(`Generated ${questions.length} questions successfully!`);
    } catch (error) {
      console.error('Failed to generate questions:', error);
      toast.error(error.message || 'Failed to generate questions');
    } finally {
      setGenerating(false);
    }
  };

  const handleAnalyzeText = async (text) => {
    if (!text.trim()) {
      toast.error('Please enter text to analyze');
      return;
    }

    setLoading(true);
    try {
      const analysis = await geminiService.analyzeText(text);
      toast.success('Text analyzed successfully!');
      // You can display the analysis in a dialog or separate section
      console.log('Analysis:', analysis);
    } catch (error) {
      console.error('Failed to analyze text:', error);
      toast.error(error.message || 'Failed to analyze text');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStudyPlan = async () => {
    if (!questionData.subject || !questionData.examType) {
      toast.error('Please select subject and exam type for study plan');
      return;
    }

    setLoading(true);
    try {
      const studyPlan = await geminiService.createStudyPlan(
        questionData.subject,
        questionData.examType,
        30 // 30 days plan
      );
      toast.success('Study plan created successfully!');
      // You can display the study plan in a dialog or navigate to a new page
      console.log('Study Plan:', studyPlan);
    } catch (error) {
      console.error('Failed to create study plan:', error);
      toast.error(error.message || 'Failed to create study plan');
    } finally {
      setLoading(false);
    }
  };

  const handlePostToSocial = async () => {
    if (selectedQuestions.length === 0) {
      toast.error('Please select at least one question to post');
      return;
    }

    setLoading(true);
    try {
      const questionsToPost = selectedQuestions.map(index => generatedQuestions[index]);

      const questionContent = `🤖 **AI Generated Questions** - ${questionData.subject || questionData.section}\n\n` +
        questionsToPost.map((q, index) =>
          `**Q${index + 1}:** ${q.questionText}\n` +
          `A) ${q.option1}\n` +
          `B) ${q.option2}\n` +
          `C) ${q.option3}\n` +
          `D) ${q.option4}\n` +
          `**Answer:** ${q.correctAnswer}\n` +
          (q.explanation ? `**Explanation:** ${q.explanation}\n` : '') +
          '\n---\n'
        ).join('\n');

      const postData = {
        content: questionContent,
        type: 'QUESTION',
        subject: questionData.subject,
        examType: questionData.examType,
        questions: questionsToPost
      };

      await socialService.createPost(postData);
      toast.success('Questions posted to social feed!');
    } catch (error) {
      console.error('Failed to post questions:', error);
      toast.error(error.message || 'Failed to post questions');
    } finally {
      setLoading(false);
    }
  };

  const convertSubjectToSection = (subject) => {
    switch (subject.toUpperCase()) {
      case 'COMPUTER_SCIENCE':
        return 'Programming';
      case 'MATHEMATICS':
        return 'Quantitative Aptitude';
      case 'ENGLISH':
        return 'English Language';
      case 'GENERAL_KNOWLEDGE':
        return 'General Awareness';
      case 'PHYSICS':
      case 'CHEMISTRY':
      case 'BIOLOGY':
        return 'Science';
      case 'ECONOMICS':
        return 'Banking';
      default:
        return 'Programming';
    }
  };

  const toggleQuestionSelection = (index) => {
    setSelectedQuestions(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <AutoAwesome sx={{ fontSize: 40 }} />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              AI Question Generator
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Generate smart questions powered by Gemini AI
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Configuration Panel */}
        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{ borderRadius: 3, height: 'fit-content' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Psychology color="primary" />
                Generation Settings
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Subject</InputLabel>
                    <Select
                      value={questionData.subject}
                      label="Subject"
                      onChange={(e) => setQuestionData(prev => ({ ...prev, subject: e.target.value }))}
                    >
                      <MenuItem value="">None</MenuItem>
                      {subjects.map(subject => (
                        <MenuItem key={subject} value={subject}>
                          {subject.replace('_', ' ')}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Section</InputLabel>
                    <Select
                      value={questionData.section}
                      label="Section"
                      onChange={(e) => setQuestionData(prev => ({ ...prev, section: e.target.value }))}
                    >
                      <MenuItem value="">None</MenuItem>
                      {sections.map(section => (
                        <MenuItem key={section} value={section}>
                          {section}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Custom Topic (Optional)"
                    value={questionData.customTopic}
                    onChange={(e) => setQuestionData(prev => ({ ...prev, customTopic: e.target.value }))}
                    placeholder="e.g., React Hooks, Data Structures, etc."
                    multiline
                    rows={2}
                  />
                </Grid>

                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Difficulty</InputLabel>
                    <Select
                      value={questionData.difficultyLevel}
                      label="Difficulty"
                      onChange={(e) => setQuestionData(prev => ({ ...prev, difficultyLevel: e.target.value }))}
                    >
                      {difficultyLevels.map(level => (
                        <MenuItem key={level} value={level}>
                          {level}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Count"
                    type="number"
                    value={questionData.count}
                    onChange={(e) => setQuestionData(prev => ({
                      ...prev,
                      count: Math.min(Math.max(1, parseInt(e.target.value) || 1), 20)
                    }))}
                    inputProps={{ min: 1, max: 20 }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Exam Type (Optional)</InputLabel>
                    <Select
                      value={questionData.examType}
                      label="Exam Type (Optional)"
                      onChange={(e) => setQuestionData(prev => ({ ...prev, examType: e.target.value }))}
                    >
                      <MenuItem value="">None</MenuItem>
                      {examTypes.map(exam => (
                        <MenuItem key={exam} value={exam}>
                          {exam.replace('_', ' ')}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={generating ? <CircularProgress size={20} /> : <AutoAwesome />}
                  onClick={handleGenerateQuestions}
                  disabled={generating}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    textTransform: 'none'
                  }}
                >
                  {generating ? 'Generating...' : 'Generate Questions'}
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<School />}
                  onClick={handleCreateStudyPlan}
                  disabled={loading}
                  sx={{ textTransform: 'none' }}
                >
                  Create Study Plan
                </Button>
              </Box>

              {/* AI Features */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                  🤖 AI Features
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Smart Question Generation"
                      secondary="AI creates contextual MCQs"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Text Analysis"
                      secondary="Analyze study materials"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Study Plan Creation"
                      secondary="Personalized learning paths"
                    />
                  </ListItem>
                </List>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Generated Questions */}
        <Grid item xs={12} md={8}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Quiz color="primary" />
                  Generated Questions ({generatedQuestions.length})
                </Typography>

                {generatedQuestions.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Select All">
                      <IconButton
                        onClick={() => setSelectedQuestions(generatedQuestions.map((_, i) => i))}
                        color="primary"
                      >
                        <CheckCircle />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Deselect All">
                      <IconButton
                        onClick={() => setSelectedQuestions([])}
                        color="secondary"
                      >
                        <Cancel />
                      </IconButton>
                    </Tooltip>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<Share />}
                      onClick={handlePostToSocial}
                      disabled={loading || selectedQuestions.length === 0}
                      sx={{ textTransform: 'none' }}
                    >
                      Post to Social
                    </Button>
                  </Box>
                )}
              </Box>

              {generatedQuestions.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                  <AutoAwesome sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    No questions generated yet
                  </Typography>
                  <Typography variant="body2">
                    Configure your settings and click "Generate Questions" to get started
                  </Typography>
                </Box>
              ) : (
                <Box>
                  {/* Selection Summary */}
                  <Alert
                    severity="info"
                    sx={{ mb: 3 }}
                    action={
                      <Chip
                        label={`${selectedQuestions.length}/${generatedQuestions.length} selected`}
                        size="small"
                        color="primary"
                      />
                    }
                  >
                    Select questions you want to use or post to social feed
                  </Alert>

                  {/* Questions List */}
                  {generatedQuestions.map((question, index) => (
                    <Accordion
                      key={index}
                      expanded={selectedQuestions.includes(index)}
                      onChange={() => toggleQuestionSelection(index)}
                      sx={{
                        mb: 2,
                        border: selectedQuestions.includes(index) ? '2px solid' : '1px solid',
                        borderColor: selectedQuestions.includes(index) ? 'primary.main' : 'divider',
                        borderRadius: 2,
                        '&:before': { display: 'none' }
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                        sx={{
                          backgroundColor: selectedQuestions.includes(index) ? 'primary.50' : 'background.default',
                          borderRadius: 2
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                          <Chip
                            label={`Q${index + 1}`}
                            color={selectedQuestions.includes(index) ? 'primary' : 'default'}
                            size="small"
                          />
                          {question.difficultyLevel && (
                            <Chip
                              label={question.difficultyLevel}
                              size="small"
                              color={
                                question.difficultyLevel === 'EASY' ? 'success' :
                                  question.difficultyLevel === 'MEDIUM' ? 'warning' : 'error'
                              }
                              variant="outlined"
                            />
                          )}
                          <Typography
                            variant="subtitle2"
                            sx={{
                              flexGrow: 1,
                              fontWeight: selectedQuestions.includes(index) ? 'bold' : 'normal'
                            }}
                          >
                            {question.questionText.substring(0, 80)}
                            {question.questionText.length > 80 && '...'}
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ p: 2 }}>
                          <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                            {question.questionText}
                          </Typography>

                          <Grid container spacing={1} sx={{ mb: 2 }}>
                            {[
                              { key: 'A', text: question.option1 },
                              { key: 'B', text: question.option2 },
                              { key: 'C', text: question.option3 },
                              { key: 'D', text: question.option4 }
                            ].map((option) => (
                              <Grid item xs={12} sm={6} key={option.key}>
                                <Paper
                                  elevation={1}
                                  sx={{
                                    p: 2,
                                    backgroundColor: option.key === question.correctAnswer ? 'success.50' : 'background.default',
                                    border: option.key === question.correctAnswer ? '2px solid' : '1px solid',
                                    borderColor: option.key === question.correctAnswer ? 'success.main' : 'divider'
                                  }}
                                >
                                  <Typography variant="body2">
                                    <strong>{option.key}.</strong> {option.text}
                                    {option.key === question.correctAnswer && (
                                      <Chip label="Correct" size="small" color="success" sx={{ ml: 1 }} />
                                    )}
                                  </Typography>
                                </Paper>
                              </Grid>
                            ))}
                          </Grid>

                          {question.explanation && (
                            <Alert severity="info" sx={{ mt: 2 }}>
                              <Typography variant="body2">
                                <strong>Explanation:</strong> {question.explanation}
                              </Typography>
                            </Alert>
                          )}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default GenerateQuestionAI;
