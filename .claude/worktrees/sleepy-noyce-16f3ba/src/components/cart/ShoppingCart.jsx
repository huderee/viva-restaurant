// src/components/cart/ShoppingCart.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  X, ShoppingBag, Trash2, Plus, Minus, Phone, MapPin,
  User, CheckCircle, Loader2, CreditCard, Banknote,
  Building2, ChevronRight, Copy, Check, QrCode,
  AlertCircle, Gift, Clock, Shield
} from 'lucide-react';
import { useCart }  from '../../contexts/CartContext';
import { useTheme } from '../../contexts/ThemeContext';

const PAYMENT_METHODS = [
  { id: 'cash',     label: 'Бэлэн мөнгө',     desc: 'Хүргэлтийн үед төлнө', icon: Banknote,  color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  { id: 'qpay',     label: 'QPay / SocialPay', desc: 'QR кодоор төлнө',      icon: QrCode,    color: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/30' },
  { id: 'transfer', label: 'Банкны шилжүүлэг', desc: 'Дансаар шилжүүлнэ',   icon: Building2, color: 'text-purple-400',  bg: 'bg-purple-500/10',  border: 'border-purple-500/30' },
];

const BANK_INFO = { bank: 'Хаан банк', account: '5863 4399 59', name: 'Хүдэрбаатар Эрдэнэцогт' };
const QPAY_QR   = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=QPay:HuuKRestaurant';

function StepIndicator({ step, isDark }) {
  const steps = [{ name: 'Сагс', icon: ShoppingBag }, { name: 'Мэдээлэл', icon: User }, { name: 'Төлбөр', icon: CreditCard }];
  return (
    <div className="flex items-center justify-between gap-2 py-4 px-2">
      {steps.map((s, i) => {
        const Icon = s.icon;
        const done = i + 1 < step;
        const curr = i + 1 === step;
        return (
          <React.Fragment key={s.name}>
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                done ? 'bg-emerald-500 text-white' : curr ? 'bg-amber-500 text-white ring-4 ring-amber-500/30' : isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'
              }`}>
                {done ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${curr ? 'text-amber-400' : done ? 'text-emerald-400' : isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {s.name}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px ${i + 1 < step ? 'bg-emerald-500' : isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function CartItem({ item, onUpdateQuantity, onRemove, isDark }) {
  const rowBg   = isDark ? 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600' : 'bg-gray-50 border-gray-200 hover:border-gray-300';
  const itemName= isDark ? 'text-white' : 'text-gray-800';
  const itemSub = isDark ? 'text-gray-400' : 'text-gray-500';
  const btnBg   = isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300';
  return (
    <div className={`flex gap-3 p-3 rounded-xl border transition-all group ${rowBg}`}>
      <div className="relative flex-shrink-0">
        <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-lg"
          onError={e => { e.target.src = 'https://via.placeholder.com/64?text=🍽'; }} />
        {item.isPopular && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
            <Gift className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h4 className={`font-semibold text-sm truncate ${itemName}`}>{item.name}</h4>
            <p className={`text-xs ${itemSub}`}>{item.price.toLocaleString()}₮</p>
          </div>
          <button onClick={() => onRemove(item.id)} className="text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5">
            <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${btnBg}`}>
              <Minus className={`w-3 h-3 ${isDark ? 'text-white' : 'text-gray-700'}`} />
            </button>
            <span className={`w-8 text-center font-medium text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>{item.quantity}</span>
            <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${btnBg}`}>
              <Plus className={`w-3 h-3 ${isDark ? 'text-white' : 'text-gray-700'}`} />
            </button>
          </div>
          <span className="font-bold text-amber-500 text-sm">{(item.price * item.quantity).toLocaleString()}₮</span>
        </div>
      </div>
    </div>
  );
}

function DiscountCode({ onApply, total, isDark }) {
  const [code, setCode]     = useState('');
  const [applied, setApplied] = useState(null);
  const handleApply = () => {
    if (code.toUpperCase() === 'WELCOME10')   { const d = total * 0.1; setApplied({ type: 'WELCOME10', value: d }); onApply(d); }
    else if (code.toUpperCase() === 'HAPPYHOUR') { const d = 5000; setApplied({ type: 'HAPPYHOUR', value: d }); onApply(d); }
    else alert('Хүчингүй код');
  };
  const inputCls = isDark ? 'bg-gray-800 text-white border-gray-700 focus:border-amber-500' : 'bg-white text-gray-800 border-gray-300 focus:border-amber-500';
  return (
    <div className={`rounded-xl p-3 border ${isDark ? 'bg-gray-800/30 border-gray-700/30' : 'bg-gray-50 border-gray-200'}`}>
      <div className="flex gap-2">
        <input type="text" value={code} onChange={e => setCode(e.target.value)} placeholder="Хөнгөлөлтийн код"
          className={`flex-1 px-3 py-2 rounded-lg border text-sm focus:outline-none transition-colors ${inputCls}`} />
        <button onClick={handleApply}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg text-sm font-medium transition-all">
          Хэрэглэх
        </button>
      </div>
      {applied && <p className="text-xs text-emerald-400 mt-2">✓ {applied.type} ({applied.value.toLocaleString()}₮ хямдарлаа)</p>}
    </div>
  );
}

export default function ShoppingCart() {
  const { cart, isCartOpen, closeCart, removeFromCart, updateQuantity, calculateTotal, calculateTotalItems, clearCart, placeOrder, orderLoading, orderError, lastOrder } = useCart();
  const { isDark } = useTheme();

  const [step, setStep]           = useState(1);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [copied, setCopied]       = useState(false);
  const [discount, setDiscount]   = useState(0);
  const [form, setForm] = useState({ customerName: '', phone: '', address: '', note: '' });
  const [formErrors, setFormErrors] = useState({});
  const cartRef = useRef();

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape' && isCartOpen) { closeCart(); setStep(1); } };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  const totalAfterDiscount = Math.max(0, calculateTotal() - discount);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (formErrors[name]) setFormErrors(p => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const errors = {};
    if (!form.customerName.trim()) errors.customerName = 'Нэр оруулна уу';
    if (!form.phone.trim()) errors.phone = 'Утасны дугаар оруулна уу';
    else if (!/^\d{8}$/.test(form.phone.replace(/\D/g, ''))) errors.phone = '8 оронтой тоо оруулна уу';
    if (!form.address.trim()) errors.address = 'Хаяг оруулна уу';
    return errors;
  };

  const handleNextToPayment = () => {
    const errors = validate();
    if (Object.keys(errors).length) { setFormErrors(errors); return; }
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    if (!paymentMethod) return;
    const result = await placeOrder({ ...form, paymentMethod, discount, totalAfterDiscount });
    if (result) { setOrderSuccess(true); setStep(1); setPaymentMethod(''); setDiscount(0); setForm({ customerName: '', phone: '', address: '', note: '' }); }
  };

  const copyAccount = async () => {
    await navigator.clipboard.writeText(BANK_INFO.account.replace(/\s/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetAndClose = () => { setOrderSuccess(false); setStep(1); setDiscount(0); closeCart(); };

  // Theme classes
  const drawerBg   = isDark ? 'bg-gradient-to-b from-gray-900 to-gray-950 border-gray-800' : 'bg-white border-gray-200';
  const headerBg   = isDark ? 'border-gray-800 bg-black/20' : 'border-gray-100 bg-gray-50';
  const footerBg   = isDark ? 'border-gray-800 bg-black/20' : 'border-gray-100 bg-gray-50';
  const titleCls   = isDark ? 'text-white' : 'text-gray-900';
  const backBtn    = isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900';
  const closeBtn   = isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500';
  const labelCls   = isDark ? 'text-gray-400' : 'text-gray-500';
  const inputCls   = (err) => `w-full py-2.5 bg-${isDark ? 'gray-800 text-white border-' + (err ? 'red-500' : 'gray-700') : 'white text-gray-800 border-' + (err ? 'red-400' : 'gray-300')} rounded-xl border text-sm focus:outline-none focus:border-amber-500 transition-colors`;
  const summaryBg  = isDark ? 'bg-gray-800/60 border-gray-700/50' : 'bg-gray-50 border-gray-200';
  const divLine    = isDark ? 'border-gray-700' : 'border-gray-200';
  const paySelBg   = (sel, m) => sel
    ? `${m.bg} ${m.border} ring-2 ring-amber-500/20`
    : isDark ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600' : 'bg-gray-50 border-gray-200 hover:border-gray-300';

  // Success screen
  if (orderSuccess) {
    return (
      <>
        <div className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm" onClick={resetAndClose} />
        <div className={`fixed right-0 top-0 h-full w-full md:w-96 z-50 shadow-2xl border-l flex items-center justify-center animate-slide-in-right ${drawerBg}`}>
          <div className="text-center px-8 py-12">
            <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-14 h-14 text-emerald-400" />
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${titleCls}`}>Баярлалаа! 🎉</h2>
            <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Таны захиалга амжилттай хүлээгдлээ</p>
            {lastOrder?._id && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2 mb-4 inline-block">
                <p className="text-amber-400 text-xs font-mono">#{lastOrder._id.slice(-8).toUpperCase()}</p>
              </div>
            )}
            <div className={`rounded-xl p-4 mb-6 text-left space-y-2 ${summaryBg} border`}>
              <div className="flex justify-between text-sm">
                <span className={labelCls}>Нийт дүн:</span>
                <span className="text-amber-500 font-bold">{totalAfterDiscount.toLocaleString()}₮</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={labelCls}>Хүргэлтийн хугацаа:</span>
                <span className="text-emerald-400 flex items-center gap-1"><Clock className="w-3 h-3" /> 30-45 мин</span>
              </div>
            </div>
            <button onClick={resetAndClose}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl font-medium transition-all">
              Үргэлжлүүлэх
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" onClick={() => { closeCart(); setStep(1); }} />
      <div ref={cartRef} className={`fixed right-0 top-0 h-full w-full md:w-96 z-50 shadow-2xl border-l flex flex-col animate-slide-in-right ${drawerBg}`}>

        {/* Header */}
        <div className={`p-5 border-b flex-shrink-0 ${headerBg}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {step > 1 ? (
                <button onClick={() => setStep(s => s - 1)} className={`flex items-center gap-1 text-sm ${backBtn}`}>
                  ← Буцах
                </button>
              ) : (
                <>
                  <div className="relative">
                    <ShoppingBag className="w-5 h-5 text-amber-400" />
                    {cart.length > 0 && (
                      <span className="absolute -top-2 -right-2 w-4 h-4 bg-amber-500 rounded-full text-white text-xs flex items-center justify-center">
                        {calculateTotalItems()}
                      </span>
                    )}
                  </div>
                  <h2 className={`text-lg font-bold ${titleCls}`}>Миний сагс</h2>
                </>
              )}
            </div>
            <button onClick={() => { closeCart(); setStep(1); }} className={`p-1.5 rounded-lg transition-colors ${closeBtn}`}>
              <X className="w-5 h-5" />
            </button>
          </div>
          {cart.length > 0 && <StepIndicator step={step} isDark={isDark} />}
        </div>

        {/* Step 1: Cart */}
        {step === 1 && (
          <>
            <div className="flex-1 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <ShoppingBag className={`w-12 h-12 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Сагс хоосон байна</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Цэснээс хоол нэмээд үзээрэй</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {cart.map(item => <CartItem key={item.id} item={item} isDark={isDark} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} />)}
                  </div>
                  <DiscountCode onApply={setDiscount} total={calculateTotal()} isDark={isDark} />
                  <div className={`mt-4 p-3 rounded-xl border ${isDark ? 'bg-gray-800/30 border-gray-700/30' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Shield className="w-3 h-3" />
                      <span>Аюулгүй худалдан авалт, 100% баталгаа</span>
                    </div>
                  </div>
                </>
              )}
            </div>
            {cart.length > 0 && (
              <div className={`p-5 border-t space-y-3 flex-shrink-0 ${footerBg}`}>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className={`text-sm ${labelCls}`}>Нийт дүн:</span>
                    <span className={`text-lg font-bold ${titleCls}`}>{calculateTotal().toLocaleString()}₮</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-green-500 text-sm">Хөнгөлөлт:</span>
                      <span className="text-green-500 font-medium">-{discount.toLocaleString()}₮</span>
                    </div>
                  )}
                  <div className={`flex justify-between pt-2 border-t ${divLine}`}>
                    <span className={`font-bold ${titleCls}`}>Төлөх дүн:</span>
                    <span className="text-2xl font-bold text-amber-500">{totalAfterDiscount.toLocaleString()}₮</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={clearCart}
                    className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-colors ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                    Цэвэрлэх
                  </button>
                  <button onClick={() => setStep(2)}
                    className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-1 transition-all">
                    Захиалах <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Step 2: Info */}
        {step === 2 && (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className={`p-3 rounded-xl border ${isDark ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-200'}`}>
                <p className="text-amber-500 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Таны мэдээлэл 100% нууцлалтай
                </p>
              </div>

              {[
                { name: 'customerName', label: 'Нэр', type: 'text', placeholder: 'Таны нэр', icon: User },
                { name: 'phone',        label: 'Утасны дугаар', type: 'tel', placeholder: '99001122', icon: Phone, maxLength: 8 },
              ].map(f => (
                <div key={f.name}>
                  <label className={`block text-xs mb-1.5 ${labelCls}`}>{f.label} *</label>
                  <div className="relative">
                    <f.icon className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                    <input type={f.type} name={f.name} value={form[f.name]} onChange={handleChange}
                      placeholder={f.placeholder} maxLength={f.maxLength}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-amber-500 transition-colors ${
                        isDark
                          ? `bg-gray-800 text-white placeholder-gray-500 ${formErrors[f.name] ? 'border-red-500' : 'border-gray-700'}`
                          : `bg-white text-gray-800 placeholder-gray-400 ${formErrors[f.name] ? 'border-red-400' : 'border-gray-300'}`
                      }`} />
                  </div>
                  {formErrors[f.name] && <p className="text-red-400 text-xs mt-1">{formErrors[f.name]}</p>}
                </div>
              ))}

              <div>
                <label className={`block text-xs mb-1.5 ${labelCls}`}>Хүргэлтийн хаяг *</label>
                <div className="relative">
                  <MapPin className={`absolute left-3 top-3 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                  <textarea name="address" value={form.address} onChange={handleChange}
                    placeholder="Дүүрэг, хороо, байр, тоот..." rows={3}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-amber-500 transition-colors resize-none ${
                      isDark
                        ? `bg-gray-800 text-white placeholder-gray-500 ${formErrors.address ? 'border-red-500' : 'border-gray-700'}`
                        : `bg-white text-gray-800 placeholder-gray-400 ${formErrors.address ? 'border-red-400' : 'border-gray-300'}`
                    }`} />
                </div>
                {formErrors.address && <p className="text-red-400 text-xs mt-1">{formErrors.address}</p>}
              </div>

              <div>
                <label className={`block text-xs mb-1.5 ${labelCls}`}>Нэмэлт тэмдэглэл</label>
                <textarea name="note" value={form.note} onChange={handleChange}
                  placeholder="Хурдан хүргэх, давс бага гэх мэт..." rows={2}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-amber-500 transition-colors resize-none ${
                    isDark ? 'bg-gray-800 text-white border-gray-700 placeholder-gray-500' : 'bg-white text-gray-800 border-gray-300 placeholder-gray-400'
                  }`} />
              </div>

              <div className={`rounded-xl p-4 border ${summaryBg}`}>
                <h4 className={`text-xs font-semibold mb-3 uppercase tracking-wide ${labelCls}`}>Захиалгын хураангуй</h4>
                {cart.map(item => (
                  <div key={item.id} className={`flex justify-between text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span className="truncate pr-2">{item.name} × {item.quantity}</span>
                    <span>{(item.price * item.quantity).toLocaleString()}₮</span>
                  </div>
                ))}
                <div className={`border-t mt-2 pt-2 flex justify-between font-bold text-sm ${divLine}`}>
                  <span className={titleCls}>Нийт дүн</span>
                  <span className="text-amber-500">{totalAfterDiscount.toLocaleString()}₮</span>
                </div>
              </div>
            </div>
            <div className={`p-5 border-t flex-shrink-0 ${footerBg}`}>
              <button onClick={handleNextToPayment}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                Үргэлжлүүлэх <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <h3 className={`text-base font-bold ${titleCls}`}>Төлбөрийн хэлбэр сонгох</h3>
              <div className="space-y-2">
                {PAYMENT_METHODS.map(m => {
                  const Icon = m.icon;
                  const sel  = paymentMethod === m.id;
                  return (
                    <button key={m.id} onClick={() => setPaymentMethod(m.id)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${paySelBg(sel, m)}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${m.bg} ${m.border}`}>
                        <Icon className={`w-5 h-5 ${m.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold text-sm ${sel ? (isDark ? 'text-white' : 'text-gray-900') : (isDark ? 'text-gray-300' : 'text-gray-700')}`}>{m.label}</p>
                        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{m.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${sel ? 'border-amber-500 bg-amber-500' : isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                        {sel && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {paymentMethod === 'qpay' && (
                <div className={`rounded-xl p-4 text-center space-y-3 border ${isDark ? 'bg-blue-500/5 border-blue-500/20' : 'bg-blue-50 border-blue-200'}`}>
                  <p className="text-blue-400 text-sm font-medium flex items-center justify-center gap-2">
                    <QrCode className="w-4 h-4" /> QPay QR код
                  </p>
                  <div className="bg-white rounded-xl p-3 inline-block shadow-lg">
                    <img src={QPAY_QR} alt="QPay QR" className="w-40 h-40 mx-auto" />
                  </div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>QPay эсвэл SocialPay-аар скан хийн төлнө үү</p>
                </div>
              )}

              {paymentMethod === 'transfer' && (
                <div className={`rounded-xl p-4 space-y-3 border ${isDark ? 'bg-purple-500/5 border-purple-500/20' : 'bg-purple-50 border-purple-200'}`}>
                  <p className="text-purple-400 text-sm font-medium">Банкны шилжүүлэг</p>
                  {[
                    { label: 'Банк', value: BANK_INFO.bank },
                    { label: 'Нэр',  value: BANK_INFO.name },
                    { label: 'Данс', value: BANK_INFO.account, copy: true },
                    { label: 'Дүн',  value: `${totalAfterDiscount.toLocaleString()}₮` },
                  ].map(row => (
                    <div key={row.label} className={`flex items-center justify-between py-2 border-b last:border-0 ${isDark ? 'border-purple-500/10' : 'border-purple-200/50'}`}>
                      <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{row.label}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${titleCls}`}>{row.value}</span>
                        {row.copy && (
                          <button onClick={copyAccount} className={`${isDark ? 'text-gray-500 hover:text-purple-400' : 'text-gray-400 hover:text-purple-600'} transition-colors`}>
                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {paymentMethod === 'cash' && (
                <div className={`rounded-xl p-4 border ${isDark ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'}`}>
                  <p className="text-emerald-500 text-sm font-medium mb-2 flex items-center gap-2">
                    <Banknote className="w-4 h-4" /> Бэлэн мөнгөөр төлөх
                  </p>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Хүргэлтийн ажилтан ирэхэд <span className={`font-bold ${titleCls}`}>{totalAfterDiscount.toLocaleString()}₮</span> бэлэн мөнгөөр төлнө үү.
                  </p>
                </div>
              )}

              <div className={`rounded-xl p-4 border ${summaryBg}`}>
                <div className={`flex justify-between text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <span>Хоол, ундаа</span><span className={titleCls}>{calculateTotal().toLocaleString()}₮</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-green-500">Хөнгөлөлт</span>
                    <span className="text-green-500">-{discount.toLocaleString()}₮</span>
                  </div>
                )}
                <div className="flex justify-between text-sm mb-2">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Хүргэлт</span>
                  <span className="text-emerald-500">Үнэгүй</span>
                </div>
                <div className={`border-t pt-3 mt-2 flex justify-between ${divLine}`}>
                  <span className={`font-bold text-base ${titleCls}`}>Нийт төлөх</span>
                  <span className="text-amber-500 text-xl font-bold">{totalAfterDiscount.toLocaleString()}₮</span>
                </div>
              </div>

              {orderError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                  <p className="text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {orderError}
                  </p>
                </div>
              )}
            </div>

            <div className={`p-5 border-t flex-shrink-0 ${footerBg}`}>
              <button onClick={handlePlaceOrder} disabled={orderLoading || !paymentMethod}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2">
                {orderLoading
                  ? <><Loader2 className="w-5 h-5 animate-spin" /> Илгээж байна...</>
                  : !paymentMethod
                    ? 'Төлбөрийн арга сонгоно уу'
                    : <><CheckCircle className="w-5 h-5" /> Захиалга батлах</>
                }
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}