import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import ConnectionStatus from './components/ConnectionStatus';
import DebugPanel from './components/DebugPanel';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import MCQPractice from './pages/MCQPractice';
 
import EnhancedSocialFeed from './components/EnhancedSocialFeed';
 
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import SocialApiTest from './pages/SocialApiTest';
 
import CreateMockTest from './pages/CreateMockTest';
import GenerateQuestionAI from './pages/GenerateQuestionAI';
 

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Import React Toastify CSS
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';

// Create MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <div className="App">
              <Navbar />
              <ConnectionStatus />
              <DebugPanel />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />

                <Route path="/mcq" element={
                  <ProtectedRoute>
                    <MCQPractice />
                  </ProtectedRoute>
                } />
                <Route path="/social" element={
                  <ProtectedRoute>
                    <EnhancedSocialFeed />
                  </ProtectedRoute>
                } />
                <Route path="/leaderboard" element={
                  <ProtectedRoute>
                    <Leaderboard />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/test-api" element={
                  <ProtectedRoute>
                    <SocialApiTest />
                  </ProtectedRoute>
                } />
                <Route path="/create-post" element={
                  <ProtectedRoute>
                    <CreatePost />
                  </ProtectedRoute>
                } />
                <Route path="/create-mocktest" element={
                  <ProtectedRoute>
                    <CreateMockTest />
                  </ProtectedRoute>
                } />
                <Route path="/generate-questions" element={
                  <ProtectedRoute>
                    <GenerateQuestionAI />
                  </ProtectedRoute>
                } />
                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/" replace />} />
                <Route path="*" element={<Navigate to="/social" replace />} />
              </Routes>

              {/* Toast Container for notifications */}
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
