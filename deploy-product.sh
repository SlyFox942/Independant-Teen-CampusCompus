#!/bin/bash
# Product PWA deploy script
# Builds the product and copies it to the site's public directory for serving
# as a sub-path (e.g., /app/)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PRODUCT_DIR="$SCRIPT_DIR/product"
OUTPUT_DIR="$SCRIPT_DIR/public/app"

echo "🔨 Building Campus Compass PWA..."
cd "$PRODUCT_DIR"
TMPDIR=/tmp bun install 2>&1 | tail -1
TMPDIR=/tmp bun run build 2>&1 | tail -1

echo "📦 Copying build to site public directory..."
rm -rf "$OUTPUT_DIR"
cp -r "$PRODUCT_DIR/dist" "$OUTPUT_DIR"

echo "✅ Product PWA deployed to $OUTPUT_DIR"
echo "🌐 Available at: https://<your-domain>/app/"