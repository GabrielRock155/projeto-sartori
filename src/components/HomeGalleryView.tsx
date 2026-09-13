import React, { useState } from 'react';
import type { Suit, SuitCategory } from '../types';
import { formatCurrency } from '../utils/formatters';
import { 
  Search, 
  Info,
  PackageOpen
} from 'lucide-react';

interface HomeGalleryViewProps {
  suits: Suit[];
  onSelectSuit: (suit: Suit) => void;
}

export const HomeGalleryView: React.FC<HomeGalleryViewProps> = ({
  suits,
  onSelectSuit,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  const categories: ('all' | SuitCategory)[] = [
    'all',
    'Sob Medida',
    'Slim Fit Italiano',
    'Smoking / Black Tie',
    'Linho Puro Riviera',
    'Cerimonial & Noivos',
    'Clássico Executivo',
  ];

  const filteredSuits = suits.filter((suit) => {
    const matchesCat = selectedCategory === 'all' || suit.category === selectedCategory;
    const matchesSearch =
      search === '' ||
      suit.name.toLowerCase().includes(search.toLowerCase()) ||
      suit.fabric.toLowerCase().includes(search.toLowerCase()) ||
      suit.code.toLowerCase().includes(search.toLowerCase()) ||
      suit.color.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? 'Todos os Modelos' : cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <div className="bg-transparent p-0 absolute left-3 top-1/2 -translate-y-1/2">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Filtrar por tecido, cor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400"
          />
        </div>
      </div>

      {/* Empty State: Nenhum terno cadastrado no sistema */}
      {suits.length === 0 ? (
        <div className="p-16 rounded-xl bg-white border border-slate-200 text-center space-y-3 shadow-xs">
          <div className="bg-transparent p-0 flex items-center justify-center">
            <PackageOpen className="w-10 h-10 text-slate-400 stroke-[1.5]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              Nenhum terno cadastrado
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              O banco de dados esta vazio no momento. Acesse a aba de Catalogo para cadastrar o primeiro modelo de terno.
            </p>
          </div>
        </div>
      ) : filteredSuits.length === 0 ? (
        <div className="p-12 rounded-xl bg-white border border-slate-200 text-center space-y-1.5 shadow-xs">
          <p className="text-sm font-semibold text-slate-800">Nenhum terno encontrado para este filtro.</p>
          <p className="text-xs text-slate-400">Tente buscar por outro termo ou selecione Todos os Modelos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredSuits.map((suit) => {
            const isLowStock = suit.stock <= suit.minStock;
            return (
              <div
                key={suit.id}
                onClick={() => onSelectSuit(suit)}
                className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:border-slate-400 hover:shadow-sm transition-all duration-200 cursor-pointer flex flex-col justify-between group"
              >
                {/* Image & Overlay */}
                <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                  <img
                    src={suit.image}
                    alt={suit.name}
                    className="w-full h-full object-cover object-top group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/95 text-slate-800 border border-slate-200 shadow-xs">
                      {suit.category}
                    </span>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border shadow-xs ${
                        isLowStock
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-white/95 text-slate-700 border-slate-200'
                      }`}
                    >
                      {suit.stock} un em loja
                    </span>
                  </div>
                </div>

                {/* Card Information */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
                      <span>Ref: {suit.code}</span>
                      <span>Tam: {suit.size}</span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-slate-700 transition-colors">
                      {suit.name}
                    </h4>

                    <div className="mt-2 space-y-1 text-xs text-slate-600">
                      <p className="line-clamp-1">
                        <span className="font-medium text-slate-800">Tecido:</span> {suit.fabric}
                      </p>
                      <p className="line-clamp-1">
                        <span className="font-medium text-slate-800">Cor:</span> {suit.color}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                        Preco de Venda
                      </span>
                      <span className="text-base font-bold text-slate-900 font-mono">
                        {formatCurrency(suit.price)}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1"
                    >
                      <div className="bg-transparent p-0">
                        <Info className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                      <span>Detalhes</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
