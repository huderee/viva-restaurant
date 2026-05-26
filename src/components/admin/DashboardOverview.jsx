// src/components/admin/DashboardOverview.jsx
import React, { useState, useMemo } from 'react';
import {
  ShoppingBag, TrendingUp, Users, BarChart3, Sparkles, Activity,
  PieChart, UtensilsCrossed, Coffee, Zap, Calendar, Download, RefreshCw,
  Flame, ChevronDown, ChefHat, CheckCircle2
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useOrders } from "../../contexts/OrdersContext";
import { useMenu } from "../../contexts/MenuContext";
import { useReservations } from "../../contexts/ReservationsContext";
import { currency } from "../../utils/format";
import { sumPaidRevenue, avgPaidOrderValue, isPaidOrder } from "../../utils/adminMetrics";
import StatusBadge, { ORDER_STATUS } from './StatusBadge';
import { Sparkline, AnimatedNumber } from './Sparkline';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function DashboardOverview({ toastShow }) {
  const { orders, loading: ordersLoading, fetchOrders, updateOrderStatus } = useOrders();
  const { reservations } = useReservations();
  const { items } = useMenu();
  const [dateRange, setDateRange] = useState('today');
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const filteredOrders = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    return (orders || []).filter(o => {
      const d = new Date(o.createdAt);
      if (dateRange === 'today') return d >= today;
      if (dateRange === 'week')  return d >= weekAgo;
      if (dateRange === 'month') return d >= monthAgo;
      return true;
    });
  }, [orders, dateRange]);

  const totalRevenue    = sumPaidRevenue(filteredOrders);
  const paidCount       = filteredOrders.filter(isPaidOrder).length;
  const pendingOrders   = filteredOrders.filter(o => o.status === 'pending').length;
  const confirmedOrders = filteredOrders.filter(o => o.status === 'confirmed').length;
  const cookingOrders   = filteredOrders.filter(o => o.status === 'cooking').length;
  const completedOrders = filteredOrders.filter(o => o.status === 'completed').length;
  const cancelledOrders = filteredOrders.filter(o => o.status === 'cancelled').length;
  const activeOrders    = filteredOrders.filter(o => o.status !== 'cancelled');
  const todayRes        = (reservations || []).filter(r => r.date === new Date().toISOString().split('T')[0] && r.status !== 'cancelled').length;
  const completionRate  = activeOrders.length > 0 ? Math.round((completedOrders / activeOrders.length) * 100) : 0;
  const avgOrderValue   = avgPaidOrderValue(filteredOrders);

  const prevPeriodRevenue = useMemo(() => {
    const now = new Date();
    let prevStart, prevEnd;
    if (dateRange === 'today') {
      prevStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      prevEnd   = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (dateRange === 'week') {
      prevStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14);
      prevEnd   = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    } else {
      prevStart = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());
      prevEnd   = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    }
    return sumPaidRevenue((orders || []).filter(o => { const d = new Date(o.createdAt); return d >= prevStart && d < prevEnd; }));
  }, [orders, dateRange]);

  const revenueChange = prevPeriodRevenue > 0
    ? ((totalRevenue - prevPeriodRevenue) / prevPeriodRevenue * 100).toFixed(1)
    : null;

  // Сүүлийн 7 хоногийн sparkline data
  const last7 = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });
    return {
      orderCount: days.map(dstr => (orders || []).filter(o => (o.createdAt || '').startsWith(dstr)).length),
      revenue:    days.map(dstr => sumPaidRevenue((orders || []).filter(o => (o.createdAt || '').startsWith(dstr)))),
      completion: days.map(dstr => {
        const list = (orders || []).filter(o => (o.createdAt || '').startsWith(dstr));
        if (!list.length) return 0;
        return Math.round((list.filter(o => o.status === 'completed').length / list.length) * 100);
      }),
      reservations: days.map(dstr => (reservations || []).filter(r => r.date === dstr && r.status !== 'cancelled').length),
    };
  }, [orders, reservations]);

  const stats = [
    { label: 'Нийт захиалга',     rawValue: filteredOrders.length, value: filteredOrders.length,   sub: `${pendingOrders} хүлээгдэж буй`,       icon: ShoppingBag, accent: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', trend: `${filteredOrders.length}`, spark: last7.orderCount, animate: 'int' },
    { label: 'Бодит орлого',      rawValue: totalRevenue,          value: currency(totalRevenue),  sub: `${paidCount} төлсөн · дундаж ${currency(avgOrderValue)}`, icon: TrendingUp,  accent: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', trend: revenueChange !== null ? `${revenueChange > 0 ? '+' : ''}${revenueChange}%` : '—', spark: last7.revenue, animate: 'currency' },
    { label: 'Гүйцэтгэлийн хувь', rawValue: completionRate,        value: `${completionRate}%`,   sub: `${completedOrders} гүйцэтгэгдсэн`,    icon: BarChart3,   accent: '#3b82f6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)', trend: completionRate > 70 ? 'Сайн' : 'Сайжруулах', spark: last7.completion, animate: 'percent' },
    { label: 'Өнөөдрийн ширээ',  rawValue: todayRes,              value: todayRes,                sub: `${(reservations || []).length} нийт`,  icon: Users,       accent: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.2)', trend: `+${todayRes}`, spark: last7.reservations, animate: 'int' },
  ];

  // ✅ ЗАСВАР: барChartData-г useMemo object болгосон (функц биш)
  const dailySalesData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split('T')[0];
      const dayOrders = (orders || []).filter(o => o.createdAt?.startsWith(dateStr));
      return {
        label: `${date.getMonth() + 1}/${date.getDate()}`,
        revenue: sumPaidRevenue(dayOrders),
        count: dayOrders.length,
      };
    });
  }, [orders]);

  // ✅ ЗАСВАР: функц биш useMemo object — datasets always defined
  const barChartData = useMemo(() => ({
    labels: dailySalesData.map(d => d.label),
    datasets: [{
      label: 'Орлого (₮)',
      data: dailySalesData.map(d => d.revenue),
      backgroundColor: 'rgba(245, 158, 11, 0.75)',
      borderColor: '#f59e0b',
      borderWidth: 2,
      borderRadius: 6,
      borderSkipped: false,
      hoverBackgroundColor: '#fbbf24',
    }],
  }), [dailySalesData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#94a3b8', font: { family: 'Outfit', size: 11, weight: 600 } } },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        titleFont: { family: 'Outfit', size: 12, weight: 700 },
        bodyFont: { family: 'Outfit', size: 12 },
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#94a3b8', font: { family: 'Outfit' } } },
      y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#94a3b8', font: { family: 'Outfit' } } },
    },
  };

  const statusPieData = useMemo(() => ({
    labels: Object.values(ORDER_STATUS).map(s => s.label),
    datasets: [{
      data: [pendingOrders, confirmedOrders, cookingOrders, completedOrders, cancelledOrders],
      backgroundColor: ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444'],
      borderWidth: 3,
      borderColor: 'var(--bg-surface)',
      borderRadius: 4,
      spacing: 2,
    }],
  }), [pendingOrders, confirmedOrders, cookingOrders, completedOrders, cancelledOrders]);

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          font: { family: 'Outfit', size: 11, weight: 500 },
          padding: 10,
          boxWidth: 8,
          boxHeight: 8,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        borderColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        titleFont: { family: 'Outfit', size: 12, weight: 700 },
        bodyFont: { family: 'Outfit', size: 12 },
        padding: 10,
        cornerRadius: 8,
      },
    },
  };

  const topItems = useMemo(() => {
    const itemCount = {};
    (orders || []).filter(isPaidOrder).forEach(o => o.items?.forEach(item => {
      itemCount[item.name] = (itemCount[item.name] || 0) + (item.quantity || 1);
    }));
    return Object.entries(itemCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [orders]);

  const catMap = {};
  (items ?? []).forEach(it => { catMap[it.category] = (catMap[it.category] || 0) + 1; });
  const topCategories = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 4);

  const pendingList = (orders || []).filter(o => o.status === 'pending').slice(0, 5);

  const dateRangeLabels = { today: 'Өнөөдөр', week: 'Сүүлийн 7 хоног', month: 'Сүүлийн 30 хоног' };

  const exportReport = () => {
    const blob = new Blob([JSON.stringify({ dateRange: dateRangeLabels[dateRange], totalRevenue, totalOrders: filteredOrders.length, avgOrderValue, completionRate, topItems }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `report-${dateRange}-${new Date().toISOString().split('T')[0]}.json`; a.click();
    URL.revokeObjectURL(url);
    toastShow?.('Тайлан татагдлаа');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Sparkles size={14} color="#f59e0b" />
            <span style={{ fontSize: 11, color: 'var(--text-faint)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>Хяналтын самбар</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>Өдрийн тойм</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowDateDropdown(p => !p)} className="btn btn-ghost" style={{ gap: 6 }}>
              <Calendar size={13} />
              {dateRangeLabels[dateRange]}
              <ChevronDown size={12} style={{ transform: showDateDropdown ? 'rotate(180deg)' : '', transition: 'transform 0.2s' }} />
            </button>
            {showDateDropdown && (
              <div className="dropdown-menu" style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 100, minWidth: 160 }}>
                {Object.entries(dateRangeLabels).map(([key, label]) => (
                  <button key={key} className="dropdown-item" onClick={() => { setDateRange(key); setShowDateDropdown(false); }}>
                    {label}
                    {dateRange === key && <span style={{ marginLeft: 'auto', color: 'var(--accent)' }}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={exportReport} className="btn btn-ghost"><Download size={13} /> Экспорт</button>
          <button onClick={() => fetchOrders?.(true)} className="btn btn-ghost"><RefreshCw size={13} /> Шинэчлэх</button>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {stats.map((s, i) => (
          <div key={s.label} className="glass-card stat-card-shine"
            style={{ padding: 20, background: s.bg, borderColor: s.border, animationDelay: `${i * 60}ms` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.3, maxWidth: 90 }}>{s.label}</span>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: `${s.accent}22`, border: `1px solid ${s.accent}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <s.icon size={15} color={s.accent} />
              </div>
            </div>
            <div className="mono" style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', color: s.accent, marginBottom: 6 }}>
              {s.animate === 'currency' ? (
                <AnimatedNumber value={s.rawValue} format={(v) => currency(Math.round(v))} />
              ) : s.animate === 'percent' ? (
                <><AnimatedNumber value={s.rawValue} decimals={0} />%</>
              ) : s.animate === 'int' ? (
                <AnimatedNumber value={s.rawValue} decimals={0} />
              ) : s.value}
            </div>
            {s.spark && s.spark.length > 0 && (
              <div style={{ marginBottom: 6, marginLeft: -2 }}>
                <Sparkline data={s.spark} width={120} height={22} color={s.accent} />
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>{s.sub}</span>
              <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 99, fontWeight: 700, background: `${s.accent}18`, color: s.accent, fontFamily: 'var(--font-mono)' }}>{s.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pending quick actions */}
      {pendingList.length > 0 && (
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden', borderColor: 'rgba(245,158,11,0.3)' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 6px #f59e0b', display: 'inline-block' }} className="notif-dot" />
              <span style={{ fontWeight: 700, fontSize: 14 }}>Шинэ захиалгууд</span>
            </div>
            <span className="chip" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>{pendingList.length} хүлээгдэж буй</span>
          </div>
          {pendingList.map((o, i) => (
            <div key={o._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: i < pendingList.length - 1 ? '1px solid var(--border)' : 'none', background: 'rgba(245,158,11,0.02)' }}>
              <div className="avatar" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', fontSize: 11 }}>{(o.customerName || 'З')[0].toUpperCase()}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{o.customerName || 'Зочин'}</div>
                <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 2 }}>{o.items?.map(item => `${item.name} ×${item.quantity}`).join(', ') || '—'}</div>
              </div>
              <span className="mono" style={{ fontSize: 13, fontWeight: 800, color: '#f59e0b', marginRight: 12 }}>{currency(o.totalAmount || 0)}</span>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button onClick={() => { updateOrderStatus(o._id, 'cooking'); toastShow?.('Хийж эхэллээ'); }} className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }}>
                  <ChefHat size={12} /> Хийх
                </button>
                <button onClick={() => { updateOrderStatus(o._id, 'completed'); toastShow?.('Дууссан болголоо'); }} className="btn btn-success" style={{ padding: '6px 12px', fontSize: 12 }}>
                  <CheckCircle2 size={12} /> Дуусгах
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <BarChart3 size={14} color="#f59e0b" />
            <span style={{ fontWeight: 700, fontSize: 14 }}>Сүүлийн 7 хоногийн борлуулалт</span>
          </div>
          <div style={{ height: 240 }}>
            {ordersLoading
              ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><RefreshCw size={24} className="anim-spin" color="var(--text-faint)" /></div>
              : <Bar data={barChartData} options={chartOptions} />
            }
          </div>
        </div>
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <PieChart size={14} color="#3b82f6" />
            <span style={{ fontWeight: 700, fontSize: 14 }}>Захиалгын төлөв</span>
          </div>
          <div style={{ height: 210, position: 'relative' }}>
            <Doughnut data={statusPieData} options={pieOptions} />
            <div style={{
              position: 'absolute',
              top: '43%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              pointerEvents: 'none',
            }}>
              <div style={{ fontSize: 10, color: 'var(--text-faint)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Нийт</div>
              <div style={{ fontSize: 24, fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginTop: 2 }}>
                {filteredOrders.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 16 }}>
        {/* Recent Orders */}
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShoppingBag size={14} color="#f59e0b" />
              <span style={{ fontWeight: 700, fontSize: 14 }}>Сүүлийн захиалгууд</span>
            </div>
            <span className="chip" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>{filteredOrders.length} нийт</span>
          </div>
          <div style={{ maxHeight: 320, overflowY: 'auto' }}>
            {filteredOrders.slice(0, 5).map((o, i) => (
              <div key={o._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: i < 4 ? '1px solid var(--border)' : 'none', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div className="avatar" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', fontSize: 11 }}>{(o.customerName || 'З')[0].toUpperCase()}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{o.customerName || 'Зочин'}</span>
                    <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b' }}>{currency(o.totalAmount || 0)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="mono" style={{ fontSize: 11, color: 'var(--text-faint)' }}>#{o._id?.slice(-6).toUpperCase()}</span>
                    <StatusBadge status={o.status} size="sm" />
                  </div>
                </div>
              </div>
            ))}
            {filteredOrders.length === 0 && (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-faint)' }}>
                <ShoppingBag size={28} style={{ margin: '0 auto 8px', opacity: 0.3 }} />
                <div style={{ fontSize: 13 }}>Захиалга байхгүй</div>
              </div>
            )}
          </div>
        </div>

        {/* Top Items */}
        <div className="glass-card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
            <Flame size={14} color="#ef4444" />
            <span style={{ fontWeight: 700, fontSize: 13 }}>Шилдэг борлуулалттай</span>
          </div>
          {topItems.length === 0
            ? <div style={{ fontSize: 12, color: 'var(--text-faint)', textAlign: 'center', padding: 20 }}>Мэдээлэл байхгүй</div>
            : topItems.map(([name, count], idx) => (
              <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 20, height: 20, borderRadius: 6, background: idx === 0 ? '#fbbf24' : idx === 1 ? '#94a3b8' : idx === 2 ? '#b45309' : 'var(--bg-elevated)', color: idx < 3 ? '#000' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{idx + 1}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{name}</span>
                </div>
                <span className="chip" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', flexShrink: 0 }}>{count} ш</span>
              </div>
            ))
          }
        </div>

        {/* Categories + cooking */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="glass-card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
              <UtensilsCrossed size={13} color="var(--text-muted)" />
              <span style={{ fontWeight: 700, fontSize: 13 }}>Ангиллаар</span>
            </div>
            {topCategories.map(([cat, cnt]) => (
              <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <Coffee size={12} color="var(--text-faint)" />
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat || '—'}</span>
                </div>
                <span className="chip" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', flexShrink: 0 }}>{cnt}</span>
              </div>
            ))}
          </div>
          {cookingOrders > 0 && (
            <div style={{ padding: '14px 16px', background: 'rgba(59,130,246,0.08)', borderRadius: 12, border: '1px solid rgba(59,130,246,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Zap size={14} color="#60a5fa" />
                <span style={{ fontSize: 13, color: '#60a5fa', fontWeight: 600 }}>Хийгдэж байгаа</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#60a5fa' }}>{cookingOrders}</div>
              <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 4 }}>Гал тогоонд бэлтгэгдэж байна</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardOverview;