#!/bin/bash
# Product PWA deploy script
# Builds the product and places it in the site's client directory for serving
# as a sub-path (/app/) alongside the marketing site on port 3000.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PRODUCT_DIR="$SCRIPT_DIR/product"
SITE_CLIENT_DIR="$SCRIPT_DIR/dist/client"

echo "🔨 Building Campus Compass PWA..."
cd "$PRODUCT_DIR"
TMPDIR=/tmp bun install 2>&1 | tail -1
TMPDIR=/tmp bun run build 2>&1 | tail -1

echo "📦 Copying build to site client directory..."
rm -rf "$SITE_CLIENT_DIR/app"
mkdir -p "$SITE_CLIENT_DIR/app"
cp -r "$PRODUCT_DIR/dist/"* "$SITE_CLIENT_DIR/app/"

echo "🏗️  Rebuilding site..."
cd "$SCRIPT_DIR"
TMPDIR=/tmp bun run build 2>&1 | tail -3

echo "🔄 Restarting server..."
sudo sh -c 'lsof -t -iTCP:3000 -sTCP:LISTEN | xargs -r kill' 2>/dev/null
TMPDIR=/tmp nohup bun run start > .run/server.log 2>&1 < /dev/null &

echo "✅ Product PWA deployed to /app/"
echo "🌐 Available at: http://localhost:3000/app/"