// src/components/menu/FeaturedMenu.jsx
import React from 'react';
import MenuItem from './MenuItem';
import { useTheme } from '../../contexts/ThemeContext';

export default function FeaturedMenu({ featuredItems, selectedCategory }) {
  const { isDark } = useTheme();

  if (selectedCategory !== 'Бүгд' || !featuredItems?.length) return null;

  return (
    <div className="mb-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-8 bg-gradient-to-b from-emerald-500 to-green-600 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
        <h3 className={`text-2xl font-serif ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Онцлох хоолнууд
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