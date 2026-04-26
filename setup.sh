#!/bin/sh

ENV_FILE=".env"

if [ ! -f "$ENV_FILE" ]; then
  printf "generating..."

  DB_PASSWORD=$(openssl rand -hex 16)

  JWT_SECRET=$(openssl rand -hex 32)

  printf "DB_PASSWORD=%s\n" "$DB_PASSWORD" > "$ENV_FILE"
  printf "JWT_SECRET=%s\n" "$JWT_SECRET" >> "$ENV_FILE"

  printf "created .env"
else
  printf ".env already exists"
fi

export $(grep -v '^#' "$ENV_FILE" | xargs)

printf "starting docker..."
docker compose up --build -d