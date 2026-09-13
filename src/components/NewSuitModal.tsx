import React, { useState, useEffect, useCallback } from 'react';
import type { Suit, SuitCategory } from '../types';
import { createSuit } from '../services/api';
import { db } from '../db/database';
import { 
  X, 
  ShoppingBag, 
  Check
} from 'lucide-react';

interface NewSuitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const NewSuitModal: React.FC<NewSuitModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState<SuitCategory>('Slim Fit Italiano');
  const [fabric, setFabric] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [price, setPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [stock, setStock] = useState('');
  const [minStock, setMinStock] = useState('');
  const [image, setImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setName('');
    setCode(`ALF-${Math.floor(100 + Math.random() * 900)}`);
    setCategory('Slim Fit Italiano');
    setFabric('');
    setColor('');
    setSize('');
    setPrice('');
    setCostPrice('');
    setStock('');
    setMinStock('');
    setImage('');
  }, []);

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newSuitData: Partial<Suit> = {
        name,
        code: code || `ALF-${Math.floor(100 + Math.random() * 900)}`,
        category,
        fabric,
        color,
        colorHex: '#0f172a',
        size,
        price: parseFloat(price) || 0,
        costPrice: parseFloat(costPrice) || 0,
        stock: parseInt(stock, 10) || 0,
        minStock: parseInt(minStock, 10) || 0,
        image: image || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80',
        status: (parseInt(stock, 10) || 0) <= (parseInt(minStock, 10) || 0) ? 'baixo_estoque' : 'disponivel',
        soldCount: 0,
      };

      // 1. Send POST to Express backend with SQLite
      await createSuit(newSuitData);

      // 2. Add to Dexie DB as well
      await db.suits.add({
        ...newSuitData,
        id: `s-${Date.now()}`,
      } as Suit);

      resetForm();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao cadastrar terno:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto custom-scrollbar rounded-xl bg-white border border-slate-200 shadow-xl p-5 relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="bg-transparent p-0">
              <ShoppingBag className="w-5 h-5 text-slate-800" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Cadastrar Novo Terno no Catalogo
              </h3>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <div className="bg-transparent p-0">
              <X className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Nome do Modelo do Terno
              </label>
              <input
                type="text"
                placeholder="Ex: Terno Slim Fit Italiano Oxford Azul"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-slate-400"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Codigo / Referencia
              </label>
              <input
                type="text"
                placeholder="Ex: ALF-101"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs font-mono focus:outline-none focus:border-slate-400"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Categoria de Alfaiataria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SuitCategory)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-400"
              >
                <option value="Sob Medida">Sob Medida</option>
                <option value="Slim Fit Italiano">Slim Fit Italiano</option>
                <option value="Smoking / Black Tie">Smoking / Black Tie</option>
                <option value="Linho Puro Riviera">Linho Puro Riviera</option>
                <option value="Cerimonial & Noivos">Cerimonial & Noivos</option>
                <option value="Clássico Executivo">Classico Executivo</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Composicao do Tecido
              </label>
              <input
                type="text"
                placeholder="Ex: La Fria Super 150s"
                value={fabric}
                onChange={(e) => setFabric(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-slate-400"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Cor Principal
              </label>
              <input
                type="text"
                placeholder="Ex: Azul Marinho Imperial"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-slate-400"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tamanho Padrao
              </label>
              <input
                type="text"
                placeholder="Ex: 50R, 48L, Sob Medida"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-slate-400"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Preco Venda (R$)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs font-mono focus:outline-none focus:border-slate-400"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Preco Custo (R$)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs font-mono focus:outline-none focus:border-slate-400"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Estoque Inicial
              </label>
              <input
                type="number"
                placeholder="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs font-mono focus:outline-none focus:border-slate-400"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Estoque Minimo
              </label>
              <input
                type="number"
                placeholder="3"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs font-mono focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              URL da Imagem do Terno
            </label>
            <input
              type="text"
              placeholder="https://exemplo.com/foto-do-terno.jpg"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-slate-400"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5 transition-all active:scale-98 disabled:opacity-50"
            >
              <div className="bg-transparent p-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>{isSubmitting ? 'Salvando...' : 'Salvar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
