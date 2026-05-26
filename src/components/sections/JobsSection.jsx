// src/components/sections/JobsSection.jsx
import React, { useState, useEffect } from 'react';
import { ChevronDown, CheckCircle2, Mail, Phone, Send, X } from 'lucide-react';
import api from '../../lib/api';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { CONTACT } from '../../lib/constants';

import { RESTAURANT_IMAGES } from '../../assets/images/restaurantImages';

const { diningHall, barLounge, loungeGarden, chefKitchen } = RESTAURANT_IMAGES;

const ROLE_IMAGES = [
  { match: /тогооч|chef/i, src: chefKitchen },
  { match: /зөөгч|waiter|waitress/i, src: diningHall },
  { match: /бармен|bartender/i, src: barLounge },
  { match: /админ|administrator/i, src: loungeGarden },
];

function jobImage(title) {
  const hit = ROLE_IMAGES.find(({ match }) => match.test(title || ''));
  return hit ? hit.src : diningHall;
}

/* ─── Анкет ─────────────────────────────────────────────── */
function ApplyForm({ onClose, t, isDark, selectedJob }) {
  const jobTitle = selectedJob?.title || '';
  const jobId = selectedJob?.id || null;

  const [form, setForm] = useState({ name: '', phone: '', email: '', position: jobTitle, msg: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(f => ({ ...f, position: jobTitle || f.position }));
  }, [jobTitle]);

  const inputCls = `w-full rounded-lg border px-4 py-3 text-sm outline-none transition-colors ${
    isDark
      ? 'border-neutral-700 bg-neutral-900 text-white placeholder:text-neutral-500 focus:border-amber-500'
      : 'border-stone-300 bg-white text-stone-900 focus:border-amber-500'
  }`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      await api.post('/jobs/apply', {
        name: form.name.trim(),
        phone: form.phone.replace(/\D/g, ''),
        email: form.email.trim(),
        position: form.position.trim(),
        message: form.msg.trim(),
        jobId,
      });
      setStatus('done');
    } catch (err) {
      setStatus('idle');
      setError(err?.response?.data?.message || t('jobs.apply.error'));
    }
  };

  if (status === 'done') {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-amber-400" />
        <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-stone-900'}`}>
          {t('jobs.apply.success')}
        </p>
        <button type="button" onClick={onClose} className="rounded bg-amber-500 px-6 py-2 text-sm font-bold text-black hover:bg-amber-400">
          OK
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={`mb-1 block text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-stone-500'}`}>{t('jobs.apply.name')}</label>
          <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inputCls} />
        </div>
        <div>
          <label className={`mb-1 block text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-stone-500'}`}>{t('jobs.apply.phone')}</label>
          <input
            required
            type="tel"
            maxLength={8}
            value={form.phone}
            onChange={e => setForm(p => ({ ...p, phone: e.target.value.replace(/\D/g, '').slice(0, 8) }))}
            placeholder="99xxxxxx"
            className={inputCls}
          />
        </div>
      </div>
      <div>
        <label className={`mb-1 block text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-stone-500'}`}>{t('jobs.apply.email')}</label>
        <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className={inputCls} />
      </div>
      <div>
        <label className={`mb-1 block text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-stone-500'}`}>{t('jobs.apply.position')}</label>
        <input required value={form.position} onChange={e => setForm(p => ({ ...p, position: e.target.value }))} className={inputCls} />
      </div>
      <div>
        <label className={`mb-1 block text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-stone-500'}`}>{t('jobs.apply.msg')}</label>
        <textarea rows={4} value={form.msg} onChange={e => setForm(p => ({ ...p, msg: e.target.value }))} className={`${inputCls} resize-none`} />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="flex w-full items-center justify-center gap-2 rounded bg-amber-500 py-3 text-sm font-bold text-black transition-colors hover:bg-amber-400 disabled:opacity-60"
      >
        {status === 'sending' ? t('jobs.apply.sending') : t('jobs.apply.submit')}
      </button>
    </form>
  );
}

/* ─── Accordion мөр ─────────────────────────────────────── */
function AccordionRow({ label, value, isOpen, onToggle, isDark }) {
  return (
    <div className={`border-b ${isDark ? 'border-neutral-800' : 'border-stone-200'}`}>
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-medium transition-colors ${
          isDark ? 'bg-neutral-900 text-white hover:bg-neutral-800' : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
        }`}
      >
        <span>{label}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-amber-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className={`px-4 pb-4 pt-1 text-sm leading-relaxed ${isDark ? 'bg-neutral-950 text-neutral-300' : 'bg-stone-50 text-stone-600'}`}>
          {value}
        </div>
      )}
    </div>
  );
}

/* ─── Ажлын байрны карт ─────────────────────────────────── */
function JobCard({ job, lang, t, isDark, onApply }) {
  const title = lang === 'en' ? job.titleEn : job.titleMn;
  const purpose = lang === 'en' ? job.purposeEn : job.purposeMn;
  const hours = lang === 'en' ? job.hoursEn : job.hoursMn;
  const salary = lang === 'en' ? job.salaryEn : job.salaryMn;
  const benefits = lang === 'en' ? job.benefitsEn : job.benefitsMn;
  const img = jobImage(title);

  const [openKey, setOpenKey] = useState(null);
  const toggle = (key) => setOpenKey(prev => (prev === key ? null : key));

  const rows = [
    { key: 'purpose', label: t('jobs.purpose'), value: purpose },
    { key: 'hours', label: t('jobs.hours'), value: hours },
    { key: 'salary', label: t('jobs.salary'), value: salary },
    { key: 'benefits', label: t('jobs.benefits'), value: benefits },
  ];

  return (
    <article className={`overflow-hidden ${isDark ? 'bg-black' : 'bg-white shadow-md'}`}>
      <div className="aspect-[4/3] w-full overflow-hidden">
        <img src={img} alt={title} className="h-full w-full object-cover" loading="lazy" />
      </div>

      <div className={`px-4 py-3 ${isDark ? 'bg-neutral-900' : 'bg-stone-800'}`}>
        <h3 className="font-bold uppercase tracking-wide text-amber-400">{title}</h3>
      </div>

      <div className={`overflow-hidden ${isDark ? 'border border-neutral-800' : 'border border-stone-200'}`}>
        {rows.map(row => (
          <AccordionRow
            key={row.key}
            label={row.label}
            value={row.value}
            isOpen={openKey === row.key}
            onToggle={() => toggle(row.key)}
            isDark={isDark}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => onApply(job)}
        className="flex w-full items-center justify-center gap-2 bg-amber-500 py-3.5 text-sm font-bold uppercase tracking-wide text-black transition-colors hover:bg-amber-400"
      >
        <Send size={14} />
        {t('jobs.applyBtn')}
      </button>
    </article>
  );
}

/* ─── Үндсэн ────────────────────────────────────────────── */
export default function JobsSection() {
  const { isDark } = useTheme();
  const { lang, t } = useLanguage();
  const [applyJob, setApplyJob] = useState(null);

  const cached = (() => {
    try {
      const raw = sessionStorage.getItem('jobs.cache');
      if (!raw) return null;
      const { data, exp } = JSON.parse(raw);
      return exp > Date.now() ? data : null;
    } catch {
      return null;
    }
  })();

  const [jobs, setJobs] = useState(cached || []);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await api.get('/jobs');
        const data = Array.isArray(r?.data) ? r.data : [];
        if (alive) setJobs(data);
        try {
          sessionStorage.setItem('jobs.cache', JSON.stringify({ data, exp: Date.now() + 5 * 60 * 1000 }));
        } catch {}
      } catch {
        if (alive && !cached) setJobs([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const openApply = (job) => {
    const title = lang === 'en' ? job.titleEn : job.titleMn;
    setApplyJob({ title, id: job._id });
  };

  const pageBg = isDark ? 'bg-black text-white' : 'bg-stone-50 text-stone-900';
  const heroTitle = isDark ? 'text-amber-400' : 'text-amber-700';

  return (
    <section className={`min-h-screen pt-24 pb-16 transition-colors duration-300 ${pageBg}`} id="careers">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* Hero — гарчиг + зураг */}
        <div className="mb-12 grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:mb-16">
          <div>
            <h1 className={`font-serif text-4xl font-bold uppercase leading-tight tracking-wide md:text-5xl lg:text-6xl ${heroTitle}`}>
              {t('jobs.badge')}
            </h1>
            <p className={`mt-4 max-w-md text-sm leading-relaxed md:text-base ${isDark ? 'text-neutral-400' : 'text-stone-600'}`}>
              {t('jobs.subtitle')}
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm overflow-hidden md:max-w-none">
            <img
              src={diningHall}
              alt="Viva Restaurant"
              className="aspect-[3/4] w-full rounded-sm object-cover shadow-2xl"
            />
          </div>
        </div>

        {/* Картын grid */}
        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2">
            {[1, 2].map(i => (
              <div key={i} className={`aspect-[3/4] animate-pulse ${isDark ? 'bg-neutral-900' : 'bg-stone-200'}`} />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <p className={`py-16 text-center ${isDark ? 'text-neutral-500' : 'text-stone-500'}`}>
            {lang === 'en' ? 'No open positions right now.' : 'Одоогоор нээлттэй ажлын байр алга.'}
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:gap-10">
            {jobs.map(job => (
              <JobCard
                key={job._id}
                job={job}
                lang={lang}
                t={t}
                isDark={isDark}
                onApply={openApply}
              />
            ))}
          </div>
        )}

        {/* Доод холбоо барих — энгийн */}
        <div className={`mt-14 border-t pt-8 text-center text-sm ${isDark ? 'border-neutral-800 text-neutral-400' : 'border-stone-200 text-stone-600'}`}>
          <p className="mb-3 font-medium">{t('jobs.contact.title')}</p>
          <p className="mb-4 max-w-lg mx-auto">{t('jobs.contact.desc')}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2 font-semibold text-amber-500 hover:text-amber-400">
              <Mail size={14} /> {CONTACT.email}
            </a>
            <a href={`tel:${CONTACT.phone}`} className="inline-flex items-center gap-2 font-semibold text-amber-500 hover:text-amber-400">
              <Phone size={14} /> {CONTACT.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Modal */}
      {applyJob !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={e => { if (e.target === e.currentTarget) setApplyJob(null); }}
          role="presentation"
        >
          <div className={`max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg p-6 shadow-2xl ${
            isDark ? 'bg-neutral-950 border border-neutral-800' : 'bg-white'
          }`}>
            <div className="mb-5 flex items-center justify-between">
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>{t('jobs.apply.title')}</h3>
              <button type="button" onClick={() => setApplyJob(null)} className="text-neutral-500 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <ApplyForm onClose={() => setApplyJob(null)} t={t} isDark={isDark} selectedJob={applyJob} />
          </div>
        </div>
      )}
    </section>
  );
}
