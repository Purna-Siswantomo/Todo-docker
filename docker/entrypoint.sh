#!/bin/sh
set -e

echo "Waiting for database and running migrations..."

until php artisan migrate --force; do
  echo "Database not ready yet. Retrying in 5 seconds..."
  sleep 5
done

exec php artisan serve --host=0.0.0.0 --port=8000
