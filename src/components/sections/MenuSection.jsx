// src/components/sections/MenuSection.jsx
import React, { useState, useMemo } from 'react';
import { Utensils, Search, X, ShoppingCart as CartIcon } from 'lucide-react';
import MenuItem         from '../menu/MenuItem';
import MenuCategoryTabs from '../menu/MenuCategoryTabs';
import FeaturedMenu     from '../menu/FeaturedMenu';
import ShoppingCart     from '../cart/ShoppingCart';
import CartBottomBar    from '../cart/CartBottomBar';
import { useMenu }     from '../../contexts/MenuContext';
import { useCart }     from '../../contexts/CartContext';
import { useTheme }    from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import BackgroundGlow from '../ui/BackgroundGlow';

function MenuItemSkeleton({ isDark }) {
  const bg   = isDark ? 'bg-gray-900/50 border-white/10' : 'bg-gray-100 border-gray-200';
  const fill = isDark ? 'bg-white/5' : 'bg-gray-200';
  return (
    <div className={`border rounded-2xl overflow-hidden animate-pulse ${bg}`}>
      <div className={`h-48 ${fill}`} />
      <div className="p-5 space-y-3">
        <div className={`h-5 rounded-lg w-3/4 ${fill}`} />
        <div className={`h-3 rounded-lg w-1/2 ${fill}`} />
        <div className={`h-3 rounded-lg w-full ${fill}`} />
        <div className="flex gap-3 pt-2">
          <div className={`h-8 rounded-lg flex-1 ${fill}`} />
          <div className={`h-8 rounded-lg w-24 ${fill}`} />
        </div>
      </div>
    </div>
  );
}

function FloatingCartButton({ onClick, isDark, elevated }) {
  const { calculateTotalItems, calculateTotal } = useCart();
  const count = calculateTotalItems();
  const total = calculateTotal();
  if (count === 0) return null;
  return (
    <button
      onClick={onClick}
      className={`fixed right-4 z-30 flex items-center gap-3 rounded-full bg-stone-950 py-3 pl-4 pr-5 font-bold text-white shadow-xl shadow-stone-950/20 transition-all duration-200 hover:bg-amber-700 active:scale-95 sm:right-6 ${
        elevated ? 'bottom-24 sm:bottom-28' : 'bottom-6 sm:bottom-8'
      }`}
    >
      <div className="relative">
        <CartIcon className="w-5 h-5" />
        <span className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-white text-amber-600 rounded-full text-[10px] font-black flex items-center justify-center">
          {count}
        </span>
      </div>
      <span className="text-sm">{total.toLocaleString()}₮</span>
    </button>
  );
}

export default function MenuSection({ id }) {
  const { items, categories } = useMenu();
  const { isDark } = useTheme();
  const { t }      = useLanguage();
  const { openCart, calculateTotalItems } = useCart();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery,       setSearchQuery]       = useState('');

  const safeItems      = items      ?? [];
  const safeCategories = categories ?? [];
  const isLoading      = safeItems.length === 0;

  const popularItems = useMemo(
    () => safeItems.filter(i => i.isPopular || i.isFeatured),
    [safeItems]
  );

  const filteredMenuItems = useMemo(() => {
    let result = safeItems;
    if (selectedCategory !== null) result = result.filter(i => i.category === selectedCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(i =>
        i.name?.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q) ||
        i.category?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [selectedCategory, safeItems, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim()) setSelectedCategory(null);
  };

  const bg        = isDark ? 'bg-[#080705]' : 'bg-[#fbf8f4]';
  const titleText = isDark ? 'text-amber-100' : 'text-[#b57968]';
  const subText   = isDark ? 'text-stone-300' : 'text-stone-600';
  const searchCls = isDark
    ? 'bg-white/5 border-white/10 text-white placeholder-stone-500 focus:border-amber-500 focus:ring-amber-500/30'
    : 'bg-white border-stone-200 text-stone-900 placeholder-stone-400 shadow-sm focus:border-amber-500 focus:ring-amber-500/20';
  const clearBtn  = isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-700';
  const resultTxt = isDark ? 'text-slate-400' : 'text-gray-500';
  const emptyIcon = isDark ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200';
  const emptyText = isDark ? 'text-slate-400' : 'text-gray-500';
  const clearChip = isDark
    ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/20'
    : 'bg-amber-50 hover:bg-amber-100 text-amber-600 border-amber-200';

  const cartCount = calculateTotalItems();

  return (
    <section id={id} className={`relative overflow-hidden py-24 transition-colors duration-300 ${bg} ${cartCount > 0 ? 'pb-32' : ''}`}>
      {isDark && <BackgroundGlow />}
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6">

        {/* Header — зурггүй текст */}
        <div className="mb-14 text-center">
          <h2 className={`mb-3 font-serif text-4xl font-bold md:text-5xl ${titleText}`}>
            {t('menu.title')}
          </h2>
          <p className={`max-w-2xl mx-auto text-base md:text-lg ${subText}`}>
            {t('menu.subtitle')}
          </p>
        </div>

        {/* Search */}
        <div className="mx-auto mb-10 max-w-2xl">
          <div className="relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder={t('menu.search')}
              className={`w-full rounded-full border py-3.5 pl-11 pr-11 focus:outline-none focus:ring-1 transition-all ${searchCls}`}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${clearBtn}`}>
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {searchQuery.trim() && (
            <p className={`text-center text-sm mt-2 ${resultTxt}`}>
              <span className="text-amber-500 font-medium">"{searchQuery}"</span>
              {' '}— {filteredMenuItems.length} {t('menu.results')}
            </p>
          )}
        </div>

        {/* Featured */}
        {!searchQuery && selectedCategory === null && popularItems.length > 0 && (
          <FeaturedMenu featuredItems={popularItems} />
        )}

        {/* Category tabs */}
        {!searchQuery && (
          <MenuCategoryTabs
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            categories={safeCategories.map(c => c.name)}
          />
        )}

        {/* Items */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => <MenuItemSkeleton key={i} isDark={isDark} />)}
          </div>
        ) : (
          <div className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredMenuItems.map(item => <MenuItem key={item.id} item={item} />)}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filteredMenuItems.length === 0 && (
          <div className="text-center py-16">
            <div className={`w-24 h-24 backdrop-blur-md border rounded-full flex items-center justify-center mx-auto mb-4 ${emptyIcon}`}>
              <Utensils className={`w-12 h-12 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
            </div>
            <p className={`text-lg mb-2 ${emptyText}`}>
              {searchQuery
                ? t('menu.empty.search').replace('{q}', searchQuery)
                : t('menu.empty.cat')}
            </p>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className={`mt-3 px-4 py-2 border rounded-xl text-sm transition-all ${clearChip}`}>
                {t('menu.clear')}
              </button>
            )}
          </div>
        )}
      </div>

      <FloatingCartButton onClick={openCart} isDark={isDark} elevated={cartCount > 0} />
      <CartBottomBar />
      <ShoppingCart />
    </section>
  );
}