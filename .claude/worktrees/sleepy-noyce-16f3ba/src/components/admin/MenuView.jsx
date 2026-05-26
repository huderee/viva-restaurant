// src/components/admin/MenuView.jsx
import { useState } from "react";
import {
  UtensilsCrossed, Search, Plus, Edit3, X, Check,
  Flame, Star, Tag, ImageOff, Trash2
} from "lucide-react";
import { useMenu } from "../../contexts/MenuContext";

function MenuView({ toastShow }) {
  const { items, upsertItem, removeItem, categories } = useMenu();
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [search,   setSearch]   = useState('');
  const [selCat,   setSelCat]   = useState('all');
  const [form, setForm] = useState({ name: '', price: '', category: '', description: '', isFeatured: false, imageUrl: '' });

  const openNew  = () => { setEditing(null); setForm({ name: '', price: '', category: '', description: '', isFeatured: false, imageUrl: '' }); setShowForm(true); };
  const openEdit = (it) => { setEditing(it); setForm({ ...it, price: String(it.price || '') }); setShowForm(true); };

  const save = () => {
    if (!form.name || !form.price || !form.category) { toastShow?.('Нэр, үнэ, ангиллыг бөглөнө үү', 'error'); return; }
    upsertItem({ ...form, id: editing?.id });
    setShowForm(false);
    toastShow?.(editing ? 'Хоол шинэчлэгдлээ' : 'Хоол нэмэгдлээ');
  };

  const allCats = ['all', ...(categories ?? []).map(c => c.name)];

  const filtered = (items ?? []).filter(it => {
    const q = search.toLowerCase();
    const matchSearch = !q || it.name?.toLowerCase().includes(q) || it.description?.toLowerCase().includes(q);
    const matchCat = selCat === 'all' || it.category === selCat;
    return matchSearch && matchCat;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
            <UtensilsCrossed size={13} color="var(--text-faint)" />
            <span style={{ fontSize: 11, color: 'var(--text-faint)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>Удирдлага</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>Цэсний удирдлага</h1>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Хоол хайх..."
              className="input-field" style={{ paddingLeft: 34, width: 200 }} />
          </div>
          <button onClick={openNew} className="btn btn-primary">
            <Plus size={14} /> Шинэ хоол
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {allCats.map(c => (
          <button key={c} onClick={() => setSelCat(c)}
            style={{
              padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'var(--font-main)',
              border: selCat === c ? '1px solid rgba(245,158,11,0.4)' : '1px solid var(--border)',
              background: selCat === c ? 'var(--accent-soft)' : 'var(--bg-elevated)',
              color: selCat === c ? 'var(--accent)' : 'var(--text-muted)',
            }}
          >
            {c === 'all' ? 'Бүгд' : c}
            {c === 'all' && (
              <span className="mono" style={{ marginLeft: 5, fontSize: 10, opacity: 0.7 }}>
                {items?.length ?? 0}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Form */}
      {showForm && (
  <div
    onClick={() => setShowForm(false)}
    style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(6px)',
      zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
      animation: 'fadeIn 0.2s ease',
    }}
  >
    <div
      className="anim-scale-in"
      onClick={e => e.stopPropagation()}
      style={{
        width: '100%', maxWidth: 520,
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-light)',
        borderRadius: 20,
        boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
        display: 'flex', flexDirection: 'column',
        maxHeight: '90vh', overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '22px 24px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: editing ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {editing
              ? <Edit3 size={16} color="var(--accent)" />
              : <Plus size={16} color="var(--green)" />}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16 }}>
              {editing ? 'Хоол засах' : 'Шинэ хоол нэмэх'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 1 }}>
              {editing ? `"${editing.name}" засварлаж байна` : 'Цэсэнд шинэ хоол нэмэх'}
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowForm(false)}
          style={{
            background: 'var(--bg-hover)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '7px 9px', cursor: 'pointer',
            color: 'var(--text-muted)', transition: 'all 0.15s',
          }}
        >
          <X size={15} />
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '22px 24px' }}>

        {/* Зургийн preview */}
        {form.imageUrl && (
          <div style={{
            height: 180, borderRadius: 12, overflow: 'hidden',
            marginBottom: 20, border: '1px solid var(--border)',
            position: 'relative', background: 'var(--bg-base)',
          }}>
            <img
              src={form.imageUrl} alt="preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => e.target.style.display = 'none'}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)',
            }} />
            <div style={{ position: 'absolute', bottom: 10, left: 12 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Урьдчилан харах</span>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Нэр */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-faint)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Хоолны нэр *
            </label>
            <input
              className="input-field"
              placeholder="Жишээ: Итали пицца"
              value={form.name}
              autoFocus
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          </div>

          {/* Үнэ + Ангилал */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-faint)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Үнэ (₮) *
              </label>
              <input
                className="input-field" type="number" placeholder="18000"
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-faint)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Ангилал *
              </label>
              <select
                className="input-field"
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                style={{ background: 'var(--bg-elevated)', appearance: 'none' }}
              >
                <option value="">Сонгох...</option>
                {(categories ?? []).map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Зургийн URL */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-faint)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Зургийн URL
            </label>
            <input
              className="input-field"
              placeholder="https://images.unsplash.com/..."
              value={form.imageUrl}
              onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
            />
          </div>

          {/* Тайлбар */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-faint)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Тайлбар
            </label>
            <textarea
              className="input-field"
              placeholder="Хоолны дэлгэрэнгүй тайлбар..."
              rows={3}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              style={{ resize: 'none' }}
            />
          </div>

          {/* Онцлох toggle */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 14px',
            background: form.isFeatured ? 'rgba(245,158,11,0.06)' : 'var(--bg-base)',
            borderRadius: 12,
            border: `1px solid ${form.isFeatured ? 'rgba(245,158,11,0.25)' : 'var(--border)'}`,
            transition: 'all 0.2s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Flame size={14} color={form.isFeatured ? 'var(--accent)' : 'var(--text-faint)'} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Онцлох хоол</div>
                <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>Нүүр хуудсанд онцлон харуулна</div>
              </div>
            </div>
            <button
              className={`toggle ${form.isFeatured ? 'on' : 'off'}`}
              onClick={() => setForm(f => ({ ...f, isFeatured: !f.isFeatured }))}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '16px 24px',
        borderTop: '1px solid var(--border)',
        display: 'flex', gap: 10,
        flexShrink: 0,
        background: 'var(--bg-surface)',
      }}>
        <button className="btn btn-primary" onClick={save} style={{ flex: 1, justifyContent: 'center', padding: '11px 0' }}>
          <Check size={14} /> {editing ? 'Хадгалах' : 'Нэмэх'}
        </button>
        <button className="btn btn-ghost" onClick={() => setShowForm(false)} style={{ padding: '11px 20px' }}>
          Болих
        </button>
      </div>
    </div>
  </div>
)}
      {filtered.length === 0 && !showForm ? (
        <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-faint)' }}>
          <UtensilsCrossed size={32} style={{ margin: '0 auto 10px', opacity: 0.25 }} />
          <div style={{ fontSize: 14, marginBottom: 6 }}>{search ? 'Хайлтын үр дүн олдсонгүй' : 'Цэс хоосон байна'}</div>
          {!search && <button className="btn btn-primary" onClick={openNew} style={{ margin: '0 auto' }}><Plus size={13} /> Хоол нэмэх</button>}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {filtered.map((item, i) => {
            const img = item.image || item.imageUrl;
            const featured = item.popular || item.isFeatured || item.isPopular;
            return (
              <div key={item.id} className="menu-card" style={{ animationDelay: `${i * 40}ms` }}>
                <div style={{ height: 160, background: 'var(--bg-elevated)', position: 'relative', overflow: 'hidden' }}>
                  {img ? (
                    <img src={img} alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                      onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 6 }}>
                      <ImageOff size={22} color="var(--text-faint)" />
                      <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>Зураг байхгүй</span>
                    </div>
                  )}
                  {featured && (
                    <span style={{
                      position: 'absolute', top: 10, left: 10,
                      background: 'var(--accent)', color: '#000',
                      fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 99,
                      display: 'flex', alignItems: 'center', gap: 3, letterSpacing: '0.03em',
                    }}>
                      <Star size={9} fill="#000" /> Онцлох
                    </span>
                  )}
                  <div style={{ position: 'absolute', top: 10, right: 10 }}>
                    <span className="chip" style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', backdropFilter: 'blur(8px)' }}>
                      <Tag size={9} /> {item.category || '—'}
                    </span>
                  </div>
                </div>

                <div style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <h3 style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em' }}>{item.name}</h3>
                    <span className="mono" style={{ fontWeight: 800, fontSize: 14, color: '#f59e0b', flexShrink: 0, marginLeft: 8 }}>
                      {Number(item.price).toLocaleString()}₮
                    </span>
                  </div>
                  {item.description && (
                    <p style={{ fontSize: 12, color: 'var(--text-faint)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 12 }}>
                      {item.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: 8, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                    <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center', padding: '7px 0' }} onClick={() => openEdit(item)}>
                      <Edit3 size={12} /> Засах
                    </button>
                    <button className="btn btn-danger" style={{ flex: 1, justifyContent: 'center', padding: '7px 0' }}
                      onClick={() => {
                        if (window.confirm('Хоолыг устгах уу?')) {
                          removeItem(item.id);
                          toastShow?.('Хоол устгагдлаа', 'error');
                        }
                      }}>
                      <Trash2 size={12} /> Устгах
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MenuView;
