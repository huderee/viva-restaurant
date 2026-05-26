// src/components/admin/ReservationStatsView.jsx
import { useEffect, useState } from 'react';
import {
  BarChart3, TrendingUp, Calendar, Clock, Users, XCircle,
  Crown, Utensils, RefreshCw, Loader2,
} from 'lucide-react';
import api from '../../lib/api';

const DOW_LABELS = ['Ня', 'Да', 'Мя', 'Лх', 'Пү', 'Ба', 'Бя'];

export default function ReservationStatsView() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const r = await api.get('/reservations/stats');
      setData(r?.data || null);
    } catch (err) {
      setError(err?.message || 'Алдаа гарлаа');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60, color: 'var(--text-faint)' }}>
        <Loader2 size={20} className="anim-spin" style={{ marginRight: 10 }} />
        Ачааллаж байна...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="glass-card" style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ marginBottom: 12 }}>{error || 'Өгөгдөл татаж чадсангүй'}</div>
        <button onClick={fetchStats} className="btn-primary" style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
          <RefreshCw size={13} /> Дахин оролдох
        </button>
      </div>
    );
  }

  const maxHour = Math.max(1, ...data.hourHeatmap);
  const maxDow  = Math.max(1, ...data.dowDist);
  const maxTrend = Math.max(1, ...data.trend.map(t => t.count));
  const typeTotal = data.byType.standard + data.byType.vip;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
            <BarChart3 size={13} color="var(--text-faint)" />
            <span style={{ fontSize: 11, color: 'var(--text-faint)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>
              Статистик
            </span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>Захиалгын шинжилгээ</h1>
          <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 4 }}>
            Сүүлийн {data.rangeDays} хоногийн өгөгдөл
          </div>
        </div>
        <button
          onClick={fetchStats}
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            color: 'var(--text-muted)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          title="Шинэчлэх"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <StatCard icon={Calendar}     color="#f59e0b" label="Өнөөдрийн захиалга" value={data.todayCount} sub={`${data.todayGuests} хүн`} />
        <StatCard icon={TrendingUp}   color="#60a5fa" label="Нийт захиалга"       value={data.total}       sub={`${data.rangeDays} хоногт`} />
        <StatCard icon={Users}        color="#34d399" label="Дундаж хүний тоо"    value={data.avgGuests}   sub="ширээнд" />
        <StatCard icon={XCircle}      color="#ef4444" label="Цуцлалтын хувь"      value={`${data.cancelRate}%`} sub={`${data.cancelled} цуцалсан`} />
      </div>

      {/* Status breakdown */}
      <div className="glass-card" style={{ padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: 'var(--text-muted)' }}>
          Төлөвийн задаргаа
        </div>
        <div style={{ display: 'flex', height: 10, borderRadius: 5, overflow: 'hidden', marginBottom: 12 }}>
          <div style={{ width: `${pct(data.pending,   data.total)}%`, background: '#60a5fa' }} />
          <div style={{ width: `${pct(data.confirmed, data.total)}%`, background: '#34d399' }} />
          <div style={{ width: `${pct(data.cancelled, data.total)}%`, background: '#ef4444' }} />
        </div>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', fontSize: 11 }}>
          <Legend color="#60a5fa" label="Хүлээгдэж буй" value={data.pending} />
          <Legend color="#34d399" label="Баталгаажсан"   value={data.confirmed} />
          <Legend color="#ef4444" label="Цуцалсан"       value={data.cancelled} />
        </div>
      </div>

      {/* 14 day trend */}
      <div className="glass-card" style={{ padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, color: 'var(--text-muted)' }}>
          Сүүлийн 14 хоногийн чиг хандлага
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 140 }}>
          {data.trend.map(d => {
            const h = Math.round((d.count / maxTrend) * 100);
            const isToday = d.date === new Date().toISOString().slice(0, 10);
            return (
              <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div
                  title={`${d.date}: ${d.count} захиалга`}
                  style={{
                    width: '100%',
                    height: `${Math.max(h, 2)}%`,
                    background: isToday ? 'linear-gradient(to top, #f59e0b, #eab308)' : 'linear-gradient(to top, rgba(245,158,11,0.4), rgba(245,158,11,0.7))',
                    borderRadius: 4,
                    transition: 'all 0.3s',
                  }}
                />
                <div style={{
                  fontSize: 9, color: isToday ? '#f59e0b' : 'var(--text-faint)',
                  fontWeight: isToday ? 700 : 500,
                  writingMode: 'vertical-rl', transform: 'rotate(180deg)',
                  whiteSpace: 'nowrap', maxHeight: 40,
                }}>
                  {d.date.slice(5)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2 col: hour + dow */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 12 }}>
        {/* Hour heatmap */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 16 }}>
            <Clock size={14} color="#f59e0b" />
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>
              Цагийн ачаалал
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 4 }}>
            {data.hourHeatmap.slice(10, 23).map((count, i) => {
              const hour = i + 10;
              const intensity = count / maxHour;
              return (
                <div key={hour} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <div
                    title={`${hour}:00 — ${count} захиалга`}
                    style={{
                      width: '100%', aspectRatio: '1/1.4',
                      background: count === 0
                        ? 'var(--bg-elevated)'
                        : `rgba(245, 158, 11, ${0.15 + intensity * 0.75})`,
                      borderRadius: 6,
                      border: `1px solid ${count === 0 ? 'var(--border)' : 'rgba(245,158,11,0.3)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 700,
                      color: intensity > 0.5 ? '#fff' : (count === 0 ? 'var(--text-faint)' : '#f59e0b'),
                    }}
                  >
                    {count}
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--text-faint)', fontWeight: 600 }}>
                    {hour}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Day of week */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 16 }}>
            <Calendar size={14} color="#60a5fa" />
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>
              Гарагийн хуваарилалт
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.dowDist.map((count, i) => {
              const w = Math.round((count / maxDow) * 100);
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 22, fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>
                    {DOW_LABELS[i]}
                  </div>
                  <div style={{ flex: 1, height: 16, background: 'var(--bg-elevated)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{
                      width: `${Math.max(w, 2)}%`, height: '100%',
                      background: 'linear-gradient(to right, #60a5fa, #3b82f6)',
                      transition: 'width 0.3s',
                    }} />
                  </div>
                  <div className="mono" style={{ width: 24, textAlign: 'right', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>
                    {count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Table type */}
      <div className="glass-card" style={{ padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: 'var(--text-muted)' }}>
          Ширээний төрлөөр
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <TypeRow
            icon={Utensils}
            color="#f59e0b"
            label="Энгийн"
            value={data.byType.standard}
            pct={pct(data.byType.standard, typeTotal)}
          />
          <TypeRow
            icon={Crown}
            color="#eab308"
            label="VIP"
            value={data.byType.vip}
            pct={pct(data.byType.vip, typeTotal)}
          />
        </div>
      </div>
    </div>
  );
}

function pct(v, total) {
  return total > 0 ? Math.round((v / total) * 100) : 0;
}

function StatCard({ icon: Icon, color, label, value, sub }) {
  return (
    <div className="glass-card" style={{
      padding: '18px 20px',
      borderLeft: `3px solid ${color}`,
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: `${color}22`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={15} color={color} />
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 600 }}>
          {label}
        </div>
      </div>
      <div className="mono" style={{ fontSize: 26, fontWeight: 800, color, lineHeight: 1.1, marginTop: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>{sub}</div>
    </div>
  );
}

function Legend({ color, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span className="mono" style={{ fontWeight: 700, color: 'var(--text)' }}>{value}</span>
    </div>
  );
}

function TypeRow({ icon: Icon, color, label, value, pct }) {
  return (
    <div style={{ padding: 14, borderRadius: 10, background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9,
          background: `${color}22`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={15} color={color} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700 }}>{label}</div>
          <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>{pct}% нийтээс</div>
        </div>
        <div className="mono" style={{ fontSize: 20, fontWeight: 800, color }}>{value}</div>
      </div>
      <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`, height: '100%', background: color, transition: 'width 0.3s',
        }} />
      </div>
    </div>
  );
}
