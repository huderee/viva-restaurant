// src/components/admin/JobApplicationsView.jsx
import { useState, useEffect, useCallback } from 'react';
import { Phone, Mail, Briefcase, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import api from '../../lib/api';

const STATUS_OPTS = [
  { value: 'new',       label: 'Шинэ',       color: '#f59e0b' },
  { value: 'reviewed',  label: 'Шалгасан',   color: '#3b82f6' },
  { value: 'contacted', label: 'Холбогдсон', color: '#10b981' },
  { value: 'rejected',  label: 'Татгалзсан', color: '#ef4444' },
];

const StatusBadge = ({ status }) => {
  const opt = STATUS_OPTS.find(s => s.value === status) || STATUS_OPTS[0];
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
      background: opt.color + '22', color: opt.color, border: `1px solid ${opt.color}44`,
    }}>
      {opt.label}
    </span>
  );
};

export default function JobApplicationsView({ toastShow }) {
  const [apps, setApps]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [selected, setSelected] = useState(null);

  const fetchApps = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const { data } = await api.get('/jobs/applications');
      setApps(data?.data || data || []);
    } catch {
      setError('Анкет ачаалахад алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchApps(); }, [fetchApps]);

  const updateStatus = async (id, status) => {
    const prev = apps;
    setApps(a => a.map(x => x._id === id ? { ...x, status } : x));
    try {
      await api.put(`/jobs/applications/${id}`, { status });
      toastShow?.('Төлөв шинэчлэгдлээ');
    } catch {
      setApps(prev);
      toastShow?.('Алдаа гарлаа', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>Ажлын анкет</div>
          <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 2 }}>
            Careers хэсгээс ирсэн өргөдлүүд
          </div>
        </div>
        <button className="sidebar-toggle-btn" onClick={fetchApps} title="Шинэчлэх" style={{ width: 36, height: 36 }}>
          <RefreshCw size={14} className={loading ? 'spin' : ''} />
        </button>
      </div>

      {/* Summary badges */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {STATUS_OPTS.map(opt => {
          const count = apps.filter(a => a.status === opt.value).length;
          return (
            <div key={opt.value} style={{
              padding: '6px 14px', borderRadius: 10, fontSize: 12, fontWeight: 600,
              background: opt.color + '15', color: opt.color,
              border: `1px solid ${opt.color}30`,
            }}>
              {opt.label}: {count}
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {error && (
          <div style={{ padding: 16, color: 'var(--red)', fontSize: 13 }}>{error}</div>
        )}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Нэр', 'Утас / И-мэйл', 'Албан тушаал', 'Илгээсэн', 'Төлөв', 'Үйлдэл'].map(h => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left', fontWeight: 700,
                    fontSize: 11, color: 'var(--text-faint)', textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} style={{ padding: '14px 16px' }}>
                        <div className="skeleton" style={{ height: 14, width: j === 0 ? 120 : 80 }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : apps.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 40, textAlign: 'center', color: 'var(--text-faint)' }}>
                    <Briefcase size={32} style={{ opacity: 0.3, margin: '0 auto 8px', display: 'block' }} />
                    Анкет байхгүй байна
                  </td>
                </tr>
              ) : apps.map(app => (
                // ✅ style давхардал засагдсан — нэг style attribute
                <tr
                  key={app._id}
                  className="data-row"
                  onClick={() => setSelected(app)}
                  style={{ cursor: 'pointer', borderBottom: '1px solid var(--border)' }}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                        background: 'var(--accent-soft)', color: 'var(--accent)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700,
                      }}>
                        {(app.name || '?')[0].toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600 }}>{app.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {app.phone && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={11} />{app.phone}</span>}
                      {app.email && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Mail size={11} />{app.email}</span>}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>{app.position || app.jobTitle || '—'}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-faint)', fontSize: 12 }}>
                    {app.createdAt ? new Date(app.createdAt).toLocaleDateString('mn-MN') : '—'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <StatusBadge status={app.status} />
                  </td>
                  <td style={{ padding: '12px 16px' }} onClick={e => e.stopPropagation()}>
                    <select
                      value={app.status || 'new'}
                      onChange={e => updateStatus(app._id, e.target.value)}
                      style={{
                        fontSize: 12, padding: '4px 8px', borderRadius: 6,
                        border: '1px solid var(--border)', background: 'var(--bg-card)',
                        color: 'var(--text-base)', cursor: 'pointer',
                      }}
                    >
                      {STATUS_OPTS.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
          }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{
              background: 'var(--bg-card)', borderRadius: 16, padding: 28,
              maxWidth: 480, width: '100%', border: '1px solid var(--border)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18 }}>{selected.name}</div>
                <div style={{ color: 'var(--text-faint)', fontSize: 12, marginTop: 2 }}>
                  {selected.position || selected.jobTitle}
                </div>
              </div>
              <button className="sidebar-toggle-btn" onClick={() => setSelected(null)} style={{ width: 32, height: 32 }}>
                <XCircle size={16} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
              {selected.phone && <div style={{ display: 'flex', gap: 8 }}><Phone size={14} color="var(--accent)" />{selected.phone}</div>}
              {selected.email && <div style={{ display: 'flex', gap: 8 }}><Mail size={14} color="var(--accent)" />{selected.email}</div>}
              {selected.message && (
                <div style={{ marginTop: 8, padding: 14, background: 'var(--bg-base)', borderRadius: 10, lineHeight: 1.6, color: 'var(--text-muted)' }}>
                  {selected.message}
                </div>
              )}
              {selected.createdAt && (
                <div style={{ color: 'var(--text-faint)', fontSize: 11, marginTop: 4 }}>
                  Илгээсэн: {new Date(selected.createdAt).toLocaleString('mn-MN')}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              <button
                onClick={() => { updateStatus(selected._id, 'contacted'); setSelected(null); }}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 10, fontWeight: 700, fontSize: 13,
                  background: 'rgba(16,185,129,0.15)', color: '#10b981',
                  border: '1px solid rgba(16,185,129,0.3)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                <CheckCircle2 size={14} /> Холбогдсон
              </button>
              <button
                onClick={() => { updateStatus(selected._id, 'rejected'); setSelected(null); }}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 10, fontWeight: 700, fontSize: 13,
                  background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                  border: '1px solid rgba(239,68,68,0.25)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                <XCircle size={14} /> Татгалзах
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}