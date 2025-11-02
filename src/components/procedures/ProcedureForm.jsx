// src/components/procedures/ProcedureForm.jsx
import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';

export const ProcedureForm = ({ procedura, patient, onSave, onCancel, zonas, loadingZonas }) => {
  // State for the form data
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0],
    obshta_cena: '',
    id_paciente: patient?.id || null,
    comment: '',
    zonas: [{ id_zona: null, pulsaciones: '' }]
  });

  // State for the search input values, which display the zone names
  const [searchTerms, setSearchTerms] = useState(['']);
  const [showDropdowns, setShowDropdowns] = useState([false]);
  
  // This useEffect is the core of the solution.
  // It runs ONLY when the necessary data (procedura to edit and the full zonas list) is available.
  useEffect(() => {
    // We proceed only if we are editing a procedure AND the full list of zones has loaded.
    if (procedura && zonas && zonas.length > 0) {
      
      // We map over the zones from the procedure we are editing...
      const procedureZonas = procedura.zonas.map(procZona => {
        // THE FIX: Find the full zone details from the master list BY NAME.
        // `procZona.zona` comes from the API response you provided.
        // `z.nazvanie` is the name property in the master 'zonas' list.
        const fullZone = zonas.find(z => z.NAZVANIE === procZona.zona);
        
        return {
          // THE FIX: Get the ID from the full zone object we just found.
          id_zona: fullZone ? fullZone.idZona : null, 
          pulsaciones: procZona.pulsaciones,
          // The name is already in `procZona.zona`, which we use for the search term.
          searchName: procZona.zona 
        };
      });

      // Now, we update the state once with all the correct data.
      setFormData({
        data: new Date(procedura.data).toISOString().split('T')[0],
        obshta_cena: procedura.obshtaCena || '',
        id_paciente: procedura.idPaciente,
        comment: procedura.comment || '',
        zonas: procedureZonas.map(({ id_zona, pulsaciones }) => ({ id_zona, pulsaciones }))
      });
      
      // We set the search terms for the input fields.
      setSearchTerms(procedureZonas.map(z => z.searchName));
      setShowDropdowns(procedureZonas.map(() => false));
    }
  }, [procedura, zonas]); // This effect depends on 'procedura' and 'zonas'.


  // --- Handler Functions ---

  const handleInputChange = (e, index) => {
    const { name, value, type, checked } = e.target;

    if (name === 'pulsaciones') {
      const newZonas = [...formData.zonas];
      newZonas[index] = { ...newZonas[index], pulsaciones: value };
      setFormData(prev => ({ ...prev, zonas: newZonas }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const getFilteredZonas = (currentSearchTerm) => {
    if (!zonas) return [];
    const searchLower = currentSearchTerm?.toLowerCase() || '';
    return zonas.filter(zona => {
      const nameMatches = zona.NAZVANIE?.toLowerCase().includes(searchLower);
      const nameEsMatches = zona.nazvanieEs?.toLowerCase().includes(searchLower);
      const matchesGender = !zona.polSpecifichen || (patient?.POL && zona.polSpecifichen.trim().toUpperCase() === patient.POL.trim().toUpperCase());
      // If search is empty, show all zones (filtered by gender if needed)
      return (searchLower === '' ? matchesGender : (matchesGender && (nameMatches || nameEsMatches)));
    });
  };

  const handleZonaSelect = (zonaItem, index) => {
    const newZonas = [...formData.zonas];
    newZonas[index] = {
      ...newZonas[index],
      id_zona: zonaItem.idZona,
      pulsaciones: zonaItem.meanPulsaciones ?? '' // Set meanPulsaciones if available
    };
    setFormData(prev => ({ ...prev, zonas: newZonas }));

    const newSearchTerms = [...searchTerms];
    newSearchTerms[index] = zonaItem.NAZVANIE;
    setSearchTerms(newSearchTerms);
  };
  
  const addZoneField = () => {
    setFormData(prev => ({ ...prev, zonas: [...prev.zonas, { id_zona: null, pulsaciones: '' }] }));
    setSearchTerms(prev => [...prev, '']);
    setShowDropdowns(prev => [...prev, false]);
  };
  
  const removeZoneField = (index) => {
    if (formData.zonas.length <= 1) return; // Prevent removing the last field
    setFormData(prev => ({ ...prev, zonas: prev.zonas.filter((_, i) => i !== index) }));
    setSearchTerms(prev => prev.filter((_, i) => i !== index));
    setShowDropdowns(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isPriceValid = formData.obshta_cena && !isNaN(parseFloat(formData.obshta_cena));
    const areZonasValid = formData.zonas.every(z => z.id_zona !== null && z.id_zona !== undefined && z.pulsaciones && z.pulsaciones.trim() !== '');

    if (!isPriceValid || !areZonasValid) {
      alert('Моля, попълнете всички задължителни полета (зони, пулсации и цена).');
      return;
    }
    
    onSave({
      // Pass only the necessary data for the API
      data: formData.data,
      obshta_cena: parseFloat(formData.obshta_cena),
      id_paciente: formData.id_paciente,
      comment: formData.comment,
      zonas: formData.zonas,
    });
  };


  return (
    <Modal onClose={onCancel}>
       <div className="p-6" style={{ maxHeight: '80vh', overflowY: 'auto', paddingRight: '40px' }}>
         <h2 className="text-2xl font-semibold text-gray-900 mb-6">
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
                    onBlur={() => {
                        setTimeout(() => {
                           const newShowDropdowns = [...showDropdowns];
                           newShowDropdowns[index] = false;
                           setShowDropdowns(newShowDropdowns);
                        }, 200)
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
                         getFilteredZonas(searchTerms[index]).map((zonaItem, zonaIndex) => (
                           <div
                             key={`zona-${zonaItem.idZona}-${zonaIndex}`}
                             className="p-2 hover:bg-gray-100 cursor-pointer"
                             onMouseDown={() => handleZonaSelect(zonaItem, index)}
                           >
                             {zonaItem.NAZVANIE} {zonaItem.nazvanieEs && `(${zonaItem.nazvanieEs})`}
                           </div>
                         ))
                       ) : (
                         <div className="p-2 text-gray-500">
                           {searchTerms[index] ? 'Няма намерени зони' : 'Започнете да пишете...'}
                         </div>
                       )}
                     </div>
                   )}
                 </div>
                
                 <input
                   type="text"
                   name="pulsaciones"
                   value={zona.pulsaciones || ''}
                   onChange={(e) => handleInputChange(e, index)}
                   placeholder="Пулсации"
                   className="w-full sm:w-32 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 />
                
                 <button
                   type="button"
                   onClick={() => removeZoneField(index)}
                   disabled={formData.zonas.length <= 1}
                   className={`p-2 rounded-md ${formData.zonas.length <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-red-500 hover:bg-red-50'}`}
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

          {/* Other form fields */}
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

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
               Коментар
             </label>
             <textarea
               name="comment"
               value={formData.comment || ''}
               onChange={handleInputChange}
               placeholder="Въведете коментар за процедурата..."
               className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y min-h-[80px]"
               rows={3}
             />
           </div>


           <div className="flex justify-end space-x-3 pt-4">
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
