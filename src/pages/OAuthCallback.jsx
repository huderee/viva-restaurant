// src/pages/OAuthCallback.jsx
// Backend OAuth-аас #token=... fragment-аар буцаасан токеныг авч хадгална
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertTriangle } from 'lucide-react';
import api from '../lib/api';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const run = async () => {
      // Token нь URL-ийн hash fragment-д ирнэ: #token=...
      const hash = window.location.hash || '';
      const params = new URLSearchParams(hash.replace(/^#/, ''));
      const token  = params.get('token');
      if (!token) {
        setError('Токен олдсонгүй');
        setTimeout(() => navigate('/login?error=missing_token', { replace: true }), 1200);
        return;
      }
      try {
        api.setToken(token);
        // Хэрэглэгчийн мэдээлэл татна
        await api.get('/auth/me');
        // Hash-ийг URL-аас цэвэрлээд home руу шилжүүлнэ
        window.history.replaceState({}, document.title, '/');
        navigate('/', { replace: true });
        // Reload to ensure AuthContext picks up the new token
        window.location.reload();
      } catch (e) {
        api.setToken(null);
        setError('Нэвтрэхэд алдаа гарлаа');
        setTimeout(() => navigate('/login?error=oauth_verify', { replace: true }), 1500);
      }
    };
    run();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-4">
      <div className="flex flex-col items-center gap-4 text-center">
        {error ? (
          <>
            <div className="w-12 h-12 rounded-full bg-red-500/15 border border-red-500/40 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <p className="text-red-400">{error}</p>
            <p className="text-xs text-slate-400">Нэвтрэх хуудас руу буцаж байна...</p>
          </>
        ) : (
          <>
            <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
            <p className="text-slate-300">Нэвтрэлт баталгаажуулж байна...</p>
          </>
        )}
      </div>
    </div>
  );
}
