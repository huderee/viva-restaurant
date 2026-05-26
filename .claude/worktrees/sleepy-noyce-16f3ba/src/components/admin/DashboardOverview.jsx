// src/components/admin/DashboardOverview.jsx
import React from 'react';
import {
  ShoppingBag, TrendingUp, Users, BarChart3, Sparkles, Activity,
  PieChart, UtensilsCrossed, Coffee, Zap
} from "lucide-react";
import { useOrders } from "../../contexts/OrdersContext";
import { useMenu } from "../../contexts/MenuContext";
import { useReservations } from "../../contexts/ReservationsContext";
import { currency } from "../../utils/format";
import StatusBadge, { ORDER_STATUS } from './StatusBadge';

function DashboardOverview() {
  const { orders } = useOrders();
  const { reservations } = useReservations();
  const { items } = useMenu();

  const totalRevenue    = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const pendingOrders   = orders.filter(o => o.status === 'pending').length;
  const cookingOrders   = orders.filter(o => o.status === 'cooking').length;
  const todayRes        = reservations.filter(r => r.date === new Date().toISOString().split('T')[0]).length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const completionRate  = orders.length > 0 ? Math.round((completedOrders / orders.length) * 100) : 0;

  const stats = [
    {
      label: 'Нийт захиалга', value: orders.length, sub: `${pendingOrders} хүлээгдэж буй`,
      icon: ShoppingBag, accent: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)',
      trend: '+12%',
    },
    {
      label: 'Нийт орлого', value: currency(totalRevenue), sub: 'Өнөөдрийн нийт',
      icon: TrendingUp, accent: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)',
      trend: '+8%',
    },
    {
      label: 'Гүйцэтгэлийн хувь', value: `${completionRate}%`, sub: `${completedOrders} гүйцэтгэгдсэн`,
      icon: BarChart3, accent: '#3b82f6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)',
      trend: completionRate > 70 ? 'Сайн' : 'Сайжруулах',
    },
    {
      label: 'Өнөөдрийн ширээ', value: todayRes, sub: `${reservations.length} нийт`,
      icon: Users, accent: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.2)',
      trend: `+${todayRes}`,
    },
  ];

  const catMap = {};
  (items ?? []).forEach(it => { catMap[it.category] = (catMap[it.category] || 0) + 1; });
  const topCategories = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Sparkles size={14} color="#f59e0b" />
            <span style={{ fontSize: 11, color: 'var(--text-faint)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>Хяналтын самбар</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>Өдрийн тойм</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-faint)' }}>
          <Activity size={12} color="#10b981" />
          Шууд мэдээлэл
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {stats.map((s, i) => (
          <div key={s.label} className="glass-card stat-card-shine"
            style={{ padding: 20, background: s.bg, borderColor: s.border, animationDelay: `${i * 60}ms` }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.3, maxWidth: 90 }}>{s.label}</span>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: `${s.accent}22`,
                border: `1px solid ${s.accent}33`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <s.icon size={15} color={s.accent} />
              </div>
            </div>
            <div className="mono" style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', color: s.accent, marginBottom: 6 }}>
              {s.value}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>{s.sub}</span>
              <span style={{
                fontSize: 10, padding: '2px 7px', borderRadius: 99, fontWeight: 700,
                background: `${s.accent}18`, color: s.accent,
                fontFamily: 'var(--font-mono)',
              }}>{s.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16 }}>
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShoppingBag size={14} color="#f59e0b" />
              <span style={{ fontWeight: 700, fontSize: 14 }}>Сүүлийн захиалгууд</span>
            </div>
            <span className="chip" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>{orders.length} нийт</span>
          </div>
          <div>
            {orders.slice(0, 6).map((o, i) => (
              <div key={o._id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 20px',
                borderBottom: i < 5 ? '1px solid var(--border)' : 'none',
                transition: 'background 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div className="avatar" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', fontSize: 11 }}>
                  {(o.customerName || 'З')[0].toUpperCase()}
                </div>
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
            {orders.length === 0 && (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-faint)' }}>
                <ShoppingBag size={28} style={{ margin: '0 auto 8px', opacity: 0.3 }} />
                <div style={{ fontSize: 13 }}>Захиалга байхгүй</div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="glass-card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
              <PieChart size={13} color="var(--text-muted)" />
              <span style={{ fontWeight: 700, fontSize: 13 }}>Захиалгын төлөв</span>
            </div>
            {Object.entries(ORDER_STATUS).map(([key, cfg]) => {
              const count = orders.filter(o => o.status === key).length;
              const pct = orders.length > 0 ? (count / orders.length) * 100 : 0;
              return (
                <div key={key} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.dot, display: 'inline-block' }} />
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{cfg.label}</span>
                    </div>
                    <span className="mono" style={{ fontSize: 11, fontWeight: 700, color: cfg.text }}>{count}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: cfg.dot }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="glass-card" style={{ padding: 18, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
              <UtensilsCrossed size={13} color="var(--text-muted)" />
              <span style={{ fontWeight: 700, fontSize: 13 }}>Ангиллаар</span>
            </div>
            {topCategories.length === 0
              ? <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>Цэс хоосон</div>
              : topCategories.map(([cat, cnt]) => (
                <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                    <Coffee size={12} color="var(--text-faint)" />
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat || '—'}</span>
                  </div>
                  <span className="chip" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', flexShrink: 0 }}>{cnt}</span>
                </div>
              ))
            }
            {cookingOrders > 0 && (
              <div style={{ marginTop: 14, padding: '10px 12px', background: 'rgba(59,130,246,0.08)', borderRadius: 10, border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Zap size={13} color="#60a5fa" />
                <span style={{ fontSize: 12, color: '#60a5fa', fontWeight: 600 }}>{cookingOrders} хоол хийгдэж байна</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardOverview;