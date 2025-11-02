// src/components/patients/PatientForm.jsx
import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';

export const PatientForm = ({ patient, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    ime: '',
    pol: 'Ж',
    telefon: '',
    email: ''
  });

    useEffect(() => {
    if (patient) {
      setFormData({
        ime: patient.IME || '',
        pol: patient.POL || 'Ж',
        telefon: patient.TELEFON || '',
        email: patient.EMAIL || ''
      });
    }
  }, [patient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal onClose={onCancel}>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">{patient ? 'Редактиране на пациент' : 'Добавяне на нов пациент'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="ime">Име</label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            type="text"
            id="ime"
            name="ime"
            value={formData.ime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="pol">Пол</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            id="pol"
            name="pol"
            value={formData.pol}
            onChange={handleChange}
            required
          >
            <option value="H">Мъж</option>
            <option value="Ж">Жена</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="telefon">Телефон</label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            type="tel"
            id="telefon"
            name="telefon"
            value={formData.telefon}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">Email</label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Отказ
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            type="submit"
            disabled={!formData.ime}
          >
            {patient ? 'Запази промените' : 'Добави пациента'}
          </button>
        </div>
      </form>
    </Modal>
  );
};



