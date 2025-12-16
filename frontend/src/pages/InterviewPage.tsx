import React, { useEffect } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Video, Settings, BookOpen, ArrowRight, BrainCircuit, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInterviewStore } from '../store/interviewStore';
import { InterviewSetup } from '../components/interview/InterviewSetup';
import { InterviewInstructions } from '../components/interview/InterviewInstructions';
import { InterviewSession } from '../components/interview/InterviewSession';
import { InterviewFeedbackPage } from './InterviewFeedbackPage';
import { InterviewCompletionPage } from './InterviewCompletionPage';

// Sub-components can be extracted, but definitions inline for clarity of "Views"

const LandingView: React.FC = () => {
  const { goToSetup } = useInterviewStore();

  return (
    <PageLayout title="AI Interview Simulator" subtitle="Master your interview skills with AI-powered practice">
      <div className="max-w-4xl mx-auto space-y-12 py-8">
        
        {/* Hero Section */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
        >
            <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <BrainCircuit size={40} />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
                Ready to ace your next interview?
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Practice with our advanced AI interviewer. Get real-time feedback on your technical knowledge, communication skills, and more.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button 
                    size="lg" 
                    onClick={goToSetup}
                    rightIcon={<ArrowRight size={24} />}
                    className="w-full sm:w-auto px-12 py-4 text-lg font-semibold shadow-xl shadow-primary-500/20 hover:shadow-primary-500/30 transition-all"
                >
                    Start AI Interview
                </Button>
            </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
                icon={<Settings className="text-blue-500" />}
                title="Customizable"
                description="Choose your role, difficulty, and interview type to match your goals."
                delay={0.1}
            />
            <FeatureCard 
                icon={<Video className="text-purple-500" />}
                title="Realistic Flow"
                description="Experience a structured interview environment with timed questions."
                delay={0.2}
            />
            <FeatureCard 
                icon={<BookOpen className="text-green-500" />}
                title="Instant Feedback"
                description="Receive detailed analysis of your answers and tips for improvement."
                delay={0.3}
            />
        </div>
      </div>
    </PageLayout>
  );
};

const FeatureCard = ({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.3 }}
    >
        <Card className="h-full hover:shadow-lg transition-shadow border-t-4 border-t-primary-500">
            <div className="bg-slate-50 dark:bg-slate-900/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                {React.cloneElement(icon as React.ReactElement, { size: 24 })}
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
        </Card>
    </motion.div>
);

export const InterviewPage: React.FC = () => {
  const { interviewStatus, resetInterview } = useInterviewStore();

  // Handle unmount or route change if needed, but for now we purely rely on status
  // Ideally reset when leaving? 
  // useEffect(() => { return () => resetInterview(); }, []); 
  // User might want to persist if they navigate away? 
  // Let's assume persistence is handled by store state staying alive.

  switch (interviewStatus) {
    case 'idle':
        return <LandingView />;
    case 'setup':
        return (
            <PageLayout title="Interview Setup" subtitle="Configure your practice session">
                <InterviewSetup />
            </PageLayout>
        );
    case 'instructions':
        return (
            <PageLayout title="Instructions" subtitle="Please read carefully before starting">
                <InterviewInstructions />
            </PageLayout>
        );
    case 'live':
        // Session handles its own layout mostly, but we wrap it provided container
        return (
            <PageLayout noHeader>
               <div className="h-screen -mt-6">
                 <InterviewSession />
               </div>
            </PageLayout>
        );
    case 'completed':
        // We can show CompletionPage or FeedbackPage
        // The prompt says "completed -> Feedback Screen"
        // But we have an InterviewCompletionPage designated.
        // Let's use InterviewCompletionPage which links to Feedback/Dashboard?
        // OR render Feedback directly?
        // User map: "completed -> Feedback Screen"
        // Let's check InterviewFeedbackPage. It relies on location state or sessions.
        // InterviewCompletionPage is the success message.
        // I will stick to CompletionPage as the immediate "Finished" state, 
        // which gives options to "View Report" or "Home". 
        // If "View Report" is clicked, it goes to Feedback. 
        // BUT Feedback is a separate page usually?
        // If the user strictly wants ONE route, I should include Feedback here.
        // However, Feedback might need to be shareable / accessible later.
        // Let's render CompletionPage here for "completed" state.
        return <InterviewCompletionPage />;
        
    default:
        return <LandingView />;
  }
};