import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Sun, Moon, Store } from 'lucide-react';

import { useCart } from '../../contexts/CartContext';
import { useTheme } from '../../contexts/ThemeContext';

import logo from '../../assets/images/logo.png';

export default function Header() {

  const { toggleCart, calculateTotalItems } = useCart();
  const { isDark, toggleTheme } = useTheme();

  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Нүүр', to: '/' },
    { name: 'Цэс', to: '/order' },
    { name: 'Ширээ захиалга', to: '/reservation' },
    { name: 'Бидний тухай', to: '/contact' }
  ];

  return (
    <header
      className={`fixed w-full z-50 transition-colors duration-300 ${
        isDark
          ? 'bg-black/60 border-white/10'
          : 'bg-white/90 border-gray-200 shadow-sm'
      } backdrop-blur-xl border-b`}
    >
      <div className="container mx-auto px-6">

        <div className="flex items-center justify-between py-3">

          {/* LOGO */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="logo" className="h-10" />

            <div className="ml-3">
              <div className="text-lg font-bold text-emerald-500">
                HuuK Restaurant
              </div>

              <div
                className={`text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                Дээд зэрэглэлийн хоолны газар
              </div>
            </div>
          </Link>

          {/* NAVIGATION */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  location.pathname === item.to
                    ? 'text-emerald-500 bg-emerald-500/10'
                    : isDark
                    ? 'text-gray-300 hover:bg-white/5'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-2">

            {/* ORDER BUTTON */}
            <button
              onClick={() => navigate('/order')}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-full text-sm font-bold"
            >
              <Store className="w-4 h-4" />
              Захиалга хийх
            </button>

            {/* THEME */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full border flex items-center justify-center"
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            {/* CART */}
            <button
              onClick={toggleCart}
              className="relative p-2"
            >
              <ShoppingBag className="w-5 h-5" />

              {calculateTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">
                  {calculateTotalItems()}
                </span>
              )}
            </button>

          </div>
        </div>

      </div>
    </header>
  );
}
