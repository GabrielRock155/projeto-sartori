import React from 'react';
import { Trash2, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  detail?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  detail,
  confirmLabel = 'Excluir Definitivamente',
  cancelLabel = 'Cancelar',
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md rounded-xl bg-white border border-slate-200 shadow-xl overflow-hidden relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-50 border border-rose-100 text-rose-600">
              <div className="bg-transparent p-0">
                <Trash2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                {title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <div className="bg-transparent p-0">
              <X className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-3">
          <p className="text-xs text-slate-600 leading-relaxed">
            {message}
          </p>

          {detail && (
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800">
              {detail}
            </div>
          )}

          <p className="text-[11px] text-slate-400">
            Esta ação não poderá ser desfeita e removerá o registro permanentemente.
          </p>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-98 disabled:opacity-50"
          >
            <div className="bg-transparent p-0">
              <Trash2 className="w-3.5 h-3.5" />
            </div>
            <span>{isLoading ? 'Excluindo...' : confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
