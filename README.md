# Sartoria Gabriel - Sistema de Gestão de Alfaiataria e Estoque

Sistema Full-Stack desenvolvido para controle de catálogo e estoque de ternos de alta alfaiataria.

## Arquitetura Full-Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Banco de Dados**: MySQL / MariaDB (XAMPP) via driver nativo `mysql2` com Pool de Conexões

---

## Configuração do Banco de Dados (MySQL / XAMPP)

1. Abra o **XAMPP Control Panel**.
2. Clique em **Start** no módulo **MySQL** (porta padrão `3306`).
3. O sistema cria automaticamente o banco de dados `sartoria` e a tabela `suits` na primeira inicialização!

### Variáveis de Conexão (Padrão XAMPP):
- **Host**: `127.0.0.1` (ou `localhost`)
- **Porta**: `3306`
- **Usuário**: `root`
- **Senha**: *(em branco)*
- **Banco**: `sartoria`

---

## Como Executar Localmente

### 1. Instalar dependências:
```bash
npm install
```

### 2. Rodar em desenvolvimento (Frontend + Backend MySQL):
```bash
npm run dev
# ou
npm run dev:all
```
- Frontend (Vite): **http://localhost:5173**
- Backend API (Express + MySQL): **http://localhost:3001**

### 3. Build e Produção:
```bash
npm run build
npm start
```
Acesse a aplicação em: **http://localhost:3001**

---

## Estrutura das Atividades Curriculares (ACs)

- **1ª AC (Entregue)**: Cadastro completo de ternos no catálogo com formulário e gravação no banco MySQL (POST `/api/suits`).
- **2ª AC (Entregue)**: Edição e atualização dos dados dos ternos cadastrados com persistência atômica no MySQL (PUT `/api/suits/:id`).
- **3ª AC (Roadmap)**: Exclusão de modelos de ternos (DELETE `/api/suits/:id`).
