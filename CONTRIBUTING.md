# Contributing to TUEL

Thank you for your interest in contributing to TUEL! We welcome contributions from the community and are grateful for your support.

## Development Setup

### Prerequisites

- Node.js >= 18
- pnpm >= 10.14.0
- Git

### Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/tuel.git
   cd tuel
   ```

3. Install dependencies:
   ```bash
   pnpm install
   ```

4. Build all packages:
   ```bash
   pnpm build
   ```

5. Run the development server:
   ```bash
   pnpm dev
   ```

## Development Workflow

### Working on Packages

To work on a specific package:

```bash
# Start development mode for all packages
pnpm dev:packages

# Or work on a specific package
cd packages/scroll
pnpm dev
```

### Running Tests

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage

# E2E tests
pnpm test:e2e
```

### Type Checking

```bash
pnpm typecheck
```

### Linting

```bash
pnpm lint
```

## Making Changes

### Creating a Changeset

When you make changes that should be released:

1. Run `pnpm changeset`
2. Select the packages you've changed
3. Choose the version bump type (patch/minor/major)
4. Write a description of your changes

### Commit Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Test changes
- `chore:` Build process or auxiliary tool changes

Examples:
```
feat(scroll): add smooth scroll support
fix(motion): correct animation timing
docs(readme): update installation instructions
```

## Pull Request Process

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them following our commit convention

3. Push your branch and create a pull request

4. Ensure all checks pass:
   - Tests
   - Type checking
   - Linting
   - Build

5. Request review from maintainers

## Code Quality Standards

### TypeScript

- Enable strict mode
- Provide proper types for all exports
- Avoid `any` types

### Performance

- Respect `prefers-reduced-motion`
- Use passive event listeners
- Implement proper cleanup in hooks
- Lazy load heavy dependencies

### Accessibility

- Ensure keyboard navigation works
- Provide proper ARIA attributes
- Test with screen readers

### Testing

- Write tests for new features
- Maintain test coverage above 80%
- Test SSR compatibility
- Test accessibility features

## Package Guidelines

### Creating a New Package

1. Copy the template structure from an existing package
2. Update `package.json` with proper metadata
3. Configure `tsup.config.ts`
4. Add exports to `src/index.ts`
5. Create a comprehensive README
6. Add tests

### Package Structure

```
packages/your-package/
├── src/
│   ├── index.ts        # Main exports
│   ├── components/     # React components
│   ├── hooks/          # React hooks
│   ├── utils/          # Utilities
│   └── types/          # TypeScript types
├── package.json
├── tsup.config.ts
├── tsconfig.json
└── README.md
```

## Getting Help

- Open an issue for bugs or feature requests
- Join discussions in GitHub Discussions
- Contact maintainers at contact@tuel.ai

## License

By contributing to TUEL, you agree that your contributions will be licensed under its MIT license.