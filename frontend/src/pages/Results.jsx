import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useParams } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Home, RotateCcw, CheckCircle, AlertTriangle, TrendingUp, Star, Target, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';

const FeedbackCard = ({ title, items, type }) => (
  <div className={cn(
    'p-5 rounded-xl border',
    type === 'strength' ? 'bg-green-500/5 border-green-500/20' : 'bg-yellow-500/5 border-yellow-500/20'
  )}>
    <h3 className={cn(
      'font-semibold mb-3 flex items-center gap-2 text-sm uppercase tracking-wider',
      type === 'strength' ? 'text-green-400' : 'text-yellow-400'
    )}>
      {type === 'strength' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
      {title}
    </h3>
    <ul className="space-y-2">
      {(items || []).map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
          <span className={cn(
            'mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0',
            type === 'strength' ? 'bg-green-500' : 'bg-yellow-500'
          )} />
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const getScoreLabel = (score) => {
  if (score >= 8) return 'Excellent';
  if (score >= 6) return 'Good';
  if (score >= 4) return 'Average';
  return 'Needs Work';
};

const getScoreColor = (score) => {
  if (score >= 8) return '#10b981';
  if (score >= 6) return '#6366f1';
  if (score >= 4) return '#f59e0b';
  return '#ef4444';
};

export default function Results() {
  const { id } = useParams();
  const location = useLocation();

  // Get feedback from navigation state (passed from InterviewSession)
  const feedback = location.state?.feedback || null;

  // Fallback if navigated directly without state
  if (!feedback) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto mb-6">
          <Target className="w-10 h-10 text-yellow-400" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Results Not Found</h1>
        <p className="text-slate-400 mb-8">
          No feedback data was found for this session. The interview may not have been completed.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/dashboard">
            <button className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold transition-all flex items-center gap-2">
              <Home className="w-4 h-4" /> Dashboard
            </button>
          </Link>
          <Link to="/interview/setup">
            <button className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-semibold transition-all flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const overallScore = feedback.overall_score ?? 0;
  const scoreColor = getScoreColor(overallScore);
  const scoreLabel = getScoreLabel(overallScore);
  const pieData = [{ value: overallScore * 10 }, { value: 100 - overallScore * 10 }];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Session Results</h1>
          <p className="text-slate-400">
            Session #{id?.substring(0, 6)} · {feedback.difficulty_trend ? `Trend: ${feedback.difficulty_trend}` : 'AI Interview'}
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/interview/setup">
            <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 text-sm font-medium transition-all flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> Practice Again
            </button>
          </Link>
          <Link to="/dashboard">
            <button className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-semibold transition-all flex items-center gap-2 text-sm">
              <Home className="w-4 h-4" /> Dashboard
            </button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {/* Score Donut */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="md:col-span-1 bg-white/[0.04] border border-white/[0.07] rounded-2xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 blur-[80px]" style={{ background: `${scoreColor}10` }} />
          <div className="relative w-44 h-44 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={58}
                  outerRadius={78}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                >
                  <Cell fill={scoreColor} />
                  <Cell fill="#1e293b" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-white">{overallScore}</span>
              <span className="text-xs text-slate-400 uppercase tracking-widest mt-1">/10</span>
            </div>
          </div>
          <h3 className="text-lg font-bold text-white">{scoreLabel}</h3>
          <p className="text-sm text-slate-400 mt-1">Overall Score</p>
        </motion.div>

        {/* Stats */}
        <div className="md:col-span-2 space-y-4">
          {/* Verdict */}
          {feedback.final_verdict && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-5 rounded-xl bg-primary-500/10 border border-primary-500/20"
            >
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-primary-300 uppercase tracking-wider mb-1">Final Verdict</h4>
                  <p className="text-slate-200 text-sm leading-relaxed">{feedback.final_verdict}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Difficulty trend */}
          {feedback.difficulty_trend && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3"
            >
              <TrendingUp className="w-5 h-5 text-slate-400" />
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider">Difficulty Trend</span>
                <p className="text-sm font-medium text-white capitalize">{feedback.difficulty_trend}</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <FeedbackCard type="strength" title="Key Strengths" items={feedback.strengths} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <FeedbackCard type="improvement" title="Areas to Improve" items={feedback.weaknesses} />
        </motion.div>
      </div>

      {/* Improvement Tips */}
      {feedback.improvement_tips?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]"
        >
          <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
            <MessageSquare className="w-4 h-4 text-primary-400" /> Actionable Improvement Tips
          </h3>
          <ul className="space-y-3">
            {feedback.improvement_tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="mt-1 w-5 h-5 rounded-full bg-primary-500/20 text-primary-400 text-xs flex items-center justify-center flex-shrink-0 font-bold">
                  {i + 1}
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}
