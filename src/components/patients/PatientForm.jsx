// src/components/patients/PatientForm.jsx
import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';

export const PatientForm = ({ patient, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    ime: '',
    pol: 'Ж',
    telefon: '',
    email: '',
    balance: 0
  });

    useEffect(() => {
    if (patient) {
      setFormData({
        ime: patient.IME || '',
        pol: patient.POL || 'Ж',
        telefon: patient.TELEFON || '',
        email: patient.EMAIL || '',
        balance: 0
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
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{patient ? 'Редактиране на пациент' : 'Добавяне на нов пациент'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="ime">Име</label>
          <input
            className="border border-gray-300 p-2 w-full"
            type="text"
            id="ime"
            name="ime"
            value={formData.ime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="pol">Пол</label>
          <select
            className="border border-gray-300 p-2 w-full"
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
          <label className="block text-gray-700 mb-2" htmlFor="telefon">Телефон</label>
          <input
            className="border border-gray-300 p-2 w-full"
            type="tel"
            id="telefon"
            name="telefon"
            value={formData.telefon}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
          <input
            className="border border-gray-300 p-2 w-full"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="balance">Баланс</label>
          <input
            className="border border-gray-300 p-2 w-full"
            type="number"
            id="balance"
            name="balance"
            value={formData.balance || 0}
            onChange={handleChange}
            step="10"
          />
        </div>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          type="submit"
          disabled={!formData.ime}
        >
          {patient ? 'Запази промените' : 'Добави пациента'}
        </button>
      </form>
    </Modal>
  );
};



