import React from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { HelpCircle, FileText, CheckCircle, ArrowRight } from 'lucide-react';
import { useInterviewStore } from '../../store/interviewStore';
import { motion } from 'framer-motion';

export const InterviewInstructions: React.FC = () => {
    const { config, startInterview, questions, isLoading } = useInterviewStore();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-3xl mx-auto"
        >
            <Card>
                <div className="p-4">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
                        AI Interview Instructions
                    </h2>

                    {/* Configuration Summary */}
                    <div className="bg-primary-50 dark:bg-primary-900/20 p-5 rounded-xl border border-primary-100 dark:border-primary-800 mb-8">
                        <h3 className="font-semibold text-lg text-primary-800 dark:text-primary-200 mb-4 text-center">
                            Session Configuration
                        </h3>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Role</span>
                                <span className="font-medium text-slate-900 dark:text-white capitalize">{config.role}</span>
                            </div>
                            <div className="flex flex-col border-l border-r border-primary-200 dark:border-primary-700">
                                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Type</span>
                                <span className="font-medium text-slate-900 dark:text-white capitalize">{config.type}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Difficulty</span>
                                <span className="font-medium text-slate-900 dark:text-white capitalize">{config.difficulty}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 mb-10">
                         {/* Stats Row */}
                        <div className="flex justify-center gap-8 text-slate-600 dark:text-slate-300 mb-6">
                             <div className="flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-primary-500" />
                                <span className="font-medium">{questions.length} Questions</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary-500" />
                                <span className="font-medium">Detailed Feedback</span>
                             </div>
                        </div>

                        {/* Rules List */}
                        <div className="space-y-3 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg">
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                                Rules & Guidelines:
                            </h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span>Each answer should be clear and structured.</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span>You can't go back to previous questions once submitted.</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span>The interview will end automatically after the last question.</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span>Take your time to think, but keep your answers concise.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <Button 
                            size="lg" 
                            onClick={startInterview} 
                            isLoading={isLoading}
                            rightIcon={<ArrowRight size={20} />}
                            className="w-full md:w-auto px-16 py-4 text-lg font-semibold shadow-xl shadow-primary-500/20 hover:shadow-primary-500/30"
                        >
                            Start Interview
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};
