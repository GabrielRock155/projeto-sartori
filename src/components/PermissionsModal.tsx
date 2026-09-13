import React, { useState, useEffect } from 'react';
import type { UserPermissions } from '../types';
import { 
  X, 
  ShieldCheck, 
  PlusCircle, 
  Pencil, 
  Trash2,
  Check
} from 'lucide-react';

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  permissions: UserPermissions;
  onSavePermissions: (newPermissions: UserPermissions) => void;
}

export const PermissionsModal: React.FC<PermissionsModalProps> = ({
  isOpen,
  onClose,
  permissions,
  onSavePermissions,
}) => {
  const [canInsert, setCanInsert] = useState(permissions.canInsert);
  const [canEdit, setCanEdit] = useState(permissions.canEdit);
  const [canDelete, setCanDelete] = useState(permissions.canDelete);

  useEffect(() => {
    if (isOpen) {
      setCanInsert(permissions.canInsert);
      setCanEdit(permissions.canEdit);
      setCanDelete(permissions.canDelete);
    }
  }, [isOpen, permissions]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSavePermissions({
      canInsert,
      canEdit,
      canDelete,
    });
    onClose();
  };

  const functionsList = [
    {
      id: 'insert',
      title: 'Inserir Ternos (Cadastro)',
      description: 'Permite cadastrar novos modelos no catalogo e gravar no banco de dados.',
      icon: PlusCircle,
      active: canInsert,
      toggle: () => setCanInsert((prev) => !prev),
    },
    {
      id: 'edit',
      title: 'Editar Ternos',
      description: 'Permite alterar precos, tecidos, cores, tamanhos e quantidades em estoque.',
      icon: Pencil,
      active: canEdit,
      toggle: () => setCanEdit((prev) => !prev),
    },
    {
      id: 'delete',
      title: 'Excluir Ternos',
      description: 'Permite remover modelos de ternos do catalogo e do banco de dados.',
      icon: Trash2,
      active: canDelete,
      toggle: () => setCanDelete((prev) => !prev),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg rounded-xl bg-white border border-slate-200 shadow-xl overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
              G
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-slate-900">
                  Controle de Funcoes
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  Gabriel Ibiapino
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Ative ou inative as permissoes de operacao do sistema.
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

        {/* Content - Function Controls */}
        <div className="p-5 space-y-3.5">
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <div className="bg-transparent p-0 shrink-0">
              <ShieldCheck className="w-4 h-4 text-slate-700" />
            </div>
            <span>
              Defina quais operacoes estarao disponiveis na interface da aplicacao.
            </span>
          </div>

          <div className="space-y-2.5">
            {functionsList.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-2xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-transparent p-0 mt-0.5">
                      <Icon className={`w-4 h-4 ${item.active ? 'text-slate-900' : 'text-slate-400'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">
                          {item.title}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${
                            item.active
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}
                        >
                          {item.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed max-w-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Button */}
                  <button
                    type="button"
                    onClick={item.toggle}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      item.active ? 'bg-slate-900' : 'bg-slate-300'
                    }`}
                    role="switch"
                    aria-checked={item.active}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                        item.active ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 font-mono">
            Status: {canInsert && canEdit && canDelete ? 'Todas ativas' : 'Parcialmente restrito'}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5 transition-all"
            >
              <div className="bg-transparent p-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>Salvar Alterações</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
