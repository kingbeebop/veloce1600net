#!/bin/bash
set -e

# Wait for PostgreSQL to start
until psql -h "postgres" -U "$POSTGRES_USER" "$POSTGRES_DB" -c '\q'; do
    >&2 echo "Postgres is unavailable - sleeping"
    sleep 1
done

# Run migrations
echo "Postgres is up - running migrations"
dotnet ef database update

# Import the SQL dump
echo "Loading data from SQL dump"
psql -h "postgres" -U "$POSTGRES_USER" "$POSTGRES_DB" < /docker-entrypoint-initdb.d/velocenetdb.sql

echo "Data loaded successfully"
