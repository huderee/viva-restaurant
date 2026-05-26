// src/components/cart/CartBottomBar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { useCart }  from '../../contexts/CartContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function CartBottomBar() {
  const { cart, calculateTotal, calculateTotalItems } = useCart();
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Зөвхөн /order хуудаст + сагс хоосон биш үед харагдана
  if (location.pathname !== '/order' || calculateTotalItems() === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 pointer-events-none">
      <div className="max-w-lg mx-auto pointer-events-auto">
        <button
          onClick={() => navigate('/checkout')}
          className="w-full flex items-center justify-between px-5 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl shadow-2xl shadow-emerald-500/40 transition-all active:scale-95"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="font-bold">{calculateTotalItems()} бараа</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">{calculateTotal().toLocaleString()}₮</span>
            <ChevronRight className="w-5 h-5" />
          </div>
        </button>
      </div>
    </div>
  );
}