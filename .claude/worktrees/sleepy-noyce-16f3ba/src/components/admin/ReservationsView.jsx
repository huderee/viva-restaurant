// src/components/admin/ReservationsView.jsx
import { useState, useEffect } from "react";
import {
  CalendarDays, Search, MoreHorizontal, Users, Clock, Calendar,
  CheckCircle2, Check, Phone, Trash2
} from "lucide-react";
import { useReservations } from "../../contexts/ReservationsContext";
import StatusDropdown from './StatusDropdown';
import { RESERVATION_STATUS } from './StatusBadge';

function ReservationsView({ toastShow }) {
  const { reservations, updateStatus, removeReservation } = useReservations();
  const [search,    setSearch]    = useState('');
  const [filter,    setFilter]    = useState('all');
  const [actionFor, setActionFor] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  const filtered = (reservations ?? []).filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.name?.toLowerCase().includes(q) || r.phone?.includes(q);
    const matchFilter = filter === 'all' || r.status === filter;
    return matchSearch && matchFilter;
  });

  useEffect(() => {
    if (!actionFor) return;
    const handleClick = (e) => {
      if (!e.target.closest('.dropdown-menu')) setActionFor(null);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [actionFor]);

  const todayCount     = filtered.filter(r => r.date === today).length;
  const pendingCount   = filtered.filter(r => r.status === 'pending').length;
  const confirmedCount = filtered.filter(r => r.status === 'confirmed').length;

  const filterTabs = [
    { key: 'all', label: 'Бүгд', count: reservations?.length ?? 0 },
    ...Object.entries(RESERVATION_STATUS).map(([k, v]) => ({
      key: k, label: v.label,
      count: (reservations ?? []).filter(r => r.status === k).length,
    })),
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
            <CalendarDays size={13} color="var(--text-faint)" />
            <span style={{ fontSize: 11, color: 'var(--text-faint)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>Удирдлага</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>Ширээ захиалга</h1>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Нэр, утасаар хайх..."
            className="input-field" style={{ paddingLeft: 34, width: 220 }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          { label: 'Өнөөдрийн захиалга', value: todayCount,     icon: Calendar,      color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)'  },
          { label: 'Хүлээгдэж буй',      value: pendingCount,   icon: Clock,         color: '#60a5fa', bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.2)'  },
          { label: 'Баталгаажсан',        value: confirmedCount, icon: CheckCircle2,  color: '#34d399', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.2)'  },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.icon size={17} color={s.color} />
            </div>
            <div>
              <div className="mono" style={{ fontSize: 22, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 3 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        {filterTabs.map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            style={{
              padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'var(--font-main)',
              border: filter === t.key ? '1px solid rgba(245,158,11,0.4)' : '1px solid var(--border)',
              background: filter === t.key ? 'var(--accent-soft)' : 'var(--bg-elevated)',
              color: filter === t.key ? 'var(--accent)' : 'var(--text-muted)',
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
                <th>Зочин</th>
                <th>Утас</th>
                <th>Огноо &amp; Цаг</th>
                <th>Хүний тоо</th>
                <th>Тэмдэглэл</th>
                <th>Төлөв</th>
                <th style={{ textAlign: 'right' }}>Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-faint)' }}>
                    <CalendarDays size={28} style={{ margin: '0 auto 8px', opacity: 0.25 }} />
                    <div style={{ fontSize: 13 }}>{search ? 'Хайлтын үр дүн олдсонгүй' : 'Ширээ захиалга байхгүй'}</div>
                  </td>
                </tr>
              ) : filtered.map((res) => {
                const id = res._id || res.id;
                const isToday = res.date === today;
                return (
                  <tr key={id} className="data-row">
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <div className="avatar" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', fontSize: 11 }}>
                          {(res.name || 'З')[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{res.name}</div>
                          {isToday && <span style={{ fontSize: 10, color: '#f59e0b', fontWeight: 700 }}>Өнөөдөр</span>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="mono" style={{ fontSize: 12, color: 'var(--text-muted)' }}>{res.phone}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{res.date}</div>
                      <div className="mono" style={{ fontSize: 11, color: 'var(--text-faint)' }}>{res.time}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Users size={12} color="var(--text-faint)" />
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{res.guests}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>хүн</span>
                      </div>
                    </td>
                    <td style={{ maxWidth: 150 }}>
                      <span style={{ fontSize: 12, color: 'var(--text-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                        {res.message || res.note || '—'}
                      </span>
                    </td>
                    <td>
                      <StatusDropdown
                        value={res.status || 'pending'}
                        onChange={s => { updateStatus(id, s); toastShow?.('Төлөв шинэчлэгдлээ'); }}
                        statusMap={RESERVATION_STATUS}
                      />
                    </td>
                    <td style={{ textAlign: 'right', position: 'relative' }}>
                      <button
                        onClick={e => { e.stopPropagation(); setActionFor(p => p === id ? null : id); }}
                        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: 'var(--text-muted)' }}
                      >
                        <MoreHorizontal size={14} />
                      </button>
                      {actionFor === id && (
                        <div
                          onClick={e => e.stopPropagation()}
                          style={{ position: 'absolute', right: 8, top: 44, zIndex: 100, minWidth: 190 }}
                          className="dropdown-menu"
                        >
                          <div style={{ padding: '6px 14px 4px', fontSize: 10, fontWeight: 700, color: 'var(--text-faint)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                            Төлөв солих
                          </div>
                          {Object.entries(RESERVATION_STATUS).map(([k, cfg]) => (
                            <button key={k} className="dropdown-item" onClick={() => { updateStatus(id, k); toastShow?.('Төлөв шинэчлэгдлээ'); setActionFor(null); }}>
                              <span style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
                              <span style={{ flex: 1 }}>{cfg.label}</span>
                              {res.status === k && <Check size={11} color="var(--accent)" />}
                            </button>
                          ))}
                          <div className="dropdown-divider" />
                          {res.phone && (
                            <button className="dropdown-item" onClick={() => {
                              navigator.clipboard.writeText(res.phone).catch(() => {});
                              toastShow?.('Утас хуулбарлагдлаа');
                              setActionFor(null);
                            }}>
                              <Phone size={13} /> Утас хуулбарлах
                            </button>
                          )}
                          <div className="dropdown-divider" />
                          <button className="dropdown-item danger" onClick={() => {
                            if (window.confirm('Захиалга устгах уу?')) {
                              removeReservation(id);
                              toastShow?.('Захиалга устгагдлаа', 'error');
                            }
                            setActionFor(null);
                          }}>
                            <Trash2 size={13} /> Устгах
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>{filtered.length} захиалга</span>
            <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>Нийт: {filtered.reduce((s, r) => s + (r.guests || 0), 0)} хүн</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReservationsView;