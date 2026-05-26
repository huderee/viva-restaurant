// src/components/admin/Sparkline.jsx
// Зүүн буланд мини trend зураас зурах SVG + тоо animate хийх useAnimatedNumber

import { useEffect, useRef, useState } from 'react';

export function Sparkline({
  data = [],
  width = 60,
  height = 20,
  color = '#f59e0b',
  fill = true,
  strokeWidth = 1.5,
}) {
  if (!data.length) return null;

  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const stepX = data.length > 1 ? width / (data.length - 1) : 0;

  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * height;
    return [x, y];
  });

  // Generate Bezier path curve
  let pathD = '';
  if (points.length > 0) {
    pathD = `M ${points[0][0].toFixed(1)},${points[0][1].toFixed(1)}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0[0] + (p1[0] - p0[0]) / 2;
      const cpY1 = p0[1];
      const cpX2 = p0[0] + (p1[0] - p0[0]) / 2;
      const cpY2 = p1[1];
      pathD += ` C ${cpX1.toFixed(1)},${cpY1.toFixed(1)} ${cpX2.toFixed(1)},${cpY2.toFixed(1)} ${p1[0].toFixed(1)},${p1[1].toFixed(1)}`;
    }
  }

  const fillD = fill && points.length > 0 
    ? `${pathD} L ${width.toFixed(1)},${height.toFixed(1)} L 0,${height.toFixed(1)} Z` 
    : null;

  const gradId = `spark-grad-${color.replace('#', '')}`;
  const filterId = `spark-glow-${color.replace('#', '')}`;

  return (
    <svg width={width} height={height} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {fill && fillD && <path d={fillD} fill={`url(#${gradId})`} />}
      <path d={pathD} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" filter={`url(#${filterId})`} />
      {/* Сүүлийн цэгийг тодруулах */}
      {points.length > 0 && (
        <circle
          cx={points[points.length - 1][0]}
          cy={points[points.length - 1][1]}
          r={2.5}
          fill={color}
          stroke="var(--bg-surface)"
          strokeWidth={1}
        />
      )}
    </svg>
  );
}

// Тоо 0 → target хүртэл animation-аар өсгөх hook
export function useAnimatedNumber(target, duration = 600) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const fromRef = useRef(0);

  useEffect(() => {
    fromRef.current = value;
    startRef.current = null;
    const numTarget = Number(target) || 0;

    const tick = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const t = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const current = fromRef.current + (numTarget - fromRef.current) * eased;
      setValue(current);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return value;
}

// Textэн харагдах format-тай animated тоо
export function AnimatedNumber({ value, decimals = 0, format, duration = 600 }) {
  const v = useAnimatedNumber(value, duration);
  if (format) return <>{format(v)}</>;
  return <>{v.toFixed(decimals)}</>;
}

// Өсөлт/бууралтын arrow badge
export function TrendBadge({ value, suffix = '%', positiveIsGood = true }) {
  const num = Number(value) || 0;
  const isUp = num > 0;
  const isDown = num < 0;
  const good = positiveIsGood ? isUp : isDown;
  const color = num === 0 ? 'var(--text-muted)' : good ? '#10b981' : '#ef4444';
  const bg = num === 0 ? 'rgba(136,153,184,0.1)' : good ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)';
  const arrow = isUp ? '↑' : isDown ? '↓' : '→';
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 3,
      padding: '2px 6px',
      borderRadius: 6,
      background: bg,
      color,
      fontSize: 10.5,
      fontWeight: 700,
      fontFamily: 'var(--font-mono)',
    }}>
      <span>{arrow}</span>
      <span>{Math.abs(num)}{suffix}</span>
    </span>
  );
}

export default Sparkline;
