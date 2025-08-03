import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (
  import.meta.env.NODE_ENV === 'production'
    ? 'http://localhost:8080/api'
    : '/api' // Use proxy in development
);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Helper function to handle API errors
const handleApiError = (error, defaultMessage) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  return error.message || defaultMessage;
};

// Validation helpers
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Authentication Service
const authService = {
  login: async (credentials) => {
    try {
      if (!credentials.usernameOrEmail || !credentials.password) {
        throw new Error('Username/email and password are required');
      }

      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      const message = handleApiError(error, 'Login failed');
      throw new Error(message);
    }
  },

  register: async (userData) => {
    try {
      // Validate required fields
      if (!userData.username || !userData.email || !userData.password) {
        throw new Error('Username, email, and password are required');
      }

      if (!validateEmail(userData.email)) {
        throw new Error('Please enter a valid email address');
      }

      if (!validatePassword(userData.password)) {
        throw new Error('Password must be at least 6 characters long');
      }

      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      const message = handleApiError(error, 'Registration failed');
      throw new Error(message);
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  forgotPassword: async (email) => {
    try {
      if (!email || !validateEmail(email)) {
        throw new Error('Please enter a valid email address');
      }

      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      const message = handleApiError(error, 'Failed to send reset email');
      throw new Error(message);
    }
  },

  resetPassword: async (resetData) => {
    try {
      if (!resetData.token || !resetData.newPassword) {
        throw new Error('Reset token and new password are required');
      }

      if (!validatePassword(resetData.newPassword)) {
        throw new Error('Password must be at least 6 characters long');
      }

      const response = await api.post('/auth/reset-password', resetData);
      return response.data;
    } catch (error) {
      const message = handleApiError(error, 'Password reset failed');
      throw new Error(message);
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      const message = handleApiError(error, 'Failed to load profile');
      throw new Error(message);
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...user, ...response.data }));
      return response.data;
    } catch (error) {
      const message = handleApiError(error, 'Failed to update profile');
      throw new Error(message);
    }
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  }
};

// MCQ Service
const mcqService = {
  generateQuestions: async (subject, examType, difficultyLevel, count = 5) => {
    try {
      if (!subject || !examType || !difficultyLevel) {
        throw new Error('Subject, exam type, and difficulty level are required');
      }

      const response = await api.post('/mcq/generate', null, {
        params: {
          subject,
          examType,
          difficultyLevel,
          count: Math.min(Math.max(1, count), 20) // Limit between 1-20
        }
      });
      return response.data;
    } catch (error) {
      const message = handleApiError(error, 'Failed to generate questions');
      throw new Error(message);
    }
  },

  submitAnswer: async (userId, questionId, selectedOption) => {
    try {
      if (!userId || !questionId || selectedOption === undefined) {
        throw new Error('User ID, question ID, and selected option are required');
      }

      const response = await api.post('/mcq/submit', null, {
        params: {
          userId,
          questionId,
          selectedOption
        }
      });
      return response.data;
    } catch (error) {
      const message = handleApiError(error, 'Failed to submit answer');
      throw new Error(message);
    }
  },

  getUserProgress: async (userId) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const response = await api.get(`/mcq/progress/${userId}`);
      return response.data;
    } catch (error) {
      console.warn('Failed to load progress:', error);
      return {
        totalQuestions: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        accuracyPercentage: 0,
        subjectWiseProgress: [],
        difficultyWiseProgress: []
      };
    }
  },

  getUserResponses: async (userId, page = 0, size = 10) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const response = await api.get(`/mcq/responses/${userId}?page=${Math.max(0, page)}&size=${Math.min(Math.max(1, size), 50)}`);
      return response.data || { content: [], totalElements: 0 };
    } catch (error) {
      console.warn('Failed to load user responses:', error);
      return { content: [], totalElements: 0 };
    }
  },

  getLeaderboard: async (subject = null, examType = null, page = 0, size = 10) => {
    try {
      const params = new URLSearchParams({
        page: Math.max(0, page).toString(),
        size: Math.min(Math.max(1, size), 50).toString()
      });
      if (subject) params.append('subject', subject);
      if (examType) params.append('examType', examType);

      const response = await api.get(`/mcq/leaderboard?${params}`);
      return response.data || { content: [], totalElements: 0 };
    } catch (error) {
      console.warn('Failed to load leaderboard:', error);
      return { content: [], totalElements: 0 };
    }
  },

  getUserScore: async (userId, subject = null, examType = null) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const params = new URLSearchParams();
      if (subject) params.append('subject', subject);
      if (examType) params.append('examType', examType);

      const response = await api.get(`/mcq/score/${userId}?${params}`);
      return response.data;
    } catch (error) {
      console.warn('Failed to load user score:', error);
      return {
        totalQuestions: 0,
        correctAnswers: 0,
        score: 0,
        accuracyPercentage: 0
      };
    }
  }
};

// Social Media Service
const socialService = {
  // Posts
  getFeed: async (page = 0, size = 10, userId = null) => {
    try {
      // Use provided userId or get from localStorage
      const currentUser = userId ? { id: userId } : JSON.parse(localStorage.getItem('user') || '{}');
      const userParam = currentUser.id ? `&userId=${currentUser.id}` : '';

      const response = await api.get(`/social/feed?page=${Math.max(0, page)}&size=${Math.min(Math.max(1, size), 50)}${userParam}`);
      return response.data || { content: [], last: true };
    } catch (error) {
      console.warn('Failed to load feed:', error);
      return { content: [], last: true };
    }
  },

  createPost: async (postData) => {
    try {
      // For MCQ posts, validate required fields
      if (postData.questions && postData.questions.length > 0) {
        if (!postData.title || postData.title.trim() === '') {
          throw new Error('Post title is required for MCQ posts');
        }
        if (!postData.subject) {
          throw new Error('Subject is required for MCQ posts');
        }
        if (!postData.examType) {
          throw new Error('Exam type is required for MCQ posts');
        }
        if (!postData.difficultyLevel) {
          throw new Error('Difficulty level is required for MCQ posts');
        }
      } else {
        // For regular posts
        if (!postData.content || postData.content.trim() === '') {
          throw new Error('Post content is required');
        }
      }

      // Get current user for authorId
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('Current user from localStorage:', currentUser);
      console.log('Available user fields:', Object.keys(currentUser));

      // Check different possible id fields
      const userId = currentUser.id || currentUser.userId || currentUser.user_id || currentUser.authorId;
      console.log('Extracted user ID:', userId);

      if (!userId) {
        console.error('No user ID found. User object:', currentUser);
        throw new Error('User must be logged in to create posts');
      }

      const response = await api.post(`/social/posts?authorId=${userId}`, postData);
      return response.data;
    } catch (error) {
      const message = handleApiError(error, 'Failed to create post');
      throw new Error(message);
    }
  },

  getPost: async (postId) => {
    try {
      if (!postId) {
        throw new Error('Post ID is required');
      }

      // Get current user for userId (optional)
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userParam = currentUser.id ? `?userId=${currentUser.id}` : '';

      const response = await api.get(`/social/posts/${postId}${userParam}`);
      return response.data;
    } catch (error) {
      const message = handleApiError(error, 'Failed to load post');
      throw new Error(message);
    }
  },

  likePost: async (postId) => {
    try {
      if (!postId) {
        throw new Error('Post ID is required');
      }

      // Get current user for userId
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (!currentUser.id) {
        throw new Error('User must be logged in to like posts');
      }

      const response = await api.post(`/social/posts/${postId}/like?userId=${currentUser.id}`);
      return response.data;
    } catch (error) {
      console.warn('Failed to like post:', error);
      throw error;
    }
  },

  bookmarkPost: async (postId) => {
    try {
      if (!postId) {
        throw new Error('Post ID is required');
      }

      const response = await api.post(`/social/posts/${postId}/bookmark`);
      return response.data;
    } catch (error) {
      console.warn('Failed to bookmark post:', error);
      throw error;
    }
  },

  sharePost: async (postId) => {
    try {
      if (!postId) {
        throw new Error('Post ID is required');
      }

      const response = await api.post(`/social/posts/${postId}/share`);
      return response.data;
    } catch (error) {
      console.warn('Failed to share post:', error);
      throw error;
    }
  },

  // Comments
  getComments: async (postId, page = 0, size = 10) => {
    try {
      if (!postId) {
        throw new Error('Post ID is required');
      }

      const response = await api.get(`/social/posts/${postId}/comments?page=${Math.max(0, page)}&size=${Math.min(Math.max(1, size), 50)}`);
      return response.data || { content: [], last: true };
    } catch (error) {
      console.warn('Failed to load comments:', error);
      return { content: [], last: true };
    }
  },

  createComment: async (postId, content) => {
    try {
      if (!postId || !content || content.trim() === '') {
        throw new Error('Post ID and comment content are required');
      }

      const response = await api.post(`/social/posts/${postId}/comments`, { content: content.trim() });
      return response.data;
    } catch (error) {
      const message = handleApiError(error, 'Failed to add comment');
      throw new Error(message);
    }
  },

  likeComment: async (commentId) => {
    try {
      if (!commentId) {
        throw new Error('Comment ID is required');
      }

      const response = await api.post(`/social/comments/${commentId}/like`);
      return response.data;
    } catch (error) {
      console.warn('Failed to like comment:', error);
      throw error;
    }
  },

  // Advanced Feeds
  getTrendingFeed: async (page = 0, size = 10, userId = null) => {
    try {
      const params = new URLSearchParams({
        page: Math.max(0, page),
        size: Math.min(Math.max(1, size), 50)
      });
      if (userId) params.append('userId', userId);

      const response = await api.get(`/social/feed/trending?${params}`);
      return response.data || { content: [], last: true };
    } catch (error) {
      console.warn('Failed to load trending feed:', error);
      return { content: [], last: true };
    }
  },

  getFollowingFeed: async (userId, page = 0, size = 10) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const response = await api.get(`/social/feed/following?userId=${userId}&page=${Math.max(0, page)}&size=${Math.min(Math.max(1, size), 50)}`);
      return response.data || { content: [], last: true };
    } catch (error) {
      console.warn('Failed to load following feed:', error);
      return { content: [], last: true };
    }
  },

  getPersonalizedFeed: async (userId, page = 0, size = 10) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const response = await api.get(`/social/feed/personalized?userId=${userId}&page=${Math.max(0, page)}&size=${Math.min(Math.max(1, size), 50)}`);
      return response.data || { content: [], last: true };
    } catch (error) {
      console.warn('Failed to load personalized feed:', error);
      return { content: [], last: true };
    }
  },

  // Search and Filter
  searchPosts: async (query, page = 0, size = 10, userId = null) => {
    try {
      if (!query || query.trim() === '') {
        return { content: [], last: true };
      }

      const params = new URLSearchParams({
        query: query.trim(),
        page: Math.max(0, page),
        size: Math.min(Math.max(1, size), 50)
      });
      if (userId) params.append('userId', userId);

      const response = await api.get(`/social/posts/search?${params}`);
      return response.data || { content: [], last: true };
    } catch (error) {
      console.warn('Failed to search posts:', error);
      return { content: [], last: true };
    }
  },

  getPostsBySubject: async (subject, page = 0, size = 10, userId = null) => {
    try {
      if (!subject) {
        throw new Error('Subject is required');
      }

      const params = new URLSearchParams({
        page: Math.max(0, page),
        size: Math.min(Math.max(1, size), 50)
      });
      if (userId) params.append('userId', userId);

      const response = await api.get(`/social/posts/subject/${encodeURIComponent(subject)}?${params}`);
      return response.data || { content: [], last: true };
    } catch (error) {
      console.warn('Failed to load posts by subject:', error);
      return { content: [], last: true };
    }
  },

  getPostsByExamType: async (examType, page = 0, size = 10, userId = null) => {
    try {
      if (!examType) {
        throw new Error('Exam type is required');
      }

      const params = new URLSearchParams({
        page: Math.max(0, page),
        size: Math.min(Math.max(1, size), 50)
      });
      if (userId) params.append('userId', userId);

      const response = await api.get(`/social/posts/exam/${encodeURIComponent(examType)}?${params}`);
      return response.data || { content: [], last: true };
    } catch (error) {
      console.warn('Failed to load posts by exam type:', error);
      return { content: [], last: true };
    }
  },

  // Record post view
  recordView: async (postId, userId = null) => {
    try {
      if (!postId) return;

      const params = userId ? `?userId=${userId}` : '';
      await api.post(`/social/posts/${postId}/view${params}`);
    } catch (error) {
      console.warn('Failed to record view:', error);
    }
  },

  // Question generation within social
  generateSocialQuestions: async (subject, examType, difficultyLevel, count = 5) => {
    try {
      if (!subject || !examType || !difficultyLevel) {
        throw new Error('Subject, exam type, and difficulty level are required');
      }

      const response = await api.post('/social/questions/generate', null, {
        params: {
          subject,
          examType,
          difficultyLevel,
          count: Math.min(Math.max(1, count), 20)
        }
      });
      return response.data;
    } catch (error) {
      const message = handleApiError(error, 'Failed to generate questions');
      throw new Error(message);
    }
  },

  // Submit answer for social questions
  submitSocialAnswer: async (userId, questionId, selectedOption) => {
    try {
      if (!userId || !questionId || selectedOption === undefined) {
        throw new Error('User ID, question ID, and selected option are required');
      }

      const response = await api.post('/social/questions/submit', null, {
        params: {
          userId,
          questionId,
          selectedOption
        }
      });
      return response.data;
    } catch (error) {
      const message = handleApiError(error, 'Failed to submit answer');
      throw new Error(message);
    }
  },

  // Get user's answer for a question
  getMyAnswerForQuestion: async (questionId, userId = null) => {
    try {
      if (!questionId) {
        throw new Error('Question ID is required');
      }

      const params = userId ? `?userId=${userId}` : '';
      const response = await api.get(`/social/questions/${questionId}/my-answer${params}`);
      return response.data;
    } catch (error) {
      console.warn('Failed to get answer:', error);
      return { hasAnswered: false };
    }
  },

  // User Management
  getUserProfile: async (userId) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const response = await api.get(`/social/users/${userId}`);
      return response.data;
    } catch (error) {
      const message = handleApiError(error, 'Failed to load user profile');
      throw new Error(message);
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/social/profile', profileData);
      return response.data;
    } catch (error) {
      const message = handleApiError(error, 'Failed to update profile');
      throw new Error(message);
    }
  },

  followUser: async (userId) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const response = await api.post(`/social/users/${userId}/follow`);
      return response.data;
    } catch (error) {
      const message = handleApiError(error, 'Failed to follow user');
      throw new Error(message);
    }
  },

  getFollowers: async (userId, page = 0, size = 10) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const response = await api.get(`/social/users/${userId}/followers?page=${Math.max(0, page)}&size=${Math.min(Math.max(1, size), 50)}`);
      return response.data || { content: [], last: true };
    } catch (error) {
      console.warn('Failed to load followers:', error);
      return { content: [], last: true };
    }
  },

  getFollowing: async (userId, page = 0, size = 10) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const response = await api.get(`/social/users/${userId}/following?page=${Math.max(0, page)}&size=${Math.min(Math.max(1, size), 50)}`);
      return response.data || { content: [], last: true };
    } catch (error) {
      console.warn('Failed to load following:', error);
      return { content: [], last: true };
    }
  },

  searchUsers: async (query, page = 0, size = 10) => {
    try {
      if (!query || query.trim() === '') {
        return { content: [], last: true };
      }

      const response = await api.get(`/social/users/search?query=${encodeURIComponent(query.trim())}&page=${Math.max(0, page)}&size=${Math.min(Math.max(1, size), 50)}`);
      return response.data || { content: [], last: true };
    } catch (error) {
      console.warn('Failed to search users:', error);
      return { content: [], last: true };
    }
  },

  getBookmarks: async (page = 0, size = 10) => {
    try {
      const response = await api.get(`/social/bookmarks?page=${Math.max(0, page)}&size=${Math.min(Math.max(1, size), 50)}`);
      return response.data || { content: [], last: true };
    } catch (error) {
      console.warn('Failed to load bookmarks:', error);
      return { content: [], last: true };
    }
  },

  // Analytics
  getUserAnalytics: async (userId) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const response = await api.get(`/social/users/${userId}/analytics`);
      return response.data;
    } catch (error) {
      console.warn('Failed to load user analytics:', error);
      return {
        totalPosts: 0,
        totalLikes: 0,
        totalViews: 0,
        totalFollowers: 0,
        totalFollowing: 0,
        engagementRate: 0
      };
    }
  },

  getPostAnalytics: async (postId) => {
    try {
      if (!postId) {
        throw new Error('Post ID is required');
      }

      const response = await api.get(`/social/posts/${postId}/analytics`);
      return response.data;
    } catch (error) {
      console.warn('Failed to load post analytics:', error);
      return {
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        bookmarks: 0
      };
    }
  },

  // Missing endpoints from SocialMediaController
  getUserPosts: async (userId, page = 0, size = 10, currentUserId = null) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const params = new URLSearchParams({
        page: Math.max(0, page),
        size: Math.min(Math.max(1, size), 50)
      });
      if (currentUserId) params.append('currentUserId', currentUserId);

      const response = await api.get(`/social/users/${userId}/posts?${params}`);
      return response.data || { content: [], last: true };
    } catch (error) {
      console.warn('Failed to load user posts:', error);
      return { content: [], last: true };
    }
  },

  getTopUsers: async (page = 0, size = 10) => {
    try {
      const response = await api.get(`/social/users/top?page=${Math.max(0, page)}&size=${Math.min(Math.max(1, size), 50)}`);
      return response.data || { content: [], last: true };
    } catch (error) {
      console.warn('Failed to load top users:', error);
      return { content: [], last: true };
    }
  },

  getUserStatus: async (userId) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const response = await api.get(`/social/users/${userId}/status`);
      return response.data;
    } catch (error) {
      console.warn('Failed to load user status:', error);
      return { status: 'offline' };
    }
  },

  updateUserStatus: async (userId, status) => {
    try {
      if (!userId || !status) {
        throw new Error('User ID and status are required');
      }

      const response = await api.put(`/social/users/${userId}/status`, { status });
      return response.data;
    } catch (error) {
      const message = handleApiError(error, 'Failed to update user status');
      throw new Error(message);
    }
  },

  getUserRevenue: async (userId, startDate = null, endDate = null) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const paramString = params.toString();
      const response = await api.get(`/social/users/${userId}/revenue${paramString ? '?' + paramString : ''}`);
      return response.data;
    } catch (error) {
      console.warn('Failed to load user revenue:', error);
      return { totalRevenue: 0, monthlyRevenue: [] };
    }
  },

  updateUserProfile: async (userId, profileData) => {
    try {
      if (!userId || !profileData) {
        throw new Error('User ID and profile data are required');
      }

      const response = await api.put(`/social/users/${userId}/profile`, profileData);
      return response.data;
    } catch (error) {
      const message = handleApiError(error, 'Failed to update profile');
      throw new Error(message);
    }
  },

  // Answer submission for MCQ questions in social posts
  submitQuestionAnswer: async (questionId, userId, selectedOption) => {
    try {
      if (!questionId || !userId || !selectedOption) {
        throw new Error('Question ID, User ID, and selected option are required');
      }

      const response = await api.post(`/social/questions/${questionId}/answer`, {
        userId,
        selectedOption: selectedOption.toUpperCase()
      });
      return response.data;
    } catch (error) {
      const message = handleApiError(error, 'Failed to submit answer');
      throw new Error(message);
    }
  },

  // Get user's answer for a specific question
  getUserAnswerForQuestion: async (questionId, userId = null) => {
    try {
      if (!questionId) {
        throw new Error('Question ID is required');
      }

      const params = userId ? `?userId=${userId}` : '';
      const response = await api.get(`/social/questions/${questionId}/my-answer${params}`);
      return response.data;
    } catch (error) {
      console.warn('Failed to get user answer:', error);
      return { hasAnswered: false };
    }
  }
};

// Mock Test Service
const mockTestService = {
  createMockTest: async (testData) => {
    try {
      if (!testData.title || !testData.subject || !testData.examType) {
        throw new Error('Title, subject, and exam type are required');
      }

      const response = await api.post('/mock-tests', testData);
      return response.data;
    } catch (error) {
      const message = handleApiError(error, 'Failed to create mock test');
      throw new Error(message);
    }
  },

  getMockTests: async (page = 0, size = 10, subject = null, examType = null) => {
    try {
      const params = new URLSearchParams({
        page: Math.max(0, page).toString(),
        size: Math.min(Math.max(1, size), 50).toString()
      });
      if (subject) params.append('subject', subject);
      if (examType) params.append('examType', examType);

      const response = await api.get(`/mock-tests?${params}`);
      return response.data || { content: [], totalElements: 0 };
    } catch (error) {
      console.warn('Failed to load mock tests:', error);
      return { content: [], totalElements: 0 };
    }
  },

  getMockTest: async (testId) => {
    try {
      if (!testId) {
        throw new Error('Test ID is required');
      }

      const response = await api.get(`/mock-tests/${testId}`);
      return response.data;
    } catch (error) {
      const message = handleApiError(error, 'Failed to load mock test');
      throw new Error(message);
    }
  },

  submitMockTest: async (testId, answers) => {
    try {
      if (!testId || !answers) {
        throw new Error('Test ID and answers are required');
      }

      const response = await api.post(`/mock-tests/${testId}/submit`, { answers });
      return response.data;
    } catch (error) {
      const message = handleApiError(error, 'Failed to submit mock test');
      throw new Error(message);
    }
  },

  getMockTestResults: async (testId, userId) => {
    try {
      if (!testId || !userId) {
        throw new Error('Test ID and User ID are required');
      }

      const response = await api.get(`/mock-tests/${testId}/results/${userId}`);
      return response.data;
    } catch (error) {
      const message = handleApiError(error, 'Failed to load test results');
      throw new Error(message);
    }
  },

  getUserMockTestHistory: async (userId, page = 0, size = 10) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const response = await api.get(`/mock-tests/user/${userId}/history?page=${Math.max(0, page)}&size=${Math.min(Math.max(1, size), 50)}`);
      return response.data || { content: [], totalElements: 0 };
    } catch (error) {
      console.warn('Failed to load mock test history:', error);
      return { content: [], totalElements: 0 };
    }
  }
};

// Health Check
const healthService = {
  checkHealth: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.warn('Health check failed:', error);
      return { status: 'DOWN' };
    }
  }
};

// Export all services
export {
  authService,
  socialService,
  mcqService,
  mockTestService,
  healthService
};

export default api;
