import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import Registration from './components/auth/Registration';
import PersonalityAnalysis from './pages/PersonalityAnalysis';
import SmartMatching from './pages/SmartMatching';
import RelationshipInsights from './pages/RelationshipInsights';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import TestPersonalityAnalysis from './components/test/TestPersonalityAnalysis';
import AIChatAssistant from './components/chat/AIChatAssistant';
import Pricing from './pages/Pricing';
import { useLocation } from 'react-router-dom';

const App = () => {
  const location = useLocation();
  const isPublicPage = ['/', '/login', '/signup', '/pricing'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/pricing" element={<Pricing />} />

        {/* Protected routes with Layout */}
        <Route element={<Layout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/personality-analysis" element={<PersonalityAnalysis />} />
            <Route path="/smart-matching" element={<SmartMatching />} />
            <Route path="/relationship-insights" element={<RelationshipInsights />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/test-personality" element={<TestPersonalityAnalysis />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>
      {!isPublicPage && <AIChatAssistant />}
    </div>
  );
};

const AppWrapper = () => {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
};

export default AppWrapper;