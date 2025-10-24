# GitHub Packages NPM Registry Setup Guide

This guide will help you publish the TUEL packages to GitHub Packages npm registry.

## 📋 Prerequisites

1. GitHub Personal Access Token (PAT) with `write:packages` and `read:packages` permissions
2. Repository access to `omerakben/tuel`
3. npm CLI installed locally

## 🔑 Step 1: Create GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Name: `TUEL_NPM_TOKEN` or similar
4. Select scopes:
   - ✅ `write:packages` - Upload packages to GitHub Package Registry
   - ✅ `read:packages` - Download packages from GitHub Package Registry
   - ✅ `repo` (if repository is private)
5. Generate and **save the token securely**

## 📝 Step 2: Configure Local Authentication

Create or update `~/.npmrc` in your home directory:

```bash
# For GitHub Packages authentication
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
@tuel:registry=https://npm.pkg.github.com
```

**Replace `YOUR_GITHUB_TOKEN` with your actual token.**

## 🔧 Step 3: Update Package Configuration

All packages already have the correct setup:
- ✅ `"name": "@tuel/<package>"` - Scoped to @tuel
- ✅ `"publishConfig": { "access": "public" }` - Public packages
- ✅ Repository field configured

The root `.npmrc` has been created with:
```
@tuel:registry=https://npm.pkg.github.com
```

## 🚀 Step 4: Publishing Packages

### Manual Publishing (for testing)

1. **Build all packages:**
   ```bash
   pnpm build
   ```

2. **Navigate to a package:**
   ```bash
   cd packages/motion
   ```

3. **Publish to GitHub Packages:**
   ```bash
   npm publish
   ```

4. **Repeat for all packages or use:**
   ```bash
   # From root
   pnpm --filter "@tuel/*" exec npm publish
   ```

### Automated Publishing via GitHub Actions

A workflow file `.github/workflows/publish-npm.yml` has been created that:
- Triggers on new tags (e.g., `v0.2.1`)
- Builds all packages
- Publishes to GitHub Packages
- Supports both GitHub Packages and npmjs.org

## 📦 Step 5: Installing Packages

### For Other Projects Using Your Packages

1. **Create `.npmrc` in the project:**
   ```
   @tuel:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
   ```

2. **Install packages:**
   ```bash
   npm install @tuel/motion
   # or
   pnpm add @tuel/scroll @tuel/gallery
   ```

### For Public Consumption (Optional: Dual Publishing)

If you want packages available on both GitHub Packages AND npmjs.org:

1. **Add NPM token to GitHub Secrets:**
   - Repository Settings → Secrets and variables → Actions
   - Add `NPM_TOKEN` with your npmjs.org token

2. **Modify publish workflow** to publish to both registries

## 🔐 Step 6: Add GitHub Token to Repository Secrets

1. Go to Repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `GITHUB_TOKEN` (this is usually auto-provided)
4. For additional security, you can create: `NPM_PUBLISH_TOKEN`

## 🎯 Step 7: Create a Release

### Option A: Manual Tag & Push
```bash
git tag v0.2.1
git push origin v0.2.1
```

### Option B: GitHub Releases UI
1. Go to repository → Releases
2. Click "Create a new release"
3. Choose tag: `v0.2.1`
4. Generate release notes
5. Publish release → This triggers the workflow

## ✅ Verification

1. **Check GitHub Packages:**
   - Navigate to: `https://github.com/omerakben/tuel/packages`
   - You should see all @tuel packages listed

2. **View Package Details:**
   - Click on a package (e.g., `@tuel/motion`)
   - See versions, downloads, and installation instructions

3. **Test Installation:**
   ```bash
   # In a test project
   echo "@tuel:registry=https://npm.pkg.github.com" > .npmrc
   echo "//npm.pkg.github.com/:_authToken=YOUR_TOKEN" >> .npmrc
   npm install @tuel/motion@0.2.0
   ```

## 🔄 Workflow Trigger Patterns

The publish workflow triggers on:
- **Tag push:** `git push origin v*.*.*`
- **GitHub Release:** Creating a release from GitHub UI
- **Manual:** Repository Actions tab → "Publish to npm" → Run workflow

## 📊 Publishing Strategy

### Current Setup (v0.2.0 → v1.0.0)

**Recommended approach:**

1. **Development:** Feature branches → main
2. **Testing:** Use CI/CD pipeline for validation
3. **Release Prep:**
   - Update version in package.json files
   - Update CHANGELOG.md
   - Commit: `chore: bump version to v0.2.1`
4. **Publish:**
   - Create tag: `git tag v0.2.1`
   - Push tag: `git push origin v0.2.1`
   - Workflow auto-publishes to GitHub Packages

### For v1.0.0+ (Future)

Consider using [Changesets](https://github.com/changesets/changesets) for automated versioning:
```bash
pnpm add -D @changesets/cli
pnpm changeset init
```

## 🛠️ Troubleshooting

### Error: "404 Not Found - PUT https://npm.pkg.github.com/@tuel/motion"

**Solution:** Ensure authentication is configured:
```bash
# Check authentication
npm whoami --registry=https://npm.pkg.github.com
```

### Error: "You do not have permission to publish"

**Solution:**
1. Verify PAT has `write:packages` scope
2. Check repository access
3. Ensure package name matches repository owner: `@tuel/package`

### Error: "Package already exists"

**Solution:** Increment version in package.json:
```bash
cd packages/motion
npm version patch  # 0.2.0 → 0.2.1
```

### Packages Not Showing in GitHub

**Wait:** It can take a few minutes for packages to appear in the UI after publishing.

**Check:**
```bash
curl -H "Authorization: token YOUR_TOKEN" \
  https://api.github.com/users/omerakben/packages?package_type=npm
```

## 📚 Additional Resources

- [GitHub Packages Documentation](https://docs.github.com/en/packages)
- [Working with npm registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
- [Publishing to GitHub Packages](https://docs.github.com/en/packages/learn-github-packages/publishing-a-package)
- [Deleting packages](https://docs.github.com/en/packages/learn-github-packages/deleting-and-restoring-a-package)

## 🎓 Quick Commands Reference

```bash
# Build all packages
pnpm build

# Test publish (dry run)
cd packages/motion && npm publish --dry-run

# Publish single package
cd packages/motion && npm publish

# Publish all packages
pnpm --filter "@tuel/*" exec npm publish

# Create and push tag
git tag v0.2.1 -m "Release v0.2.1"
git push origin v0.2.1

# View published packages
open https://github.com/omerakben/tuel/packages

# Install from GitHub Packages
npm install @tuel/motion@latest --registry=https://npm.pkg.github.com
```

## 🔒 Security Best Practices

1. **Never commit tokens** to Git
2. **Use separate tokens** for CI/CD and local development
3. **Regularly rotate tokens** (every 90 days recommended)
4. **Use fine-grained permissions** when possible
5. **Store tokens** in GitHub Secrets for CI/CD
6. **Add `.npmrc`** to `.gitignore` (already done)

---

**Need Help?** Open an issue at https://github.com/omerakben/tuel/issues
