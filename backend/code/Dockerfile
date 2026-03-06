# ---- Estágio de Build ----
FROM node:20-alpine AS builder

# Instala o pnpm globalmente
RUN npm install -g pnpm

WORKDIR /app

# Copia os arquivos de manifesto
COPY package.json pnpm-lock.yaml .npmrc ./

# Instala todas as dependências (incluindo devDependencies para build)
RUN pnpm install --frozen-lockfile

# Copia o restante do código
COPY . .

# Compila o TypeScript para JavaScript
RUN pnpm run build

# ---- Estágio de Produção ----
FROM node:20-alpine AS production

# Instala o pnpm globalmente
RUN npm install -g pnpm

WORKDIR /app

# Copia os arquivos de manifesto
COPY package.json pnpm-lock.yaml .npmrc ./

# Instala apenas dependências de produção
RUN pnpm install --frozen-lockfile --prod

# Copia os arquivos compilados do estágio de build
COPY --from=builder /app/dist ./dist

# Expõe a porta da aplicação
EXPOSE 3001

# Comando de inicialização
CMD ["node", "dist/main"]
