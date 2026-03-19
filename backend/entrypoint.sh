#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

DB_HOST=$DATABASE_HOST
DB_PORT=$DATABASE_PORT

echo "Entrypoint: Waiting for PostgreSQL at $DB_HOST:$DB_PORT..."

# This loop checks if the database is ready by trying to connect to it.
until printf "" 2>>/dev/null >>/dev/tcp/$DB_HOST/$DB_PORT; do
  echo "Entrypoint: PostgreSQL is unavailable - sleeping for 1 second"
  sleep 1
done

echo "Entrypoint: PostgreSQL has started"

echo "Running Django migrations..."
python manage.py migrate --noinput

# Collect static ONLY in production
if [ "$DJANGO_ENV" = "prod" ]; then
    echo "Collecting static files..."
    python manage.py collectstatic --noinput
fi

exec "$@"