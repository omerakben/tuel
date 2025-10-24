# Package Publishing Guide

## Publishing to GitHub Packages

### Quick Start

1. **Run setup script:**

   ```bash
   ./scripts/setup-github-packages.sh
   ```

   Or set up manually following [docs/github-packages-setup.md](./docs/github-packages-setup.md)

2. **Build all packages:**

   ```bash
   pnpm build
   ```

3. **Publish all packages:**

   ```bash
   pnpm --filter "@tuel/*" exec npm publish
   ```

### Using GitHub Actions

**Trigger via tag:**

```bash
git tag v0.2.1
git push origin v0.2.1
```

The workflow will automatically:

- Build all packages
- Run tests
- Publish to GitHub Packages

## Installing from GitHub Packages

### For Consumers

1. **Create `.npmrc` in your project:**

   ```
   @tuel:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
   ```

2. **Install packages:**

   ```bash
   npm install @tuel/motion @tuel/scroll
   ```

### For Public Access (Future)

When published to npmjs.org, packages can be installed without authentication:

```bash
npm install @tuel/motion
```

## Version Management

### Current Strategy (Manual)

1. Update version in package.json
2. Commit changes
3. Create git tag
4. Push tag to trigger workflow

### Future Strategy (Changesets)

Will implement automated version management with changesets:

```bash
pnpm changeset add
pnpm changeset version
pnpm changeset publish
```

## Troubleshooting

See [docs/github-packages-setup.md](./docs/github-packages-setup.md) for detailed troubleshooting steps.

### Quick Fixes

**Authentication issues:**

```bash
npm whoami --registry=https://npm.pkg.github.com
```

**Version conflicts:**

```bash
npm version patch  # Increment version
```

**View published packages:**

```bash
open https://github.com/omerakben/tuel/packages
```

## Documentation

- [GitHub Packages Setup Guide](./docs/github-packages-setup.md) - Complete setup instructions
- [GitHub Packages Documentation](https://docs.github.com/en/packages)
- [npm registry guide](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
