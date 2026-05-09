import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowUpRight, Search, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export default function History() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await api.getInterviewHistory();
        setSessions(data);
      } catch (err) {
        setError('Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Interview History</h1>
          <p className="text-slate-400">{sessions.length} sessions recorded</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search sessions..."
            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary-500/50 w-full md:w-64"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {sessions.length === 0 && !error ? (
        <div className="text-center py-16">
          <Clock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-400 mb-2">No interviews yet</h3>
          <p className="text-sm text-slate-500">Start your first interview to see your history here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session, i) => (
            <motion.div
              key={session.session_id || i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400 font-bold text-sm">
                  {(session.role || 'INT')[0].toUpperCase()}
                </div>
                <div>
                  <h4 className="font-medium text-white">{session.role || 'Interview Session'}</h4>
                  <p className="text-xs text-slate-500">
                    {session.difficulty || 'Medium'} • {session.status || 'Completed'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-bold text-white">
                    {session.avg_score ? `${session.avg_score.toFixed(1)}/10` : '—'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {session.question_count || 0} questions
                  </div>
                </div>
                <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
