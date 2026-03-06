#!/bin/bash

# Script de inicialização corrigido para sua estrutura
# Caminho: backend/start.sh

echo "Deseja que o script apague todos os containers e os crie novamente? (N/Y)"
read letra

if [ "$letra" = "Y" ] || [ "$letra" = "y" ]; then
  echo "🗑️ Apagando tudo..."
  docker compose down -v
fi

echo "🚀 Subindo containers..."
docker compose up -d --build

if [ $? -ne 0 ]; then
  echo "❌ Erro ao subir containers"
  exit 1
fi

echo "⏳ Aguardando API ficar disponível (localhost:3001)..."
API_HOST="localhost"
API_PORT="3001"
MAX_ATTEMPTS=60
ATTEMPT=1

# Tenta conectar na porta até que esteja aberta
until (echo > /dev/tcp/$API_HOST/$API_PORT) >/dev/null 2>&1; do
  if [ "$ATTEMPT" -ge "$MAX_ATTEMPTS" ]; then
    echo "❌ Timeout aguardando API em ${API_HOST}:${API_PORT}"
    docker compose logs backend
    exit 1
  fi
  echo "⏳ Ainda aguardando... (${ATTEMPT}/${MAX_ATTEMPTS})"
  ATTEMPT=$((ATTEMPT + 1))
  sleep 2
done

echo "✅ API está disponível!"

echo "📦 Rodando migrations..."
# Usando o CLI do TypeORM que já está instalado, apontando para o arquivo compilado
docker compose exec backend node node_modules/typeorm/cli.js migration:run -d dist/database/data-source.js

if [ $? -ne 0 ]; then
  echo "❌ Erro nas migrations"
  exit 1
fi

echo "🌱 Rodando seeders..."
# Rodando o arquivo de seed compilado
docker compose exec backend node dist/database/seeds/user.seed.js

if [ $? -ne 0 ]; then
  echo "❌ Erro nos seeders"
  exit 1
fi

echo "✅ Tudo executado com sucesso!"

echo "Deseja ver os logs? (N/Y)"
read letra

if [ "$letra" = "Y" ] || [ "$letra" = "y" ]; then
  echo "📑 Logs ativados (Ctrl+C para sair)..."
  docker compose logs -f
fi
