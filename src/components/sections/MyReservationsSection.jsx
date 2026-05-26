// src/components/sections/MyReservationsSection.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Phone, Calendar, Clock, Users, XCircle, CheckCircle2,
  AlertCircle, ArrowLeft, Crown, Utensils, Loader2, Ban,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import api from '../../lib/api';
import BackgroundGlow from '../ui/BackgroundGlow';

const STATUS_META = {
  pending:   { label: 'Хүлээгдэж буй', color: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/30',    dot: 'bg-blue-500',    icon: Clock },
  confirmed: { label: 'Баталгаажсан',   color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', dot: 'bg-emerald-500', icon: CheckCircle2 },
  cancelled: { label: 'Цуцалсан',       color: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/30',     dot: 'bg-red-500',     icon: Ban },
};

STATUS_META.late_cancelled = { label: 'Ойрхон цуцалсан', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', dot: 'bg-orange-500', icon: Ban };
STATUS_META.no_show = { label: 'Ирээгүй', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30', dot: 'bg-slate-500', icon: Ban };

const RISK_LABEL = {
  low: 'Бага эрсдэл',
  medium: 'Дунд эрсдэл',
  high: 'Өндөр эрсдэл',
};

export default function MyReservationsSection() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [phone, setPhone]         = useState('');
  const [searched, setSearched]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [items, setItems]         = useState([]);
  const [error, setError]         = useState('');
  const [cancelBusy, setCancelBusy] = useState(null); // захиалгын id
  const [cancelMsg, setCancelMsg]   = useState({ id: null, type: '', text: '' });
  const inputRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    inputRef.current?.focus();
  }, []);

  const onSearch = async (e) => {
    e?.preventDefault?.();
    setError('');
    setCancelMsg({ id: null, type: '', text: '' });
    if (!/^[0-9]{8}$/.test(phone)) {
      setError('Утасны дугаар 8 оронтой байх ёстой');
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const r = await api.get(`/reservations/by-phone?phone=${phone}`);
      setItems(Array.isArray(r?.data) ? r.data : []);
    } catch (err) {
      setError(err?.message || 'Хайхад алдаа гарлаа');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const onCancel = async (id) => {
    if (!window.confirm('Та энэ захиалгыг цуцлахдаа итгэлтэй байна уу?')) return;
    setCancelBusy(id);
    setCancelMsg({ id, type: '', text: '' });
    try {
      const response = await api.post(`/reservations/${id}/cancel`, { phone, reason: 'Customer cancelled from website' });
      const updated = response?.data || { status: 'cancelled' };
      setItems(prev => prev.map(r => ((r._id || r.id) === id ? { ...r, ...updated, status: 'cancelled' } : r)));
      setCancelMsg({ id, type: 'success', text: 'Захиалга цуцлагдлаа' });
    } catch (err) {
      setCancelMsg({ id, type: 'error', text: err?.message || 'Цуцлахад алдаа гарлаа' });
    } finally {
      setCancelBusy(null);
      setTimeout(() => setCancelMsg({ id: null, type: '', text: '' }), 4000);
    }
  };

  const bg      = isDark ? 'bg-gradient-to-b from-black via-gray-900 to-black' : 'bg-gradient-to-b from-gray-50 via-white to-gray-50';
  const card    = isDark
    ? 'bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl'
    : 'bg-white border border-gray-200 rounded-3xl shadow-md';
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textSub  = isDark ? 'text-gray-400' : 'text-gray-500';
  const inputCls = isDark
    ? 'w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white text-lg placeholder-gray-400 focus:outline-none focus:border-amber-500/60 transition'
    : 'w-full bg-white border border-gray-300 rounded-xl pl-11 pr-4 py-3.5 text-gray-800 text-lg placeholder-gray-400 shadow-sm focus:outline-none focus:border-amber-500 transition';

  const isFuture = (date, time) => {
    try {
      const dt = new Date(`${date}T${time || '00:00'}:00`);
      return dt.getTime() > Date.now();
    } catch { return false; }
  };

  const minutesUntil = (date, time) => {
    try {
      const dt = new Date(`${date}T${time || '00:00'}:00`);
      return Math.floor((dt.getTime() - Date.now()) / 60000);
    } catch {
      return -1;
    }
  };

  const humanDate = (dstr) => {
    try {
      const d = new Date(`${dstr}T00:00:00`);
      return d.toLocaleDateString('mn-MN', { weekday: 'short', month: 'short', day: 'numeric' });
    } catch { return dstr; }
  };

  return (
    <section className={`py-24 min-h-screen relative overflow-hidden transition-colors duration-300 ${bg}`}>
      <BackgroundGlow />

      <div className="container mx-auto px-6 max-w-3xl relative z-10">

        {/* Буцах */}
        <button
          onClick={() => navigate('/reservation')}
          className={`inline-flex items-center gap-2 mb-6 text-sm font-semibold transition-all hover:-translate-x-1 ${
            isDark ? 'text-slate-400 hover:text-amber-400' : 'text-gray-500 hover:text-amber-600'
          }`}
        >
          <ArrowLeft size={16} />
          Захиалга руу буцах
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className={`font-serif font-bold text-4xl md:text-5xl mb-3 ${textMain}`}>
            Миний захиалга
          </h2>
          <p className={`text-base md:text-lg max-w-xl mx-auto ${textSub}`}>
            Утасны дугаараараа өмнө хийсэн захиалгаа хайж, шаардлагатай бол цуцлаарай
          </p>
        </div>

        {/* Search form */}
        <form onSubmit={onSearch} className={`${card} p-6 mb-6`}>
          <label className={`block mb-2 font-medium text-sm ${textMain}`}>Утасны дугаар</label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="tel"
              inputMode="numeric"
              maxLength={8}
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="9911XXXX"
              className={inputCls}
            />
          </div>
          {error && (
            <div className={`mt-3 flex items-center gap-2 text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading || phone.length !== 8}
            className={`mt-4 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-yellow-600 transition ${
              loading || phone.length !== 8 ? 'opacity-60 cursor-not-allowed' : 'hover:from-amber-600 hover:to-yellow-700 shadow-lg shadow-amber-500/30'
            }`}
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Хайж байна...</>
            ) : (
              <><Search className="w-4 h-4" /> Захиалгаа хайх</>
            )}
          </button>
        </form>

        {/* Үр дүн */}
        {searched && !loading && items.length === 0 && !error && (
          <div className={`${card} p-10 text-center`}>
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              isDark ? 'bg-white/5' : 'bg-gray-100'
            }`}>
              <Calendar className={`w-8 h-8 ${textSub}`} />
            </div>
            <h3 className={`text-lg font-bold mb-1 ${textMain}`}>Захиалга олдсонгүй</h3>
            <p className={`text-sm ${textSub}`}>
              Энэ дугаараар хийгдсэн захиалга бүртгэгдээгүй байна.
            </p>
          </div>
        )}

        {searched && items.length > 0 && (
          <div className="space-y-3">
            <div className={`text-sm ${textSub} mb-2`}>
              Нийт <span className={`font-semibold ${textMain}`}>{items.length}</span> захиалга олдлоо
            </div>
            {items.map(r => {
              const id = r._id || r.id;
              const st = STATUS_META[r.status || 'pending'] || STATUS_META.pending;
              const StIcon = st.icon;
              const isVip = r.tableType === 'vip';
              const minsLeft = minutesUntil(r.date, r.time);
              const riskLevel = r.riskLevel || (isVip || Number(r.guests) >= 8 ? 'high' : Number(r.guests) >= 6 ? 'medium' : 'low');
              const isInactive = ['cancelled', 'late_cancelled', 'no_show'].includes(r.status);
              const canCancel = !isInactive && (
                (riskLevel === 'low' && minsLeft >= 120) ||
                (riskLevel === 'medium' && minsLeft >= 240) ||
                (riskLevel === 'high' && minsLeft > 0)
              );
              const isHighLateCancel = riskLevel === 'high' && minsLeft > 0 && minsLeft < 360;
              const isTooLateToCancel = !isInactive && riskLevel !== 'high' && minsLeft > 0 && minsLeft < (riskLevel === 'medium' ? 240 : 120);
              const isPastReservation = !isInactive && !isFuture(r.date, r.time);
              const msg = cancelMsg.id === id ? cancelMsg : null;

              return (
                <div key={id} className={`${card} p-5`}>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isVip
                          ? 'bg-gradient-to-br from-amber-400 to-yellow-600 text-white shadow-md'
                          : isDark ? 'bg-white/10 text-amber-400' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {isVip ? <Crown className="w-5 h-5" /> : <Utensils className="w-5 h-5" />}
                      </div>
                      <div className="min-w-0">
                        <div className={`font-bold text-sm ${textMain}`}>
                          {isVip ? 'VIP захиалга' : 'Энгийн захиалга'}
                        </div>
                        <div className={`text-xs font-mono ${textSub}`}>
                          #{(id || '').toString().slice(-6).toUpperCase()}
                        </div>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${st.bg} ${st.border} ${st.color}`}>
                      <StIcon className="w-3.5 h-3.5" />
                      {st.label}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <DataCell icon={Calendar} label="Огноо" value={humanDate(r.date)} isDark={isDark} />
                    <DataCell icon={Clock}    label="Цаг"   value={r.time} isDark={isDark} />
                    <DataCell icon={Users}    label="Хүн"   value={`${r.guests}`} isDark={isDark} />
                  </div>

                  {(riskLevel !== 'low' || r.requiresDeposit) && (
                    <div className={`mt-3 rounded-lg border p-3 text-xs ${
                      riskLevel === 'high'
                        ? isDark ? 'border-red-500/20 bg-red-500/10 text-red-300' : 'border-red-200 bg-red-50 text-red-700'
                        : isDark ? 'border-amber-500/20 bg-amber-500/10 text-amber-300' : 'border-amber-200 bg-amber-50 text-amber-700'
                    }`}>
                      <div className="font-bold">{RISK_LABEL[riskLevel]}</div>
                      {r.requiresDeposit && (
                        <div className="mt-1">
                          Урьдчилгаа: {Number(r.depositAmount || 0).toLocaleString('mn-MN')}₮
                          {r.depositStatus === 'pending' ? ' төлөх шаардлагатай' : ''}
                        </div>
                      )}
                      {Array.isArray(r.riskReasons) && r.riskReasons.length > 0 && (
                        <div className="mt-1 opacity-80">{r.riskReasons.join(', ')}</div>
                      )}
                    </div>
                  )}

                  {msg?.text && (
                    <div className={`mt-3 p-2.5 rounded-lg text-xs font-medium ${
                      msg.type === 'success'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {msg.text}
                    </div>
                  )}

                  {canCancel ? (
                    <button
                      onClick={() => onCancel(id)}
                      disabled={cancelBusy === id}
                      className={`mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition border ${
                        isDark
                          ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20'
                          : 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200'
                      } ${cancelBusy === id ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      {cancelBusy === id
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Цуцалж байна...</>
                        : <><XCircle className="w-4 h-4" /> Захиалга цуцлах</>}
                    </button>
                  ) : (isTooLateToCancel || isPastReservation) && (
                    <div className={`mt-4 p-3 rounded-lg text-xs font-medium border ${
                      isDark
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {isTooLateToCancel
                        ? 'Захиалга эхлэхээс 2 цаг хүрэхгүй хугацаа үлдсэн тул сайтаас цуцлах боломжгүй. Утсаар холбогдоно уу.'
                        : 'Энэ захиалга эхэлсэн эсвэл өнгөрсөн тул сайтаас цуцлах боломжгүй.'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Тусламж */}
        <div className={`mt-8 p-4 rounded-xl text-sm ${
          isDark ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-gray-50 text-gray-600 border border-gray-200'
        }`}>
          <strong className={textMain}>Санамж:</strong> Захиалга эхлэхийн 2 цагийн дотор цуцлах боломжгүй. Энэ тохиолдолд утсаар шууд холбогдоно уу.
        </div>
      </div>
    </section>
  );
}

function DataCell({ icon: Icon, label, value, isDark }) {
  return (
    <div className={`p-2.5 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
      <div className={`flex items-center gap-1.5 mb-0.5 text-[10px] uppercase tracking-wide ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</div>
    </div>
  );
}
