// src/components/sections/ReservationSection.jsx
import React, { useState, useRef, useEffect } from 'react';
import { CalendarIcon, ClockIcon, Users, Mail, Phone, MapPin } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const GUEST_OPTIONS = [...Array(10).keys()].map(n => `${n + 1}`);

const saveReservationLocally = (data) => {
  try {
    const existing = JSON.parse(localStorage.getItem('huuk_reservations') || '[]');
    const reservation = { ...data, _id: `local_${Date.now()}`, status: 'pending', createdAt: new Date().toISOString(), synced: false };
    existing.push(reservation);
    localStorage.setItem('huuk_reservations', JSON.stringify(existing));
    return reservation;
  } catch { return null; }
};

export default function ReservationSection() {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', date: '', time: '', guests: '', message: '' });
  const [status,      setStatus]      = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firstInputRef = useRef(null);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!isSubmitting && firstInputRef.current) firstInputRef.current.focus();
  }, [isSubmitting]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (status.text) setStatus({ type: '', text: '' });
  };

  const submitReservation = async (payload) => {
    try {
      const res = await fetch('/api/reservations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(`${res.status}`);
      return { ok: true, source: 'api' };
    } catch {
      saveReservationLocally(payload);
      return { ok: true, source: 'local' };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', text: '' });
    const { name, phone, date, time, guests } = formData;
    if (!name || !phone || !date || !time || !guests) {
      setStatus({ type: 'error', text: 'Бүх шаардлагатай талбаруудыг бөглөнө үү.' });
      setIsSubmitting(false); return;
    }
    if (!/^[0-9]{8}$/.test(phone)) {
      setStatus({ type: 'error', text: 'Утасны дугаар 8 оронтой байх ёстой.' });
      setIsSubmitting(false); return;
    }
    const result = await submitReservation({ ...formData, guests: Number(guests) || guests });
    if (result.ok) {
      setStatus({ type: 'success', text: result.source === 'local' ? 'Захиалга бүртгэгдлээ. Бид удахгүй утсаар холбогдоно.' : 'Захиалга амжилттай илгээгдлээ.' });
      setFormData({ name: '', phone: '', email: '', date: '', time: '', guests: '', message: '' });
    } else {
      setStatus({ type: 'error', text: 'Захиалга илгээхэд алдаа гарлаа.' });
    }
    setIsSubmitting(false);
  };

  // Theme classes
  const bg        = isDark ? 'bg-gradient-to-b from-black via-gray-900 to-black' : 'bg-gradient-to-b from-gray-50 via-white to-gray-50';
  const badgeBg   = isDark ? 'bg-white/[0.05] border-white/10' : 'bg-gray-100 border-gray-200';
  const badgeText = isDark ? 'text-white' : 'text-gray-700';
  const titleGrad = isDark ? 'from-emerald-400 to-green-500' : 'from-emerald-700 to-green-500';
  const subText   = isDark ? 'text-gray-400' : 'text-gray-500';
  const card      = isDark ? 'bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl' : 'bg-white border border-gray-200 rounded-3xl p-8 shadow-md';
  const cardTitle = isDark ? 'text-white' : 'text-gray-800';
  const labelCls  = isDark ? 'text-white font-medium block' : 'text-gray-700 font-medium block';
  const inputCls  = isDark
    ? 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition'
    : 'w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition';
  const rowBg     = isDark ? 'bg-white/5' : 'bg-white border border-gray-100';
  const rowText   = isDark ? 'text-white' : 'text-gray-700';
  const timeColor = isDark ? 'text-emerald-300' : 'text-emerald-600';
  const ruleText  = isDark ? 'text-gray-300' : 'text-gray-600';
  const workCard  = isDark
    ? 'p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-green-700/10 backdrop-blur-xl border border-emerald-500/30 shadow-xl'
    : 'p-8 rounded-3xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 shadow-md';
  const iconBg    = isDark ? 'bg-gradient-to-br from-emerald-500/30 to-green-700/30' : 'bg-emerald-100';
  const iconColor = isDark ? 'text-white' : 'text-emerald-600';
  const contactRowBg = isDark ? 'bg-white/5' : 'bg-gray-50';
  const contactTitle = isDark ? 'text-white' : 'text-gray-700';
  const contactSub   = isDark ? 'text-gray-400' : 'text-gray-500';

  return (
    <section id="reservation" className={`py-24 transition-colors duration-300 ${bg}`}>
      <div className="container mx-auto px-6 max-w-6xl">

        {/* Title */}
        <div className="text-center mb-16">
          <div className={`inline-flex items-center gap-2 backdrop-blur-xl border rounded-full px-5 py-2 mb-6 ${badgeBg}`}>
            <CalendarIcon className="w-4 h-4 text-emerald-400" />
            <span className={`font-medium ${badgeText}`}>Захиалга</span>
          </div>
          <h2 className={`text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r ${titleGrad} bg-clip-text text-transparent`}>
            Ширээ захиалах
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${subText}`}>
            Танд тохирох цагт ширээ захиалж, гайхалтай туршлага эдлээрэй
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* Form */}
          <div className={card}>
            <h3 className={`text-2xl font-bold mb-6 ${cardTitle}`}>Захиалга хийх</h3>
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">

                {/* Нэр */}
                <div className="space-y-2">
                  <label className={labelCls}>Овог нэр <span className="text-amber-400">*</span></label>
                  <input name="name" type="text" value={formData.name} onChange={handleChange} required
                    className={inputCls} ref={firstInputRef} />
                </div>

                {/* Утас */}
                <div className="space-y-2">
                  <label className={labelCls}>Утас <span className="text-amber-400">*</span></label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input name="phone" type="tel" value={formData.phone} onChange={handleChange} required
                      className={`${inputCls} pl-12`} />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className={labelCls}>Имэйл хаяг</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input name="email" type="email" value={formData.email} onChange={handleChange}
                      className={`${inputCls} pl-12`} />
                  </div>
                </div>

                {/* Өдөр */}
                <div className="space-y-2">
                  <label className={labelCls}>Өдөр <span className="text-amber-400">*</span></label>
                  <div className="relative">
                    <input name="date" type="date" value={formData.date} min={today} onChange={handleChange} required
                      className={`${inputCls} cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-1/4 [&::-webkit-calendar-picker-indicator]:h-full`} />
                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Цаг */}
                <div className="space-y-2">
                  <label className={labelCls}>Цаг <span className="text-amber-400">*</span></label>
                  <div className="relative">
                    <input name="time" type="time" value={formData.time} onChange={handleChange} required
                      className={`${inputCls} cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full`} />
                    <ClockIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Хүний тоо */}
                <div className="space-y-2">
                  <label className={labelCls}>Хүний тоо <span className="text-amber-400">*</span></label>
                  <div className="relative">
                    <select name="guests" value={formData.guests} onChange={handleChange} required
                      className={`${inputCls} appearance-none cursor-pointer`}>
                      <option value="" disabled>Хүний тоо сонгох</option>
                      {GUEST_OPTIONS.map(g => (
                        <option key={g} value={g} className={isDark ? 'bg-gray-900' : 'bg-white'}>{g} хүн</option>
                      ))}
                      <option value="10+" className={isDark ? 'bg-gray-900' : 'bg-white'}>10+ хүн</option>
                    </select>
                    <Users className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {formData.guests === '10+' && (
                <div className="p-4 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-sm font-medium">
                  10-аас дээш хүнтэй бол утсаар урьдчилан мэдээлнэ үү:{' '}
                  <span className="font-bold text-white">+976 8529-2577</span>
                </div>
              )}

              <div className="space-y-2">
                <label className={labelCls}>Захиалгын дэлгэрэнгүй</label>
                <textarea name="message" rows={4} value={formData.message} onChange={handleChange}
                  className={`${inputCls} resize-none`} />
              </div>

              {status.text && (
                <div className={`p-4 rounded-xl text-sm font-semibold ${
                  status.type === 'success'
                    ? isDark ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : isDark ? 'bg-red-500/20 text-red-300 border border-red-500/30'     : 'bg-red-50 text-red-600 border border-red-200'
                }`}>
                  {status.text}
                </div>
              )}

              <div className="pt-4">
                <button type="submit" disabled={isSubmitting}
                  className={`w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20 transition ${
                    isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:from-emerald-600 hover:to-green-700'
                  }`}>
                  {isSubmitting ? 'Илгээж байна...' : 'Захиалга илгээх'}
                </button>
              </div>
            </form>
          </div>

          {/* Right side */}
          <div className="space-y-6">
            {/* Work hours */}
            <div className={workCard}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center`}>
                  <ClockIcon className={`w-6 h-6 ${iconColor}`} />
                </div>
                <h3 className={`text-2xl font-bold ${cardTitle}`}>Ажлын цаг</h3>
              </div>
              <div className="space-y-4">
                {[
                  { day: 'Даваа - Баасан', time: '10:00 - 23:00' },
                  { day: 'Бямба - Ням',   time: '10:00 - 00:00' },
                ].map(r => (
                  <div key={r.day} className={`flex justify-between items-center p-4 ${rowBg} rounded-xl`}>
                    <span className={rowText}>{r.day}</span>
                    <span className={`font-bold ${timeColor}`}>{r.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div className={card}>
              <h3 className={`text-2xl font-bold mb-6 ${cardTitle}`}>Захиалгын мэдээлэл</h3>
              <ul className={`space-y-4 ${ruleText}`}>
                <li className="flex gap-3 items-start">
                  <Users className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                  <span>Бүлгийн (10+ хүн) захиалга бол урьдчилан холбогдоно уу.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CalendarIcon className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
                  <span>Захиалгыг 24 цагийн өмнө цуцлах боломжтой.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <ClockIcon className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                  <span>Ширээг таны цагийн дараа 15 минут хадгална.</span>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className={card}>
              <h3 className={`text-2xl font-bold mb-6 ${cardTitle}`}>Холбоо барих</h3>
              <div className="space-y-4">
                {[
                  { icon: MapPin, color: 'text-indigo-400', title: 'Хаяг',  sub: 'Ховд, Жаргалант сум, Жаргалан баг' },
                  { icon: Phone,  color: 'text-orange-400', title: 'Утас',  sub: '+976 8529-2577' },
                  { icon: Mail,   color: 'text-emerald-400',title: 'Имэйл', sub: 'info@huukool.mn' },
                ].map(row => (
                  <div key={row.title} className={`flex items-center p-3 ${contactRowBg} rounded-xl`}>
                    <row.icon className={`w-6 h-6 ${row.color} mr-4`} />
                    <div>
                      <p className={`font-medium ${contactTitle}`}>{row.title}</p>
                      <p className={`text-sm ${contactSub}`}>{row.sub}</p>
                    </div>
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