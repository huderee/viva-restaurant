// src/utils/format.js

/** Мөнгөн дүн форматлах: 12345 → "12,345₮" */
export const currency = (n) => (Number(n) || 0).toLocaleString('mn-MN') + '₮';

/**
 * Crypto-аар аюулгүй unique ID үүсгэх.
 * Math.random() ашиглахаас илүү найдвартай.
 */
export const uid = (prefix = 'id') => {
  const arr = new Uint32Array(2);
  crypto.getRandomValues(arr);
  const rand = arr[0].toString(36) + arr[1].toString(36);
  return `${prefix}_${rand}_${Date.now().toString(36)}`;
};

/**
 * Захиалгын дугаар үүсгэх: #ORD-20250415-0001
 * Өдрийн дараалсан дугаар localStorage-д хадгална.
 */
export const genOrderNumber = () => {
  const d   = new Date();
  const ymd = [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('');
  const seqKey  = `huuk_order_seq_${ymd}`;
  const current = Number(localStorage.getItem(seqKey) || 0) + 1;
  localStorage.setItem(seqKey, String(current));
  return `#ORD-${ymd}-${String(current).padStart(4, '0')}`;
};
