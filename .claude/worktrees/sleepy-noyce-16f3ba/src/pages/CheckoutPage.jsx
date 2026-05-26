// src/pages/CheckoutPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, User, Phone, MapPin,
  Banknote, QrCode, Building2, CheckCircle, Loader2,
  ShoppingBag, Store, Truck, Clock, AlertCircle
} from 'lucide-react';
import { useCart }      from '../contexts/CartContext';
import { useOrderType } from '../contexts/OrderTypeContext';
import { useTheme }     from '../contexts/ThemeContext';

const PAYMENT_METHODS = [
  { id: 'cash',     label: 'Бэлэн мөнгө',         desc: 'Хүргэлтийн үед төлнө',  icon: Banknote,  color: 'emerald' },
  { id: 'qpay',     label: 'QPay / SocialPay',     desc: 'QR кодоор төлнө',       icon: QrCode,    color: 'blue'    },
  { id: 'transfer', label: 'Банкны шилжүүлэг',     desc: 'Дансаар шилжүүлнэ',    icon: Building2, color: 'purple'  },
];

const COLOR = {
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', ring: 'ring-emerald-500/30' },
  blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/30',    text: 'text-blue-400',    ring: 'ring-blue-500/30'    },
  purple:  { bg: 'bg-purple-500/10',  border: 'border-purple-500/30',  text: 'text-purple-400',  ring: 'ring-purple-500/30'  },
};

export default function CheckoutPage() {
  const navigate  = useNavigate();
  const { isDark } = useTheme();
  const { cart, calculateTotal, calculateTotalItems, placeOrder, orderLoading, orderError } = useCart();
  const { orderType, selectedBranch } = useOrderType();

  const [step, setStep]   = useState(1); // 1=мэдээлэл, 2=төлбөр, 3=амжилт
  const [payment, setPayment] = useState('');
  const [form, setForm]   = useState({ name: '', phone: '', address: '', note: '' });
  const [errors, setErrors] = useState({});

  const total = calculateTotal();

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = 'Нэр оруулна уу';
    if (!form.phone.trim()) e.phone = 'Утас оруулна уу';
    else if (!/^\d{8}$/.test(form.phone.replace(/\D/g, ''))) e.phone = '8 оронтой тоо';
    if (orderType === 'delivery' && !form.address.trim()) e.address = 'Хаяг оруулна уу';
    return e;
  };

  const handleChange = e => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  const handleNext = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setStep(2);
  };

  const handleOrder = async () => {
    if (!payment) return;
    const result = await placeOrder({ ...form, orderType, paymentMethod: payment });
    if (result) setStep(3);
  };

  // Dynamic styles
  const pageBg   = isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900';
  const cardBg   = isDark ? 'bg-gray-900 border-white/10' : 'bg-white border-gray-200 shadow-sm';
  const inputCls = (err) => `w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 ${
    isDark
      ? `bg-gray-800 text-white placeholder-gray-500 ${err ? 'border-red-500' : 'border-white/10'}`
      : `bg-white text-gray-800 placeholder-gray-400 ${err ? 'border-red-400' : 'border-gray-300'}`
  }`;
  const labelCls = `block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`;

  /* ══ Амжилт ══ */
  if (step === 3) {
    return (
      <div className={`min-h-screen pt-20 flex items-center justify-center px-4 ${pageBg}`}>
        <div className="text-center max-w-sm w-full">
          <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-14 h-14 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Баярлалаа! 🎉</h1>
          <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Таны захиалга амжилттай хүлээгдлээ
          </p>
          <div className={`rounded-xl p-4 mb-6 text-left border ${cardBg}`}>
            <div className="flex justify-between text-sm mb-2">
              <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Захиалгын дүн</span>
              <span className="font-bold text-emerald-500">{total.toLocaleString()}₮</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Хүргэлтийн хугацаа</span>
              <span className="flex items-center gap-1 text-blue-400"><Clock className="w-3 h-3" /> 30-45 мин</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/order')}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all"
          >
            Цэс рүү буцах
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-16 md:pt-24 pb-8 ${pageBg}`}>
      <div className="max-w-4xl mx-auto px-4">

        {/* Back */}
        <button onClick={() => step === 1 ? navigate('/order') : setStep(1)}
          className={`flex items-center gap-1 text-sm mb-6 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
          <ChevronLeft className="w-4 h-4" /> Буцах
        </button>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-8">
          {['Мэдээлэл', 'Төлбөр'].map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                step === i + 1
                  ? 'bg-emerald-500 text-white'
                  : i + 1 < step
                    ? 'bg-emerald-500/20 text-emerald-500'
                    : isDark ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-400'
              }`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === i + 1 ? 'bg-white/20' : ''
                }`}>{i + 1}</span>
                {s}
              </div>
              {i === 0 && <div className={`flex-1 h-px ${step > 1 ? 'bg-emerald-500' : isDark ? 'bg-white/10' : 'bg-gray-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* ══ Left ══ */}
          <div className="lg:col-span-2 space-y-4">

            {/* ── Алхам 1: Мэдээлэл ── */}
            {step === 1 && (
              <div className={`rounded-2xl border p-6 ${cardBg}`}>
                <h2 className="text-lg font-bold mb-5">Хүргэлтийн мэдээлэл</h2>

                {/* Order type */}
                <div className={`flex items-center gap-2 p-3 rounded-xl mb-5 border ${
                  isDark ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'
                }`}>
                  {orderType === 'pickup' ? <Store className="w-4 h-4 text-emerald-500" /> : <Truck className="w-4 h-4 text-emerald-500" />}
                  <span className="text-sm font-medium text-emerald-600">
                    {orderType === 'pickup' ? `Очиж авах — ${selectedBranch.name}` : 'Хүргэлтээр'}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Нэр *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input name="name" value={form.name} onChange={handleChange} placeholder="Таны нэр"
                        className={`${inputCls(errors.name)} pl-10`} />
                    </div>
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>Утас *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input name="phone" value={form.phone} onChange={handleChange} placeholder="99001122" maxLength={8}
                        className={`${inputCls(errors.phone)} pl-10`} />
                    </div>
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  {orderType === 'delivery' && (
                    <div className="md:col-span-2">
                      <label className={labelCls}>Хаяг *</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <textarea name="address" value={form.address} onChange={handleChange}
                          placeholder="Дүүрэг, хороо, байр, тоот..." rows={3}
                          className={`${inputCls(errors.address)} pl-10 resize-none`} />
                      </div>
                      {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <label className={labelCls}>Нэмэлт тэмдэглэл</label>
                    <textarea name="note" value={form.note} onChange={handleChange}
                      placeholder="Онцгой хүсэлт..." rows={2}
                      className={`${inputCls(false)} resize-none`} />
                  </div>
                </div>

                <button onClick={handleNext}
                  className="w-full mt-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                  Үргэлжлүүлэх <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* ── Алхам 2: Төлбөр ── */}
            {step === 2 && (
              <div className={`rounded-2xl border p-6 ${cardBg}`}>
                <h2 className="text-lg font-bold mb-5">Төлбөрийн хэлбэр</h2>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map(m => {
                    const Icon = m.icon;
                    const c    = COLOR[m.color];
                    const sel  = payment === m.id;
                    return (
                      <button key={m.id} onClick={() => setPayment(m.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                          sel ? `${c.bg} ${c.border} ring-2 ${c.ring}` : isDark ? 'bg-white/5 border-white/10 hover:border-white/20' : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                        }`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${c.bg} ${c.border}`}>
                          <Icon className={`w-5 h-5 ${c.text}`} />
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold text-sm ${sel ? '' : isDark ? 'text-gray-300' : 'text-gray-700'}`}>{m.label}</p>
                          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{m.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${sel ? 'border-emerald-500 bg-emerald-500' : isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                          {sel && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {orderError && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <p className="text-red-400 text-sm">{orderError}</p>
                  </div>
                )}

                <button onClick={handleOrder} disabled={orderLoading || !payment}
                  className="w-full mt-5 py-3.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                  {orderLoading
                    ? <><Loader2 className="w-5 h-5 animate-spin" /> Илгээж байна...</>
                    : !payment
                      ? 'Төлбөрийн арга сонгоно уу'
                      : <><CheckCircle className="w-5 h-5" /> Захиалга батлах</>
                  }
                </button>
              </div>
            )}
          </div>

          {/* ══ Right: Order summary ══ */}
          <div className={`rounded-2xl border p-5 h-fit sticky top-28 ${cardBg}`}>
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-500" />
              Захиалгын хураангуй
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <img src={item.imageUrl} alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    onError={e => { e.target.src = 'https://via.placeholder.com/48?text=🍽'; }} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>{item.name}</p>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>× {item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold text-emerald-500 flex-shrink-0">
                    {(item.price * item.quantity).toLocaleString()}₮
                  </span>
                </div>
              ))}
            </div>
            <div className={`border-t mt-4 pt-4 space-y-2 ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
              <div className="flex justify-between text-sm">
                <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Хүргэлт</span>
                <span className="text-emerald-500 font-medium">Үнэгүй</span>
              </div>
              <div className="flex justify-between font-bold text-base">
                <span>Нийт</span>
                <span className="text-emerald-500">{total.toLocaleString()}₮</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}