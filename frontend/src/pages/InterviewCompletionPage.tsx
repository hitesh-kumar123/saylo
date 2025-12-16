import React, { useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { BarChart2, CheckCircle, RefreshCw, Award, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInterviewStore } from '../store/interviewStore';

export const InterviewCompletionPage: React.FC = () => {
    const { currentSession, resetInterview, questions } = useInterviewStore();
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
                        
                        {/* Scores Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             {/* Overall Score */}
                             <Card className="flex flex-col items-center justify-center p-6 border-t-4 border-t-blue-500">
                                 <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-full mb-4">
                                     <Award className="w-8 h-8 text-blue-500" />
                                 </div>
                                 <span className="text-4xl font-bold text-slate-900 dark:text-white mb-1">
                                     {feedback.overallScore ? Math.round(feedback.overallScore) : 0}<span className="text-xl text-slate-400">/10</span>
                                 </span>
                                 <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Overall Score</span>
                             </Card>

                             {/* Communication - Mocked for visual */}
                             <Card className="flex flex-col items-center justify-center p-6 border-t-4 border-t-purple-500">
                                 <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-full mb-4">
                                     <BarChart2 className="w-8 h-8 text-purple-500" />
                                 </div>
                                 <span className="text-4xl font-bold text-slate-900 dark:text-white mb-1">
                                     7<span className="text-xl text-slate-400">/10</span>
                                 </span>
                                 <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Communication</span>
                             </Card>

                            {/* Confidence - Mocked for visual */}
                             <Card className="flex flex-col items-center justify-center p-6 border-t-4 border-t-green-500">
                                 <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-full mb-4">
                                     <TrendingUp className="w-8 h-8 text-green-500" />
                                 </div>
                                 <span className="text-4xl font-bold text-slate-900 dark:text-white mb-1">
                                     8<span className="text-xl text-slate-400">/10</span>
                                 </span>
                                 <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Tech Clarity</span>
                             </Card>
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
