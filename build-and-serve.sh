npm install
npx prisma generate
npm run build

cp -r ./generated/* ./dist/generated

pm2 restart be-rental-kos