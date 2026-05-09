import React from 'react';
import { User, Mail, Shield, Smartphone, Globe, Save } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Profile() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="font-display text-5xl mb-8 text-ink">User Profile</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-1"
        >
            <div className="saylo-card p-8 text-center border-t-4 border-t-sayloAccent">
                <div className="w-32 h-32 mx-auto rounded-full bg-ink p-1 mb-4 relative">
                    <img 
                        src="https://placehold.co/400x400/F5F2EC/0A0A0B?text=JD" 
                        alt="Profile" 
                        className="w-full h-full rounded-full border-4 border-paper object-cover"
                    />
                </div>
                <h2 className="text-2xl font-bold text-ink">John Doe</h2>
                <p className="text-muted text-xs uppercase tracking-widest font-semibold mt-1 mb-4">Full Stack Developer</p>
                
                <div className="flex justify-center gap-2 mb-6">
                    <span className="px-3 py-1 bg-sayloAccent text-ink text-[10px] uppercase tracking-wider font-bold border border-ink/10">Pro Member</span>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-ink/10 pt-6">
                    <div className="text-center">
                        <div className="font-display text-3xl text-ink">12</div>
                        <div className="text-[10px] text-muted font-bold uppercase tracking-widest">Interviews</div>
                    </div>
                    <div className="text-center">
                        <div className="font-display text-3xl text-green-600">85%</div>
                        <div className="text-[10px] text-muted font-bold uppercase tracking-widest">Avg Score</div>
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
            <div className="saylo-card p-8">
                <h3 className="font-display text-3xl tracking-wide mb-6 flex items-center gap-3">
                    <User className="w-6 h-6 text-ink/50" /> 
                    Personal Information
                </h3>
                
                <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-widest text-ink/70">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/50" />
                                <input type="text" defaultValue="John Doe" className="w-full bg-white border border-ink/10 rounded-sm pl-10 pr-4 py-2.5 text-sm text-ink focus:outline-none focus:border-ink transition-colors" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-widest text-ink/70">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/50" />
                                <input type="email" defaultValue="john@example.com" className="w-full bg-white border border-ink/10 rounded-sm pl-10 pr-4 py-2.5 text-sm text-ink focus:outline-none focus:border-ink transition-colors" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-widest text-ink/70">Bio</label>
                        <textarea rows="4" className="w-full bg-white border border-ink/10 rounded-sm p-4 text-sm text-ink focus:outline-none focus:border-ink transition-colors" defaultValue="Passionate developer preparing for senior roles. Focused on system design and scaling large applications." />
                    </div>

                    <div className="pt-8 mt-8 border-t border-ink/10">
                        <h3 className="font-display text-3xl tracking-wide mb-6 flex items-center gap-3">
                            <Shield className="w-6 h-6 text-sayloAccent2" /> 
                            Preferences
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 bg-paper border border-ink/5">
                                <div className="flex items-center gap-3">
                                    <Globe className="w-5 h-5 text-ink/50" />
                                    <span className="text-sm font-semibold">Public Profile</span>
                                </div>
                                <input type="checkbox" defaultChecked className="toggle cursor-pointer" />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-paper border border-ink/5">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-ink/50" />
                                    <span className="text-sm font-semibold">Email Notifications</span>
                                </div>
                                <input type="checkbox" defaultChecked className="toggle cursor-pointer" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-8">
                        <button type="button" className="px-8 py-3 bg-ink hover:bg-ink/90 text-paper text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-2 group rounded-sm">
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
