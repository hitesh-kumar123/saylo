import React from 'react';
import { Header } from './Header';
import { motion } from 'framer-motion';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  noHeader?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  subtitle,
  noHeader = false,
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {!noHeader && <Header />}
      <main className={`flex-grow relative ${!noHeader ? 'pt-16' : ''}`}>
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-200/30 dark:bg-primary-900/20 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary-200/30 dark:bg-secondary-900/20 blur-[100px]" />
        </div>

        {(title || subtitle) && (
          <div className="border-b border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
              {title && (
                <motion.h1
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight"
                >
                  {title}
                </motion.h1>
              )}
              {subtitle && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="mt-2 text-lg text-slate-600 dark:text-slate-400"
                >
                  {subtitle}
                </motion.p>
              )}
            </div>
          </div>
        )}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
        >
          {children}
        </motion.div>
      </main>
      <footer className="border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} saylo.hire. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};