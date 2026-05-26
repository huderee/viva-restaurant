// src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, MapPin, Phone, Send, Twitter, Youtube } from 'lucide-react';

import logo from '../../assets/images/logo.png';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/vivarestaurantkhovd' },
  { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/vivarestaurant.mn/' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
  { name: 'Youtube', icon: Youtube, href: 'https://youtube.com' },
];

export default function Footer() {
  const { isDark } = useTheme();
  const { lang, t } = useLanguage();
  const isEn = lang === 'en';

  const footerBg = isDark ? 'bg-[#050403]' : 'bg-[#17110f]';
  const muted = 'text-stone-400';
  const linkClass = 'text-sm leading-6 text-stone-400 transition-colors hover:text-amber-300';
  const titleClass = 'text-base font-bold text-white';

  const mainLinks = [
    { label: t('nav.home'), to: '/' },
    { label: t('nav.menu'), to: '/menu' },
    { label: t('nav.reservation'), to: '/reservation' },
    { label: t('nav.careers'), to: '/careers' },
  ];

  const serviceLinks = [
    { label: isEn ? 'Book a table' : 'Ширээ захиалах', to: '/reservation' },
    { label: isEn ? 'VIP reservation' : 'VIP захиалга', to: '/reservation/vip' },
    { label: isEn ? 'My reservations' : 'Миний захиалга', to: '/reservation/my' },
    { label: isEn ? 'Open positions' : 'Ажлын байр', to: '/careers' },
  ];

  const helpLinks = [
    { label: t('footer.faq'), to: '/faq' },
    { label: t('footer.privacy'), to: '/privacy' },
    { label: t('footer.terms'), to: '/terms' },
  ];

  const copyText = t('footer.copy').replace('{year}', new Date().getFullYear());

  return (
    <footer className={`border-t border-white/10 ${footerBg}`}>
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:py-16">
        <div className="grid gap-11 md:grid-cols-2 lg:grid-cols-[1.3fr_0.75fr_1.05fr_1fr] lg:items-start">
          <div>
            <Link to="/" className="inline-flex items-center gap-4">
              <img src={logo} alt="Viva Restaurant" className="h-10 w-auto" />
              <span className="leading-tight">
                <span className="block text-xl font-black text-amber-300">Viva Restaurant</span>
                <span className="block text-xs text-stone-400">{t('footer.brand.sub')}</span>
              </span>
            </Link>

            <p className={`mt-5 max-w-sm text-sm leading-7 ${muted}`}>
              {t('footer.desc')}
            </p>

            <div className="mt-6 flex gap-3">
              {socialLinks.map(({ name, icon: Icon, href }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] text-stone-300 transition-colors hover:bg-amber-500 hover:text-black"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className={titleClass}>
              {t('footer.links')}
            </h3>
            <nav className="mt-6 grid gap-3">
              {mainLinks.map((item) => (
                <Link key={item.to} to={item.to} className={linkClass}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className={titleClass}>
              {t('footer.contact')}
            </h3>
            <div className="mt-6 grid gap-4">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Viva+Restaurant+Khovd"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-start gap-3 ${linkClass}`}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.05]">
                  <MapPin className="h-4 w-4 text-amber-400" />
                </span>
                <span>{t('footer.address.val')}</span>
              </a>
              <a href="tel:+97685292577" className={`flex items-center gap-3 ${linkClass}`}>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.05]">
                  <Phone className="h-4 w-4 text-amber-400" />
                </span>
                <span>+976 8529-2577</span>
              </a>
              <a href="mailto:info@vivarestaurant.mn" className={`flex items-center gap-3 ${linkClass}`}>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.05]">
                  <Mail className="h-4 w-4 text-purple-300" />
                </span>
                <span>info@vivarestaurant.mn</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className={titleClass}>
              {t('footer.help')}
            </h3>
            <nav className="mt-6 grid gap-3">
              {helpLinks.map((item) => (
                <Link key={item.to} to={item.to} className={linkClass}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-stone-500">{copyText}</p>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
            {serviceLinks.slice(0, 3).map((item) => (
              <Link key={item.to} to={item.to} className="text-stone-500 transition-colors hover:text-amber-300">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
