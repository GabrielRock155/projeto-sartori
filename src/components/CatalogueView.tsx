import React, { useState } from 'react';
import type { Suit, SuitCategory } from '../types';
import { formatCurrency } from '../utils/formatters';
import { 
  ShoppingBag, 
  Search,
  PackageOpen,
  Plus,
  Pencil,
  Trash2
} from 'lucide-react';

interface CatalogueViewProps {
  suits: Suit[];
  onSelectSuit: (suit: Suit) => void;
  onEditSuit?: (suit: Suit) => void;
  onDeleteSuit?: (suit: Suit) => void;
  onOpenNewSuit: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
  canInsert?: boolean;
}

export const CatalogueView: React.FC<CatalogueViewProps> = ({
  suits,
  onSelectSuit,
  onEditSuit,
  onDeleteSuit,
  onOpenNewSuit,
  canEdit = true,
  canDelete = true,
  canInsert = true,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  const categories: ('all' | SuitCategory)[] = [
    'all',
    'Sob Medida',
    'Smoking / Black Tie',
    'Slim Fit Italiano',
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
      suit.code.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category horizontal scroll */}
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

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <div className="bg-transparent p-0 absolute left-3 top-1/2 -translate-y-1/2">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar tecido, corte, codigo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400"
          />
        </div>
      </div>

      {/* Empty State or Grid */}
      {suits.length === 0 ? (
        <div className="p-16 rounded-xl bg-white border border-slate-200 text-center space-y-4 shadow-xs">
          <div className="bg-transparent p-0 flex items-center justify-center">
            <PackageOpen className="w-10 h-10 text-slate-400 stroke-[1.5]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              Nenhum terno cadastrado no estoque
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              O catalogo esta vazio. Clique no botao abaixo para cadastrar o primeiro modelo no banco de dados.
            </p>
          </div>
          {canInsert ? (
            <button
              type="button"
              onClick={onOpenNewSuit}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <div className="bg-transparent p-0">
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span>Cadastrar Primeiro Terno</span>
            </button>
          ) : (
            <div className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-500 font-medium inline-block">
              Função de cadastro inativada pelo administrador
            </div>
          )}
        </div>
      ) : filteredSuits.length === 0 ? (
        <div className="p-12 rounded-xl bg-white border border-slate-200 text-center space-y-1.5 shadow-xs">
          <p className="text-sm font-semibold text-slate-800">Nenhum terno encontrado para este filtro.</p>
          <p className="text-xs text-slate-400">Tente buscar por outro termo ou selecione Todos os Modelos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSuits.map((suit) => {
            const isLowStock = suit.stock <= suit.minStock;
            return (
              <div
                key={suit.id}
                className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-all group flex flex-col justify-between"
              >
                {/* Image & Badges */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                  <img
                    src={suit.image}
                    alt={suit.name}
                    className="w-full h-full object-cover object-top group-hover:scale-102 transition-transform duration-300"
                  />

                  {/* Top badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/90 text-slate-800 border border-slate-200 backdrop-blur-xs">
                      {suit.category}
                    </span>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs border ${
                        isLowStock
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {suit.stock} un
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-0.5">
                      <span>Cod: {suit.code}</span>
                      <span>Tam: {suit.size}</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                      {suit.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                      <span className="text-slate-700 font-medium">Tecido:</span> {suit.fabric}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-normal">
                        Valor
                      </span>
                      <span className="text-base font-bold text-slate-900">
                        {formatCurrency(suit.price)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Edit Button */}
                      {onEditSuit && (
                        canEdit ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onEditSuit(suit);
                            }}
                            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-all cursor-pointer"
                            title="Editar terno"
                          >
                            <div className="bg-transparent p-0 pointer-events-none">
                              <Pencil className="w-3.5 h-3.5" />
                            </div>
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-lg bg-slate-100 text-slate-300 font-medium cursor-not-allowed opacity-50"
                            title="Edição inativada pelo administrador"
                          >
                            <div className="bg-transparent p-0 pointer-events-none">
                              <Pencil className="w-3.5 h-3.5" />
                            </div>
                          </button>
                        )
                      )}

                      {/* Delete Button */}
                      {onDeleteSuit && (
                        canDelete ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onDeleteSuit(suit);
                            }}
                            className="p-2 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 font-medium transition-all cursor-pointer"
                            title="Excluir terno"
                          >
                            <div className="bg-transparent p-0 pointer-events-none">
                              <Trash2 className="w-3.5 h-3.5" />
                            </div>
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-lg bg-slate-100 text-slate-300 font-medium cursor-not-allowed opacity-50"
                            title="Exclusão inativada pelo administrador"
                          >
                            <div className="bg-transparent p-0 pointer-events-none">
                              <Trash2 className="w-3.5 h-3.5" />
                            </div>
                          </button>
                        )
                      )}

                      {/* View Details Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onSelectSuit(suit);
                        }}
                        className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium transition-all shadow-xs cursor-pointer"
                        title="Ver detalhes deste modelo"
                      >
                        <div className="bg-transparent p-0 pointer-events-none">
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </div>
                      </button>
                    </div>
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
