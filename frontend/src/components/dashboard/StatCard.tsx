import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-white dark:bg-dark-900 rounded-lg shadow-md p-6 border border-gray-100 dark:border-dark-700"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400">
            {icon}
          </div>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">{title}</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-3xl font-semibold text-slate-900 dark:text-white">{value}</p>
            {trend && trendValue && (
              <p 
                className={`ml-2 text-sm font-medium ${
                  trend === 'up' 
                    ? 'text-green-600 dark:text-green-400' 
                    : trend === 'down' 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {trend === 'up' && '↑ '}
                {trend === 'down' && '↓ '}
                {trendValue}
              </p>
            )}
          </div>
          {description && <p className="mt-1 text-sm text-slate-500 dark:text-dark-400">{description}</p>}
        </div>
      </div>
    </motion.div>
  );
};