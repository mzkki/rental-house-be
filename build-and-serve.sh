#!/bin/bash

echo "Installing dependencies..."
exec npm install
echo "Generating Prisma client..."
exec npx prisma generate
echo "Building the project..."
exec npm run build
echo "Running migrations..."
exec npx prisma migrate deploy

echo "Copying generated files..."
exec cp -r ./generated/* ./dist/generated

echo "Restarting the server..."
exec pm2 restart be-rental-kos