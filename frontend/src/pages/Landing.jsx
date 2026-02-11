import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, AlertCircle, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0b1120] text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Navbar - Minimal & Strict */}
      <nav className="border-b border-white/5 bg-[#0b1120]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-semibold text-lg tracking-tight text-slate-100">
            Saylo assessment
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login">
              <button className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                Sign In
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded shadow-sm transition-all">
                Start Practice
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex flex-col items-center pt-20 pb-20 px-6">
        
        {/* Hero Section - Left Aligned, Factual */}
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="text-left space-y-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.15]">
              Practice real interviews.<br />
              <span className="text-blue-400">Get measurable feedback.</span>
            </h1>
            
            <p className="text-lg text-slate-400 max-w-md leading-relaxed">
              AI-powered technical and behavioral simulation. 
              Receive an objective evaluation of your coding structure, communication clarity, and problem-solving approach.
            </p>

            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <button className="px-6 py-3 bg-white text-slate-900 font-semibold rounded hover:bg-slate-100 transition-colors flex items-center gap-2">
                  Begin Assessment
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
            
            <div className="pt-4 border-t border-white/5 flex gap-8 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-slate-600" /> System Design
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-slate-600" /> Algorithms
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-slate-600" /> Behavioral
                </div>
            </div>
          </div>

          {/* Dashboard Preview - "Proof of Work" UI */}
          <div className="w-full relative">
            {/* The UI Mockup Container */}
            <div className="rounded-lg border border-white/10 bg-[#0f172a] shadow-2xl p-1 overflow-hidden">
                {/* Fake App Window Header */}
                <div className="h-8 bg-[#1e293b] border-b border-white/5 flex items-center px-3 gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                    <div className="ml-4 text-[10px] text-slate-500 font-mono">/assessment/report/session-8291</div>
                </div>

                {/* Dashboard Content */}
                <div className="p-6 grid gap-6">
                    {/* Header Row */}
                    <div className="flex justify-between items-start border-b border-white/5 pb-6">
                        <div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Session Report</div>
                            <h3 className="text-xl font-semibold text-white">Full Stack Engineering - L4</h3>
                            <p className="text-xs text-slate-400 mt-1">Feb 02, 2026 • 45 mins</p>
                        </div>
                        <div className="text-right">
                             <div className="flex items-baseline gap-1 justify-end">
                                 <span className="text-3xl font-bold text-blue-400">72</span>
                                 <span className="text-sm text-slate-500">/100</span>
                             </div>
                             <div className="text-xs text-slate-400 mt-1">Passable</div>
                        </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-[#1e293b]/50 rounded border border-white/5">
                            <div className="flex justify-between mb-2">
                                <span className="text-xs font-medium text-slate-300">Technical Accuracy</span>
                                <span className="text-xs font-bold text-white">85%</span>
                            </div>
                            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full w-[85%]"></div>
                            </div>
                        </div>
                        <div className="p-3 bg-[#1e293b]/50 rounded border border-white/5">
                            <div className="flex justify-between mb-2">
                                <span className="text-xs font-medium text-slate-300">Communication</span>
                                <span className="text-xs font-bold text-white">60%</span>
                            </div>
                            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-yellow-500 h-full w-[60%]"></div>
                            </div>
                        </div>
                        <div className="p-3 bg-[#1e293b]/50 rounded border border-white/5">
                            <div className="flex justify-between mb-2">
                                <span className="text-xs font-medium text-slate-300">System Design</span>
                                <span className="text-xs font-bold text-white">40%</span>
                            </div>
                            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-red-500 h-full w-[40%]"></div>
                            </div>
                        </div>
                        <div className="p-3 bg-[#1e293b]/50 rounded border border-white/5">
                            <div className="flex justify-between mb-2">
                                <span className="text-xs font-medium text-slate-300">Code Style</span>
                                <span className="text-xs font-bold text-white">92%</span>
                            </div>
                            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full w-[92%]"></div>
                            </div>
                        </div>
                    </div>

                    {/* Feedback Notes */}
                    <div className="space-y-3">
                        <div className="flex gap-3 text-sm p-3 rounded bg-blue-500/5 border border-blue-500/10">
                            <div className="mt-0.5"><AlertCircle className="w-4 h-4 text-blue-400" /></div>
                            <div>
                                <span className="block font-medium text-blue-200 mb-1">Area for Improvement</span>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    Candidate paused significantly (2m 15s) when designing the database schema. 
                                    Suggested review: NoSQL vs SQL sharding strategies.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 text-sm p-3 rounded bg-white/5 border border-white/5">
                            <div className="mt-0.5"><CheckCircle className="w-4 h-4 text-emerald-500" /></div>
                            <div>
                                <span className="block font-medium text-slate-200 mb-1">Strength</span>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    Excellent handling of edge cases in the API rate limiter implementation.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle Reflection/Shadow */}
            <div className="absolute -inset-0.5 bg-gradient-to-tr from-blue-500/20 to-transparent opacity-20 blur-2xl -z-10"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
