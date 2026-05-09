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
        "p-4 rounded-xl border border-white/5 bg-white/5 cursor-pointer hover:border-primary-500/30 transition-all relative overflow-hidden group",
        selected && "border-primary-500 bg-primary-500/10"
      )}
    >
      <div className="flex items-start gap-4 mb-2">
        <div className={cn("p-2 rounded-lg transition-colors", selected ? "bg-primary-500 text-white" : "bg-white/10 text-slate-400 group-hover:text-white")}>
            <Icon className="w-5 h-5" />
        </div>
        <div>
            <h3 className={cn("font-medium transition-colors", selected ? "text-primary-300" : "text-slate-200")}>{title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed mt-1">{desc}</p>
        </div>
      </div>
      {selected && (
        <div className="absolute top-2 right-2 text-primary-500">
            <CheckCircle className="w-4 h-4 fill-current/20" />
          </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Configure Interview</h1>
        <p className="text-slate-400 mb-8">Customize your session to focus on what matters most.</p>

        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
                
                {/* Interview Type */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-300 uppercase tracking-wider">Interview Type</label>
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
                    <label className="text-sm font-medium text-slate-300 uppercase tracking-wider">Interview Mode</label>
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
                    <label className="text-sm font-medium text-slate-300 uppercase tracking-wider">Duration</label>
                    <div className="flex gap-3">
                        {[15, 30, 45, 60].map(mins => (
                            <button
                                key={mins}
                                onClick={() => setConfig({...config, duration: mins})}
                                className={cn(
                                    "flex-1 py-3 px-2 rounded-xl border font-medium text-sm transition-all",
                                    config.duration === mins 
                                        ? "bg-primary-600 border-primary-500 text-white shadow-lg shadow-primary-500/20" 
                                        : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
                                )}
                            >
                                {mins} min
                            </button>
                        ))}
                    </div>
                </div>

                 {/* Resume Upload - NEW */}
                 <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-300 uppercase tracking-wider">Resume (Optional)</label>
                    <ResumeUpload onUploadComplete={(file) => setResumeFile(file)} />
                </div>

            </div>

            <div className="space-y-6">
                 {/* Difficulty */}
                 <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-300 uppercase tracking-wider">Difficulty</label>
                    <div className="grid grid-cols-3 gap-3">
                        {['easy', 'medium', 'hard'].map(level => (
                            <button
                                key={level}
                                onClick={() => setConfig({...config, difficulty: level})}
                                className={cn(
                                    "capitalize py-3 rounded-xl border font-medium text-sm transition-all",
                                    config.difficulty === level 
                                        ? "bg-primary-500/10 border-primary-500 text-primary-400" 
                                        : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
                                )}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Summary Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-dark-card to-primary-900/10 border border-white/5 shadow-2xl mt-8">
                    <h3 className="font-semibold text-lg mb-4">Session Summary</h3>
                    <div className="space-y-3 text-sm text-slate-300">
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span>Type</span>
                            <span className="capitalize font-medium text-white">{config.type}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span>Difficulty</span>
                            <span className="capitalize font-medium text-white">{config.difficulty}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span>Duration</span>
                            <span className="font-medium text-white">{config.duration} min</span>
                        </div>
                        {resumeFile && (
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span>Resume</span>
                                <span className="font-medium text-green-400 truncate max-w-[150px]">{resumeFile.name}</span>
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={handleStart}
                        disabled={isLoading}
                        className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold shadow-lg shadow-primary-500/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" /> Starting...
                            </>
                        ) : (
                            <>
                                Start Session
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
