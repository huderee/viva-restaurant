// src/components/sections/MenuSection.jsx
import React, { useState, useMemo } from 'react';
import { Utensils, Search, X } from 'lucide-react';
import MenuItem         from '../menu/MenuItem';
import MenuCategoryTabs from '../menu/MenuCategoryTabs';
import FeaturedMenu     from '../menu/FeaturedMenu';
import { useMenu }  from '../../contexts/MenuContext';
import { useTheme } from '../../contexts/ThemeContext';

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

export default function MenuSection({ id }) {
  const { items, categories } = useMenu();
  const { isDark } = useTheme();

  const [selectedCategory, setSelectedCategory] = useState('Бүгд');
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
    if (selectedCategory !== 'Бүгд') result = result.filter(i => i.category === selectedCategory);
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
    if (e.target.value.trim()) setSelectedCategory('Бүгд');
  };

  // Theme
  const bg        = isDark ? 'bg-gradient-to-b from-black via-gray-900 to-black' : 'bg-gradient-to-b from-gray-50 via-white to-gray-50';
  const badgeBg   = isDark ? 'bg-white/[0.05] border-white/10' : 'bg-gray-100 border-gray-200';
  const badgeText = isDark ? 'text-white' : 'text-gray-700';
  const titleText = isDark ? 'text-white' : 'text-gray-900';
  const subText   = isDark ? 'text-gray-400' : 'text-gray-500';
  const searchCls = isDark
    ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-emerald-500/30'
    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400 shadow-sm focus:border-emerald-500 focus:ring-emerald-500/20';
  const clearBtn  = isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-700';
  const resultTxt = isDark ? 'text-slate-400' : 'text-gray-500';
  const emptyIcon = isDark ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200';
  const emptyText = isDark ? 'text-slate-400' : 'text-gray-500';
  const clearChip = isDark
    ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-200';

  return (
    <section id={id} className={`py-24 transition-colors duration-300 ${bg}`}>
      <div className="container max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-16">
          <div className={`inline-flex items-center gap-2 backdrop-blur-xl border rounded-full px-5 py-2 mb-6 ${badgeBg}`}>
            <Utensils className="w-4 h-4 text-emerald-400" />
            <span className={`text-sm font-medium ${badgeText}`}>Цэс</span>
          </div>
          <h2 className={`font-serif font-bold text-4xl md:text-5xl mb-4 ${titleText}`}>
            Манай цэс
          </h2>
          <p className={`max-w-2xl mx-auto text-base md:text-lg ${subText}`}>
            Дэлхийн болон орон нутгийн амттай хоолнууд
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Хоол хайх... (нэр, ангилал)"
              className={`w-full pl-11 pr-11 py-3 border rounded-2xl focus:outline-none focus:ring-1 transition-all ${searchCls}`}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${clearBtn}`}>
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {searchQuery.trim() && (
            <p className={`text-center text-sm mt-2 ${resultTxt}`}>
              <span className="text-emerald-500 font-medium">"{searchQuery}"</span>
              {' '}— {filteredMenuItems.length} үр дүн
            </p>
          )}
        </div>

        {/* Featured */}
        {!searchQuery && selectedCategory === 'Бүгд' && popularItems.length > 0 && (
          <FeaturedMenu featuredItems={popularItems} selectedCategory={selectedCategory} />
        )}

        {/* Category tabs */}
        {!searchQuery && (
          <MenuCategoryTabs
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            categories={['Бүгд', ...safeCategories.map(c => c.name)]}
          />
        )}

        {/* Loading */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <MenuItemSkeleton key={i} isDark={isDark} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
            {filteredMenuItems.map(item => <MenuItem key={item.id} item={item} />)}
          </div>
        )}

        {/* Empty */}
        {!isLoading && filteredMenuItems.length === 0 && (
          <div className="text-center py-16">
            <div className={`w-24 h-24 backdrop-blur-md border rounded-full flex items-center justify-center mx-auto mb-4 ${emptyIcon}`}>
              <Utensils className={`w-12 h-12 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
            </div>
            <p className={`text-lg mb-2 ${emptyText}`}>
              {searchQuery ? `"${searchQuery}" хайлтад тохирох хоол олдсонгүй` : 'Энэ ангилалд хоол байхгүй байна'}
            </p>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className={`mt-3 px-4 py-2 border rounded-xl text-sm transition-all ${clearChip}`}>
                Хайлт цэвэрлэх
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}