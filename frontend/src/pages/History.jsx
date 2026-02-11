import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, BarChart2, ArrowRight, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function History() {
  const history = [
    { id: '1', type: 'Technical', title: 'Binary Tree Inversion', score: 85, date: 'Today, 2:30 PM', duration: '25m', difficulty: 'Medium' },
    { id: '2', type: 'Behavioral', title: 'Leadership Experience', score: 92, date: 'Yesterday', duration: '15m', difficulty: 'Easy' },
    { id: '3', type: 'Technical', title: 'System Design: URL Shortener', score: 78, date: 'Feb 1, 2024', duration: '45m', difficulty: 'Hard' },
    { id: '4', type: 'Technical', title: 'Two Sum', score: 100, date: 'Jan 30, 2024', duration: '10m', difficulty: 'Easy' },
    { id: '5', type: 'Behavioral', title: 'Conflict Resolution', score: 88, date: 'Jan 28, 2024', duration: '20m', difficulty: 'Medium' },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-3xl font-bold mb-2">Practice History</h1>
            <p className="text-slate-400">Review your past sessions and track improvement.</p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 flex items-center gap-2 transition-colors">
            <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white/5">
            <div className="col-span-5 md:col-span-4">Session Details</div>
            <div className="col-span-3 md:col-span-2">Type</div>
            <div className="col-span-2 hidden md:block">Duration</div>
            <div className="col-span-2 hidden md:block">Score</div>
            <div className="col-span-2 text-right">Action</div>
        </div>

        <div className="divide-y divide-white/5">
            {history.map((item, i) => (
                <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors group"
                >
                    <div className="col-span-5 md:col-span-4">
                        <div className="font-medium text-white group-hover:text-primary-300 transition-colors">{item.title}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                            <Calendar className="w-3 h-3" /> {item.date}
                        </div>
                    </div>
                    
                    <div className="col-span-3 md:col-span-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            item.type === 'Technical' 
                                ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' 
                                : 'bg-pink-500/10 text-pink-400 border-pink-500/20'
                        }`}>
                            {item.type}
                        </span>
                    </div>

                    <div className="col-span-2 hidden md:flex items-center text-sm text-slate-400">
                        <Clock className="w-4 h-4 mr-2" /> {item.duration}
                    </div>

                    <div className="col-span-2 hidden md:block">
                        <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full ${item.score >= 90 ? 'bg-emerald-500' : item.score >= 70 ? 'bg-primary-500' : 'bg-amber-500'}`}
                                    style={{ width: `${item.score}%` }}
                                />
                            </div>
                            <span className="text-sm font-bold text-white">{item.score}</span>
                        </div>
                    </div>

                    <div className="col-span-2 text-right">
                        <Link to={`/interview/${item.id}/results`}>
                            <button className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </Link>
                    </div>
                </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
}
