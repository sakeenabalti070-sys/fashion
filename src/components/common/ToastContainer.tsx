import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium shadow-xl transition-all animate-in fade-in slide-in-from-bottom-2 duration-200 ${
            toast.type === 'success'
              ? 'bg-[#18181B] text-white border border-[#27272A]'
              : toast.type === 'error'
              ? 'bg-rose-900 text-white border border-rose-800'
              : 'bg-[#27272A] text-white border border-[#3F3F46]'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400 shrink-0" />}
          <span className="leading-snug">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
