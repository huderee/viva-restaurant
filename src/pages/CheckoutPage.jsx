import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, User, Phone, MapPin,
  Banknote, QrCode, Building2, CheckCircle, Loader2,
  ShoppingBag, Clock, AlertCircle, Check, RefreshCw, ExternalLink,
  Landmark, WalletCards, Smartphone, CreditCard
} from 'lucide-react';
import { useCart }      from '../contexts/CartContext';
import { useOrderType } from '../contexts/OrderTypeContext';
import { useTheme }     from '../contexts/ThemeContext';
import api from '../lib/api';
import CheckoutOrderOptions from '../components/cart/CheckoutOrderOptions';

const BANK_INFO = {
  bank:    'Хаан банк',
  name:    'ХҮҮК ООО',
  account: '5000 1234 5678',
};

const PAYMENT_METHODS = [
  { id: 'cash',     label: 'Бэлэн мөнгө',         desc: 'Очиж авах эсвэл хүргэлтийн үед төлнө',  icon: Banknote,  color: 'amber' },
  { id: 'qpay',     label: 'QPay / SocialPay',     desc: 'QR кодоор төлнө',       icon: QrCode,    color: 'blue'    },
  { id: 'transfer', label: 'Банкны шилжүүлэг',     desc: 'Дансаар шилжүүлнэ',    icon: Building2, color: 'purple'  },
];

const COLOR = {
  amber:   { bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   text: 'text-amber-400',   ring: 'ring-amber-500/30'   },
  blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/30',    text: 'text-blue-400',    ring: 'ring-blue-500/30'    },
  purple:  { bg: 'bg-purple-500/10',  border: 'border-purple-500/30',  text: 'text-purple-400',  ring: 'ring-purple-500/30'  },
};

const getQpayAppIcon = (label = '') => {
  const text = String(label).toLowerCase();
  if (text.includes('qpay')) return WalletCards;
  if (text.includes('khan') || text.includes('bank')) return Landmark;
  if (text.includes('social')) return Smartphone;
  return CreditCard;
};

const getQpayAppTone = (label = '') => {
  const text = String(label).toLowerCase();
  if (text.includes('qpay')) return 'border-sky-400/30 bg-sky-500/10 text-sky-300';
  if (text.includes('khan')) return 'border-blue-400/30 bg-blue-500/10 text-blue-300';
  if (text.includes('state')) return 'border-cyan-400/30 bg-cyan-500/10 text-cyan-300';
  if (text.includes('xac')) return 'border-indigo-400/30 bg-indigo-500/10 text-indigo-300';
  if (text.includes('trade')) return 'border-blue-300/30 bg-blue-400/10 text-blue-200';
  if (text.includes('social')) return 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300';
  return 'border-white/10 bg-white/5 text-blue-300';
};

export default function CheckoutPage() {
  const navigate  = useNavigate();
  const { isDark } = useTheme();
  const { cart, calculateTotal, placeOrder, clearCart, orderLoading, orderError } = useCart();
  const { orderType, selectedBranch } = useOrderType();

  const [step, setStep]   = useState(1);
  const [payment, setPayment] = useState('');
  const [form, setForm]   = useState({ name: '', phone: '', address: '', note: '' });
  const [errors, setErrors] = useState({});
  const [createdOrder, setCreatedOrder] = useState(null);
  const [createdPayment, setCreatedPayment] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentMessage, setPaymentMessage] = useState('');

  const total = calculateTotal();

  // Сагс хоосон бол цэс рүү буцаана (амжилттай захиалгын дараа step 3-д үлдэнэ)
  useEffect(() => {
    if (cart.length === 0 && step < 3) {
      navigate('/menu', { replace: true });
    }
  }, [cart.length, step, navigate]);

  // Load saved draft
  useEffect(() => {
    const saved = localStorage.getItem('checkout_draft');
    if (saved) {
      try {
        setForm(JSON.parse(saved));
      } catch (e) {
        console.error('Draft parse error:', e);
      }
    }
  }, []);

  // Auto save draft
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (form.name || form.phone) {
        localStorage.setItem('checkout_draft', JSON.stringify(form));
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [form]);

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

  const refreshPayment = async (orderId = createdOrder?._id, { claim = false } = {}) => {
    if (!orderId) return null;
    setPaymentLoading(true);
    setPaymentError('');

    try {
      const statusResult = await api.get(`/payments/order/${orderId}`);
      let nextPayment = statusResult?.data || statusResult;

      if (claim && nextPayment?._id && nextPayment?.status !== 'completed') {
        const claimResult = await api.post(`/payments/${nextPayment._id}/claim`, {});
        nextPayment = claimResult?.data || nextPayment;
        setPaymentMessage(claimResult?.message || '');
      }

      setCreatedPayment(nextPayment);
      if (nextPayment?.status === 'completed') {
        clearCart();
        localStorage.removeItem('checkout_draft');
        setPaymentMessage('Төлбөр амжилттай баталгаажлаа.');
      }
      return nextPayment;
    } catch (error) {
      setPaymentError(error?.message || 'Төлбөрийн төлөв шалгахад алдаа гарлаа.');
      return null;
    } finally {
      setPaymentLoading(false);
    }
  };

  const buildOrderPayload = () => {
    const branchNote = orderType === 'pickup'
      ? `Очиж авах: ${selectedBranch.name} — ${selectedBranch.address}`
      : orderType === 'dine-in'
        ? `Зааланд идэх: ${selectedBranch.name}`
        : '';
    const combinedNote = [form.note.trim(), branchNote].filter(Boolean).join('\n');

    return {
      name:          form.name,
      phone:         form.phone,
      address:       orderType === 'delivery' ? form.address : selectedBranch.address,
      note:          combinedNote,
      orderType: ['pickup', 'delivery', 'dine-in'].includes(orderType) ? orderType : 'pickup',
      paymentMethod: payment,
    };
  };

  const handleOrder = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); setStep(1); return; }
    if (!payment || paymentLoading || orderLoading) return;
    setPaymentError('');
    setPaymentMessage('');

    const result = await placeOrder(buildOrderPayload());
    if (!result) return;

    setCreatedOrder(result);
    try {
      setPaymentLoading(true);
      const paymentResult = await api.post('/payments', {
        orderId: result._id,
        method: payment,
        amount: result.totalAmount || total,
      });
      setCreatedPayment(paymentResult?.data || paymentResult);
      if (payment !== 'qpay') {
        clearCart();
        localStorage.removeItem('checkout_draft');
        setPaymentMessage(
          payment === 'transfer'
            ? 'Шилжүүлгээ хийсний дараа ресторан төлбөрийг баталгаажуулна.'
            : 'Захиалга бүртгэгдлээ. Төлбөрийг авах үед төлнө.'
        );
      }
      setStep(3);
    } catch (error) {
      setPaymentError(
        error?.message
          ? `${error.message} (Захиалга #${result.orderNumber || String(result._id).slice(-6)} үүссэн)`
          : 'Төлбөр үүсгэхэд алдаа гарлаа.'
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  const qpayUrls = (() => {
    const urls = createdPayment?.qpayRaw?.urls;
    if (Array.isArray(urls)) return urls;
    if (urls && typeof urls === 'object') return Object.values(urls).flat();
    return [];
  })().filter(Boolean);

  const pageBg   = isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900';
  const cardBg   = isDark ? 'bg-gray-900 border-white/10' : 'bg-white border-gray-200 shadow-sm';
  const inputCls = (err) => `w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 ${
    isDark
      ? `bg-gray-800 text-white placeholder-gray-500 ${err ? 'border-red-500' : 'border-white/10'}`
      : `bg-white text-gray-800 placeholder-gray-400 ${err ? 'border-red-400' : 'border-gray-300'}`
  }`;
  const labelCls = `block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`;

  const StepIndicator = () => {
    const steps = ['Сагс', 'Мэдээлэл', 'Төлбөр'];
    
    return (
      <div className="flex items-center justify-between mb-8 relative px-4">
        <div className={`absolute top-5 left-0 right-0 h-1 -z-10 ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
          <div 
            className="h-full bg-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>
        
        {steps.map((s, i) => {
          const isActive = i + 1 === step;
          const isCompleted = i + 1 < step;
          
          return (
            <div key={s} className="flex flex-col items-center bg-inherit">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
                ${isCompleted ? 'bg-amber-500 text-white' : 
                  isActive ? 'bg-amber-500 text-white ring-4 ring-amber-500/30 scale-110' : 
                  isDark ? 'bg-gray-800 text-gray-500 border border-gray-700' : 'bg-white text-gray-400 border border-gray-300'}
              `}>
                {isCompleted ? <Check className="w-5 h-5" /> : i + 1}
              </div>
              <span className={`text-xs mt-2 font-medium ${
                isActive || isCompleted ? 'text-amber-500' : isDark ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {s}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  if (step === 3) {
    const isPaid = createdPayment?.status === 'completed';
    const isQpay = payment === 'qpay';
    const displayTotal = createdOrder?.totalAmount ?? total;

    return (
      <div className={`min-h-screen pt-20 flex items-center justify-center px-4 ${pageBg}`}>
        <div className="text-center max-w-md w-full">
          <div className={`w-24 h-24 border rounded-full flex items-center justify-center mx-auto mb-6 ${
            isPaid ? 'bg-green-500/10 border-green-500/20' : 'bg-amber-500/10 border-amber-500/20'
          }`}>
            {isPaid ? <CheckCircle className="w-14 h-14 text-green-500" /> : <Clock className="w-14 h-14 text-amber-400" />}
          </div>
          <h1 className="text-2xl font-bold mb-2">{isPaid ? 'Төлбөр баталгаажлаа' : 'Захиалга хүлээн авлаа'}</h1>
          <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {isQpay && !isPaid ? 'QPay QR кодоо уншуулж төлбөрөө баталгаажуулна уу.' : 'Таны захиалга системд бүртгэгдлээ.'}
          </p>

          {isQpay && createdPayment?.qpayDetails?.qrCode && !isPaid && (
            <div className={`rounded-xl p-4 mb-4 border ${cardBg}`}>
              <img
                src={createdPayment.qpayDetails.qrCode}
                alt="QPay QR"
                className="w-56 h-56 mx-auto rounded-lg bg-white p-2 object-contain"
              />
              {qpayUrls.length > 0 && (
                <div className="mt-4">
                  <p className={`mb-2 text-left text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Банкны апп сонгох
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                  {qpayUrls.slice(0, 6).map((u, index) => {
                    const link = typeof u === 'string' ? u : (u.link || u.url || u.path);
                    const label = typeof u === 'string' ? `Апп ${index + 1}` : (u.name || u.description || `Апп ${index + 1}`);
                    if (!link) return null;
                    const AppIcon = getQpayAppIcon(label);
                    return (
                      <a
                        key={`${label}-${index}`}
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className={`flex min-h-10 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                          isDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-white hover:bg-gray-50'
                        }`}
                      >
                        <AppIcon className="h-4 w-4 text-blue-400" />
                        <span className="truncate">{label}</span>
                        <ExternalLink className="h-3 w-3 opacity-70" />
                      </a>
                    );
                  })}
                  </div>
                </div>
              )}
              <button
                onClick={() => refreshPayment(createdOrder?._id, { claim: true })}
                disabled={paymentLoading || !createdPayment?._id}
                className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
              >
                {paymentLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                Төлбөр шалгах
              </button>
            </div>
          )}

          {!isQpay && !isPaid && payment === 'transfer' && (
            <div className={`rounded-xl p-4 mb-4 border text-left ${cardBg}`}>
              <p className="text-purple-400 text-sm font-bold mb-3">Шилжүүлгийн мэдээлэл</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-4"><span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Банк</span><span>{BANK_INFO.bank}</span></div>
                <div className="flex justify-between gap-4"><span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Хүлээн авагч</span><span>{BANK_INFO.name}</span></div>
                <div className="flex justify-between gap-4"><span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Данс</span><span className="font-mono">{BANK_INFO.account}</span></div>
                <div className="flex justify-between gap-4"><span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Гүйлгээний утга</span><span className="font-bold">{createdOrder?.orderNumber || 'Захиалгын дугаар'}</span></div>
              </div>
            </div>
          )}

          {!isQpay && !isPaid && payment === 'cash' && (
            <div className={`rounded-xl p-4 mb-4 border text-left ${cardBg}`}>
              <p className="text-amber-500 text-sm font-bold">Бэлэн төлбөр</p>
              <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Захиалгыг хүлээн авлаа. Очих үед эсвэл хүргэлтийн ажилтанд төлнө.
              </p>
            </div>
          )}

          {paymentError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{paymentError}</p>
            </div>
          )}
          {paymentMessage && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-500 text-sm">
              {paymentMessage}
            </div>
          )}

          <div className={`rounded-xl p-4 mb-6 text-left border ${cardBg}`}>
            {createdOrder?.orderNumber && (
              <div className="flex justify-between text-sm mb-2">
                <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Захиалгын дугаар</span>
                <span className="font-bold">{createdOrder.orderNumber}</span>
              </div>
            )}
            <div className="flex justify-between text-sm mb-2">
              <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Захиалгын дүн</span>
              <span className="font-bold text-amber-500">{displayTotal.toLocaleString()}₮</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Төлбөрийн төлөв</span>
              <span className={`font-semibold ${isPaid ? 'text-green-500' : 'text-amber-500'}`}>
                {isPaid ? 'Төлөгдсөн' : payment === 'qpay' ? 'QPay хүлээгдэж байна' : 'Баталгаажуулалт хүлээгдэж байна'}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate('/menu')}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-all"
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

        <button onClick={() => step === 1 ? navigate('/menu') : setStep(1)}
          className={`flex items-center gap-1 text-sm mb-6 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
          <ChevronLeft className="w-4 h-4" /> Буцах
        </button>

        <StepIndicator />

        <div className="grid lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 space-y-4">

            {step === 1 && (
              <div className={`rounded-2xl border p-6 ${cardBg}`}>
                <h2 className="text-lg font-bold mb-5">Захиалгын мэдээлэл</h2>

                <CheckoutOrderOptions />

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
                  className="w-full mt-5 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                  Үргэлжлүүлэх <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

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
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${sel ? 'border-amber-500 bg-amber-500' : isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                          {sel && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {payment === 'transfer' && (
                  <div className={`mt-4 rounded-xl p-4 border space-y-2 ${isDark ? 'bg-purple-500/5 border-purple-500/20' : 'bg-purple-50 border-purple-200'}`}>
                    <p className="text-purple-400 text-sm font-medium">Шилжүүлэгийн мэдээлэл</p>
                    <div className="flex justify-between text-sm"><span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Банк</span><span>{BANK_INFO.bank}</span></div>
                    <div className="flex justify-between text-sm"><span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Данс</span><span className="font-mono">{BANK_INFO.account}</span></div>
                    <div className="flex justify-between text-sm"><span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Дүн</span><span className="text-amber-500 font-bold">{total.toLocaleString()}₮</span></div>
                  </div>
                )}

                {orderError && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <p className="text-red-400 text-sm">{orderError}</p>
                  </div>
                )}

                <button onClick={handleOrder} disabled={orderLoading || !payment}
                  className="w-full mt-5 py-3.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
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

          <div className={`rounded-2xl border p-5 h-fit sticky top-28 ${cardBg}`}>
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-500" />
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
                  <span className="text-sm font-bold text-amber-500 flex-shrink-0">
                    {(Number(item.unitPrice ?? item.customPrice ?? item.price ?? 0) * item.quantity).toLocaleString()}₮
                  </span>
                </div>
              ))}
            </div>
            <div className={`border-t mt-4 pt-4 space-y-2 ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
              <div className="flex justify-between text-sm">
                <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Хүргэлт</span>
                <span className="text-amber-500 font-medium">Үнэгүй</span>
              </div>
              <div className="flex justify-between font-bold text-base">
                <span>Нийт</span>
                <span className="text-amber-500">{total.toLocaleString()}₮</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
