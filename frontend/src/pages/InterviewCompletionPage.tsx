import React, { useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { BarChart2, CheckCircle, RefreshCw, Award, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInterviewStore } from '../store/interviewStore';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import { InterviewMetrics } from '../types';

export const InterviewCompletionPage: React.FC = () => {
    const { sessions, sessionId, resetInterview, questions } = useInterviewStore();
    const currentSession = sessions.find(s => s.id === sessionId);
    const [showFeedback, setShowFeedback] = useState(false);

    // Use feedback data from store or fallbacks
    const feedback = currentSession?.feedback || {
        overallScore: 0,
        strengths: [],
        weaknesses: [],
        detailedFeedback: "",
        recommendations: []
    };

    const handleRestart = () => {
        resetInterview();
    };

    return (
        <PageLayout title="Interview Completed" subtitle="Great job! You've finished the session.">
            <div className="max-w-4xl mx-auto py-8">
                
                {/* Completion Header */}
                {!showFeedback && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center py-12"
                    >
                        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/20">
                             <CheckCircle size={48} />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                            Interview Completed
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                            Your AI interview has ended. We've analyzed your responses and prepared a performance report for you.
                        </p>
                        <Button 
                            size="lg" 
                            onClick={() => setShowFeedback(true)} 
                            rightIcon={<BarChart2 size={20} />}
                            className="shadow-xl"
                        >
                            View Feedback Report
                        </Button>
                    </motion.div>
                )}

                {/* Feedback Report */}
                {showFeedback && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-8"
                    >
                        {/* Summary Section */}
                        <div className="text-center mb-8">
                             <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Performance Report</h2>
                             <p className="text-slate-600 dark:text-slate-400">Session ID: {currentSession?.id.slice(0, 8)}</p>
                        </div>
                        
                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white dark:bg-dark-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-dark-700">
                             
                             {/* Radar Chart */}
                             <div className="h-[300px] w-full flex justify-center items-center">
                                 <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                                        { subject: 'Eye Contact', A: (currentSession?.metrics?.eyeContact || 0) * 10, fullMark: 100 },
                                        { subject: 'Confidence', A: (currentSession?.metrics?.confidence || 0) * 10, fullMark: 100 },
                                        { subject: 'Clarity', A: (currentSession?.metrics?.clarity || 0) * 10, fullMark: 100 },
                                        { subject: 'Enthusiasm', A: (currentSession?.metrics?.enthusiasm || 0) * 10, fullMark: 100 },
                                        { subject: 'Posture', A: (currentSession?.metrics?.posture || 0) * 10, fullMark: 100 },
                                    ]}>
                                      <PolarGrid stroke="#cbd5e1" />
                                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                      <Radar
                                        name="You"
                                        dataKey="A"
                                        stroke="#4f46e5"
                                        strokeWidth={3}
                                        fill="#6366f1"
                                        fillOpacity={0.5}
                                      />
                                      <Tooltip 
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ color: '#4f46e5', fontWeight: 'bold' }}
                                      />
                                    </RadarChart>
                                  </ResponsiveContainer>
                             </div>

                             {/* Metrics Grid */}
                             <div className="grid grid-cols-2 gap-4">
                                 {/* Overall Score */}
                                 <div className="col-span-2 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl flex items-center justify-between">
                                     <div>
                                         <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold uppercase">Overall Score</p>
                                         <h3 className="text-3xl font-bold text-blue-700 dark:text-blue-300">{feedback.overallScore ? Math.round(feedback.overallScore) : 0}<span className="text-lg opacity-60">/10</span></h3>
                                     </div>
                                     <Award className="w-10 h-10 text-blue-500 opacity-80" />
                                 </div>

                                 <MetricBox label="Eye Contact" value={currentSession?.metrics?.eyeContact} color="text-emerald-600" bg="bg-emerald-50" />
                                 <MetricBox label="Confidence" value={currentSession?.metrics?.confidence} color="text-purple-600" bg="bg-purple-50" />
                                 <MetricBox label="Clarity" value={currentSession?.metrics?.clarity} color="text-amber-600" bg="bg-amber-50" />
                                 <MetricBox label="Enthusiasm" value={currentSession?.metrics?.enthusiasm} color="text-rose-600" bg="bg-rose-50" />
                             </div>
                        </div>

                        {/* Analysis Sections */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Strengths */}
                            <Card className="h-full">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    Strengths
                                </h3>
                                <ul className="space-y-3">
                                    {feedback.strengths && feedback.strengths.length > 0 ? (
                                        feedback.strengths.map((s, i) => (
                                            <li key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                                                <span>{s}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <p className="text-slate-500 text-sm italic">Analysis processing...</p>
                                    )}
                                </ul>
                            </Card>

                            {/* Improvements */}
                            <Card className="h-full">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                                    Areas for Improvement
                                </h3>
                                <ul className="space-y-3">
                                    {feedback.weaknesses && feedback.weaknesses.length > 0 ? (
                                        feedback.weaknesses.map((w, i) => (
                                            <li key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                                                <span>{w}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <p className="text-slate-500 text-sm italic">Analysis processing...</p>
                                    )}
                                </ul>
                            </Card>
                        </div>

                        {/* Summary Text */}
                        <Card className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
                             <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                                 Overall Summary
                             </h3>
                             <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                 {feedback.detailedFeedback || "You demonstrated a solid understanding of the core concepts. With more practice on structuring your answers concisely, you can improve your technical clarity score. Keep practicing!"}
                             </p>
                        </Card>

                        <div className="flex justify-center pt-8 pb-12">
                            <Button 
                                size="lg" 
                                onClick={handleRestart}
                                leftIcon={<RefreshCw size={20} />}
                                className="px-12"
                            >
                                Restart Interview
                            </Button>
                        </div>

                    </motion.div>
                )}
            </div>
        </PageLayout>
    );
};

const MetricBox = ({ label, value, color, bg }: { label: string, value?: number, color: string, bg: string }) => (
    <div className={`p-3 rounded-lg ${bg} dark:bg-opacity-10`}>
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">{label}</p>
        <p className={`text-xl font-bold ${color}`}>{value ? (value * 10).toFixed(0) : 0}%</p>
    </div>
);
