// src/contexts/OrdersContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const OrdersContext = createContext(null);

const BASE_URL = 'http://localhost:5000/api';

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res  = await fetch(`${BASE_URL}/orders`);
      const json = await res.json();
      console.log('📦 Orders response:', json);

      // { success: true, data: [...] } эсвэл шууд [...] байж болно
      const data = Array.isArray(json) ? json : (json.data ?? []);
      setOrders(data);
    } catch (error) {
      console.error('❌ Orders татахад алдаа:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000); // 15 секунд тутам
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const updateOrderStatus = useCallback(async (id, status) => {
    try {
      await fetch(`${BASE_URL}/orders/${id}/status`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status }),
      });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
    } catch (error) {
      console.error('❌ Төлөв өөрчлөхөд алдаа:', error);
    }
  }, []);

  const removeOrder = useCallback(async (id) => {
    try {
      await fetch(`${BASE_URL}/orders/${id}`, { method: 'DELETE' });
      setOrders(prev => prev.filter(o => o._id !== id));
    } catch (error) {
      console.error('❌ Устгахад алдаа:', error);
    }
  }, []);

  return (
    <OrdersContext.Provider value={{ orders, loading, fetchOrders, updateOrderStatus, removeOrder }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);