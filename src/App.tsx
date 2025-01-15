import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/Navbar';
import Breadcrumb from './components/Breadcrumb';
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

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Breadcrumb />
          <main className="pt-4">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route
                path="/registration"
                element={
                  <ProtectedRoute>
                    <Registration />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/personality-analysis"
                element={
                  <ProtectedRoute>
                    <PersonalityAnalysis />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/smart-matching"
                element={
                  <ProtectedRoute>
                    <SmartMatching />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/relationship-insights"
                element={
                  <ProtectedRoute>
                    <RelationshipInsights />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/:userId"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/test-personality" element={<TestPersonalityAnalysis />} />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;