// src/components/sections/ReservationSection.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarIcon, ClockIcon, Users, Phone, Crown, Utensils,
  LayoutGrid, List, Sparkles, MapPin, ChevronRight,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { CONTACT } from '../../lib/constants';
import api from '../../lib/api';
import { FLOORS, FLOOR_TABLES, pickRecommendedTable } from '../../data/floorPlanData';
import FloorPlanCanvas from '../reservation/FloorPlanCanvas';
import BookingStepper from '../reservation/BookingStepper';
import ReservationConfirmation from './ReservationConfirmation';

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

function formatDateLabel(dateStr, lang) {
  if (!dateStr) return '';
  try {
    const d = new Date(`${dateStr}T12:00:00`);
    return d.toLocaleDateString(lang === 'en' ? 'en-US' : 'mn-MN', {
      weekday: 'short', month: 'short', day: 'numeric',
    });
  } catch { return dateStr; }
}

function groupSlots(slots) {
  const lunch = [], evening = [];
  slots.forEach(s => {
    const h = parseInt(s.time.split(':')[0], 10);
    if (h < 17) lunch.push(s);
    else evening.push(s);
  });
  return { lunch, evening };
}

export default function ReservationSection() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { lang, t } = useLanguage();

  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', date: '', time: '', guests: '',
    tableType: 'standard', tableId: '', message: '',
  });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  const [floorId, setFloorId] = useState('main-dining');
  const [viewMode, setViewMode] = useState('floor');
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [bookedTableIds, setBookedTableIds] = useState([]);
  const [slotPast, setSlotPast] = useState(false);
  const [tablesLoading, setTablesLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const tables = FLOOR_TABLES[floorId] || [];
  const currentFloor = FLOORS.find(f => f.id === floorId) || FLOORS[0];
  const floorLabel = lang === 'en' ? currentFloor.labelEn : currentFloor.labelMn;

  const steps = useMemo(() => [
    { id: 'guests',   label: t('res.step.guests') },
    { id: 'datetime', label: t('res.step.datetime') },
    { id: 'table',    label: t('res.step.table') },
    { id: 'details',  label: t('res.step.details') },
  ], [t]);

  const currentStepIndex = useMemo(() => {
    if (!formData.guests) return 0;
    if (!formData.date || !formData.time) return 1;
    if (!formData.tableId) return 2;
    return 3;
  }, [formData]);

  useEffect(() => {
    if (!formData.date) { setSlots([]); return; }
    let alive = true;
    setSlotsLoading(true);
    (async () => {
      try {
        const r = await api.get(`/reservations/availability?date=${formData.date}&tableType=${formData.tableType || 'standard'}`);
        if (alive) setSlots(Array.isArray(r?.data?.slots) ? r.data.slots : []);
      } catch {
        if (alive) setSlots([]);
      } finally {
        if (alive) setSlotsLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [formData.date, formData.tableType]);

  useEffect(() => {
    if (!formData.date || !formData.time) {
      setBookedTableIds([]); setSlotPast(false); return;
    }
    let alive = true;
    setTablesLoading(true);
    (async () => {
      try {
        const r = await api.get(
          `/reservations/table-status?date=${formData.date}&time=${formData.time}&tableType=${formData.tableType || 'standard'}`
        );
        if (alive) {
          setBookedTableIds(Array.isArray(r?.data?.bookedTableIds) ? r.data.bookedTableIds : []);
          setSlotPast(!!r?.data?.past);
        }
      } catch {
        if (alive) { setBookedTableIds([]); setSlotPast(false); }
      } finally {
        if (alive) setTablesLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [formData.date, formData.time, formData.tableType]);

  const guestsNum = useMemo(() => {
    const n = parseInt(formData.guests, 10);
    return Number.isFinite(n) ? n : 0;
  }, [formData.guests]);

  const tableStates = useMemo(() => {
    const states = {};
    tables.forEach(table => {
      // ✅ Зочид сонгоогүй бол idle — ширээнүүд харагдана, идэвхгүй байна
      if (!formData.guests) { states[table.id] = 'idle'; return; }
      // Огноо/цаг сонгоогүй бол available preview
      if (!formData.date || !formData.time) {
        if (guestsNum > 0 && guestsNum > (table.seats || table.capacity || 0)) { states[table.id] = 'small'; return; }
        states[table.id] = 'available';
        return;
      }
      if (slotPast) { states[table.id] = 'past'; return; }
      if (bookedTableIds.includes(table.id)) { states[table.id] = 'booked'; return; }
      if (guestsNum > 0 && guestsNum > (table.seats || table.capacity || 0)) { states[table.id] = 'small'; return; }
      states[table.id] = 'available';
    });
    return states;
  }, [tables, formData.guests, formData.date, formData.time, bookedTableIds, slotPast, guestsNum]);

  const availableCount = useMemo(
    () => Object.values(tableStates).filter(s => s === 'available').length,
    [tableStates]
  );

  const recommendedTableId = useMemo(
    () => pickRecommendedTable(tables, tableStates, guestsNum),
    [tables, tableStates, guestsNum]
  );

  const selectedTable = tables.find(tbl => tbl.id === formData.tableId);
  const { lunch, evening } = useMemo(() => groupSlots(slots), [slots]);

  // ✅ canPickTable: зочид + огноо + цаг байж гэсэн нөхцөл — ширээ сонгох боломж
  const canPickTable = !!formData.guests && !!formData.date && !!formData.time;

  useEffect(() => {
    if (!formData.tableId) return;
    if (tableStates[formData.tableId] !== 'available') {
      setFormData(p => ({ ...p, tableId: '' }));
    }
  }, [tableStates, formData.tableId]);

  const patchForm = (patch) => {
    setFormData(p => ({ ...p, ...patch }));
    if (status.text) setStatus({ type: '', text: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => {
      const next = { ...p, [name]: value };
      if (name === 'date' || name === 'tableType') { next.time = ''; next.tableId = ''; }
      if (name === 'time' || name === 'guests') next.tableId = '';
      return next;
    });
    if (status.text) setStatus({ type: '', text: '' });
  };

  const submitReservation = async (payload) => {
    try {
      const resp = await api.post('/reservations', payload);
      return { ok: true, data: resp?.data || resp };
    } catch (err) {
      const msg = (err && err.message) || '';
      if (/бүрэн|full|409|захиалагдсан|TABLE/i.test(msg)) {
        return { ok: false, source: 'conflict', message: msg };
      }
      return { ok: true, data: saveReservationLocally(payload) };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', text: '' });
    const { name, phone, date, time, guests, tableId } = formData;
    if (!name || !phone || !date || !time || !guests) {
      setStatus({ type: 'error', text: t('res.error.required') });
      setIsSubmitting(false); return;
    }
    if (!tableId) {
      setStatus({ type: 'error', text: t('res.error.table') });
      setIsSubmitting(false); return;
    }
    if (!/^[0-9]{8}$/.test(phone)) {
      setStatus({ type: 'error', text: t('res.error.phone') });
      setIsSubmitting(false); return;
    }
    const result = await submitReservation({ ...formData, guests: Number(guests) || guests });
    if (result.ok) {
      setConfirmed(result.data || formData);
      setFormData({ name: '', phone: '', email: '', date: '', time: '', guests: '', tableType: 'standard', tableId: '', message: '' });
      setSlots([]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (result.source === 'conflict') {
      setStatus({ type: 'error', text: result.message });
      try {
        const r = await api.get(`/reservations/table-status?date=${formData.date}&time=${formData.time}&tableType=${formData.tableType || 'standard'}`);
        setBookedTableIds(r?.data?.bookedTableIds || []);
      } catch {}
    } else {
      setStatus({ type: 'error', text: t('res.error.submit') });
    }
    setIsSubmitting(false);
  };

  const renderSlotGroup = (label, groupSlots) => {
    if (!groupSlots.length) return null;
    return (
      <div className="mb-2">
        <p className={`mb-1.5 text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
          {label}
        </p>
        <div className="grid grid-cols-4 gap-1.5">
          {groupSlots.map(slot => {
            const selected = formData.time === slot.time;
            const disabled = slot.full || slot.past;
            return (
              <button
                key={slot.time}
                type="button"
                disabled={disabled}
                onClick={() => !disabled && patchForm({ time: slot.time, tableId: '' })}
                className={`rounded-lg py-2 text-xs font-semibold transition-all ${
                  disabled
                    ? isDark ? 'bg-neutral-900/80 text-neutral-600 line-through' : 'bg-stone-50 text-stone-300 line-through'
                    : selected
                      ? 'bg-amber-500 text-black shadow-md shadow-amber-500/25 ring-2 ring-amber-400/50'
                      : isDark
                        ? 'bg-neutral-800 text-stone-200 hover:bg-neutral-700'
                        : 'bg-stone-100 text-stone-800 hover:bg-amber-50 hover:ring-1 hover:ring-amber-300'
                }`}
              >
                {slot.time}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (confirmed) {
    return <ReservationConfirmation reservation={confirmed} onNewReservation={() => setConfirmed(null)} />;
  }

  const pageBg = isDark
    ? 'bg-gradient-to-b from-[#0a0908] via-neutral-950 to-[#0a0908] text-white'
    : 'bg-gradient-to-b from-[#f5f2ed] via-[#ece8e2] to-[#e8e4dd] text-stone-900';
  const panel = isDark
    ? 'border-neutral-800/80 bg-neutral-900/90 shadow-2xl shadow-black/40 backdrop-blur-xl'
    : 'border-white/80 bg-white/95 shadow-xl shadow-stone-300/30 backdrop-blur-sm';
  const muted = isDark ? 'text-stone-400' : 'text-stone-500';
  const inputCls = isDark
    ? 'w-full rounded-xl border border-neutral-700/80 bg-neutral-800/80 px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
    : 'w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15';

  return (
    <section id="reservation" className={`min-h-screen pt-20 pb-12 transition-colors duration-500 ${pageBg}`}>
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6">

        {/* ── Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 ${
            isDark
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'bg-amber-100 text-amber-700 border border-amber-200'
          }`}>
            <Sparkles className="w-3.5 h-3.5" />
            Онлайн захиалга
          </div>
          <h1 className={`font-serif text-4xl md:text-5xl font-bold leading-tight mb-3 ${isDark ? 'text-white' : 'text-stone-900'}`}>
            {t('res.title')}
          </h1>
          <p className={`text-base md:text-lg max-w-xl mx-auto ${muted}`}>
            {t('res.subtitle')}
          </p>
          <div className={`inline-flex items-center gap-6 mt-6 px-6 py-3 rounded-2xl text-sm ${
            isDark ? 'bg-neutral-900/80 border border-neutral-800' : 'bg-white/80 border border-stone-200 shadow-sm'
          }`}>
            <span className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4 text-amber-500" />
              <span className={muted}>10:00 – 23:00</span>
            </span>
            <span className={`w-px h-4 ${isDark ? 'bg-neutral-700' : 'bg-stone-200'}`} />
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-500" />
              <span className={muted}>1–10 хүн</span>
            </span>
            <span className={`w-px h-4 ${isDark ? 'bg-neutral-700' : 'bg-stone-200'}`} />
            <a href={`tel:${CONTACT.phone}`} className="flex items-center gap-2 text-amber-500 font-semibold hover:text-amber-400 transition">
              <Phone className="w-4 h-4" />
              {CONTACT.phone}
            </a>
          </div>
        </motion.div>

        {/* ── Үндсэн хэсэг ── */}
        <div className="grid gap-6 xl:grid-cols-[1fr_400px]">

          {/* Floor plan card */}
          <div className={`flex min-h-[560px] flex-col overflow-hidden rounded-3xl border ${panel}`}>
            <div className={`border-b px-4 py-4 sm:px-5 ${isDark ? 'border-neutral-800' : 'border-stone-100'}`}>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <div className="relative min-w-[150px] flex-1">
                  <input
                    name="date"
                    type="date"
                    value={formData.date}
                    min={today}
                    onChange={handleChange}
                    className={`${inputCls} pr-10`}
                  />
                  <CalendarIcon className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 ${muted}`} />
                </div>
                {formData.date && (
                  <span className={`text-sm font-medium ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
                    {formatDateLabel(formData.date, lang)}
                  </span>
                )}
                <div className={`ml-auto flex rounded-xl border p-0.5 ${isDark ? 'border-neutral-700' : 'border-stone-200'}`}>
                  {[
                    { mode: 'floor', Icon: LayoutGrid, label: t('res.view.floor') },
                    { mode: 'list',  Icon: List,        label: t('res.view.list') },
                  ].map(({ mode, Icon, label }) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setViewMode(mode)}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                        viewMode === mode
                          ? isDark ? 'bg-amber-500 text-black' : 'bg-stone-900 text-white'
                          : muted
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className={`flex flex-wrap gap-3 text-[11px] font-medium ${muted}`}>
                {[
                  { cls: isDark ? 'border-neutral-500 bg-neutral-800' : 'border-stone-300 bg-white', label: t('res.table.available') },
                  { cls: 'bg-orange-400/90 border-transparent', label: t('res.table.booked') },
                  { cls: 'bg-amber-500 border-transparent', label: t('res.table.selected') },
                  { cls: 'ring-2 ring-amber-400/60 bg-white border-amber-300', label: t('res.recommended') },
                ].map(item => (
                  <span key={item.label} className="flex items-center gap-1.5">
                    <span className={`h-3 w-3 rounded border ${item.cls}`} />
                    {item.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative flex-1">
              <AnimatePresence mode="wait">
                {/* ✅ Зөвхөн зочид сонгоогүй үед л бүрэн overlay харуулна */}
                {!formData.guests ? (
                  <motion.div
                    key="hint-guests"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`absolute inset-0 z-20 flex items-center justify-center p-8 ${
                      isDark ? 'bg-neutral-950/85' : 'bg-stone-100/90'
                    } backdrop-blur-sm`}
                  >
                    <div className="max-w-xs text-center">
                      <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${
                        isDark ? 'bg-amber-500/15' : 'bg-amber-100'
                      }`}>
                        <MapPin className={`h-7 w-7 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                      </div>
                      <p className={`text-sm font-medium ${isDark ? 'text-stone-200' : 'text-stone-700'}`}>
                        {t('res.hint.guests')}
                      </p>
                    </div>
                  </motion.div>
                ) : tablesLoading ? (
                  <motion.div
                    key="load"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-20 flex items-center justify-center backdrop-blur-sm"
                  >
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {/* ✅ FloorPlanCanvas үргэлж render хийгдэнэ, зөвхөн tableStates-аар ялгана */}
              <FloorPlanCanvas
                tables={tables}
                tableStates={tableStates}
                selectedTableId={formData.tableId}
                recommendedTableId={canPickTable ? recommendedTableId : null}
                onSelectTable={(id) => {
                  // Зочид + огноо + цаг бүгд байж гэсэн нөхцөлд л сонгох боломжтой
                  if (canPickTable && tableStates[id] === 'available') {
                    patchForm({ tableId: id });
                  }
                }}
                floorId={floorId}
                floorLabel={floorLabel}
                isDark={isDark}
                lang={lang}
                t={t}
                listView={viewMode === 'list'}
                availableCount={canPickTable ? availableCount : 0}
              />
            </div>

            {/* Floor pills + recommend CTA */}
            <div className={`flex flex-col gap-3 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between ${isDark ? 'border-neutral-800' : 'border-stone-100'}`}>
              <div className={`inline-flex self-center rounded-full border p-1 sm:self-auto ${isDark ? 'border-neutral-700 bg-neutral-900' : 'border-stone-200 bg-stone-50'}`}>
                {FLOORS.map(floor => {
                  const label = lang === 'en' ? floor.labelEn : floor.labelMn;
                  const active = floorId === floor.id;
                  return (
                    <button
                      key={floor.id}
                      type="button"
                      onClick={() => { setFloorId(floor.id); patchForm({ tableId: '' }); }}
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                        active
                          ? isDark ? 'bg-white text-black shadow' : 'bg-stone-900 text-white shadow-md'
                          : muted
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {recommendedTableId && !formData.tableId && canPickTable && (
                <button
                  type="button"
                  onClick={() => patchForm({ tableId: recommendedTableId })}
                  className={`inline-flex items-center justify-center gap-2 self-center rounded-full px-4 py-2 text-xs font-bold transition-all sm:self-auto ${
                    isDark
                      ? 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/40 hover:bg-amber-500/25'
                      : 'bg-amber-50 text-amber-800 ring-1 ring-amber-300 hover:bg-amber-100'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {t('res.apply.recommended')}: {recommendedTableId}
                </button>
              )}
            </div>
          </div>

          {/* Booking sidebar */}
          <div className={`flex flex-col rounded-3xl border ${panel}`}>
            <div className={`border-b px-5 py-5 ${isDark ? 'border-neutral-800' : 'border-stone-100'}`}>
              <BookingStepper steps={steps} currentIndex={currentStepIndex} isDark={isDark} />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-5 overflow-y-auto p-5">
              {/* Step 1 — Guests */}
              <div>
                <label className={`mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${isDark ? 'text-amber-400/90' : 'text-amber-800'}`}>
                  <Users className="h-3.5 w-3.5" />
                  {t('res.step.guests')} *
                </label>
                <div className="flex flex-wrap gap-2">
                  {GUEST_OPTIONS.map(g => {
                    const active = formData.guests === g;
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => patchForm({ guests: g, tableId: '' })}
                        className={`min-w-[2.5rem] rounded-xl px-3 py-2 text-sm font-bold transition-all ${
                          active
                            ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25'
                            : isDark
                              ? 'bg-neutral-800 text-stone-300 hover:bg-neutral-700'
                              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2 — Time */}
              <div>
                <label className={`mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${isDark ? 'text-amber-400/90' : 'text-amber-800'}`}>
                  <ClockIcon className="h-3.5 w-3.5" />
                  {t('res.step.datetime')} *
                </label>
                {!formData.date ? (
                  <p className={`text-xs ${muted}`}>{t('res.pick.date')}</p>
                ) : slotsLoading ? (
                  <div className="grid grid-cols-4 gap-1.5">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className={`h-9 animate-pulse rounded-lg ${isDark ? 'bg-neutral-800' : 'bg-stone-100'}`} />
                    ))}
                  </div>
                ) : (
                  <div className="max-h-40 overflow-y-auto pr-1">
                    {renderSlotGroup(t('res.time.lunch'), lunch)}
                    {renderSlotGroup(t('res.time.evening'), evening)}
                  </div>
                )}
              </div>

              {/* Summary */}
              <AnimatePresence>
                {(formData.tableId || (formData.date && formData.time)) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`overflow-hidden rounded-2xl border ${
                      isDark
                        ? 'border-amber-500/25 bg-gradient-to-br from-amber-500/10 to-transparent'
                        : 'border-amber-200 bg-gradient-to-br from-amber-50 to-white'
                    }`}
                  >
                    <div className="p-4">
                      <p className={`mb-3 text-[10px] font-bold uppercase tracking-wider ${muted}`}>{t('res.summary.title')}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {formData.guests && (
                          <div>
                            <span className={muted}>{t('res.form.guests')}</span>
                            <p className="font-bold">{formData.guests} {t('res.form.guests.unit')}</p>
                          </div>
                        )}
                        {formData.date && (
                          <div>
                            <span className={muted}>{t('res.form.date')}</span>
                            <p className="font-bold">{formatDateLabel(formData.date, lang)}</p>
                          </div>
                        )}
                        {formData.time && (
                          <div>
                            <span className={muted}>{t('res.form.time')}</span>
                            <p className="font-bold">{formData.time}</p>
                          </div>
                        )}
                        {formData.tableId && selectedTable && (
                          <div>
                            <span className={muted}>{t('res.selected.table')}</span>
                            <p className="font-bold text-amber-500">
                              {formData.tableId}
                              <span className={`ml-1 text-xs font-normal ${muted}`}>
                                ({selectedTable.seats || selectedTable.capacity} {t('res.form.guests.unit')})
                              </span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step 4 — Contact */}
              <div className={`space-y-3 border-t pt-4 ${isDark ? 'border-neutral-800' : 'border-stone-100'}`}>
                <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-amber-400/90' : 'text-amber-800'}`}>
                  {t('res.step.details')}
                </label>
                <input name="name"  type="text"  value={formData.name}  onChange={handleChange} placeholder={`${t('res.form.name')} *`}  required className={inputCls} />
                <input name="phone" type="tel"   maxLength={8} value={formData.phone} onChange={e => patchForm({ phone: e.target.value.replace(/\D/g, '').slice(0, 8) })} placeholder={`${t('res.form.phone')} *`} required className={inputCls} />
                <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder={t('res.form.email')} className={inputCls} />
                <textarea name="message" rows={2} value={formData.message} onChange={handleChange} placeholder={t('res.form.note')} className={`${inputCls} resize-none`} />
              </div>

              {/* Table type */}
              <div className="grid grid-cols-2 gap-2">
                <label className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 transition-all ${
                  formData.tableType === 'standard'
                    ? isDark ? 'border-amber-500/60 bg-amber-500/10' : 'border-amber-400 bg-amber-50'
                    : isDark ? 'border-neutral-700' : 'border-stone-200'
                }`}>
                  <input type="radio" name="tableType" value="standard" checked={formData.tableType === 'standard'} onChange={handleChange} className="sr-only" />
                  <Utensils className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-semibold">Стандарт</span>
                </label>
                <button
                  type="button"
                  onClick={() => navigate('/reservation/vip')}
                  className={`flex items-center justify-between rounded-xl border p-3 transition-all ${
                    isDark ? 'border-neutral-700 hover:border-amber-500/40' : 'border-stone-200 hover:border-amber-400 hover:bg-amber-50/50'
                  }`}
                >
                  <span className="flex items-center gap-2 text-xs font-semibold">
                    <Crown className="h-4 w-4 text-amber-500" />
                    VIP
                  </span>
                  <ChevronRight className={`h-4 w-4 ${muted}`} />
                </button>
              </div>

              {status.text && (
                <p className={`rounded-lg px-3 py-2 text-xs font-medium ${
                  status.type === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                }`}>
                  {status.text}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !formData.tableId}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 py-4 text-sm font-bold text-black shadow-lg shadow-amber-600/25 transition-all hover:from-amber-400 hover:to-amber-500 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {isSubmitting ? t('res.sending') : t('res.submit')}
                {!isSubmitting && <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
              </button>

              <a href={`tel:${CONTACT.phone}`} className={`flex items-center justify-center gap-2 text-xs font-medium ${muted} hover:text-amber-500`}>
                <Phone className="h-3.5 w-3.5" />
                {CONTACT.phone}
              </a>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
