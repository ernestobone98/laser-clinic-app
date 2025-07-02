// src/components/patients/HomePage.jsx
import React, { useMemo } from 'react';
import { Search, UserPlus } from 'lucide-react';

export const HomePage = ({ patients, loading, onPatientSelect, onAddPatient, searchTerm, setSearchTerm }) => {
  const filteredPatients = useMemo(() => {
    if (!searchTerm) return patients;
    return patients.filter(p => 
      p.IME.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, patients]);

  return (
    <div className="animate-fade-in">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-800 mb-4">Клиентска база данни</h1>
      <p className="text-center text-lg text-gray-500 mb-8">Търсене на пациенти или добавяне на нови.</p>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Търсене по име..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>
        <button
          onClick={onAddPatient}
          className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
        >
          <UserPlus size={20} className="mr-2" />
          Нов пациент
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
        {loading ? (
          <p className="text-center text-gray-500 py-8">Зареждане на пациенти...</p>
        ) : filteredPatients.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Няма намерени пациенти. Опитайте друга ключова дума или добавете нов пациент.
          </p>
        ) : (
          <ul className="space-y-3">
            {filteredPatients.map(patient => {
              return (
              <li
                key={patient.id}
                onClick={() => onPatientSelect(patient)}
                className="cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-lg text-gray-800">{patient.IME}</p>
                  <div className="flex gap-2 text-sm text-gray-500">
                    {patient.EMAIL && <span>{patient.EMAIL}</span>}
                    {patient.TELEFON && <span>| {patient.TELEFON}</span>}
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  patient.POL.trim().toUpperCase().startsWith('H') ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                }`}>
                  {patient.POL.trim().toUpperCase().startsWith('H') ? 'Мъж' : 'Жена'}
                </span>
              </li>
            );
          })}
          </ul>
        )}
      </div>
    </div>
  );
};