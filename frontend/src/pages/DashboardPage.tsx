import React, { useEffect } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { StatCard } from '../components/dashboard/StatCard';
import { InterviewHistoryCard } from '../components/dashboard/InterviewHistoryCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Video, Award, Clock, TrendingUp, FileText, PieChart as PieChartIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInterviewStore } from '../store/interviewStore';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

export const DashboardPage: React.FC = () => {
  const { sessions, fetchSessions } = useInterviewStore();
  
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);
  
  // Derived stats from real data
  const completedSessions = sessions.filter(s => s.endTime && s.feedback);
  
  const recentStrengths = Array.from(new Set(
    completedSessions.flatMap(s => s.feedback?.strengths || [])
  )).slice(0, 3);

  const chartData = completedSessions
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(-5)
    .map(s => ({
        date: new Date(s.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: s.feedback?.overallScore || 0
    }));

  // Role Distribution for Pie Chart
  const roleDistribution = sessions.reduce((acc, session) => {
      const role = session.jobTitle || 'Unknown';
      acc[role] = (acc[role] || 0) + 1;
      return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(roleDistribution).map(([name, value]) => ({ name, value }));
  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const stats = {
    interviews: sessions.length,
    avgScore: completedSessions.length > 0 
      ? (completedSessions.reduce((sum, session) => sum + (session.feedback?.overallScore || 0), 0) / completedSessions.length).toFixed(1) 
      : '0.0',
    skillsImproved: recentStrengths.length > 0 ? recentStrengths : ['Practice to see improvements'],
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
            value="3h 45m" // This could also be calculated if we tracked duration properly
            icon={<Clock className="h-6 w-6" />}
            description="Across all sessions"
            delay={0.3}
          />
          <StatCard
            title="Skills Improved"
            value={recentStrengths.length}
            icon={<TrendingUp className="h-6 w-6" />}
            description={stats.skillsImproved.slice(0, 2).join(', ')}
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
            className="space-y-6"
          >
            {/* Performance Bar Chart */}
            <Card title="Performance Overview">
              <div className="space-y-6">
                <div className="h-40 w-full">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <XAxis dataKey="date" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    cursor={{fill: 'transparent'}}
                                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                />
                                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.score >= 7 ? '#10b981' : entry.score >= 5 ? '#f59e0b' : '#ef4444'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 dark:bg-dark-800 rounded-lg border border-dashed border-slate-200 dark:border-dark-700">
                             <TrendingUp className="h-8 w-8 mb-2 opacity-50" /> 
                             <span className="text-xs">No data yet</span>
                        </div>
                    )}
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-700 dark:text-dark-300">Your Strengths:</h4>
                  <div className="flex flex-wrap gap-2">
                    {recentStrengths.length > 0 ? recentStrengths.map((skill, i) => (
                      <span 
                        key={i}
                        className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800"
                      >
                        {skill}
                      </span>
                    )) : (
                        <span className="text-xs text-slate-500 italic">Complete interviews to see strengths</span>
                    )}
                  </div>
                </div>
                
                <div className="pt-2 border-t border-slate-100 dark:border-dark-700 mt-4">
                  <Link to="/interview/history" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium flex items-center gap-1 transition-colors">
                    View detailed analytics <TrendingUp size={14} />
                  </Link>
                </div>
              </div>
            </Card>

            {/* Practice Focus Pie Chart */}
            <Card title="Practice Focus" className="h-auto">
                <div className="h-48 w-full flex items-center justify-center">
                    {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend 
                                    verticalAlign="bottom" 
                                    height={36} 
                                    iconType="circle"
                                    formatter={(value) => <span className="text-xs text-slate-600 dark:text-slate-400">{value}</span>}
                                />
                                <Tooltip 
                                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                         <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 dark:bg-dark-800 rounded-lg border border-dashed border-slate-200 dark:border-dark-700">
                             <PieChartIcon className="h-8 w-8 mb-2 opacity-50" /> 
                             <span className="text-xs">No practice data</span>
                        </div>
                    )}
                </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
};