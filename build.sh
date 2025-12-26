#!/usr/bin/env bash
# exit on error
set -o errexit

echo "📦 Installing dependencies (including dev dependencies for build)..."
yarn install --frozen-lockfile --production=false

echo "🏗️  Building application..."
yarn build

echo "✅ Build completed!"