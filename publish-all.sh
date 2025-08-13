#!/bin/bash

# Publish packages in dependency order
echo "Publishing TUEL packages to npm..."

# Base packages (no internal dependencies)
echo "Publishing @tuel/utils..."
cd packages/utils && npm publish --access public
cd ../..

echo "Publishing @tuel/tokens..."
cd packages/tokens && npm publish --access public
cd ../..

echo "Publishing @tuel/config..."
cd packages/config && npm publish --access public
cd ../..

# Mid-level packages
echo "Publishing @tuel/performance..."
cd packages/performance && npm publish --access public
cd ../..

echo "Publishing @tuel/state..."
cd packages/state && npm publish --access public
cd ../..

echo "Publishing @tuel/gsap..."
cd packages/gsap && npm publish --access public
cd ../..

echo "Publishing @tuel/motion..."
cd packages/motion && npm publish --access public
cd ../..

echo "Publishing @tuel/interaction..."
cd packages/interaction && npm publish --access public
cd ../..

# Higher-level packages
echo "Publishing @tuel/text-effects..."
cd packages/text-effects && npm publish --access public
cd ../..

echo "Publishing @tuel/three..."
cd packages/three && npm publish --access public
cd ../..

echo "Publishing @tuel/gallery..."
cd packages/gallery && npm publish --access public
cd ../..

echo "Publishing @tuel/ui..."
cd packages/ui && npm publish --access public
cd ../..

echo "Publishing @tuel/scroll..."
cd packages/scroll && npm publish --access public
cd ../..

echo "✅ All packages published successfully!"