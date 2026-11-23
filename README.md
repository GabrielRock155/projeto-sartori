# Sartoria Gabriel — Sistema de Gestão de Alfaiataria e Estoque

> Sistema Full-Stack moderno desenvolvido para catalogação, precificação, controle de estoque de ternos de alta alfaiataria e governança de permissões de acesso.

---

## 📋 Sumário Executivo

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express, REST API
- **Banco de Dados**: MySQL / MariaDB (XAMPP) via driver nativo `mysql2` com Pool de Conexões
- **Metodologia Ágil**: Gestão de entregas via **GitHub Projects (Kanban)**

---

## 🎯 Mapeamento das Atividades Curriculares (ACs)

| Etapa | Funcionalidade | Endpoint API | Status | Descrição Técnica |
| :--- | :--- | :--- | :---: | :--- |
| **1ª AC** | **Cadastro de Ternos** | `POST /api/suits` | Concluído | Formulário modal (`NewSuitModal`) com validação de campos, cálculo de status de estoque e gravação estruturada no MySQL. |
| **2ª AC** | **Edição e Atualização** | `PUT /api/suits/:id` | Concluído | Modal de edição (`EditSuitModal`) pré-populado, atualização atômica de preços, estoques e tecidos, e feedback via Toast. |
| **3ª AC** | **Exclusão & Controle de Acesso** | `DELETE /api/suits/:id` | Concluído | Exclusão segura com modal de confirmação customizado (`ConfirmModal`) e painel de ativação/inativação de funções (`PermissionsModal`). |
<<<<<<< HEAD
=======
| **4ª Funcionalidade** | **Registro de Venda e Baixa de Estoque** | `POST /api/suits/:id/sell` | Concluído | Modal de venda (`SellSuitModal`) com cálculo automático de valor total, margem de lucro bruto, baixa de estoque (`stock`) e incremento de unidades vendidas (`soldCount`). |
>>>>>>> ae31682 (Feat: diagrama de classe e caso de uso, funcionalidade de vendas)
| **Prova Final** | **Gestão e Visão Geral** | `GET /api/suits` | Concluído | Dashboard com galeria, filtros de corte de alfaiataria, busca dinâmica e badges de estoque crítico. |

---

## 🧭 Gestão Ágil e Quadro de Projeto (GitHub Projects)

O projeto segue as práticas ágeis do modelo **Kanban** integrado ao GitHub Projects:

- **Colunas de Status:**
  - 🔵 **Backlog**: Planejamento de requisitos e funcionalidades futuras.
  - 🟡 **In progress**: Funcionalidades em implementação ativa.
  - 🔴 **in revision**: Tarefas aguardando validação ou gravação de vídeo de entrega.
  - 🟢 **Done**: Entregas validadas com testes de integração e banco de dados.
- **Campos de Controle:** Prioridades (`P0`, `P1`, `P2`) e estimativas de esforço ágil.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 19** + **TypeScript**: Componentização declarativa e tipagem estática rigorosa.
- **Vite**: Bundler de ultra-alta velocidade para desenvolvimento e compilação de produção.
- **Tailwind CSS**: Estilização com design system minimalista (*light theme*, foco em contraste e elegância).
- **Lucide React**: Iconografia consistente.
- **Dexie.js**: Cache reativo no navegador (IndexedDB) para alta disponibilidade da interface.

### Backend
- **Node.js** + **Express**: Servidor RESTful modular com middleware de CORS e JSON parser.
- **mysql2/promise**: Pool de conexões assíncrono direto com o servidor MySQL do XAMPP, eliminando dependências nativas em C++ (`node-gyp`).

### Banco de Dados (MySQL)
<<<<<<< HEAD
- Criação automática do banco de dados `sartoria` e da tabela `suits` na inicialização da aplicação (*Auto-Provisioning*).
- Tipos de dados rigorosos (`VARCHAR`, `DECIMAL`, `INT`, `TEXT`) com chave primária e código de referência único.

---

## 🗄️ Estrutura da Tabela do Banco de Dados
=======
- Criação automática do banco de dados `sartoria` e das tabelas `suits` e `sales` na inicialização da aplicação (*Auto-Provisioning*).
- Tipos de dados rigorosos (`VARCHAR`, `DECIMAL`, `INT`, `TEXT`, `TIMESTAMP`) com chave primária e código de referência único.

---

## 🗄️ Estrutura das Tabelas do Banco de Dados
>>>>>>> ae31682 (Feat: diagrama de classe e caso de uso, funcionalidade de vendas)

```sql
CREATE TABLE IF NOT EXISTS suits (
  id VARCHAR(64) PRIMARY KEY,
  code VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  fabric VARCHAR(255) NOT NULL,
  color VARCHAR(100) NOT NULL,
  colorHex VARCHAR(50) NOT NULL DEFAULT '#0f172a',
  size VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  costPrice DECIMAL(10, 2) NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  minStock INT NOT NULL DEFAULT 3,
  image TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'disponivel',
  soldCount INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
<<<<<<< HEAD
=======

CREATE TABLE IF NOT EXISTS sales (
  id VARCHAR(64) PRIMARY KEY,
  suitId VARCHAR(64) NOT NULL,
  suitCode VARCHAR(64) NOT NULL,
  suitName VARCHAR(255) NOT NULL,
  customerName VARCHAR(255) NOT NULL DEFAULT 'Cliente Balcão',
  paymentMethod VARCHAR(100) NOT NULL DEFAULT 'PIX',
  quantity INT NOT NULL DEFAULT 1,
  unitPrice DECIMAL(10, 2) NOT NULL DEFAULT 0,
  totalPrice DECIMAL(10, 2) NOT NULL DEFAULT 0,
  profit DECIMAL(10, 2) NOT NULL DEFAULT 0,
  soldAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
>>>>>>> ae31682 (Feat: diagrama de classe e caso de uso, funcionalidade de vendas)
```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- **Node.js** (versão 18 ou superior)
- **npm**
- **XAMPP** (com o módulo **MySQL** rodando na porta `3306`)

---

### 1. Clonar o Repositório
```bash
git clone https://github.com/SEU-USUARIO/sartoria-gabriel.git
cd sartoria-gabriel
```

### 2. Iniciar o Banco de Dados no XAMPP
1. Abra o **XAMPP Control Panel**.
2. Clique em **Start** no módulo **MySQL** (certifique-se de que a porta `3306` esteja verde).
> O sistema cria o banco `sartoria` e a tabela `suits` automaticamente na primeira execução! Não é necessário criar manualmente no phpMyAdmin.

### 3. Instalar as Dependências
```bash
npm install
```
*(Instalação 100% em JavaScript puro, sem necessidade de ferramentas de compilação C++).*

### 4. Executar em Modo de Desenvolvimento
```bash
npm run dev
```
*(Ou `npm run dev:all` — inicializa simultaneamente a API Express na porta `3001` e a aplicação Vite na porta `5173`).*

- **Frontend (Interface do Usuário):** [http://localhost:5173](http://localhost:5173)
- **Backend (API REST):** [http://localhost:3001](http://localhost:3001)

### 5. Compilação e Execução de Produção (Opcional)
```bash
npm run build
npm start
```
Acesse o sistema completo em [http://localhost:3001](http://localhost:3001).

---

## 🔌 Rotas da API REST

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| **`GET`** | `/api/suits` | Lista todos os ternos cadastrados no banco MySQL. |
| **`POST`** | `/api/suits` | Cadastra um novo modelo de terno no estoque (**1ª AC**). |
| **`PUT`** | `/api/suits/:id` | Atualiza as informações completas de um modelo (**2ª AC**). |
| **`DELETE`** | `/api/suits/:id` | Remove um terno definitivamente do banco de dados (**3ª AC**). |
<<<<<<< HEAD
=======
| **`POST`** | `/api/suits/:id/sell` | Registra a venda de um terno na tabela `sales`, dá baixa no estoque e incrementa `soldCount` (**4ª Funcionalidade**). |
| **`GET`** | `/api/sales` | Lista o histórico completo de vendas registradas no MySQL. |

---

## 📐 Documentação de Engenharia de Software (Diagramas UML)

- **[DIAGRAMA_DE_CLASSES.md](./DIAGRAMA_DE_CLASSES.md)**: Diagrama de Classes UML completo, arquitetura em 4 camadas, dicionário de dados das tabelas `suits` e `sales`, e especificação dos componentes e serviços.
- **[DIAGRAMA_DE_CASO_DE_USO.md](./DIAGRAMA_DE_CASO_DE_USO.md)**: Diagrama de Casos de Uso UML, descrição dos atores, matriz de rastreabilidade, regras de negócio (`RN01` a `RN06`) e fluxos detalhados (`UC01` a `UC08`).
>>>>>>> ae31682 (Feat: diagrama de classe e caso de uso, funcionalidade de vendas)

---

## 🔒 Governança e Controle de Permissões

Na base da **Barra Lateral**, o botão do administrador (**Gabriel Ibiapino**) abre o **Modal de Controle de Funções**, permitindo ao avaliador ou administrador:
- **Ativar/Inativar Cadastro:** Bloqueia dinamicamente os botões de inserção de novos ternos.
- **Ativar/Inativar Edição:** Desabilita as ações de alteração de preço, tecido e estoque.
<<<<<<< HEAD
=======
- **Ativar/Inativar Vendas:** Desabilita o registro de vendas e baixa de estoque nos cards e na ficha técnica.
>>>>>>> ae31682 (Feat: diagrama de classe e caso de uso, funcionalidade de vendas)
- **Ativar/Inativar Exclusão:** Desabilita as opções de exclusão nos cards e na ficha técnica.

As configurações são sincronizadas em tempo real com feedback via notificações Toast.

---

## 👤 Autor

- **Desenvolvedor:** Gabriel Ibiapino
- **Projeto:** Sartoria Gabriel
<<<<<<< HEAD
- **Finalidade:** Avaliação Curricular de Análise e Desenvolvimento de Sistemas / Desenvolvimento Full-Stack
=======
- **Finalidade:** Avaliação Curricular de Engenharia de Software / Desenvolvimento Full-Stack
>>>>>>> ae31682 (Feat: diagrama de classe e caso de uso, funcionalidade de vendas)
