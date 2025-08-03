import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  CircularProgress,
  Grid,
  Paper
} from '@mui/material';
import { EmojiEvents, Star, TrendingUp } from '@mui/icons-material';
import { mcqService } from '../services/apiService';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const response = await mcqService.getLeaderboard();
      setLeaderboard(response.leaderboard || []);
      setUserRank(response.userRank);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'gold';
      case 2: return 'silver';
      case 3: return '#CD7F32'; // bronze
      default: return 'inherit';
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <EmojiEvents sx={{ color: 'gold' }} />;
      case 2: return <EmojiEvents sx={{ color: 'silver' }} />;
      case 3: return <EmojiEvents sx={{ color: '#CD7F32' }} />;
      default: return <Star sx={{ color: 'grey.500' }} />;
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <TrendingUp sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Leaderboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          See how you rank against other learners
        </Typography>
      </Box>

      {/* User's Current Rank */}
      {userRank && (
        <Paper sx={{ p: 3, mb: 4, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
          <Typography variant="h6" gutterBottom>
            Your Current Rank
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label={`#${userRank.rank}`}
              sx={{ bgcolor: 'primary.dark', color: 'primary.contrastText' }}
            />
            <Typography variant="body1">
              {userRank.totalQuestions} questions • {userRank.accuracy}% accuracy • {userRank.score} points
            </Typography>
          </Box>
        </Paper>
      )}

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {/* 2nd Place */}
          <Grid item xs={4}>
            <Card sx={{ textAlign: 'center', mt: 4 }}>
              <CardContent>
                <Avatar
                  sx={{
                    mx: 'auto',
                    mb: 1,
                    bgcolor: 'silver',
                    width: 56,
                    height: 56
                  }}
                >
                  {leaderboard[1]?.username?.[0]?.toUpperCase()}
                </Avatar>
                <Typography variant="h6" noWrap>
                  {leaderboard[1]?.username}
                </Typography>
                <Chip label="#2" sx={{ bgcolor: 'silver', color: 'white', mt: 1 }} />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {leaderboard[1]?.score} pts
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* 1st Place */}
          <Grid item xs={4}>
            <Card sx={{ textAlign: 'center', transform: 'scale(1.1)' }}>
              <CardContent>
                <EmojiEvents sx={{ fontSize: 40, color: 'gold', mb: 1 }} />
                <Avatar
                  sx={{
                    mx: 'auto',
                    mb: 1,
                    bgcolor: 'gold',
                    width: 64,
                    height: 64
                  }}
                >
                  {leaderboard[0]?.username?.[0]?.toUpperCase()}
                </Avatar>
                <Typography variant="h6" noWrap>
                  {leaderboard[0]?.username}
                </Typography>
                <Chip label="#1" sx={{ bgcolor: 'gold', color: 'white', mt: 1 }} />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {leaderboard[0]?.score} pts
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* 3rd Place */}
          <Grid item xs={4}>
            <Card sx={{ textAlign: 'center', mt: 4 }}>
              <CardContent>
                <Avatar
                  sx={{
                    mx: 'auto',
                    mb: 1,
                    bgcolor: '#CD7F32',
                    width: 56,
                    height: 56
                  }}
                >
                  {leaderboard[2]?.username?.[0]?.toUpperCase()}
                </Avatar>
                <Typography variant="h6" noWrap>
                  {leaderboard[2]?.username}
                </Typography>
                <Chip label="#3" sx={{ bgcolor: '#CD7F32', color: 'white', mt: 1 }} />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {leaderboard[2]?.score} pts
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Full Leaderboard */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Full Rankings
          </Typography>
          <List>
            {leaderboard.map((user, index) => (
              <ListItem key={user.id || index}>
                <ListItemAvatar>
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        mr: 1,
                        minWidth: 30,
                        color: getRankColor(index + 1)
                      }}
                    >
                      #{index + 1}
                    </Typography>
                    {getRankIcon(index + 1)}
                  </Box>
                </ListItemAvatar>
                <ListItemAvatar>
                  <Avatar>
                    {user.username?.[0]?.toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.username}
                  secondary={
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                      <Chip
                        label={`${user.score} points`}
                        size="small"
                        color="primary"
                      />
                      <Chip
                        label={`${user.totalQuestions} questions`}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={`${user.accuracy}% accuracy`}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {leaderboard.length === 0 && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <TrendingUp sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No rankings available yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start practicing MCQs to appear on the leaderboard!
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default Leaderboard;
