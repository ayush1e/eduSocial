import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Avatar,
  TextField,
  Paper,
  Divider,
  Chip,
  Alert,
  CircularProgress,
  Tooltip,
  Stack,
  Badge,
  Fade
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  Email,
  Person,
  EmojiEvents,
  Star,
  Group,
  AssignmentTurnedIn,
  VerifiedUser,
  WorkspacePremium,
  EmojiEmotions
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { socialService } from '../services/apiService';
import EduSocialLogo from '../components/EduSocialLogo';

const achievementList = [
  {
    key: 'questionMaster',
    label: 'Question Master',
    icon: <EmojiEvents />,
    color: 'primary',
    condition: profile => profile?.totalQuestions >= 10,
    description: 'Attempted 10+ questions'
  },
  {
    key: 'highAchiever',
    label: 'High Achiever',
    icon: <Star />,
    color: 'success',
    condition: profile => profile?.accuracy >= 80,
    description: 'Accuracy 80%+'
  },
  {
    key: 'activeMember',
    label: 'Active Member',
    icon: <Edit />,
    color: 'secondary',
    condition: profile => profile?.postsCount >= 5,
    description: 'Created 5+ posts'
  },
  {
    key: 'verified',
    label: 'Verified',
    icon: <VerifiedUser />,
    color: 'info',
    condition: profile => profile?.verified,
    description: 'Verified account'
  },
  {
    key: 'premium',
    label: 'Premium',
    icon: <WorkspacePremium />,
    color: 'warning',
    condition: profile => profile?.premium,
    description: 'Premium member'
  }
];

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    bio: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line
  }, [user]);

  const loadProfile = async () => {
    try {
      if (user?.id) {
        const response = await socialService.getUserProfile(user.id);
        setProfile(response);
        setEditForm({
          fullName: response.fullName || '',
          bio: response.bio || '',
          email: response.email || ''
        });
      }
    } catch (error) {
      setError('Error loading profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setEditing(false);
    setEditForm({
      fullName: profile?.fullName || '',
      bio: profile?.bio || '',
      email: profile?.email || ''
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const response = await socialService.updateProfile(editForm);
      setProfile(response);
      setEditing(false);
      setSuccess('Profile updated successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <Container sx={{ mt: 8, textAlign: 'center' }}>
        <CircularProgress size={48} />
      </Container>
    );
  }

  // Collect earned achievements
  const earnedAchievements = achievementList.filter(a => a.condition(profile));
  const noAchievements = earnedAchievements.length === 0;

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      {/* Banner */}
      <Box
        sx={{
          mb: 4,
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative',
          background: 'linear-gradient(120deg, #667eea 0%, #764ba2 100%)',
          minHeight: 120,
          display: 'flex',
          alignItems: 'center',
          px: { xs: 2, md: 6 }
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <EduSocialLogo size="medium" variant="white" showText />
          <Typography variant="h5" fontWeight="bold" color="white" sx={{ mt: 1 }}>
            Welcome, {profile?.fullName || user?.username}!
          </Typography>
          <Typography variant="subtitle1" color="rgba(255,255,255,0.85)">
            Your learning journey at a glance
          </Typography>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: 'secondary.main',
              color: 'white',
              fontSize: 48,
              border: '5px solid #fff',
              boxShadow: 4,
              mr: 4
            }}
          >
            {user?.username?.[0]?.toUpperCase()}
          </Avatar>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Profile Info */}
        <Grid item xs={12} md={8}>
          <Card
            elevation={6}
            sx={{
              borderRadius: 5,
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
            }}
          >
            <CardContent sx={{ p: { xs: 2, md: 4 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <Tooltip title="Edit Profile">
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: 'primary.main',
                          cursor: 'pointer',
                          border: editing ? '2px solid #1976d2' : '2px solid #fff'
                        }}
                        onClick={handleEdit}
                      >
                        <Edit fontSize="small" />
                      </Avatar>
                    </Tooltip>
                  }
                >
                  <Avatar
                    sx={{
                      width: 90,
                      height: 90,
                      mr: 3,
                      fontSize: '2.5rem',
                      bgcolor: 'secondary.main',
                      color: 'white',
                      border: '4px solid #fff',
                      boxShadow: 2
                    }}
                  >
                    {user?.username?.[0]?.toUpperCase()}
                  </Avatar>
                </Badge>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {profile?.fullName || user?.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    @{user?.username}
                  </Typography>
                </Box>
                {!editing ? null : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSave}
                      disabled={saving}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>

              <Divider sx={{ mb: 3 }} />

              {editing ? (
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={editForm.fullName}
                    onChange={handleInputChange}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                  />
                  <TextField
                    fullWidth
                    label="Bio"
                    name="bio"
                    multiline
                    rows={4}
                    value={editForm.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                  />
                </Stack>
              ) : (
                <Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Email
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Email sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body1">
                        {profile?.email || user?.email || 'Not provided'}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Bio
                    </Typography>
                    <Typography variant="body1">
                      {profile?.bio || 'No bio provided yet.'}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Member Since
                    </Typography>
                    <Typography variant="body1">
                      {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Recently joined'}
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Stats & Achievements */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* Stats */}
            <Card
              elevation={4}
              sx={{
                borderRadius: 5,
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(6px)'
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Activity Stats
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AssignmentTurnedIn color="primary" />
                    <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                      Questions Attempted
                    </Typography>
                    <Typography variant="h6">
                      {profile?.totalQuestions || 0}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Star color="warning" />
                    <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                      Accuracy Rate
                    </Typography>
                    <Typography variant="h6">
                      {profile?.accuracy || 0}%
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Edit color="secondary" />
                    <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                      Posts Created
                    </Typography>
                    <Typography variant="h6">
                      {profile?.postsCount || 0}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Group color="success" />
                    <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                      Followers
                    </Typography>
                    <Typography variant="h6">
                      {profile?.followersCount || 0}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person color="info" />
                    <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                      Following
                    </Typography>
                    <Typography variant="h6">
                      {profile?.followingCount || 0}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card
              elevation={4}
              sx={{
                borderRadius: 5,
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(6px)'
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Achievements
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, minHeight: 48 }}>
                  {earnedAchievements.map((ach, idx) => (
                    <Fade in key={ach.key} timeout={600 + idx * 200}>
                      <Chip
                        icon={ach.icon}
                        label={ach.label}
                        color={ach.color}
                        size="small"
                        variant="filled"
                        sx={{
                          fontWeight: 'bold',
                          fontSize: '1rem',
                          px: 1.5,
                          boxShadow: 2,
                          background: ach.color === 'warning'
                            ? 'linear-gradient(90deg,#FFD700,#FFA500)'
                            : undefined
                        }}
                        clickable
                        component="span"
                        title={ach.description}
                      />
                    </Fade>
                  ))}
                  {noAchievements && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmojiEmotions color="disabled" />
                      <Typography variant="body2" color="text.secondary">
                        Complete challenges to earn achievements!
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;