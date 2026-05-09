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
        <Loader2 className="w-8 h-8 text-ink animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-ink/10">
        <div>
          <h1 className="font-display text-5xl mb-2 text-ink">Interview History</h1>
          <p className="text-sm font-medium text-muted uppercase tracking-widest">{sessions.length} sessions recorded</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/50" />
          <input
            type="text"
            placeholder="Search sessions..."
            className="bg-white border border-ink/10 rounded-sm pl-10 pr-4 py-2.5 text-sm text-ink focus:outline-none focus:border-ink w-full md:w-64 transition-colors"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-sm bg-red-100 border border-red-200 text-red-600 text-sm font-medium">
          {error}
        </div>
      )}

      {sessions.length === 0 && !error ? (
        <div className="text-center py-20 saylo-card">
          <Clock className="w-12 h-12 text-ink/30 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-ink mb-2">No interviews yet</h3>
          <p className="text-sm text-muted">Start your first interview to see your history here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session, i) => (
            <motion.div
              key={session.session_id || i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-5 rounded-sm bg-paper border border-ink/10 hover:border-ink/30 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cream border border-ink/10 flex items-center justify-center">
                  <span className="font-display text-xl text-ink">
                    {(session.role || 'INT')[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-ink group-hover:text-sayloAccent2 transition-colors">{session.role || 'Interview Session'}</h4>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted mt-1">
                    {session.difficulty || 'Medium'} • {session.status || 'Completed'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="font-display text-2xl text-ink leading-none">
                    {session.avg_score ? `${session.avg_score.toFixed(1)}/10` : '—'}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted mt-1">
                    {session.question_count || 0} questions
                  </div>
                </div>
                <div className="p-2 border border-ink/10 group-hover:bg-ink group-hover:text-paper transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
