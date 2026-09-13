import { useEffect, useState, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { 
  db, 
  initializeDatabase, 
  initialSuits 
} from './db/database';
import { fetchSuits, deleteSuit } from './services/api';
import type { Suit, UserPermissions } from './types';

// Components
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HomeGalleryView } from './components/HomeGalleryView';
import { CatalogueView } from './components/CatalogueView';
import { NewSuitModal } from './components/NewSuitModal';
import { EditSuitModal } from './components/EditSuitModal';
import { SuitDetailsModal } from './components/SuitDetailsModal';
import { PermissionsModal } from './components/PermissionsModal';
import { ConfirmModal } from './components/ConfirmModal';
import { Toast, type ToastMessage } from './components/Toast';

export function App() {
  const [activeTab, setActiveTab] = useState<'inicio' | 'catalogo'>('inicio');
  
  // Modals
  const [isSuitModalOpen, setIsSuitModalOpen] = useState(false);
  const [selectedSuit, setSelectedSuit] = useState<Suit | null>(null);
  const [editingSuit, setEditingSuit] = useState<Suit | null>(null);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [deletingSuit, setDeletingSuit] = useState<Suit | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // User Permissions state (Inserir, Editar, Excluir)
  const [permissions, setPermissions] = useState<UserPermissions>(() => {
    const saved = localStorage.getItem('sartoria_permissions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback to default
      }
    }
    return { canInsert: true, canEdit: true, canDelete: true };
  });

  const handleSavePermissions = (newPermissions: UserPermissions) => {
    setPermissions(newPermissions);
    localStorage.setItem('sartoria_permissions', JSON.stringify(newPermissions));
    showToast('success', 'Permissões atualizadas com sucesso', 'As funções ativadas/inativadas foram salvas.');
  };

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((type: 'success' | 'error', title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Database suits state
  const [serverSuits, setServerSuits] = useState<Suit[]>([]);

  const loadData = useCallback(async () => {
    try {
      const suitsFromApi = await fetchSuits();
      setServerSuits(suitsFromApi);
    } catch {
      // Fallback handled in service
    }
  }, []);

  // Initialize DB and fetch from backend
  useEffect(() => {
    initializeDatabase();
    loadData();
  }, [loadData]);

  // Live queries fallback from IndexedDB/Dexie
  const liveSuits = useLiveQuery(() => db.suits.toArray()) || initialSuits;
  const suits = serverSuits.length > 0 ? serverSuits : liveSuits;

  // Handle Delete Suit (Abre o modal de confirmação)
  const handleDeleteSuit = (suit: Suit) => {
    if (!permissions.canDelete) {
      showToast('error', 'Função bloqueada', 'A exclusão de ternos foi inativada pelo administrador.');
      return;
    }
    setDeletingSuit(suit);
  };

  const handleConfirmDelete = async () => {
    if (!deletingSuit) return;

    setIsDeleting(true);
    try {
      const ok = await deleteSuit(deletingSuit.id);
      if (!ok) throw new Error('Falha ao excluir o terno no servidor');
      await db.suits.delete(deletingSuit.id);

      if (selectedSuit?.id === deletingSuit.id) {
        setSelectedSuit(null);
      }
      if (editingSuit?.id === deletingSuit.id) {
        setEditingSuit(null);
      }

      await loadData();
      showToast('success', 'Terno excluído com sucesso', `O modelo "${deletingSuit.name}" foi removido do catálogo.`);
      setDeletingSuit(null);
    } catch (error) {
      showToast('error', 'Erro ao excluir terno', (error as Error).message || 'Não foi possível remover o modelo.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-200">
      {/* Lateral Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPermissions={() => setIsPermissionsModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activeTab={activeTab}
          onOpenNewSuit={() => {
            if (!permissions.canInsert) {
              showToast('error', 'Função bloqueada', 'O cadastro de ternos foi inativado pelo administrador.');
              return;
            }
            setIsSuitModalOpen(true);
          }}
          canInsert={permissions.canInsert}
        />

        <main className="flex-1 p-5 md:p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* 1. Aba Inicial: Galeria de Ternos Cadastrados */}
          {activeTab === 'inicio' && (
            <HomeGalleryView
              suits={suits}
              onSelectSuit={(suit) => setSelectedSuit(suit)}
            />
          )}

          {/* 2. Aba Catálogo de Ternos */}
          {activeTab === 'catalogo' && (
            <CatalogueView
              suits={suits}
              onSelectSuit={(suit) => setSelectedSuit(suit)}
              onEditSuit={(suit) => {
                if (!permissions.canEdit) {
                  showToast('error', 'Função bloqueada', 'A edição de ternos foi inativada pelo administrador.');
                  return;
                }
                setEditingSuit(suit);
              }}
              onDeleteSuit={handleDeleteSuit}
              onOpenNewSuit={() => {
                if (!permissions.canInsert) {
                  showToast('error', 'Função bloqueada', 'O cadastro de ternos foi inativado pelo administrador.');
                  return;
                }
                setIsSuitModalOpen(true);
              }}
              canEdit={permissions.canEdit}
              canDelete={permissions.canDelete}
              canInsert={permissions.canInsert}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      {/* 1ª AC: Cadastro */}
      <NewSuitModal
        isOpen={isSuitModalOpen}
        onClose={() => {
          setIsSuitModalOpen(false);
          loadData();
        }}
        onSuccess={loadData}
      />

      {/* 2ª AC: Edição */}
      <EditSuitModal
        suit={editingSuit}
        isOpen={!!editingSuit}
        onClose={() => setEditingSuit(null)}
        onSuccess={() => {
          loadData();
          setEditingSuit(null);
        }}
        onToast={showToast}
      />

      {/* Ficha Técnica / Detalhes */}
      <SuitDetailsModal
        suit={selectedSuit}
        onClose={() => setSelectedSuit(null)}
        onEditSuit={(suit) => {
          if (!permissions.canEdit) {
            showToast('error', 'Função bloqueada', 'A edição de ternos foi inativada pelo administrador.');
            return;
          }
          setEditingSuit(suit);
        }}
        onDeleteSuit={handleDeleteSuit}
        canEdit={permissions.canEdit}
        canDelete={permissions.canDelete}
      />

      {/* Modal de Controle de Funções (Inserir, Editar, Excluir) */}
      <PermissionsModal
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        permissions={permissions}
        onSavePermissions={handleSavePermissions}
      />

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        isOpen={!!deletingSuit}
        title="Confirmar Exclusão de Terno"
        message="Tem certeza de que deseja remover este modelo do catálogo e do banco de dados?"
        detail={deletingSuit ? `${deletingSuit.name} (Ref: ${deletingSuit.code}) • Categoria: ${deletingSuit.category}` : undefined}
        confirmLabel="Excluir Definitivamente"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingSuit(null)}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
