// src/components/patients/HomePage.jsx
import React, { useMemo, useState } from 'react';
import { Search, UserPlus, Eye, Edit, ArrowUpDown } from 'lucide-react';
import logo from '/latelier_logo.png';

export const HomePage = ({ patients, loading, onPatientSelect, onAddPatient, searchTerm, setSearchTerm }) => {
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const filteredPatients = useMemo(() => {
    if (!searchTerm) return patients;
    return patients.filter(p =>
      p.IME.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.EMAIL && p.EMAIL.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.TELEFON && p.TELEFON.includes(searchTerm))
    );
  }, [searchTerm, patients]);

  const sortedPatients = useMemo(() => {
    return [...filteredPatients].sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'name':
          aValue = a.IME.toLowerCase();
          bValue = b.IME.toLowerCase();
          break;
        case 'email':
          aValue = (a.EMAIL || '').toLowerCase();
          bValue = (b.EMAIL || '').toLowerCase();
          break;
        default:
          return 0;
      }
      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  }, [filteredPatients, sortBy, sortOrder]);

  return (
    <div className="animate-fade-in min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 px-4">
      <div className="flex items-center justify-center mb-4">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Клиентска база данни</h1>
      </div>
      <p className="text-center text-lg text-gray-500 mb-8">Търсене на пациенти или добавяне на нови.</p>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Търсене по име, имейл или телефон..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors"
          />
        </div>
        <button
          onClick={onAddPatient}
          className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <UserPlus size={20} className="mr-2" />
          Нов пациент
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Пациенти ({sortedPatients.length})</h2>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            >
              <option value="name">Име</option>
              <option value="email">Имейл</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1 text-gray-600 hover:text-indigo-600 transition-colors"
              title={`Сортиране ${sortOrder === 'asc' ? 'низходящо' : 'възходящо'}`}
            >
              <ArrowUpDown size={18} />
            </button>
          </div>
        </div>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 rounded-xl p-4 h-20"></div>
            ))}
          </div>
        ) : sortedPatients.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Няма намерени пациенти. Опитайте друга ключова дума или добавете нов пациент.
          </p>
        ) : (
          <ul className="space-y-3">
            {sortedPatients.map(patient => {
              return (
              <li
                key={patient.id}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-indigo-300 transition-all duration-200 flex items-start sm:items-center justify-between gap-4 group"
              >
                <div className="min-w-0 flex-1" onClick={() => onPatientSelect(patient)} style={{ cursor: 'pointer' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {patient.IME.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-lg text-gray-800 truncate">{patient.IME}</p>
                      <div className="flex flex-col sm:flex-row sm:gap-2 text-sm text-gray-500 mt-1">
                        {patient.EMAIL && (
                          <span className="truncate">{patient.EMAIL}</span>
                        )}
                        {patient.EMAIL && patient.TELEFON && (
                          <span className="hidden sm:inline">|</span>
                        )}
                        {patient.TELEFON && (
                          <span className="truncate">{patient.TELEFON}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => { e.stopPropagation(); onPatientSelect(patient); }}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); /* Add edit handler */ }}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Edit Patient"
                  >
                    <Edit size={18} />
                  </button>
                </div>
              </li>
            );
          })}
          </ul>
        )}
      </div>
    </div>
  );
};