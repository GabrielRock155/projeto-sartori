import React, { useState, useEffect } from 'react';
import type { Suit } from '../types';
import { sellSuit } from '../services/api';
import { db } from '../db/database';
import { formatCurrency } from '../utils/formatters';
import { 
  X, 
  BadgeDollarSign, 
  Check,
  AlertTriangle
} from 'lucide-react';

interface SellSuitModalProps {
  suit: Suit | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onToast: (type: 'success' | 'error', title: string, description?: string) => void;
}

export const SellSuitModal: React.FC<SellSuitModalProps> = ({
  suit,
  isOpen,
  onClose,
  onSuccess,
  onToast,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('PIX');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (suit && isOpen) {
      setQuantity(1);
      setCustomerName('');
      setPaymentMethod('PIX');
    }
  }, [suit, isOpen]);

  if (!isOpen || !suit) return null;

  const maxStock = suit.stock;
  const totalSale = suit.price * quantity;
  const totalCost = suit.costPrice * quantity;
  const estimatedProfit = totalSale - totalCost;
  const remainingStock = maxStock - quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0 || quantity > maxStock) {
      onToast('error', 'Quantidade inválida', 'Verifique a quantidade disponível em estoque.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await sellSuit(suit.id, quantity, customerName, paymentMethod);
      if (!result.ok) {
        throw new Error(result.error || 'Falha ao registrar venda no servidor');
      }

      const newStock = suit.stock - quantity;
      const newSoldCount = (suit.soldCount || 0) + quantity;
      const newStatus =
        newStock === 0
          ? 'esgotado'
          : newStock <= suit.minStock
            ? 'baixo_estoque'
            : 'disponivel';

      await db.suits.update(suit.id, {
        stock: newStock,
        soldCount: newSoldCount,
        status: newStatus,
      });

      const clientInfo = customerName.trim() ? ` para ${customerName.trim()}` : '';
      onToast(
        'success',
        'Venda registrada com sucesso',
        `${quantity}x "${suit.name}" vendido${clientInfo} (${formatCurrency(totalSale)}). Estoque restante: ${newStock} un.`
      );
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao registrar venda:', error);
      onToast('error', 'Erro ao registrar venda', (error as Error).message || 'Não foi possível concluir a venda.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md rounded-xl bg-white border border-slate-200 shadow-xl p-5 relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
              <BadgeDollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Registrar Venda de Terno
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Ref: {suit.code} • Estoque: {suit.stock} un
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {maxStock <= 0 ? (
          <div className="py-6 text-center space-y-3">
            <div className="flex justify-center">
              <AlertTriangle className="w-10 h-10 text-amber-500" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Modelo Esgotado</h4>
              <p className="text-xs text-slate-500 mt-1">
                Não há unidades disponíveis em estoque para realizar a venda deste terno.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-semibold text-xs"
              >
                Fechar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
            {/* Suit Summary */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-3">
              <img
                src={suit.image}
                alt={suit.name}
                className="w-12 h-14 rounded object-cover object-top border border-slate-200 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                  {suit.category}
                </span>
                <h4 className="font-bold text-xs text-slate-900 truncate">
                  {suit.name}
                </h4>
                <p className="text-[11px] text-slate-500">
                  Tam: <span className="font-mono font-semibold text-slate-700">{suit.size}</span> • Unitário: <span className="font-mono font-semibold text-slate-900">{formatCurrency(suit.price)}</span>
                </p>
              </div>
            </div>

            {/* Customer & Payment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Cliente (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Dr. Henrique Silva"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Forma de Pagamento
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-400"
                >
                  <option value="PIX">PIX (À Vista)</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Cartão de Débito">Cartão de Débito</option>
                  <option value="Transferência / TED">Transferência / TED</option>
                </select>
              </div>
            </div>

            {/* Quantity */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Quantidade Vendida
                </label>
                <input
                  type="number"
                  min={1}
                  max={maxStock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(maxStock, Math.max(1, parseInt(e.target.value, 10) || 1)))}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-slate-400"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Estoque Pós-Venda
                </label>
                <div
                  className={`w-full px-3 py-2 rounded-lg border text-xs font-mono font-semibold ${
                    remainingStock <= suit.minStock
                      ? 'bg-rose-50 border-rose-200 text-rose-700'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  {remainingStock} un {remainingStock === 0 ? '(Esgotado)' : remainingStock <= suit.minStock ? '(Baixo)' : ''}
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Valor Total da Venda:</span>
                <span className="text-base font-bold text-emerald-800 font-mono">
                  {formatCurrency(totalSale)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Margem / Lucro Bruto Estimado:</span>
                <span className="font-mono font-semibold text-emerald-700">
                  {formatCurrency(estimatedProfit)}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5 transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Processando...' : 'Confirmar Venda'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
