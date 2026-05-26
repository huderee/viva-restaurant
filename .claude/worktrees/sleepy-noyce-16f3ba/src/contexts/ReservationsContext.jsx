// src/contexts/ReservationsContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const ReservationsContext = createContext(null);
const BASE_URL = 'http://localhost:5000/api';

export const ReservationsProvider = ({ children }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Backend-аас татах
  const fetchReservations = useCallback(async () => {
    try {
      const res  = await fetch(`${BASE_URL}/reservations`);
      const json = await res.json();
      console.log('📋 Reservations:', json);
      const data = Array.isArray(json) ? json : (json.data ?? []);
      setReservations(data);
    } catch (err) {
      console.error('❌ Reservations татахад алдаа:', err);
      // Backend байхгүй үед localStorage-аас уншина
      try {
        const local = JSON.parse(localStorage.getItem('huuk_reservations') || '[]');
        setReservations(local);
      } catch {
        setReservations([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
    const interval = setInterval(fetchReservations, 30000);
    return () => clearInterval(interval);
  }, [fetchReservations]);

  // ✅ Шинэ захиалга үүсгэх
  const createReservation = useCallback(async (payload) => {
    try {
      const res  = await fetch(`${BASE_URL}/reservations`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      const json = await res.json();
      const newRes = json.data ?? json;
      setReservations(prev => [newRes, ...prev]);
      return newRes._id || newRes.id;
    } catch (err) {
      console.error('❌ createReservation алдаа:', err);
      // Offline fallback
      const local = {
        ...payload,
        _id: `local_${Date.now()}`,
        id:  `local_${Date.now()}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      setReservations(prev => [local, ...prev]);
      return local._id;
    }
  }, []);

  // ✅ Төлөв өөрчлөх — _id болон id хоёуланг дэмжинэ
  const updateStatus = useCallback(async (id, status) => {
    // Эхлээд UI-д шууд тусгана (optimistic update)
    setReservations(prev =>
      prev.map(r => (r._id === id || r.id === id) ? { ...r, status } : r)
    );

    try {
      await fetch(`${BASE_URL}/reservations/${id}/status`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status }),
      });
    } catch (err) {
      console.error('❌ updateStatus алдаа:', err);
      // Алдаа гарсан ч UI дээр харагдсан хэвээр үлдэнэ
    }
  }, []);

  // ✅ Захиалга устгах — _id болон id хоёуланг дэмжинэ
  const removeReservation = useCallback(async (id) => {
    // Эхлээд UI-д шууд устгана
    setReservations(prev => prev.filter(r => r._id !== id && r.id !== id));

    try {
      await fetch(`${BASE_URL}/reservations/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('❌ removeReservation алдаа:', err);
    }
  }, []);

  return (
    <ReservationsContext.Provider value={{
      reservations,
      loading,
      createReservation,
      updateStatus,
      removeReservation,
      fetchReservations,
    }}>
      {children}
    </ReservationsContext.Provider>
  );
};

export const useReservations = () => useContext(ReservationsContext);