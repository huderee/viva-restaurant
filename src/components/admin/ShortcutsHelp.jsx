// src/components/admin/ShortcutsHelp.jsx
// "?" дарахад гарч ирэх keyboard shortcut cheatsheet

import { X } from 'lucide-react';

const KBD = ({ children }) => (
  <kbd style={{
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 22,
    height: 22,
    padding: '0 7px',
    borderRadius: 5,
    background: 'var(--bg-hover)',
    border: '1px solid var(--border-light)',
    fontSize: 11,
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    color: 'var(--text-primary)',
  }}>{children}</kbd>
);

const SECTIONS = [
  {
    title: 'Ерөнхий',
    items: [
      { keys: [['Ctrl','K']], label: 'Command palette нээх' },
      { keys: [['?']], label: 'Энэ жагсаалт' },
      { keys: [['/']], label: 'Хайлтын талбарт шилжих' },
      { keys: [['Esc']], label: 'Modal / drawer хаах' },
    ],
  },
  {
    title: 'Шилжилт',
    items: [
      { keys: [['G'], ['D']], label: 'Хяналтын самбар' },
      { keys: [['G'], ['O']], label: 'Хоолны захиалга' },
      { keys: [['G'], ['R']], label: 'Ширээ захиалга' },
      { keys: [['G'], ['M']], label: 'Цэсний удирдлага' },
      { keys: [['G'], ['J']], label: 'Ажлын байр' },
      { keys: [['G'], ['A']], label: 'Орлогын тайлан' },
      { keys: [['G'], ['S']], label: 'Ширээний тайлан' },
    ],
  },
  {
    title: 'Загвар',
    items: [
      { keys: [['T']], label: 'Dark / Light theme сэлгэх' },
      { keys: [['B']], label: 'Sidebar хумих / дэлгэх' },
    ],
  },
];

export function ShortcutsHelp({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 520,
          padding: 0,
          margin: '0 16px',
          maxHeight: '80vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          borderBottom: '1px solid var(--border)',
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Keyboard shortcut</div>
            <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 2 }}>
              Админыг илүү хурдан ашиглах товчлуурууд
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: 6,
              borderRadius: 6,
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '16px 20px', overflowY: 'auto' }}>
          {SECTIONS.map(sec => (
            <div key={sec.title} style={{ marginBottom: 18 }}>
              <div style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--text-faint)',
                marginBottom: 8,
              }}>{sec.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {sec.items.map((it, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '7px 10px',
                    borderRadius: 6,
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                  }}>
                    <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{it.label}</span>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      {it.keys.map((combo, idx) => (
                        <span key={idx} style={{ display: 'flex', gap: 3 }}>
                          {combo.map((k, ki) => <KBD key={ki}>{k}</KBD>)}
                          {idx < it.keys.length - 1 && (
                            <span style={{ fontSize: 10, color: 'var(--text-faint)', margin: '0 3px' }}>дараа</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ShortcutsHelp;
