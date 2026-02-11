import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, History, User, LogOut, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const SidebarItem = ({ icon: Icon, label, href }) => {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Link 
      to={href}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
        isActive 
          ? "bg-primary-500/10 text-primary-400" 
          : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
      )}
    >
      {isActive && (
        <motion.div 
            layoutId="sidebar-active"
            className="absolute inset-0 bg-primary-500/10 rounded-xl border border-primary-500/20"
            initial={false}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <Icon className="w-5 h-5 relative z-10" />
      <span className="font-medium relative z-10">{label}</span>
      
      {isActive && (
         <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-primary-400 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
      )}
    </Link>
  );
};

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-dark-bg text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-dark-card/30 backdrop-blur-xl hidden md:flex flex-col fixed h-full z-20">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">S</div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Saylo.</span>
          </Link>
        </div>

        <div className="flex-1 px-4 space-y-2 py-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 mb-2">Menu</div>
          <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/dashboard" />
          <SidebarItem icon={PlusCircle} label="New Interview" href="/interview/setup" />
          <SidebarItem icon={History} label="History" href="/dashboard/history" />
          <SidebarItem icon={User} label="Profile" href="/profile" />
        </div>

        <div className="p-4 border-t border-white/5">
           <SidebarItem icon={Settings} label="Settings" href="/settings" />
           <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors mt-1">
             <LogOut className="w-5 h-5" />
             <span className="font-medium">Sign Out</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 relative">
         <div className="absolute top-0 left-0 w-full h-96 bg-primary-500/5 blur-[100px] pointer-events-none" />
        
        {/* Mobile Header */}
        <header className="md:hidden h-16 border-b border-white/5 flex items-center justify-between px-4 glass sticky top-0 z-30">
             <span className="font-bold">Saylo.</span>
             {/* Mobile Menu Trigger would go here */}
        </header>

        <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
