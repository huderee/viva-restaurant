// src/components/sections/ReservationConfirmation.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2, Calendar, Clock, Users, Phone, Mail, Copy, Check,
  Download, Crown, Utensils, ArrowRight, Search,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { CONTACT } from '../../lib/constants';

/**
 * Захиалга амжилттай болсны дараах inline confirmation
 * Props:
 *  - reservation: { _id, name, phone, email, date, time, guests, tableType, message }
 *  - onNewReservation: reset callback
 */
export default function ReservationConfirmation({ reservation, onNewReservation }) {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [copied, setCopied] = useState(false);

  if (!reservation) return null;

  const isVip = reservation.tableType === 'vip';
  const shortId = (reservation._id || reservation.id || '').toString().slice(-6).toUpperCase();

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(shortId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  // ICS файл үүсгэх
  const downloadICS = () => {
    try {
      const [y, m, d] = reservation.date.split('-');
      const [h, mi]   = reservation.time.split(':');
      const startUTC = new Date(Date.UTC(+y, +m - 1, +d, +h - 8, +mi)); // UB = UTC+8
      const endUTC   = new Date(startUTC.getTime() + 2 * 60 * 60 * 1000);
      const fmt = dt => dt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

      const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Viva Restaurant//Reservation//MN',
        'BEGIN:VEVENT',
        `UID:${reservation._id || Date.now()}@viva-restaurant`,
        `DTSTAMP:${fmt(new Date())}`,
        `DTSTART:${fmt(startUTC)}`,
        `DTEND:${fmt(endUTC)}`,
        `SUMMARY:${isVip ? 'VIP ' : ''}Ширээ захиалга — Viva Restaurant`,
        `DESCRIPTION:Нэр: ${reservation.name}\\nХүн: ${reservation.guests}\\nКод: ${shortId}`,
        `LOCATION:${CONTACT.address}`,
        'BEGIN:VALARM',
        'TRIGGER:-PT2H',
        'ACTION:DISPLAY',
        'DESCRIPTION:Ширээ захиалгын сануулга',
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR',
      ].join('\r\n');

      const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url;
      a.download = `viva-reservation-${shortId}.ics`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('ICS download failed', e);
    }
  };

  const bg      = isDark ? 'bg-gradient-to-b from-black via-gray-900 to-black' : 'bg-gradient-to-b from-gray-50 via-white to-gray-50';
  const card    = isDark
    ? 'bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl'
    : 'bg-white border border-gray-200 rounded-3xl p-8 shadow-xl';
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textSub  = isDark ? 'text-gray-400' : 'text-gray-500';
  const rowBg    = isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-100';

  // Хүний уншихад хялбар огноо
  const humanDate = (() => {
    try {
      const d = new Date(`${reservation.date}T00:00:00`);
      return d.toLocaleDateString('mn-MN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } catch { return reservation.date; }
  })();

  return (
    <section className={`py-24 min-h-screen relative overflow-hidden transition-colors duration-300 ${bg}`}>
      {/* Декорацын тойрог */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 max-w-2xl relative z-10">

        {/* Амжилтын иконд анимац */}
        <div className="flex flex-col items-center text-center mb-10 animate-fade-up">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-500/40">
              <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <h2 className={`font-serif font-bold text-3xl md:text-4xl mb-2 ${textMain}`}>
            Амжилттай баталгаажлаа!
          </h2>
          <p className={`text-base ${textSub}`}>
            Таны захиалга манай системд бүртгэгдлээ
          </p>
        </div>

        {/* Захиалгын карт */}
        <div className={`${card} animate-fade-scale animate-delay-100`}>

          {/* Шор ID + VIP bar */}
          <div className={`flex items-center justify-between mb-6 pb-6 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
            <div>
              <div className={`text-xs uppercase tracking-wider mb-1 ${textSub}`}>Захиалгын код</div>
              <div className="flex items-center gap-2">
                <span className={`font-mono text-2xl font-bold ${textMain}`}>{shortId}</span>
                <button
                  onClick={copyId}
                  className={`p-1.5 rounded-lg transition ${
                    isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                  }`}
                  title="Хуулах"
                >
                  {copied
                    ? <Check className="w-4 h-4 text-emerald-400" />
                    : <Copy className={`w-4 h-4 ${textSub}`} />}
                </button>
              </div>
            </div>
            {isVip ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-xs font-bold shadow-lg shadow-amber-500/30">
                <Crown className="w-3.5 h-3.5" />
                VIP
              </div>
            ) : (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-700'
              }`}>
                <Utensils className="w-3.5 h-3.5" />
                Энгийн
              </div>
            )}
          </div>

          {/* Мэдээллийн мөрүүд */}
          <div className="space-y-3">
            <InfoRow icon={Calendar} label="Огноо" value={humanDate} isDark={isDark} rowBg={rowBg} textMain={textMain} textSub={textSub} />
            <InfoRow icon={Clock}    label="Цаг"   value={reservation.time} isDark={isDark} rowBg={rowBg} textMain={textMain} textSub={textSub} />
            <InfoRow icon={Users}    label="Хүний тоо" value={`${reservation.guests} хүн`} isDark={isDark} rowBg={rowBg} textMain={textMain} textSub={textSub} />
            {reservation.tableId && (
              <InfoRow icon={Utensils} label="Ширээ" value={reservation.tableId} isDark={isDark} rowBg={rowBg} textMain={textMain} textSub={textSub} />
            )}
            <InfoRow icon={Phone}    label="Утас"      value={reservation.phone} isDark={isDark} rowBg={rowBg} textMain={textMain} textSub={textSub} />
            {reservation.email && (
              <InfoRow icon={Mail}  label="Имэйл"     value={reservation.email} isDark={isDark} rowBg={rowBg} textMain={textMain} textSub={textSub} />
            )}
          </div>

          {/* Мэдэгдэл */}
          <div className={`mt-6 p-4 rounded-xl text-sm ${
            isDark ? 'bg-amber-500/10 border border-amber-500/20 text-amber-200' : 'bg-amber-50 border border-amber-200 text-amber-800'
          }`}>
            <strong>Анхаарах:</strong> Захиалга эхлэхийн 15 минутын өмнө ирнэ үү. 2 цагийн дотор цуцлах шаардлагатай бол{' '}
            <a href={`tel:${CONTACT.phone}`} className="underline font-semibold">{CONTACT.phone}</a> руу залгана уу.
          </div>

          {/* Үйлдлийн товчнууд */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={downloadICS}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition ${
                isDark
                  ? 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                  : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 shadow-sm'
              }`}
            >
              <Download className="w-4 h-4" />
              Календарт нэмэх
            </button>
            <button
              onClick={() => navigate('/reservation/my')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition ${
                isDark
                  ? 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                  : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 shadow-sm'
              }`}
            >
              <Search className="w-4 h-4" />
              Миний захиалга
            </button>
          </div>
        </div>

        {/* Доорх товч */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 animate-fade-up animate-delay-200">
          <button
            onClick={onNewReservation}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white shadow-lg shadow-amber-500/30 transition"
          >
            Шинэ захиалга хийх
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/')}
            className={`flex-1 py-3.5 rounded-xl font-semibold transition ${
              isDark
                ? 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 shadow-sm'
            }`}
          >
            Нүүр хуудас руу буцах
          </button>
        </div>
      </div>
    </section>
  );
}

function InfoRow({ icon: Icon, label, value, isDark, rowBg, textMain, textSub }) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl ${rowBg}`}>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
        isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600'
      }`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-xs uppercase tracking-wider ${textSub}`}>{label}</div>
        <div className={`text-sm font-semibold truncate ${textMain}`}>{value}</div>
      </div>
    </div>
  );
}
