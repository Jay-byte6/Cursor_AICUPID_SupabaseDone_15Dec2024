import React from 'react';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'error' | 'success' | 'warning' | 'info';
  className?: string;
  onClose?: () => void;
}

export default function Alert({ children, variant = 'info', className = '', onClose }: AlertProps) {
  const baseClasses = 'p-4 rounded-md relative';
  const variantClasses = {
    error: 'bg-red-50 text-red-700 border border-red-200',
    success: 'bg-green-50 text-green-700 border border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    info: 'bg-blue-50 text-blue-700 border border-blue-200'
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-500"
          aria-label="Close"
        >
          <span className="text-xl">×</span>
        </button>
      )}
    </div>
  );
} 