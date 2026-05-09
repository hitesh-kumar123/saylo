import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, Book, Brain, Code, CheckCircle, ArrowRight, Loader2, Video, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';
import ResumeUpload from '../components/ResumeUpload';
import { api } from '../services/api';

export default function InterviewSetup() {
  const navigate = useNavigate();
  const [config, setConfig] = useState({
    type: 'technical',
    domain: 'frontend',
    difficulty: 'medium',
    duration: 30,
    mode: 'text'
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async () => {
    setIsLoading(true);
    try {
        // 1. Start Session
        // Use default 'Frontend Developer' role if domain is frontend. 
        // Ideally we should have a domain selector.
        const role = `${config.domain} developer`; 
        const sessionData = await api.startSession({ role, difficulty: config.difficulty });
        const sessionId = sessionData.session_id;

        // 2. Upload Resume if selected
        if (resumeFile) {
            try {
                await api.uploadResume(sessionId, resumeFile);
            } catch (err) {
                console.error("Failed to upload resume, proceeding anyway", err);
                // Optionally show toast/alert
            }
        }

        // Store first question so InterviewSession can display it immediately
        if (sessionData.message) {
            sessionStorage.setItem(`saylo_first_q_${sessionId}`, sessionData.message);
        }

        // 3. Navigate based on mode
        if (config.mode === 'video') {
            navigate(`/interview/${sessionId}/video`);
        } else {
            navigate(`/interview/${sessionId}`);
        }

    } catch (error) {
        console.error("Failed to start", error);
        alert("Failed to start interview. Please check backend.");
    } finally {
        setIsLoading(false);
    }
  };

  const SelectionCard = ({ selected, onClick, icon: Icon, title, desc }) => (
    <div 
      onClick={onClick}
      className={cn(
        "p-4 rounded-sm border cursor-pointer transition-all relative overflow-hidden group",
        selected ? "border-ink bg-ink text-paper" : "border-ink/10 bg-paper hover:border-ink/30 text-ink"
      )}
    >
      <div className="flex items-start gap-4 mb-2">
        <div className={cn("p-2 rounded-sm transition-colors", selected ? "bg-paper/10 text-paper" : "bg-ink/5 text-ink/60 group-hover:text-ink")}>
            <Icon className="w-5 h-5" />
        </div>
        <div>
            <h3 className="font-bold text-sm">{title}</h3>
            <p className={cn("text-xs leading-relaxed mt-1", selected ? "text-paper/70" : "text-muted")}>{desc}</p>
        </div>
      </div>
      {selected && (
        <div className="absolute top-3 right-3 text-sayloAccent">
            <CheckCircle className="w-4 h-4 fill-current/20" />
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-5xl mb-2 text-ink">Configure Interview</h1>
        <p className="text-sm font-medium text-muted uppercase tracking-widest mb-10">Customize your session to focus on what matters most.</p>

        <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-8">
                
                {/* Interview Type */}
                <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase tracking-widest text-ink/70">Interview Type</label>
                    <div className="grid grid-cols-1 gap-3">
                        <SelectionCard 
                            selected={config.type === 'technical'} 
                            onClick={() => setConfig({...config, type: 'technical'})}
                            icon={Code}
                            title="Technical Round"
                            desc="DSA, System Design, and specific languages."
                        />
                        <SelectionCard 
                            selected={config.type === 'behavioral'} 
                            onClick={() => setConfig({...config, type: 'behavioral'})}
                            icon={Brain}
                            title="Behavioral Round"
                            desc="Soft skills, leadership, and culture fit questions."
                        />
                    </div>
                </div>

                {/* Interview Mode */}
                <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase tracking-widest text-ink/70">Interview Mode</label>
                    <div className="grid grid-cols-2 gap-3">
                        <SelectionCard 
                            selected={config.mode === 'text'} 
                            onClick={() => setConfig({...config, mode: 'text'})}
                            icon={MessageSquare}
                            title="Text Chat"
                            desc="AI-powered text interview."
                        />
                        <SelectionCard 
                            selected={config.mode === 'video'} 
                            onClick={() => setConfig({...config, mode: 'video'})}
                            icon={Video}
                            title="Video Call"
                            desc="Jitsi-based live interview."
                        />
                    </div>
                </div>

                {/* Duration */}
                <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase tracking-widest text-ink/70">Duration</label>
                    <div className="flex gap-3">
                        {[15, 30, 45, 60].map(mins => (
                            <button
                                key={mins}
                                onClick={() => setConfig({...config, duration: mins})}
                                className={cn(
                                    "flex-1 py-3 px-2 rounded-sm border font-semibold text-sm transition-all",
                                    config.duration === mins 
                                        ? "bg-ink border-ink text-paper" 
                                        : "bg-paper border-ink/10 text-muted hover:bg-ink/5 hover:text-ink"
                                )}
                            >
                                {mins} min
                            </button>
                        ))}
                    </div>
                </div>

                 {/* Resume Upload - NEW */}
                 <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase tracking-widest text-ink/70">Resume (Optional)</label>
                    {/* Note: the ResumeUpload component itself may need styling updates later, but we wrap it here */}
                    <div className="bg-white border border-ink/10 rounded-sm p-4">
                      <ResumeUpload onUploadComplete={(file) => setResumeFile(file)} />
                    </div>
                </div>

            </div>

            <div className="space-y-8">
                 {/* Difficulty */}
                 <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase tracking-widest text-ink/70">Difficulty</label>
                    <div className="grid grid-cols-3 gap-3">
                        {['easy', 'medium', 'hard'].map(level => (
                            <button
                                key={level}
                                onClick={() => setConfig({...config, difficulty: level})}
                                className={cn(
                                    "capitalize py-3 rounded-sm border font-semibold text-sm transition-all",
                                    config.difficulty === level 
                                        ? "bg-ink/5 border-ink text-ink" 
                                        : "bg-paper border-ink/10 text-muted hover:bg-ink/5 hover:text-ink"
                                )}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Summary Card */}
                <div className="p-8 rounded-sm saylo-card mt-8">
                    <h3 className="font-display text-3xl tracking-wide mb-6">Session Summary</h3>
                    <div className="space-y-4 text-sm text-ink/80">
                        <div className="flex justify-between border-b border-ink/10 pb-3">
                            <span className="font-semibold uppercase tracking-widest text-xs">Type</span>
                            <span className="capitalize font-bold text-ink">{config.type}</span>
                        </div>
                        <div className="flex justify-between border-b border-ink/10 pb-3">
                            <span className="font-semibold uppercase tracking-widest text-xs">Difficulty</span>
                            <span className="capitalize font-bold text-ink">{config.difficulty}</span>
                        </div>
                        <div className="flex justify-between border-b border-ink/10 pb-3">
                            <span className="font-semibold uppercase tracking-widest text-xs">Duration</span>
                            <span className="font-bold text-ink">{config.duration} min</span>
                        </div>
                        {resumeFile && (
                            <div className="flex justify-between border-b border-ink/10 pb-3">
                                <span className="font-semibold uppercase tracking-widest text-xs">Resume</span>
                                <span className="font-bold text-green-600 truncate max-w-[150px]">{resumeFile.name}</span>
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={handleStart}
                        disabled={isLoading}
                        className="w-full mt-8 py-4 bg-ink hover:bg-ink/90 text-paper text-sm font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
                    >
                        <div className="absolute inset-0 bg-sayloAccent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out z-0"></div>
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin relative z-10" /> <span className="relative z-10 group-hover:text-ink">Starting...</span>
                            </>
                        ) : (
                            <>
                                <span className="relative z-10 group-hover:text-ink transition-colors">Start Session</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 group-hover:text-ink transition-all relative z-10" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
}
