#!/bin/bash

echo "Configuring nvm..."
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use node

echo "Installing dependencies..."
npm install

echo "Generating Prisma client..."
npx prisma generate

echo "Building the project..."
npm run build

echo "Running migrations..."
npx prisma migrate deploy

echo "Copying generated files..."
cp -r ./generated/* ./dist/generated

echo "Restarting the server..."
pm2 restart be-rental-kos