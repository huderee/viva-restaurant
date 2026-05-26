// src/components/admin/NotificationBell.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import { Bell, X, CheckCheck, Package } from "lucide-react";
import StatusBadge, { ORDER_STATUS } from './StatusBadge';

const BASE_URL = 'http://localhost:5000/api';
const SEEN_KEY = 'huuk_seen_orders';

function NotificationBell({ toastShow }) {
  const [orders,  setOrders]  = useState([]);
  const [open,    setOpen]    = useState(false);
  const [seenIds, setSeenIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || '[]')); }
    catch { return new Set(); }
  });
  const prevIdsRef = useRef(new Set());
  const panelRef   = useRef(null);

  const playSound = useCallback(() => {
    try {
      const ctx  = new (window.AudioContext || window.webkitAudioContext)();
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(1046, ctx.currentTime);
      osc.frequency.setValueAtTime(784,  ctx.currentTime + 0.08);
      osc.frequency.setValueAtTime(1046, ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.5);
    } catch {}
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const res  = await fetch(`${BASE_URL}/orders`);
      const json = await res.json();
      const data = Array.isArray(json) ? json : (json.data ?? []);
      const newOnes = data.filter(o => !prevIdsRef.current.has(o._id) && !seenIds.has(o._id));
      if (newOnes.length > 0 && prevIdsRef.current.size > 0) {
        playSound();
        toastShow?.(`${newOnes.length} шинэ захиалга ирлээ!`, 'info');
      }
      prevIdsRef.current = new Set(data.map(o => o._id));
      setOrders(data.slice(0, 20));
    } catch {}
  }, [seenIds, playSound, toastShow]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 60000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => { if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const unread = orders.filter(o => !seenIds.has(o._id)).length;

  const markAll = () => {
    const ns = new Set([...seenIds, ...orders.map(o => o._id)]);
    setSeenIds(ns);
    localStorage.setItem(SEEN_KEY, JSON.stringify([...ns]));
  };
  const markOne = (id) => {
    const ns = new Set([...seenIds, id]);
    setSeenIds(ns);
    localStorage.setItem(SEEN_KEY, JSON.stringify([...ns]));
  };

  return (
    <div style={{ position: 'relative' }} ref={panelRef}>
      <button onClick={() => setOpen(o => !o)}
        style={{
          position: 'relative',
          background: open ? 'var(--accent-soft)' : 'var(--bg-elevated)',
          border: `1px solid ${open ? 'rgba(245,158,11,0.3)' : 'var(--border-light)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '8px 10px',
          cursor: 'pointer',
          transition: 'all 0.18s',
          display: 'flex', alignItems: 'center',
        }}
      >
        <Bell size={16} color={unread > 0 ? '#f59e0b' : 'var(--text-muted)'} />
        {unread > 0 && (
          <span className="notif-dot" style={{
            position: 'absolute', top: -4, right: -4,
            minWidth: 18, height: 18,
            background: '#ef4444',
            color: '#fff',
            fontSize: 10,
            fontWeight: 800,
            borderRadius: '99px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 4px',
            border: '2px solid var(--bg-base)',
            fontFamily: 'var(--font-mono)',
          }}>
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 'calc(100% + 8px)',
          width: 340, zIndex: 200,
        }} className="dropdown-menu anim-scale-in">
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px',
            borderBottom: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Bell size={14} color="#f59e0b" />
              <span style={{ fontWeight: 700, fontSize: 13 }}>Мэдэгдлүүд</span>
              {unread > 0 && (
                <span style={{
                  background: 'var(--accent-soft)', color: 'var(--accent)',
                  fontSize: 10, padding: '2px 7px', borderRadius: 99, fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                }}>{unread}</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {unread > 0 && (
                <button onClick={markAll} className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 11 }}>
                  <CheckCheck size={11} /> Бүгд уншсан
                </button>
              )}
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--text-faint)' }}>
                <X size={14} />
              </button>
            </div>
          </div>

          <div style={{ maxHeight: 380, overflowY: 'auto' }}>
            {orders.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-faint)' }}>
                <Package size={32} style={{ margin: '0 auto 8px', opacity: 0.3 }} />
                <div style={{ fontSize: 13 }}>Захиалга байхгүй</div>
              </div>
            ) : orders.map((o, i) => {
              const isNew = !seenIds.has(o._id);
              const st = ORDER_STATUS[o.status] || ORDER_STATUS.pending;
              const Icon = st.icon;
              return (
                <div key={o._id} onClick={() => markOne(o._id)}
                  style={{
                    display: 'flex', gap: 12, padding: '12px 16px',
                    borderBottom: '1px solid var(--border)',
                    background: isNew ? 'rgba(245,158,11,0.04)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                    animationDelay: `${i * 30}ms`,
                  }}
                  className="anim-slide-in"
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: isNew ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1px solid ${isNew ? 'rgba(245,158,11,0.25)' : 'var(--border)'}`,
                  }}>
                    <Icon size={15} color={isNew ? '#f59e0b' : 'var(--text-faint)'} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                      <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: isNew ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                        #{o._id?.slice(-6).toUpperCase()}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
                        {new Date(o.createdAt).toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {o.customerName || 'Зочин'} · {o.items?.length || 0} зүйл
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <StatusBadge status={o.status} statusMap={ORDER_STATUS} size="sm" />
                      <span className="mono" style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b' }}>
                        {(o.totalAmount || 0).toLocaleString()}₮
                      </span>
                    </div>
                  </div>
                  {isNew && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', flexShrink: 0, marginTop: 6 }} />}
                </div>
              );
            })}
          </div>
          <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>10с тутам автоматаар шинэчлэгдэнэ</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;