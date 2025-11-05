import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  style,
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 ${paddingClasses[padding]} ${className}`} style={style}>
      {children}
    </div>
  );
};

