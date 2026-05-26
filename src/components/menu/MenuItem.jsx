import React, { useState, useEffect, useMemo } from 'react';
import { useCart }  from '../../contexts/CartContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Plus, Minus, Star, X, ShoppingCart, Flame, Sparkles, Award, Leaf, ChevronRight, Check } from 'lucide-react';

// ─── Category translation map: DB stores Mongolian → resolves to t(key)
const CATEGORY_KEY = {
  'Үндсэн хоол': 'cat.main',
  'Бургер':      'cat.burger',
  'Салат':       'cat.salad',
  'Амттан':      'cat.dessert',
  'Шөл':         'cat.soup',
  'Пицца':       'cat.pizza',
  'Суши':        'cat.sushi',
  'Ундаа':       'cat.drink',
};
export const tCategory = (t, name) => {
  const key = CATEGORY_KEY[name];
  return key ? t(key) : name;
};

// ─── Tag config — labels are translation KEYS, resolved via t() at render ────
const TAG_CONFIG = {
  isPopular:     { key: 'tag.popular',  icon: Flame,    color: 'text-orange-500', bg: 'bg-orange-500/10 border-orange-400/30' },
  isFeatured:    { key: 'tag.featured', icon: Star,     color: 'text-amber-500',  bg: 'bg-amber-500/10 border-amber-400/30' },
  isNew:         { key: 'tag.new',      icon: Sparkles, color: 'text-blue-500',   bg: 'bg-blue-500/10 border-blue-400/30' },
  isChefSpecial: { key: 'tag.chef',     icon: Award,    color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-400/30' },
  isHealthy:     { key: 'tag.healthy',  icon: Leaf,     color: 'text-amber-500',  bg: 'bg-amber-500/10 border-amber-400/30' },
};

// Default removable ingredients per category
const DEFAULT_INGREDIENTS = {
  'Бургер':     ['Сонгино', 'Кетчуп', 'Өргөст хэмх', 'Байцаа', 'Майонез', 'Горчиц'],
  'Пицца':      ['Чили', 'Сонгино', 'Өргөст хэмх', 'Тун загас'],
  'Салат':      ['Сонгино', 'Өргөст хэмх', 'Чили', 'Кракер'],
  'Суши':       ['Авокадо', 'Кунжут', 'Тост'],
  'Үндсэн хоол':['Сонгино', 'Самар', 'Ногоо'],
};

// Default extras per category
const DEFAULT_EXTRAS = {
  'Бургер': [
    { id: 'cheese',  name: 'Нэмэлт бяслаг', price: 700,  emoji: '🧀' },
    { id: 'bacon',   name: 'Бэйкон',         price: 1200, emoji: '🥓' },
    { id: 'jalapeno',name: 'Халапеньо',       price: 500,  emoji: '🌶️' },
    { id: 'egg',     name: 'Өндөг',           price: 800,  emoji: '🍳' },
  ],
  'Пицца': [
    { id: 'cheese',  name: 'Нэмэлт бяслаг', price: 900,  emoji: '🧀' },
    { id: 'pepperoni',name: 'Пепперони',     price: 1500, emoji: '🍕' },
    { id: 'mushroom',name: 'Мөөг',           price: 700,  emoji: '🍄' },
  ],
  'Салат': [
    { id: 'chicken', name: 'Тахиа',          price: 1500, emoji: '🍗' },
    { id: 'egg',     name: 'Өндөг',          price: 500,  emoji: '🥚' },
    { id: 'crouton', name: 'Кракер',         price: 400,  emoji: '🍞' },
  ],
};

function TagBadge({ tagKey }) {
  const { t } = useLanguage();
  const cfg = TAG_CONFIG[tagKey];
  if (!cfg) return null;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold border text-[10px] ${cfg.bg} ${cfg.color}`}>
      <Icon className="w-2.5 h-2.5" /> {t(cfg.key)}
    </span>
  );
}

// ─── Customization Modal ──────────────────────────────────────────────────────
function MenuItemModal({ item, onClose, onAdd, onRemove, quantity, isDark }) {
  const { t } = useLanguage();
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [qty, setQty]           = useState(Math.max(quantity, 1));

  const ingredients = useMemo(() =>
    item.ingredients ?? DEFAULT_INGREDIENTS[item.category] ?? [],
  [item]);
  const [removed, setRemoved] = useState(new Set());

  const extraOptions = useMemo(() =>
    item.extras ?? DEFAULT_EXTRAS[item.category] ?? [],
  [item]);
  const [selectedExtras, setSelectedExtras] = useState({});

  const extraTotal = useMemo(() =>
    Object.entries(selectedExtras).reduce((s, [id, on]) => {
      if (!on) return s;
      const ex = extraOptions.find(e => e.id === id);
      return s + (ex?.price ?? 0);
    }, 0),
  [selectedExtras, extraOptions]);

  const totalPrice = (Number(item.price) + extraTotal) * qty;

  const fallback = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
  const imageUrl = imgError ? fallback : item.imageUrl;

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [onClose]);

  const toggleIngredient = (ing) => {
    setRemoved(prev => {
      const next = new Set(prev);
      next.has(ing) ? next.delete(ing) : next.add(ing);
      return next;
    });
  };

  const toggleExtra = (id) => {
    setSelectedExtras(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddToCart = () => {
    const customized = {
      ...item,
      removedIngredients: [...removed],
      addedExtras: extraOptions.filter(e => selectedExtras[e.id]),
      customPrice: Number(item.price) + extraTotal,
    };
    for (let i = 0; i < qty; i++) onAdd(customized);
    onClose();
  };

  const modalBg  = isDark ? 'bg-gray-900'       : 'bg-[#F5EFE6]';
  const titleCls = isDark ? 'text-white'         : 'text-[#2a1f0e]';
  const descCls  = isDark ? 'text-gray-400'      : 'text-[#7a6a55]';
  const secLabel = isDark ? 'text-gray-200'      : 'text-[#2a1f0e]';
  const ingActive  = isDark
    ? 'border-gray-600 text-gray-300 hover:bg-white/5'
    : 'border-[#c5b89a] text-[#4a3a28] hover:bg-black/5';
  const ingRemoved = isDark
    ? 'border-red-500/40 bg-red-500/10 text-red-400 line-through'
    : 'border-red-400/40 bg-red-50 text-red-400 line-through';
  const cardBase = isDark
    ? 'bg-gray-800 border-gray-700 hover:border-amber-400'
    : 'bg-white border-[#e0d5c5] hover:border-[#c5a96a]';
  const cardSel  = isDark
    ? 'border-amber-400 bg-amber-500/10'
    : 'border-amber-500 bg-[#fefce8]';
  const qtyBg    = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#d5c9b5]';
  const qtyBtn   = isDark ? 'border-gray-600 text-gray-300 hover:bg-white/10' : 'border-[#c5b89a] text-[#4a3a28] hover:bg-[#e8dece]';

  const activeTags = Object.keys(TAG_CONFIG).filter(k => item[k]);
  const hasIngredients = ingredients.length > 0;
  const hasExtras      = extraOptions.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className={`relative w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col sm:flex-row max-h-[92vh] ${modalBg}`}
        style={{ animation: 'slideUp 0.25s ease' }}>

        <button onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 dark:bg-gray-700 border border-black/10 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white transition-all">
          <X className="w-4 h-4" />
        </button>

        <div className={`relative sm:w-[42%] flex-shrink-0 flex items-center justify-center p-8 ${isDark ? 'bg-gray-800' : 'bg-[#ede5d8]'}`}>
          {!imgLoaded && <div className="absolute inset-0 animate-pulse bg-gray-700" />}
          <img
            src={imageUrl}
            alt={item.name}
            onError={() => setImgError(true)}
            onLoad={() => setImgLoaded(true)}
            className={`w-full max-w-[260px] object-contain transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ filter: 'drop-shadow(0 10px 24px rgba(0,0,0,0.22))' }}
          />
          {item.isPopular && (
            <span className="absolute top-3 left-3 bg-amber-500 text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Star className="w-3 h-3 fill-white" /> {t('tag.popular')}
            </span>
          )}
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto p-6 gap-4 pb-4">
          <div>
            <span className={`text-xs px-2.5 py-1 rounded-full border mb-2 inline-block ${isDark ? 'border-gray-700 text-gray-400 bg-white/5' : 'border-[#d5c9b5] text-[#7a6a55] bg-white/60'}`}>
              {tCategory(t, item.category)}
            </span>
            <h2 className={`font-semibold text-xl mb-1.5 ${titleCls}`}>{item.name}</h2>
            {activeTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {activeTags.map(k => <TagBadge key={k} tagKey={k} />)}
              </div>
            )}
            {item.description
              ? <p className={`text-sm leading-relaxed ${descCls}`}>{item.description}</p>
              : <p className={`text-sm italic ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{t('menu.no.desc')}</p>
            }
          </div>

          {hasIngredients && (
            <div>
              <p className={`text-sm font-semibold mb-2.5 ${secLabel}`}>{t('menu.remove.ing')}</p>
              <div className="flex flex-wrap gap-2">
                {ingredients.map(ing => (
                  <button
                    key={ing}
                    onClick={() => toggleIngredient(ing)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm transition-all ${removed.has(ing) ? ingRemoved : ingActive}`}
                  >
                    {ing}
                    <span className={`text-xs ml-0.5 ${removed.has(ing) ? 'opacity-60' : 'opacity-50'}`}>✕</span>
                  </button>
                ))}
              </div>
              {removed.size > 0 && (
                <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-[#9a8670]'}`}>
                  {t('menu.removed').replace('{n}', removed.size)}
                </p>
              )}
            </div>
          )}

          {hasExtras && (
            <div>
              <p className={`text-sm font-semibold mb-2.5 ${secLabel}`}>{t('menu.add.ing')}</p>
              <div className="grid gap-2.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))' }}>
                {extraOptions.map(ex => {
                  const sel = !!selectedExtras[ex.id];
                  return (
                    <div
                      key={ex.id}
                      onClick={() => toggleExtra(ex.id)}
                      className={`relative border rounded-xl p-2.5 text-center cursor-pointer transition-all flex flex-col items-center gap-1.5 ${cardBase} ${sel ? cardSel : ''}`}
                    >
                      {sel && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                      <span className="text-2xl leading-none">{ex.emoji}</span>
                      <p className={`text-[11px] leading-tight font-medium ${isDark ? 'text-gray-300' : 'text-[#4a3a28]'}`}>{ex.name}</p>
                      <p className={`text-[11px] ${isDark ? 'text-gray-500' : 'text-[#7a6a55]'}`}>+{ex.price.toLocaleString()}₮</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {extraTotal > 0 && (
            <div className={`rounded-xl px-3 py-2.5 text-xs space-y-1 ${isDark ? 'bg-white/5' : 'bg-white/60'}`}>
              <div className={`flex justify-between ${isDark ? 'text-gray-400' : 'text-[#7a6a55]'}`}>
                <span>{t('menu.base.price')}</span>
                <span>{Number(item.price).toLocaleString()}₮</span>
              </div>
              {extraOptions.filter(e => selectedExtras[e.id]).map(e => (
                <div key={e.id} className={`flex justify-between ${isDark ? 'text-gray-400' : 'text-[#7a6a55]'}`}>
                  <span>+ {e.name}</span>
                  <span>+{e.price.toLocaleString()}₮</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 mt-auto pt-2">
            <div className={`flex items-center gap-3 border rounded-full px-4 py-2 flex-shrink-0 ${qtyBg}`}>
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${qtyBtn}`}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className={`text-base font-semibold min-w-[18px] text-center ${isDark ? 'text-white' : 'text-[#2a1f0e]'}`}>{qty}</span>
              <button
                onClick={() => setQty(q => q + 1)}
                className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${qtyBtn}`}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 py-3.5 bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white font-semibold rounded-full flex items-center justify-center gap-2 text-sm transition-all shadow-lg shadow-amber-600/25"
            >
              <ShoppingCart className="w-4 h-4" />
              {totalPrice.toLocaleString()}₮ — {t('menu.add.cart')}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(24px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── MenuItem Card with 3D Tilt ────────────────────────────────────────────────
export default function MenuItem({ item }) {
  const { addToCart, removeFromCart, cart } = useCart();
  const { isDark } = useTheme();
  const { t }      = useLanguage();
  const [loaded,    setLoaded]    = useState(false);
  const [imgError,  setImgError]  = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const quantity = cart
    .filter(c => String(c.baseId ?? c.menuItemId ?? c.id) === String(item.id))
    .reduce((sum, c) => sum + (Number(c.quantity) || 0), 0);
  const fallback = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
  const imageUrl = imgError ? fallback : item.imageUrl;

  const cardBg   = isDark
    ? 'bg-gray-900 border-gray-800 hover:border-amber-500/40 hover:shadow-[0_8px_30px_rgba(245,158,11,0.12)]'
    : 'bg-white border-gray-200 hover:border-amber-400/50 hover:shadow-lg';
  const titleCls  = isDark ? 'text-white group-hover:text-amber-400' : 'text-gray-900 group-hover:text-amber-600';
  const descCls   = isDark ? 'text-gray-500' : 'text-gray-400';
  const catBadge  = isDark ? 'border-white/10 text-gray-500 bg-white/5' : 'border-gray-200 text-gray-400 bg-gray-50';
  const skeletonBg = isDark ? 'bg-gray-800' : 'bg-gray-200';
  const minusBg   = isDark ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white' : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700';

  // 3D Tilt handlers
  const handleMouseMove = (e) => {
    if (window.innerWidth < 768) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -10, y: x * 10 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <>
      <article
        onClick={() => setShowModal(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.1s ease-out, box-shadow 0.3s ease, border-color 0.3s ease'
        }}
        className={`group border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col ${cardBg} hover:shadow-2xl hover:shadow-amber-500/10`}
      >
        <div className="relative h-44 flex-shrink-0 overflow-hidden bg-gray-200">
          {!loaded && <div className={`absolute inset-0 animate-pulse ${skeletonBg}`} />}
          <img
            src={imageUrl} alt={item.name} loading="lazy"
            onLoad={() => setLoaded(true)} onError={() => setImgError(true)}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="bg-black/60 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 flex items-center gap-1.5 text-white text-xs font-medium">
              <ChevronRight className="w-3 h-3" /> {t('menu.detail')}
            </div>
          </div>

          {item.isPopular && (
            <span className="absolute top-2.5 right-2.5 bg-amber-500 text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 z-10">
              <Star className="w-3 h-3 fill-white" /> {t('tag.popular')}
            </span>
          )}

          <div className="absolute bottom-2.5 left-3 z-10">
            <span className="text-white font-bold text-base">{Number(item.price).toLocaleString()}₮</span>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className={`font-semibold text-sm mb-1 line-clamp-1 transition-colors ${titleCls}`}>
            {item.name}
          </h3>
          <p className={`text-xs line-clamp-2 mb-3 flex-1 ${descCls}`}>
            {item.description}
          </p>

          <div className="flex items-center justify-between mt-auto" onClick={e => e.stopPropagation()}>
            <span className={`text-xs px-2.5 py-1 rounded-full border ${catBadge}`}>
              {tCategory(t, item.category)}
            </span>
            {quantity > 0 ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => removeFromCart(item.id)}
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${minusBg}`}
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className={`w-6 text-center text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{quantity}</span>
                <button
                  onClick={() => setShowModal(true)}
                  className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center transition-all shadow-md shadow-amber-500/30"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); setShowModal(true); }}
                className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-all shadow-md shadow-amber-500/30"
              >
                <Plus className="w-3 h-3" /> {t('menu.add')}
              </button>
            )}
          </div>
        </div>
      </article>

      {showModal && (
        <MenuItemModal
          item={item}
          isDark={isDark}
          onClose={() => setShowModal(false)}
          onAdd={addToCart}
          onRemove={() => removeFromCart(item.id)}
          quantity={quantity}
        />
      )}
    </>
  );
}
