// src/components/sections/AboutSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Quote, Star } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { RESTAURANT_IMAGES } from '../../assets/images/restaurantImages';

const { loungeGarden, diningHall, barLounge } = RESTAURANT_IMAGES;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

function LineAccent({ className = '' }) {
  return (
    <div className={`pointer-events-none absolute h-16 w-16 rotate-45 rounded-[1.25rem] border border-amber-700/35 ${className}`} />
  );
}

export default function AboutSection() {
  const { isDark } = useTheme();
  const { lang, t } = useLanguage();

  const surface = isDark ? 'bg-[#080705] text-stone-50' : 'bg-white text-slate-900';
  const muted = isDark ? 'text-stone-300' : 'text-slate-600';
  const heading = isDark ? 'text-amber-100' : 'text-[#b57968]';

  return (
    <section id="about" className={`relative overflow-hidden py-20 md:py-32 ${surface}`}>
      <LineAccent className="left-[44%] top-28 hidden md:block" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-[0.85fr_1.15fr]">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
          <p className={`mb-4 text-xs font-semibold uppercase tracking-[0.28em] ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
            {t('about.story.badge')}
          </p>
          <h2 className={`font-serif text-4xl leading-tight md:text-6xl ${heading}`}>
            {lang === 'en' ? 'Tradition and warm evenings' : 'Уламжлал ба дулаан үдшүүд'}
          </h2>
          <p className={`mt-7 leading-8 ${muted}`}>{t('about.story.p1')}</p>
          <p className={`mt-4 leading-8 ${muted}`}>{t('about.story.p3')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 35 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="relative min-h-[390px] overflow-hidden sm:min-h-[520px]"
        >
          <div className="absolute left-0 top-14 h-60 w-[58%] overflow-hidden rounded-tl-[3.5rem] rounded-br-[3.5rem] shadow-2xl sm:top-16 sm:h-72 sm:rounded-tl-[5rem] sm:rounded-br-[5rem]">
            <img src={loungeGarden} alt="Restaurant lounge" className="h-full w-full object-cover" />
          </div>
          <div className="absolute right-0 top-0 h-72 w-[62%] overflow-hidden rounded-tr-[4rem] shadow-2xl sm:right-2 sm:h-80 sm:rounded-tr-[5rem]">
            <img src={diningHall} alt="Dining room" className="h-full w-full object-cover" />
          </div>
          <motion.div
            animate={{ y: [0, -12, 0], rotate: [0, 1.5, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-3 right-3 h-40 w-40 overflow-hidden rounded-full border-[8px] border-white shadow-2xl sm:bottom-4 sm:right-8 sm:h-56 sm:w-56 sm:border-[10px]"
          >
            <img src={barLounge} alt="Bar lounge" className="h-full w-full object-cover" />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="mx-auto mt-20 max-w-4xl px-5 text-center sm:px-6 md:mt-24"
      >
        <div className="mb-5 flex justify-center gap-1 text-[#b57968]">
          {[1, 2, 3, 4, 5].map((n) => <Star key={n} className="h-4 w-4 fill-current" />)}
        </div>
        <Quote className={`mx-auto mb-5 h-9 w-9 ${isDark ? 'text-amber-300/70' : 'text-[#b57968]/70'}`} />
        <h3 className={`font-serif text-2xl md:text-3xl ${heading}`}>
          {lang === 'en' ? 'A favorite place for calm dinners and celebrations.' : 'Тайван оройн зоог, баярт мөчүүдийн дуртай газар.'}
        </h3>
        <p className={`mx-auto mt-5 max-w-2xl leading-8 ${muted}`}>
          {lang === 'en'
            ? 'The service feels thoughtful, the atmosphere is warm, and every visit has its own little occasion.'
            : 'Үйлчилгээ нь анхааралтай, орчин нь дулаан, ирэх бүрт өөрийн гэсэн онцгой мэдрэмж төрүүлдэг.'}
        </p>
        <div className="mt-10 flex items-center justify-center gap-12">
          <ArrowLeft className={`h-6 w-6 ${muted}`} aria-hidden="true" />
          <p className={`text-sm ${muted}`}>Viva Restaurant</p>
          <ArrowRight className={`h-6 w-6 ${muted}`} aria-hidden="true" />
        </div>
      </motion.div>
    </section>
  );
}
