// src/components/admin/AnalyticsView.jsx
import { useMemo } from "react";
import { BarChart3, TrendingUp, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { useOrders } from "../../contexts/OrdersContext";
import { useMenu } from "../../contexts/MenuContext";
import { currency } from "../../utils/format";
import { sumPaidRevenue, avgPaidOrderValue, isPaidOrder } from "../../utils/adminMetrics";
import { ORDER_STATUS } from './StatusBadge';

const BAR_COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#f97316', '#ec4899', '#14b8a6', '#a3e635'];

function BarChart({ data, height = 120 }) {
  if (!data.length) return null;
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height, paddingTop: 8 }}>
      {data.map((d, i) => {
        const pct = (d.value / max) * 100;
        return (
          <div key={d.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: 10, color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>{d.value}</span>
            <div
              style={{
                width: '100%', borderRadius: '4px 4px 0 0',
                height: `${Math.max(pct, 4)}%`,
                background: BAR_COLORS[i % BAR_COLORS.length],
                opacity: 0.85,
                transition: 'height 0.5s ease',
              }}
              title={`${d.label}: ${d.value}`}
            />
            <span style={{ fontSize: 10, color: 'var(--text-faint)', textAlign: 'center', maxWidth: 50, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function AnalyticsView() {
  const { orders } = useOrders();
  const { items, categories } = useMenu();

  const stats = useMemo(() => {
    const totalRevenue = sumPaidRevenue(orders);
    const avgOrder     = avgPaidOrderValue(orders);

    // Orders per day (last 7 days)
    const today = new Date();
    const dayLabels = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });
    const ordersPerDay = dayLabels.map(date => ({
      label: date.slice(5),
      value: orders.filter(o => (o.createdAt || '').startsWith(date)).length,
    }));

    // Revenue per category
    const catRevMap = {};
    orders.filter(isPaidOrder).forEach(o => {
      (o.items || []).forEach(item => {
        const menuItem = items.find(m => m.name === item.name);
        const cat = menuItem?.category || item.category || 'Бусад';
        catRevMap[cat] = (catRevMap[cat] || 0) + (item.price || 0) * (item.quantity || 1);
      });
    });
    const revenueByCategory = Object.entries(catRevMap)
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({ label, value }));

    // Top items by order count
    const itemMap = {};
    orders.filter(isPaidOrder).forEach(o => {
      (o.items || []).forEach(item => {
        itemMap[item.name] = (itemMap[item.name] || 0) + (item.quantity || 1);
      });
    });
    const topItems = Object.entries(itemMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([label, value]) => ({ label, value }));

    // Status breakdown
    const statusBreakdown = Object.entries(ORDER_STATUS).map(([key, cfg]) => ({
      key, ...cfg,
      count: orders.filter(o => o.status === key).length,
    }));

    return { totalRevenue, avgOrder, ordersPerDay, revenueByCategory, topItems, statusBreakdown };
  }, [orders, items]);

  const maxCatRev = Math.max(...stats.revenueByCategory.map(d => d.value), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
          <BarChart3 size={13} color="var(--text-faint)" />
          <span style={{ fontSize: 11, color: 'var(--text-faint)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>Аналитик</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>Статистик & Дүн шинжилгээ</h1>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Нийт захиалга',    value: orders.length,            icon: ShoppingBag,     color: '#f59e0b', bg: 'rgba(245,158,11,0.08)'  },
          { label: 'Бодит орлого (төлсөн)', value: currency(stats.totalRevenue), icon: TrendingUp,  color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
          { label: 'Дундаж төлсөн захиалга', value: currency(stats.avgOrder), icon: BarChart3, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)'  },
          { label: 'Цэсний нийт хоол',  value: items?.length ?? 0,       icon: UtensilsCrossed, color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)'  },
        ].map(s => (
          <div key={s.label} className="glass-card stat-card-shine"
            style={{ padding: 20, background: s.bg, borderColor: `${s.color}33` }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</span>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: `${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={14} color={s.color} />
              </div>
            </div>
            <div className="mono" style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Orders per day */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <ShoppingBag size={13} color="#f59e0b" />
            <span style={{ fontWeight: 700, fontSize: 14 }}>Захиалга (сүүлийн 7 хоног)</span>
          </div>
          <BarChart data={stats.ordersPerDay} height={130} />
        </div>

        {/* Top menu items */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <UtensilsCrossed size={13} color="#10b981" />
            <span style={{ fontWeight: 700, fontSize: 14 }}>Эрэлт хамгийн ихтэй хоолууд</span>
          </div>
          <BarChart data={stats.topItems} height={130} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        {/* Revenue by category */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <TrendingUp size={13} color="#3b82f6" />
            <span style={{ fontWeight: 700, fontSize: 14 }}>Орлого ангиллаар</span>
          </div>
          {stats.revenueByCategory.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--text-faint)', padding: '20px 0', textAlign: 'center' }}>Мэдээлэл байхгүй</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {stats.revenueByCategory.map(({ label, value }, i) => {
                const pct = (value / maxCatRev) * 100;
                return (
                  <div key={label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: BAR_COLORS[i % BAR_COLORS.length], display: 'inline-block' }} />
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</span>
                      </div>
                      <span className="mono" style={{ fontSize: 11, fontWeight: 700, color: BAR_COLORS[i % BAR_COLORS.length] }}>{currency(value)}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%`, background: BAR_COLORS[i % BAR_COLORS.length] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Status breakdown */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <BarChart3 size={13} color="#8b5cf6" />
            <span style={{ fontWeight: 700, fontSize: 14 }}>Захиалгын төлөв</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {stats.statusBreakdown.map(s => {
              const pct = orders.length > 0 ? (s.count / orders.length) * 100 : 0;
              return (
                <div key={s.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.dot, display: 'inline-block' }} />
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="mono" style={{ fontSize: 11, fontWeight: 700, color: s.text }}>{s.count}</span>
                      <span style={{ fontSize: 10, color: 'var(--text-faint)' }}>{Math.round(pct)}%</span>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: s.dot }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsView;
