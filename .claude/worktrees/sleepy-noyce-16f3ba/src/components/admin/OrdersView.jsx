// src/components/admin/OrdersView.jsx
import { useState, useEffect, useRef } from "react";
import {
  ShoppingBag, Search, RefreshCw, MoreHorizontal, Eye, Printer,
  FileDown, ClipboardCopy, Trash2, Phone
} from "lucide-react";
import { useOrders } from "../../contexts/OrdersContext";
import { currency } from "../../utils/format";
import StatusBadge, { ORDER_STATUS } from './StatusBadge';
import StatusDropdown from './StatusDropdown';
import OrderDetailsModal from './OrderDetailsModal';

function OrdersView({ toastShow }) {
  const { orders, updateOrderStatus, removeOrder, fetchOrders, loading } = useOrders();
  const [search,    setSearch]    = useState('');
  const [filter,    setFilter]    = useState('all');
  const [actionFor, setActionFor] = useState(null);
  const [detailFor, setDetailFor] = useState(null);
  const menuRef = useRef(null);

  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    const matchSearch = !q || o._id?.toLowerCase().includes(q) || o.customerName?.toLowerCase().includes(q) || o.phone?.includes(q);
    const matchFilter = filter === 'all' || o.status === filter;
    return matchSearch && matchFilter;
  });

  useEffect(() => {
    if (!actionFor) return;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActionFor(null);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [actionFor]);

  const copyText = async (text, label) => {
    try { await navigator.clipboard.writeText(String(text ?? '')); }
    catch {
      const ta = document.createElement('textarea');
      ta.value = String(text ?? '');
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    toastShow?.(`${label} хуулбарлагдлаа`);
  };

  const downloadJSON = (obj, filename) => {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    toastShow?.('JSON татагдлаа');
  };

  const printOrder = (o) => {
    const itemsLine = (o.items ?? []).map(i => `
      <tr>
        <td style="padding:6px 0;border-bottom:1px solid #f1f5f9">${i.name} × ${i.quantity}</td>
        <td style="text-align:right;padding:6px 0;border-bottom:1px solid #f1f5f9;font-weight:700">${currency((i.price??0)*(i.quantity??1))}</td>
      </tr>
    `).join('');
    const win = window.open('', '_blank', 'width=440,height=640');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Баримт #${o._id?.slice(-6).toUpperCase()}</title>
    <style>*{box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;margin:0;padding:28px;color:#0f172a;max-width:380px;margin:auto}.header{text-align:center;margin-bottom:20px;padding-bottom:16px;border-bottom:2px dashed #e2e8f0}.logo{font-size:22px;font-weight:900;color:#f59e0b;margin-bottom:4px}.sub{font-size:12px;color:#94a3b8}.id{font-size:14px;font-weight:700;margin-bottom:2px}.section{margin:16px 0}.label{font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px}.val{font-size:14px;font-weight:600}table{width:100%;border-collapse:collapse;font-size:13px}.total{font-size:17px;font-weight:900;color:#f59e0b;text-align:right;padding-top:12px}.status{display:inline-block;padding:4px 12px;border-radius:99px;font-size:11px;font-weight:700;background:#fef3c7;color:#d97706}.footer{margin-top:20px;text-align:center;font-size:11px;color:#94a3b8}</style>
    </head><body>
    <div class="header"><div class="logo">🍽 HuuK</div><div class="sub">Захиалгын баримт</div></div>
    <div class="id">#${o._id?.slice(-6).toUpperCase()}</div>
    <div style="font-size:12px;color:#94a3b8;margin-bottom:16px">${new Date(o.createdAt).toLocaleString('mn-MN')}</div>
    <div class="section"><div class="label">Хэрэглэгч</div><div class="val">${o.customerName||'Зочин'}</div>${o.phone?`<div style="font-size:12px;color:#64748b">${o.phone}</div>`:''}</div>
    <div class="section"><div class="label">Захиалсан зүйлс</div><table>${itemsLine}</table><div class="total">Нийт: ${currency(o.totalAmount||0)}</div></div>
    <div class="section"><span class="status">${ORDER_STATUS[o.status]?.label||o.status}</span></div>
    <div class="footer">Баярлалаа! ✦ huuk.mn</div>
    <script>window.onload=()=>{window.print();setTimeout(()=>window.close(),400)}<\/script></body></html>`);
    win.document.close();
  };

  const filterTabs = [
    { key: 'all', label: 'Бүгд', count: orders.length },
    ...Object.entries(ORDER_STATUS).map(([k, v]) => ({ key: k, label: v.label, count: orders.filter(o => o.status === k).length })),
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
            <ShoppingBag size={13} color="var(--text-faint)" />
            <span style={{ fontSize: 11, color: 'var(--text-faint)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>Удирдлага</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>Захиалгууд</h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Хайх..."
              className="input-field" style={{ paddingLeft: 34, width: 220 }} />
          </div>
          <button onClick={fetchOrders} className="btn btn-ghost">
            <RefreshCw size={13} /> Шинэчлэх
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        {filterTabs.map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            style={{
              padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.15s',
              border: filter === t.key ? '1px solid rgba(245,158,11,0.4)' : '1px solid var(--border)',
              background: filter === t.key ? 'var(--accent-soft)' : 'var(--bg-elevated)',
              color: filter === t.key ? 'var(--accent)' : 'var(--text-muted)',
              fontFamily: 'var(--font-main)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            {t.label}
            <span className="mono" style={{
              fontSize: 10, padding: '1px 5px', borderRadius: 99,
              background: filter === t.key ? 'rgba(245,158,11,0.2)' : 'var(--border)',
            }}>{t.count}</span>
          </button>
        ))}
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Захиалга #</th>
                <th>Хэрэглэгч</th>
                <th>Огноо</th>
                <th>Зүйлс</th>
                <th>Нийт</th>
                <th>Төлөв</th>
                <th style={{ textAlign: 'right' }}>Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="data-row">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j}><div className="skeleton" style={{ height: 14, width: j === 3 ? 140 : 80 }} /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-faint)' }}>
                    <ShoppingBag size={28} style={{ margin: '0 auto 8px', opacity: 0.25 }} />
                    <div style={{ fontSize: 13 }}>{search ? 'Хайлтын үр дүн олдсонгүй' : 'Захиалга байхгүй'}</div>
                  </td>
                </tr>
              ) : filtered.map((o) => (
                <tr key={o._id} className="data-row">
                  <td>
                    <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>
                      #{o._id?.slice(-6).toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <div className="avatar" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', fontSize: 11 }}>
                        {(o.customerName || 'З')[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{o.customerName || 'Зочин'}</div>
                        {o.phone && <div style={{ fontSize: 11, color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>{o.phone}</div>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(o.createdAt).toLocaleDateString('mn-MN')}</div>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--text-faint)' }}>{new Date(o.createdAt).toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  <td style={{ maxWidth: 180 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {o.items?.map(i => `${i.name} ×${i.quantity}`).join(', ') || '—'}
                    </div>
                    {o.items?.length > 0 && <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 2 }}>{o.items.length} зүйл</div>}
                  </td>
                  <td>
                    <span className="mono" style={{ fontSize: 13, fontWeight: 800, color: '#f59e0b' }}>{currency(o.totalAmount || 0)}</span>
                  </td>
                  <td>
                    <StatusDropdown
                      value={o.status}
                      onChange={s => { updateOrderStatus(o._id, s); toastShow?.('Төлөв шинэчлэгдлээ'); }}
                      statusMap={ORDER_STATUS}
                    />
                  </td>
                  <td style={{ textAlign: 'right', position: 'relative' }}>
                    <div ref={menuRef}>
                      <button
                        onClick={e => { e.stopPropagation(); setActionFor(p => p === o._id ? null : o._id); }}
                        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.15s' }}
                      >
                        <MoreHorizontal size={14} />
                      </button>
                      {actionFor === o._id && (
                        <div
                          onClick={e => e.stopPropagation()}
                          style={{ position: 'absolute', right: 8, top: 44, zIndex: 100, minWidth: 190 }}
                          className="dropdown-menu"
                        >
                          <button className="dropdown-item" onClick={() => { setDetailFor(o); setActionFor(null); }}>
                            <Eye size={13} /> Дэлгэрэнгүй
                          </button>
                          <div className="dropdown-divider" />
                          <button className="dropdown-item" onClick={() => { printOrder(o); setActionFor(null); }}>
                            <Printer size={13} /> Хэвлэх
                          </button>
                          <button className="dropdown-item" onClick={() => { downloadJSON(o, `order-${o._id}.json`); setActionFor(null); }}>
                            <FileDown size={13} /> JSON татах
                          </button>
                          <button className="dropdown-item" onClick={() => { copyText(o._id, 'Захиалгын ID'); setActionFor(null); }}>
                            <ClipboardCopy size={13} /> ID хуулбарлах
                          </button>
                          {o.phone && (
                            <button className="dropdown-item" onClick={() => { copyText(o.phone, 'Утасны дугаар'); setActionFor(null); }}>
                              <Phone size={13} /> Утас хуулбарлах
                            </button>
                          )}
                          <div className="dropdown-divider" />
                          <button className="dropdown-item danger" onClick={() => {
                            if (window.confirm('Захиалга устгах уу?')) {
                              removeOrder(o._id);
                              toastShow?.('Захиалга устгагдлаа', 'error');
                            }
                            setActionFor(null);
                          }}>
                            <Trash2 size={13} /> Устгах
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>{filtered.length} захиалга харагдаж байна</span>
          </div>
        )}
      </div>

      {detailFor && (
        <OrderDetailsModal
          order={detailFor}
          onClose={() => setDetailFor(null)}
          onPrint={() => printOrder(detailFor)}
          onStatus={s => { updateOrderStatus(detailFor._id, s); setDetailFor(p => ({ ...p, status: s })); toastShow?.('Төлөв шинэчлэгдлээ'); }}
          toastShow={toastShow}
        />
      )}
    </div>
  );
}

export default OrdersView;