// src/contexts/OrdersContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import api from '../lib/api';

const OrdersContext = createContext(null);

const POLL_INTERVAL = 15_000; // 15 секунд

export const OrdersProvider = ({ children }) => {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  // AbortController-ийн ref — component unmount үед fetch цуцлана
  const abortRef = useRef(null);

  const fetchOrders = useCallback(async (showLoading = false) => {
    // Token байхгүй бол fetch хийхгүй — нийтийн хуудсанд 401 алдаа гарахгүй
    if (!localStorage.getItem('admin_token')) { setLoading(false); return; }

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    if (showLoading) setLoading(true);
    try {
      const json = await api.get('/orders', abortRef.current.signal);
      const data = Array.isArray(json) ? json : (json.data ?? []);
      setOrders(data);
    } catch (error) {
      // AbortError бол дуусгавар болгосон fetch — алдаа биш
      if (error.name === 'AbortError') return;
      console.error('❌ Захиалга татахад алдаа:', error.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Анхны ачаалалт — loading харуулна
    fetchOrders(true);
    // Цаашид polling — loading харуулахгүй (UI-г цочромтгой болгохгүй)
    const interval = setInterval(() => fetchOrders(false), POLL_INTERVAL);
    return () => {
      clearInterval(interval);
      abortRef.current?.abort();
    };
  }, [fetchOrders]);

  const updateOrderStatus = useCallback(async (id, status, reason = '') => {
    // Optimistic update
    setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
    try {
      const json = await api.put(`/orders/${id}/status`, { status, reason });
      const updated = json?.data || json;
      if (updated?._id) setOrders(prev => prev.map(o => o._id === id ? updated : o));
      return updated;
    } catch (error) {
      console.error('❌ Төлөв өөрчлөхөд алдаа:', error.message);
      // Алдаа гарвал эх төлөвт нь буцаахын тулд дахин fetch хийнэ
      fetchOrders(false);
      throw error;
    }
  }, [fetchOrders]);

  const removeOrder = useCallback(async (id) => {
    // Optimistic update
    setOrders(prev => prev.filter(o => o._id !== id));
    try {
      await api.delete(`/orders/${id}`);
    } catch (error) {
      console.error('❌ Устгахад алдаа:', error.message);
      fetchOrders(false);
    }
  }, [fetchOrders]);

  return (
    <OrdersContext.Provider value={{ orders, loading, fetchOrders: () => fetchOrders(true), updateOrderStatus, removeOrder }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);
