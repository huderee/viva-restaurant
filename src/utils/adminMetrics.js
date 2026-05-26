// src/utils/adminMetrics.js

// ── Төлбөрийн төлөв ──────────────────────────────────────────────
export const PAYMENT_STATUS = {
  pending:   { label: 'Төлөөгүй',    color: '#94a3b8' },
  paid:      { label: 'Төлсөн',      color: '#10b981' },
  failed:    { label: 'Амжилтгүй',   color: '#ef4444' },
  refunded:  { label: 'Буцаасан',    color: '#f59e0b' },
};

// ── Paid захиалга шүүх ───────────────────────────────────────────
export const isPaidOrder = (order) =>
  order?.paymentStatus === 'paid';

// ── Зөвхөн төлсөн захиалгын нийт орлого ─────────────────────────
export const sumPaidRevenue = (orders = []) =>
  orders
    .filter(isPaidOrder)
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

// ── Төлсөн захиалгын дундаж үнэ ─────────────────────────────────
export const avgPaidOrderValue = (orders = []) => {
  const paid = orders.filter(isPaidOrder);
  if (!paid.length) return 0;
  return Math.round(sumPaidRevenue(paid) / paid.length);
};

// ── Нэг захиалгын орлого (paid бол дүн, эс бол 0) ───────────────
export const orderRevenue = (order) =>
  isPaidOrder(order) ? (order?.totalAmount || 0) : 0;

// ── Өдрөөр орлого (paid захиалга) ───────────────────────────────
export const getRevenueByDay = (orders = []) => {
  const map = {};
  orders.filter(isPaidOrder).forEach(o => {
    const date = (o.createdAt || '').split('T')[0];
    if (date) map[date] = (map[date] || 0) + (o.totalAmount || 0);
  });
  return map;
};

// ── Статусаар тоо ────────────────────────────────────────────────
export const getOrdersByStatus = (orders = []) =>
  orders.reduce((acc, o) => {
    const s = o.status || 'pending';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

// ── Алдартай хоол (paid захиалгаас) ─────────────────────────────
export const getPopularItems = (orders = []) => {
  const counts = {};
  orders.filter(isPaidOrder).forEach(o =>
    o.items?.forEach(item => {
      counts[item.name] = (counts[item.name] || 0) + (item.quantity || 1);
    })
  );
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));
};

// ── Нийт тоо (хуучин файлтай нийцэх) ────────────────────────────
export const calculateTotalRevenue    = (orders = []) =>
  orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
export const calculateOrderCount      = (orders = []) => orders.length;
export const calculateAverageOrderValue = (orders = []) => {
  if (!orders.length) return 0;
  return calculateTotalRevenue(orders) / orders.length;
};
export const calculateReservationCount  = (r = []) => r.length;
export const calculateActiveReservations = (reservations = []) => {
  const now = new Date();
  return reservations.filter(r =>
    new Date(r.date) >= now && r.status !== 'cancelled'
  ).length;
};