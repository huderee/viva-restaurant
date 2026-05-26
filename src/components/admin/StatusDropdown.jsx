// src/components/admin/StatusDropdown.jsx
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";

function StatusDropdown({ value, onChange, statusMap }) {
  const [open, setOpen] = useState(false);
  const [pos,  setPos]  = useState({ top: 0, left: 0, origin: 'top right' });
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const s = statusMap[value] || statusMap[Object.keys(statusMap)[0]];

  const updatePosition = () => {
    if (!btnRef.current) return;

    const btn = btnRef.current.getBoundingClientRect();
    const menuWidth = menuRef.current?.offsetWidth || 180;
    const menuHeight = menuRef.current?.offsetHeight || 132;
    const gap = 6;
    const margin = 12;
    const spaceBelow = window.innerHeight - btn.bottom;
    const openUp = spaceBelow < menuHeight + gap && btn.top > menuHeight + gap;
    const top = openUp ? btn.top - menuHeight - gap : btn.bottom + gap;
    const maxTop = Math.max(margin, window.innerHeight - menuHeight - margin);
    const left = Math.min(
      Math.max(btn.right - menuWidth, margin),
      window.innerWidth - menuWidth - margin
    );

    setPos({
      top: Math.min(Math.max(top, margin), maxTop),
      left,
      origin: openUp ? 'bottom right' : 'top right',
    });
  };

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (
        btnRef.current &&
        !btnRef.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    updatePosition();

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open]);

  const handleOpen = (e) => {
    e.stopPropagation();
    setOpen(o => !o);
  };

  return (
    <>
      <button ref={btnRef} onClick={handleOpen}
        className="status-badge"
        style={{
          background: s.color,
          color: s.text,
          borderColor: s.border,
          cursor: 'pointer',
          transition: 'opacity 0.15s',
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
        {s.label}
        <ChevronDown size={10} style={{ marginLeft: 2, opacity: 0.7, transform: open ? 'rotate(180deg)' : '', transition: 'transform 0.18s' }} />
      </button>

      {open && createPortal(
        <div ref={menuRef} onClick={e => e.stopPropagation()}
          style={{
            position: 'fixed',
            top: pos.top,
            left: pos.left,
            zIndex: 9999,
            minWidth: 180,
            maxHeight: 'calc(100vh - 24px)',
            overflowY: 'auto',
            transformOrigin: pos.origin,
          }}
          className="dropdown-menu"
        >
          {Object.entries(statusMap).map(([key, cfg]) => {
            return (
              <button key={key} className="dropdown-item" onClick={() => { onChange(key); setOpen(false); }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
                <span style={{ flex: 1, color: key === value ? 'var(--text-primary)' : undefined }}>{cfg.label}</span>
                {key === value && <Check size={12} color="var(--accent)" />}
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </>
  );
}

export default StatusDropdown;
