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
    className="saylo-card p-6 relative overflow-hidden group"
  >
    <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
        <Icon className="w-24 h-24 rotate-12 text-ink" />
    </div>

    <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-paper border border-ink/10">
                <Icon className="w-5 h-5 text-ink/70" />
            </div>
            {trend && (
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-100 px-2 py-1 border border-green-200">
                    <TrendingUp className="w-3 h-3" />
                    {trend}
                </div>
            )}
        </div>

        <h3 className="font-display text-5xl text-ink mb-1 group-hover:text-sayloAccent2 transition-colors">
            {value}
        </h3>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">{label}</p>
    </div>
  </motion.div>
);

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-10 pb-10">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-ink/10">
        <div>
            <h1 className="font-display text-5xl mb-2 text-ink">
              Welcome{user?.email ? `, ${user.email.split('@')[0]}` : ''}
            </h1>
            <p className="text-sm font-medium text-muted uppercase tracking-widest">Track your progress and practice daily.</p>
        </div>
        <Link to="/interview/setup">
            <button className="px-8 py-4 bg-ink hover:bg-ink/90 text-paper text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-3 group relative overflow-hidden">
                <div className="absolute inset-0 bg-sayloAccent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out z-0"></div>
                <Play className="w-4 h-4 fill-current relative z-10 group-hover:text-ink transition-colors" />
                <span className="relative z-10 group-hover:text-ink transition-colors">Start New Interview</span>
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
        <div className="lg:col-span-2 saylo-card p-8">
            <h3 className="font-display text-2xl tracking-wide mb-6">Recent Activity</h3>
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-paper border border-ink/5 hover:border-ink/20 transition-colors group cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-cream border border-ink/10 flex items-center justify-center">
                                <span className="font-display text-xl text-ink">DSA</span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-ink group-hover:text-sayloAccent2 transition-colors">Binary Tree Traversal</h4>
                                <p className="text-[11px] font-bold uppercase tracking-widest text-muted mt-1">Technical • Medium • 2d ago</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <div className="font-display text-2xl text-ink leading-none">9/10</div>
                                <div className="text-[10px] font-bold uppercase tracking-wider text-green-600 mt-1">Excellent</div>
                            </div>
                            <div className="p-2 border border-ink/10 group-hover:bg-ink group-hover:text-paper transition-colors">
                                <ArrowUpRight className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="saylo-card p-8 flex flex-col">
            <h3 className="font-display text-2xl tracking-wide mb-6">Recommended</h3>
            <div className="space-y-4 flex-1">
                {['System Design Basics', 'React Hooks Deep Dive', 'Behavioral: Leadership'].map((topic, i) => (
                    <div key={i} className="p-4 bg-paper hover:bg-white border border-ink/5 hover:border-ink/20 space-y-3 cursor-pointer transition-colors group">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-ink group-hover:text-sayloAccent2 transition-colors">{topic}</span>
                            <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-sayloAccent2 transition-colors" />
                        </div>
                        <div className="w-full bg-cream h-1.5">
                            <div className="bg-ink h-1.5" style={{ width: `${Math.max(20, 100 - i * 30)}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-8 border-t border-ink/10">
                <div className="bg-ink text-paper p-6 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-sayloAccent rounded-full blur-2xl opacity-20"></div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-sayloAccent mb-2 relative z-10">Pro Tip</h4>
                    <p className="text-sm font-medium leading-relaxed relative z-10">Practice "Tell me about yourself" to improve your intro score before your next mock.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
