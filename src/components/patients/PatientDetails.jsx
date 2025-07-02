// src/components/patients/PatientDetails.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, Edit, Trash2, PlusCircle, Calendar, DollarSign } from 'lucide-react';
import { api } from '../../api';

export const PatientDetails = ({ patient, onBack, onEdit, onDelete, onAddProcedure, onEditProcedure, onDeleteProcedure, onDataChange }) => {
  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProcedures = useCallback(async () => {
    if (!patient?.id) return;
    try {
      setLoading(true);
      const data = await api.get(`/api/pacientes/${patient.id}/proceduras`);
      setProcedures(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch procedures", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [patient?.id]);

  useEffect(() => {
    fetchProcedures();
  }, [fetchProcedures, onDataChange]);

  return (
    <div className="animate-slide-in-right">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
          <ChevronLeft size={24} className="mr-2" />
          Back
        </button>
      </div>
      
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">{patient.IME}</h1>
            <p className="text-gray-500 mt-1">{patient.EMAIL} | {patient.TELEFON}</p>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <button onClick={() => onEdit(patient)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"><Edit size={20} /></button>
            <button onClick={() => onDelete(patient)} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"><Trash2 size={20} /></button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Процедури</h2>
          <button onClick={onAddProcedure} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
            <PlusCircle size={20} />
            Нова процедура
          </button>
        </div>
        {console.log("Procedures:", procedures)}
        {loading ? (
          <p>Зареждане на процедури...</p>
        ) : error ? (
          <p className="text-red-500">Грешка при зареждане: {error}</p>
        ) : procedures.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Няма регистрирани процедури за този пациент.</p>
        ) : (
          <ul className="space-y-4">
            {procedures.map(proc => (
              <li key={proc.idProcedura} className="bg-gray-50 rounded-lg p-4 flex flex-col md:flex-row justify-between md:items-center">
                <div>
                  <p className="font-bold text-gray-700 flex items-center gap-2"><Calendar size={16} /> {new Date(proc.data).toLocaleDateString()}</p>
                  <div>
                    <p className="text-gray-600 font-medium mb-1">Зони:</p>
                    <ul className="list-disc ml-5 text-sm">
                      {proc.zonas.map((z, idx) => (
                        <li key={idx}>
                          {z.zona} — {z.pulsaciones} пулсации
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-3 md:mt-0">
                                    <p className="font-semibold text-lg text-indigo-600 flex items-center gap-2"><DollarSign size={16} /> {proc.obshtaCena.toFixed(2)} лв.</p>
                  <button onClick={() => onEditProcedure(proc)} className="p-2 hover:bg-gray-200 rounded-full"><Edit size={18} /></button>
                  <button onClick={() => onDeleteProcedure(proc.idProcedura)} className="p-2 hover:bg-red-100 rounded-full text-red-500"><Trash2 size={18} /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};