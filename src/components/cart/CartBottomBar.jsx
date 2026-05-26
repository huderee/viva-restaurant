// src/components/cart/CartBottomBar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { useCart }  from '../../contexts/CartContext';

export default function CartBottomBar() {
  const { calculateTotal, calculateTotalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  // Нэг удаа тооцоолж, хоёр газарт ашиглана (давхар дуудлага арилгав)
  const totalItems = calculateTotalItems();
  const total      = calculateTotal();

  // Зөвхөн /menu хуудаст + сагс хоосон биш үед харагдана
  if (location.pathname !== '/menu' || totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 pointer-events-none">
      <div className="max-w-lg mx-auto pointer-events-auto">
        <button
          onClick={() => navigate('/checkout')}
          className="w-full flex items-center justify-between px-5 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl shadow-2xl shadow-amber-500/40 transition-all active:scale-95"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="font-bold">{totalItems} бараа</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">{total.toLocaleString()}₮</span>
            <ChevronRight className="w-5 h-5" />
          </div>
        </button>
      </div>
    </div>
  );
}
