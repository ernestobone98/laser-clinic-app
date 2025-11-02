// src/components/patients/PatientDetails.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, Edit, Trash2, PlusCircle, Calendar, DollarSign } from 'lucide-react';
import { api } from '../../api';

export const PatientDetails = ({ patient, onBack, onEdit, onDelete, onAddProcedure, onEditProcedure, onDeleteProcedure, onDataChange }) => {
  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCell, setEditingCell] = useState(null); // { procedureId, zoneName }
  const [editValue, setEditValue] = useState('');

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

  const handleCellDoubleClick = (procedureId, zoneName, currentValue) => {
    setEditingCell({ procedureId, zoneName });
    setEditValue(currentValue || '');
  };

  const handleCellSave = async () => {
    if (!editingCell) return;

    try {
      const procedure = procedures.find(p => p.idProcedura === editingCell.procedureId);
      if (!procedure) return;

      // Update the zone value in the procedure
      const updatedZonas = procedure.zonas.map(z =>
        z.zona === editingCell.zoneName
          ? { ...z, pulsaciones: editValue ? parseInt(editValue) : null }
          : z
      );

      // If the zone doesn't exist, add it
      const zoneExists = updatedZonas.some(z => z.zona === editingCell.zoneName);
      if (!zoneExists && editValue) {
        // We need to get the zone ID from the backend
        const zonesResponse = await api.get('/api/proceduras/zonas');
        const zoneData = zonesResponse.find(z => z.nazvanie === editingCell.zoneName);
        if (zoneData) {
          updatedZonas.push({
            zona: editingCell.zoneName,
            pulsaciones: parseInt(editValue),
            id_zona: zoneData.idZona
          });
        }
      }

      // Update the procedure via API
      await api.put(`/api/proceduras/${editingCell.procedureId}`, {
        data: procedure.data,
        obshta_cena: procedure.obshtaCena,
        zonas: updatedZonas.map(z => ({
          id_zona: z.id_zona,
          pulsaciones: z.pulsaciones
        })),
        comment: procedure.comment
      });

      // Refresh data
      fetchProcedures();
      setEditingCell(null);
      setEditValue('');
    } catch (err) {
      console.error('Failed to update zone value:', err);
      setError('Failed to update zone value');
    }
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCellSave();
    } else if (e.key === 'Escape') {
      handleCellCancel();
    }
  };

  // Collect unique zones from all procedures
  const uniqueZones = Array.from(
    new Set(procedures.flatMap(proc => proc.zonas.map(z => z.zona)))
  ).sort();

  const filteredProcedures = procedures
    .map(proc => {
      if (!searchTerm) return proc;

      const matchingZones = proc.zonas.filter(z =>
        z.zona.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return matchingZones.length > 0
        ? { ...proc, zonas: matchingZones }
        : null;
    })
    .filter(Boolean);

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
          <div className="flex gap-2">
            {procedures.length > 0 && (
              <button
                onClick={() => {
                  const lastProcedure = procedures[procedures.length - 1];
                  const formattedProcedure = {
                    ...lastProcedure,
                    data: new Date().toISOString().split('T')[0], // Set to today
                    zonas: lastProcedure.zonas || [],
                    obshta_cena: lastProcedure.obshta_cena || lastProcedure.obshtaCena || '',
                  };
                  onEditProcedure(formattedProcedure);
                }}
                className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-green-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-green-700 transition-colors w-auto sm:w-auto"
              >
                <PlusCircle size={16} className="sm:w-5 sm:h-5 w-4 h-4 flex-shrink-0" />
                <span className="whitespace-nowrap text-xs sm:text-sm">Дублирай последната</span>
              </button>
            )}
            <button
              onClick={onAddProcedure}
              className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-indigo-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-indigo-700 transition-colors w-auto sm:w-auto"
            >
              <PlusCircle size={16} className="sm:w-5 sm:h-5 w-4 h-4 flex-shrink-0" />
              <span className="whitespace-nowrap text-xs sm:text-sm">Нова процедура</span>
            </button>
          </div>
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Търсене по зона..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {loading ? (
          <p>Зареждане на процедури...</p>
        ) : error ? (
          <p className="text-red-500">Грешка при зареждане: {error}</p>
        ) : filteredProcedures.length === 0 ? (
          <p className="text-center text-gray-500 py-8">{searchTerm ? 'Няма намерени процедури за това търсене.' : 'Няма регистрирани процедури за този пациент.'}</p>
        ) : (
          <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
            <table className="min-w-full bg-white border-collapse" role="table" aria-label="Процедури на пациента">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 min-w-[120px]" scope="col">Дата</th>
                  {uniqueZones.map(zone => (
                    <th key={zone} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[140px]" scope="col">
                      {zone}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[120px]" scope="col">Обща цена</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[180px]" scope="col">Коментар</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sticky right-0 bg-gray-50 z-10 min-w-[120px]" scope="col">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProcedures.map(proc => (
                  <tr key={proc.idProcedura} className="hover:bg-gray-50 transition-colors" role="row">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white" role="cell">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" aria-hidden="true" />
                        <time dateTime={proc.data}>{new Date(proc.data).toLocaleDateString()}</time>
                      </div>
                    </td>
                    {uniqueZones.map(zone => {
                      const zoneData = proc.zonas.find(z => z.zona === zone);
                      const isEditing = editingCell?.procedureId === proc.idProcedura && editingCell?.zoneName === zone;

                      return (
                        <td
                          key={zone}
                          className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                          role="cell"
                          onDoubleClick={() => handleCellDoubleClick(proc.idProcedura, zone, zoneData?.pulsaciones)}
                        >
                          {isEditing ? (
                            <input
                              type="number"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={handleCellSave}
                              onKeyDown={handleKeyDown}
                              className="w-full px-2 py-1 border border-indigo-500 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              autoFocus
                              min="0"
                            />
                          ) : (
                            zoneData ? zoneData.pulsaciones : <span className="text-gray-400" aria-label="Няма данни">-</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600" role="cell">
                      <div className="flex items-center gap-1">
                        <DollarSign size={14} aria-hidden="true" />
                        <span aria-label={`Цена: ${proc.obshtaCena.toFixed(2)} лева`}>{proc.obshtaCena.toFixed(2)} лв.</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 max-w-xs" role="cell">
                      {proc.comment && proc.comment.trim() !== '' ? (
                        <div className="truncate" title={proc.comment} aria-label={`Коментар: ${proc.comment}`}>
                          {proc.comment}
                        </div>
                      ) : (
                        <span className="text-gray-400" aria-label="Няма коментар">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium sticky right-0 bg-white" role="cell">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEditProcedure(proc)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          title="Редактирай процедура"
                          aria-label={`Редактирай процедура от ${new Date(proc.data).toLocaleDateString()}`}
                        >
                          <Edit size={16} className="text-gray-600" aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => onDeleteProcedure(proc.idProcedura)}
                          className="p-2 hover:bg-red-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                          title="Изтрий процедура"
                          aria-label={`Изтрий процедура от ${new Date(proc.data).toLocaleDateString()}`}
                        >
                          <Trash2 size={16} className="text-red-500" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};