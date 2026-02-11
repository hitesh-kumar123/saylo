import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { Timer, Send, Lightbulb, CheckCircle, AlertCircle, Play, ChevronLeft, Mic } from 'lucide-react';
import { cn } from '../lib/utils';

export default function InterviewSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState('// Write your solution here\n\nfunction solve(n) {\n  \n}');
  const [timeLeft, setTimeLeft] = useState(1800); // 30 mins
  const [activeTab, setActiveTab] = useState('problem');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate AI analysis
    setTimeout(() => {
        setIsSubmitting(false);
        setFeedback({
            score: 85,
            strengths: ["Clean code structure", "Correct algorithm usage"],
            improvements: ["Add input validation", "Optimize space complexity"],
            status: "success"
        });
        setTimeout(() => {
            navigate(`/interview/${id}/results`);
        }, 3000);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-dark-bg text-white overflow-hidden">
      {/* Top Bar */}
      <header className="h-16 border-b border-white/5 bg-dark-card flex items-center justify-between px-6 z-20">
         <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
                <h1 className="font-semibold text-lg">Interview Session #{id.substring(0,6)}</h1>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="bg-primary-500/10 text-primary-400 px-2 py-0.5 rounded border border-primary-500/20">Technical</span>
                    <span className="bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded border border-yellow-500/20">Medium</span>
                </div>
            </div>
         </div>

         <div className="flex items-center gap-6">
            <div className={`flex items-center gap-2 font-mono text-xl font-medium ${timeLeft < 300 ? 'text-red-400 animate-pulse' : 'text-slate-200'}`}>
                <Timer className="w-5 h-5" />
                {formatTime(timeLeft)}
            </div>
            
            <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold transition-all flex items-center gap-2 shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? (
                    <>
                        <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Analyzing...
                    </>
                ) : (
                    <>
                        Submit Solution 
                        <Send className="w-4 h-4" />
                    </>
                )}
            </button>
         </div>
      </header>

      {/* Main Content - Split Screen */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Panel: Problem & Hints */}
        <div className="w-1/3 border-r border-white/5 flex flex-col bg-dark-card/30">
            <div className="flex border-b border-white/5">
                <button 
                    onClick={() => setActiveTab('problem')}
                    className={cn(
                        "flex-1 py-4 text-sm font-medium border-b-2 transition-colors",
                        activeTab === 'problem' 
                            ? "border-primary-500 text-primary-400 bg-primary-500/5" 
                            : "border-transparent text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                >
                    Problem Description
                </button>
                <button 
                    onClick={() => setActiveTab('hints')}
                    className={cn(
                        "flex-1 py-4 text-sm font-medium border-b-2 transition-colors",
                        activeTab === 'hints' 
                            ? "border-primary-500 text-primary-400 bg-primary-500/5" 
                            : "border-transparent text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                >
                    Hints & AI Chat
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'problem' ? (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Invert Binary Tree</h2>
                        <div className="prose prose-invert prose-sm max-w-none">
                            <p>Given the root of a binary tree, invert the tree, and return its root.</p>
                            
                            <h4>Example 1:</h4>
                            <pre className="bg-black/30 p-3 rounded-lg border border-white/10">
                                Input: root = [4,2,7,1,3,6,9]{"\n"}
                                Output: [4,7,2,9,6,3,1]
                            </pre>

                            <h4>Constraints:</h4>
                            <ul>
                                <li>The number of nodes in the tree is in the range [0, 100].</li>
                                <li>-100 &lt;= Node.val &lt;= 100</li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-primary-500/10 border border-primary-500/20 text-sm">
                            <h4 className="flex items-center gap-2 font-semibold text-primary-400 mb-2">
                                <Lightbulb className="w-4 h-4" /> Hint 1
                            </h4>
                            <p className="text-slate-300">Try thinking recursively. What do you need to do for each node?</p>
                        </div>
                        
                        {/* Mock Chat Interface */}
                         <div className="mt-8">
                             <h4 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">AI Assistant</h4>
                             <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-r-xl rounded-bl-xl text-sm text-slate-300">
                                        I'm here to help! If you get stuck, feel free to ask for a specific hint about recursion or tree traversal.
                                    </div>
                                </div>
                             </div>
                             
                             <div className="mt-4 relative">
                                <input 
                                    type="text" 
                                    placeholder="Ask for help..." 
                                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-primary-500/50"
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-lg text-slate-400">
                                    <Mic className="w-4 h-4" />
                                </button>
                             </div>
                         </div>
                    </div>
                )}
            </div>
        </div>

        {/* Right Panel: Code Editor */}
        <div className="flex-1 flex flex-col relative">
            <div className="h-10 bg-[#1e1e1e] border-b border-white/5 flex items-center px-4 justify-between">
                <span className="text-xs text-slate-400">main.js</span>
                <div className="flex items-center gap-2">
                    <button className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 hover:bg-white/10 rounded">
                        <Play className="w-3 h-3" /> Run Code
                    </button>
                </div>
            </div>
            <Editor
                height="100%"
                defaultLanguage="javascript"
                value={code}
                onChange={setCode}
                theme="vs-dark"
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    padding: { top: 16 },
                    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                }}
            />

            {/* Success Overlay */}
            <AnimatePresence>
                {feedback && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-6 left-6 right-6 bg-dark-card border border-green-500/30 shadow-2xl rounded-xl p-6 z-10 flex items-start gap-4 backdrop-blur-xl"
                    >
                        <div className="p-3 bg-green-500/20 rounded-full text-green-400">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Excellent Solution!</h3>
                            <p className="text-slate-300 mb-4">Your generic solution works perfectly for all edge cases.</p>
                            <div className="flex gap-2">
                                {feedback.strengths.map((s, i) => (
                                    <span key={i} className="text-xs font-medium px-2 py-1 bg-green-500/10 text-green-400 rounded border border-green-500/20">{s}</span>
                                ))}
                            </div>
                        </div>
                        <div className="ml-auto text-center">
                            <div className="text-3xl font-bold text-green-400">{feedback.score}</div>
                            <div className="text-xs text-slate-500 uppercase tracking-widest">Score</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
