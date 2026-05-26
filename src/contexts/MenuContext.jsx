// src/contexts/MenuContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../lib/api';
import { loadJSON, saveJSON } from '../lib/storage';
import { uid } from '../utils/format';
import { menuItems as defaultMenu, categories as defaultCategories } from '../data/restaurantData';

const MenuContext = createContext(null);

const LS_MENU    = 'huuk_menu_items';
const LS_CATS    = 'huuk_menu_categories';
const LS_VERSION = 'huuk_menu_version';
const MENU_VER   = '7'; // энэ тоог өөрчилбөл localStorage кэш автоматаар цэвэрлэгдэнэ

const isValidUrl = (s) => typeof s === 'string' && s.startsWith('http');

const normalize = (item) => {
  const resolvedUrl = isValidUrl(item.imageUrl) ? item.imageUrl
                    : isValidUrl(item.image)     ? item.image
                    : '';
  return {
    ...item,
    id:       item._id?.toString() || item.id || uid('menu'),
    imageUrl: resolvedUrl,
    image:    resolvedUrl,   // keep both fields identical to avoid stale-field confusion
  };
};

export const MenuProvider = ({ children }) => {
  // Version шалгах — хуучин кэш байвал цэвэрлэж defaultMenu ашиглана
  const [items,      setItems]      = useState(() => {
    if (localStorage.getItem(LS_VERSION) !== MENU_VER) {
      localStorage.removeItem(LS_MENU);
      localStorage.removeItem(LS_CATS);
      localStorage.setItem(LS_VERSION, MENU_VER);
      return defaultMenu ?? [];
    }
    return loadJSON(LS_MENU, defaultMenu ?? []);
  });
  const [categories, setCategories] = useState(() => loadJSON(LS_CATS, defaultCategories ?? []));

  // Categories localStorage-д хадгална
  useEffect(() => { saveJSON(LS_CATS, categories); }, [categories]);

  // Backend-ийн өгөгдлөөр арын дэвсгэрт шинэчилнэ (хэрэв байвал)
  useEffect(() => {
    let cancelled = false;
    api.get('/menu')
      .then(json => {
        if (cancelled) return;
        const data = Array.isArray(json) ? json : (json.data ?? []);
        if (data.length > 0) {
          const normalized = data.map(item => {
            const norm = normalize(item);
            // imageUrl хүчингүй бол defaultMenu-аас нэрээр тааруулж авна
            if (!isValidUrl(norm.imageUrl)) {
              const match = defaultMenu.find(d => d.name === norm.name);
              if (match?.imageUrl) { norm.imageUrl = match.imageUrl; norm.image = match.imageUrl; }
            }
            return norm;
          });
          // Server items-аар шинэчлэх + local-only (menu_ prefix) items-ийг хадгална
          setItems(prev => {
            const localOnly = prev.filter(i => String(i.id).startsWith('menu_'));
            const merged = [...normalized, ...localOnly];
            saveJSON(LS_MENU, merged);
            return merged;
          });
        }
      })
      .catch(() => { /* backend унтарсан — localStorage-ийн өгөгдлийг хэвээр хадгална */ });
    return () => { cancelled = true; };
  }, []);

  const upsertItem = useCallback(async (payload) => {
    const isLocalId = !payload.id || payload.id.startsWith('menu_') || payload.id.startsWith('cat_');
    try {
      let saved;
      if (payload.id && !isLocalId) {
        const json = await api.put(`/menu/${payload.id}`, payload);
        saved = normalize(json.data ?? json);
        setItems(prev => { const next = prev.map(i => i.id === saved.id ? saved : i); saveJSON(LS_MENU, next); return next; });
      } else if (payload.id && isLocalId) {
        const { id: _localId, ...rest } = payload;
        const json = await api.post('/menu', rest);
        saved = normalize(json.data ?? json);
        setItems(prev => { const next = prev.map(i => i.id === _localId ? saved : i); saveJSON(LS_MENU, next); return next; });
      } else {
        const json = await api.post('/menu', payload);
        saved = normalize(json.data ?? json);
        setItems(prev => { const next = [saved, ...prev]; saveJSON(LS_MENU, next); return next; });
      }
      return saved.id;
    } catch (err) {
      console.error('❌ upsertItem алдаа:', err.message);
      if (payload.id) {
        const updated = { ...payload, price: Number(payload.price) };
        setItems(prev => { const next = prev.map(i => i.id === payload.id ? { ...i, ...updated } : i); saveJSON(LS_MENU, next); return next; });
        return payload.id;
      } else {
        const id = uid('menu');
        setItems(prev => { const next = [{ ...payload, id, price: Number(payload.price) }, ...prev]; saveJSON(LS_MENU, next); return next; });
        return id;
      }
    }
  }, []);

  const removeItem = useCallback(async (id) => {
    setItems(prev => { const next = prev.filter(i => i.id !== id); saveJSON(LS_MENU, next); return next; });
    try { await api.delete(`/menu/${id}`); } catch { /* тэвчих */ }
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
      loading:    false,
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
