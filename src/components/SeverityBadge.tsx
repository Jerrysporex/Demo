import React from 'react';

type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

interface SeverityBadgeProps {
  severity: SeverityLevel;
  size?: 'sm' | 'md' | 'lg';
}

const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, size = 'md' }) => {
  const getClasses = () => {
    const baseClasses = 'inline-flex items-center font-medium rounded-full';
    
    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-xs',
      lg: 'px-3 py-1 text-sm',
    };
    
    const severityClasses = {
      Critical: 'bg-red-100 text-red-800',
      High: 'bg-orange-100 text-orange-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      Low: 'bg-blue-100 text-blue-800',
    };
    
    return `${baseClasses} ${sizeClasses[size]} ${severityClasses[severity]}`;
  };

  return (
    <span className={getClasses()}>
      {severity}
    </span>
  );
};

export default SeverityBadge;