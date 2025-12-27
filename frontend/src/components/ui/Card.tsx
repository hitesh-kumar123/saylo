import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  icon,
  children,
  footer,
  className = '',
  hover = false,
}) => {
  return (
    <div 
      className={`
        bg-white dark:bg-dark-900 rounded-lg shadow-md overflow-hidden
        border border-gray-100 dark:border-dark-700
        ${hover ? 'transition-all duration-200 hover:shadow-lg hover:-translate-y-1 dark:hover:border-primary-500/30' : ''}
        ${className}
      `}
    >
      {(title || subtitle || icon) && (
        <div className="px-6 py-4 border-b border-gray-100 dark:border-dark-700 flex items-center gap-3">
          {icon && <div className="p-2 bg-primary-50 dark:bg-primary-900/10 rounded-lg">{icon}</div>}
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">{title}</h3>}
            {subtitle && <p className="mt-1 text-sm text-gray-500 dark:text-dark-400">{subtitle}</p>}
          </div>
        </div>
      )}
      <div className="px-6 py-4 dark:text-gray-200">{children}</div>
      {footer && <div className="px-6 py-4 bg-gray-50 dark:bg-dark-800 border-t border-gray-100 dark:border-dark-700">{footer}</div>}
    </div>
  );
};