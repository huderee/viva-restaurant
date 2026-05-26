// src/components/sections/HomeSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays, Clock, MapPin, Utensils } from 'lucide-react';

import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import heroBg from '../../assets/images/hero-bg.jpg';
import diningArea from '../../assets/images/dining-area-2.png';
import chefImage from '../../assets/images/chef.png';
import wineGlasses from '../../assets/images/wine-glasses.jpg';

const dishImages = [
  'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=900&q=90',
  'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=900&q=90',
  'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=900&q=90',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&q=90',
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

function ActionButton({ to, children, tone = 'dark' }) {
  const base = 'inline-flex items-center justify-center gap-3 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 active:scale-95';
  const styles = tone === 'dark'
    ? 'bg-stone-950 text-white shadow-xl shadow-stone-950/10 hover:bg-amber-800'
    : 'bg-amber-600 text-white shadow-xl shadow-amber-700/20 hover:bg-amber-700';

  return (
    <Link to={to} className={`${base} ${styles}`}>
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

function LineAccent({ className = '' }) {
  return (
    <div className={`pointer-events-none absolute h-16 w-16 rotate-45 rounded-[1.25rem] border border-amber-700/35 ${className}`} />
  );
}

export default function HomeSection() {
  const { isDark } = useTheme();
  const { t, lang } = useLanguage();

  const surface = isDark ? 'bg-[#080705] text-stone-50' : 'bg-[#fbf8f4] text-slate-900';
  const muted = isDark ? 'text-stone-300' : 'text-slate-600';
  const softBand = isDark ? 'bg-[#11100d]' : 'bg-[#f2ece8]';
  const heading = isDark ? 'text-amber-100' : 'text-[#b57968]';
  const caption = lang === 'en'
    ? 'Lounge, dining and warm hospitality'
    : 'Лоунж, амт, халуун дулаан зочломтгой орчин';

  const categories = [
    { title: lang === 'en' ? 'Main Dishes' : 'Үндсэн хоол', count: '24', img: dishImages[1] },
    { title: lang === 'en' ? 'Fresh Salads' : 'Салат', count: '7', img: dishImages[3] },
    { title: lang === 'en' ? 'Warm Soups' : 'Шөл', count: '12', img: dishImages[0] },
    { title: lang === 'en' ? 'Shared Plates' : 'Хуваалцах сет', count: '18', img: dishImages[2] },
  ];

  return (
    <div className={`overflow-hidden transition-colors duration-500 ${surface}`}>
      <section id="home" className="relative min-h-screen pt-24 md:pt-32">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <LineAccent className="left-[7%] top-36 hidden md:block" />
        <LineAccent className="right-[12%] top-56 hidden md:block" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pb-14 sm:px-6 md:pb-20 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div variants={fadeUp} initial="hidden" animate="show" className="max-w-2xl">
            <h1 className={`font-serif text-5xl leading-[0.95] tracking-tight md:text-7xl ${heading}`}>
              {lang === 'en' ? 'An Ambient Dining Experience' : 'Амттай, тансаг оройн зоог'}
            </h1>
            <p className={`mt-7 max-w-xl text-base leading-8 md:text-lg ${muted}`}>
              {lang === 'en'
                ? 'Settle into a warm lounge atmosphere, taste carefully prepared dishes, and make the night feel unhurried.'
                : 'Тав тухтай лоунж орчинд амт чанартай хоол, анхааралтай үйлчилгээ, дурсамжтай мөчийг нэг дор мэдрээрэй.'}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ActionButton to="/reservation" tone="dark">{t('home.cta.book')}</ActionButton>
              <ActionButton to="/menu" tone="warm">{t('home.cta.menu')}</ActionButton>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="relative min-h-[420px] sm:min-h-[520px]"
          >
            <div className="absolute right-0 top-0 h-[360px] w-[82%] overflow-hidden rounded-bl-[4rem] rounded-tr-[3rem] shadow-2xl sm:h-[470px] sm:w-[72%] sm:rounded-bl-[7rem] sm:rounded-tr-[4rem]">
              <img src={diningArea} alt="Viva dining area" className="h-full w-full object-cover" />
            </div>
            <motion.div
              animate={{ y: [0, -14, 0], rotate: [0, 1.5, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-0 top-48 h-44 w-44 overflow-hidden rounded-full border-[8px] border-white shadow-2xl sm:left-4 sm:top-56 sm:h-60 sm:w-60 sm:border-[10px] md:left-0"
            >
              <img src={dishImages[0]} alt="Signature dish" className="h-full w-full object-cover" />
            </motion.div>
            <motion.div
              animate={{ y: [0, 12, 0], rotate: [0, -2, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute right-0 top-8 h-36 w-36 overflow-hidden rounded-full border-[8px] border-white shadow-2xl sm:top-10 sm:h-52 sm:w-52 sm:border-[10px]"
            >
              <img src={dishImages[1]} alt="Steak dish" className="h-full w-full object-cover" />
            </motion.div>
            <div className="absolute bottom-8 right-4 flex h-32 w-32 flex-col justify-between rounded-tl-[3.5rem] bg-stone-950 p-6 text-white shadow-2xl sm:bottom-6 sm:right-10 sm:h-36 sm:w-36 sm:rounded-tl-[4rem] sm:p-7">
              <Utensils className="h-6 w-6 text-amber-300" />
              <span className="font-serif text-2xl leading-6">
                {lang === 'en' ? 'Signature Plates' : 'Онцлох амт'}
              </span>
            </div>
          </motion.div>
        </div>

        <div className={`relative border-y ${isDark ? 'border-white/10' : 'border-stone-200'} ${softBand}`}>
          <div className="mx-auto grid max-w-7xl gap-5 px-5 py-7 sm:px-6 md:grid-cols-3">
            {[
              { icon: Clock, label: t('home.stat.hours.val'), sub: t('home.stat.hours') },
              { icon: MapPin, label: t('home.stat.loc.val'), sub: t('home.stat.loc') },
              { icon: CalendarDays, label: '+976 8529-2577', sub: lang === 'en' ? 'Reservations' : 'Захиалга' },
            ].map((item) => (
              <div key={item.sub} className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-700/10 text-amber-700">
                  <item.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-serif text-xl">{item.label}</p>
                  <p className={`text-xs uppercase tracking-[0.2em] ${muted}`}>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`relative py-24 md:py-32 ${softBand}`}>
        <LineAccent className="right-[16%] top-20 hidden md:block" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-2">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="relative min-h-[360px] sm:min-h-[430px]"
          >
            <img src={chefImage} alt="Chef special" className="absolute left-0 top-0 h-72 w-72 rounded-full object-cover shadow-2xl md:h-96 md:w-96" />
            <img
              src={wineGlasses}
              alt="Wine glasses"
              className="absolute bottom-0 right-0 h-44 w-60 rounded-tl-[4rem] rounded-br-[4rem] object-cover shadow-2xl md:h-60 md:w-80 md:rounded-tl-[5rem] md:rounded-br-[5rem]"
            />
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
            <p className={`mb-4 text-xs font-semibold uppercase tracking-[0.28em] ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
              {caption}
            </p>
            <h2 className={`font-serif text-4xl leading-tight md:text-6xl ${heading}`}>
              {lang === 'en' ? 'Finest flavors for every table' : 'Ширээ бүрт тохирох онцгой амт'}
            </h2>
            <p className={`mt-6 max-w-xl leading-8 ${muted}`}>
              {lang === 'en'
                ? 'From Mongolian comfort dishes to international favorites, each plate is prepared for guests who want dinner to feel special.'
                : 'Монгол уламжлалт амтаас олон улсын сонголт хүртэл, хоол бүрийг таны оройн зоогийг онцгой болгохоор бэлтгэдэг.'}
            </p>
          </motion.div>
        </div>
      </section>

      <section className={`relative py-20 md:py-28 ${softBand}`}>
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mb-14 text-center"
          >
            <p className={`mb-3 text-xs font-semibold uppercase tracking-[0.28em] ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
              {lang === 'en' ? 'Choose your mood' : 'Өнөөдрийн амтаа сонго'}
            </p>
            <h2 className={`font-serif text-4xl md:text-5xl ${heading}`}>
              {lang === 'en' ? 'Popular categories' : 'Онцлох төрлүүд'}
            </h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                className={`group relative pt-16 text-center ${index === 2 ? 'md:-mt-10' : ''}`}
              >
                <div className="block">
                  <div className="mx-auto h-44 w-44 overflow-hidden rounded-full shadow-xl transition-transform duration-500 group-hover:-translate-y-3 group-hover:scale-105">
                    <img src={category.img} alt={category.title} className="h-full w-full object-cover" />
                  </div>
                  <span className="mx-auto -mt-4 flex h-9 w-9 items-center justify-center bg-[#c59a8a] text-xs font-bold text-white shadow-lg">
                    {category.count}
                  </span>
                  <h3 className={`mt-6 font-serif text-2xl ${heading}`}>{category.title}</h3>
                  <p className={`mx-auto mt-3 max-w-[14rem] text-sm leading-6 ${muted}`}>
                    {lang === 'en' ? 'Freshly prepared selections for relaxed dining.' : 'Тав тухтай зоогт зориулсан шинэхэн сонголтууд.'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
