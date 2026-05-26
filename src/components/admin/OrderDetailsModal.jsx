// src/components/admin/OrderDetailsModal.jsx
import { useState } from "react";
import {
  X, Users, Calendar, MapPin, CheckCircle2, ChefHat, Printer
} from "lucide-react";
import { currency } from "../../utils/format";
import { PAYMENT_STATUS } from "../../utils/adminMetrics";
import StatusDropdown from './StatusDropdown';
import { ORDER_STATUS } from './StatusBadge';

const PAYMENT_LABELS = { cash: 'Бэлэн', qpay: 'QPay', transfer: 'Шилжүүлэг' };
const ORDER_TYPE_LABELS = { pickup: 'Очиж авах', delivery: 'Хүргэлт', 'dine-in': 'Ресторан' };

function OrderDetailsModal({ order, onClose, onPrint, onStatus }) {
  const [status, setStatus] = useState(order?.status);
  const items = order?.items ?? [];

  const handle = async (s) => {
    const prev = status;
    setStatus(s);
    try {
      await onStatus(s);
    } catch {
      setStatus(prev);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal-content" style={{ width: '100%', maxWidth: 560, margin: 24 }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '22px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-faint)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Захиалгын дэлгэрэнгүй</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 className="mono" style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.01em' }}>
                {order?.orderNumber || `#${order?._id?.slice(-6).toUpperCase()}`}
              </h2>
              <StatusDropdown value={status} onChange={handle} statusMap={ORDER_STATUS} />
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={15} />
          </button>
        </div>

        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ background: 'var(--bg-base)', borderRadius: 12, padding: '14px 16px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <Users size={11} color="var(--text-faint)" />
                <span style={{ fontSize: 11, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Хэрэглэгч</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{order?.customerName || 'Зочин'}</div>
              {order?.phone && <div className="mono" style={{ fontSize: 12, color: 'var(--text-muted)' }}>{order.phone}</div>}
            </div>
            <div style={{ background: 'var(--bg-base)', borderRadius: 12, padding: '14px 16px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <Calendar size={11} color="var(--text-faint)" />
                <span style={{ fontSize: 11, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Огноо</span>
              </div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{new Date(order?.createdAt).toLocaleDateString('mn-MN', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div className="mono" style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                {new Date(order?.createdAt).toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 10 }}>
              Захиалсан зүйлс · {items.length} бараа
            </div>
            <div style={{ background: 'var(--bg-base)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden', maxHeight: 220, overflowY: 'auto' }}>
              {items.length === 0 ? (
                <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-faint)', fontSize: 13 }}>—</div>
              ) : items.map((it, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 16px', borderBottom: idx < items.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>×{it.quantity}</span>
                    <span style={{ fontSize: 13 }}>{it.name}</span>
                  </div>
                  <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b' }}>{currency((it.price ?? 0) * (it.quantity ?? 1))}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--accent-soft)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 12, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Нийт дүн</span>
            <span className="mono" style={{ fontSize: 22, fontWeight: 900, color: '#f59e0b' }}>{currency(order?.totalAmount || 0)}</span>
          </div>

          {(order?.orderType || order?.paymentMethod || order?.paymentStatus) && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8 }}>
              {order.orderType && (
                <div style={{ padding: '10px 14px', background: 'var(--bg-base)', borderRadius: 10, border: '1px solid var(--border)', fontSize: 13 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-faint)', marginBottom: 4 }}>Төрөл</div>
                  <div>{ORDER_TYPE_LABELS[order.orderType] || order.orderType}</div>
                </div>
              )}
              {order.paymentMethod && (
                <div style={{ padding: '10px 14px', background: 'var(--bg-base)', borderRadius: 10, border: '1px solid var(--border)', fontSize: 13 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-faint)', marginBottom: 4 }}>Төлбөрийн хэлбэр</div>
                  <div>{PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}</div>
                </div>
              )}
              {order.paymentStatus && (
                <div style={{ padding: '10px 14px', background: 'var(--bg-base)', borderRadius: 10, border: '1px solid var(--border)', fontSize: 13 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-faint)', marginBottom: 4 }}>Төлбөрийн төлөв</div>
                  <div style={{ fontWeight: 600, color: PAYMENT_STATUS[order.paymentStatus]?.color || 'var(--text-primary)' }}>
                    {PAYMENT_STATUS[order.paymentStatus]?.label || order.paymentStatus}
                  </div>
                </div>
              )}
            </div>
          )}

          {order?.address && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 14px', background: 'var(--bg-base)', borderRadius: 10, border: '1px solid var(--border)' }}>
              <MapPin size={13} color="var(--text-faint)" style={{ marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-faint)', marginBottom: 2 }}>
                  {order.orderType === 'pickup' ? 'Очиж авах салбар' : 'Хүргэлтийн хаяг'}
                </div>
                <div style={{ fontSize: 13 }}>{order.address}</div>
              </div>
            </div>
          )}

          {order?.note && (
            <div style={{ padding: '10px 14px', background: 'var(--bg-base)', borderRadius: 10, border: '1px solid var(--border)', fontSize: 13, whiteSpace: 'pre-wrap' }}>
              <div style={{ fontSize: 11, color: 'var(--text-faint)', marginBottom: 4 }}>Тэмдэглэл</div>
              {order.note}
            </div>
          )}
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
          <button className="btn btn-success" onClick={() => handle('completed')} style={{ flex: 1 }}>
            <CheckCircle2 size={14} /> Бэлэн болгох
          </button>
          <button className="btn btn-ghost" onClick={() => handle('cooking')} style={{ flex: 1 }}>
            <ChefHat size={14} /> Хийж байна
          </button>
          <button className="btn btn-ghost" onClick={onPrint}>
            <Printer size={14} /> Хэвлэх
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsModal;
