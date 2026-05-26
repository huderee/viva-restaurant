// src/components/admin/Skeleton.jsx
// Загварлаг loading skeleton-ууд. "Уншиж байна..." текстийг сольж ашиглана.

export const SkeletonLine = ({ width = '100%', height = 14, style }) => (
  <div className="skeleton-line" style={{ width, height, ...style }} />
);

export const SkeletonBlock = ({ width = '100%', height = 80, radius = 12, style }) => (
  <div className="skeleton-block" style={{ width, height, borderRadius: radius, ...style }} />
);

// Stat card-ын skeleton (Dashboard Overview-д)
export const SkeletonStatCard = () => (
  <div className="skeleton-card">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <SkeletonLine width={60} height={10} />
      <SkeletonBlock width={32} height={32} radius={8} />
    </div>
    <SkeletonLine width="60%" height={24} />
    <SkeletonLine width="40%" height={11} />
  </div>
);

// Stat card-уудын grid (dashboard дээр)
export const SkeletonStatGrid = ({ count = 4 }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 16,
  }}>
    {Array.from({ length: count }).map((_, i) => <SkeletonStatCard key={i} />)}
  </div>
);

// Хүснэгтийн мөрийн skeleton
export const SkeletonTableRow = ({ cols = 5 }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} style={{ padding: '14px 16px' }}>
        <SkeletonLine width={i === 0 ? '80%' : `${60 + Math.random() * 30}%`} height={12} />
      </td>
    ))}
  </tr>
);

export const SkeletonTable = ({ rows = 6, cols = 5 }) => (
  <div className="glass-card" style={{ padding: 0 }}>
    <table className="data-table">
      <tbody>
        {Array.from({ length: rows }).map((_, i) => <SkeletonTableRow key={i} cols={cols} />)}
      </tbody>
    </table>
  </div>
);

// Card list skeleton (reservation-ууд гэх мэт)
export const SkeletonCardList = ({ count = 4 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="skeleton-card" style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <SkeletonBlock width={44} height={44} radius={10} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <SkeletonLine width="45%" height={13} />
          <SkeletonLine width="70%" height={10} />
        </div>
        <SkeletonBlock width={80} height={28} radius={99} />
      </div>
    ))}
  </div>
);

export default SkeletonLine;
