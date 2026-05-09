import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Clock, Settings, LogOut, Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Clock, label: 'History', path: '/history' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-paper text-ink flex font-sans">
      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-30 w-64 bg-cream border-r border-ink/10 flex flex-col transition-transform lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-ink/10">
          <span className="font-display text-2xl tracking-wide">
            SAY<span className="text-muted italic font-serif lowercase">lo</span>
          </span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 hover:bg-ink/5 rounded-sm">
            <X className="w-5 h-5 text-ink" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(({ icon: Icon, label, path }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-semibold uppercase tracking-wider transition-all",
                location.pathname === path
                  ? "bg-ink text-paper"
                  : "text-muted hover:text-ink hover:bg-ink/5"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-ink/10 bg-warm/30">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <div className="w-8 h-8 rounded-sm bg-ink flex items-center justify-center text-sm font-bold text-paper font-display">
              {user?.email?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-ink truncate">{user?.email || 'User'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-semibold uppercase tracking-wider text-muted hover:text-red-600 hover:bg-red-50 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-ink/20 backdrop-blur-sm z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen relative">
        <header className="h-16 bg-paper/80 backdrop-blur-md border-b border-ink/10 flex items-center px-6 lg:hidden sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-ink/5 rounded-sm">
            <Menu className="w-5 h-5 text-ink" />
          </button>
          <span className="ml-4 font-display text-xl tracking-wide">
            SAY<span className="text-muted italic font-serif lowercase">lo</span>
          </span>
        </header>
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
