// src/contexts/CartContext.jsx
// QPay-д зориулж clearCart-ийг paymentMethod-аас хамааруулж шинэчилсэн

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

  const getUnitPrice = (item) => Number(item.customPrice ?? item.unitPrice ?? item.price ?? 0);

  const getCartLineId = (item) => {
    const baseId = String(item.menuItemId ?? item.baseId ?? item.id);
    const removed = (item.removedIngredients || []).slice().sort().join(',');
    const extras = (item.addedExtras || []).map(e => e.id || e.name).sort().join(',');
    const hasCustom = removed || extras || item.customPrice !== undefined;
    return hasCustom ? `${baseId}::${removed}::${extras}` : baseId;
  };

  // LocalStorage-аас сагс уншна
  useEffect(() => {
    const saved = localStorage.getItem('huuk-restaurant-cart');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setCart(parsed);
      } catch (err) {
        console.error('CartContext: сагсны өгөгдөл унших амжилтгүй:', err);
        localStorage.removeItem('huuk-restaurant-cart');
      }
    }
  }, []);

  // Сагс өөрчлөгдөхөд хадгална
  useEffect(() => {
    localStorage.setItem('huuk-restaurant-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((item) => {
    setCart(prev => {
      const lineId = getCartLineId(item);
      const unitPrice = getUnitPrice(item);
      const existing = prev.find(c => c.id === lineId);
      if (existing) return prev.map(c => c.id === lineId ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, {
        ...item,
        id: lineId,
        menuItemId: item.menuItemId ?? item.id,
        baseId: item.baseId ?? item.id,
        price: unitPrice,
        unitPrice,
        quantity: 1,
      }];
    });
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCart(prev => {
      if (prev.some(i => i.id === itemId)) return prev.filter(i => i.id !== itemId);
      const index = prev.findIndex(i => String(i.baseId ?? i.menuItemId) === String(itemId));
      if (index === -1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const updateQuantity = useCallback((itemId, newQty) => {
    if (newQty < 1) { removeFromCart(itemId); return; }
    setCart(prev => prev.map(i => i.id === itemId ? { ...i, quantity: newQty } : i));
  }, [removeFromCart]);

  const clearCart           = useCallback(() => setCart([]), []);
  const calculateTotal      = useCallback(() => cart.reduce((s, i) => s + getUnitPrice(i) * i.quantity, 0), [cart]);
  const calculateTotalItems = useCallback(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);

  const openCart   = useCallback(() => setIsCartOpen(true),  []);
  const closeCart  = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen(p => !p), []);

  const placeOrder = useCallback(async (customerInfo = {}) => {
    if (cart.length === 0) { setOrderError('Сагс хоосон байна.'); return null; }
    setOrderLoading(true);
    setOrderError(null);
    try {
      const orderData = {
        items:         cart.map(i => ({
          menuItem: i.menuItemId || i.baseId || i.id,
          name: i.name,
          quantity: i.quantity,
          price: getUnitPrice(i),
        })),
        totalAmount:   calculateTotal(),
        customerName:  customerInfo.customerName || customerInfo.name || 'Зочин',
        phone:         customerInfo.phone   || '',
        address:       customerInfo.address || '',
        note:          customerInfo.note    || '',
        orderType:     customerInfo.orderType    || 'pickup',
        paymentMethod: customerInfo.paymentMethod || 'cash',
      };

      const result = await api.post('/orders', orderData);
      const order  = result?.data || result;
      setLastOrder(order);
      closeCart();
      return order;
    } catch (error) {
      setOrderError(error?.message || 'Захиалга илгээхэд алдаа гарлаа.');
      return null;
    } finally {
      setOrderLoading(false);
    }
  }, [cart, calculateTotal, closeCart]);

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
