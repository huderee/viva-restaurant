// src/components/cart/ShoppingCart.jsx
// Сагс харах, засах — төлбөр /checkout хуудас дээр

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, ChevronRight } from 'lucide-react';
import { useCart }  from '../../contexts/CartContext';
import { useTheme } from '../../contexts/ThemeContext';

function CartItem({ item, isDark, onUpdateQuantity, onRemove }) {
  const linePrice = Number(item.unitPrice ?? item.customPrice ?? item.price ?? 0);
  const extras = item.addedExtras || [];
  const removed = item.removedIngredients || [];

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border ${isDark ? 'bg-gray-800/40 border-gray-700/40' : 'bg-gray-50 border-gray-100'}`}>
      <img
        src={item.imageUrl || item.image}
        alt={item.name}
        className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
        onError={e => { e.target.src = 'https://via.placeholder.com/56?text=🍽'; }}
      />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>{item.name}</p>
        <p className="text-amber-500 text-sm font-bold">{linePrice.toLocaleString()}₮</p>
        {(extras.length > 0 || removed.length > 0) && (
          <p className={`mt-0.5 truncate text-[11px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {extras.length > 0 ? `+ ${extras.map(e => e.name).join(', ')}` : ''}
            {extras.length > 0 && removed.length > 0 ? ' / ' : ''}
            {removed.length > 0 ? `- ${removed.join(', ')}` : ''}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          −
        </button>
        <span className={`w-6 text-center text-sm font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{item.quantity}</span>
        <button
          type="button"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          +
        </button>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className={`w-7 h-7 rounded-lg flex items-center justify-center ml-1 transition-colors ${isDark ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-red-50 text-red-400 hover:bg-red-100'}`}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function ShoppingCart() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const {
    cart, isCartOpen, closeCart,
    removeFromCart, updateQuantity, clearCart,
    calculateTotal, calculateTotalItems,
  } = useCart();

  const cartRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (isCartOpen && cartRef.current && !cartRef.current.contains(e.target)) {
        closeCart();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  const drawerBg = isDark ? 'bg-gradient-to-b from-gray-900 to-gray-950 border-gray-800' : 'bg-white border-gray-200';
  const headerBg = isDark ? 'border-gray-800 bg-black/20' : 'border-gray-100 bg-gray-50';
  const footerBg = isDark ? 'border-gray-800 bg-black/20' : 'border-gray-100 bg-gray-50';
  const titleCls = isDark ? 'text-white' : 'text-gray-900';
  const total    = calculateTotal();

  const goToCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" onClick={closeCart} />
      <div
        ref={cartRef}
        className={`fixed right-0 top-0 h-full w-full md:w-96 z-50 shadow-2xl border-l flex flex-col ${drawerBg}`}
      >
        <div className={`p-5 border-b flex-shrink-0 ${headerBg}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-amber-500 rounded-full text-white text-xs flex items-center justify-center">
                    {calculateTotalItems()}
                  </span>
                )}
              </div>
              <h2 className={`text-lg font-bold ${titleCls}`}>Миний сагс</h2>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Сагс хоосон</h3>
              <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Цэснээс хоол нэмнэ үү</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  isDark={isDark}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className={`p-5 border-t space-y-3 flex-shrink-0 ${footerBg}`}>
            <div className="flex justify-between">
              <span className={`font-bold ${titleCls}`}>Нийт:</span>
              <span className="text-2xl font-bold text-amber-500">{total.toLocaleString()}₮</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={clearCart}
                className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-colors ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
              >
                Цэвэрлэх
              </button>
              <button
                type="button"
                onClick={goToCheckout}
                className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-1 transition-all"
              >
                Төлбөр төлөх <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
