import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useParams } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Home, RotateCcw, CheckCircle, AlertTriangle, TrendingUp, Star, Target, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';

const FeedbackCard = ({ title, items, type }) => (
  <div className={cn(
    'p-6 rounded-sm border',
    type === 'strength' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
  )}>
    <h3 className={cn(
      'font-bold mb-4 flex items-center gap-2 text-xs uppercase tracking-widest',
      type === 'strength' ? 'text-green-700' : 'text-yellow-700'
    )}>
      {type === 'strength' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
      {title}
    </h3>
    <ul className="space-y-3">
      {(items || []).map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-sm font-medium text-ink/80">
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
  if (score >= 8) return '#16a34a'; // green-600
  if (score >= 6) return '#0A0A0B'; // ink
  if (score >= 4) return '#d97706'; // amber-600
  return '#dc2626'; // red-600
};

export default function Results() {
  const { id } = useParams();
  const location = useLocation();

  // Get feedback from navigation state (passed from InterviewSession)
  const feedback = location.state?.feedback || null;

  // Fallback if navigated directly without state
  if (!feedback) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center saylo-card mt-10">
        <div className="w-24 h-24 rounded-full bg-yellow-100 border border-yellow-200 flex items-center justify-center mx-auto mb-6">
          <Target className="w-12 h-12 text-yellow-600" />
        </div>
        <h1 className="font-display text-4xl mb-3 text-ink">Results Not Found</h1>
        <p className="text-muted font-medium mb-10">
          No feedback data was found for this session. The interview may not have been completed.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/dashboard">
            <button className="px-8 py-3 rounded-sm bg-ink hover:bg-ink/90 text-paper font-bold uppercase tracking-widest transition-all flex items-center gap-2 text-xs">
              <Home className="w-4 h-4" /> Dashboard
            </button>
          </Link>
          <Link to="/interview/setup">
            <button className="px-8 py-3 rounded-sm bg-white hover:bg-cream border border-ink/20 text-ink font-bold uppercase tracking-widest transition-all flex items-center gap-2 text-xs">
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
    <div className="max-w-5xl mx-auto py-10 px-4 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 pb-6 border-b border-ink/10">
        <div>
          <h1 className="font-display text-5xl mb-2 text-ink">Session Results</h1>
          <p className="text-sm font-bold uppercase tracking-widest text-muted mt-1">
            Session #{id?.substring(0, 6)} · {feedback.difficulty_trend ? `Trend: ${feedback.difficulty_trend}` : 'AI Interview'}
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/interview/setup">
            <button className="px-6 py-3 rounded-sm bg-paper hover:bg-white border border-ink/20 text-ink text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> Practice Again
            </button>
          </Link>
          <Link to="/dashboard">
            <button className="px-6 py-3 rounded-sm bg-ink hover:bg-ink/90 text-paper font-bold uppercase tracking-widest transition-all flex items-center gap-2 text-xs">
              <Home className="w-4 h-4" /> Dashboard
            </button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-8">
        {/* Score Donut */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="md:col-span-1 saylo-card p-8 flex flex-col items-center justify-center text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 blur-[80px] opacity-20" style={{ background: scoreColor }} />
          <div className="relative w-48 h-48 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={70}
                  outerRadius={90}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill={scoreColor} />
                  <Cell fill="#e5e5e5" /> {/* light gray track */}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-6xl text-ink leading-none">{overallScore}</span>
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">/10</span>
            </div>
          </div>
          <h3 className="font-display text-3xl tracking-wide text-ink">{scoreLabel}</h3>
          <p className="text-xs font-bold uppercase tracking-widest text-muted mt-2">Overall Score</p>
        </motion.div>

        {/* Stats */}
        <div className="md:col-span-2 space-y-6">
          {/* Verdict */}
          {feedback.final_verdict && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-sm bg-ink text-paper relative overflow-hidden"
            >
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-sayloAccent rounded-full blur-3xl opacity-20" />
              <div className="flex items-start gap-4 relative z-10">
                <Star className="w-6 h-6 text-sayloAccent flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-sayloAccent uppercase tracking-widest mb-3">Final Verdict</h4>
                  <p className="text-paper/90 text-sm leading-loose font-medium">{feedback.final_verdict}</p>
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
              className="p-6 rounded-sm bg-white border border-ink/10 flex items-center gap-4"
            >
              <TrendingUp className="w-6 h-6 text-ink/50" />
              <div>
                <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Difficulty Trend</span>
                <p className="text-sm font-bold text-ink capitalize mt-1">{feedback.difficulty_trend}</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
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
          className="saylo-card p-8"
        >
          <h3 className="font-display text-3xl tracking-wide text-ink mb-6 flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-ink/50" /> Actionable Improvement Tips
          </h3>
          <ul className="space-y-4">
            {feedback.improvement_tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-4 text-sm font-medium text-ink/80 leading-relaxed">
                <span className="mt-0.5 w-6 h-6 rounded-sm bg-cream border border-ink/10 text-ink text-xs flex items-center justify-center flex-shrink-0 font-bold font-display">
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
