// src/components/admin/AdminDashboard.jsx
import { useState, useMemo, useEffect } from "react";
import {
  LayoutDashboard, ShoppingBag, UtensilsCrossed,
  CalendarDays, LogOut, ChevronRight, BarChart3, Briefcase,
  TrendingUp, DollarSign, Users2, Menu, X, Inbox,
  PanelLeftClose, PanelLeft, Sun, Moon, Keyboard, Command,
} from "lucide-react";
import logo from "../../assets/images/logo.png";
import GlobalStyles from './GlobalStyles';
import { useToast } from './Toast';
import NotificationBell from './NotificationBell';
import DashboardOverview from './DashboardOverview';
import OrdersView from './OrdersView';
import MenuView from './MenuView';
import ReservationsView from './ReservationsView';
import ReservationStatsView from './ReservationStatsView';
import AnalyticsView from './AnalyticsView';
import JobsView from './JobsView';
import JobApplicationsView from './JobApplicationsView';
import CommandPalette from './CommandPalette';
import ShortcutsHelp from './ShortcutsHelp';
import { ThemeProvider, useTheme } from './ThemeContext';
import { useOrders } from '../../contexts/OrdersContext';
import { useReservations } from '../../contexts/ReservationsContext';
import { useAuth } from '../../contexts/AuthContext';
import { currency } from '../../utils/format';
import { sumPaidRevenue } from '../../utils/adminMetrics';

const SIDEBAR_KEY = 'admin_sidebar_collapsed';

function AdminDashboardInner({ onExit }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem(SIDEBAR_KEY) === '1'; } catch { return false; }
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const { theme, toggle: toggleTheme } = useTheme();
  const { show: toastShow, ToastEl } = useToast();
  const { user } = useAuth();
  const { orders = [], fetchOrders }              = useOrders() || {};
  const { reservations = [], fetchReservations }  = useReservations() || {};

  useEffect(() => {
    try { localStorage.setItem(SIDEBAR_KEY, collapsed ? '1' : '0'); } catch {}
  }, [collapsed]);

  // Global keyboard shortcuts
  useEffect(() => {
    let gPrefix = false;
    let gTimer = null;

    const isTypingContext = (el) =>
      el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);

    const navMap = {
      d: 'dashboard', o: 'orders', r: 'reservations',
      m: 'menu', j: 'jobs', p: 'applications', a: 'analytics', s: 'resStats',
    };

    const onKey = (e) => {
      // Ctrl/Cmd + K → palette (typing-ээс үл хамаарна)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen(p => !p);
        return;
      }

      // Input дотор бичиж байвал бусад shortcut-ыг хориглоно
      if (isTypingContext(document.activeElement)) return;

      const k = e.key.toLowerCase();

      // g prefix
      if (k === 'g' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        gPrefix = true;
        clearTimeout(gTimer);
        gTimer = setTimeout(() => { gPrefix = false; }, 900);
        return;
      }

      if (gPrefix && navMap[k]) {
        e.preventDefault();
        setActiveTab(navMap[k]);
        gPrefix = false;
        clearTimeout(gTimer);
        return;
      }

      // Ганц товчнууд
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (k === '?') { e.preventDefault(); setHelpOpen(true); return; }
      if (k === 't') { e.preventDefault(); toggleTheme(); return; }
      if (k === 'b') { e.preventDefault(); setCollapsed(c => !c); return; }
      if (k === '/') {
        // Хайлтын input руу focus
        const search = document.querySelector('input[placeholder*="Хайх"]');
        if (search) { e.preventDefault(); search.focus(); }
      }
    };

    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); clearTimeout(gTimer); };
  }, [toggleTheme]);

  // Pending тоо
  const pendingOrders = useMemo(
    () => orders.filter(o => o.status === 'pending').length,
    [orders]
  );
  const pendingReservations = useMemo(
    () => reservations.filter(r => (r.status || 'pending') === 'pending').length,
    [reservations]
  );

  // Өнөөдрийн stats
  const todayStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter(o => (o.createdAt || '').startsWith(today) && o.status !== 'cancelled');
    const todayRes    = reservations.filter(r => r.date === today && r.status !== 'cancelled');
    const revenue     = sumPaidRevenue(todayOrders);
    return {
      orderCount: todayOrders.length,
      revenue,
      reservationCount: todayRes.length,
    };
  }, [orders, reservations]);

  // Sidebar цэс
  const navGroups = [
    {
      label: 'Үйл ажиллагаа',
      items: [
        { id: 'dashboard',    icon: LayoutDashboard, label: 'Хяналтын самбар' },
        { id: 'orders',       icon: ShoppingBag,     label: 'Хоолны захиалга',  badge: pendingOrders },
        { id: 'reservations', icon: CalendarDays,    label: 'Ширээ захиалга',   badge: pendingReservations, badgeClass: 'badge-amber' },
      ],
    },
    {
      label: 'Контент',
      items: [
        { id: 'menu', icon: UtensilsCrossed, label: 'Цэсний удирдлага' },
        { id: 'jobs', icon: Briefcase,       label: 'Ажлын байр' },
        { id: 'applications', icon: Inbox,     label: 'Анкет' },
      ],
    },
    {
      label: 'Тайлан',
      items: [
        { id: 'analytics', icon: BarChart3,  label: 'Орлогын тайлан' },
        { id: 'resStats',  icon: TrendingUp, label: 'Ширээний тайлан' },
      ],
    },
  ];

  // Tab нэр + групп → breadcrumb
  const tabMeta = useMemo(() => {
    for (const g of navGroups) {
      const it = g.items.find(i => i.id === activeTab);
      if (it) return { group: g.label, title: it.label };
    }
    return { group: '', title: '' };
  }, [activeTab, pendingOrders, pendingReservations]);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":    return <DashboardOverview toastShow={toastShow} />;
      case "orders":       return <OrdersView toastShow={toastShow} />;
      case "menu":         return <MenuView toastShow={toastShow} />;
      case "reservations": return <ReservationsView toastShow={toastShow} />;
      case "resStats":     return <ReservationStatsView />;
      case "jobs":         return <JobsView toastShow={toastShow} />;
      case "applications": return <JobApplicationsView toastShow={toastShow} />;
      case "analytics":    return <AnalyticsView />;
      default:             return <DashboardOverview toastShow={toastShow} />;
    }
  };

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  return (
    <div className="admin-root" style={{ display: 'flex' }}>
      <GlobalStyles />

      {/* Mobile backdrop */}
      <div
        className={`sidebar-backdrop ${mobileOpen ? 'show' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 22,
          padding: '4px 6px',
          justifyContent: collapsed ? 'center' : 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <img
              src={logo}
              alt="Viva"
              style={{
                height: 38,
                width: 'auto',
                flexShrink: 0,
                /* Light mode: цагаан логог хар болгож харуулна */
                filter: theme === 'light' ? 'invert(1) brightness(0.85)' : 'none',
                transition: 'filter 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              className="logo-glow"
            />
            <div className="sidebar-brand-text">
              <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em' }} className="text-gradient-amber">Viva</div>
              <div style={{ fontSize: 10, color: 'var(--text-faint)', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: 1 }}>Хяналтын самбар</div>
            </div>
          </div>
          {!collapsed && (
            <button
              className="sidebar-toggle-btn"
              onClick={() => setCollapsed(true)}
              title="Sidebar хумих"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose size={14} />
            </button>
          )}
        </div>

        {collapsed && (
          <button
            className="sidebar-toggle-btn"
            onClick={() => setCollapsed(false)}
            title="Sidebar дэлгэх"
            aria-label="Expand sidebar"
            style={{ alignSelf: 'center', marginBottom: 10 }}
          >
            <PanelLeft size={14} />
          </button>
        )}

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          {navGroups.map((group, gi) => (
            <div key={group.label}>
              <div className="nav-group-label" style={gi === 0 ? { marginTop: 0 } : undefined}>
                {group.label}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {group.items.map(({ id, icon: Icon, label, badge, badgeClass }) => (
                  <button
                    key={id}
                    onClick={() => handleNavClick(id)}
                    className={`nav-item ${activeTab === id ? 'active' : ''}`}
                    title={collapsed ? label : undefined}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                      <Icon size={15} style={{ flexShrink: 0 }} />
                      <span className="nav-label" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      {badge > 0 && (
                        <span className={`nav-badge ${badgeClass || ''} nav-badge-pulse`}>
                          {badge > 99 ? '99+' : badge}
                        </span>
                      )}
                      {activeTab === id && <ChevronRight className="nav-chevron" size={13} style={{ opacity: 0.5 }} />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, marginTop: 14 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 8px',
            marginBottom: 8,
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}>
            <div className="avatar" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
              {(user?.name || user?.username || 'А')[0].toUpperCase()}
            </div>
            <div className="user-meta">
              <div style={{ fontSize: 12, fontWeight: 600 }}>{user?.name || user?.username || 'Администратор'}</div>
              <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>{user?.email || user?.username || '—'}</div>
            </div>
          </div>
          <button
            onClick={onExit}
            className="nav-item"
            style={{ color: 'var(--red)', width: '100%' }}
            title={collapsed ? 'Гарах' : undefined}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <LogOut size={15} />
              <span className="nav-label">Гарах</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className={`main-wrap ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <header className="admin-header" style={{
          position: 'sticky', top: 0, zIndex: 40,
          background: 'rgba(8,12,20,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
          padding: '0 28px',
          height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 16,
        }}>
          {/* Left: hamburger + breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: '0 1 auto' }}>
            <button
              className="hamburger-btn"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>

            <div className="breadcrumb">
              <span className="breadcrumb-group">{tabMeta.group}</span>
              <ChevronRight className="breadcrumb-sep" size={12} />
              <span className="breadcrumb-title">{tabMeta.title}</span>
            </div>
          </div>

          {/* Center: quick stats */}
          <div className="quick-stats-center" style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'center', overflow: 'hidden' }}>
            <div className="quick-stat">
              <div className="qs-icon" style={{ background: 'rgba(245,158,11,0.15)' }}>
                <ShoppingBag size={13} color="#f59e0b" />
              </div>
              <div>
                <div className="qs-label">Өнөөдөр</div>
                <div className="qs-value">{todayStats.orderCount} захиалга</div>
              </div>
            </div>
            <div className="quick-stat quick-stat-hide-md">
              <div className="qs-icon" style={{ background: 'rgba(16,185,129,0.15)' }}>
                <DollarSign size={13} color="#10b981" />
              </div>
              <div>
                <div className="qs-label">Орлого (төлсөн)</div>
                <div className="qs-value">{currency(todayStats.revenue)}</div>
              </div>
            </div>
            <div className="quick-stat quick-stat-hide-md">
              <div className="qs-icon" style={{ background: 'rgba(139,92,246,0.15)' }}>
                <Users2 size={13} color="#8b5cf6" />
              </div>
              <div>
                <div className="qs-label">Ширээ</div>
                <div className="qs-value">{todayStats.reservationCount}</div>
              </div>
            </div>
          </div>

          {/* Right: palette / theme / bell */}
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => setPaletteOpen(true)}
              title="Command palette (Ctrl+K)"
              className="sidebar-toggle-btn"
              style={{ width: 38, height: 38, display: 'inline-flex', gap: 5, padding: '0 10px' }}
            >
              <Command size={13} />
              <kbd style={{
                fontSize: 10, fontFamily: 'var(--font-mono)',
                color: 'var(--text-faint)', fontWeight: 700,
              }} className="quick-stat-hide-md">K</kbd>
            </button>

            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
              className="sidebar-toggle-btn"
              style={{ width: 38, height: 38 }}
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            <button
              onClick={() => setHelpOpen(true)}
              title="Keyboard shortcuts (?)"
              className="sidebar-toggle-btn quick-stat-hide-md"
              style={{ width: 38, height: 38 }}
            >
              <Keyboard size={14} />
            </button>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 10px',
              borderRadius: 99,
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.2)',
            }} className="quick-stat-hide-md">
              <span style={{
                width: 6, height: 6, borderRadius: '50%', background: '#10b981',
                boxShadow: '0 0 6px #10b981',
              }} />
              <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>Онлайн</span>
            </div>
            <NotificationBell toastShow={toastShow} />
          </div>
        </header>

        <main className="admin-main anim-fade-up" style={{ flex: 1, padding: '28px', background: 'var(--bg-base)' }}>
          {renderContent()}
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigate={(id) => { setActiveTab(id); setMobileOpen(false); }}
        onToggleTheme={toggleTheme}
        onToggleSidebar={() => setCollapsed(c => !c)}
        onRefresh={() => { fetchOrders?.(); fetchReservations?.(); toastShow?.('Шинэчиллээ'); }}
        onExit={onExit}
        orders={orders}
        reservations={reservations}
      />

      <ShortcutsHelp open={helpOpen} onClose={() => setHelpOpen(false)} />

      {ToastEl}
    </div>
  );
}

export function AdminDashboard(props) {
  return (
    <ThemeProvider>
      <AdminDashboardInner {...props} />
    </ThemeProvider>
  );
}

export default AdminDashboard;
