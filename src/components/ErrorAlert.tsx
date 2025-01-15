import React from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  message: string;
  onClose?: () => void;
}

const ErrorAlert: React.FC<Props> = ({ message, onClose }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <p className="text-red-700">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-red-400 hover:text-red-500"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;