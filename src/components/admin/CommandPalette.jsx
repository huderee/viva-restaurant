// src/components/admin/CommandPalette.jsx
// Ctrl+K / Cmd+K → popup command palette. Tab шилжих, theme, logout, захиалга хайх.

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Search, LayoutDashboard, ShoppingBag, CalendarDays, UtensilsCrossed,
  Briefcase, BarChart3, TrendingUp, LogOut, Sun, Moon, PanelLeft, Inbox,
  RefreshCw, CornerDownLeft, ChevronUp, ChevronDown,
} from 'lucide-react';

const KBD = ({ children }) => (
  <kbd style={{
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 18,
    height: 18,
    padding: '0 5px',
    borderRadius: 4,
    background: 'var(--bg-hover)',
    border: '1px solid var(--border-light)',
    fontSize: 10,
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    color: 'var(--text-muted)',
  }}>{children}</kbd>
);

// Fuzzy match: бүх үсэг query-д дарааллаар байгаа эсэх
const fuzzyMatch = (query, text) => {
  if (!query) return true;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (t.includes(q)) return true;
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++;
  }
  return qi === q.length;
};

export function CommandPalette({
  open, onClose,
  onNavigate,          // (tabId) => void
  onToggleTheme,
  onToggleSidebar,
  onExit,
  onRefresh,
  orders = [],
  reservations = [],
}) {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [open]);

  // Бүх боломжит command-ууд
  const allCommands = useMemo(() => {
    const nav = [
      { id: 'nav-dashboard',    group: 'Хуудас', icon: LayoutDashboard, label: 'Хяналтын самбар',  shortcut: 'G D', onRun: () => onNavigate('dashboard') },
      { id: 'nav-orders',       group: 'Хуудас', icon: ShoppingBag,     label: 'Хоолны захиалга',   shortcut: 'G O', onRun: () => onNavigate('orders') },
      { id: 'nav-reservations', group: 'Хуудас', icon: CalendarDays,    label: 'Ширээ захиалга',    shortcut: 'G R', onRun: () => onNavigate('reservations') },
      { id: 'nav-menu',         group: 'Хуудас', icon: UtensilsCrossed, label: 'Цэсний удирдлага',  shortcut: 'G M', onRun: () => onNavigate('menu') },
      { id: 'nav-jobs',         group: 'Хуудас', icon: Briefcase,       label: 'Ажлын байр',        shortcut: 'G J', onRun: () => onNavigate('jobs') },
      { id: 'nav-applications', group: 'Хуудас', icon: Inbox,           label: 'Анкет',             shortcut: 'G P', onRun: () => onNavigate('applications') },
      { id: 'nav-analytics',    group: 'Хуудас', icon: BarChart3,       label: 'Орлогын тайлан',    shortcut: 'G A', onRun: () => onNavigate('analytics') },
      { id: 'nav-resStats',     group: 'Хуудас', icon: TrendingUp,      label: 'Ширээний тайлан',   shortcut: 'G S', onRun: () => onNavigate('resStats') },
    ];
    const actions = [
      { id: 'act-theme',    group: 'Үйлдэл', icon: Sun,     label: 'Theme сэлгэх (Dark / Light)', onRun: onToggleTheme },
      { id: 'act-sidebar',  group: 'Үйлдэл', icon: PanelLeft, label: 'Sidebar хумих / дэлгэх',   onRun: onToggleSidebar },
      { id: 'act-refresh',  group: 'Үйлдэл', icon: RefreshCw, label: 'Өгөгдөл шинэчлэх',         onRun: onRefresh },
      { id: 'act-logout',   group: 'Үйлдэл', icon: LogOut,  label: 'Системээс гарах',             onRun: onExit },
    ];
    // Сүүлийн 10 захиалга
    const orderItems = orders.slice(0, 20).map(o => ({
      id: `ord-${o._id}`,
      group: 'Захиалга',
      icon: ShoppingBag,
      label: `#${o._id?.slice(-6).toUpperCase()} — ${o.customerName || 'Зочин'}`,
      hint: o.phone,
      onRun: () => onNavigate('orders'),
    }));
    const resItems = reservations.slice(0, 20).map(r => ({
      id: `res-${r._id}`,
      group: 'Ширээ',
      icon: CalendarDays,
      label: `${r.name || 'Нэргүй'} — ${r.date} ${r.time}`,
      hint: r.phone,
      onRun: () => onNavigate('reservations'),
    }));
    return [...nav, ...actions, ...orderItems, ...resItems];
  }, [orders, reservations, onNavigate, onToggleTheme, onToggleSidebar, onRefresh, onExit]);

  // Filter
  const filtered = useMemo(() => {
    if (!query.trim()) return allCommands;
    return allCommands.filter(c => fuzzyMatch(query, `${c.label} ${c.hint || ''} ${c.group}`));
  }, [allCommands, query]);

  // Group-ээр ангилах
  const grouped = useMemo(() => {
    const groups = [];
    const map = new Map();
    filtered.forEach(item => {
      if (!map.has(item.group)) {
        const g = { label: item.group, items: [] };
        map.set(item.group, g);
        groups.push(g);
      }
      map.get(item.group).items.push(item);
    });
    return groups;
  }, [filtered]);

  // Active index clamp
  useEffect(() => {
    if (activeIdx >= filtered.length) setActiveIdx(Math.max(0, filtered.length - 1));
  }, [filtered, activeIdx]);

  // Keyboard
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
      else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIdx(i => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIdx(i => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const item = filtered[activeIdx];
        if (item) {
          item.onRun?.();
          onClose();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, filtered, activeIdx, onClose]);

  // Scroll active into view
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector(`[data-idx="${activeIdx}"]`);
    if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  if (!open) return null;

  // Flat index map
  let flatIdx = -1;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      style={{ alignItems: 'flex-start', justifyContent: 'center', display: 'flex', paddingTop: '12vh' }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 560,
          maxHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          margin: '0 16px',
        }}
      >
        {/* Search input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '14px 18px',
          borderBottom: '1px solid var(--border)',
        }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIdx(0); }}
            placeholder="Хайх, цэс шилжих, үйлдэл хийх..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: 14,
              fontFamily: 'var(--font-main)',
            }}
          />
          <KBD>ESC</KBD>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '6px 6px 10px',
          }}
        >
          {filtered.length === 0 && (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-faint)', fontSize: 13 }}>
              "{query}" — Үр дүн алга
            </div>
          )}
          {grouped.map(group => (
            <div key={group.label} style={{ marginTop: 6 }}>
              <div style={{
                padding: '6px 14px 4px',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--text-faint)',
              }}>{group.label}</div>
              {group.items.map(item => {
                flatIdx++;
                const idx = flatIdx;
                const active = idx === activeIdx;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    data-idx={idx}
                    onMouseEnter={() => setActiveIdx(idx)}
                    onClick={() => { item.onRun?.(); onClose(); }}
                    style={{
                      width: 'calc(100% - 8px)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 11,
                      padding: '9px 14px',
                      margin: '1px 4px',
                      borderRadius: 8,
                      border: 'none',
                      background: active ? 'var(--accent-soft)' : 'transparent',
                      color: active ? 'var(--accent)' : 'var(--text-primary)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'var(--font-main)',
                      fontSize: 13,
                      transition: 'background 0.1s',
                    }}
                  >
                    <Icon size={15} style={{ flexShrink: 0, opacity: active ? 1 : 0.7 }} />
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.label}
                      </span>
                      {item.hint && (
                        <span style={{ fontSize: 11, color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
                          {item.hint}
                        </span>
                      )}
                    </div>
                    {item.shortcut && (
                      <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
                        {item.shortcut.split(' ').map((k, i) => <KBD key={i}>{k}</KBD>)}
                      </div>
                    )}
                    {active && <CornerDownLeft size={12} style={{ flexShrink: 0, opacity: 0.7 }} />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 14px',
          borderTop: '1px solid var(--border)',
          fontSize: 10.5,
          color: 'var(--text-faint)',
          background: 'var(--bg-surface)',
        }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <KBD><ChevronUp size={9} /></KBD><KBD><ChevronDown size={9} /></KBD> шилжих
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <KBD>↵</KBD> сонгох
            </span>
          </div>
          <span>{filtered.length} / {allCommands.length}</span>
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;
