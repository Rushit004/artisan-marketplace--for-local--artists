import React, { useEffect, useState } from 'react';
import { Icon } from './Icon';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Allow time for fade-out animation before calling onClose
      setTimeout(onClose, 300); 
    }, 2700);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-800' : 'bg-red-700';

  return (
    <div
      className={`fixed bottom-5 right-5 flex items-center w-full max-w-xs p-4 text-white ${bgColor} rounded-lg shadow-lg transition-transform duration-300 ease-in-out ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
      role="alert"
    >
      <div className="text-sm font-normal">{message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 bg-white/20 text-white rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-white/30 inline-flex h-8 w-8"
        onClick={onClose}
        aria-label="Close"
      >
        <Icon name="close" className="w-5 h-5" />
      </button>
    </div>
  );
};