import React from 'react';
import { 
  Home, 
  ShoppingBag, 
  SlidersHorizontal
} from 'lucide-react';

interface SidebarProps {
  activeTab: 'inicio' | 'catalogo';
  setActiveTab: (tab: 'inicio' | 'catalogo') => void;
  onOpenPermissions?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenPermissions,
}) => {
  const menuItems = [
    {
      id: 'inicio' as const,
      label: 'Inicio (Galeria)',
      icon: Home,
      badge: undefined,
    },
    {
      id: 'catalogo' as const,
      label: 'Catalogo de Ternos',
      icon: ShoppingBag,
      badge: undefined,
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 sticky top-0 h-screen z-30">
      {/* Navigation Menu */}
      <div className="px-3 py-6">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Navegacao
        </p>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="bg-transparent p-0">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'}`} />
                  </div>
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Admin Profile Button */}
      <div className="p-3 border-t border-slate-100 bg-slate-50">
        <button
          type="button"
          onClick={onOpenPermissions}
          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-200/60 transition-colors text-left group cursor-pointer"
          title="Controle de Funções (Inserir, Editar, Excluir)"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
              G
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-900 truncate group-hover:text-slate-800">
                Gabriel Ibiapino
              </p>
              <p className="text-[10px] text-slate-500 truncate">Administrador</p>
            </div>
          </div>
          <div className="bg-transparent p-0 text-slate-400 group-hover:text-slate-700">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </div>
        </button>
      </div>
    </aside>
  );
};
