#!/usr/bin/env bash
# exit on error
set -o errexit

echo "📦 Installing dependencies..."
yarn install --frozen-lockfile

echo "🏗️  Building application..."
yarn build

echo "✅ Build completed!"