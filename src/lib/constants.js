// src/lib/constants.js
// ─── Нэг газарт тодорхойлсон глобал тогтмолууд ───────────────────────────────

// API endpoint — .env.local-д VITE_API_URL=https://api.example.com гэж тохируулна
export const API_BASE_URL =
  import.meta.env.VITE_API_URL
  ?? (window.location.hostname.endsWith('.vercel.app')
    ? 'https://viva-restaurant-api.vercel.app/api'
    : '/api');

// Admin token localStorage key
export const TOKEN_KEY = 'admin_token';

// Холбоо барих мэдээлэл
export const CONTACT = {
  phone:   '+976 8529-2577',
  email:   'info@vivarestaurant.mn',
  address: 'Ховд, Жаргалант сум, Жаргалан баг',
};

// Ажлын цаг
export const HOURS = [
  { day: 'Даваа – Баасан', time: '10:00 – 23:00' },
  { day: 'Бямба – Ням',    time: '10:00 – 00:00' },
];
