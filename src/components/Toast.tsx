import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error';
  title: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  useEffect(() => {
    if (toasts.length === 0) return;

    const timers = toasts.map((t) =>
      setTimeout(() => {
        onDismiss(t.id);
      }, 4000)
    );

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-70 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl bg-white border shadow-lg transition-all duration-300 transform translate-y-0 opacity-100 flex items-start justify-between gap-3 ${
              isSuccess
                ? 'border-emerald-200 shadow-emerald-950/5'
                : 'border-rose-200 shadow-rose-950/5'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <div className="bg-transparent p-0 mt-0.5 shrink-0">
                {isSuccess ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                )}
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900 leading-tight">
                  {toast.title}
                </h4>
                {toast.description && (
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {toast.description}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
            >
              <div className="bg-transparent p-0">
                <X className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
};
