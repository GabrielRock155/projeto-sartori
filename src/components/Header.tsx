import React from 'react';
import { 
  Plus
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'inicio' | 'catalogo';
  onOpenNewSuit: () => void;
  canInsert?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenNewSuit,
  canInsert = true,
}) => {
  const getPageTitle = () => {
    switch (activeTab) {
      case 'inicio':
        return 'Galeria de Ternos';
      case 'catalogo':
        return 'Catalogo de Ternos';
      default:
        return 'Sartoria';
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Page Title Only */}
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {getPageTitle()}
          </h1>
        </div>

        {/* Right Actions: New Suit Button (Only shown on Catalogo) */}
        <div>
          {activeTab === 'catalogo' && (
            canInsert ? (
              <button
                type="button"
                onClick={onOpenNewSuit}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs tracking-tight shadow-xs transition-all active:scale-98 cursor-pointer"
              >
                <div className="bg-transparent p-0">
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </div>
                <span>Cadastrar Terno</span>
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-slate-200 text-slate-400 font-semibold text-xs tracking-tight cursor-not-allowed"
                title="Função de inserção inativada pelo administrador"
              >
                <div className="bg-transparent p-0">
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </div>
                <span>Cadastro Inativo</span>
              </button>
            )
          )}
        </div>
      </div>
    </header>
  );
};
