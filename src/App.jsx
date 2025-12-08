import { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import LeadManagement from './pages/LeadManagement';
import CampaignManagement from './pages/CampaignManagement';
import TaskManagement from './pages/TaskManagement';
import Members from './pages/Members';
import PermanentMembers from './pages/PermanentMembers';
import TemporaryMembers from './pages/TemporaryMembers';
import JuniorMembers from './pages/JuniorMembers';
import Games from './pages/Games';
import Sponsors from './pages/Sponsors';
import Memories from './pages/Memories';
import ChitFund from './pages/ChitFund';
import Expenditures from './pages/Expenditures';
import Settings from './pages/Settings';
import Users from './pages/Users';
import Profile from './pages/Profile';
import NotificationsPage from './pages/NotificationsPage';
import { AuthProvider, useAuth } from './services/authComponents';
import { LanguageProvider } from './context/LanguageContext';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Or a loading spinner
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? 'dark' : 'light',
          primary: {
            main: '#667eea',
          },
          secondary: {
            main: '#764ba2',
          },
          background: {
            default: isDarkMode ? '#1a202c' : '#f7fafc',
            paper: isDarkMode ? '#2d3748' : '#ffffff',
          },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: { fontWeight: 700 },
          h2: { fontWeight: 700 },
          h3: { fontWeight: 700 },
          h4: { fontWeight: 700 },
          h5: { fontWeight: 600 },
          h6: { fontWeight: 600 },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: 'none',
                fontWeight: 600,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 8,
                },
              },
            },
          },
        },
      }),
    [isDarkMode]
  );

  return (
    <LanguageProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:uid/:token" element={<ResetPasswordPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HomePage toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
                      <Dashboard />
                    </HomePage>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leads"
                element={
                  <ProtectedRoute>
                    <HomePage toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
                      <LeadManagement />
                    </HomePage>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/campaigns"
                element={
                  <ProtectedRoute>
                    <HomePage toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
                      <CampaignManagement />
                    </HomePage>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <HomePage toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
                      <TaskManagement />
                    </HomePage>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/members"
                element={
                  <ProtectedRoute>
                    <HomePage toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
                      <Members />
                    </HomePage>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/members/permanent"
                element={
                  <ProtectedRoute>
                    <HomePage toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
                      <PermanentMembers />
                    </HomePage>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/members/temporary"
                element={
                  <ProtectedRoute>
                    <HomePage toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
                      <TemporaryMembers />
                    </HomePage>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/members/junior"
                element={
                  <ProtectedRoute>
                    <HomePage toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
                      <JuniorMembers />
                    </HomePage>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <HomePage toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
                      <Settings />
                    </HomePage>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/profile"
                element={
                  <ProtectedRoute>
                    <HomePage toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
                      <Settings />
                    </HomePage>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/users"
                element={
                  <ProtectedRoute>
                    <HomePage toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
                      <Settings />
                    </HomePage>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games"
                element={
                  <ProtectedRoute>
                    <HomePage toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
                      <Games />
                    </HomePage>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sponsors"
                element={
                  <ProtectedRoute>
                    <HomePage toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
                      <Sponsors />
                    </HomePage>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/memories"
                element={
                  <ProtectedRoute>
                    <HomePage toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
                      <Memories />
                    </HomePage>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chitfund"
                element={
                  <ProtectedRoute>
                    <HomePage toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
                      <ChitFund />
                    </HomePage>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/expenditures"
                element={
                  <ProtectedRoute>
                    <HomePage toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
                      <Expenditures />
                    </HomePage>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/notifications"
                element={
                  <ProtectedRoute>
                    <HomePage toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
                      <Settings />
                    </HomePage>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
