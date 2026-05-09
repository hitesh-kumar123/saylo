import React from 'react';
import { motion } from 'framer-motion';
import { Play, TrendingUp, Calendar, Clock, ArrowUpRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ title, value, label, trend, icon: Icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="glass-card p-6 relative overflow-hidden group"
  >
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon className="w-16 h-16 rotate-12" />
    </div>

    <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                <Icon className="w-5 h-5 text-slate-300" />
            </div>
            {trend && (
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                    <TrendingUp className="w-3 h-3" />
                    {trend}
                </div>
            )}
        </div>

        <h3 className="text-3xl font-bold text-white mb-1 group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 group-hover:bg-clip-text group-hover:text-transparent transition-all">
            {value}
        </h3>
        <p className="text-sm text-slate-400">{label}</p>
    </div>
  </motion.div>
);

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold mb-1">
              Welcome{user?.email ? `, ${user.email.split('@')[0]}` : ''}
            </h1>
            <p className="text-slate-400">Track your progress and practice daily.</p>
        </div>
        <Link to="/interview/setup">
            <button className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold shadow-lg shadow-primary-500/20 transition-all flex items-center gap-2 group">
                <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                Start New Interview
            </button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Interviews" value="12" label="Completed Sessions" trend="+2 this week" icon={Calendar} delay={0.1} />
        <StatCard title="Avg Score" value="8.5" label="Overall Rating" trend="+12%" icon={TrendingUp} delay={0.2} />
        <StatCard title="Time Spent" value="6.5h" label="Practice Time" icon={Clock} delay={0.3} />
        <StatCard title="Streak" value="5" label="Day Streak" trend="Keep it up!" icon={Zap} delay={0.4} />
      </div>

      {/* Recent Activity & Charts Area */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
            <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/20 flex items-center justify-center">
                                <span className="font-bold text-primary-400">DSA</span>
                            </div>
                            <div>
                                <h4 className="font-medium text-white">Binary Tree Traversal</h4>
                                <p className="text-xs text-slate-500">Technical • Medium • 2d ago</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <div className="text-sm font-bold text-white">9/10</div>
                                <div className="text-xs text-emerald-400">Excellent</div>
                            </div>
                            <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                                <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-6">Recommended</h3>
            <div className="space-y-3">
                {['System Design Basics', 'React Hooks Deep Dive', 'Behavioral: Leadership'].map((topic, i) => (
                    <div key={i} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 space-y-2 cursor-pointer transition-colors group">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium group-hover:text-primary-300 transition-colors">{topic}</span>
                            <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-primary-300 opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1">
                            <div className="bg-primary-500 h-1 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
                <div className="rounded-xl bg-gradient-to-r from-accent-500/20 to-primary-500/20 border border-accent-500/20 p-4">
                    <h4 className="text-sm font-semibold text-accent-300 mb-1">Pro Tip</h4>
                    <p className="text-xs text-slate-400">Practice "Tell me about yourself" to improve your intro score.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
