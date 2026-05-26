// src/components/ui/BackgroundGlow.jsx
// VIP хуудсыг шиг дэвсгэрийг бусад хэсэгт давхар ашиглахад зориулсан reusable component
import React from 'react';

export default function BackgroundGlow() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-20 -right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-20 -left-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: '1s' }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl" />
    </div>
  );
}
