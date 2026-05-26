// src/components/menu/MenuCategoryTabs.jsx
import React from 'react';
import { Utensils, Pizza, Soup, Salad, IceCream, Coffee, ChefHat, Fish, Beef } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ICON_MAP = {
  'Бүгд':        ChefHat,
  'Үндсэн хоол': Utensils,
  'Бургер':      Beef,
  'Салат':       Salad,
  'Амттан':      IceCream,
  'Шөл':         Soup,
  'Пицца':       Pizza,
  'Суши':        Fish,
  'Ундаа':       Coffee,
};

export default function MenuCategoryTabs({ selectedCategory, onSelectCategory, categories }) {
  const { isDark } = useTheme();

  const btnActive   = 'bg-white/[0.08] backdrop-blur-xl border-emerald-500/30 shadow-lg';
  const btnInactive = isDark
    ? 'bg-white/[0.02] backdrop-blur-md hover:bg-white/[0.06] border-white/10 hover:border-emerald-500/20'
    : 'bg-gray-50 backdrop-blur-md hover:bg-gray-100 border-gray-200 hover:border-emerald-300';
  const iconActive   = 'text-emerald-400';
  const iconInactive = isDark ? 'text-gray-400 group-hover:text-emerald-400' : 'text-gray-500 group-hover:text-emerald-500';
  const iconBoxActive   = isDark ? 'bg-emerald-500/20 border-emerald-500/50 scale-110' : 'bg-emerald-100 border-emerald-300 scale-110';
  const iconBoxInactive = isDark ? 'bg-white/5 border-white/10 group-hover:scale-110' : 'bg-white border-gray-200 group-hover:scale-110';
  const labelActive   = 'text-emerald-400';
  const labelInactive = isDark ? 'text-gray-400 group-hover:text-gray-200' : 'text-gray-500 group-hover:text-gray-700';

  return (
    <div className="mb-12">
      <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>Ангилал сонгох</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {(categories ?? []).map((cat) => {
          const Icon     = ICON_MAP[cat] ?? Utensils;
          const isActive = selectedCategory === cat;
          return (
            <button
              key={`tab-${cat}`}
              onClick={() => onSelectCategory(cat)}
              className={`group relative flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300 border ${
                isActive ? btnActive : btnInactive
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
                isActive ? iconBoxActive : iconBoxInactive
              }`}>
                <Icon className={`w-6 h-6 ${isActive ? iconActive : iconInactive}`} />
              </div>
              <span className={`text-center text-sm font-medium ${isActive ? labelActive : labelInactive}`}>
                {cat}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}