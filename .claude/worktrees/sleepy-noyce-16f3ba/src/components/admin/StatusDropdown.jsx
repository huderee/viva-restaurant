// src/components/admin/StatusDropdown.jsx
import { useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";

function StatusDropdown({ value, onChange, statusMap }) {
  const [open, setOpen] = useState(false);
  const [pos,  setPos]  = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const s = statusMap[value] || statusMap[Object.keys(statusMap)[0]];

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (btnRef.current && !btnRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [open]);

  const handleOpen = (e) => {
    e.stopPropagation();
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + window.scrollY + 6, left: r.left + window.scrollX });
    }
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

      {open && (
        <div onClick={e => e.stopPropagation()}
          style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999, minWidth: 180 }}
          className="dropdown-menu"
        >
          {Object.entries(statusMap).map(([key, cfg]) => {
            const Icon = cfg.icon;
            return (
              <button key={key} className="dropdown-item" onClick={() => { onChange(key); setOpen(false); }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
                <span style={{ flex: 1, color: key === value ? 'var(--text-primary)' : undefined }}>{cfg.label}</span>
                {key === value && <Check size={12} color="var(--accent)" />}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}

export default StatusDropdown;