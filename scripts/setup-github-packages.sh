#!/bin/bash

# TUEL GitHub Packages Setup Script
# This script helps configure GitHub Packages npm registry for local development

set -e

echo "🎨 TUEL - GitHub Packages npm Registry Setup"
echo "=============================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if GitHub token is provided
if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${YELLOW}⚠️  GITHUB_TOKEN environment variable not set${NC}"
    echo ""
    echo "To use this script, you need a GitHub Personal Access Token with 'write:packages' and 'read:packages' permissions."
    echo ""
    echo "Steps to create a token:"
    echo "1. Go to https://github.com/settings/tokens"
    echo "2. Click 'Generate new token (classic)'"
    echo "3. Select scopes: write:packages, read:packages"
    echo "4. Generate and copy the token"
    echo ""
    read -p "Enter your GitHub token: " GITHUB_TOKEN
    echo ""
fi

# Validate token is not empty
if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${RED}❌ No token provided. Exiting.${NC}"
    exit 1
fi

# Configure npm authentication
echo -e "${BLUE}📝 Configuring npm authentication...${NC}"

# Create or update ~/.npmrc
NPMRC_PATH="$HOME/.npmrc"

# Backup existing .npmrc if it exists
if [ -f "$NPMRC_PATH" ]; then
    echo -e "${YELLOW}⚠️  Backing up existing ~/.npmrc to ~/.npmrc.backup${NC}"
    cp "$NPMRC_PATH" "$NPMRC_PATH.backup"
fi

# Write authentication config
cat > "$NPMRC_PATH" << EOL
# GitHub Packages authentication for @tuel scope
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
@tuel:registry=https://npm.pkg.github.com

# Fallback to npm registry for other packages
registry=https://registry.npmjs.org

# Configuration
save-exact=true
auto-install-peers=true
engine-strict=true
EOL

echo -e "${GREEN}✅ Authentication configured in ~/.npmrc${NC}"
echo ""

# Test authentication
echo -e "${BLUE}🔍 Testing GitHub Packages authentication...${NC}"

if npm whoami --registry=https://npm.pkg.github.com > /dev/null 2>&1; then
    GITHUB_USER=$(npm whoami --registry=https://npm.pkg.github.com)
    echo -e "${GREEN}✅ Authenticated as: ${GITHUB_USER}${NC}"
else
    echo -e "${RED}❌ Authentication failed. Please check your token.${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo "Next steps:"
echo ""
echo "1. Build packages:"
echo "   ${BLUE}pnpm build${NC}"
echo ""
echo "2. Publish a single package:"
echo "   ${BLUE}cd packages/motion && npm publish${NC}"
echo ""
echo "3. Publish all packages:"
echo "   ${BLUE}pnpm --filter \"@tuel/*\" exec npm publish${NC}"
echo ""
echo "4. Or use GitHub Actions:"
echo "   ${BLUE}git tag v0.2.1 && git push origin v0.2.1${NC}"
echo ""
echo "📚 Full documentation: ${BLUE}docs/github-packages-setup.md${NC}"
echo ""
