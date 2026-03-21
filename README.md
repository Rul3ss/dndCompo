# D&D Character Manager - dndCompo

Sistema profissional para gerenciamento de fichas de personagens de D&D e campanhas de RPG. O projeto segue uma arquitetura moderna, com separação clara entre Frontend e Backend, focada em performance e experiência do usuário.

## 🚀 Tecnologias

### [Frontend](frontend/code)
- **React 19** com **TypeScript**
- **Vite** para build rápido e HMR
- **TailwindCSS** para estilização moderna
- **Framer Motion** para animações fluidas
- **Lucide React** para ícones
- **React Router Dom** para navegação

### [Backend](backend/code)
- **NestJS** (Node.js Framework)
- **TypeORM** para persistência de dados
- **PostgreSQL** como banco de dados
- **Passport.js & JWT** para autenticação segura
- **Multer** para upload de arquivos (Avatares e Imagens de Campanha)

---

## 📂 Estrutura do Projeto

O projeto segue o padrão **MVC (Model-View-Controller)** e está organizado da seguinte forma:

```text
dndCompo/
├── backend/code/        # API e Lógica de Negócio (NestJS)
│   ├── src/
│   │   ├── auth/        # Módulo de Autenticação
│   │   ├── character/   # Gerenciamento de Personagens
│   │   ├── campaign/    # Gerenciamento de Campanhas
│   │   └── database/    # Migrations e Configuração de Dados
└── frontend/code/       # Interface do Usuário (React)
    ├── src/
    │   ├── features/    # Módulos isolados (Auth, Dashboard, etc)
    │   ├── components/  # Componentes reutilizáveis
    │   └── lib/         # Serviços e Configurações (API client)
```

---

## 🛠️ Como Executar

### Pré-requisitos
- Node.js (versão 18 ou superior)
- Pnpm (recomendado) ou Npm
- Docker (opcional, para o banco de dados)

### 1. Configuração do Backend
Entre na pasta do backend e instale as dependências:
```bash
cd backend/code
pnpm install
```
Configure o `.env` (use o `.env_example` como base) e inicie o servidor:
```bash
pnpm run start:dev
```

### 2. Configuração do Frontend
Em um novo terminal, entre na pasta do frontend e instale as dependências:
```bash
cd frontend/code
pnpm install
```
Inicie o servidor de desenvolvimento:
```bash
pnpm run dev
```

---

## 📖 Documentação Adicional

Para detalhes específicos de cada parte do sistema, consulte:
- [Documentação do Frontend](frontend/code/README.md)
- [Documentação do Backend](backend/code/README.md)

---

## ⚖️ Licença
Este projeto é de uso privado.
