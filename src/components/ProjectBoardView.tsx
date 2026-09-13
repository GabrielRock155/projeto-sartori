import { useState } from 'react';
import { 
  CheckCircle2, 
  X
} from 'lucide-react';

interface ProjectBoardViewProps {
  onGoToCatalogue: () => void;
  onOpenNewSuit: () => void;
}

export const ProjectBoardView: React.FC<ProjectBoardViewProps> = () => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* 3-Column AC Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Column 1: 1ª AC (Cadastro de Ternos) */}
        <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-xs space-y-3.5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">1ª AC: Cadastro de Ternos</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                Concluido
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Funcionalidade de cadastro completo de novos ternos no estoque da alfaiataria com persistencia no MySQL.
            </p>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="font-semibold text-slate-900 text-[11px] uppercase tracking-wider">
                Arquitetura Full-Stack:
              </div>

              <div className="space-y-1.5 text-slate-700">
                <div className="flex items-start gap-1.5">
                  <div className="bg-transparent p-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <span><strong>Frontend:</strong> Formulario de cadastro de ternos</span>
                </div>

                <div className="flex items-start gap-1.5">
                  <div className="bg-transparent p-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <span><strong>Backend:</strong> Rotas POST e GET /api/suits</span>
                </div>

                <div className="flex items-start gap-1.5">
                  <div className="bg-transparent p-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <span><strong>Banco:</strong> INSERT na tabela suits (MySQL)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs text-slate-600 font-medium">
            Entregue na 1ª Etapa
          </div>
        </div>

        {/* Column 2: 2ª AC (Edição dos Ternos Cadastrados) */}
        <div className="rounded-xl bg-white border-2 border-slate-900 p-5 shadow-xs space-y-3.5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">2ª AC: Edicao dos Ternos</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                Concluido (Em Video)
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Funcionalidade completa de edicao e alteracao de dados dos modelos cadastrados (precos, tecidos, cores e estoque).
            </p>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="font-semibold text-slate-900 text-[11px] uppercase tracking-wider">
                Arquitetura Full-Stack Entregue:
              </div>

              <div className="space-y-1.5 text-slate-700">
                <div className="flex items-start gap-1.5">
                  <div className="bg-transparent p-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <span><strong>Frontend:</strong> Modal e formulario de edicao de terno</span>
                </div>

                <div className="flex items-start gap-1.5">
                  <div className="bg-transparent p-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <span><strong>Backend:</strong> Rota PUT /api/suits/:id (Express)</span>
                </div>

                <div className="flex items-start gap-1.5">
                  <div className="bg-transparent p-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <span><strong>Banco de Dados:</strong> UPDATE na tabela suits (MySQL)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setIsDetailsModalOpen(true)}
              className="w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors text-center"
            >
              Ver Detalhes do Board
            </button>
          </div>
        </div>

        {/* Column 3: 3ª AC (Exclusão de Ternos) */}
        <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-xs space-y-3.5 opacity-90 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <h3 className="font-bold text-sm text-slate-800">3ª AC: Exclusao de Ternos</h3>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                Entrega Final
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Funcionalidade de remocao e baixa definitiva de modelos de ternos do catalogo da alfaiataria.
            </p>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-600">
              <div className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider">
                Arquitetura Prevista:
              </div>
              <ul className="space-y-1 text-slate-700">
                <li>• <strong>Frontend:</strong> Botao de exclusao com confirmacao</li>
                <li>• <strong>Backend:</strong> Rota DELETE /api/suits/:id (Express)</li>
                <li>• <strong>Banco:</strong> DELETE na tabela suits (MySQL)</li>
              </ul>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500">
            Aguardando 3ª Entrega
          </div>
        </div>
      </div>

      {/* Modal: Detalhes do Board */}
      {isDetailsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-xl rounded-xl bg-white border border-slate-200 shadow-xl p-5 relative">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Especificacao Tecnica do Board (2ª AC)
                </h3>
                <p className="text-xs text-slate-500">
                  Resumo dos requisitos e integracao full-stack de edicao
                </p>
              </div>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <div className="bg-transparent p-0">
                  <X className="w-4 h-4" />
                </div>
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs text-slate-700">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block">Funcionalidades Entregues (1ª e 2ª AC):</span>
                <p className="text-slate-600 leading-relaxed">
                  1ª AC: Cadastro de novos modelos de ternos no catalogo.<br />
                  2ª AC: Edicao completa de dados (preco, estoque, tecido, cores) com persistencia atomica no MySQL.
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-900 block">Camadas Integradas na 2ª AC:</span>
                <div className="space-y-1.5 text-slate-600">
                  <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                    <span><strong>Frontend:</strong> Modal de Edicao e botoes de acao (React)</span>
                    <span className="font-mono text-[11px] text-emerald-700">Porta 5173</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                    <span><strong>Backend API:</strong> PUT /api/suits/:id (Express)</span>
                    <span className="font-mono text-[11px] text-emerald-700">Porta 3001</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                    <span><strong>Banco de Dados:</strong> MySQL (XAMPP / sartoria)</span>
                    <span className="font-mono text-[11px] text-emerald-700">UPDATE suits</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-semibold text-xs"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
