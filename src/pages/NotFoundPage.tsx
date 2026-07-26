import React from 'react';
import { AlertCircle, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  onGoHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onGoHome }) => {
  return (
    <div className="py-20 text-center space-y-4 max-w-md mx-auto">
      <div className="w-12 h-12 rounded-full bg-bgSec border border-borderSubtle flex items-center justify-center text-statusError mx-auto">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h1 className="text-2xl font-bold text-textPrimary tracking-tight">404 - Page Not Found</h1>
      <p className="text-xs text-textSecondary leading-relaxed">
        The route or group document you were looking for does not exist on the Midnight zero-knowledge ledger.
      </p>
      <button onClick={onGoHome} className="btn-primary mx-auto">
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </button>
    </div>
  );
};
