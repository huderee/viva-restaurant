// src/components/sections/VipReservationSection.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, ClockIcon, Users, Mail, Phone, Crown, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useTheme }    from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { CONTACT } from '../../lib/constants';
import api from '../../lib/api';
import ReservationConfirmation from './ReservationConfirmation';

const GUEST_OPTIONS = [...Array(10).keys()].map(n => `${n + 1}`);

const VIP_PERKS = [
  'Тусгай өрөө, тусгаарлагдсан орон зай',
  'Хувийн зөөгч үйлчилгээ',
  'Үнэгүй welcome drink',
  'Урьдчилан бэлтгэсэн цэс, тусгай амтлах сонголт',
  'Тусгай хөгжим, зүс тохируулалт',
];

export default function VipReservationSection() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { t }      = useLanguage();
  const [formData, setFormData]       = useState({ name: '', phone: '', email: '', date: '', time: '', guests: '', message: '', tableType: 'vip' });
  const [status,   setStatus]         = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firstInputRef = useRef(null);
  const today = new Date().toISOString().split('T')[0];

  // Сул цагийн слот
  const [slots, setSlots]     = useState([]);
  const [slotsLoading, setSL] = useState(false);

  // Амжилттай захиалгын баталгаажуулалт
  const [confirmed, setConfirmed] = useState(null);

  // Хуудас нээгдэнгүүт дээш нь scroll хийх
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!isSubmitting && firstInputRef.current) firstInputRef.current.focus();
  }, [isSubmitting]);

  // Огноо өөрчлөгдөхөд VIP сул цаг татах
  useEffect(() => {
    if (!formData.date) { setSlots([]); return; }
    let alive = true;
    setSL(true);
    (async () => {
      try {
        const r = await api.get(`/reservations/availability?date=${formData.date}&tableType=vip`);
        if (alive) setSlots(Array.isArray(r?.data?.slots) ? r.data.slots : []);
      } catch {
        if (alive) setSlots([]);
      } finally {
        if (alive) setSL(false);
      }
    })();
    return () => { alive = false; };
  }, [formData.date]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => {
      const next = { ...p, [name]: value };
      if (name === 'date') next.time = '';
      return next;
    });
    if (status.text) setStatus({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', text: '' });
    const { name, phone, date, time, guests } = formData;
    if (!name || !phone || !date || !time || !guests) {
      setStatus({ type: 'error', text: t('res.error.required') });
      setIsSubmitting(false); return;
    }
    if (!/^[0-9]{8}$/.test(phone)) {
      setStatus({ type: 'error', text: t('res.error.phone') });
      setIsSubmitting(false); return;
    }
    const payload = { ...formData, guests: Number(guests) || guests };
    try {
      const resp = await api.post('/reservations', payload);
      const data = resp?.data || resp;
      setConfirmed(data || payload);
      setFormData({ name: '', phone: '', email: '', date: '', time: '', guests: '', message: '', tableType: 'vip' });
      setSlots([]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsSubmitting(false);
      return;
    } catch (err) {
      const msg = (err && err.message) || '';
      if (/бүрэн|full|409|багтаамж|VIP/i.test(msg)) {
        setStatus({ type: 'error', text: msg || 'Энэ цагт VIP өрөө бүрэн захиалагдсан байна. Өөр цаг сонгоно уу.' });
        // Сул цагаа сэргээж харуулна
        try {
          const r = await api.get(`/reservations/availability?date=${formData.date}&tableType=vip`);
          setSlots(Array.isArray(r?.data?.slots) ? r.data.slots : []);
        } catch {}
      } else {
        setStatus({ type: 'success', text: t('res.success.local') });
      }
    }
    setIsSubmitting(false);
  };

  // Амжилттай захиалгын дараа confirmation
  if (confirmed) {
    return (
      <ReservationConfirmation
        reservation={confirmed}
        onNewReservation={() => setConfirmed(null)}
      />
    );
  }

  const bg = isDark
    ? 'bg-gradient-to-b from-black via-gray-900 to-black'
    : 'bg-gradient-to-b from-gray-50 via-white to-gray-50';
  const card = isDark
    ? 'bg-white/5 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-8 shadow-xl'
    : 'bg-white border border-amber-200 rounded-3xl p-8 shadow-md';
  const cardTitle = isDark ? 'text-white' : 'text-gray-800';
  const labelCls  = isDark ? 'text-white font-medium block' : 'text-gray-700 font-medium block';
  const inputCls  = isDark
    ? 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-amber-500/60 transition'
    : 'w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:border-amber-500 transition';
  const subText   = isDark ? 'text-gray-400' : 'text-gray-500';
  const perkCard  = isDark ? 'bg-gradient-to-br from-amber-500/10 to-yellow-700/10 border-amber-500/30' : 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200';

  return (
    <section className={`py-24 relative overflow-hidden transition-colors duration-300 ${bg}`}>
      {/* Декоратив фон элементүүд */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 -left-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container max-w-7xl mx-auto px-4 relative z-10">

        {/* Буцах товч */}
        <button
          onClick={() => navigate('/reservation')}
          className={`inline-flex items-center gap-2 mb-8 text-sm font-semibold transition-all hover:-translate-x-1 animate-fade-up ${
            isDark ? 'text-slate-400 hover:text-amber-400' : 'text-gray-500 hover:text-amber-600'
          }`}
        >
          <ArrowLeft size={16} />
          Энгийн захиалга руу буцах
        </button>

        {/* Header */}
        <div className="text-center mb-12 animate-fade-up animate-delay-100">
          <h2 className={`font-serif font-bold text-4xl md:text-5xl mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            VIP Ширээ Захиалах
          </h2>
          <p className={`max-w-2xl mx-auto text-base md:text-lg ${subText}`}>
            Онцгой үдэшлэг, чухал уулзалт, тусгай мөчөө манай VIP үйлчилгээгээр баяжуулаарай
          </p>
          <div className="w-24 h-0.5 mx-auto mt-6 rounded-full shimmer-gradient" />
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* VIP Form */}
          <div className={`${card} animate-fade-scale animate-delay-200`}>
            <h3 className={`text-2xl font-bold mb-6 ${cardTitle}`}>
              VIP Захиалга
            </h3>
            <form onSubmit={handleSubmit} noValidate autoComplete="off" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={labelCls}>Овог нэр <span className="text-amber-400">*</span></label>
                  <input name="name" type="text" value={formData.name} onChange={handleChange} required
                    autoComplete="off" className={inputCls} ref={firstInputRef} />
                </div>
                <div className="space-y-2">
                  <label className={labelCls}>Утас <span className="text-amber-400">*</span></label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input name="phone" type="tel" value={formData.phone} onChange={handleChange} required
                      autoComplete="off" className={`${inputCls} pl-12`} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={labelCls}>Имэйл</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input name="email" type="email" value={formData.email} onChange={handleChange}
                      autoComplete="off" className={`${inputCls} pl-12`} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={labelCls}>Огноо <span className="text-amber-400">*</span></label>
                  <div className="relative">
                    <input name="date" type="date" value={formData.date} min={today} onChange={handleChange} required
                      className={`${inputCls} pr-10 cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer`} />
                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={labelCls}>Хүний тоо <span className="text-amber-400">*</span></label>
                  <div className="relative">
                    <select name="guests" value={formData.guests} onChange={handleChange} required
                      className={`${inputCls} appearance-none cursor-pointer`}>
                      <option value="" disabled>Хүний тоо сонгох</option>
                      {GUEST_OPTIONS.map(g => (
                        <option key={g} value={g} className={isDark ? 'bg-gray-900' : 'bg-white'}>{g} хүн</option>
                      ))}
                      <option value="10+" className={isDark ? 'bg-gray-900' : 'bg-white'}>10+</option>
                    </select>
                    <Users className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* VIP цагийн слот */}
              <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className={labelCls}>
                    Цаг <span className="text-amber-400">*</span>
                  </label>
                  {formData.date && !slotsLoading && slots.length > 0 && (
                    <div className={`flex items-center gap-3 text-xs ${subText}`}>
                      <span className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-emerald-400' : 'bg-emerald-500'}`} />
                        Сул
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Цөөн үлдсэн
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-red-500/70' : 'bg-red-500'}`} />
                        Дүүрсэн
                      </span>
                    </div>
                  )}
                </div>

                {!formData.date && (
                  <div className={`p-4 rounded-xl border text-sm ${
                    isDark ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'
                  }`}>
                    Эхлээд огноогоо сонгоно уу.
                  </div>
                )}

                {formData.date && slotsLoading && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className={`h-14 rounded-xl animate-pulse ${isDark ? 'bg-white/5' : 'bg-gray-100'}`} />
                    ))}
                  </div>
                )}

                {formData.date && !slotsLoading && slots.length === 0 && (
                  <div className={`p-4 rounded-xl border text-sm ${
                    isDark ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'
                  }`}>
                    Энэ өдөрт VIP боломжит цаг олдсонгүй.
                  </div>
                )}

                {formData.date && !slotsLoading && slots.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {slots.map(slot => {
                      const selected = formData.time === slot.time;
                      const disabled = slot.full || slot.past;
                      const low = !disabled && slot.available > 0 && slot.available <= Math.max(1, Math.floor(slot.capacity * 0.3));

                      let cls = 'relative flex flex-col items-center justify-center h-14 rounded-xl border text-xs font-semibold transition-all select-none';
                      if (disabled) {
                        cls += isDark
                          ? ' bg-red-500/5 border-red-500/20 text-red-400/60 cursor-not-allowed line-through'
                          : ' bg-red-50 border-red-200 text-red-400 cursor-not-allowed line-through';
                      } else if (selected) {
                        cls += ' bg-gradient-to-br from-amber-500 to-yellow-600 border-amber-500 text-white shadow-lg shadow-amber-500/30 scale-[1.02]';
                      } else if (low) {
                        cls += isDark
                          ? ' bg-amber-500/10 border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-500/70 cursor-pointer'
                          : ' bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100 hover:border-amber-500 cursor-pointer';
                      } else {
                        cls += isDark
                          ? ' bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 cursor-pointer'
                          : ' bg-white border-gray-200 text-gray-700 hover:bg-amber-50 hover:border-amber-300 cursor-pointer';
                      }

                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={disabled}
                          onClick={() => !disabled && setFormData(p => ({ ...p, time: slot.time }))}
                          className={cls}
                          title={
                            slot.past ? 'Өнгөрсөн цаг'
                            : slot.full ? 'Бүрэн захиалагдсан'
                            : `${slot.available}/${slot.capacity} VIP өрөө сул`
                          }
                        >
                          <span className="text-sm">{slot.time}</span>
                          <span className={`text-[10px] mt-0.5 ${
                            disabled ? '' : selected ? 'text-white/90' : low ? '' : (isDark ? 'text-gray-400' : 'text-gray-500')
                          }`}>
                            {slot.past ? 'өнгөрсөн' : slot.full ? 'дүүрсэн' : `${slot.available} сул`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className={labelCls}>Тусгай хүсэлт / Дэлгэрэнгүй</label>
                <textarea name="message" rows={4} value={formData.message} onChange={handleChange}
                  placeholder="Жишээ: Төрсөн өдрийн үдэшлэг, corporate meeting..."
                  className={`${inputCls} resize-none`} />
              </div>

              {status.text && (
                <div className={`p-4 rounded-xl text-sm font-semibold ${
                  status.type === 'success'
                    ? isDark ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    : isDark ? 'bg-red-500/20 text-red-300 border border-red-500/30'       : 'bg-red-50 text-red-600 border border-red-200'
                }`}>
                  {status.text}
                </div>
              )}

              <button type="submit" disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-bold transition-all active:scale-[0.98] shadow-lg shadow-amber-500/30 disabled:opacity-60">
                {isSubmitting ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Илгээж байна...</>
                ) : (
                  <><Crown size={16} /> VIP Захиалга илгээх</>
                )}
              </button>
            </form>
          </div>

          {/* VIP Perks */}
          <div className="space-y-6 animate-slide-right animate-delay-300">
            <div className={`rounded-3xl border p-8 ${perkCard} relative overflow-hidden`}>
              {/* Shimmer top border */}
              <div className="absolute top-0 left-0 right-0 h-1 shimmer-gradient" />

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg animate-crown-float">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${cardTitle}`}>VIP давуу талууд</h3>
                  <p className={`text-xs ${subText}`}>Онцгой зочдод зориулсан</p>
                </div>
              </div>
              <ul className="space-y-3">
                {VIP_PERKS.map((p, i) => (
                  <li
                    key={i}
                    className={`flex items-start gap-3 text-sm animate-fade-up ${isDark ? 'text-slate-200' : 'text-gray-700'}`}
                    style={{ animationDelay: `${0.4 + i * 0.08}s` }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`rounded-3xl border p-6 animate-fade-up animate-delay-500 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
              <h4 className={`font-bold mb-2 ${cardTitle}`}>Яаралтай холбогдох</h4>
              <p className={`text-sm mb-4 ${subText}`}>VIP захиалга болон том бүлгийн захиалгыг утсаар шууд холбогдож баталгаажуулахыг зөвлөж байна.</p>
              <a href={`tel:${CONTACT.phone}`} className="inline-flex items-center gap-2 text-amber-500 font-bold hover:text-amber-400 hover:gap-3 transition-all">
                <Phone size={16} /> {CONTACT.phone}
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
