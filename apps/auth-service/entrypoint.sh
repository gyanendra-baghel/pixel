#!/bin/sh
echo "📦 Generating Prisma files..."
npx prisma generate

echo "📦 Running DB migrations..."
npx prisma migrate deploy

echo "🚀 Starting app..."
exec node .
