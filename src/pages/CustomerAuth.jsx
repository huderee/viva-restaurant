// src/pages/CustomerAuth.jsx
// Public customer login / register — split-screen, social buttons (mocked)
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, User, Eye, EyeOff, Loader2, Mail, UserPlus, LogIn, Phone, ArrowLeft,
  CheckCircle, Calendar, ShoppingBag, ListChecks, Sparkles,
} from 'lucide-react';

import { useAuth }     from '../contexts/AuthContext';
import { useTheme }    from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

import logo from '../assets/images/logo.png';

/* ───── Password strength ───── */
function getPasswordStrength(pwd) {
  if (!pwd) return { score: 0 };
  let s = 0;
  if (pwd.length >= 6)  s++;
  if (pwd.length >= 10) s++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) s++;
  if (/\d/.test(pwd))   s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return { score: Math.min(4, s) };
}

/* ───── Brand SVG icons (no extra dep) ───── */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C33.6 6.5 29 4.5 24 4.5 13 4.5 4 13.5 4 24.5s9 20 20 20 20-9 20-20c0-1.4-.1-2.7-.4-4z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C33.6 6.5 29 4.5 24 4.5c-7.4 0-13.8 4.1-17.7 10.2z"/>
    <path fill="#4CAF50" d="M24 44.5c4.9 0 9.4-1.9 12.7-5l-5.9-5c-1.9 1.4-4.4 2.3-6.8 2.3-5.2 0-9.7-3.4-11.3-8l-6.5 5C9.9 40.4 16.4 44.5 24 44.5z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l5.9 5c-.4.4 6.5-4.7 6.5-14.2 0-1.4-.1-2.7-.4-4z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#1877F2" d="M24 12c0-6.6-5.4-12-12-12S0 5.4 0 12c0 6 4.4 11 10.1 11.9V15.5H7.1V12h3V9.4c0-3 1.8-4.6 4.5-4.6 1.3 0 2.6.2 2.6.2v2.9h-1.5c-1.5 0-1.9.9-1.9 1.8V12h3.3l-.5 3.5h-2.8v8.4C19.6 23 24 18 24 12z"/>
  </svg>
);

export default function CustomerAuth() {
  const { login, register, isAuthenticated } = useAuth();
  const { isDark } = useTheme();
  const { t }      = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/';

  const [tab, setTab]           = useState('login');
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');
  const [remember, setRemember] = useState(true);
  const [socialMsg, setSocialMsg] = useState('');

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [regForm,   setRegForm]   = useState({
    username: '', password: '', confirmPassword: '', name: '', email: '', phone: '',
  });

  const firstInputRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) navigate(redirectTo, { replace: true });
  }, [isAuthenticated, navigate, redirectTo]);

  useEffect(() => {
    setError(''); setSuccess(''); setSocialMsg('');
    setTimeout(() => firstInputRef.current?.focus(), 50);
  }, [tab]);

  const pwd = tab === 'register' ? regForm.password : '';
  const strength = useMemo(() => getPasswordStrength(pwd), [pwd]);
  const strengthLabels = ['', t('auth.pwd.weak'), t('auth.pwd.fair'), t('auth.pwd.good'), t('auth.pwd.strong')];
  const strengthColors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-500'];

  const handleSocial = (provider) => {
    const apiBase = import.meta.env.VITE_API_URL
      || (window.location.hostname.endsWith('.vercel.app')
        ? 'https://viva-restaurant-api.vercel.app/api'
        : '/api');
    if (provider === 'Google') {
      window.location.href = `${apiBase}/auth/google`;
      return;
    }
    if (provider === 'Facebook') {
      window.location.href = `${apiBase}/auth/facebook`;
      return;
    }
    setSocialMsg(`${provider} — ${t('auth.social.soon')}`);
    setTimeout(() => setSocialMsg(''), 2200);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const u = loginForm.username.trim();
    const p = loginForm.password;
    if (!u || !p) { setError(t('auth.err.required')); return; }
    setLoading(true); setError('');
    const res = await login(u, p);
    setLoading(false);
    if (res.ok) navigate(redirectTo, { replace: true });
    else setError(res.message || t('auth.err.login'));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    const { username, password, confirmPassword, name, email, phone } = regForm;
    if (!username.trim() || !password || !name.trim() || !email.trim()) {
      setError(t('auth.err.required')); return;
    }
    if (password.length < 6) { setError(t('auth.err.short.pwd')); return; }
    if (password !== confirmPassword) { setError(t('auth.err.mismatch')); return; }
    if (phone && !/^\d{8}$/.test(phone)) { setError(t('auth.err.phone')); return; }

    setLoading(true);
    const res = await register({
      username: username.trim(), password,
      name: name.trim(), email: email.trim().toLowerCase(),
      phone: phone.trim(),
    });
    setLoading(false);
    if (res.ok) {
      setSuccess(t('auth.success'));
      setTimeout(() => navigate(redirectTo, { replace: true }), 700);
    } else {
      setError(res.message || t('auth.err.register'));
    }
  };

  /* Style */
  const pageBg     = isDark ? 'bg-slate-950' : 'bg-gray-50';
  const wrapperBg  = isDark ? 'bg-slate-900 border-white/5' : 'bg-white border-gray-200/70';
  const cardText   = isDark ? 'text-white' : 'text-gray-900';
  const labelCls   = isDark ? 'text-slate-300' : 'text-gray-700';
  const subCls     = isDark ? 'text-slate-400' : 'text-gray-500';
  const inputCls   = isDark
    ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-amber-500'
    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-amber-500';
  const socialBtn  = isDark
    ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
    : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700';
  const dividerCls = isDark ? 'bg-white/10' : 'bg-gray-200';
  const helperLink = isDark ? 'text-slate-400 hover:text-amber-300' : 'text-gray-600 hover:text-amber-600';

  const formVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
    exit:    { opacity: 0, y: -12, transition: { duration: 0.2 } },
  };

  return (
    <div className={`min-h-screen ${pageBg} flex items-center justify-center p-4 sm:p-6 transition-colors duration-300 relative overflow-hidden`}>
      {/* Soft decorative orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[28rem] h-[28rem] bg-amber-500/12 rounded-full blur-3xl"
          animate={{ y: [0, 18, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className={`relative w-full max-w-md ${wrapperBg} border rounded-3xl shadow-2xl overflow-hidden`}
      >
        <div className="p-6 sm:p-8 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <Link to="/" className={`inline-flex items-center gap-2 text-xs ${helperLink} transition-colors`}>
              <ArrowLeft className="w-3.5 h-3.5" /> {t('auth.back.home')}
            </Link>
            <div className="flex items-center gap-2">
              <img src={logo} alt="Viva" className={`h-7 ${isDark ? '' : 'invert'}`} />
              <span className={`text-sm font-black ${cardText}`}>Viva</span>
            </div>
          </div>

          <h1 className={`font-bold text-3xl sm:text-4xl mb-1.5 ${cardText}`}>
            {tab === 'register' ? t('auth.create') : t('auth.welcome.back')}
          </h1>
          <p className={`text-sm mb-6 ${subCls}`}>
            {tab === 'register' ? t('auth.signup.cta') : t('auth.signin.cta')}
          </p>

          {/* Status */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 mb-4 flex items-start gap-2"
              >
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-emerald-500 text-sm">{success}</p>
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4"
              >
                <p className="text-red-500 text-sm text-center">{error}</p>
              </motion.div>
            )}
            {socialMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mb-4"
              >
                <p className="text-amber-500 text-sm text-center">{socialMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {tab === 'login' && (
              <motion.form
                key="login"
                variants={formVariants} initial="initial" animate="animate" exit="exit"
                onSubmit={handleLogin}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className={`text-sm font-medium ${labelCls}`}>{t('auth.label.username')}</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      ref={firstInputRef}
                      type="text"
                      value={loginForm.username}
                      onChange={e => setLoginForm(f => ({ ...f, username: e.target.value }))}
                      placeholder={t('auth.ph.username')}
                      autoComplete="username"
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none transition-all ${inputCls}`}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={`text-sm font-medium ${labelCls}`}>{t('auth.label.password')}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={loginForm.password}
                      onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                      placeholder={t('auth.ph.password')}
                      autoComplete="current-password"
                      className={`w-full pl-10 pr-12 py-2.5 border rounded-xl focus:outline-none transition-all ${inputCls}`}
                    />
                    <button type="button" onClick={() => setShowPass(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className={`inline-flex items-center gap-2 cursor-pointer ${subCls}`}>
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={e => setRemember(e.target.checked)}
                      className="rounded accent-amber-500"
                    />
                    {t('auth.remember')}
                  </label>
                  <button type="button" onClick={() => setSocialMsg(t('auth.social.soon'))} className="text-amber-500 hover:text-amber-400 font-semibold">
                    {t('auth.forgot')}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading || !loginForm.username || !loginForm.password}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md hover:shadow-amber-500/40"
                >
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> {t('auth.btn.login.ing')}</>
                    : <><LogIn className="w-4 h-4" /> {t('auth.btn.login')}</>}
                </button>
              </motion.form>
            )}

            {tab === 'register' && (
              <motion.form
                key="register"
                variants={formVariants} initial="initial" animate="animate" exit="exit"
                onSubmit={handleRegister}
                className="space-y-3"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className={`text-xs font-medium ${labelCls}`}>{t('auth.label.name')}</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        ref={firstInputRef}
                        type="text"
                        value={regForm.name}
                        onChange={e => setRegForm(f => ({ ...f, name: e.target.value }))}
                        placeholder={t('auth.ph.name')}
                        className={`w-full pl-10 pr-3 py-2.5 border rounded-xl focus:outline-none transition-all ${inputCls}`}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-xs font-medium ${labelCls}`}>{t('auth.label.username')}</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={regForm.username}
                        onChange={e => setRegForm(f => ({ ...f, username: e.target.value.replace(/\s/g, '') }))}
                        placeholder={t('auth.ph.username.short')}
                        autoComplete="username"
                        className={`w-full pl-10 pr-3 py-2.5 border rounded-xl focus:outline-none transition-all ${inputCls}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={`text-xs font-medium ${labelCls}`}>{t('auth.label.email')}</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={regForm.email}
                      onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))}
                      placeholder={t('auth.ph.email')}
                      autoComplete="email"
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none transition-all ${inputCls}`}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={`text-xs font-medium ${labelCls}`}>{t('auth.label.phone')}</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      value={regForm.phone}
                      onChange={e => setRegForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 8) }))}
                      placeholder={t('auth.ph.phone')}
                      autoComplete="tel"
                      maxLength={8}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none transition-all ${inputCls}`}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={`text-xs font-medium ${labelCls}`}>{t('auth.label.password')}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={regForm.password}
                      onChange={e => setRegForm(f => ({ ...f, password: e.target.value }))}
                      placeholder={t('auth.ph.password')}
                      autoComplete="new-password"
                      className={`w-full pl-10 pr-12 py-2.5 border rounded-xl focus:outline-none transition-all ${inputCls}`}
                    />
                    <button type="button" onClick={() => setShowPass(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {regForm.password && (
                    <div className="flex items-center gap-2 pt-1">
                      <div className="flex-1 grid grid-cols-4 gap-1">
                        {[1,2,3,4].map(i => (
                          <div key={i} className={`h-1 rounded-full transition-colors ${i <= strength.score ? strengthColors[strength.score] : (isDark ? 'bg-white/10' : 'bg-gray-200')}`} />
                        ))}
                      </div>
                      <span className={`text-[10px] font-semibold uppercase tracking-wide ${
                        strength.score <= 1 ? 'text-red-500'
                          : strength.score === 2 ? 'text-orange-500'
                          : strength.score === 3 ? 'text-yellow-500'
                          : 'text-emerald-500'
                      }`}>
                        {strengthLabels[strength.score]}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className={`text-xs font-medium ${labelCls}`}>{t('auth.label.confirm')}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={regForm.confirmPassword}
                      onChange={e => setRegForm(f => ({ ...f, confirmPassword: e.target.value }))}
                      placeholder={t('auth.ph.password')}
                      autoComplete="new-password"
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none transition-all ${inputCls}`}
                    />
                    {regForm.confirmPassword && regForm.password === regForm.confirmPassword && (
                      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 mt-2 active:scale-95 shadow-md hover:shadow-amber-500/40"
                >
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> {t('auth.btn.register.ing')}</>
                    : <><UserPlus className="w-4 h-4" /> {t('auth.btn.register')}</>}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Social divider */}
          <div className="my-5 flex items-center gap-3">
            <span className={`flex-1 h-px ${dividerCls}`} />
            <span className={`text-[11px] uppercase tracking-wider ${subCls}`}>{t('auth.continue.with')}</span>
            <span className={`flex-1 h-px ${dividerCls}`} />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocial('Google')}
              className={`flex items-center justify-center gap-2 py-2.5 border rounded-xl text-sm font-medium transition-all hover:scale-[1.02] active:scale-95 ${socialBtn}`}
            >
              <GoogleIcon /> Google
            </button>
            <button
              type="button"
              onClick={() => handleSocial('Facebook')}
              className={`flex items-center justify-center gap-2 py-2.5 border rounded-xl text-sm font-medium transition-all hover:scale-[1.02] active:scale-95 ${socialBtn}`}
            >
              <FacebookIcon /> Facebook
            </button>
          </div>

          {/* Toggle link */}
          <p className={`text-center text-sm mt-6 ${subCls}`}>
            {tab === 'login'
              ? <>{t('auth.no.account')}{' '}
                  <button type="button" onClick={() => setTab('register')} className="text-amber-500 hover:text-amber-400 font-semibold">
                    {t('auth.tab.register')}
                  </button>
                </>
              : <>{t('auth.have.account')}{' '}
                  <button type="button" onClick={() => setTab('login')} className="text-amber-500 hover:text-amber-400 font-semibold">
                    {t('auth.tab.login')}
                  </button>
                </>
            }
          </p>
        </div>
      </motion.div>
    </div>
  );
}
