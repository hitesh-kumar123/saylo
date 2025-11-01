import React, { useEffect } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { StatCard } from '../components/dashboard/StatCard';
import { InterviewHistoryCard } from '../components/dashboard/InterviewHistoryCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Video, Award, BarChart2, FileText, Calendar, TrendingUp, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInterviewStore } from '../store/interviewStore';
import { motion } from 'framer-motion';

export const DashboardPage: React.FC = () => {
  const { sessions, fetchSessions } = useInterviewStore();
  
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);
  
  // Mock data for demonstration
  const stats = {
    interviews: sessions.length,
    avgScore: sessions.length > 0 
      ? (sessions.reduce((sum, session) => sum + (session.feedback?.overallScore || 0), 0) / sessions.length).toFixed(1) 
      : '0.0',
    skillsImproved: ['Confidence', 'Clarity', 'Eye Contact'],
    nextInterview: '2023-11-25T15:00:00',
  };

  return (
    <PageLayout title="Dashboard" subtitle="Track your progress and prepare for your next interview">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Interviews Completed"
            value={stats.interviews}
            icon={<Video className="h-6 w-6" />}
            trend="up"
            trendValue="+2 this week"
            delay={0.1}
          />
          <StatCard
            title="Average Score"
            value={`${stats.avgScore}/10`}
            icon={<Award className="h-6 w-6" />}
            trend="up"
            trendValue="+0.8 pts"
            delay={0.2}
          />
          <StatCard
            title="Total Practice Time"
            value="3h 45m"
            icon={<Clock className="h-6 w-6" />}
            description="Across all sessions"
            delay={0.3}
          />
          <StatCard
            title="Skills Improved"
            value="3"
            icon={<TrendingUp className="h-6 w-6" />}
            description={stats.skillsImproved.join(', ')}
            delay={0.4}
          />
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Card className="bg-gradient-to-r from-primary-800 to-primary-700 text-white">
              <h3 className="text-xl font-semibold mb-2">Ready for your next interview?</h3>
              <p className="mb-6 text-primary-100">
                Practice makes perfect. Start a new interview session to improve your skills.
              </p>
              <Link to="/interview">
                <Button variant="accent" leftIcon={<Video size={16} />}>
                  Start Interview
                </Button>
              </Link>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <Card className="bg-gradient-to-r from-secondary-700 to-secondary-600 text-white">
              <h3 className="text-xl font-semibold mb-2">Optimize your resume</h3>
              <p className="mb-6 text-secondary-100">
                Upload your resume to get personalized feedback and improvement suggestions.
              </p>
              <Link to="/resume">
                <Button variant="outline" className="text-white border-white hover:bg-white/10" leftIcon={<FileText size={16} />}>
                  Upload Resume
                </Button>
              </Link>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activity & Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <InterviewHistoryCard sessions={sessions} />
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            <Card title="Performance Overview" className="h-full">
              <div className="space-y-4">
                <div className="h-40">
                  {/* This would be a chart in the real implementation */}
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-md">
                    <BarChart2 className="h-12 w-12 text-gray-400" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Your Strengths:</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Communication', 'Problem Solving', 'Technical Knowledge'].map((skill, i) => (
                      <span 
                        key={i}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Areas to Improve:</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Confidence', 'Conciseness', 'Body Language'].map((skill, i) => (
                      <span 
                        key={i}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="pt-2">
                  <Link to="/analytics" className="text-sm text-primary-600 hover:text-primary-700">
                    View detailed analytics →
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
};