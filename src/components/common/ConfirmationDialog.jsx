// src/components/common/ConfirmationDialog.jsx
import React from 'react';
import { Modal } from './Modal';

export const ConfirmationDialog = ({ title, message, onConfirm, onCancel }) => (
  <Modal onClose={onCancel}>
    <div className="text-center">
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="flex justify-center gap-4">
        <button onClick={onCancel} className="px-6 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-colors">
          Отказ
        </button>
        <button onClick={onConfirm} className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors">
          Потвърди
        </button>
      </div>
    </div>
  </Modal>
);