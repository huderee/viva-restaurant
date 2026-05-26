// src/components/sections/HomeSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
// Зургийг импортлох (Vite найдвартай ажиллуулна)
import heroBg from '../../assets/images/hero-bg.jpg';

export default function HomeSection() {
  const { isDark } = useTheme();

  // Light mode: тод, Dark mode: бараан
  const brightness = isDark ? 'brightness(0.4)' : 'brightness(0.9)';
  // Overlay-н эрчим
  const overlayOpacity = isDark ? 'bg-black/70' : 'bg-black/20';

  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      {/* Background зураг */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroBg})`,
            filter: brightness,
          }}
        />
        {/* Dynamic overlay */}
        <div className={`absolute inset-0 ${overlayOpacity}`} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/10 to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-24 font-serif">
              <p className="text-5xl md:text-6xl font-serif italic text-emerald-300 mb-2 tracking-widest font-light">
                HuuK Restaurant Танд
              </p>
              <h1 className="text-6xl md:text-8xl font-serif text-white/95 mb-6 tracking-tighter font-medium">
                Тансаг & Амтат Хоол
              </h1>
              <div className="max-w-3xl mx-auto mb-16">
                <p className="text-lg text-gray-300 leading-relaxed font-light italic">
                  Тав тухтай, тансаг орчинд, өндөр зэрэглэлийн үйлчилгээтэйгээр
                  хамгийн шилдэг хоол, коктейлүүдийг танд хүргэх төгс газар юм.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
                <Link
                  to="/order"
                  className="px-12 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl font-bold text-base uppercase tracking-wider transition-all duration-300 hover:scale-[1.05] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] active:scale-95 shadow-xl"
                >
                  ЦЭС ҮЗЭХ
                </Link>
                <Link
                  to="/reservation"
                  className="px-6 py-4 border-2 border-emerald-500 text-white rounded-2xl font-bold text-base uppercase tracking-wider transition-all duration-300 hover:scale-[1.05] hover:bg-emerald-600/10 hover:border-emerald-400 hover:text-emerald-400 active:scale-95 shadow-lg"
                >
                  ШИРЭЭ ЗАХИАЛАХ
                </Link>
              </div>
            </div>

            {/* Info cards - темед тохируулсан */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {[
                { value: '10:00 - 23:00', label: 'ЦАГИЙН ХУВААРЬ' },
                { value: 'Ховд, Жаргалант сум', label: 'БАЙРШИЛ' },
                { value: '5+ ОЛОН УЛСЫН', label: 'ШАГНАЛ' },
              ].map((card) => (
                <div
                  key={card.label}
                  className={`backdrop-blur-sm rounded-lg p-6 text-center shadow-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] ${
                    isDark
                      ? 'bg-black/40 border border-white/10 hover:bg-emerald-900/40'
                      : 'bg-white/30 border border-white/40 hover:bg-emerald-500/20'
                  }`}
                >
                  <div className="text-sm font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-2">
                    {card.value}
                  </div>
                  <p className={`text-xs uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                    {card.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
