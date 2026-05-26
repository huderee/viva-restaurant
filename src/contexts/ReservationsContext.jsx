// src/contexts/ReservationsContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import api from '../lib/api';

const ReservationsContext = createContext(null);

const POLL_INTERVAL  = 30_000; // 30 секунд
const LS_FALLBACK    = 'huuk_reservations';

// Web Audio API ашиглан богино beep дуу тоглуулах
const playNotificationSound = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // 2 удаа бип хийх (илүү анхаарал татна)
    [0, 0.18].forEach((offset, idx) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(idx === 0 ? 880 : 1100, now + offset);
      gain.gain.setValueAtTime(0, now + offset);
      gain.gain.linearRampToValueAtTime(0.2, now + offset + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.14);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.15);
    });

    // ~0.5 секундын дараа context-ыг хаах
    setTimeout(() => ctx.close?.(), 500);
  } catch (e) {
    /* дуу тоглуулах боломжгүй — чимээгүй алгасах */
  }
};

// Browser notification
const showBrowserNotification = (count) => {
  try {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      new Notification('Шинэ ширээ захиалга', {
        body: count > 1 ? `${count} шинэ захиалга ирлээ` : 'Шинэ захиалга ирлээ',
        icon: '/favicon.ico',
        tag: 'reservation-new',
      });
    }
  } catch {}
};

export const ReservationsProvider = ({ children }) => {
  const [reservations, setReservations] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [newSinceOpen, setNewSinceOpen] = useState(0); // шинэ захиалгын тоо
  const abortRef     = useRef(null);
  const prevIdsRef   = useRef(null); // сүүлийн poll-ын ID-нуудын Set
  const notifyCbRef  = useRef(null); // шинэ захиалга ирэхэд дуудагдах callback

  const fetchReservations = useCallback(async (showLoading = false) => {
    // Token байхгүй бол fetch хийхгүй — нийтийн хуудсанд 401 алдаа гарахгүй
    if (!localStorage.getItem('admin_token')) { setLoading(false); return; }

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    if (showLoading) setLoading(true);
    try {
      const json = await api.get('/reservations', abortRef.current.signal);
      const data = Array.isArray(json) ? json : (json.data ?? []);

      // Шинэ захиалга илрүүлэх (анхны fetch дээр алгасна)
      const currentIds = new Set(data.map(r => r._id || r.id).filter(Boolean));
      if (prevIdsRef.current) {
        const newOnes = data.filter(r => {
          const id = r._id || r.id;
          return id && !prevIdsRef.current.has(id);
        });
        if (newOnes.length > 0) {
          playNotificationSound();
          showBrowserNotification(newOnes.length);
          setNewSinceOpen(c => c + newOnes.length);
          try { notifyCbRef.current?.(newOnes); } catch {}
        }
      }
      prevIdsRef.current = currentIds;

      setReservations(data);
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('❌ Reservations татахад алдаа:', err.message);
      // Backend байхгүй үед localStorage-аас уншина
      try {
        const local = JSON.parse(localStorage.getItem(LS_FALLBACK) || '[]');
        if (Array.isArray(local)) setReservations(local);
      } catch {
        setReservations([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations(true);
    const interval = setInterval(() => fetchReservations(false), POLL_INTERVAL);
    return () => {
      clearInterval(interval);
      abortRef.current?.abort();
    };
  }, [fetchReservations]);

  const createReservation = useCallback(async (payload) => {
    try {
      const json   = await api.post('/reservations', payload);
      const newRes = json.data ?? json;
      setReservations(prev => [newRes, ...prev]);
      return newRes._id || newRes.id;
    } catch (err) {
      console.error('❌ createReservation алдаа:', err.message);
      // Offline fallback — localStorage-д хадгалж, UI-д харуулна
      const local = {
        ...payload,
        _id: `local_${Date.now()}`,
        id:  `local_${Date.now()}`,
        status:    'pending',
        createdAt: new Date().toISOString(),
        synced:    false,
      };
      setReservations(prev => [local, ...prev]);
      try {
        const existing = JSON.parse(localStorage.getItem(LS_FALLBACK) || '[]');
        localStorage.setItem(LS_FALLBACK, JSON.stringify([local, ...existing]));
      } catch { /* QuotaExceededError — тэвчих */ }
      return local._id;
    }
  }, []);

  // _id болон id хоёуланг дэмжих
  const updateStatus = useCallback(async (id, status) => {
    let previous;
    setReservations(prev => {
      previous = prev.find(r => r._id === id || r.id === id);
      return prev.map(r => (r._id === id || r.id === id) ? { ...r, status } : r);
    });
    try {
      await api.put(`/reservations/${id}/status`, { status });
    } catch (err) {
      console.error('❌ updateStatus алдаа:', err.message);
      if (previous) {
        const snap = previous;
        setReservations(prev =>
          prev.map(r => (r._id === id || r.id === id) ? snap : r)
        );
      }
      throw err;
    }
  }, []);

  const removeReservation = useCallback(async (id) => {
    let removed;
    setReservations(prev => {
      removed = prev.find(r => r._id === id || r.id === id);
      return prev.filter(r => r._id !== id && r.id !== id);
    });
    try {
      await api.delete(`/reservations/${id}`);
    } catch (err) {
      console.error('❌ removeReservation алдаа:', err.message);
      if (removed) setReservations(prev => [removed, ...prev]);
      throw err;
    }
  }, []);

  // Browser notification зөвшөөрөл асуух
  const requestNotificationPermission = useCallback(async () => {
    try {
      if (!('Notification' in window)) return 'unsupported';
      if (Notification.permission === 'granted') return 'granted';
      if (Notification.permission === 'denied')  return 'denied';
      const result = await Notification.requestPermission();
      return result;
    } catch {
      return 'error';
    }
  }, []);

  // Шинэ захиалгын counter-г цэвэрлэх
  const clearNewCount = useCallback(() => setNewSinceOpen(0), []);

  // Шинэ захиалга ирэхэд дуудагдах callback бүртгүүлэх
  const onNewReservations = useCallback((cb) => {
    notifyCbRef.current = cb;
    return () => { if (notifyCbRef.current === cb) notifyCbRef.current = null; };
  }, []);

  return (
    <ReservationsContext.Provider value={{
      reservations,
      loading,
      newSinceOpen,
      createReservation,
      updateStatus,
      removeReservation,
      fetchReservations: () => fetchReservations(true),
      requestNotificationPermission,
      clearNewCount,
      onNewReservations,
    }}>
      {children}
    </ReservationsContext.Provider>
  );
};

export const useReservations = () => useContext(ReservationsContext);
