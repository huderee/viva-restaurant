// src/components/admin/GlobalStyles.jsx
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

    :root {
      --bg-base:      #080c14;
      --bg-surface:   #0d1422;
      --bg-elevated:  #111827;
      --bg-hover:     #1a2236;
      --border:       rgba(255,255,255,0.07);
      --border-light: rgba(255,255,255,0.12);
      --text-primary: #f0f4ff;
      --text-muted:   #8899b8;
      --text-faint:   #4a5a78;
      --accent:       #f59e0b;
      --accent-glow:  rgba(245,158,11,0.25);
      --accent-soft:  rgba(245,158,11,0.12);
      --green:        #10b981;
      --green-soft:   rgba(16,185,129,0.12);
      --blue:         #3b82f6;
      --blue-soft:    rgba(59,130,246,0.12);
      --red:          #ef4444;
      --red-soft:     rgba(239,68,68,0.12);
      --purple:       #8b5cf6;
      --purple-soft:  rgba(139,92,246,0.12);
      --radius-sm:    8px;
      --radius-md:    12px;
      --radius-lg:    16px;
      --radius-xl:    20px;
      --shadow-glow:  0 0 30px rgba(245,158,11,0.15);
      --font-main:    'Sora', sans-serif;
      --font-mono:    'JetBrains Mono', monospace;
    }

    * { box-sizing: border-box; }

    .admin-root {
      font-family: var(--font-main);
      background: var(--bg-base);
      color: var(--text-primary);
      min-height: 100vh;
    }

    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border-light); border-radius: 99px; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; } to { opacity: 1; }
    }
    @keyframes shimmer {
      0%   { background-position: -200% 0; }
      100% { background-position:  200% 0; }
    }
    @keyframes pulse-ring {
      0%   { box-shadow: 0 0 0 0 rgba(245,158,11,0.4); }
      70%  { box-shadow: 0 0 0 8px rgba(245,158,11,0); }
      100% { box-shadow: 0 0 0 0 rgba(245,158,11,0); }
    }
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes slide-in {
      from { opacity: 0; transform: translateX(-8px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes scale-in {
      from { opacity: 0; transform: scale(0.92); }
      to   { opacity: 1; transform: scale(1); }
    }

    .anim-fade-up   { animation: fadeUp 0.35s ease forwards; }
    .anim-fade-in   { animation: fadeIn 0.25s ease forwards; }
    .anim-scale-in  { animation: scale-in 0.2s ease forwards; }
    .anim-slide-in  { animation: slide-in 0.25s ease forwards; }

    .noise-overlay::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 0;
    }

    .glass-card {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      backdrop-filter: blur(12px);
      position: relative;
      overflow: hidden;
    }
    .glass-card::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.025) 0%, transparent 60%);
      pointer-events: none;
    }

    .stat-card-shine:hover::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%);
      animation: shimmer 0.6s ease;
      background-size: 200% 100%;
      pointer-events: none;
      border-radius: inherit;
    }

    .data-row {
      border-bottom: 1px solid var(--border);
      transition: background 0.15s;
    }
    .data-row:hover { background: var(--bg-hover); }
    .data-row:last-child { border-bottom: none; }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 10px;
      border-radius: 99px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.02em;
      border: 1px solid transparent;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: var(--radius-sm);
      font-family: var(--font-main);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.18s;
    }
    .btn:active { transform: scale(0.97); }
    .btn-primary {
      background: var(--accent);
      color: #000;
      box-shadow: 0 4px 16px var(--accent-glow);
    }
    .btn-primary:hover { background: #fbbf24; box-shadow: 0 6px 20px rgba(245,158,11,0.4); }
    .btn-ghost {
      background: var(--border);
      color: var(--text-primary);
      border: 1px solid var(--border-light);
    }
    .btn-ghost:hover { background: var(--bg-hover); border-color: rgba(255,255,255,0.2); }
    .btn-danger {
      background: var(--red-soft);
      color: var(--red);
      border: 1px solid rgba(239,68,68,0.25);
    }
    .btn-danger:hover { background: rgba(239,68,68,0.2); }
    .btn-success {
      background: var(--green-soft);
      color: var(--green);
      border: 1px solid rgba(16,185,129,0.25);
    }
    .btn-success:hover { background: rgba(16,185,129,0.2); }

    .input-field {
      background: var(--bg-elevated);
      border: 1px solid var(--border-light);
      color: var(--text-primary);
      border-radius: var(--radius-sm);
      padding: 9px 14px;
      font-family: var(--font-main);
      font-size: 13px;
      outline: none;
      transition: border-color 0.18s, box-shadow 0.18s;
      width: 100%;
    }
    .input-field:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-soft);
    }
    .input-field::placeholder { color: var(--text-faint); }

    .nav-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.18s;
      border: 1px solid transparent;
      font-size: 13.5px;
      font-weight: 500;
      color: var(--text-muted);
    }
    .nav-item:hover {
      background: var(--bg-hover);
      color: var(--text-primary);
    }
    .nav-item.active {
      background: var(--accent-soft);
      border-color: rgba(245,158,11,0.3);
      color: var(--accent);
    }

    .dropdown-menu {
      background: var(--bg-elevated);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04);
      overflow: hidden;
      animation: scale-in 0.15s ease;
      transform-origin: top right;
    }
    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 9px 14px;
      font-size: 13px;
      cursor: pointer;
      transition: background 0.12s;
      color: var(--text-muted);
      width: 100%;
      border: none;
      background: none;
      font-family: var(--font-main);
      text-align: left;
    }
    .dropdown-item:hover { background: var(--bg-hover); color: var(--text-primary); }
    .dropdown-item.danger { color: var(--red); }
    .dropdown-item.danger:hover { background: var(--red-soft); }
    .dropdown-divider { height: 1px; background: var(--border); margin: 4px 0; }

    .notif-dot {
      animation: pulse-ring 2s infinite;
    }

    .skeleton {
      background: linear-gradient(90deg, var(--bg-elevated) 25%, var(--bg-hover) 50%, var(--bg-elevated) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 6px;
    }

    .progress-bar {
      height: 3px;
      border-radius: 99px;
      background: var(--border);
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      border-radius: 99px;
      background: linear-gradient(90deg, var(--accent), #f97316);
      transition: width 0.6s ease;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      font-family: var(--font-mono);
    }

    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.75);
      backdrop-filter: blur(6px);
      z-index: 100;
      animation: fadeIn 0.2s ease;
    }
    .modal-content {
      background: var(--bg-elevated);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      box-shadow: 0 40px 100px rgba(0,0,0,0.6);
      animation: scale-in 0.2s ease;
    }

    .table-wrap {
      overflow: auto;
      border-radius: var(--radius-lg);
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
    }
    .data-table th {
      padding: 12px 16px;
      text-align: left;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--text-faint);
      background: rgba(255,255,255,0.025);
      white-space: nowrap;
    }
    .data-table td {
      padding: 14px 16px;
      font-size: 13px;
      vertical-align: middle;
    }

    .mono { font-family: var(--font-mono); }

    .text-gradient-amber {
      background: linear-gradient(135deg, #f59e0b, #f97316);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .text-gradient-green {
      background: linear-gradient(135deg, #10b981, #34d399);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .logo-glow {
      filter: drop-shadow(0 0 12px rgba(245,158,11,0.3));
    }

    .avatar {
      width: 34px; height: 34px;
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 700;
      flex-shrink: 0;
    }

    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      background: var(--bg-elevated);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      padding: 12px 18px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.4);
      animation: fadeUp 0.25s ease;
    }

    .menu-card {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      overflow: hidden;
      transition: all 0.2s;
      cursor: pointer;
    }
    .menu-card:hover {
      border-color: rgba(245,158,11,0.35);
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.3);
    }

    mark {
      background: var(--accent-soft);
      color: var(--accent);
      border-radius: 3px;
      padding: 0 2px;
    }

    .res-card {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 16px;
      transition: all 0.18s;
    }
    .res-card:hover {
      border-color: var(--border-light);
      background: var(--bg-elevated);
    }

    .toggle {
      width: 36px; height: 20px;
      border-radius: 99px;
      border: none;
      cursor: pointer;
      position: relative;
      transition: background 0.2s;
      flex-shrink: 0;
    }
    .toggle::after {
      content: '';
      position: absolute;
      top: 3px; left: 3px;
      width: 14px; height: 14px;
      border-radius: 50%;
      background: #fff;
      transition: transform 0.2s;
    }
    .toggle.on { background: var(--green); }
    .toggle.on::after { transform: translateX(16px); }
    .toggle.off { background: var(--text-faint); }
  `}</style>
);

export default GlobalStyles;