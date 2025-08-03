import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Card,
  CardContent,
  CardActions,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
  Switch,
  FormControlLabel,
  Avatar,
  Divider
} from '@mui/material';
import {
  AutoAwesome,
  Quiz,
  Analytics,
  School,
  Edit,
  Translate,
  Psychology,
  TrendingUp,
  Chat,
  ExpandMore,
  ContentCopy,
  Download,
  Share,
  Lightbulb,
  BookmarkBorder,
  Speed,
  Assessment,
  Timeline,
  GroupWork
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { geminiService } from '../services/geminiService';
import { toast } from 'react-toastify';

const AIAssistant = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  // Question Generation State
  const [questionConfig, setQuestionConfig] = useState({
    topic: '',
    count: 10,
    difficulty: 'MEDIUM',
    examType: 'GENERAL'
  });

  // Text Analysis State
  const [textAnalysis, setTextAnalysis] = useState({
    text: '',
    analysisType: 'COMPREHENSIVE'
  });

  // Content Generation State
  const [contentGeneration, setContentGeneration] = useState({
    subject: '',
    examType: '',
    duration: 30,
    level: 'INTERMEDIATE'
  });

  // Performance Analysis State
  const [performanceData, setPerformanceData] = useState({
    userAnswers: [],
    questions: []
  });

  // Conversational AI State
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your AI assistant. How can I help you today?' }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');

  const tabData = [
    { label: 'Question Generation', icon: <Quiz /> },
    { label: 'Text Analysis', icon: <Analytics /> },
    { label: 'Study Plans', icon: <School /> },
    { label: 'Content Enhancement', icon: <Edit /> },
    { label: 'Performance Analysis', icon: <TrendingUp /> },
    { label: 'AI Chat', icon: <Chat /> }
  ];

  const subjects = [
    'MATHEMATICS', 'PHYSICS', 'CHEMISTRY', 'BIOLOGY', 'ENGLISH',
    'HISTORY', 'GEOGRAPHY', 'ECONOMICS', 'COMPUTER_SCIENCE', 'GENERAL_KNOWLEDGE'
  ];

  const examTypes = [
    'JEE_MAIN', 'JEE_ADVANCED', 'NEET', 'GATE', 'CAT', 'UPSC',
    'SSC', 'BANK_PO', 'RAILWAYS', 'NDA', 'CDS', 'AFCAT', 'GENERAL'
  ];

  const difficultyLevels = ['EASY', 'MEDIUM', 'HARD'];
  const analysisTypes = ['GRAMMAR', 'READABILITY', 'SENTIMENT', 'COMPREHENSIVE'];
  const levelTypes = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

  // Question Generation Functions
  const handleGenerateQuestions = async () => {
    if (!questionConfig.topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const questions = await geminiService.generateQuestionsFromTopic(
        questionConfig.topic,
        questionConfig.count,
        questionConfig.difficulty
      );
      setResults({ type: 'questions', data: questions });
      toast.success(`Generated ${questions.length} questions successfully!`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFromSubject = async () => {
    if (!questionConfig.topic) {
      toast.error('Please select a subject');
      return;
    }

    setLoading(true);
    try {
      const questions = await geminiService.generateQuestionsFromSubject(
        questionConfig.topic,
        questionConfig.examType,
        questionConfig.count,
        questionConfig.difficulty
      );
      setResults({ type: 'questions', data: questions });
      toast.success(`Generated ${questions.length} subject-based questions!`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Text Analysis Functions
  const handleAnalyzeText = async () => {
    if (!textAnalysis.text.trim()) {
      toast.error('Please enter text to analyze');
      return;
    }

    setLoading(true);
    try {
      const analysis = await geminiService.analyzeText(
        textAnalysis.text,
        textAnalysis.analysisType
      );
      setResults({ type: 'analysis', data: analysis });
      toast.success('Text analysis completed!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckGrammar = async () => {
    if (!textAnalysis.text.trim()) {
      toast.error('Please enter text to check');
      return;
    }

    setLoading(true);
    try {
      const grammarCheck = await geminiService.checkGrammar(textAnalysis.text);
      setResults({ type: 'grammar', data: grammarCheck });
      toast.success('Grammar check completed!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Study Plan Functions
  const handleGenerateStudyPlan = async () => {
    if (!contentGeneration.subject || !contentGeneration.examType) {
      toast.error('Please select subject and exam type');
      return;
    }

    setLoading(true);
    try {
      const studyPlan = await geminiService.generateStudyPlan(
        contentGeneration.subject,
        contentGeneration.examType,
        contentGeneration.duration,
        contentGeneration.level
      );
      setResults({ type: 'studyPlan', data: studyPlan });
      toast.success('Study plan generated successfully!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Content Enhancement Functions
  const handleSummarizeText = async () => {
    if (!textAnalysis.text.trim()) {
      toast.error('Please enter text to summarize');
      return;
    }

    setLoading(true);
    try {
      const summary = await geminiService.summarizeText(textAnalysis.text, 'CONCISE', 200);
      setResults({ type: 'summary', data: summary });
      toast.success('Text summarized successfully!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateKeyPoints = async () => {
    if (!textAnalysis.text.trim()) {
      toast.error('Please enter text to extract key points');
      return;
    }

    setLoading(true);
    try {
      const keyPoints = await geminiService.generateKeyPoints(textAnalysis.text, 5);
      setResults({ type: 'keyPoints', data: keyPoints });
      toast.success('Key points extracted successfully!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Chat Functions
  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage = { role: 'user', content: currentMessage };
    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setLoading(true);

    try {
      const response = await geminiService.conversationalAI(
        currentMessage,
        chatMessages.slice(-5),
        user?.id
      );

      const assistantMessage = { role: 'assistant', content: response.message };
      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast.error(error.message);
      const errorMessage = { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Render Functions
  const renderQuestionGeneration = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Lightbulb color="primary" />
              Topic-Based Generation
            </Typography>

            <TextField
              fullWidth
              label="Topic"
              value={questionConfig.topic}
              onChange={(e) => setQuestionConfig(prev => ({ ...prev, topic: e.target.value }))}
              placeholder="e.g., Thermodynamics, Data Structures"
              sx={{ mb: 2 }}
            />

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Number of Questions"
                  type="number"
                  value={questionConfig.count}
                  onChange={(e) => setQuestionConfig(prev => ({ ...prev, count: parseInt(e.target.value) }))}
                  inputProps={{ min: 1, max: 20 }}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    value={questionConfig.difficulty}
                    label="Difficulty"
                    onChange={(e) => setQuestionConfig(prev => ({ ...prev, difficulty: e.target.value }))}
                  >
                    {difficultyLevels.map(level => (
                      <MenuItem key={level} value={level}>{level}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              onClick={handleGenerateQuestions}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <AutoAwesome />}
              sx={{ textTransform: 'none' }}
            >
              Generate Questions
            </Button>
          </CardActions>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <School color="primary" />
              Subject-Based Generation
            </Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Subject</InputLabel>
              <Select
                value={questionConfig.topic}
                label="Subject"
                onChange={(e) => setQuestionConfig(prev => ({ ...prev, topic: e.target.value }))}
              >
                {subjects.map(subject => (
                  <MenuItem key={subject} value={subject}>
                    {subject.replace('_', ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Exam Type</InputLabel>
              <Select
                value={questionConfig.examType}
                label="Exam Type"
                onChange={(e) => setQuestionConfig(prev => ({ ...prev, examType: e.target.value }))}
              >
                {examTypes.map(exam => (
                  <MenuItem key={exam} value={exam}>
                    {exam.replace('_', ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              onClick={handleGenerateFromSubject}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <AutoAwesome />}
              sx={{ textTransform: 'none' }}
            >
              Generate by Subject
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );

  const renderTextAnalysis = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Text Input</Typography>
            <TextField
              fullWidth
              multiline
              rows={8}
              label="Enter text to analyze"
              value={textAnalysis.text}
              onChange={(e) => setTextAnalysis(prev => ({ ...prev, text: e.target.value }))}
              placeholder="Paste your text here for analysis..."
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Analysis Options</Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Analysis Type</InputLabel>
              <Select
                value={textAnalysis.analysisType}
                label="Analysis Type"
                onChange={(e) => setTextAnalysis(prev => ({ ...prev, analysisType: e.target.value }))}
              >
                {analysisTypes.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="contained"
                onClick={handleAnalyzeText}
                disabled={loading}
                startIcon={<Analytics />}
                sx={{ textTransform: 'none' }}
              >
                Analyze Text
              </Button>

              <Button
                variant="outlined"
                onClick={handleCheckGrammar}
                disabled={loading}
                startIcon={<Edit />}
                sx={{ textTransform: 'none' }}
              >
                Check Grammar
              </Button>

              <Button
                variant="outlined"
                onClick={handleSummarizeText}
                disabled={loading}
                startIcon={<ContentCopy />}
                sx={{ textTransform: 'none' }}
              >
                Summarize
              </Button>

              <Button
                variant="outlined"
                onClick={handleGenerateKeyPoints}
                disabled={loading}
                startIcon={<Lightbulb />}
                sx={{ textTransform: 'none' }}
              >
                Extract Key Points
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderStudyPlans = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Study Plan Configuration</Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Subject</InputLabel>
              <Select
                value={contentGeneration.subject}
                label="Subject"
                onChange={(e) => setContentGeneration(prev => ({ ...prev, subject: e.target.value }))}
              >
                {subjects.map(subject => (
                  <MenuItem key={subject} value={subject}>
                    {subject.replace('_', ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Target Exam</InputLabel>
              <Select
                value={contentGeneration.examType}
                label="Target Exam"
                onChange={(e) => setContentGeneration(prev => ({ ...prev, examType: e.target.value }))}
              >
                {examTypes.map(exam => (
                  <MenuItem key={exam} value={exam}>
                    {exam.replace('_', ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Level</InputLabel>
              <Select
                value={contentGeneration.level}
                label="Level"
                onChange={(e) => setContentGeneration(prev => ({ ...prev, level: e.target.value }))}
              >
                {levelTypes.map(level => (
                  <MenuItem key={level} value={level}>{level}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography gutterBottom>Study Duration: {contentGeneration.duration} days</Typography>
            <Slider
              value={contentGeneration.duration}
              onChange={(e, newValue) => setContentGeneration(prev => ({ ...prev, duration: newValue }))}
              min={7}
              max={365}
              valueLabelDisplay="auto"
              sx={{ mb: 2 }}
            />
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              onClick={handleGenerateStudyPlan}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Timeline />}
              sx={{ textTransform: 'none' }}
            >
              Generate Study Plan
            </Button>
          </CardActions>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Additional Features</Typography>

            <List>
              <ListItem>
                <ListItemIcon><BookmarkBorder /></ListItemIcon>
                <ListItemText
                  primary="Personalized Content"
                  secondary="AI-generated content based on your learning style"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><Speed /></ListItemIcon>
                <ListItemText
                  primary="Adaptive Learning"
                  secondary="Plans that adapt to your progress"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><Assessment /></ListItemIcon>
                <ListItemText
                  primary="Performance Tracking"
                  secondary="Monitor your learning progress"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><GroupWork /></ListItemIcon>
                <ListItemText
                  primary="Collaborative Study"
                  secondary="Study with peers and discussion groups"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderAIChat = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card elevation={2} sx={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flexGrow: 1, overflow: 'auto', maxHeight: '500px' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>AI Assistant Chat</Typography>

            <Box sx={{ height: '400px', overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
              {chatMessages.map((message, index) => (
                <Box key={index} sx={{ mb: 2, display: 'flex', gap: 1 }}>
                  <Avatar sx={{
                    bgcolor: message.role === 'user' ? 'primary.main' : 'secondary.main',
                    width: 32,
                    height: 32
                  }}>
                    {message.role === 'user' ? user?.username?.[0]?.toUpperCase() : 'AI'}
                  </Avatar>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      maxWidth: '80%',
                      bgcolor: message.role === 'user' ? 'primary.50' : 'grey.50'
                    }}
                  >
                    <Typography variant="body2">{message.content}</Typography>
                  </Paper>
                </Box>
              ))}
              {loading && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>AI</Avatar>
                  <CircularProgress size={20} />
                  <Typography variant="body2" color="text.secondary">AI is thinking...</Typography>
                </Box>
              )}
            </Box>
          </CardContent>

          <CardActions sx={{ p: 2 }}>
            <TextField
              fullWidth
              placeholder="Ask me anything about studies, questions, or get help..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              disabled={loading}
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={loading || !currentMessage.trim()}
              sx={{ ml: 1, textTransform: 'none' }}
            >
              Send
            </Button>
          </CardActions>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>AI Capabilities</Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><Quiz /></ListItemIcon>
                <ListItemText primary="Question Generation" secondary="Create custom questions" />
              </ListItem>
              <ListItem>
                <ListItemIcon><School /></ListItemIcon>
                <ListItemText primary="Study Planning" secondary="Personalized study schedules" />
              </ListItem>
              <ListItem>
                <ListItemIcon><Analytics /></ListItemIcon>
                <ListItemText primary="Performance Analysis" secondary="Track your progress" />
              </ListItem>
              <ListItem>
                <ListItemIcon><Edit /></ListItemIcon>
                <ListItemText primary="Content Enhancement" secondary="Improve your writing" />
              </ListItem>
              <ListItem>
                <ListItemIcon><Psychology /></ListItemIcon>
                <ListItemText primary="Learning Insights" secondary="Understand your learning style" />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderResults = () => {
    if (!results) return null;

    return (
      <Card elevation={2} sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Results</Typography>

          {results.type === 'questions' && (
            <Box>
              <Alert severity="success" sx={{ mb: 2 }}>
                Generated {results.data.length} questions successfully!
              </Alert>
              {results.data.map((question, index) => (
                <Accordion key={index}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography>Q{index + 1}: {question.questionText.substring(0, 80)}...</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box>
                      <Typography variant="body1" sx={{ mb: 2 }}>{question.questionText}</Typography>
                      <Grid container spacing={1}>
                        {['A', 'B', 'C', 'D'].map((option, optIndex) => (
                          <Grid item xs={12} sm={6} key={option}>
                            <Paper
                              elevation={1}
                              sx={{
                                p: 1,
                                bgcolor: option === question.correctAnswer ? 'success.50' : 'background.default'
                              }}
                            >
                              <Typography variant="body2">
                                {option}. {question[`option${optIndex + 1}`]}
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

          {results.type === 'analysis' && (
            <Box>
              <Alert severity="info" sx={{ mb: 2 }}>Analysis completed successfully!</Alert>
              <Typography variant="body1">{JSON.stringify(results.data, null, 2)}</Typography>
            </Box>
          )}

          {results.type === 'studyPlan' && (
            <Box>
              <Alert severity="success" sx={{ mb: 2 }}>Study plan generated successfully!</Alert>
              <Typography variant="body1" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                {typeof results.data === 'string' ? results.data : JSON.stringify(results.data, null, 2)}
              </Typography>
            </Box>
          )}

          {(results.type === 'summary' || results.type === 'keyPoints') && (
            <Box>
              <Alert severity="success" sx={{ mb: 2 }}>
                {results.type === 'summary' ? 'Text summarized' : 'Key points extracted'} successfully!
              </Alert>
              <Typography variant="body1">
                {typeof results.data === 'string' ? results.data : JSON.stringify(results.data, null, 2)}
              </Typography>
            </Box>
          )}
        </CardContent>
        <CardActions>
          <Button startIcon={<ContentCopy />} onClick={() => navigator.clipboard.writeText(JSON.stringify(results.data))}>
            Copy Results
          </Button>
          <Button startIcon={<Share />}>Share</Button>
        </CardActions>
      </Card>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AutoAwesome sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              AI Assistant
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Powered by Advanced AI - Your Personal Learning Companion
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Tabs */}
      <Paper elevation={1} sx={{ mb: 3, borderRadius: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ p: 1 }}
        >
          {tabData.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
              sx={{ textTransform: 'none', minHeight: 64 }}
            />
          ))}
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box>
        {activeTab === 0 && renderQuestionGeneration()}
        {activeTab === 1 && renderTextAnalysis()}
        {activeTab === 2 && renderStudyPlans()}
        {activeTab === 3 && renderTextAnalysis()} {/* Content Enhancement uses same text input */}
        {activeTab === 4 && (
          <Alert severity="info">
            Performance Analysis features will be available after completing some tests.
          </Alert>
        )}
        {activeTab === 5 && renderAIChat()}
      </Box>

      {/* Results */}
      {renderResults()}
    </Container>
  );
};

export default AIAssistant;
