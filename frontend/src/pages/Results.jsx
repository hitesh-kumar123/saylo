import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Home, Share2, Download, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

const data = [
  { name: 'Correctness', value: 85, color: '#10b981' },
  { name: 'Efficiency', value: 70, color: '#f59e0b' },
  { name: 'Style', value: 90, color: '#6366f1' },
];

const FeedbackCard = ({ title, items, type }) => (
  <div className={cn(
    "p-6 rounded-xl border",
    type === 'strength' ? "bg-green-500/5 border-green-500/20" : "bg-yellow-500/5 border-yellow-500/20"
  )}>
    <h3 className={cn(
        "font-semibold mb-4 flex items-center gap-2",
        type === 'strength' ? "text-green-400" : "text-yellow-400"
    )}>
        {type === 'strength' ? <CheckCircle className="w-5 h-5"/> : <AlertTriangle className="w-5 h-5"/>}
        {title}
    </h3>
    <ul className="space-y-3">
        {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                <span className={cn("mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0", type === 'strength' ? "bg-green-500" : "bg-yellow-500")} />
                {item}
            </li>
        ))}
    </ul>
  </div>
);

export default function Results() {
  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-3xl font-bold mb-2">Session Analysis</h1>
            <p className="text-slate-400">Interview #8X729 • Technical Round • Medium</p>
        </div>
        <div className="flex gap-3">
            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white transition-colors">
                <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white transition-colors">
                <Download className="w-5 h-5" />
            </button>
            <Link to="/dashboard">
                <button className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-semibold transition-all flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Dashboard
                </button>
            </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Score Card */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="md:col-span-1 glass-card p-8 flex flex-col items-center justify-center text-center relative overflow-hidden"
        >
             <div className="absolute top-0 left-0 w-full h-full bg-primary-500/5 blur-[80px]" />
             
             <div className="relative w-48 h-48 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={[{ value: 82 }, { value: 18 }]}
                            innerRadius={60}
                            outerRadius={80}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                        >
                            <Cell fill="#6366f1" />
                            <Cell fill="#334155" />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-white">82</span>
                    <span className="text-xs text-slate-400 uppercase tracking-widest mt-1">Excellent</span>
                </div>
             </div>
             
             <h3 className="text-lg font-medium text-white mb-2">Overall Score</h3>
             <p className="text-sm text-slate-400">Top 15% of candidates for this problem.</p>
        </motion.div>

        {/* Detailed Stats */}
         <div className="md:col-span-2 space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
                {data.map((stat, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="text-slate-400 text-sm mb-1">{stat.name}</div>
                        <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}%</div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${stat.value}%` }}
                                transition={{ delay: 0.5, duration: 1 }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: stat.color }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <FeedbackCard 
                    type="strength"
                    title="Key Strengths"
                    items={[
                        "Optimal time complexity O(n)",
                        "Clean and readable code structure",
                        "strong use of ES6+ features"
                    ]}
                />
                <FeedbackCard 
                    type="improvement"
                    title="Areas to Improve"
                    items={[
                        "Could improve edge case handling for null inputs",
                        "Add more comments for complex logic blocks"
                    ]}
                />
            </div>
         </div>
      </div>

      <div className="mt-8 flex justify-end">
         <button className="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors font-medium">
            View Suggested Study Material <ArrowRight className="w-4 h-4" />
         </button>
      </div>
    </div>
  );
}
