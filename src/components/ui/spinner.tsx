import React from 'react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Spinner: React.FC<SpinnerProps> = ({ className, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div
      className={cn(
        'border-gray-light border-t-primary-green rounded-full animate-spin',
        sizeClasses[size],
        className
      )}
    />
  );
};

export { Spinner };

