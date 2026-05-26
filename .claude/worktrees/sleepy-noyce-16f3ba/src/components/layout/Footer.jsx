// src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from 'lucide-react';
import logo from '../../assets/images/logo.png';
import { useTheme } from '../../contexts/ThemeContext';

const socialLinks = [
  { name: 'Facebook',  icon: <Facebook  className="w-5 h-5" />, href: 'https://www.facebook.com/huderee0211' },
  { name: 'Instagram', icon: <Instagram className="w-5 h-5" />, href: 'https://www.instagram.com/huderree/' },
  { name: 'Twitter',   icon: <Twitter   className="w-5 h-5" />, href: 'https://twitter.com/huukrestaurant' },
  { name: 'YouTube',   icon: <Youtube   className="w-5 h-5" />, href: 'https://www.youtube.com/@Huuhdeereeboy' },
];

export default function Footer() {
  const { isDark } = useTheme();

  const bg        = isDark ? 'bg-black border-white/10' : 'bg-gray-900 border-gray-700';
  const textMuted = isDark ? 'text-slate-400' : 'text-gray-400';
  const textWhite = isDark ? 'text-white' : 'text-gray-100';
  const divider   = isDark ? 'border-white/10' : 'border-gray-700';
  const socialBtn = isDark
    ? 'bg-white/5 hover:bg-gradient-to-br hover:from-emerald-500 hover:to-green-600'
    : 'bg-white/10 hover:bg-gradient-to-br hover:from-emerald-500 hover:to-green-600';
  const cardBg    = isDark ? 'bg-white/5 border-white/10' : 'bg-white/10 border-white/5';
  const headBar   = (color) => `w-1 h-6 bg-gradient-to-b ${color} rounded-full`;

  return (
    <footer className={`border-t pt-12 pb-8 relative overflow-hidden transition-colors duration-300 ${bg}`}>
      {/* Decorative bg */}
      <div className="absolute inset-0 opacity-10 -z-10">
        <div className="absolute top-10 right-10 w-96 h-96 bg-amber-500 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-500 rounded-full blur-3xl" />
      </div>

      <div className="w-full px-6 py-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center group">
              <img src={logo} alt="HuuK" className="h-12 w-auto group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg" />
              <div className="ml-3 leading-tight">
                <span className="block text-xl font-black bg-gradient-to-r from-emerald-400 via-emerald-300 to-green-400 bg-clip-text text-transparent">
                  HuuK Restaurant
                </span>
                <span className="text-xs text-gray-400 block leading-none">Дээд зэрэглэлийн хоолны газар</span>
              </div>
            </Link>
            <p className={`leading-relaxed ${textMuted}`}>
              Монголын шилдэг амттай хоолнууд таныг хүлээж байна. Дэлхийн соёлыг нэгтгэсэн онцгой туршлага.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((item) => (
                <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer"
                  className={`w-10 h-10 ${socialBtn} rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 text-gray-300 hover:text-white`}>
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className={`mb-6 flex items-center gap-2 font-bold ${textWhite}`}>
              <div className={headBar('from-amber-500 to-orange-600')} />
              Холбоосууд
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Нүүр',           to: '/' },
                { name: 'Цэс',            to: '/order' },
                { name: 'Ширээ захиалга', to: '/reservation' },
                { name: 'Бидний тухай',   to: '/contact' },
              ].map(item => (
                <li key={item.name}>
                  <Link to={item.to} className={`hover:text-amber-400 transition-colors flex items-center gap-2 group ${textMuted}`}>
                    <span className="w-0 group-hover:w-2 h-0.5 bg-amber-400 transition-all duration-300" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className={`mb-6 flex items-center gap-2 font-bold ${textWhite}`}>
              <div className={headBar('from-emerald-500 to-green-600')} />
              Холбоо барих
            </h3>
            <ul className="space-y-4">
              {[
                { icon: MapPin, color: 'text-emerald-400', hover: 'group-hover:bg-emerald-500', title: 'Хаяг',  sub: 'Ховд, Жаргалант сум, Жаргалан баг' },
                { icon: Phone,  color: 'text-amber-400',   hover: 'group-hover:bg-amber-500',   title: 'Утас',  sub: '+976 8529-2577' },
                { icon: Mail,   color: 'text-purple-400',  hover: 'group-hover:bg-purple-500',  title: 'Имэйл', sub: 'info@huukool.mn' },
              ].map(row => (
                <li key={row.title} className="flex items-start gap-3 group">
                  <div className={`w-8 h-8 bg-white/5 ${row.hover} rounded-lg flex items-center justify-center transition-all`}>
                    <row.icon className={`w-4 h-4 ${row.color} group-hover:text-white`} />
                  </div>
                  <div>
                    <div className={`text-sm ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>{row.title}</div>
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-300'}`}>{row.sub}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className={`mb-6 flex items-center gap-2 font-bold ${textWhite}`}>
              <div className={headBar('from-purple-500 to-violet-600')} />
              Ажлын цаг
            </h3>
            <div className="space-y-3 text-sm">
              {[
                { day: 'Даваа - Баасан', time: '10:00 - 23:00', dot: 'text-amber-400' },
                { day: 'Бямба - Ням',   time: '10:00 - 00:00', dot: 'text-emerald-400' },
              ].map(row => (
                <div key={row.day} className={`${cardBg} rounded-xl p-4 border flex justify-between items-center`}>
                  <div>
                    <span className={`block mb-1 ${textMuted}`}>{row.day}</span>
                    <span className={textWhite}>{row.time}</span>
                  </div>
                  <span className={row.dot}>●</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4 ${divider}`}>
          <p className={`text-xs ${textMuted}`}>
            © {new Date().getFullYear()} HuuK Restaurant. Бүх эрх хуулиар хамгаалагдсан.
          </p>
        </div>
      </div>
    </footer>
  );
}
