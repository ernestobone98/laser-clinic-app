// src/components/procedures/ProcedureForm.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from '../common/Modal';
import { comment } from 'postcss/lib/postcss';

export const ProcedureForm = ({ procedura, patient, onSave, onCancel, zonas, loadingZonas }) => {
  // Initialize form data with procedure data if editing, or default values if creating
  const [formData, setFormData] = useState(() => {
    if (procedura) {
      console.log('Initializing with procedura:', procedura);
      return procedura;
    }
    
    return {
      data: new Date().toISOString().split('T')[0],
      obshta_cena: '',
      id_paciente: patient?.id || null,
      comment: '',
      zonas: [{ id_zona: null, pulsaciones: '' }]
    };
  });
  
  // Update form data when patient changes
  useEffect(() => {
    if (patient?.id) { // Using id instead of id_paciente
      setFormData(prev => ({
        ...prev,
        id_paciente: patient.id // Using id instead of id_paciente
      }));
    }
  }, [patient]);
  // Get initial search terms based on procedure data
  const getInitialSearchTerms = useCallback(() => {
    // If no procedure or zones, return default empty term
    if (!procedura?.zonas?.length) return [''];

    return procedura.zonas.map(zona => {
      // Handle both id_zona and idZona cases
      const zoneId = zona.id_zona || zona.idZona;
      if (!zoneId) return '';

      // First try to find by ID
      const fullZoneData = zonas?.find(z => 
        z.id_zona === zoneId || 
        z.idZona === zoneId ||
        z.id_zona?.toString() === zoneId?.toString() ||
        z.idZona?.toString() === zoneId?.toString()
      );

      // If found, return the name
      if (fullZoneData) {
        return fullZoneData.NAZVANIE || fullZoneData.nazvanie || '';
      }

      // If not found by ID, try to match by name (as a fallback)
      return zona.zona || '';
    });
  }, [procedura, zonas]);

  const [searchTerms, setSearchTerms] = useState(getInitialSearchTerms());
  const [showDropdowns, setShowDropdowns] = useState(
    procedura?.zonas?.map(() => false) || [false]
  );

  // Recalculate search terms when procedure or zones change
  useEffect(() => {
    setSearchTerms(getInitialSearchTerms());
  }, [getInitialSearchTerms]);

  // Filter zones based on search term and patient's gender for a specific dropdown
  const getFilteredZonas = (currentSearchTerm) => {
    return (zonas || []).filter(zona => {
      if (!zona) return false;
      
      const searchLower = currentSearchTerm.toLowerCase();
      const nameMatches = zona.NAZVANIE && typeof zona.NAZVANIE === 'string' && 
                        zona.NAZVANIE.toLowerCase().includes(searchLower);
      const nameEsMatches = zona.nazvanieEs && typeof zona.nazvanieEs === 'string' && 
                          zona.nazvanieEs.toLowerCase().includes(searchLower);
      
      const matchesSearch = nameMatches || nameEsMatches;
      const matchesGender = !zona.pol_specifichen || 
                          (patient && patient.pol && zona.pol_specifichen === patient.pol);
      
      return matchesSearch && matchesGender;
    });
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    
    if (name === 'obshta_cena') {
      // Validate price field (only numbers and one decimal point)
      if (value === '' || /^\d*\.?\d*$/.test(value)) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else if (name === 'pulsaciones') {
      // git add  pulsaciones for specific zone
      const newZonas = [...formData.zonas];
      newZonas[index] = { ...newZonas[index], pulsaciones: value };
      
      // Validate pulsaciones field (only numbers, '/' and '-')
      if (value === '' || /^[0-9/-]*$/.test(value)) {
        setFormData(prev => ({
          ...prev,
          zonas: newZonas
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleZonaSelect = (zona, index) => {
    const newZonas = [...formData.zonas];
    newZonas[index] = { 
      ...newZonas[index], 
      id_zona: Number(zona.idZona)
    };
    
    setFormData(prev => ({
      ...prev,
      zonas: newZonas
    }));
    
    const newSearchTerms = [...searchTerms];
    newSearchTerms[index] = zona.NAZVANIE || '';
    setSearchTerms(newSearchTerms);
    
    const newShowDropdowns = [...showDropdowns];
    newShowDropdowns[index] = false;
    setShowDropdowns(newShowDropdowns);
  };

  const addZoneField = () => {
    setFormData(prev => ({
      ...prev,
      zonas: [...prev.zonas, { id_zona: null, pulsaciones: '' }]
    }));
    setSearchTerms([...searchTerms, '']);
    setShowDropdowns([...showDropdowns, false]);
  };

  const removeZoneField = (index) => {
    if (formData.zonas.length <= 1) return;
    
    // Create new arrays without the item at the specified index
    const newZonas = formData.zonas.filter((_, i) => i !== index);
    const newSearchTerms = searchTerms.filter((_, i) => i !== index);
    const newShowDropdowns = showDropdowns.filter((_, i) => i !== index);
    
    // Update all states
    setFormData(prev => ({
      ...prev,
      zonas: newZonas
    }));
    setSearchTerms(newSearchTerms);
    setShowDropdowns(newShowDropdowns);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const isPriceValid = formData.obshta_cena && !isNaN(parseFloat(formData.obshta_cena));
    const areZonasValid = formData.zonas.every(z => z.id_zona !== null && z.id_zona !== undefined);
    const isPatientValid = Boolean(patient?.id);
    
    if (!isPriceValid || !areZonasValid || !isPatientValid) {
      alert('Моля, попълнете всички задължителни полета');
      return;
    }
    
    const procedureData = {
      zonas: formData.zonas.map(zona => ({
        id_zona: zona.id_zona,
        pulsaciones: zona.pulsaciones || '' // Ensure pulsaciones is at least an empty string
      })),
      obshta_cena: parseFloat(formData.obshta_cena),
      data: formData.data,
      id_paciente: formData.id_paciente,
      comment: formData.comment || '' // Ensure comment is at least an empty string
    };
    
    console.log('Submitting procedure data:', procedureData);
    onSave(procedureData);
  };

  return (
    <Modal onClose={onCancel}>
      <div className="p-6" style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '15px' }}>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          {procedura ? 'Редактиране на процедура' : 'Добавяне на нова процедура'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Zones and Pulsaciones Fields */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Зони и пулсации *
            </label>
            
            {formData.zonas.map((zona, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 w-full">
                <div className="relative w-full">
                  <input
                    type="text"
                    value={searchTerms[index] || ''}
                    onChange={(e) => {
                      const newSearchTerms = [...searchTerms];
                      newSearchTerms[index] = e.target.value;
                      setSearchTerms(newSearchTerms);
                      
                      const newShowDropdowns = [...showDropdowns];
                      newShowDropdowns[index] = true;
                      setShowDropdowns(newShowDropdowns);
                    }}
                    onFocus={() => {
                      const newShowDropdowns = [...showDropdowns];
                      newShowDropdowns[index] = true;
                      setShowDropdowns(newShowDropdowns);
                    }}
                    placeholder="Изберете зона..."
                    className="w-full p-2 sm:p-2.5 text-sm sm:text-base border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  {showDropdowns[index] && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {loadingZonas ? (
                        <div key="loading" className="p-2 text-gray-500">Зареждане на зони...</div>
                      ) : getFilteredZonas(searchTerms[index]).length > 0 ? (
                        getFilteredZonas(searchTerms[index]).map((zona, zonaIndex) => (
                          <div
                            key={`zona-${zona.id_zona || 'new'}-${index}-${zonaIndex}`}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleZonaSelect(zona, index)}
                          >
                            {zona.NAZVANIE} {zona.nazvanieEs && `(${zona.nazvanieEs})`}
                          </div>
                        ))
                      ) : (
                        <div className="p-2 text-gray-500">
                          {zonas && zonas.length === 0 ? 'Няма налични зони' : 'Няма намерени зони'}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <input
                  type="text"
                  name="pulsaciones"
                  value={zona.pulsaciones || ''}
                  onChange={(e) => handleInputChange({
                    ...e,
                    target: {
                      ...e.target,
                      name: 'pulsaciones',
                      value: e.target.value
                    }
                  }, index)}
                  placeholder="Пулсации"
                  className="w-32 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                <button
                  type="button"
                  onClick={() => removeZoneField(index)}
                  disabled={formData.zonas.length <= 1}
                  className={`p-2 rounded-md ${formData.zonas.length <= 1 ? 'text-gray-400' : 'text-red-500 hover:bg-red-50'}`}
                  title="Премахни зона"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addZoneField}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Добави зона
            </button>
          </div>

          {/* Price Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Цена *
            </label>
            <input
              type="text"
              name="obshta_cena"
              value={formData.obshta_cena}
              onChange={handleInputChange}
              placeholder="Въведете цена"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Date Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Дата
            </label>
            <input
              type="date"
              name="data"
              value={formData.data}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {/* Comment Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Коментар
            </label>
            <textarea
              name="comment"
              value={formData.comment || ''}
              onChange={handleInputChange}
              placeholder="Въведете коментар за процедурата..."
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y min-h-[60px] sm:min-h-[80px] text-sm sm:text-base"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Отказ
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Запази
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};