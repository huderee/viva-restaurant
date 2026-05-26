// src/components/layout/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, LogIn, LogOut, Calendar, ChevronDown, Menu, X } from 'lucide-react';

import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

import logo from '../../assets/images/logo.png';
import flagMN from '../../assets/images/mongolia.jpg';
import flagEN from '../../assets/images/english.png';

export default function Header() {
  const { isDark, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMenuOpen(false);
    setMobileOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const navItems = [
    { key: 'nav.home', to: '/' },
    { key: 'nav.menu', to: '/menu' },
    { key: 'nav.careers', to: '/careers' },
    { key: 'nav.reservation', to: '/reservation' },
  ];

  const handleNavClick = (to) => {
    setMobileOpen(false);
    if (!to.includes('#')) return;
    const [, hash] = to.split('#');
    window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const initials = (user?.name || user?.username || '?')
    .split(' ')
    .map(s => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const headerTone = isDark
    ? 'bg-[#090806]/82 border-white/10'
    : 'bg-[#fffaf5]/92 border-stone-200 shadow-sm';
  const panelTone = isDark
    ? 'border-white/10 bg-[#11100d]/95'
    : 'border-stone-200 bg-white/95';

  const renderNavLink = (item, mobile = false) => {
    const active = item.to.includes('#')
      ? location.pathname === '/' && location.hash === item.to.slice(1)
      : location.pathname === item.to && !location.hash;

    if (mobile) {
      return (
        <Link
          key={item.key}
          to={item.to}
          onClick={() => handleNavClick(item.to)}
          className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
            active
              ? 'bg-amber-600 text-white'
              : isDark
              ? 'text-stone-200 hover:bg-white/5'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          {t(item.key)}
        </Link>
      );
    }

    return (
      <Link
        key={item.key}
        to={item.to}
        onClick={() => handleNavClick(item.to)}
        className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
          active
            ? 'text-amber-400'
            : isDark
            ? 'text-stone-300 hover:bg-white/5 hover:text-white'
            : 'text-stone-600 hover:bg-stone-100 hover:text-stone-950'
        }`}
      >
        {t(item.key)}
        {active && (
          <span className="absolute -bottom-0.5 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500" />
        )}
      </Link>
    );
  };

  return (
    <header className={`fixed z-50 w-full border-b backdrop-blur-xl transition-colors duration-300 ${headerTone}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between py-3">
          <Link to="/" className="group flex min-w-0 items-center">
            <img src={logo} alt="Viva Restaurant" className={`h-9 w-auto transition-transform duration-300 group-hover:scale-105 ${isDark ? '' : 'invert'}`} />
            <div className="ml-3 min-w-0 leading-tight">
              <div className={`truncate text-base font-bold transition-colors sm:text-lg ${isDark ? 'text-amber-300 group-hover:text-amber-200' : 'text-stone-950 group-hover:text-amber-800'}`}>
                Viva Restaurant
              </div>
              <div className={`hidden text-xs sm:block ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                Lounge & Karaoke
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map(item => renderNavLink(item))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-3 sm:flex">
              <button
                onClick={() => lang !== 'mn' && toggleLang()}
                title="Монгол"
                className={`transition-all duration-200 ${lang === 'mn' ? 'scale-110 opacity-100' : 'opacity-45 hover:scale-105 hover:opacity-80'}`}
              >
                <img src={flagMN} alt="MN" className="h-3 w-5 rounded-sm object-cover shadow-sm" />
              </button>
              <button
                onClick={() => lang !== 'en' && toggleLang()}
                title="English"
                className={`transition-all duration-200 ${lang === 'en' ? 'scale-110 opacity-100' : 'opacity-45 hover:scale-105 hover:opacity-80'}`}
              >
                <img src={flagEN} alt="EN" className="h-3 w-5 rounded-sm object-cover shadow-sm" />
              </button>
            </div>

            <button
              onClick={toggleTheme}
              className={`relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border transition-all duration-300 active:scale-90 ${
                isDark
                  ? 'border-white/15 text-amber-300 hover:border-amber-400/50 hover:bg-white/5 hover:text-amber-200'
                  : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400 hover:text-stone-950'
              }`}
              aria-label="Toggle theme"
            >
              <span key={isDark ? 'sun' : 'moon'} className="inline-flex animate-theme-pop">
                {isDark ? <Sun size={14} /> : <Moon size={14} />}
              </span>
            </button>

            {!isAuthenticated ? (
              <Link
                to="/login"
                state={{ from: location.pathname }}
                className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-amber-600/20 transition-all hover:from-amber-600 hover:to-yellow-700 active:scale-95 sm:px-4"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Нэвтрэх</span>
              </Link>
            ) : (
              <div ref={dropdownRef} className="relative ml-1">
                <button
                  onClick={() => setMenuOpen(o => !o)}
                  className={`flex items-center gap-2 rounded-full border py-1 pl-1 pr-2 transition-all ${
                    isDark
                      ? 'border-white/10 hover:border-amber-400/50 hover:bg-white/5'
                      : 'border-stone-200 bg-white hover:border-amber-400/60 hover:bg-amber-50/60'
                  }`}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 text-xs font-bold text-white shadow-md">
                    {initials}
                  </span>
                  <span className={`hidden text-sm font-medium sm:inline ${isDark ? 'text-stone-200' : 'text-stone-800'}`}>
                    {user?.name?.split(' ')[0] || user?.username}
                  </span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${menuOpen ? 'rotate-180' : ''} ${isDark ? 'text-stone-400' : 'text-stone-500'}`} />
                </button>

                {menuOpen && (
                  <div className={`absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border shadow-xl backdrop-blur-xl animate-fade-scale ${panelTone}`}>
                    <div className={`border-b px-4 py-3 ${isDark ? 'border-white/10' : 'border-stone-100'}`}>
                      <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-stone-950'}`}>{user?.name}</p>
                      <p className={`truncate text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>{user?.email}</p>
                      <span className="mt-1.5 inline-block rounded-full border border-amber-500/30 bg-amber-500/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-amber-500">
                        {user?.role === 'admin' ? 'Админ' : user?.role === 'staff' ? 'Ажилтан' : 'Хэрэглэгч'}
                      </span>
                    </div>
                    <Link
                      to="/reservation/my"
                      className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${isDark ? 'text-stone-200 hover:bg-white/5' : 'text-stone-700 hover:bg-stone-50'}`}
                    >
                      <Calendar className="h-4 w-4" />
                      Миний захиалга
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors ${isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'}`}
                    >
                      <LogOut className="h-4 w-4" />
                      Гарах
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setMobileOpen(o => !o)}
              className={`ml-1 flex h-9 w-9 items-center justify-center rounded-full border transition-all md:hidden ${
                isDark
                  ? 'border-white/15 text-stone-200 hover:bg-white/10'
                  : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-100'
              }`}
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className={`mb-3 rounded-2xl border p-2 shadow-xl md:hidden ${panelTone}`}>
            <nav className="grid gap-1">
              {navItems.map(item => renderNavLink(item, true))}
            </nav>
            <div className={`mt-2 flex items-center justify-between border-t px-3 pt-3 ${isDark ? 'border-white/10' : 'border-stone-100'}`}>
              <span className={`text-xs font-semibold uppercase tracking-[0.18em] ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                Language
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => lang !== 'mn' && toggleLang()}
                  title="Монгол"
                  className={`transition-all duration-200 ${lang === 'mn' ? 'scale-110 opacity-100' : 'opacity-45 hover:opacity-80'}`}
                >
                  <img src={flagMN} alt="MN" className="h-3 w-5 rounded-sm object-cover shadow-sm" />
                </button>
                <button
                  onClick={() => lang !== 'en' && toggleLang()}
                  title="English"
                  className={`transition-all duration-200 ${lang === 'en' ? 'scale-110 opacity-100' : 'opacity-45 hover:opacity-80'}`}
                >
                  <img src={flagEN} alt="EN" className="h-3 w-5 rounded-sm object-cover shadow-sm" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
