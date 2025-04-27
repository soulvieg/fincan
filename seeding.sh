#!/usr/bin/env bash
set -euo pipefail

# ─── Configuration ────────────────────────────────────────────
DB_CONTAINER="fincan-db-1"     # mysql container name
MYSQL_PWD="password"           # root password
# ──────────────────────────────────────────────────────────────

# Resolve the folder that *this* script is in (your repo root)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Absolute paths to SQL files
SCHEMA_PATH="$SCRIPT_DIR/database/schema.sql"
CUSTOMER_SEED_PATH="$SCRIPT_DIR/database/seed_customers.sql"
OTHER_SEED_PATH="$SCRIPT_DIR/database/seed.sql"

# Sanity-check they exist
[[ -f "$SCHEMA_PATH" ]]           || { echo "❌ schema.sql not found at $SCHEMA_PATH"; exit 1; }
[[ -f "$CUSTOMER_SEED_PATH" ]]    || { echo "❌ seed_customers.sql not found at $CUSTOMER_SEED_PATH"; exit 1; }
[[ -f "$OTHER_SEED_PATH" ]]       || { echo "❌ seed_others.sql not found at $OTHER_SEED_PATH";   exit 1; }

echo "↺  Dropping and recreating database ..."
docker exec -i "$DB_CONTAINER" \
  mysql -u root -p"$MYSQL_PWD" \
  -e "DROP DATABASE IF EXISTS fincan; CREATE DATABASE fincan;"

echo "📜  Loading schema.sql ..."
docker exec -i "$DB_CONTAINER" \
  mysql -u root -p"$MYSQL_PWD" fincan < "$SCHEMA_PATH"

echo "🌱  Loading customer seeds first ..."
docker exec -i "$DB_CONTAINER" \
  mysql -u root -p"$MYSQL_PWD" fincan < "$CUSTOMER_SEED_PATH"

echo "🌱  Loading other seeds ..."
docker exec -i "$DB_CONTAINER" \
  mysql -u root -p"$MYSQL_PWD" fincan < "$OTHER_SEED_PATH"

echo "✅  Seeding complete!"