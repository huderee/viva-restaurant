// src/components/admin/ReservationsView.jsx
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  CalendarDays, Search, MoreHorizontal, Users, Clock, Calendar,
  CheckCircle2, Check, Phone, Trash2, Crown, Bell, BellRing, BellOff, Download
} from "lucide-react";
import { useReservations } from "../../contexts/ReservationsContext";
import StatusDropdown from './StatusDropdown';
import { RESERVATION_STATUS } from './StatusBadge';
import { exportReservations } from '../../utils/exportCsv';
import EmptyState from './EmptyState';

function ReservationsView({ toastShow }) {
  const {
    reservations, updateStatus, removeReservation,
    newSinceOpen, clearNewCount, requestNotificationPermission, onNewReservations,
  } = useReservations();
  const [notifPerm, setNotifPerm] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  );

  // Шинэ захиалга ирэхэд toast харуулах
  useEffect(() => {
    const off = onNewReservations?.((newOnes) => {
      if (newOnes.length === 1) {
        toastShow?.(`Шинэ захиалга: ${newOnes[0].name || 'Нэргүй'}`);
      } else if (newOnes.length > 1) {
        toastShow?.(`${newOnes.length} шинэ захиалга ирлээ`);
      }
    });
    return off;
  }, [onNewReservations, toastShow]);

  // Энэ view нээгдсэн үед counter-г цэвэрлэх
  useEffect(() => {
    clearNewCount?.();
  }, [clearNewCount]);

  const askNotifyPermission = async () => {
    const r = await requestNotificationPermission?.();
    setNotifPerm(r);
    if (r === 'granted') toastShow?.('Browser notification идэвхжлээ');
    else if (r === 'denied') toastShow?.('Browser тохиргооноос зөвшөөрөл өгнө үү', 'error');
  };
  const [search,    setSearch]    = useState('');
  const [filter,    setFilter]    = useState('all');
  const [actionFor, setActionFor] = useState(null);

  const getActionMenuPos = (button, menuHeight = 252) => {
    const rect = button.getBoundingClientRect();
    const menuWidth = 190;
    const gap = 6;
    const margin = 12;
    const openUp = window.innerHeight - rect.bottom < menuHeight + gap && rect.top > menuHeight + gap;

    const top = openUp ? rect.top - menuHeight - gap : rect.bottom + gap;
    const maxTop = Math.max(margin, window.innerHeight - menuHeight - margin);

    return {
      top: Math.min(Math.max(top, margin), maxTop),
      left: Math.min(
        Math.max(rect.right - menuWidth, margin),
        window.innerWidth - menuWidth - margin
      ),
      origin: openUp ? 'bottom right' : 'top right',
    };
  };

  const toggleActionMenu = (id, button) => {
    setActionFor(current => (
      current?.id === id ? null : { id, pos: getActionMenuPos(button) }
    ));
  };

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
    const handleViewportChange = () => setActionFor(null);
    document.addEventListener('click', handleClick);
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, true);
    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
    };
  }, [actionFor]);

  const todayCount     = (reservations ?? []).filter(r => r.date === today && r.status !== 'cancelled').length;
  const pendingCount   = (reservations ?? []).filter(r => r.status === 'pending').length;
  const confirmedCount = (reservations ?? []).filter(r => r.status === 'confirmed').length;

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={askNotifyPermission}
            title={
              notifPerm === 'granted' ? 'Browser notification идэвхтэй'
              : notifPerm === 'denied' ? 'Browser тохиргооноос зөвшөөрөл өгнө үү'
              : 'Шинэ захиалгын дуут мэдэгдэл идэвхжүүлэх'
            }
            style={{
              width: 38, height: 38, borderRadius: 10,
              background: notifPerm === 'granted' ? 'rgba(16,185,129,0.08)' : 'var(--bg-elevated)',
              border: `1px solid ${notifPerm === 'granted' ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`,
              color: notifPerm === 'granted' ? '#10b981' : 'var(--text-muted)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}
          >
            {notifPerm === 'granted' ? <BellRing size={15} />
             : notifPerm === 'denied' ? <BellOff size={15} />
             : <Bell size={15} />}
          </button>
          <button
            onClick={() => {
              if (!filtered.length) return toastShow?.('Экспортлох өгөгдөл алга', 'error');
              exportReservations(filtered);
              toastShow?.(`${filtered.length} захиалга экспортлогдлоо`);
            }}
            className="btn btn-ghost"
            title="CSV татах"
          >
            <Download size={13} /> Экспорт
          </button>
          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Нэр, утасаар хайх..."
              className="input-field" style={{ paddingLeft: 34, width: 220 }} />
          </div>
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
                  <td colSpan={7} style={{ padding: 0 }}>
                    <EmptyState
                      icon={search ? Search : CalendarDays}
                      title={search ? 'Хайлтын үр дүн олдсонгүй' : 'Ширээ захиалга хараахан алга'}
                      description={search
                        ? `"${search}" гэсэн үгээр ямар ч захиалга олдсонгүй.`
                        : 'Хэрэглэгч сайт дээр ширээ захиалмагц энд шууд харагдана.'}
                      color={search ? 'neutral' : 'accent'}
                    />
                  </td>
                </tr>
              ) : filtered.map((res) => {
                const id = res._id || res.id;
                const isToday = res.date === today;
                return (
                  <tr key={id} className="data-row">
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <div className="avatar" style={{ background: res.tableType === 'vip' ? 'linear-gradient(135deg,#f59e0b,#eab308)' : 'var(--bg-elevated)', color: res.tableType === 'vip' ? '#fff' : 'var(--text-muted)', fontSize: 11 }}>
                          {res.tableType === 'vip'
                            ? <Crown size={12} />
                            : (res.name || 'З')[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                            {res.name}
                            {res.tableType === 'vip' && (
                              <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 99, background: 'rgba(245,158,11,0.15)', color: '#f59e0b', letterSpacing: '0.08em' }}>VIP</span>
                            )}
                          </div>
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
                        onClick={e => { e.stopPropagation(); toggleActionMenu(id, e.currentTarget); }}
                        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: 'var(--text-muted)' }}
                      >
                        <MoreHorizontal size={14} />
                      </button>
                      {actionFor?.id === id && createPortal(
                        <div
                          onClick={e => e.stopPropagation()}
                          style={{
                            position: 'fixed',
                            top: actionFor.pos.top,
                            left: actionFor.pos.left,
                            zIndex: 9999,
                            minWidth: 190,
                            maxHeight: 'calc(100vh - 24px)',
                            overflowY: 'auto',
                            transformOrigin: actionFor.pos.origin,
                          }}
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
                        </div>,
                        document.body
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
