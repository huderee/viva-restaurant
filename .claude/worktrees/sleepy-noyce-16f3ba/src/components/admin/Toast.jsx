// src/components/admin/Toast.jsx
import { useState, useCallback } from "react";
import { Check, AlertCircle, Info } from "lucide-react";

export function useToast() {
  const [toast, setToast] = useState(null);
  
  const show = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }, []);
  
  const ToastEl = toast ? (
    <div className="toast">
      {toast.type === 'success' && <Check size={15} color="var(--green)" />}
      {toast.type === 'error'   && <AlertCircle size={15} color="var(--red)" />}
      {toast.type === 'info'    && <Info size={15} color="var(--blue)" />}
      <span style={{ color: 'var(--text-primary)' }}>{toast.msg}</span>
    </div>
  ) : null;
  
  return { show, ToastEl };
}