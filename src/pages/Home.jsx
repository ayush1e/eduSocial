import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  Avatar,
  Chip,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  QuizRounded,
  PeopleRounded,
  TrendingUpRounded,
  SchoolRounded,
  LoginRounded,
  PersonAddRounded,
  CheckCircleRounded,
  StarRounded,
  ExploreRounded,
  ArrowForwardRounded
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import EduSocialLogo from '../components/EduSocialLogo';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <QuizRounded sx={{ fontSize: 40 }} />,
      title: "Practice MCQs",
      description: "Access thousands of multiple choice questions across various subjects and exam types with detailed explanations.",
      color: "#2196F3"
    },
    {
      icon: <PeopleRounded sx={{ fontSize: 40 }} />,
      title: "Social Learning",
      description: "Connect with fellow learners, share questions, and learn together in our vibrant community.",
      color: "#4CAF50"
    },
    {
      icon: <TrendingUpRounded sx={{ fontSize: 40 }} />,
      title: "Track Progress",
      description: "Monitor your learning journey with detailed analytics and performance insights.",
      color: "#FF9800"
    },
    {
      icon: <SchoolRounded sx={{ fontSize: 40 }} />,
      title: "Expert Content",
      description: "Quality questions created by experts with comprehensive explanations for better understanding.",
      color: "#9C27B0"
    }
  ];

  const stats = [
    { label: "Active Learners", value: "10K+", icon: <PeopleRounded />, color: "#2196F3" },
    { label: "MCQ Questions", value: "50K+", icon: <QuizRounded />, color: "#4CAF50" },
    { label: "Success Rate", value: "95%", icon: <CheckCircleRounded />, color: "#FF9800" },
    { label: "User Rating", value: "4.8★", icon: <StarRounded />, color: "#FFD700" }
  ];

  const testimonials = [
    {
      name: "Alex Kumar",
      role: "JEE Aspirant",
      message: "EduSocial helped me improve my Physics scores by 40%. The community support is amazing!",
      avatar: "A"
    },
    {
      name: "Priya Singh",
      role: "NEET Student",
      message: "Best platform for MCQ practice. The explanations are detailed and easy to understand.",
      avatar: "P"
    },
    {
      name: "Rahul Sharma",
      role: "Engineering Student",
      message: "Love the social aspect! Learning with friends makes it so much more engaging.",
      avatar: "R"
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Navigation Header */}
      <Paper elevation={0} sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 0
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            py: 2 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }}
                 onClick={() => navigate('/')}>
              <EduSocialLogo size="medium" variant="white" showText />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<ExploreRounded />}
                onClick={() => navigate('/explore')}
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Explore Feed
              </Button>
              <Button
                variant="outlined"
                startIcon={<LoginRounded />}
                onClick={() => navigate('/login')}
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                startIcon={<PersonAddRounded />}
                onClick={() => navigate('/register')}
                sx={{
                  backgroundColor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.9)'
                  }
                }}
              >
                Sign Up
              </Button>
            </Box>
          </Box>
        </Container>
      </Paper>

      {/* Hero Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: { xs: 6, md: 10 }
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ color: 'white', textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant={isMobile ? "h3" : "h2"} component="h1" gutterBottom sx={{ 
                  fontWeight: 'bold',
                  mb: 3,
                  background: 'linear-gradient(45deg, #fff, #f0f0f0)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Master Your Skills with
                  <Box component="span" sx={{ 
                    display: 'block',
                    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    Smart MCQ Practice
                  </Box>
                </Typography>
                
                <Typography variant={isMobile ? "body1" : "h6"} gutterBottom sx={{ 
                  opacity: 0.9, 
                  mb: 4,
                  lineHeight: 1.6,
                  maxWidth: 500
                }}>
                  Join thousands of learners practicing MCQs, sharing knowledge, and achieving their goals together in our interactive learning community.
                </Typography>

                <Box sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  mb: 4,
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'stretch', sm: 'center' }
                }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<PersonAddRounded />}
                    endIcon={<ArrowForwardRounded />}
                    onClick={() => navigate('/register')}
                    sx={{
                      py: 1.5,
                      px: 4,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      backgroundColor: 'white',
                      color: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Get Started Free
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<ExploreRounded />}
                    onClick={() => navigate('/explore')}
                    sx={{
                      py: 1.5,
                      px: 4,
                      fontSize: '1.1rem',
                      color: 'white',
                      borderColor: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Explore Questions
                  </Button>
                </Box>

                {/* Stats */}
                <Grid container spacing={2}>
                  {stats.map((stat, index) => (
                    <Grid item xs={6} sm={3} key={index}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Box sx={{ color: stat.color, mb: 1 }}>
                          {stat.icon}
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.8rem' }}>
                          {stat.label}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', display: { xs: 'none', md: 'block' } }}>
                {/* Mock Question Card */}
                <Card elevation={10} sx={{ 
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                  transform: 'rotate(-3deg)',
                  mb: 2
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      <Chip label="Physics" color="primary" size="small" />
                      <Chip label="JEE Main" color="secondary" size="small" />
                      <Chip label="Medium" color="warning" size="small" />
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      What is the SI unit of electric current?
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {['Volt (V)', 'Ampere (A)', 'Ohm (Ω)', 'Watt (W)'].map((option, i) => (
                        <Box key={i} sx={{ 
                          p: 1.5, 
                          border: i === 1 ? '2px solid #4caf50' : '1px solid #ddd',
                          borderRadius: 2,
                          mb: 1,
                          backgroundColor: i === 1 ? '#e8f5e8' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}>
                          <Typography variant="body2">
                            {String.fromCharCode(65 + i)}. {option}
                          </Typography>
                          {i === 1 && <CheckCircleRounded sx={{ color: '#4caf50', fontSize: 20 }} />}
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>

                {/* Floating achievement badge */}
                <Box sx={{ 
                  position: 'absolute', 
                  top: -20, 
                  right: -20,
                  background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                  borderRadius: '50%',
                  width: 80,
                  height: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 3
                }}>
                  <Box sx={{ textAlign: 'center', color: 'white' }}>
                    <StarRounded />
                    <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block' }}>
                      95%
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ backgroundColor: '#f8f9fa', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom sx={{ 
            color: 'text.primary', 
            fontWeight: 'bold',
            mb: 2
          }}>
            Why Choose EduSocial?
          </Typography>
          <Typography variant="h6" align="center" sx={{ 
            color: 'text.secondary',
            mb: 6,
            maxWidth: 600,
            mx: 'auto'
          }}>
            Discover the features that make learning engaging and effective
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card elevation={3} sx={{ 
                  height: '100%',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6
                  }
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2, 
                      mb: 2,
                      color: feature.color 
                    }}>
                      {feature.icon}
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        {feature.title}
                      </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom sx={{ 
            color: 'text.primary', 
            fontWeight: 'bold',
            mb: 6
          }}>
            What Our Learners Say
          </Typography>
          
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card elevation={2} sx={{ 
                  height: '100%',
                  borderRadius: 3,
                  p: 3
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {testimonial.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body1" sx={{ 
                      fontStyle: 'italic',
                      lineHeight: 1.6,
                      color: 'text.secondary'
                    }}>
                      "{testimonial.message}"
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 8
      }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom sx={{ 
            color: 'white', 
            fontWeight: 'bold',
            mb: 3
          }}>
            Ready to Start Your Learning Journey?
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ 
            color: 'white', 
            opacity: 0.9,
            mb: 4,
            maxWidth: 500,
            mx: 'auto'
          }}>
            Join our community today and unlock your potential with smart MCQ practice and social learning
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            gap: 3, 
            justifyContent: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center'
          }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<PersonAddRounded />}
              endIcon={<ArrowForwardRounded />}
              onClick={() => navigate('/register')}
              sx={{
                py: 2,
                px: 5,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                backgroundColor: 'white',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Join EduSocial Now
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<ExploreRounded />}
              onClick={() => navigate('/explore')}
              sx={{
                py: 2,
                px: 5,
                fontSize: '1.2rem',
                color: 'white',
                borderColor: 'white',
                borderWidth: 2,
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Explore Questions
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ 
        backgroundColor: '#2c3e50', 
        py: 4,
        color: 'white'
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <EduSocialLogo size="small" variant="white" showText />
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Empowering learners worldwide with smart MCQ practice and social learning experiences.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                © 2025 EduSocial. All rights reserved.
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.6 }}>
                Built with ❤️ for learners everywhere.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;