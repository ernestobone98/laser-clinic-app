// src/hooks/index.js
import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';

export const useZonas = () => {
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchZonas = useCallback(async () => {
    try {
      setLoading(true);
      const zonasData = await api.get('/api/zonas');
      setZonas(zonasData.map(z => ({ ...z, id: z.idZona })));
      setError(null);
    } catch (err) {
      console.error("Failed to fetch zonas", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchZonas();
  }, [fetchZonas]);

  return { zonas, loading, error, fetchZonas };
};

export const usePatients = (onDataChange) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/pacientes');
      setPatients(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [onDataChange]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients, onDataChange]);

  return { patients, loading, error, fetchPatients };
};