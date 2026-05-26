// src/App.jsx
import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

import { MenuProvider }          from './contexts/MenuContext';
import { CartProvider }          from './contexts/CartContext';
import { OrdersProvider }        from './contexts/OrdersContext';
import { ReservationsProvider }  from './contexts/ReservationsContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider }         from './contexts/ThemeContext';
import { LanguageProvider }      from './contexts/LanguageContext';
import { OrderTypeProvider }     from './contexts/OrderTypeContext';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import HomeSection           from './components/sections/HomeSection';
import AboutSection          from './components/sections/AboutSection';
import JobsSection           from './components/sections/JobsSection';
import MenuSection           from './components/sections/MenuSection';
import CheckoutPage          from './pages/CheckoutPage';
import ReservationSection    from './components/sections/ReservationSection';
import VipReservationSection from './components/sections/VipReservationSection';
import MyReservationsSection from './components/sections/MyReservationsSection';

import { AdminDashboard } from './components/admin/AdminDashboard';
import { LoginPage }      from './components/admin/LoginPage';
import CustomerAuth       from './pages/CustomerAuth';
import OAuthCallback      from './pages/OAuthCallback';

import FAQPage     from './pages/FAQPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage   from './pages/TermsPage';
import './index.css';

/* ── Нэвтрээгүй хэрэглэгчийг login руу шилжүүлэх ── */
function RequireAuth({ children }) {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();
  if (initializing) return null;
  if (!isAuthenticated)
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}

/* ── Admin role шаардах ── */
function RequireAdmin({ children }) {
  const { isAuthenticated, initializing, user } = useAuth();
  const location = useLocation();
  if (initializing) return null;
  if (!isAuthenticated || user?.role !== 'admin')
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  return children;
}

const AllProviders = ({ children }) => (
  <OrderTypeProvider>
    <MenuProvider>
      <CartProvider>
        <OrdersProvider>
          <ReservationsProvider>
            {children}
          </ReservationsProvider>
        </OrdersProvider>
      </CartProvider>
    </MenuProvider>
  </OrderTypeProvider>
);

/* ── Хуудсууд ── */
function HomePage()           { return <><HomeSection /><AboutSection /><Footer /></>; }
function MenuPage()           { return <MenuSection id="menu" />; }
function ReservationPage()    { return <ReservationSection />; }
function VipReservationPage() { return <VipReservationSection />; }
function MyReservationsPage() { return <MyReservationsSection />; }
function CareersPage()        { return <JobsSection />; }
function ContactPage()        { return <Navigate to="/#about" replace />; }

/* ── Admin хуудас ──
   onExit = зүгээр нүүр хуудас руу явна, logout ХИЙХГҮЙ
   Logout хийхийг хүсвэл AdminDashboard дотрын тусдаа "Гарах" товч ашиглана */
function AdminPage() {
  return (
    <AllProviders>
      <AdminDashboard onExit={() => { window.location.href = '/'; }} />
    </AllProviders>
  );
}

/* ── Admin login хуудас ── */
function AdminLoginPage() {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated && user?.role === 'admin')
    return <Navigate to="/admin" replace />;
  return <LoginPage onSuccess={() => { window.location.href = '/admin'; }} />;
}

/* ── Үндсэн агуулга ── */
function AppContent() {
  const { isAuthenticated, initializing, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleExpired = () => { console.warn('Session expired'); };
    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, []);

  useEffect(() => {
    if (!location.hash) return;
    const target = location.hash.slice(1);
    window.setTimeout(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }, [location.pathname, location.hash]);

  if (initializing) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Ачааллаж байна...</p>
        </div>
      </div>
    );
  }

  /* Admin болон OAuth — header/footer-гүй */
  if (location.pathname.startsWith('/admin') || location.pathname === '/oauth/callback') {
    return (
      <Routes>
        <Route path="/admin/login"    element={<AdminLoginPage />} />
        <Route path="/admin"          element={<RequireAdmin><AdminPage /></RequireAdmin>} />
        <Route path="/admin/*"        element={<RequireAdmin><AdminPage /></RequireAdmin>} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
      </Routes>
    );
  }

  if (location.pathname === '/login') return <CustomerAuth />;

  return (
    <AllProviders>
      <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black text-gray-900 dark:text-white transition-colors duration-300">
        <Header />
        <main>
          <Routes>
            <Route path="/"                element={<HomePage />} />
            <Route path="/menu"            element={<MenuPage />} />
            <Route path="/checkout"        element={<CheckoutPage />} />
            <Route path="/order"           element={<Navigate to="/menu" replace />} />
            <Route path="/reservation"     element={<RequireAuth><ReservationPage /></RequireAuth>} />
            <Route path="/reservation/vip" element={<RequireAuth><VipReservationPage /></RequireAuth>} />
            <Route path="/reservation/my"  element={<RequireAuth><MyReservationsPage /></RequireAuth>} />
            <Route path="/careers"         element={<CareersPage />} />
            <Route path="/contact"         element={<ContactPage />} />
            <Route path="/login"           element={<CustomerAuth />} />
            <Route path="/faq"             element={<FAQPage />} />
            <Route path="/privacy"         element={<PrivacyPage />} />
            <Route path="/terms"           element={<TermsPage />} />
          </Routes>
        </main>

        {/* Admin товч — зөвхөн admin role-той үед */}
        {isAuthenticated && user?.role === 'admin' && (
          <a
            href="/admin"
            className="fixed bottom-6 left-6 w-10 h-10 bg-white/5 hover:bg-amber-500/20 border border-white/10 rounded-lg flex items-center justify-center transition-all duration-300 group z-50 backdrop-blur-sm"
            aria-label="Admin"
          >
            <Lock className="w-4 h-4 text-slate-500 group-hover:text-amber-500 transition-colors" />
          </a>
        )}
      </div>
    </AllProviders>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}