// src/components/admin/EmptyState.jsx
// Давхар дизайнтай empty state — icon background glow + CTA.

export function EmptyState({
  icon: Icon,
  title = 'Одоогоор мэдээлэл алга',
  description,
  action,       // { label, onClick, icon }
  color = 'accent', // accent | blue | green | purple | red
  compact = false,
}) {
  const colorMap = {
    accent:  { bg: 'rgba(245,158,11,0.10)', ring: 'rgba(245,158,11,0.25)', icon: '#f59e0b' },
    blue:    { bg: 'rgba(59,130,246,0.10)', ring: 'rgba(59,130,246,0.25)', icon: '#3b82f6' },
    green:   { bg: 'rgba(16,185,129,0.10)', ring: 'rgba(16,185,129,0.25)', icon: '#10b981' },
    purple:  { bg: 'rgba(139,92,246,0.10)', ring: 'rgba(139,92,246,0.25)', icon: '#8b5cf6' },
    red:     { bg: 'rgba(239,68,68,0.10)',  ring: 'rgba(239,68,68,0.25)',  icon: '#ef4444' },
    neutral: { bg: 'rgba(136,153,184,0.08)',ring: 'rgba(136,153,184,0.2)', icon: 'var(--text-muted)' },
  };
  const c = colorMap[color] || colorMap.accent;

  return (
    <div
      className="anim-fade-up"
      style={{
        padding: compact ? '32px 20px' : '64px 24px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: compact ? 10 : 14,
      }}
    >
      {Icon && (
        <div style={{ position: 'relative', marginBottom: 4 }}>
          {/* pulse ring */}
          <div style={{
            position: 'absolute',
            inset: -8,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${c.ring}, transparent 70%)`,
            animation: 'pulse-glow 2.4s ease-in-out infinite',
          }} />
          <div style={{
            position: 'relative',
            width: compact ? 56 : 72,
            height: compact ? 56 : 72,
            borderRadius: '50%',
            background: c.bg,
            border: `1px solid ${c.ring}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Icon size={compact ? 24 : 30} color={c.icon} strokeWidth={1.6} />
          </div>
        </div>
      )}

      <div style={{
        fontSize: compact ? 14 : 16,
        fontWeight: 700,
        color: 'var(--text-primary)',
        letterSpacing: '-0.01em',
      }}>
        {title}
      </div>

      {description && (
        <div style={{
          fontSize: 12.5,
          color: 'var(--text-muted)',
          maxWidth: 360,
          lineHeight: 1.55,
        }}>
          {description}
        </div>
      )}

      {action && (
        <button
          onClick={action.onClick}
          className="btn btn-primary"
          style={{ marginTop: 6 }}
        >
          {action.icon && <action.icon size={14} />}
          {action.label}
        </button>
      )}

      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}

export default EmptyState;
