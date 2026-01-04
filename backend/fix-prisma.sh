#!/bin/bash
# Fix Prisma permissions and regenerate client

echo "Fixing permissions..."
sudo chown -R $(whoami):staff prisma/migrations
sudo chown -R $(whoami):staff node_modules/.prisma

echo "Generating Prisma client..."
npx prisma generate

echo "Done! You can now run: npm run dev"
