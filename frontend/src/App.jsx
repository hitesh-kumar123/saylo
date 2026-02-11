import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './components/layout/DashboardLayout';
import InterviewSetup from './pages/InterviewSetup';
import InterviewSession from './pages/InterviewSession';
import Results from './pages/Results';
import Profile from './pages/Profile';
import History from './pages/History';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-bg text-white font-sans selection:bg-primary-500/30">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Authenticated Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/history" element={<History />} />
            <Route path="/interview/setup" element={<InterviewSetup />} />
            <Route path="/interview/:id" element={<InterviewSession />} />
            <Route path="/interview/:id/results" element={<Results />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
