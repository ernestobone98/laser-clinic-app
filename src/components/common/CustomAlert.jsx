// src/components/common/CustomAlert.jsx
import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export const CustomAlert = ({ message, type = 'info', onClose }) => {
  const typeClasses = {
    info: "bg-blue-100 text-blue-800",
    error: "bg-red-100 text-red-800",
  };

  return (
    <div className={`flex items-center p-4 mb-4 text-sm rounded-lg ${typeClasses[type]}`} role="alert">
      <AlertCircle className="flex-shrink-0 inline w-5 h-5 mr-3" />
      <span className="font-medium">{message}</span>
      <button type="button" className="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8" onClick={onClose}>
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};