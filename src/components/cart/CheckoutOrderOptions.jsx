import React from 'react';
import { Bike, MapPin, Store } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useOrderType } from '../../contexts/OrderTypeContext';
import { useTheme } from '../../contexts/ThemeContext';

const COPY = {
  mn: {
    title: 'Захиалгын төрөл',
    pickup: 'Очиж авах',
    pickupDesc: 'Салбараас өөрөө авна',
    delivery: 'Хүргэлт',
    deliveryDesc: 'Хаягаар хүргүүлнэ',
    dineIn: 'Зааланд идэх',
    dineInDesc: 'Ресторан дээр очиж үйлчлүүлнэ',
  },
  en: {
    title: 'Order type',
    pickup: 'Pickup',
    pickupDesc: 'Collect from the branch',
    delivery: 'Delivery',
    deliveryDesc: 'Deliver to your address',
    dineIn: 'Dine in',
    dineInDesc: 'Eat at the restaurant',
  },
};

const OPTIONS = [
  { id: 'pickup', icon: Store, color: 'text-amber-400' },
  { id: 'delivery', icon: Bike, color: 'text-emerald-400' },
  { id: 'dine-in', icon: MapPin, color: 'text-blue-400' },
];

export default function CheckoutOrderOptions() {
  const { lang } = useLanguage();
  const { isDark } = useTheme();
  const { orderType, setOrderType } = useOrderType();
  const copy = COPY[lang === 'en' ? 'en' : 'mn'];

  return (
    <div className={`mb-5 rounded-2xl border p-4 ${isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
      <h3 className={`mb-3 text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {copy.title}
      </h3>
      <div className="grid gap-2 sm:grid-cols-3">
        {OPTIONS.map(({ id, icon: Icon, color }) => {
          const selected = orderType === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setOrderType(id)}
              className={`flex min-h-[74px] items-start gap-3 rounded-xl border p-3 text-left transition-all ${
                selected
                  ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/20'
                  : isDark
                    ? 'border-white/10 bg-gray-900/60 hover:border-white/20'
                    : 'border-gray-200 bg-white hover:border-amber-300'
              }`}
            >
              <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${selected ? 'bg-amber-500/15' : isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                <Icon className={`h-4 w-4 ${selected ? 'text-amber-400' : color}`} />
              </span>
              <span className="min-w-0">
                <span className={`block text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {copy[id === 'dine-in' ? 'dineIn' : id]}
                </span>
                <span className={`mt-0.5 block text-xs leading-snug ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {copy[id === 'dine-in' ? 'dineInDesc' : `${id}Desc`]}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
