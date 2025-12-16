import React from 'react';
import { Card } from '../ui/Card';
import { InterviewSession } from '../../types';
import { CalendarClock, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface InterviewHistoryCardProps {
  sessions: InterviewSession[];
}

export const InterviewHistoryCard: React.FC<InterviewHistoryCardProps> = ({ sessions }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };


  const calculateDuration = (startTime: string, endTime?: string) => {
    if (!endTime) return 'In progress';
    
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const durationMs = end - start;
    
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    
    return `${minutes}m ${seconds}s`;
  };

  return (
    <Card title="Recent Interviews" className="h-full">
      {sessions.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-slate-500 dark:text-dark-400">No interviews yet</p>
          <Link to="/interview" className="mt-2 inline-block text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
            Start your first interview
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.slice(0, 5).map((session, index) => (
            <motion.div 
              key={session.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex items-start p-3 rounded-md transition-colors ${
                index % 2 === 0 ? 'bg-slate-50 dark:bg-dark-800' : 'bg-transparent'
              }`}
            >
              <div className="flex-shrink-0 mt-1">
                <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400">
                  <CalendarClock size={16} />
                </div>
              </div>
              <div className="ml-3 flex-grow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{session.jobTitle}</p>
                    <p className="text-xs text-slate-500 dark:text-dark-400">{formatDate(session.startTime)}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-xs text-slate-500 dark:text-dark-400">
                      <Clock size={12} className="mr-1" />
                      {calculateDuration(session.startTime, session.endTime)}
                    </div>
                    {session.feedback && (
                      <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 dark:bg-primary-900/40 text-primary-800 dark:text-primary-200">
                        Score: {session.feedback.overallScore}/10
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          {sessions.length > 5 && (
            <div className="text-center pt-2">
              <Link to="/interview/history" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                View all interviews
              </Link>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};