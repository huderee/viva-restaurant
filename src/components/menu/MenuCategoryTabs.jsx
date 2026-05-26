// src/components/menu/MenuCategoryTabs.jsx
import React from 'react';
import { Utensils, Pizza, Soup, Salad, IceCream, Coffee, ChefHat, Fish, Beef } from 'lucide-react';
import { useTheme }    from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { tCategory }   from './MenuItem';

// selectedCategory === null → "Бүгд / All"
// selectedCategory === 'Үндсэн хоол' гх мэт → тухайн ангилал

const CATEGORY_ICONS = {
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
  const { t }      = useLanguage();

  const btnActive   = isDark
    ? 'bg-white/[0.08] backdrop-blur-xl border-amber-500/30 shadow-lg'
    : 'bg-white border-amber-400 shadow-md';
  const btnInactive = isDark
    ? 'bg-white/[0.02] backdrop-blur-md hover:bg-white/[0.06] border-white/10 hover:border-amber-500/20'
    : 'bg-gray-50 backdrop-blur-md hover:bg-gray-100 border-gray-200 hover:border-amber-300';
  const iconBoxActive   = isDark ? 'bg-amber-500/20 border-amber-500/50 scale-110' : 'bg-amber-100 border-amber-300 scale-110';
  const iconBoxInactive = isDark ? 'bg-white/5 border-white/10 group-hover:scale-110' : 'bg-white border-gray-200 group-hover:scale-110';
  const labelActive   = 'text-amber-400';
  const labelInactive = isDark ? 'text-gray-400 group-hover:text-gray-200' : 'text-gray-500 group-hover:text-gray-700';

  // "Бүгд / All" товч + ангиллууд
  const allTab = { key: null, label: t('menu.all'), Icon: ChefHat };
  // 'Бүгд' / 'All' гэсэн ангиллыг хасна — бид өөрсдөө нэмнэ
  const catTabs = (categories ?? [])
    .filter(name => name !== 'Бүгд' && name !== 'All')
    .map(name => ({
      key: name,
      label: tCategory(t, name),
      Icon: CATEGORY_ICONS[name] ?? Utensils,
    }));
  const tabs = [allTab, ...catTabs];

  return (
    <div className="mb-12">
      <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>
        {t('menu.cat.title')}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {tabs.map(({ key, label, Icon }) => {
          const isActive = selectedCategory === key;
          return (
            <button
              key={`tab-${key ?? '__all__'}`}
              onClick={() => onSelectCategory(key)}
              className={`group relative flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300 border ${
                isActive ? btnActive : btnInactive
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
                isActive ? iconBoxActive : iconBoxInactive
              }`}>
                <Icon className={`w-6 h-6 ${isActive ? 'text-amber-400' : isDark ? 'text-gray-400 group-hover:text-amber-400' : 'text-gray-500 group-hover:text-amber-500'}`} />
              </div>
              <span className={`text-center text-sm font-medium ${isActive ? labelActive : labelInactive}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
