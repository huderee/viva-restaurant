// src/components/admin/LoginPage.jsx
import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, Loader2, Mail, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/images/logo.png';

export function LoginPage({ onSuccess }) {
  const { login, error: authError } = useAuth();
  const [tab, setTab]         = useState('login'); // 'login' | 'register'
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [regForm,   setRegForm]   = useState({
    username: '', password: '', confirmPassword: '', name: '', email: '',
  });

  // ===== НЭВТРЭХ =====
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.username || !loginForm.password) return;
    setLoading(true);
    setError('');
    const ok = await login(loginForm.username, loginForm.password);
    setLoading(false);
    if (ok) onSuccess();
    else setError(authError || 'Нэвтрэхэд алдаа гарлаа');
  };

  // ===== БҮРТГҮҮЛЭХ =====
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!regForm.username || !regForm.password || !regForm.name || !regForm.email) {
      setError('Бүх талбарыг бөглөнө үү'); return;
    }
    if (regForm.password.length < 6) {
      setError('Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой'); return;
    }
    if (regForm.password !== regForm.confirmPassword) {
      setError('Нууц үг таарахгүй байна'); return;
    }

    setLoading(true);
    try {
      const res  = await fetch('http://localhost:5000/api/auth/register-first', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          username: regForm.username,
          password: regForm.password,
          name:     regForm.name,
          email:    regForm.email,
          role:     'admin',
        }),
      });
      const json = await res.json();

      if (!json.success) {
        setError(json.message || 'Бүртгэхэд алдаа гарлаа');
      } else {
        setSuccess('✅ Бүртгэл амжилттай үүслээ! Одоо нэвтэрнэ үү.');
        setTab('login');
        setLoginForm({ username: regForm.username, password: '' });
        setRegForm({ username: '', password: '', confirmPassword: '', name: '', email: '' });
      }
    } catch {
      setError('Сервертэй холбогдож чадсангүй');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Арын гэрэл */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <img src={logo} alt="HuuK" className="h-16 w-auto" />
            <div className="text-left">
              <div className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">HuuK</div>
              <div className="text-xs text-slate-400">Админы систем</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Таб */}
          <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setTab('login'); setError(''); setSuccess(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === 'login'
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" /> Нэвтрэх
            </button>
            <button
              onClick={() => { setTab('register'); setError(''); setSuccess(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === 'register'
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" /> Бүртгүүлэх
            </button>
          </div>

          {/* Амжилтын мессеж */}
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 mb-4">
              <p className="text-emerald-400 text-sm text-center">{success}</p>
            </div>
          )}

          {/* Алдааны мессеж */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {/* ===== НЭВТРЭХ FORM ===== */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Хэрэглэгчийн нэр</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={loginForm.username}
                    onChange={e => setLoginForm(f => ({ ...f, username: e.target.value }))}
                    placeholder="Нэвтрэх нэр"
                    autoComplete="username"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Нууц үг</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={loginForm.password}
                    onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:border-emerald-500 transition-all"
                  />
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !loginForm.username || !loginForm.password}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 mt-2"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Нэвтэрч байна...</> : <><LogIn className="w-4 h-4" /> Нэвтрэх</>}
              </button>
            </form>
          )}

          {/* ===== БҮРТГҮҮЛЭХ FORM ===== */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Нэр */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Нэр</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={regForm.name}
                      onChange={e => setRegForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Нэр"
                      className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Хэрэглэгчийн нэр</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={regForm.username}
                      onChange={e => setRegForm(f => ({ ...f, username: e.target.value }))}
                      placeholder="Нэвтрэх нэр"
                      autoComplete="username"
                      className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Имэйл */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">И-мэйл</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={regForm.email}
                    onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              {/* Нууц үг */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Нууц үг</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={regForm.password}
                    onChange={e => setRegForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:border-emerald-500 transition-all"
                  />
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Нууц үг давтах */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Нууц үг давтах</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={regForm.confirmPassword}
                    onChange={e => setRegForm(f => ({ ...f, confirmPassword: e.target.value }))}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 mt-2"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Бүртгэж байна...</> : <><UserPlus className="w-4 h-4" /> Бүртгүүлэх</>}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          © 2026 HuuK Restaurant. Бүх эрх хамгаалагдсан.
        </p>
      </div>
    </div>
  );
}