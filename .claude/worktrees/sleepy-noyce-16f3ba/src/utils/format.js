// src/utils/format.js
export const currency = (n) => (Number(n) || 0).toLocaleString('mn-MN') + '₮';

export const uid = (prefix='id') =>
  `${prefix}_${Math.random().toString(36).slice(2,8)}_${Date.now().toString(36)}`;

export const genOrderNumber = () => {
  const d = new Date();
  const ymd = [
    d.getFullYear(),
    String(d.getMonth()+1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('');
  const seqKey = `huuk_order_seq_${ymd}`;
  const current = Number(localStorage.getItem(seqKey) || 0) + 1;
  localStorage.setItem(seqKey, String(current));
  return `#ORD-${ymd}-${String(current).padStart(4, '0')}`;
};