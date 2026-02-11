import React from 'react';
import { User, Mail, Shield, Smartphone, Globe, Save } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Profile() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">User Profile</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-1"
        >
            <div className="glass-card p-6 text-center">
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-tr from-primary-500 to-accent-500 p-1 mb-4">
                    <img 
                        src="https://placehold.co/400x400/1e293b/FFF?text=JD" 
                        alt="Profile" 
                        className="w-full h-full rounded-full border-4 border-dark-card object-cover"
                    />
                </div>
                <h2 className="text-xl font-bold text-white">John Doe</h2>
                <p className="text-slate-400 text-sm mb-4">Full Stack Developer</p>
                
                <div className="flex justify-center gap-2 mb-6">
                    <span className="px-3 py-1 rounded-full bg-primary-500/10 text-primary-400 text-xs font-medium border border-primary-500/20">Pro Member</span>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-white">12</div>
                        <div className="text-xs text-slate-500 uppercase">Interviews</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-400">85%</div>
                        <div className="text-xs text-slate-500 uppercase">Avg Score</div>
                    </div>
                </div>
            </div>
        </motion.div>

        {/* Settings Form */}
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2"
        >
            <div className="glass-card p-8">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary-400" /> 
                    Personal Information
                </h3>
                
                <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input type="text" defaultValue="John Doe" className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary-500" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input type="email" defaultValue="john@example.com" className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary-500" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Bio</label>
                        <textarea rows="4" className="w-full bg-black/20 border border-white/10 rounded-lg p-4 text-sm focus:outline-none focus:border-primary-500" defaultValue="Passionate developer preparing for senior roles. Focused on system design and scaling large applications." />
                    </div>

                    <div className="pt-6 border-t border-white/5">
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-accent-400" /> 
                            Preferences
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                <div className="flex items-center gap-3">
                                    <Globe className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm">Public Profile</span>
                                </div>
                                <input type="checkbox" defaultChecked className="toggle" />
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm">Email Notifications</span>
                                </div>
                                <input type="checkbox" defaultChecked className="toggle" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="button" className="px-6 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-semibold transition-colors flex items-center gap-2">
                            <Save className="w-4 h-4" /> Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
      </div>
    </div>
  );
}
