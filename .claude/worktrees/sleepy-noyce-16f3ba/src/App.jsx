// src/App.jsx
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { CartProvider }         from './contexts/CartContext';
import { MenuProvider }         from './contexts/MenuContext';
import { OrdersProvider }       from './contexts/OrdersContext';
import { ReservationsProvider } from './contexts/ReservationsContext';
import { AuthProvider, useAuth }from './contexts/AuthContext';
import { OrderTypeProvider }    from './contexts/OrderTypeContext';
import { ThemeProvider }        from './contexts/ThemeContext';

import Header          from './components/layout/Header';
import Footer          from './components/layout/Footer';
import ShoppingCart    from './components/cart/ShoppingCart';
import CartBottomBar   from './components/cart/CartBottomBar';

import HomeSection        from './components/sections/HomeSection';
import AboutSection       from './components/sections/AboutSection';
import MenuSection        from './components/sections/MenuSection';
import ReservationSection from './components/sections/ReservationSection';

import OrderPage    from './pages/OrderPage';
import CheckoutPage from './pages/CheckoutPage';

import { AdminDashboard } from './components/admin/AdminDashboard';
import { LoginPage }      from './components/admin/LoginPage';
import './index.css';

const AllProviders = ({ children }) => (
  <OrderTypeProvider>
    <MenuProvider>
      <OrdersProvider>
        <ReservationsProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </ReservationsProvider>
      </OrdersProvider>
    </MenuProvider>
  </OrderTypeProvider>
);

/* ── Хуудсууд ── */
function HomePage() {
  return <HomeSection />;
}
function MenuPage() {
  return <MenuSection id="menu" />;
}
function ReservationPage() {
  return <ReservationSection />;
}
function ContactPage() {
  return (
    <>
      <AboutSection />
      <Footer />
    </>
  );
}

/* ── Үндсэн агуулга ── */
function AppContent() {
  const { isAuthenticated, logout, initializing } = useAuth();
  const [showAdmin, setShowAdmin] = useState(false);

  if (initializing) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Ачааллаж байна...</p>
        </div>
      </div>
    );
  }

  if (showAdmin) {
    if (!isAuthenticated) return <LoginPage onSuccess={() => {}} />;
    return (
      <AllProviders>
        <AdminDashboard onExit={() => { logout(); setShowAdmin(false); }} />
      </AllProviders>
    );
  }

  return (
    <AllProviders>
      <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black text-gray-900 dark:text-white transition-colors duration-300">
        <Header />
        <main>
          <Routes>
            <Route path="/"            element={<HomePage />} />
            <Route path="/menu"        element={<MenuPage />} />
            <Route path="/order"       element={<OrderPage />} />
            <Route path="/checkout"    element={<CheckoutPage />} />
            <Route path="/reservation" element={<ReservationPage />} />
            <Route path="/contact"     element={<ContactPage />} />
          </Routes>
        </main>

        {/* Cart sidebar */}
        <ShoppingCart />

        {/* Доод sticky cart bar — /order хуудаст харагдана */}
        <CartBottomBar />

        {/* Admin товч */}
        <button
          onClick={() => setShowAdmin(true)}
          className="fixed bottom-6 left-6 w-10 h-10 bg-white/5 hover:bg-amber-500/20 border border-white/10 rounded-lg flex items-center justify-center transition-all duration-300 group z-50 backdrop-blur-sm"
          aria-label="Admin"
        >
          <Lock className="w-4 h-4 text-slate-500 group-hover:text-amber-500 transition-colors" />
        </button>
      </div>
    </AllProviders>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}