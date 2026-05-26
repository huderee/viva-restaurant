// src/components/menu/MenuManagement.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Plus, X, Utensils, Edit2, Trash2,
  Save, Star, Search, Filter, Image as ImageIcon,
  ChevronDown, CheckCircle, AlertTriangle, Flame,
  Leaf, Sparkles, Award, Eye, EyeOff, Grid, List
} from 'lucide-react';
import { useMenu } from '../../contexts/MenuContext';

// ==============================
// Constants
// ==============================
const CATEGORY_LIST = ['Үндсэн хоол', 'Салат', 'Пицца', 'Амттан', 'Ундаа', 'Шөл', 'Суши'];

const TAGS = [
  { key: 'isFeatured',   label: 'Онцлох',   icon: Star,     color: 'text-amber-400',  bg: 'bg-amber-500/15 border-amber-500/30' },
  { key: 'isPopular',    label: 'Алдартай', icon: Flame,    color: 'text-orange-400', bg: 'bg-orange-500/15 border-orange-500/30' },
  { key: 'isNew',        label: 'Шинэ',     icon: Sparkles, color: 'text-blue-400',   bg: 'bg-blue-500/15 border-blue-500/30' },
  { key: 'isChefSpecial',label: 'Тогооч',   icon: Award,    color: 'text-purple-400', bg: 'bg-purple-500/15 border-purple-500/30' },
  { key: 'isHealthy',    label: 'Эрүүл',    icon: Leaf,     color: 'text-amber-400',bg: 'bg-amber-500/15 border-amber-500/30' },
];

const EMPTY_FORM = {
  name: '', price: '', category: '', description: '',
  imageUrl: '', isFeatured: false, isPopular: false,
  isNew: false, isChefSpecial: false, isHealthy: false,
};

// ==============================
// Toast мэдэгдэл
// ==============================
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border text-sm font-medium transition-all ${
      type === 'success'
        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
        : 'bg-red-500/10 border-red-500/30 text-red-300'
    }`}>
      {type === 'success'
        ? <CheckCircle className="w-4 h-4" />
        : <AlertTriangle className="w-4 h-4" />}
      {message}
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

// ==============================
// Зургийн preview
// ==============================
function ImagePreview({ url, name }) {
  const [err, setErr] = useState(false);
  useEffect(() => setErr(false), [url]);

  if (!url || err) {
    return (
      <div className="w-full h-full bg-slate-800 flex flex-col items-center justify-center gap-2">
        <ImageIcon className="w-8 h-8 text-slate-600" />
        <span className="text-slate-600 text-xs">Зураг байхгүй</span>
      </div>
    );
  }
  return (
    <img
      src={url} alt={name}
      className="w-full h-full object-cover"
      onError={() => setErr(true)}
    />
  );
}

// ==============================
// Tag Badge
// ==============================
function TagBadge({ tagKey }) {
  const tag = TAGS.find(t => t.key === tagKey);
  if (!tag) return null;
  const Icon = tag.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${tag.bg} ${tag.color}`}>
      <Icon className="w-2.5 h-2.5" />
      {tag.label}
    </span>
  );
}

// ==============================
// Confirm Dialog
// ==============================
function ConfirmDialog({ item, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-400" />
        </div>
        <h3 className="text-white font-bold text-center mb-1">Устгах уу?</h3>
        <p className="text-slate-400 text-sm text-center mb-6">
          <span className="text-white font-medium">"{item.name}"</span>-г устгахад буцаах боломжгүй.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-sm font-medium transition-all">
            Болих
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/20 rounded-xl text-sm font-medium transition-all">
            Устгах
          </button>
        </div>
      </div>
    </div>
  );
}

// ==============================
// Form Modal
// ==============================
function MenuFormModal({ editing, onSave, onClose }) {
  const [form, setForm]         = useState(editing ? { ...editing, price: String(editing.price) } : EMPTY_FORM);
  const [preview, setPreview]   = useState(false);
  const [errors, setErrors]     = useState({});
  const firstRef                = useRef(null);

  useEffect(() => { firstRef.current?.focus(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(e => ({ ...e, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())     e.name     = 'Нэр оруулна уу';
    if (!form.price)           e.price    = 'Үнэ оруулна уу';
    else if (Number(form.price) <= 0) e.price = 'Үнэ 0-ээс их байх ёстой';
    if (!form.category)        e.category = 'Ангилал сонгоно уу';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({ ...form, price: Number(form.price) });
  };

  const activeTags = TAGS.filter(t => form[t.key]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${editing ? 'bg-amber-500/20' : 'bg-amber-500/20'}`}>
              {editing ? <Edit2 className="w-4 h-4 text-amber-400" /> : <Plus className="w-4 h-4 text-amber-400" />}
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">{editing ? 'Хоол засах' : 'Шинэ хоол нэмэх'}</h3>
              {activeTags.length > 0 && (
                <div className="flex gap-1 mt-0.5">
                  {activeTags.map(t => <TagBadge key={t.key} tagKey={t.key} />)}
                </div>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-white/10 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
          <div className="p-6 space-y-5">

            {/* Зураг preview + URL */}
            <div className="flex gap-4">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 flex-shrink-0 bg-slate-800">
                <ImagePreview url={form.imageUrl} name={form.name} />
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-xs font-medium text-slate-400">Зургийн URL</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-white placeholder-slate-600 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition-all"
                />
                <p className="text-slate-600 text-xs">Unsplash эсвэл бусад зургийн URL оруулна уу</p>
              </div>
            </div>

            {/* Нэр + Үнэ */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Хоолны нэр *</label>
                <input
                  ref={firstRef}
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Жишээ: Итали пицца"
                  className={`w-full px-3 py-2.5 bg-white/5 border text-white placeholder-slate-600 rounded-xl text-sm focus:outline-none transition-all ${
                    errors.name ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-amber-500'
                  }`}
                />
                {errors.name && <p className="text-red-400 text-xs">{errors.name}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Үнэ (₮) *</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="18000"
                  min="0"
                  step="500"
                  className={`w-full px-3 py-2.5 bg-white/5 border text-white placeholder-slate-600 rounded-xl text-sm focus:outline-none transition-all ${
                    errors.price ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-amber-500'
                  }`}
                />
                {errors.price && <p className="text-red-400 text-xs">{errors.price}</p>}
              </div>
            </div>

            {/* Ангилал */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Ангилал *</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_LIST.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => { setForm(f => ({ ...f, category: cat })); if (errors.category) setErrors(e => ({ ...e, category: '' })); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      form.category === cat
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {errors.category && <p className="text-red-400 text-xs">{errors.category}</p>}
            </div>

            {/* Тайлбар */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Тайлбар</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Хоолны талаарх дэлгэрэнгүй тайлбар..."
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-white placeholder-slate-600 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition-all resize-none"
              />
            </div>

            {/* Тэмдэгүүд */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400">Тэмдэгүүд</label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {TAGS.map(tag => {
                  const Icon = tag.icon;
                  const active = form[tag.key];
                  return (
                    <button
                      key={tag.key}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, [tag.key]: !f[tag.key] }))}
                      className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border text-xs font-medium transition-all ${
                        active
                          ? `${tag.bg} ${tag.color}`
                          : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tag.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/10 flex gap-3 bg-slate-900/80 flex-shrink-0">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-sm font-medium transition-all">
              Болих
            </button>
            <button type="submit"
              className={`flex-1 py-2.5 font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all ${
                editing
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20'
                  : 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20'
              }`}>
              {editing ? <><Save className="w-4 h-4" /> Хадгалах</> : <><Plus className="w-4 h-4" /> Нэмэх</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==============================
// Menu Card (Grid view)
// ==============================
function MenuCard({ item, onEdit, onDelete }) {
  const activeTags = TAGS.filter(t => item[t.key]);

  return (
    <div className="group bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 flex flex-col">
      {/* Зураг */}
      <div className="relative h-44 bg-slate-800">
      <ImagePreview url={item.imageUrl} name={item.name} />
        {/* Үнэ badge */}
        <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md border border-white/10 text-amber-400 font-bold text-sm px-2.5 py-1 rounded-lg">
          {Number(item.price).toLocaleString()}₮
        </div>
        {/* Хурдан үйлдэл */}
        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">
          <button onClick={() => onEdit(item)}
            className="w-8 h-8 bg-slate-900/90 hover:bg-amber-500 border border-white/10 rounded-lg flex items-center justify-center text-slate-300 hover:text-white transition-all">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onDelete(item)}
            className="w-8 h-8 bg-slate-900/90 hover:bg-red-500 border border-white/10 rounded-lg flex items-center justify-center text-slate-300 hover:text-white transition-all">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
        {/* Tags */}
        {activeTags.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {activeTags.slice(0, 2).map(t => <TagBadge key={t.key} tagKey={t.key} />)}
          </div>
        )}
      </div>

      {/* Мэдээлэл */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-white font-bold text-sm leading-tight">{item.name}</h3>
        </div>
        <span className="inline-block text-[10px] text-slate-500 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full mb-2 w-fit">
          {item.category}
        </span>
        <p className="text-slate-500 text-xs line-clamp-2 flex-1">{item.description}</p>

        {/* Footer actions */}
        <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
          <button onClick={() => onEdit(item)}
            className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1">
            <Edit2 className="w-3 h-3" /> Засах
          </button>
          <button onClick={() => onDelete(item)}
            className="flex-1 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1">
            <Trash2 className="w-3 h-3" /> Устгах
          </button>
        </div>
      </div>
    </div>
  );
}

// ==============================
// Menu Row (List view)
// ==============================
function MenuRow({ item, onEdit, onDelete }) {
  const activeTags = TAGS.filter(t => item[t.key]);
  return (
    <div className="group flex items-center gap-4 p-4 bg-slate-900/50 border border-white/5 hover:border-white/10 rounded-2xl transition-all">
      {/* Зураг */}
      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0">
        <ImagePreview url={item.imageUrl} name={item.name} />
      </div>

      {/* Нэр + ангилал */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-white font-semibold text-sm">{item.name}</span>
          {activeTags.map(t => <TagBadge key={t.key} tagKey={t.key} />)}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-slate-500 text-xs">{item.category}</span>
          {item.description && (
            <>
              <span className="text-slate-700">·</span>
              <span className="text-slate-600 text-xs truncate max-w-xs">{item.description}</span>
            </>
          )}
        </div>
      </div>

      {/* Үнэ */}
      <div className="text-amber-400 font-bold text-sm flex-shrink-0">
        {Number(item.price).toLocaleString()}₮
      </div>

      {/* Үйлдэл */}
      <div className="flex gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all">
        <button onClick={() => onEdit(item)}
          className="w-8 h-8 bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/30 rounded-lg flex items-center justify-center text-slate-400 hover:text-amber-400 transition-all">
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onDelete(item)}
          className="w-8 h-8 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 transition-all">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ==============================
// Main MenuManagement
// ==============================
const MenuManagement = () => {
  const { items, upsertItem, removeItem } = useMenu();

  const [search,      setSearch]      = useState('');
  const [catFilter,   setCatFilter]   = useState('Бүгд');
  const [tagFilter,   setTagFilter]   = useState('');
  const [viewMode,    setViewMode]    = useState('grid'); // 'grid' | 'list'
  const [showForm,    setShowForm]    = useState(false);
  const [editing,     setEditing]     = useState(null);
  const [confirmItem, setConfirmItem] = useState(null);
  const [toast,       setToast]       = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const handleSave = useCallback((formData) => {
    upsertItem(formData);
    showToast(editing ? `"${formData.name}" шинэчлэгдлээ` : `"${formData.name}" нэмэгдлээ`);
    setShowForm(false);
    setEditing(null);
  }, [upsertItem, showToast, editing]);

  const handleEdit = useCallback((item) => {
    setEditing(item);
    setShowForm(true);
  }, []);

  const handleDeleteRequest = useCallback((item) => {
    setConfirmItem(item);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (!confirmItem) return;
    removeItem(confirmItem.id);
    showToast(`"${confirmItem.name}" устгагдлаа`, 'error');
    setConfirmItem(null);
  }, [confirmItem, removeItem, showToast]);

  // Шүүлтүүртэй жагсаалт
  const filtered = items.filter(item => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      item.name?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.category?.toLowerCase().includes(q);
    const matchCat = catFilter === 'Бүгд' || item.category === catFilter;
    const matchTag = !tagFilter || item[tagFilter];
    return matchSearch && matchCat && matchTag;
  });

  // Статистик
  const stats = {
    total:    items.length,
    featured: items.filter(i => i.isFeatured).length,
    popular:  items.filter(i => i.isPopular).length,
    newItems: items.filter(i => i.isNew).length,
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Цэсний удирдлага</h1>
          <p className="text-slate-400 text-sm mt-0.5">Нийт {stats.total} хоол</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 font-bold text-sm transition-all shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" /> Шинэ хоол нэмэх
        </button>
      </div>

      {/* Статистик */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Нийт',     value: stats.total,    color: 'text-white',          bg: 'bg-white/5',           border: 'border-white/10' },
          { label: 'Онцлох',   value: stats.featured, color: 'text-amber-400',      bg: 'bg-amber-500/5',       border: 'border-amber-500/15' },
          { label: 'Алдартай', value: stats.popular,  color: 'text-orange-400',     bg: 'bg-orange-500/5',      border: 'border-orange-500/15' },
          { label: 'Шинэ',     value: stats.newItems, color: 'text-blue-400',       bg: 'bg-blue-500/5',        border: 'border-blue-500/15' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-slate-500 text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Хайлт + Шүүлтүүр */}
      <div className="space-y-3">
        <div className="flex gap-3">
          {/* Хайлт */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Хоол хайх..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 text-white placeholder-slate-600 rounded-xl text-sm focus:outline-none focus:border-amber-500/50 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Шүүлтүүр товч */}
          <button
            onClick={() => setShowFilters(f => !f)}
            className={`px-3 py-2.5 border rounded-xl flex items-center gap-2 text-sm transition-all ${
              showFilters || catFilter !== 'Бүгд' || tagFilter
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Filter className="w-4 h-4" />
            Шүүлтүүр
            {(catFilter !== 'Бүгд' || tagFilter) && (
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
            )}
          </button>

          {/* View toggle */}
          <div className="flex bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2.5 transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2.5 transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Шүүлтүүр панел */}
        {showFilters && (
          <div className="bg-white/3 border border-white/8 rounded-2xl p-4 space-y-3">
            {/* Ангилал */}
            <div>
              <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide">Ангилал</p>
              <div className="flex flex-wrap gap-2">
                {['Бүгд', ...CATEGORY_LIST].map(cat => (
                  <button key={cat} onClick={() => setCatFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      catFilter === cat
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Тэмдэг */}
            <div>
              <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide">Тэмдэг</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setTagFilter('')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    !tagFilter ? 'bg-white/10 border-white/20 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}>
                  Бүгд
                </button>
                {TAGS.map(tag => {
                  const Icon = tag.icon;
                  return (
                    <button key={tag.key} onClick={() => setTagFilter(tagFilter === tag.key ? '' : tag.key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                        tagFilter === tag.key ? `${tag.bg} ${tag.color}` : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}>
                      <Icon className="w-3 h-3" />
                      {tag.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {(catFilter !== 'Бүгд' || tagFilter) && (
              <button
                onClick={() => { setCatFilter('Бүгд'); setTagFilter(''); }}
                className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-all"
              >
                <X className="w-3 h-3" /> Шүүлтүүр арилгах
              </button>
            )}
          </div>
        )}
      </div>

      {/* Үр дүн тоо */}
      {(search || catFilter !== 'Бүгд' || tagFilter) && (
        <p className="text-slate-500 text-sm">
          {filtered.length} үр дүн
          {search && <span className="text-slate-400"> — "<span className="text-white">{search}</span>"</span>}
        </p>
      )}

      {/* Жагсаалт */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-4">
            <Utensils className="w-8 h-8 text-slate-600" />
          </div>
          <p className="text-slate-400 font-medium mb-1">Хоол олдсонгүй</p>
          <p className="text-slate-600 text-sm">
            {search ? `"${search}" хайлтад тохирох хоол байхгүй` : 'Энэ ангилалд хоол байхгүй байна'}
          </p>
          {search && (
            <button onClick={() => setSearch('')}
              className="mt-3 px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl text-sm transition-all">
              Хайлт цэвэрлэх
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(item => (
            <MenuCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(item => (
            <MenuRow
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <MenuFormModal
          editing={editing}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      {/* Confirm Dialog */}
      {confirmItem && (
        <ConfirmDialog
          item={confirmItem}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setConfirmItem(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default MenuManagement;