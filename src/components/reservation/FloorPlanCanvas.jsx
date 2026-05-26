import React from 'react';
import { Armchair, Clock3, Users } from 'lucide-react';

const stateStyle = {
  idle: {
    light: { fill: '#ffffff', stroke: '#e7e5e4', text: '#78716c', chair: '#f5f5f4', chip: '#f5f5f4' },
    dark: { fill: '#262626', stroke: '#3f3f46', text: '#a8a29e', chair: '#171717', chip: '#171717' },
  },
  available: {
    light: { fill: '#ffffff', stroke: '#d6d3d1', text: '#292524', chair: '#f5f5f4', chip: '#f5f5f4' },
    dark: { fill: '#262626', stroke: '#525252', text: '#f5f5f4', chair: '#171717', chip: '#171717' },
  },
  selected: {
    light: { fill: '#f97316', stroke: '#fb923c', text: '#fff7ed', chair: '#fb923c', chip: '#ea580c' },
    dark: { fill: '#f97316', stroke: '#fdba74', text: '#fff7ed', chair: '#fb923c', chip: '#ea580c' },
  },
  recommended: {
    light: { fill: '#fed7aa', stroke: '#fb923c', text: '#7c2d12', chair: '#fdba74', chip: '#ffedd5' },
    dark: { fill: '#7c2d12', stroke: '#fb923c', text: '#ffedd5', chair: '#9a3412', chip: '#431407' },
  },
  booked: {
    light: { fill: '#ef4444', stroke: '#f87171', text: '#fff1f2', chair: '#ef4444', chip: '#dc2626' },
    dark: { fill: '#dc2626', stroke: '#fca5a5', text: '#fff1f2', chair: '#991b1b', chip: '#991b1b' },
  },
  small: {
    light: { fill: '#f5f5f4', stroke: '#d6d3d1', text: '#a8a29e', chair: '#f5f5f4', chip: '#f5f5f4' },
    dark: { fill: '#171717', stroke: '#404040', text: '#737373', chair: '#171717', chip: '#111111' },
  },
  past: {
    light: { fill: '#e7e5e4', stroke: '#d6d3d1', text: '#a8a29e', chair: '#e7e5e4', chip: '#e7e5e4' },
    dark: { fill: '#171717', stroke: '#404040', text: '#525252', chair: '#171717', chip: '#111111' },
  },
};

const LABELS = {
  en: {
    idle: 'Select date',
    available: 'Free',
    selected: 'Selected',
    recommended: 'Best fit',
    booked: 'Booked',
    small: 'Too small',
    past: 'Past',
    seats: 'seats',
    entrance: 'ENTRANCE',
    scaled: 'Scaled to fit',
    busy: 'busy',
    best: 'best',
    ready: 'ready',
  },
  mn: {
    idle: 'Огноо сонго',
    available: 'Сул',
    selected: 'Сонгосон',
    recommended: 'Санал',
    booked: 'Захиалгатай',
    small: 'Багадна',
    past: 'Өнгөрсөн',
    seats: 'суудал',
    entrance: 'ОРЦ',
    scaled: 'Дэлгэцэд тааруулсан',
    busy: 'завгүй',
    best: 'зөв',
    ready: 'бэлэн',
  },
};

const getVisualState = (tableId, tableStates, selectedTableId, recommendedTableId) => {
  if (selectedTableId === tableId) return 'selected';
  const state = tableStates?.[tableId] || 'idle';
  if (recommendedTableId === tableId && state === 'available') return 'recommended';
  return state;
};

const getStyle = (visualState, isDark) =>
  stateStyle[visualState]?.[isDark ? 'dark' : 'light'] || stateStyle.idle.light;

const getTableSize = (table) => {
  if (table.shape === 'round') return { width: 76, height: 76, radius: 38 };
  if (table.shape === 'long') return { width: 82, height: 144, radius: 20 };
  const seats = table.seats || table.capacity || 0;
  return { width: Math.min(96, 66 + seats * 4), height: 70, radius: 18 };
};

const getLabel = (lang, key) => (LABELS[lang === 'en' ? 'en' : 'mn'] || LABELS.mn)[key] || key;

function ChairMarks({ x, y, width, height, shape, fill }) {
  if (shape === 'long') {
    return (
      <>
        <rect x={x - width / 2 - 10} y={y - 34} width="6" height="68" rx="4" fill={fill} opacity="0.7" />
        <rect x={x + width / 2 + 4} y={y - 34} width="6" height="68" rx="4" fill={fill} opacity="0.7" />
      </>
    );
  }

  const isRound = shape === 'round';
  if (isRound) {
    return (
      <>
        <rect x={x - 13} y={y - 49} width="26" height="6" rx="4" fill={fill} opacity="0.72" />
        <rect x={x - 13} y={y + 43} width="26" height="6" rx="4" fill={fill} opacity="0.72" />
        <rect x={x - 49} y={y - 13} width="6" height="26" rx="4" fill={fill} opacity="0.72" />
        <rect x={x + 43} y={y - 13} width="6" height="26" rx="4" fill={fill} opacity="0.72" />
      </>
    );
  }
  return (
    <>
      <rect x={x - 14} y={y - height / 2 - 10} width="28" height="6" rx="4" fill={fill} opacity="0.72" />
      <rect x={x - 14} y={y + height / 2 + 4} width="28" height="6" rx="4" fill={fill} opacity="0.72" />
      <rect x={x - width / 2 - 10} y={y - 14} width="6" height="28" rx="4" fill={fill} opacity="0.72" />
      <rect x={x + width / 2 + 4} y={y - 14} width="6" height="28" rx="4" fill={fill} opacity="0.72" />
    </>
  );
}

export default function FloorPlanCanvas({
  tables = [],
  tableStates = {},
  selectedTableId = '',
  recommendedTableId = '',
  onSelectTable,
  floorLabel = '',
  isDark = false,
  lang = 'mn',
  t = (key) => key,
  listView = false,
  availableCount = 0,
}) {
  if (listView) {
    return (
      <div className="h-full p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>{floorLabel}</p>
            <p className={`text-xs ${isDark ? 'text-stone-500' : 'text-stone-500'}`}>
              {availableCount} {t('res.tables.free')}
            </p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tables.map((table) => {
            const visualState = getVisualState(table.id, tableStates, selectedTableId, recommendedTableId);
            const disabled = !['available', 'recommended', 'selected'].includes(visualState);
            return (
              <button
                key={table.id}
                type="button"
                disabled={disabled}
                onClick={() => onSelectTable?.(table.id)}
                className={`flex items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                  visualState === 'selected'
                    ? 'border-orange-300 bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                    : disabled
                      ? isDark ? 'border-neutral-800 bg-neutral-950/70 text-neutral-500' : 'border-stone-200 bg-stone-50 text-stone-400'
                      : isDark ? 'border-neutral-700 bg-neutral-900 text-stone-100 hover:border-orange-500/60' : 'border-stone-200 bg-white text-stone-900 hover:border-orange-400'
                }`}
              >
                <span>
                  <span className="block text-sm font-black">{table.id}</span>
                  <span className="mt-1 flex items-center gap-1 text-xs opacity-75">
                    <Users className="h-3.5 w-3.5" />
                    {table.seats || table.capacity} {getLabel(lang, 'seats')}
                  </span>
                </span>
                <span className="text-xs font-semibold opacity-75">{getLabel(lang, visualState)}</span>
                <Armchair className="h-5 w-5 opacity-70" />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-full min-h-[520px] overflow-hidden ${isDark ? 'bg-neutral-950' : 'bg-stone-100'}`}>
      <div className={`absolute left-4 top-4 z-10 rounded-2xl px-4 py-3 ${isDark ? 'bg-neutral-900/90 text-stone-100' : 'bg-white/90 text-stone-900'} shadow-lg backdrop-blur`}>
        <p className="text-sm font-black">{floorLabel}</p>
        <p className={`text-xs ${isDark ? 'text-stone-500' : 'text-stone-500'}`}>{availableCount} {t('res.tables.free')}</p>
      </div>

      <svg className="h-full w-full" viewBox="0 0 690 390" role="img" aria-label={floorLabel}>
        <defs>
          <filter id="tableShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#000000" floodOpacity={isDark ? '0.35' : '0.10'} />
          </filter>
        </defs>

        <rect x="28" y="34" width="634" height="318" rx="30" fill={isDark ? '#171717' : '#f5f5f4'} stroke={isDark ? '#404040' : '#e7e5e4'} strokeWidth="2" />
        <path d="M58 334 H632" stroke={isDark ? '#404040' : '#d6d3d1'} strokeWidth="2" strokeDasharray="7 9" />
        <text x="345" y="326" textAnchor="middle" fontSize="11" fontWeight="800" fill={isDark ? '#737373' : '#a8a29e'}>{getLabel(lang, 'entrance')}</text>

        {tables.map((table) => {
          const visualState = getVisualState(table.id, tableStates, selectedTableId, recommendedTableId);
          const style = getStyle(visualState, isDark);
          const disabled = !['available', 'recommended', 'selected'].includes(visualState);
          const seats = table.seats || table.capacity || 0;
          const shape = table.shape;
          const isRound = shape === 'round';
          const { width, height, radius } = getTableSize(table);
          const x = table.x;
          const y = table.y;
          const canShowChip = ['booked', 'selected', 'recommended'].includes(visualState);

          return (
            <g
              key={table.id}
              onClick={() => !disabled && onSelectTable?.(table.id)}
              className={disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
              style={{ opacity: disabled ? 0.74 : 1 }}
            >
              <ChairMarks x={x} y={y} width={width} height={height} shape={shape} fill={style.chair} />
              {isRound ? (
                <circle cx={x} cy={y} r={radius} fill={style.fill} stroke={style.stroke} strokeWidth={visualState === 'recommended' ? 4 : visualState === 'selected' ? 5 : 2} filter="url(#tableShadow)" />
              ) : (
                <rect x={x - width / 2} y={y - height / 2} width={width} height={height} rx="18" fill={style.fill} stroke={style.stroke} strokeWidth={visualState === 'recommended' ? 4 : visualState === 'selected' ? 5 : 2} filter="url(#tableShadow)" />
              )}
              <text x={x} y={canShowChip ? y - 10 : y - 3} textAnchor="middle" fontSize="15" fontWeight="900" fill={style.text}>{table.id}</text>
              <text x={x} y={canShowChip ? y + 10 : y + 18} textAnchor="middle" fontSize="10" fontWeight="800" fill={style.text}>{seats} {getLabel(lang, 'seats')}</text>
              {canShowChip && (
                <>
                  <rect x={x - 31} y={y + 21} width="62" height="18" rx="9" fill={style.chip} opacity="0.92" />
                  <Clock3 x={x - 24} y={y + 25} width="10" height="10" color={style.text} />
                  <text x={x + 7} y={y + 34} textAnchor="middle" fontSize="9" fontWeight="800" fill={style.text}>
                    {visualState === 'booked' ? getLabel(lang, 'busy') : visualState === 'recommended' ? getLabel(lang, 'best') : getLabel(lang, 'ready')}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>

      <div className={`absolute bottom-4 left-4 rounded-xl px-3 py-2 text-[11px] font-semibold ${isDark ? 'bg-neutral-900/90 text-stone-400' : 'bg-white/90 text-stone-500'} shadow backdrop-blur`}>
        {getLabel(lang, 'scaled')}
      </div>
    </div>
  );
}
