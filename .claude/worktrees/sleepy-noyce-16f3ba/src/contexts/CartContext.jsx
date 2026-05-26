// src/contexts/CartContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../lib/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart,         setCart]         = useState([]);
  const [isCartOpen,   setIsCartOpen]   = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError,   setOrderError]   = useState(null);
  const [lastOrder,    setLastOrder]    = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('huuk-restaurant-cart');
    if (saved) {
      try { setCart(JSON.parse(saved)); } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('huuk-restaurant-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((item) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId, newQty) => {
    if (newQty < 1) { removeFromCart(itemId); return; }
    setCart(prev => prev.map(i => i.id === itemId ? { ...i, quantity: newQty } : i));
  }, [removeFromCart]);

  const clearCart          = useCallback(() => setCart([]), []);
  const calculateTotal     = useCallback(() => cart.reduce((s, i) => s + i.price * i.quantity, 0), [cart]);
  const calculateTotalItems= useCallback(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);

  const openCart   = useCallback(() => setIsCartOpen(true),  []);
  const closeCart  = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen(p => !p), []);

  const placeOrder = useCallback(async (customerInfo = {}) => {
    if (cart.length === 0) { setOrderError('Сагс хоосон байна.'); return null; }
    setOrderLoading(true);
    setOrderError(null);
    try {
      const orderData = {
        items: cart.map(i => ({ menuItem: i.id, name: i.name, quantity: i.quantity, price: i.price })),
        totalAmount:  calculateTotal(),
        customerName: customerInfo.customerName || 'Зочин',
        phone:        customerInfo.phone  || '',
        address:      customerInfo.address || '',
        note:         customerInfo.note   || '',
        orderType:    customerInfo.orderType || 'pickup',
        paymentMethod:customerInfo.paymentMethod || 'cash',
      };
      const result = await api.post('/orders', orderData);
      setLastOrder(result);
      clearCart();
      closeCart();
      return result;
    } catch (error) {
      setOrderError(error?.message || 'Захиалга илгээхэд алдаа гарлаа.');
      return null;
    } finally {
      setOrderLoading(false);
    }
  }, [cart, calculateTotal, clearCart, closeCart]);

  return (
    <CartContext.Provider value={{
      cart, isCartOpen,
      addToCart, removeFromCart, updateQuantity, clearCart,
      calculateTotal, calculateTotalItems,
      openCart, closeCart, toggleCart,
      placeOrder, orderLoading, orderError, lastOrder,
    }}>
      {children}
    </CartContext.Provider>
  );
};