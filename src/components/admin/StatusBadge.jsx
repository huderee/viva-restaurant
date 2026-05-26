// src/components/admin/StatusBadge.jsx
import React from 'react';
import { Clock, ChefHat, CheckCircle2, X } from "lucide-react"; // Энэ мөрийг нэмсэн

// Төлөвийн тохиргоо
export const ORDER_STATUS = {
  pending:   { label: 'Хүлээгдэж буй', color: 'rgba(245,158,11,0.15)', text: '#f59e0b', border: 'rgba(245,158,11,0.3)',  dot: '#f59e0b', icon: Clock },
  confirmed: { label: 'Баталгаажсан',  color: 'rgba(16,185,129,0.12)',  text: '#34d399', border: 'rgba(16,185,129,0.25)',  dot: '#34d399', icon: CheckCircle2 },
  cooking:   { label: 'Хийгдэж байна', color: 'rgba(59,130,246,0.15)',  text: '#60a5fa', border: 'rgba(59,130,246,0.3)',  dot: '#60a5fa', icon: ChefHat },
  completed: { label: 'Бэлэн',         color: 'rgba(16,185,129,0.15)',  text: '#34d399', border: 'rgba(16,185,129,0.3)',  dot: '#34d399', icon: CheckCircle2 },
  cancelled: { label: 'Цуцлагдсан',   color: 'rgba(239,68,68,0.15)',   text: '#f87171', border: 'rgba(239,68,68,0.3)',   dot: '#f87171', icon: X },
};

export const RESERVATION_STATUS = {
  pending:   { label: 'Хүлээгдэж буй', color: 'rgba(245,158,11,0.15)', text: '#f59e0b', border: 'rgba(245,158,11,0.3)',  dot: '#f59e0b', icon: Clock },
  confirmed: { label: 'Баталгаажсан',  color: 'rgba(16,185,129,0.15)',  text: '#34d399', border: 'rgba(16,185,129,0.3)',  dot: '#34d399', icon: CheckCircle2 },
  cancelled: { label: 'Цуцлагдсан',   color: 'rgba(239,68,68,0.15)',   text: '#f87171', border: 'rgba(239,68,68,0.3)',   dot: '#f87171', icon: X },
};

RESERVATION_STATUS.late_cancelled = { label: 'Ойрхон цуцалсан', color: 'rgba(249,115,22,0.16)', text: '#fb923c', border: 'rgba(249,115,22,0.35)', dot: '#fb923c', icon: X };
RESERVATION_STATUS.no_show = { label: 'Ирээгүй', color: 'rgba(148,163,184,0.15)', text: '#cbd5e1', border: 'rgba(148,163,184,0.3)', dot: '#94a3b8', icon: X };

function StatusBadge({ status, statusMap = ORDER_STATUS, size = 'md' }) {
  const s = statusMap[status] || statusMap[Object.keys(statusMap)[0]];
  // icon-г шууд ашиглахгүй, зөвхөн badge-д хэрэггүй тул доорх мөрийг хасав
  // const Icon = s.icon; 
  return (
    <span className="status-badge" style={{
      background: s.color,
      color: s.text,
      borderColor: s.border,
      fontSize: size === 'sm' ? '10px' : '11px',
      padding: size === 'sm' ? '3px 8px' : '5px 10px',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, display: 'inline-block', flexShrink: 0 }} />
      {s.label}
    </span>
  );
}

export default StatusBadge;
