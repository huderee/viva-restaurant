// src/components/admin/GlobalStyles.jsx
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

    :root, [data-theme="dark"] {
      --bg-base:      #030712;
      --bg-surface:   #090f1d;
      --bg-elevated:  #0f172a;
      --bg-hover:     #1e293b;
      --border:       rgba(255,255,255,0.05);
      --border-light: rgba(255,255,255,0.09);
      --border-glow:  rgba(245,158,11,0.15);
      --text-primary: #f8fafc;
      --text-muted:   #94a3b8;
      --text-faint:   #64748b;
      --accent:       #f59e0b;
      --accent-hover: #fbbf24;
      --accent-glow:  rgba(245,158,11,0.3);
      --accent-soft:  rgba(245,158,11,0.08);
      --green:        #10b981;
      --green-soft:   rgba(16,185,129,0.08);
      --blue:         #3b82f6;
      --blue-soft:    rgba(59,130,246,0.08);
      --red:          #ef4444;
      --red-soft:     rgba(239,68,68,0.08);
      --purple:       #8b5cf6;
      --purple-soft:  rgba(139,92,246,0.08);
      --radius-sm:    8px;
      --radius-md:    12px;
      --radius-lg:    18px;
      --radius-xl:    24px;
      --shadow-glow:  0 0 35px rgba(245,158,11,0.12);
      --font-main:    'Outfit', sans-serif;
      --font-mono:    'JetBrains Mono', monospace;
    }

    [data-theme="light"] {
      --bg-base:      #f8fafc;
      --bg-surface:   #ffffff;
      --bg-elevated:  #ffffff;
      --bg-hover:     #f1f5f9;
      --border:       rgba(15,23,42,0.06);
      --border-light: rgba(15,23,42,0.12);
      --border-glow:  rgba(217,119,6,0.15);
      --text-primary: #0f172a;
      --text-muted:   #64748b;
      --text-faint:   #94a3b8;
      --accent:       #d97706;
      --accent-hover: #b45309;
      --accent-glow:  rgba(217,119,6,0.2);
      --accent-soft:  rgba(217,119,6,0.06);
      --green-soft:   rgba(16,185,129,0.06);
      --blue-soft:    rgba(59,130,246,0.06);
      --red-soft:     rgba(239,68,68,0.06);
      --purple-soft:  rgba(139,92,246,0.06);
    }
    
    [data-theme="light"] .admin-header {
      background: rgba(255,255,255,0.8) !important;
    }
    
    [data-theme="light"] ::-webkit-scrollbar-thumb {
      background: rgba(15,23,42,0.15);
    }

    * { box-sizing: border-box; }

    .admin-root {
      font-family: var(--font-main);
      background: var(--bg-base);
      background-image:
        radial-gradient(ellipse 70% 40% at 50% -10%, rgba(245,158,11,0.09), transparent),
        radial-gradient(circle at 100% 100%, rgba(139,92,246,0.04), transparent),
        radial-gradient(circle at 0% 100%, rgba(59,130,246,0.03), transparent);
      color: var(--text-primary);
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
    }

    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border-light); border-radius: 99px; transition: background 0.2s; }
    ::-webkit-scrollbar-thumb:hover { background: var(--text-faint); }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(16px); }
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
      70%  { box-shadow: 0 0 0 10px rgba(245,158,11,0); }
      100% { box-shadow: 0 0 0 0 rgba(245,158,11,0); }
    }
    @keyframes slide-in {
      from { opacity: 0; transform: translateX(-12px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes scale-in {
      from { opacity: 0; transform: scale(0.96); }
      to   { opacity: 1; transform: scale(1); }
    }

    .anim-fade-up   { animation: fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .anim-fade-in   { animation: fadeIn 0.3s ease forwards; }
    .anim-scale-in  { animation: scale-in 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
    .anim-slide-in  { animation: slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

    .glass-card {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      position: relative;
      overflow: hidden;
      box-shadow: 0 10px 30px -10px rgba(0,0,0,0.3);
      transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
    }
    .glass-card::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.015) 0%, transparent 60%);
      pointer-events: none;
    }
    
    .glass-card-hover:hover {
      border-color: var(--border-glow);
      box-shadow: 0 20px 40px -15px rgba(0,0,0,0.4), var(--shadow-glow);
      transform: translateY(-2px);
    }

    .stat-card-shine:hover::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 55%, transparent 70%);
      animation: shimmer 0.8s ease;
      background-size: 200% 100%;
      pointer-events: none;
      border-radius: inherit;
    }

    .data-row {
      border-bottom: 1px solid var(--border);
      transition: background 0.2s, transform 0.2s;
    }
    .data-row:hover { 
      background: rgba(255,255,255,0.015);
      [data-theme="light"] & {
        background: rgba(15,23,42,0.01);
      }
    }
    .data-row:last-child { border-bottom: none; }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      border-radius: 99px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.01em;
      border: 1px solid transparent;
      text-transform: uppercase;
      font-family: var(--font-mono);
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      border-radius: var(--radius-md);
      font-family: var(--font-main);
      font-size: 13.5px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .btn:active { transform: scale(0.96); }
    
    .btn-primary {
      background: linear-gradient(135deg, var(--accent) 0%, #ea580c 100%);
      color: #030712;
      box-shadow: 0 4px 20px var(--accent-glow);
    }
    .btn-primary:hover { 
      background: linear-gradient(135deg, var(--accent-hover) 0%, #f97316 100%); 
      box-shadow: 0 6px 24px rgba(245,158,11,0.45);
      transform: translateY(-1px);
    }
    
    .btn-ghost {
      background: rgba(255,255,255,0.02);
      color: var(--text-primary);
      border: 1px solid var(--border);
      backdrop-filter: blur(8px);
      [data-theme="light"] & {
        background: rgba(15,23,42,0.02);
      }
    }
    .btn-ghost:hover { 
      background: var(--bg-hover); 
      border-color: var(--border-light);
      color: var(--accent);
    }
    
    .btn-danger {
      background: var(--red-soft);
      color: var(--red);
      border: 1px solid rgba(239,68,68,0.2);
    }
    .btn-danger:hover { 
      background: rgba(239,68,68,0.15); 
      border-color: rgba(239,68,68,0.35);
    }
    
    .btn-success {
      background: var(--green-soft);
      color: var(--green);
      border: 1px solid rgba(16,185,129,0.2);
    }
    .btn-success:hover { 
      background: rgba(16,185,129,0.15);
      border-color: rgba(16,185,129,0.35);
    }

    .input-field {
      background: rgba(255,255,255,0.02);
      border: 1px solid var(--border-light);
      color: var(--text-primary);
      border-radius: var(--radius-md);
      padding: 10px 16px;
      font-family: var(--font-main);
      font-size: 14px;
      outline: none;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      width: 100%;
      [data-theme="light"] & {
        background: rgba(15,23,42,0.01);
      }
    }
    .input-field:focus {
      border-color: var(--accent);
      background: var(--bg-surface);
      box-shadow: 0 0 0 4px var(--accent-soft);
    }
    .input-field::placeholder { color: var(--text-faint); }
    
    select.input-field {
      padding-right: 36px;
      cursor: pointer;
    }

    .nav-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 11px 16px;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid transparent;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-muted);
      background: transparent;
      position: relative;
    }
    .nav-item:hover {
      background: var(--bg-hover);
      color: var(--text-primary);
    }
    .nav-item.active {
      background: var(--accent-soft);
      border-color: rgba(245,158,11,0.25);
      color: var(--accent);
      font-weight: 600;
    }
    .nav-item.active::before {
      content: '';
      position: absolute;
      left: 0; top: 12px; bottom: 12px;
      width: 4px;
      background: var(--accent);
      border-radius: 0 4px 4px 0;
      box-shadow: 0 0 10px var(--accent);
    }

    .nav-group-label {
      font-size: 10.5px;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--text-faint);
      padding: 0 10px;
      margin: 18px 0 8px;
    }

    .nav-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 18px;
      height: 18px;
      padding: 0 6px;
      border-radius: 99px;
      font-size: 10px;
      font-weight: 800;
      font-family: var(--font-mono);
      line-height: 1;
      background: var(--red);
      color: #fff;
      box-shadow: 0 0 12px rgba(239,68,68,0.3);
    }
    .nav-badge.badge-amber {
      background: var(--accent);
      box-shadow: 0 0 12px rgba(245,158,11,0.3);
      color: #030712;
    }
    .nav-badge.badge-blue {
      background: var(--blue);
      box-shadow: 0 0 12px rgba(59,130,246,0.3);
    }

    .quick-stat {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 14px;
      border-radius: var(--radius-md);
      background: rgba(255,255,255,0.015);
      border: 1px solid var(--border);
      transition: all 0.2s;
      [data-theme="light"] & {
        background: rgba(15,23,42,0.01);
      }
    }
    .quick-stat:hover {
      background: var(--bg-hover);
      border-color: var(--border-light);
      transform: translateY(-1px);
    }
    .quick-stat .qs-icon {
      width: 26px;
      height: 26px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .quick-stat .qs-label {
      font-size: 10px;
      color: var(--text-faint);
      letter-spacing: 0.04em;
      text-transform: uppercase;
      font-weight: 700;
    }
    .quick-stat .qs-value {
      font-size: 13.5px;
      font-weight: 800;
      color: var(--text-primary);
      font-family: var(--font-mono);
      line-height: 1.1;
    }

    .nav-badge-pulse {
      animation: pulse-dot 2s ease-in-out infinite;
    }
    @keyframes pulse-dot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%      { opacity: 0.7; transform: scale(1.1); }
    }

    .dropdown-menu {
      background: var(--bg-elevated);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      box-shadow: 0 20px 50px -10px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.02);
      overflow: hidden;
      animation: scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      transform-origin: top right;
      backdrop-filter: blur(25px);
      -webkit-backdrop-filter: blur(25px);
    }
    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 16px;
      font-size: 13.5px;
      cursor: pointer;
      transition: all 0.15s;
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
    .dropdown-divider { height: 1px; background: var(--border); margin: 6px 0; }

    .notif-dot {
      animation: pulse-ring 2s infinite;
    }

    .skeleton {
      background: linear-gradient(90deg, var(--bg-elevated) 25%, var(--bg-hover) 50%, var(--bg-elevated) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: var(--radius-sm);
    }

    .progress-bar {
      height: 4px;
      border-radius: 99px;
      background: var(--border);
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      border-radius: 99px;
      background: linear-gradient(90deg, var(--accent), #f97316);
      transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .chip {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 10px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 600;
      font-family: var(--font-mono);
      border: 1px solid var(--border);
    }

    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(3,7,18,0.75);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 100;
      animation: fadeIn 0.25s ease;
    }
    .modal-content {
      background: var(--bg-elevated);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      box-shadow: 0 40px 120px -20px rgba(0,0,0,0.8);
      animation: scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
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
      padding: 14px 20px;
      text-align: left;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--text-faint);
      background: rgba(255,255,255,0.015);
      border-bottom: 1px solid var(--border);
      white-space: nowrap;
      [data-theme="light"] & {
        background: rgba(15,23,42,0.015);
      }
    }
    .data-table td {
      padding: 16px 20px;
      font-size: 13.5px;
      vertical-align: middle;
      border-bottom: 1px solid var(--border);
    }

    .mono { font-family: var(--font-mono); }

    .text-gradient-amber {
      background: linear-gradient(135deg, #f59e0b, #ea580c);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .text-gradient-green {
      background: linear-gradient(135deg, #10b981, #059669);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .logo-glow {
      filter: drop-shadow(0 0 15px rgba(245,158,11,0.35));
    }

    .avatar {
      width: 36px; height: 36px;
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; font-weight: 700;
      flex-shrink: 0;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 8px rgba(0,0,0,0.15);
    }

    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      background: var(--bg-elevated);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      padding: 14px 22px;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 13.5px;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
      animation: fadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }

    .menu-card {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      cursor: pointer;
      box-shadow: 0 4px 20px -10px rgba(0,0,0,0.2);
    }
    .menu-card:hover {
      border-color: var(--border-glow);
      transform: translateY(-3px);
      box-shadow: 0 20px 45px -15px rgba(0,0,0,0.4), var(--shadow-glow);
    }

    mark {
      background: var(--accent-soft);
      color: var(--accent);
      border-radius: 4px;
      padding: 0 3px;
    }

    .res-card {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 18px;
      transition: all 0.25s;
    }
    .res-card:hover {
      border-color: var(--border-light);
      background: var(--bg-elevated);
      transform: translateY(-1px);
    }

    .toggle {
      width: 40px; height: 22px;
      border-radius: 99px;
      border: none;
      cursor: pointer;
      position: relative;
      transition: background 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      flex-shrink: 0;
    }
    .toggle::after {
      content: '';
      position: absolute;
      top: 3px; left: 3px;
      width: 16px; height: 16px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .toggle.on { background: var(--green); }
    .toggle.on::after { transform: translateX(18px); }
    .toggle.off { background: var(--text-faint); }

    /* ─── Sidebar collapse / mobile drawer ─── */
    .admin-sidebar {
      width: 260px;
      min-height: 100vh;
      background: var(--bg-surface);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      padding: 24px 18px;
      position: fixed;
      top: 0; left: 0; bottom: 0;
      z-index: 50;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), width 0.3s cubic-bezier(0.16, 1, 0.3, 1), padding 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .admin-sidebar.collapsed {
      width: 80px;
      padding: 24px 12px;
    }
    .admin-sidebar.collapsed .nav-item {
      justify-content: center;
      padding: 12px 0;
    }
    .admin-sidebar.collapsed .nav-item .nav-label,
    .admin-sidebar.collapsed .nav-group-label,
    .admin-sidebar.collapsed .sidebar-brand-text,
    .admin-sidebar.collapsed .nav-chevron,
    .admin-sidebar.collapsed .user-meta { display: none; }
    
    .admin-sidebar.collapsed .nav-badge {
      position: absolute;
      top: 3px; right: 3px;
      min-width: 14px; height: 14px;
      font-size: 8px;
      padding: 0 4px;
    }
    .admin-sidebar.collapsed .nav-item { position: relative; }

    .main-wrap {
      flex: 1;
      margin-left: 260px;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      transition: margin-left 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .main-wrap.sidebar-collapsed { margin-left: 80px; }

    .sidebar-backdrop {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(3,7,18,0.6);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      z-index: 45;
      animation: fadeIn 0.25s ease;
    }

    .hamburger-btn {
      display: none;
      width: 40px; height: 40px;
      border-radius: 12px;
      background: rgba(255,255,255,0.02);
      border: 1px solid var(--border);
      color: var(--text-primary);
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
      transition: all 0.2s;
    }
    .hamburger-btn:hover { background: var(--bg-hover); border-color: var(--border-light); }

    .sidebar-toggle-btn {
      width: 32px; height: 32px;
      border-radius: 10px;
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text-muted);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    .sidebar-toggle-btn:hover { background: var(--bg-hover); color: var(--text-primary); border-color: var(--border-light); }

    /* ─── Breadcrumb ─── */
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }
    .breadcrumb-group {
      font-size: 11px;
      color: var(--text-faint);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-weight: 800;
      white-space: nowrap;
    }
    .breadcrumb-sep {
      color: var(--text-faint);
      opacity: 0.4;
      flex-shrink: 0;
    }
    .breadcrumb-title {
      font-size: 16px;
      font-weight: 800;
      color: var(--text-primary);
      letter-spacing: -0.02em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* ─── Skeleton blocks ─── */
    .skeleton-line {
      height: 14px;
      border-radius: 4px;
      background: linear-gradient(90deg, var(--bg-elevated) 25%, var(--bg-hover) 50%, var(--bg-elevated) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    .skeleton-block {
      border-radius: var(--radius-md);
      background: linear-gradient(90deg, var(--bg-elevated) 25%, var(--bg-hover) 50%, var(--bg-elevated) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    .skeleton-card {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    /* ─── Responsive ─── */
    @media (max-width: 1100px) {
      .quick-stat-hide-md { display: none !important; }
    }
    @media (max-width: 820px) {
      .admin-sidebar {
        transform: translateX(-100%);
        width: 270px;
      }
      .admin-sidebar.mobile-open {
        transform: translateX(0);
        box-shadow: 25px 0 50px -15px rgba(0,0,0,0.6);
      }
      .admin-sidebar.collapsed {
        width: 270px;
        padding: 24px 18px;
      }
      .admin-sidebar.collapsed .nav-item { justify-content: space-between; padding: 11px 16px; }
      .admin-sidebar.collapsed .nav-label,
      .admin-sidebar.collapsed .nav-group-label,
      .admin-sidebar.collapsed .sidebar-brand-text,
      .admin-sidebar.collapsed .nav-chevron,
      .admin-sidebar.collapsed .user-meta { display: revert; }
      .main-wrap, .main-wrap.sidebar-collapsed { margin-left: 0; }
      .sidebar-backdrop.show { display: block; }
      .hamburger-btn { display: inline-flex; }
      .sidebar-toggle-btn { display: none; }
      .admin-header { padding: 0 20px !important; }
      .admin-main { padding: 20px !important; }
      .quick-stats-center { display: none !important; }
    }
    @media (max-width: 480px) {
      .breadcrumb-group { display: none; }
      .breadcrumb-sep { display: none; }
    }
  `}</style>
);

export default GlobalStyles;