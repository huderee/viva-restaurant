// src/components/menu/FeaturedMenu.jsx
import React from 'react';
import MenuItem from './MenuItem';
import { useTheme }    from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';

// selectedCategory prop-г арилгасан — MenuSection дотор null шалгаж харуулах/нуух шийдэнэ
export default function FeaturedMenu({ featuredItems }) {
  const { isDark } = useTheme();
  const { t }      = useLanguage();

  if (!featuredItems?.length) return null;

  return (
    <div className="mb-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-8 bg-gradient-to-b from-amber-500 to-yellow-600 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
        <h3 className={`text-2xl font-serif ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {t('menu.featured')}
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {featuredItems.slice(0, 3).map(item => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
