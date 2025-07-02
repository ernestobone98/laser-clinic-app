import React, { useState } from 'react';
import { api } from './api';
import { useZonas, usePatients } from "./hooks";
import { CustomAlert } from "./components/common/CustomAlert";
import { ConfirmationDialog } from "./components/common/ConfirmationDialog";
import { PatientForm } from "./components/patients/PatientForm";
import { HomePage } from "./components/patients/HomePage";
import { PatientDetails } from "./components/patients/PatientDetails";
import { ProcedureForm } from "./components/procedures/ProcedureForm";

export default function App() {
  const { zonas, loading: loadingZonas } = useZonas();
  const [dataVersion, setDataVersion] = useState(0);
  const { patients, loading: loadingPatients } = usePatients(dataVersion);
  
  // --- State Management ---
  const [currentView, setCurrentView] = useState('home');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [modal, setModal] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [alertInfo, setAlertInfo] = useState({ show: false, message: '', type: 'info' });
  const [searchTerm, setSearchTerm] = useState('');

  const forceDataRefresh = () => setDataVersion(v => v + 1);

  const showAlert = (message, type = 'info', duration = 3000) => {
    setAlertInfo({ show: true, message, type });
    setTimeout(() => setAlertInfo(prev => ({...prev, show: false})), duration);
  };

  // --- Handlers ---
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setCurrentView('details');
  };

  const handleBackToHome = () => {
    setSelectedPatient(null);
    setCurrentView('home');
  };

  const closeModal = () => {
    setModal(null);
    setEditingItem(null);
    setItemToDelete(null);
  };

  // --- Patient CRUD ---
    const handleSavePatient = async (patientData) => {
    try {
      if (editingItem) {
        // Update existing patient
        await api.put(`/api/pacientes/${editingItem.id}`, patientData);
        showAlert('Пациентът е актуализиран успешно', 'info');
      } else {
        // Create new patient
        await api.post('/api/pacientes', patientData);
        showAlert('Пациентът е добавен успешно', 'success');
      }
      forceDataRefresh();
    } catch (error) {
      console.error('Error saving patient:', error);
      showAlert(`Грешка при запис на пациент: ${error.message}`, 'error');
    } finally {
      closeModal();
    }
  };

  const handleEditPatient = (patient) => {
    setEditingItem(patient);
    setModal('patientForm');
  };

  const confirmDeletePatient = (patient) => {
    setItemToDelete(patient);
    setModal('confirmDeletePatient');
  };

  const handleDeletePatient = async () => {
    try {
      // Implementation depends on your API
      await api.delete(`/api/pacientes/${itemToDelete.id}`);
      showAlert('Пациентът е изтрит успешно', 'success');
      handleBackToHome();
      forceDataRefresh();
    } catch (error) {
      showAlert(`Грешка при изтриване на пациент: ${error.message}`, 'error');
    } finally {
      closeModal();
    }
  };

  // --- Procedure CRUD ---
  const handleSaveProcedure = async (procedureData) => {
    try {
      // Implementation depends on your API
      if (editingItem) {
        // Update existing procedure
        await api.put(`/api/proceduras/${editingItem.id}`, procedureData);
        showAlert('Процедурата е актуализирана успешно', 'info');
      } else {
        // Create new procedure
        await api.post('/api/proceduras', procedureData);
        showAlert('Процедурата е добавена успешно', 'success');
      }
      forceDataRefresh();
    } catch (error) {
      showAlert(`Грешка при запис на процедура: ${error.message}`, 'error');
    } finally {
      closeModal();
    }
  };

  const handleEditProcedure = (procedure) => {
    // Format the procedure data to match the form's expected structure
    const formattedProcedure = {
      ...procedure,
      // Ensure the date is in the correct format (YYYY-MM-DD)
      data: procedure.data ? new Date(procedure.data).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      // Ensure zonas is an array of objects with id_zona and pulsaciones
      zonas: procedure.zonas || [],
      // Handle both snake_case and camelCase for the price field
      obshta_cena: procedure.obshta_cena || procedure.obshtaCena || '',
    };
    setEditingItem(formattedProcedure);
    setModal('procedureForm');
  };

  const confirmDeleteProcedure = (procedureId) => {
    setItemToDelete(procedureId);
    setModal('confirmDeleteProcedure');
  };

  const handleDeleteProcedure = async () => {
    try {
      // Use itemToDelete directly since it's already the procedure ID
      await api.delete(`/api/proceduras/${itemToDelete}`);
      showAlert('Процедурата е изтрита успешно', 'success');
      handleBackToHome();
      forceDataRefresh();
    } catch (error) {
      showAlert(`Грешка при изтриване на процедура: ${error.message}`, 'error');
    } finally {
      closeModal();
    }
  };

  // console.log("Zonas loading:", loadingZonas, "Zonas:", zonas);
  // console.log("Patients loading:", loadingPatients, "Patients:", patients);

  if (loadingZonas) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg text-gray-600">Подготовка на приложението...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {alertInfo.show && (
          <CustomAlert 
            message={alertInfo.message} 
            type={alertInfo.type} 
            onClose={() => setAlertInfo(prev => ({...prev, show: false}))} 
          />
        )}
        
        {currentView === 'home' ? (
          <HomePage
            patients={patients}
            loading={loadingPatients}
            onPatientSelect={handlePatientSelect}
            onAddPatient={() => { setEditingItem(null); setModal('patientForm'); }}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        ) : (
          <PatientDetails
            patient={selectedPatient}
            onBack={handleBackToHome}
            onEdit={handleEditPatient}
            onDelete={confirmDeletePatient}
            onAddProcedure={() => { setEditingItem(null); setModal('procedureForm'); }}
            onEditProcedure={handleEditProcedure}
            onDeleteProcedure={confirmDeleteProcedure}
            onDataChange={dataVersion}
          />
        )}

        {/* Modals */}
        {modal === 'patientForm' && (
          <PatientForm
            patient={editingItem}
            onSave={handleSavePatient}
            onCancel={closeModal}
          />
        )}
        
        {modal === 'procedureForm' && (
          <ProcedureForm
            procedura={editingItem}
            patient={selectedPatient}
            onSave={handleSaveProcedure}
            onCancel={closeModal}
            zonas={zonas}
            loadingZonas={loadingZonas}
          />
        )}
        
        {/* Confirmation Dialogs */}
        {modal === 'confirmDeletePatient' && (
          <ConfirmationDialog
            title="Изтриване на пациент"
            message={`Наистина ли искате да изтриете ${itemToDelete?.ime}? Това действие е необратимо и ще изтрие всички свързани процедури.`}
            onConfirm={handleDeletePatient}
            onCancel={closeModal}
          />
        )}
        
        {modal === 'confirmDeleteProcedure' && (
          <ConfirmationDialog
            title="Изтриване на процедура"
            message="Наистина ли искате да изтриете тази процедура? Това действие е необратимо."
            onConfirm={handleDeleteProcedure}
            onCancel={closeModal}
          />
        )}
      </main>
      <footer className="text-center py-4">
        <p className="text-sm text-gray-500">Система за управление на клиника &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}