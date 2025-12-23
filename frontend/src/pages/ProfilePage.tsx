import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { User } from "../types";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, User as UserIcon, Shield, BarChart2, Clock, Award, Settings, LogOut, Camera } from "lucide-react";
import { Button } from "../components/ui/Button";
import { PageLayout } from "../components/layout/PageLayout";

export const ProfilePage: React.FC = () => {
  const { user: storeUser, logout, isAuthenticated } = useAuthStore();
  const [user, setUser] = useState<User | null>(storeUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (storeUser) {
      setUser(storeUser);
    } else if (!isAuthenticated) {
      navigate("/login");
    }
  }, [storeUser, isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  // Mock stats
  const stats = [
    { label: "Interviews", value: "12", icon: <VideoIcon className="text-blue-600 dark:text-blue-400" size={20} /> },
    { label: "Avg. Score", value: "85%", icon: <BarChart2 className="text-green-600 dark:text-green-400" size={20} /> },
    { label: "Practice Time", value: "4.5h", icon: <Clock className="text-purple-600 dark:text-purple-400" size={20} /> },
    { label: "Streak", value: "3 Days", icon: <Award className="text-orange-600 dark:text-orange-400" size={20} /> },
  ];

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5">
              <ArrowLeft size={20} className="mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-1"
          >
            <div className="bg-white dark:bg-slate-900/30 dark:backdrop-blur-lg rounded-2xl p-6 border border-slate-200 dark:border-white/10 text-center relative overflow-hidden shadow-md dark:shadow-none">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary-600 to-secondary-600 opacity-20" />
              
              <div className="relative z-10">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 p-1 mb-4 shadow-xl shadow-primary-500/20">
                  <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-3xl font-bold text-slate-800 dark:text-white relative group cursor-pointer">
                    {(user.name || user.email || "U").charAt(0).toUpperCase()}
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera size={20} className="text-white" />
                    </div>
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{user.name || user.email.split('@')[0]}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{user.email}</p>
                
                <div className="flex justify-center gap-2 mb-6">
                  <span className="px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20 text-xs text-primary-700 dark:text-primary-300 font-medium flex items-center gap-1">
                    <Shield size={12} />
                    Free Plan
                  </span>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-300"
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Details & Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 space-y-6"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                  <div className="mb-2 bg-slate-100 dark:bg-slate-800/50 w-8 h-8 rounded-lg flex items-center justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Account Settings Placeholder */}
            <div className="bg-white dark:bg-slate-900/30 rounded-2xl p-6 border border-slate-200 dark:border-white/10 shadow-md dark:shadow-none">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Settings size={20} className="text-slate-600 dark:text-slate-400" />
                Account Settings
              </h3>
              
              <div className="space-y-4">
                <div className="group p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-primary-500/30 transition-colors cursor-pointer flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors shadow-sm dark:shadow-none border border-slate-200 dark:border-transparent">
                      <UserIcon size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white">Personal Information</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">Update your name and profile details</div>
                    </div>
                  </div>
                  <div className="text-slate-400 dark:text-slate-500 group-hover:text-primary-600 dark:group-hover:text-white transition-colors">→</div>
                </div>

                <div className="group p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-primary-500/30 transition-colors cursor-pointer flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors shadow-sm dark:shadow-none border border-slate-200 dark:border-transparent">
                      <Mail size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white">Email Preferences</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">Manage your notifications</div>
                    </div>
                  </div>
                  <div className="text-slate-400 dark:text-slate-500 group-hover:text-primary-600 dark:group-hover:text-white transition-colors">→</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
};

// Helper component for the stats icon since Video is imported from lucide-react but used as VideoIcon to avoid conflict if needed, 
// though here I can just import Video directly.
import { Video as VideoIcon } from "lucide-react";

