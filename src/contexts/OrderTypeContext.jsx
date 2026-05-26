// src/contexts/OrderTypeContext.jsx
import React, { createContext, useContext, useState } from 'react';

const OrderTypeContext = createContext(null);

export const BRANCHES = [
  { id: 1, name: 'Жаргалант салбар', address: 'Ховд, Жаргалант сум, Жаргалан баг', hours: '10:00-23:00' },
  { id: 2, name: 'Төв салбар',       address: 'Ховд, Мянгад сум, Төв',             hours: '10:00-22:00' },
];

export function OrderTypeProvider({ children }) {
  const [orderType,      setOrderType]      = useState('pickup');   // 'pickup' | 'delivery'
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0]);
  const [deliveryAddress,setDeliveryAddress] = useState('');

  return (
    <OrderTypeContext.Provider value={{
      orderType, setOrderType,
      selectedBranch, setSelectedBranch,
      deliveryAddress, setDeliveryAddress,
      branches: BRANCHES,
    }}>
      {children}
    </OrderTypeContext.Provider>
  );
}

export function useOrderType() {
  const ctx = useContext(OrderTypeContext);
  if (!ctx) throw new Error('useOrderType must be used within OrderTypeProvider');
  return ctx;
}