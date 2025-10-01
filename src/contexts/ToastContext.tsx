import React, { createContext, useContext, ReactNode } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const showToast = (message: string, type: ToastType = 'info', duration: number = 4000) => {
    // Pour l'instant, on utilise alert() sur mobile
    // Dans une vraie app, on utiliserait react-native-toast-message ou similar
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
    alert(`${icon} ${message}`);
  };

  const showSuccess = (message: string, duration?: number) => {
    showToast(message, 'success', duration);
  };

  const showError = (message: string, duration?: number) => {
    showToast(message, 'error', duration);
  };

  const showWarning = (message: string, duration?: number) => {
    showToast(message, 'warning', duration);
  };

  const showInfo = (message: string, duration?: number) => {
    showToast(message, 'info', duration);
  };

  const value: ToastContextType = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};





