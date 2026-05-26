// src/components/sections/AboutSection.jsx
import React from 'react';
import { ChefHat, Leaf, Globe, Award, Sparkles, Heart, Clock, Shield } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function AboutSection() {
  const { isDark } = useTheme();

  const features = [
    { icon: ChefHat,  title: 'Мэргэжлийн тогооч', description: 'Олон улсын туршлагатай тогооч нар',  color: 'from-amber-500 to-orange-600' },
    { icon: Sparkles, title: 'Шинэ орц',           description: 'Өдөр бүр шинэхэн, чанартай орц',      color: 'from-emerald-500 to-green-600' },
    { icon: Award,    title: 'Шагналт',             description: 'Монголын шилдэг ресторан 2024',        color: 'from-purple-500 to-violet-600' },
    { icon: Clock,    title: 'Хурдан үйлчилгээ',   description: 'Таны цагийг хэмнэнэ',                 color: 'from-blue-500 to-cyan-600' },
    { icon: Heart,    title: 'Найрсаг орчин',       description: 'Тав тухтай, дулаахан уур амьсгал',    color: 'from-rose-500 to-pink-600' },
    { icon: Shield,   title: 'Эрүүл ахуй',          description: 'Олон улсын стандартад нийцсэн',       color: 'from-slate-500 to-slate-600' },
    { icon: Leaf,     title: 'Эко найрсаг',          description: 'Байгаль орчинд ээлтэй',              color: 'from-lime-500 to-green-600' },
    { icon: Globe,    title: 'Дэлхийн цэс',         description: '5 тивийн хоолны соёл',               color: 'from-indigo-500 to-blue-600' },
  ];

  const stats = [
    { value: '4+',   label: 'Жилийн туршлага',       grad: 'from-amber-400 to-orange-500' },
    { value: '50k+', label: 'Сэтгэл хангалуун зочид', grad: 'from-emerald-400 to-green-500' },
    { value: '100+', label: 'Өвөрмөц хоол',           grad: 'from-purple-400 to-violet-500' },
  ];

  const galleryImages = [
    { src: '/src/assets/images/chef.png',          alt: 'Тогооч',     className: 'h-72' },
    { src: '/src/assets/images/dining-area-2.png', alt: 'Ширээ',      className: 'h-64' },
    { src: '/src/assets/images/wine-glasses.jpg',  alt: 'Дарс',       className: 'h-56' },
    { src: '/src/assets/images/dining-area-1.jpg', alt: 'Орчин',      className: 'h-64' },
  ];

  // Theme classes
  const bg         = isDark ? 'bg-gradient-to-b from-black via-gray-900 to-black' : 'bg-gradient-to-b from-gray-50 via-white to-gray-50';
  const badgeBg    = isDark ? 'bg-white/[0.05] border-white/10' : 'bg-gray-100 border-gray-200';
  const badgeText  = isDark ? 'text-white' : 'text-gray-700';
  const headGrad   = isDark ? 'from-emerald-100 to-green-500' : 'from-emerald-700 to-green-500';
  const subText    = isDark ? 'text-emerald-100' : 'text-gray-600';
  const cardBg     = isDark ? 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10' : 'bg-white border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/50';
  const cardTitle  = isDark ? 'text-white' : 'text-gray-800';
  const cardDesc   = isDark ? 'text-slate-400' : 'text-gray-500';
  const divLine    = isDark ? 'border-gray-800' : 'border-gray-200';
  const storyBadge = isDark ? 'bg-white/10 border-white/20' : 'bg-emerald-50 border-emerald-200';
  const storyText  = isDark ? 'text-white' : 'text-emerald-700';
  const bodyText   = isDark ? 'text-slate-300' : 'text-gray-600';
  const statCard   = isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-gray-200 hover:bg-gray-50 shadow-sm';
  const statSub    = isDark ? 'text-slate-400' : 'text-gray-500';
  const imgBorder  = isDark ? 'border-white/10' : 'border-gray-200';
  const imgOverlay = isDark ? 'bg-black/20 group-hover:bg-black/10' : 'bg-black/10 group-hover:bg-black/5';

  return (
    <section className={`py-24 transition-colors duration-300 ${bg}`}>
      <div className="container mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <div className={`inline-flex items-center gap-2 backdrop-blur-xl border rounded-full px-5 py-2 mb-6 ${badgeBg}`}>
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className={badgeText}>Давуу тал</span>
          </div>
          <h2 className={`text-3xl md:text-5xl font-bold bg-gradient-to-r ${headGrad} bg-clip-text text-transparent mb-6`}>
            Яагаад HuuK Restaurant вэ?
          </h2>
          <p className={`max-w-2xl mx-auto ${subText}`}>
            Бид зочдоо хамгийн сайн туршлагаар хангахын тулд үргэлж чармайдаг
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className={`group relative p-6 rounded-2xl backdrop-blur-md border transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl ${cardBg}`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              <div className="relative z-10">
                <div className={`w-14 h-14 bg-gradient-to-br ${f.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg border border-white/10`}>
                  <f.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className={`mb-2 font-semibold ${cardTitle}`}>{f.title}</h3>
                <p className={`text-sm ${cardDesc}`}>{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`border-t my-16 mx-6 ${divLine}`} />

      {/* Story */}
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto pb-24">

          {/* Left */}
          <div className="order-2 lg:order-1">
            <div className={`inline-flex items-center gap-2 backdrop-blur-md border rounded-full px-5 py-2 mb-6 ${storyBadge}`}>
              <Heart className="w-4 h-4 text-amber-500" />
              <span className={storyText}>Манай түүх</span>
            </div>
            <h2 className={`text-4xl md:text-5xl mb-6 bg-gradient-to-r ${headGrad} bg-clip-text text-transparent leading-tight`}>
              Амт, соёл, уламжлал
            </h2>
            <p className={`mb-4 leading-relaxed text-lg ${bodyText}`}>
              HuuK Restaurant нь 2020 онд үүсгэн байгуулагдсан бөгөөд Монголын хамгийн шилдэг
              ресторануудын нэг болж чадсан юм.
            </p>
            <p className={`mb-8 leading-relaxed text-lg ${bodyText}`}>
              Манай мэргэжлийн тогооч нар олон улсын туршлагатай бөгөөд Монголын хоолны соёлыг
              өнөөгийн орчин үеийн стандарттай хослуулж чаддаг.
            </p>
            <div className="grid grid-cols-3 gap-6 mt-8">
              {stats.map((s, i) => (
                <div key={i} className={`text-center p-4 border rounded-xl transition-all duration-300 ${statCard}`}>
                  <div className={`text-3xl bg-gradient-to-r ${s.grad} bg-clip-text text-transparent mb-1 font-bold`}>
                    {s.value}
                  </div>
                  <div className={`text-xs ${statSub}`}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Gallery */}
          <div className="order-1 lg:order-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                {[galleryImages[0], galleryImages[2]].map((img, i) => (
                  <div key={i} className={`relative rounded-2xl overflow-hidden shadow-2xl group border ${imgBorder}`}>
                    <img src={img.src} alt={img.alt} className={`w-full ${img.className} object-cover group-hover:scale-110 transition-transform duration-500`} />
                    <div className={`absolute inset-0 transition-colors duration-500 ${imgOverlay}`} />
                  </div>
                ))}
              </div>
              <div className="pt-8 space-y-4">
                {[galleryImages[1], galleryImages[3]].map((img, i) => (
                  <div key={i} className={`relative rounded-2xl overflow-hidden shadow-2xl group border ${imgBorder}`}>
                    <img src={img.src} alt={img.alt} className={`w-full ${img.className} object-cover group-hover:scale-110 transition-transform duration-500`} />
                    <div className={`absolute inset-0 transition-colors duration-500 ${imgOverlay}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
