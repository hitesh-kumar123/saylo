import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import InterviewSetup from './pages/InterviewSetup';
import InterviewSession from './pages/InterviewSession';
import LiveAudioInterview from './pages/LiveAudioInterview';
import Results from './pages/Results';
import History from './pages/History';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/interview/setup" element={<InterviewSetup />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Profile />} />
          </Route>

          {/* Protected standalone pages (no sidebar) */}
          <Route path="/interview/:id" element={
            <ProtectedRoute><InterviewSession /></ProtectedRoute>
          } />
          <Route path="/interview/:id/audio" element={
            <ProtectedRoute><LiveAudioInterview /></ProtectedRoute>
          } />
          <Route path="/interview/:id/results" element={
            <ProtectedRoute><Results /></ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Landing />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
