// src/components/admin/JobsView.jsx
import { useEffect, useState } from "react";
import {
  Briefcase, Plus, Edit3, X, Check, Trash2, Search,
  Eye, EyeOff,
} from "lucide-react";
import api from "../../lib/api";
import { SkeletonCardList } from "./Skeleton";

const TYPE_OPTIONS = [
  { key: 'full',     label: 'Бүтэн цагийн' },
  { key: 'part',     label: 'Хагас цагийн' },
  { key: 'contract', label: 'Гэрээт' },
];

const COLOR_OPTIONS = [
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-emerald-500 to-teal-600',
  'from-blue-500 to-indigo-600',
  'from-purple-500 to-fuchsia-600',
  'from-yellow-500 to-amber-600',
];

const emptyForm = {
  titleMn: '', titleEn: '',
  typeKey: 'full',
  purposeMn: '', purposeEn: '',
  hoursMn: '', hoursEn: '',
  salaryMn: '', salaryEn: '',
  benefitsMn: '', benefitsEn: '',
  color: COLOR_OPTIONS[0],
  active: true,
  order: 0,
};

function JobsView({ toastShow }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get('/jobs/all');
      setJobs(Array.isArray(r?.data) ? r.data : []);
    } catch (e) {
      toastShow?.(e.message || 'Татаж чадсангүй', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openNew  = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (j) => { setEditing(j); setForm({ ...emptyForm, ...j }); setShowForm(true); };

  const save = async () => {
    if (!form.titleMn) { toastShow?.('Албан тушаалын нэр оруулна уу', 'error'); return; }
    setSaving(true);
    try {
      const payload = { ...form, order: Number(form.order) || 0 };
      if (editing?._id) {
        await api.put(`/jobs/${editing._id}`, payload);
        toastShow?.('Ажлын байр шинэчлэгдлээ');
      } else {
        await api.post('/jobs', payload);
        toastShow?.('Ажлын байр нэмэгдлээ');
      }
      setShowForm(false);
      load();
    } catch (e) {
      toastShow?.(e.message || 'Хадгалж чадсангүй', 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (j) => {
    if (!window.confirm(`"${j.titleMn}" ажлын байрыг устгах уу?`)) return;
    try {
      await api.delete(`/jobs/${j._id}`);
      toastShow?.('Устгагдлаа', 'error');
      load();
    } catch (e) {
      toastShow?.(e.message || 'Устгаж чадсангүй', 'error');
    }
  };

  const toggleActive = async (j) => {
    try {
      await api.put(`/jobs/${j._id}`, { active: !j.active });
      load();
    } catch (e) {
      toastShow?.(e.message || 'Алдаа', 'error');
    }
  };

  const filtered = jobs.filter(j => {
    const q = search.toLowerCase();
    return !q
      || j.titleMn?.toLowerCase().includes(q)
      || j.titleEn?.toLowerCase().includes(q);
  });

  const inputLabel = { display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-faint)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
            <Briefcase size={13} color="var(--text-faint)" />
            <span style={{ fontSize: 11, color: 'var(--text-faint)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>Удирдлага</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>Ажлын байрууд</h1>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Хайх..."
              className="input-field" style={{ paddingLeft: 34, width: 200 }} />
          </div>
          <button onClick={openNew} className="btn btn-primary">
            <Plus size={14} /> Шинэ ажлын байр
          </button>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <SkeletonCardList count={4} />
      ) : filtered.length === 0 ? (
        <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-faint)' }}>
          <Briefcase size={32} style={{ margin: '0 auto 10px', opacity: 0.25 }} />
          <div style={{ fontSize: 14, marginBottom: 6 }}>{search ? 'Олдсонгүй' : 'Ажлын байр алга'}</div>
          {!search && <button className="btn btn-primary" onClick={openNew} style={{ margin: '0 auto' }}><Plus size={13} /> Нэмэх</button>}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filtered.map((j, i) => (
            <div key={j._id} className="menu-card" style={{ animationDelay: `${i * 40}ms`, padding: 0, overflow: 'hidden' }}>
              <div style={{ height: 4, background: 'linear-gradient(to right, #f59e0b, #ea580c)' }} />
              <div style={{ padding: '16px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 8 }}>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em' }}>{j.titleMn}</h3>
                    {j.titleEn && <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 2 }}>{j.titleEn}</div>}
                  </div>
                  <span className="chip" style={{
                    background: j.active ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                    color: j.active ? '#10b981' : '#ef4444',
                    border: `1px solid ${j.active ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                    flexShrink: 0,
                  }}>
                    {j.active ? 'Идэвхтэй' : 'Нуугдсан'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                  <span className="chip" style={{ background: 'var(--bg-base)' }}>
                    {TYPE_OPTIONS.find(t => t.key === j.typeKey)?.label || j.typeKey}
                  </span>
                  {j.salaryMn && <span className="chip" style={{ background: 'var(--bg-base)', color: '#f59e0b' }}>{j.salaryMn}</span>}
                </div>
                {j.purposeMn && (
                  <p style={{ fontSize: 12, color: 'var(--text-faint)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 12 }}>
                    {j.purposeMn}
                  </p>
                )}
                <div style={{ display: 'flex', gap: 6, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                  <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center', padding: '7px 0' }} onClick={() => toggleActive(j)}>
                    {j.active ? <EyeOff size={12} /> : <Eye size={12} />} {j.active ? 'Нуух' : 'Харуулах'}
                  </button>
                  <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center', padding: '7px 0' }} onClick={() => openEdit(j)}>
                    <Edit3 size={12} /> Засах
                  </button>
                  <button className="btn btn-danger" style={{ flex: 1, justifyContent: 'center', padding: '7px 0' }} onClick={() => remove(j)}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div
          onClick={() => setShowForm(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
            zIndex: 200,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24, animation: 'fadeIn 0.2s ease',
          }}
        >
          <div
            className="anim-scale-in"
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 680,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-light)',
              borderRadius: 20,
              boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
              display: 'flex', flexDirection: 'column',
              maxHeight: '90vh', overflow: 'hidden',
            }}
          >
            <div style={{
              padding: '22px 24px', borderBottom: '1px solid var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: editing ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {editing ? <Edit3 size={16} color="var(--accent)" /> : <Plus size={16} color="var(--green)" />}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>
                    {editing ? 'Ажлын байр засах' : 'Шинэ ажлын байр'}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 1 }}>
                    {editing ? editing.titleMn : 'Нээлттэй ажлын байр нэмэх'}
                  </div>
                </div>
              </div>
              <button onClick={() => setShowForm(false)} style={{
                background: 'var(--bg-hover)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '7px 9px', cursor: 'pointer',
                color: 'var(--text-muted)', transition: 'all 0.15s',
              }}>
                <X size={15} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '22px 24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={inputLabel}>Нэр (MN) *</label>
                    <input className="input-field" value={form.titleMn} autoFocus
                      onChange={e => setForm(f => ({ ...f, titleMn: e.target.value }))}
                      placeholder="Жишээ: Тогооч" />
                  </div>
                  <div>
                    <label style={inputLabel}>Нэр (EN)</label>
                    <input className="input-field" value={form.titleEn}
                      onChange={e => setForm(f => ({ ...f, titleEn: e.target.value }))}
                      placeholder="Chef" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={inputLabel}>Ажлын төрөл</label>
                    <select className="input-field" value={form.typeKey}
                      onChange={e => setForm(f => ({ ...f, typeKey: e.target.value }))}
                      style={{ background: 'var(--bg-elevated)', appearance: 'none' }}>
                      {TYPE_OPTIONS.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={inputLabel}>Эрэмбэ</label>
                    <input className="input-field" type="number" value={form.order}
                      onChange={e => setForm(f => ({ ...f, order: e.target.value }))} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={inputLabel}>Зорилго (MN)</label>
                    <textarea className="input-field" rows={2} value={form.purposeMn}
                      onChange={e => setForm(f => ({ ...f, purposeMn: e.target.value }))}
                      style={{ resize: 'none' }} />
                  </div>
                  <div>
                    <label style={inputLabel}>Purpose (EN)</label>
                    <textarea className="input-field" rows={2} value={form.purposeEn}
                      onChange={e => setForm(f => ({ ...f, purposeEn: e.target.value }))}
                      style={{ resize: 'none' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={inputLabel}>Цаг (MN)</label>
                    <input className="input-field" value={form.hoursMn}
                      onChange={e => setForm(f => ({ ...f, hoursMn: e.target.value }))}
                      placeholder="Да-Баа 10:00-20:00" />
                  </div>
                  <div>
                    <label style={inputLabel}>Hours (EN)</label>
                    <input className="input-field" value={form.hoursEn}
                      onChange={e => setForm(f => ({ ...f, hoursEn: e.target.value }))}
                      placeholder="Mon-Fri 10:00-20:00" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={inputLabel}>Цалин (MN)</label>
                    <input className="input-field" value={form.salaryMn}
                      onChange={e => setForm(f => ({ ...f, salaryMn: e.target.value }))}
                      placeholder="1,500,000₮ + урамшуулал" />
                  </div>
                  <div>
                    <label style={inputLabel}>Salary (EN)</label>
                    <input className="input-field" value={form.salaryEn}
                      onChange={e => setForm(f => ({ ...f, salaryEn: e.target.value }))}
                      placeholder="1,500,000₮ + bonus" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={inputLabel}>Нөхцөл (MN)</label>
                    <textarea className="input-field" rows={2} value={form.benefitsMn}
                      onChange={e => setForm(f => ({ ...f, benefitsMn: e.target.value }))}
                      style={{ resize: 'none' }} />
                  </div>
                  <div>
                    <label style={inputLabel}>Benefits (EN)</label>
                    <textarea className="input-field" rows={2} value={form.benefitsEn}
                      onChange={e => setForm(f => ({ ...f, benefitsEn: e.target.value }))}
                      style={{ resize: 'none' }} />
                  </div>
                </div>

                <div>
                  <label style={inputLabel}>Өнгөний градиент</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {COLOR_OPTIONS.map(c => {
                      const active = form.color === c;
                      return (
                        <button key={c} type="button"
                          onClick={() => setForm(f => ({ ...f, color: c }))}
                          className={`bg-gradient-to-r ${c}`}
                          style={{
                            width: 64, height: 28, borderRadius: 8,
                            border: active ? '2px solid #f59e0b' : '2px solid transparent',
                            cursor: 'pointer',
                          }} />
                      );
                    })}
                  </div>
                </div>

                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: form.active ? 'rgba(16,185,129,0.06)' : 'var(--bg-base)',
                  borderRadius: 12,
                  border: `1px solid ${form.active ? 'rgba(16,185,129,0.25)' : 'var(--border)'}`,
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>Идэвхтэй</div>
                    <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>Сайт дээр харуулах эсэх</div>
                  </div>
                  <button className={`toggle ${form.active ? 'on' : 'off'}`}
                    onClick={() => setForm(f => ({ ...f, active: !f.active }))} />
                </div>
              </div>
            </div>

            <div style={{
              padding: '16px 24px', borderTop: '1px solid var(--border)',
              display: 'flex', gap: 10, flexShrink: 0, background: 'var(--bg-surface)',
            }}>
              <button className="btn btn-primary" onClick={save} disabled={saving}
                style={{ flex: 1, justifyContent: 'center', padding: '11px 0' }}>
                <Check size={14} /> {saving ? 'Хадгалж байна...' : (editing ? 'Хадгалах' : 'Нэмэх')}
              </button>
              <button className="btn btn-ghost" onClick={() => setShowForm(false)} style={{ padding: '11px 20px' }}>
                Болих
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobsView;
