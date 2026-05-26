// src/contexts/MenuContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { loadJSON, saveJSON } from '../lib/storage';
import { uid } from '../utils/format';
import { menuItems as defaultMenu, categories as defaultCategories } from '../data/restaurantData';

const MenuContext = createContext(null);
const LS_MENU    = 'huuk_menu_items';
const LS_CATS    = 'huuk_menu_categories';
const LS_VERSION = 'huuk_menu_version';

// ✅ restaurantData өөрчлөгдөх бүрт энийг нэмэгдүүл: v2, v3...
const DATA_VERSION = 'v2';

const initItems = () => {
  const savedVersion = localStorage.getItem(LS_VERSION);
  if (savedVersion !== DATA_VERSION) {
    // Хуучин localStorage цэвэрлэж шинэ data ачаална
    localStorage.removeItem(LS_MENU);
    localStorage.removeItem(LS_CATS);
    localStorage.setItem(LS_VERSION, DATA_VERSION);
    return defaultMenu ?? [];
  }
  return loadJSON(LS_MENU, defaultMenu ?? []);
};

const initCategories = () => {
  const savedVersion = localStorage.getItem(LS_VERSION);
  if (savedVersion !== DATA_VERSION) return defaultCategories ?? [];
  return loadJSON(LS_CATS, defaultCategories ?? []);
};

export const MenuProvider = ({ children }) => {
  const [items,      setItems]      = useState(initItems);
  const [categories, setCategories] = useState(initCategories);

  useEffect(() => saveJSON(LS_MENU, items),      [items]);
  useEffect(() => saveJSON(LS_CATS, categories), [categories]);

  const upsertItem = useCallback((payload) => {
    if (payload.id) {
      setItems(prev => prev.map(i =>
        i.id === payload.id ? { ...i, ...payload, price: Number(payload.price) } : i
      ));
      return payload.id;
    }
    const id = uid('menu');
    setItems(prev => [{ ...payload, id, price: Number(payload.price) }, ...prev]);
    return id;
  }, []);

  const removeItem = useCallback((id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const upsertCategory = useCallback((cat) => {
    if (cat.id) {
      setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, ...cat } : c));
      return cat.id;
    }
    const id = uid('cat');
    setCategories(prev => [...prev, { ...cat, id }]);
    return id;
  }, []);

  const removeCategory = useCallback((id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  }, []);

  return (
    <MenuContext.Provider value={{
      items:      items      ?? [],
      categories: categories ?? [],
      upsertItem,
      removeItem,
      upsertCategory,
      removeCategory,
    }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => useContext(MenuContext);