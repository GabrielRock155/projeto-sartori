import React from 'react';
import type { Suit } from '../types';
import { formatCurrency } from '../utils/formatters';
import { 
  X, 
  ShoppingBag,
  Pencil,
  Trash2
} from 'lucide-react';

interface SuitDetailsModalProps {
  suit: Suit | null;
  onClose: () => void;
  onEditSuit?: (suit: Suit) => void;
  onDeleteSuit?: (suit: Suit) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const SuitDetailsModal: React.FC<SuitDetailsModalProps> = ({
  suit,
  onClose,
  onEditSuit,
  onDeleteSuit,
  canEdit = true,
  canDelete = true,
}) => {
  if (!suit) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-2xl rounded-xl bg-white border border-slate-200 shadow-xl overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="bg-transparent p-0">
              <ShoppingBag className="w-5 h-5 text-slate-800" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Ficha Tecnica do Terno
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Ref: {suit.code}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <div className="bg-transparent p-0">
              <X className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Image */}
          <div className="relative h-72 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={suit.image}
              alt={suit.name}
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* Details */}
          <div className="space-y-4 text-xs">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                {suit.category}
              </span>
              <h4 className="text-lg font-bold text-slate-900 mt-0.5">
                {suit.name}
              </h4>
            </div>

            <div className="space-y-2 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Tecido Nobre:</span>
                <span className="font-semibold text-slate-900 text-right">{suit.fabric}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cor:</span>
                <span className="font-semibold text-slate-900">{suit.color}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tamanho:</span>
                <span className="font-semibold text-slate-900 font-mono">{suit.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estoque Atual:</span>
                <span className="font-semibold text-slate-900">{suit.stock} unidades</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className={`font-semibold capitalize ${suit.status === 'baixo_estoque' ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {suit.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block uppercase tracking-wider">
                  Preco de Venda
                </span>
                <span className="text-base font-bold text-slate-900 font-mono">
                  {formatCurrency(suit.price)}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block uppercase tracking-wider">
                  Preco de Custo
                </span>
                <span className="text-base font-bold text-slate-700 font-mono">
                  {formatCurrency(suit.costPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Edit Button */}
            {onEditSuit && (
              canEdit ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEditSuit(suit);
                  }}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-800 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <div className="bg-transparent p-0">
                    <Pencil className="w-3.5 h-3.5 text-slate-600" />
                  </div>
                  <span>Editar Terno</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 font-semibold text-xs flex items-center gap-1.5 cursor-not-allowed opacity-60"
                  title="Edição inativada pelo administrador"
                >
                  <div className="bg-transparent p-0">
                    <Pencil className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <span>Edição Inativa</span>
                </button>
              )
            )}

            {/* Delete Button */}
            {onDeleteSuit && (
              canDelete ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onDeleteSuit(suit);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Excluir este modelo"
                >
                  <div className="bg-transparent p-0">
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  </div>
                  <span>Excluir</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-300 font-semibold text-xs flex items-center gap-1.5 cursor-not-allowed opacity-50"
                  title="Exclusão inativada pelo administrador"
                >
                  <div className="bg-transparent p-0">
                    <Trash2 className="w-3.5 h-3.5 text-slate-300" />
                  </div>
                  <span>Exclusão Inativa</span>
                </button>
              )
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
