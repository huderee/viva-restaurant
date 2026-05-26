// src/utils/exportCsv.js
// Excel-ээр нээдэг UTF-8 BOM-тай CSV файл үүсгэн татах туслах функцүүд.

const escapeCsv = (value) => {
  if (value === null || value === undefined) return '';
  const str = String(value);
  // Хэрэв comma, quote, newline агуулсан бол quote хийгээд дотор нь quote-ийг давхарлана
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

/**
 * Download CSV.
 * @param {string} filename  - "orders-2026-04-21.csv"
 * @param {Array<{key, label, format?}>} columns
 * @param {Array<object>} rows
 */
export function downloadCsv(filename, columns, rows) {
  const header = columns.map(c => escapeCsv(c.label)).join(',');
  const body = rows.map(row =>
    columns.map(c => {
      const raw = row[c.key];
      const val = c.format ? c.format(raw, row) : raw;
      return escapeCsv(val);
    }).join(',')
  ).join('\n');

  // UTF-8 BOM → Excel-д Mongolian үсэг зөв харагдана
  const BOM = '\uFEFF';
  const csv = BOM + header + '\n' + body;

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

const today = () => new Date().toISOString().slice(0, 10);

/* ── Загварууд ───────────────────────────────────── */

export const exportOrders = (orders) => {
  downloadCsv(
    `orders-${today()}.csv`,
    [
      { key: 'orderNumber', label: 'Захиалгын #' },
      { key: 'customerName', label: 'Хэрэглэгч' },
      { key: 'customerPhone', label: 'Утас' },
      { key: 'createdAt', label: 'Огноо', format: (v) => v ? new Date(v).toLocaleString('mn-MN') : '' },
      { key: 'items', label: 'Зүйлс', format: (items) =>
        Array.isArray(items) ? items.map(i => `${i.name} x${i.quantity}`).join('; ') : ''
      },
      { key: 'totalAmount', label: 'Нийт', format: (v) => Number(v || 0).toLocaleString() },
      { key: 'status', label: 'Төлөв' },
    ],
    orders
  );
};

export const exportReservations = (reservations) => {
  downloadCsv(
    `reservations-${today()}.csv`,
    [
      { key: 'name', label: 'Нэр' },
      { key: 'phone', label: 'Утас' },
      { key: 'email', label: 'Имэйл' },
      { key: 'date', label: 'Өдөр' },
      { key: 'time', label: 'Цаг' },
      { key: 'guests', label: 'Хүний тоо' },
      { key: 'tableType', label: 'Төрөл', format: (v) => v === 'vip' ? 'VIP' : 'Стандарт' },
      { key: 'branch', label: 'Салбар' },
      { key: 'status', label: 'Төлөв' },
      { key: 'message', label: 'Тэмдэглэл' },
      { key: 'createdAt', label: 'Бүртгэсэн', format: (v) => v ? new Date(v).toLocaleString('mn-MN') : '' },
    ],
    reservations
  );
};
