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
    <div className="flex flex-col min-h-screen bg-gray-50">
      {!noHeader && <Header />}
      <main className="flex-grow">
        {(title || subtitle) && (
          <div className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              {title && (
                <motion.h1
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-gray-900"
                >
                  {title}
                </motion.h1>
              )}
              {subtitle && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="mt-1 text-sm text-gray-600"
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
          className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8"
        >
          {children}
        </motion.div>
      </main>
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} saylo.hire. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};