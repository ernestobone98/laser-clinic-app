// src/components/common/Modal.jsx
import React from 'react';
import { X } from 'lucide-react';

export const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg m-4" onClick={(e) => e.stopPropagation()}>
      <div className="relative p-6">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors">
          <X size={24} />
        </button>
        {children}
      </div>
    </div>
  </div>
);
