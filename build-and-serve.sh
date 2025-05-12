npm install
npx prisma generate
npm run build
npx prisma migrate deploy

cp -r ./generated/* ./dist/generated

pm2 restart be-rental-kos