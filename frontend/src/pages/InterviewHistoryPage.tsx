import React, { useEffect } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { Card } from '../components/ui/Card';
import { useInterviewStore } from '../store/interviewStore';
import { CalendarClock, Clock, ArrowRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const InterviewHistoryPage: React.FC = () => {
  const { sessions, fetchSessions } = useInterviewStore();

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDuration = (startTime: string, endTime?: string) => {
    if (!endTime) return 'In progress';
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const durationMs = end - start;
    const minutes = Math.floor(durationMs / 60000);
    return `${minutes}m ${Math.floor((durationMs % 60000) / 1000)}s`;
  };

  return (
    <PageLayout title="Interview History" subtitle="Review your past performance and track your progress.">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Search/Filter Placeholder */}
        <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search by job title..." 
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-800 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                />
            </div>
        </div>

        {sessions.length === 0 ? (
          <Card className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarClock className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No interviews yet</h3>
            <p className="text-gray-500 mb-6">Start your first AI interview to see your history here.</p>
            <Link to="/interview" className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
              Start Interview
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {sessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                  <Link to="/interview/feedback" state={{ interviewId: session.id }}>
                    <Card hover className="group cursor-pointer border-l-4 border-l-primary-500">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-900/40 transition-colors">
                            <CalendarClock className="text-primary-600 dark:text-primary-400" size={24} />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                              {session.jobTitle}
                            </h3>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                              <span>{formatDate(session.startTime)}</span>
                              <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {calculateDuration(session.startTime, session.endTime)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                            {session.feedback && (
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {session.feedback.overallScore}/10
                                    </div>
                                    <div className="text-xs text-gray-500 uppercase font-medium">Score</div>
                                </div>
                            )}
                            <ArrowRight className="text-gray-300 group-hover:text-primary-500 transition-colors" />
                        </div>
                      </div>
                    </Card>
                  </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};
