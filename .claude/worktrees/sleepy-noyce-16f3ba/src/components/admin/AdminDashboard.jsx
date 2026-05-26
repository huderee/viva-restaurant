// src/components/admin/AdminDashboard.jsx
import { useState } from "react";
import {
  LayoutDashboard, ShoppingBag, UtensilsCrossed,
  CalendarDays, LogOut, ChevronRight
} from "lucide-react";
import logo from "../../assets/images/logo.png";
import GlobalStyles from './GlobalStyles';
import { useToast } from './Toast';
import NotificationBell from './NotificationBell';
import DashboardOverview from './DashboardOverview';
import OrdersView from './OrdersView';
import MenuView from './MenuView';
import ReservationsView from './ReservationsView';

export function AdminDashboard({ onExit }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { show: toastShow, ToastEl } = useToast();

  const tabs = [
    { id: 'dashboard',    icon: LayoutDashboard, label: 'Хяналтын самбар' },
    { id: 'orders',       icon: ShoppingBag,     label: 'Захиалгууд' },
    { id: 'menu',         icon: UtensilsCrossed, label: 'Цэсний удирдлага' },
    { id: 'reservations', icon: CalendarDays,    label: 'Ширээ захиалга' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":    return <DashboardOverview />;
      case "orders":       return <OrdersView toastShow={toastShow} />;
      case "menu":         return <MenuView toastShow={toastShow} />;
      case "reservations": return <ReservationsView toastShow={toastShow} />;
      default:             return <DashboardOverview />;
    }
  };

  return (
    <div className="admin-root" style={{ display: 'flex' }}>
      <GlobalStyles />

      {/* Sidebar */}
      <aside style={{
        width: 240,
        minHeight: '100vh',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 14px',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, padding: '4px 6px' }}>
          <img src={logo} alt="HuuK" style={{ height: 42, width: 'auto' }} className="logo-glow" />
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em' }} className="text-gradient-amber">HuuK</div>
            <div style={{ fontSize: 10, color: 'var(--text-faint)', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: 1 }}>Хяналтын самбар</div>
          </div>
        </div>

        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-faint)', padding: '0 8px', marginBottom: 8 }}>
          Үндсэн цэс
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {tabs.map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`nav-item ${activeTab === id ? 'active' : ''}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon size={15} />
                <span>{label}</span>
              </div>
              {activeTab === id && <ChevronRight size={13} style={{ opacity: 0.5 }} />}
            </button>
          ))}
        </nav>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, marginTop: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px', marginBottom: 8 }}>
            <div className="avatar" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>А</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>Администратор</div>
              <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>admin@huuk.mn</div>
            </div>
          </div>
          <button onClick={onExit} className="nav-item" style={{ color: 'var(--red)', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <LogOut size={15} />
              <span>Гарах</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, marginLeft: 240, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header style={{
          position: 'sticky', top: 0, zIndex: 40,
          background: 'rgba(8,12,20,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
          padding: '0 28px',
          height: 60,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>
              {new Date().toLocaleDateString('mn-MN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--border-light)', display: 'inline-block' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%', background: '#10b981',
                boxShadow: '0 0 6px #10b981',
                display: 'inline-block',
              }} />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Онлайн</span>
            </div>
          </div>
          <NotificationBell toastShow={toastShow} />
        </header>

        <main style={{ flex: 1, padding: '28px', background: 'var(--bg-base)' }} className="anim-fade-up">
          {renderContent()}
        </main>
      </div>

      {ToastEl}
    </div>
  );
}

export default AdminDashboard;