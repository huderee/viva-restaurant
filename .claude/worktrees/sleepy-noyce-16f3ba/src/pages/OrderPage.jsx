// src/pages/OrderPage.jsx
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  Search, X, ChefHat, Utensils, Pizza, Soup, Salad,
  IceCream, Coffee, Fish, Beef, Truck, Store, MapPin,
  ChevronDown, ShoppingBag
} from 'lucide-react';

import { useMenu } from '../contexts/MenuContext';
import { useTheme } from '../contexts/ThemeContext';
import { useCart } from '../contexts/CartContext';
import MenuItem from '../components/menu/MenuItem';
import ShoppingCart from '../components/cart/ShoppingCart'; // ✅ Сагсыг импортлох

// Icon mapping
const ICON_MAP = {
  'Бүгд': ChefHat,
  'Үндсэн хоол': Utensils,
  'Бургер': Beef,
  'Салат': Salad,
  'Амттан': IceCream,
  'Шөл': Soup,
  'Пицца': Pizza,
  'Суши': Fish,
  'Ундаа': Coffee,
};

// Skeleton loader
const Skeleton = ({ isDark }) => {
  const bg = isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const fill = isDark ? 'bg-gray-800' : 'bg-gray-200';
  return (
    <div className={`border rounded-2xl overflow-hidden animate-pulse ${bg}`}>
      <div className={`h-44 ${fill}`} />
      <div className="p-4 space-y-2">
        <div className={`h-4 rounded w-3/4 ${fill}`} />
        <div className={`h-3 rounded w-1/2 ${fill}`} />
        <div className={`h-8 rounded-lg mt-3 ${fill}`} />
      </div>
    </div>
  );
};

export default function OrderPage() {
  const { items, categories, loading: menuLoading } = useMenu();
  const { isDark } = useTheme();
  const { cart, addToCart, removeFromCart, clearCart } = useCart(); // Сагсны функцууд

  // Order type & branch
  const [orderType, setOrderType] = useState('pickup');
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [showBranchMenu, setShowBranchMenu] = useState(false);

  const branches = [
    { id: 1, name: 'Жаргалант салбар', address: 'Жаргалант сум, Ховд' },
    { id: 2, name: 'Төв салбар', address: 'Ховд хот, төв талбай' },
  ];

  useEffect(() => {
    if (!selectedBranch && branches.length > 0) setSelectedBranch(branches[0]);
  }, []);

  // Сагсны нээх/хаах төлөв
  const [cartOpen, setCartOpen] = useState(false);

  const cartCount = cart.reduce((s, i) => s + (i.quantity ?? i.qty ?? 0), 0);

  // UI state
  const [activeCategory, setActiveCategory] = useState('Бүгд');
  const [searchQuery, setSearchQuery] = useState('');

  const dropdownRef = useRef(null);
  const sectionRefs = useRef({});
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowBranchMenu(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const safeItems = items ?? [];
  const safeCategories = categories ?? [];
  const isLoading = menuLoading !== undefined ? menuLoading : safeItems.length === 0;

  const allCategories = useMemo(() => {
    const catNames = safeCategories.map(c => c.name);
    return ['Бүгд', ...catNames.filter(n => n !== 'Бүгд')];
  }, [safeCategories]);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return safeItems;
    const q = searchQuery.toLowerCase().trim();
    return safeItems.filter(i =>
      i.name?.toLowerCase().includes(q) ||
      i.description?.toLowerCase().includes(q) ||
      i.category?.toLowerCase().includes(q)
    );
  }, [safeItems, searchQuery]);

  const groupedByCategory = useMemo(() => {
    if (searchQuery.trim()) return null;
    const groups = {};
    allCategories.filter(c => c !== 'Бүгд').forEach(cat => {
      const catItems = safeItems.filter(i => i.category === cat);
      if (catItems.length > 0) groups[cat] = catItems;
    });
    return groups;
  }, [safeItems, allCategories, searchQuery]);

  const scrollToCategory = useCallback((cat) => {
    setActiveCategory(cat);
    setSearchQuery('');
    if (cat === 'Бүгд') {
      containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = sectionRefs.current[cat];
    if (el) containerRef.current?.scrollTo({ top: el.offsetTop - 110, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) return;
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      if (container.scrollTop < 30) { setActiveCategory('Бүгд'); return; }
      const pos = container.scrollTop + 180;
      let current = 'Бүгд';
      allCategories.filter(c => c !== 'Бүгд').forEach(cat => {
        const el = sectionRefs.current[cat];
        if (el && el.offsetTop <= pos) current = cat;
      });
      setActiveCategory(current);
    };
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [allCategories, searchQuery]);

  useEffect(() => { if (searchQuery.trim()) setActiveCategory('Бүгд'); }, [searchQuery]);

  // Styles
  const pageBg = isDark ? 'bg-gray-950' : 'bg-gray-50';
  const sectionTitleCls = isDark ? 'text-white' : 'text-gray-900';
  const headerBg = isDark ? 'bg-gray-900 border-white/10' : 'bg-white border-gray-200';
  const sidebarBg = isDark ? 'bg-gray-900 border-white/10' : 'bg-white border-gray-200';

  return (
    <>
      <div className={`flex flex-col h-screen pt-14 md:pt-[104px] ${pageBg}`}>

        {/* ORDER TYPE & BRANCH BAR */}
        <div className={`border-b ${headerBg}`}>
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
            {/* Order type buttons */}
            <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setOrderType('pickup')}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold transition ${
                  orderType === 'pickup'
                    ? 'bg-emerald-500 text-white'
                    : isDark ? 'bg-transparent text-gray-400 hover:text-white' : 'bg-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Store className="w-4 h-4" /> Очиж авах
              </button>
              <div className="w-px bg-gray-200 dark:bg-gray-700" />
              <button
                onClick={() => setOrderType('delivery')}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold transition ${
                  orderType === 'delivery'
                    ? 'bg-emerald-500 text-white'
                    : isDark ? 'bg-transparent text-gray-400 hover:text-white' : 'bg-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Truck className="w-4 h-4" /> Хүргэлт
              </button>
            </div>

            {/* Branch dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowBranchMenu(!showBranchMenu)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm transition ${
                  isDark ? 'border-gray-700 text-gray-300 hover:border-emerald-500/50' : 'border-gray-200 text-gray-700 hover:border-emerald-400'
                }`}
              >
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span className="font-medium">{selectedBranch?.name || 'Салбар сонгох'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showBranchMenu ? 'rotate-180' : ''}`} />
              </button>
              {showBranchMenu && (
                <div className={`absolute mt-2 w-64 rounded-xl shadow-xl z-50 overflow-hidden border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                  {branches.map(branch => (
                    <button
                      key={branch.id}
                      onClick={() => { setSelectedBranch(branch); setShowBranchMenu(false); }}
                      className={`w-full text-left px-4 py-3 transition flex items-start gap-3 ${
                        selectedBranch?.id === branch.id
                          ? isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
                          : isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <MapPin className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-sm">{branch.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{branch.address}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar (desktop) */}
          <aside className={`hidden md:flex flex-col w-60 flex-shrink-0 border-r overflow-y-auto ${sidebarBg}`}>
            <div className="p-3 space-y-0.5">
              {allCategories.map(cat => {
                const Icon = ICON_MAP[cat] ?? Utensils;
                const isActive = activeCategory === cat && !searchQuery;
                const count = cat === 'Бүгд' ? safeItems.length : safeItems.filter(i => i.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => scrollToCategory(cat)}
                    className={`w-full text-left px-3 py-2.5 text-sm font-medium rounded-xl transition-all flex items-center gap-3 group ${
                      isActive
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                        : isDark
                          ? 'text-gray-400 hover:text-white hover:bg-white/5'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1 truncate">{cat}</span>
                    <span className={`text-xs rounded-full px-1.5 py-0.5 font-medium tabular-nums ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : isDark ? 'bg-white/10 text-gray-500' : 'bg-gray-100 text-gray-400'
                    }`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Main scroll area */}
          <main ref={containerRef} className="flex-1 overflow-y-auto pb-32 md:pb-24">
            <div className="max-w-5xl mx-auto px-4 py-6">

              {/* Search */}
              <div className="relative mb-6 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Хоол хайх..."
                  className={`w-full pl-12 pr-12 py-3 rounded-2xl border text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition ${
                    isDark ? 'bg-gray-900 border-white/10 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-800'
                  }`}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2">
                    <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              {/* Mobile category tabs */}
              <div className="md:hidden flex gap-2 overflow-x-auto pb-3 mb-5 no-scrollbar">
                {allCategories.map(cat => {
                  const isActive = activeCategory === cat && !searchQuery;
                  return (
                    <button
                      key={`mob-${cat}`}
                      onClick={() => scrollToCategory(cat)}
                      className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                        isActive
                          ? 'bg-emerald-500 text-white'
                          : isDark ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-white text-gray-600 border border-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Loading */}
              {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => <Skeleton key={i} isDark={isDark} />)}
                </div>
              )}

              {/* Search results */}
              {!isLoading && searchQuery.trim() && (
                <>
                  <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    "<span className="text-emerald-500 font-medium">{searchQuery}</span>" — {filteredItems.length} үр дүн
                  </p>
                  {filteredItems.length === 0 ? (
                    <div className="text-center py-20">
                      <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Тохирох хоол олдсонгүй</p>
                      <button onClick={() => setSearchQuery('')} className="mt-4 text-emerald-500 hover:underline text-sm">
                        Хайлт цэвэрлэх
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filteredItems.map(item => (
                        <MenuItem key={item.id} item={item} />
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Grouped by category */}
              {!isLoading && !searchQuery.trim() && groupedByCategory && (
                <div className="space-y-12">
                  {Object.entries(groupedByCategory).map(([cat, catItems]) => (
                    <section key={cat} ref={el => { sectionRefs.current[cat] = el; }}>
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-1 h-7 bg-emerald-500 rounded-full" />
                        <h2 className={`text-xl font-bold ${sectionTitleCls}`}>{cat}</h2>
                        <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>({catItems.length})</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {catItems.map(item => (
                          <MenuItem key={item.id} item={item} />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Mobile bottom bar */}
        {!isLoading && (
          <div className={`fixed bottom-0 left-0 right-0 z-40 md:hidden border-t px-4 py-4 ${isDark ? 'bg-gray-950 border-white/10' : 'bg-white border-gray-200'}`}>
            <button
              onClick={() => setCartOpen(true)}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 text-base shadow-xl shadow-emerald-600/30 transition active:scale-[0.98]"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 ? (
                <>Сагс харах <span className="bg-white text-emerald-600 rounded-full px-2 py-0.5 text-xs font-bold">{cartCount}</span></>
              ) : (
                'Захиалга хийх'
              )}
            </button>
          </div>
        )}
      </div>

      {/* ✅ Сагсны дүүргэлт - ShoppingCart компонент */}
      <ShoppingCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}