#!/bin/bash

# CI/CD Pipeline Scripts
# This script provides various utilities for the CI/CD pipeline

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Install dependencies
install_dependencies() {
    log_info "Installing dependencies..."

    if command_exists pnpm; then
        pnpm install --frozen-lockfile
    elif command_exists npm; then
        npm ci
    else
        log_error "Neither pnpm nor npm found. Please install Node.js package manager."
        exit 1
    fi

    log_success "Dependencies installed successfully"
}

# Run quality gates
run_quality_gates() {
    log_info "Running quality gates..."

    # Lint check
    log_info "Running linter..."
    if command_exists pnpm; then
        pnpm lint
    else
        npm run lint
    fi

    # Type check
    log_info "Running type check..."
    if command_exists pnpm; then
        pnpm typecheck
    else
        npm run typecheck
    fi

    # Format check
    log_info "Running format check..."
    if command_exists pnpm; then
        pnpm format:check
    else
        npm run format:check
    fi

    # Security audit
    log_info "Running security audit..."
    if command_exists pnpm; then
        pnpm audit:all
    else
        npm run audit:all
    fi

    log_success "Quality gates passed"
}

# Run tests
run_tests() {
    log_info "Running tests..."

    # Unit tests
    log_info "Running unit tests..."
    if command_exists pnpm; then
        pnpm test
    else
        npm test
    fi

    # Coverage
    log_info "Running tests with coverage..."
    if command_exists pnpm; then
        pnpm test:coverage
    else
        npm run test:coverage
    fi

    log_success "Tests completed successfully"
}

# Build packages
build_packages() {
    log_info "Building packages..."

    if command_exists pnpm; then
        pnpm build
    else
        npm run build
    fi

    log_success "Packages built successfully"
}

# Run E2E tests
run_e2e_tests() {
    log_info "Running E2E tests..."

    # Install Playwright browsers
    log_info "Installing Playwright browsers..."
    if command_exists pnpm; then
        pnpm exec playwright install --with-deps
    else
        npx playwright install --with-deps
    fi

    # Run E2E tests
    log_info "Running E2E tests..."
    if command_exists pnpm; then
        pnpm test:e2e
    else
        npm run test:e2e
    fi

    # Run visual regression tests
    log_info "Running visual regression tests..."
    if command_exists pnpm; then
        pnpm test:visual
    else
        npm run test:visual
    fi

    # Run security tests
    log_info "Running security tests..."
    if command_exists pnpm; then
        pnpm test:security
    else
        npm run test:security
    fi

    # Run browser compatibility tests
    log_info "Running browser compatibility tests..."
    if command_exists pnpm; then
        pnpm test:browser-compatibility
    else
        npm run test:browser-compatibility
    fi

    # Run performance benchmark tests
    log_info "Running performance benchmark tests..."
    if command_exists pnpm; then
        pnpm test:performance-benchmark
    else
        npm run test:performance-benchmark
    fi

    log_success "E2E tests completed successfully"
}

# Run performance tests
run_performance_tests() {
    log_info "Running performance tests..."

    if command_exists pnpm; then
        pnpm test:performance-benchmark
    else
        npm run test:performance-benchmark
    fi

    # Generate performance report
    log_info "Generating performance report..."
    if command_exists pnpm; then
        pnpm performance:report
    else
        npm run performance:report
    fi

    log_success "Performance tests completed successfully"
}

# Run security scan
run_security_scan() {
    log_info "Running security scan..."

    # Dependency audit
    log_info "Running dependency audit..."
    if command_exists pnpm; then
        pnpm audit:deps
    else
        npm audit --audit-level=moderate
    fi

    # Security audit
    log_info "Running security audit..."
    if command_exists pnpm; then
        pnpm audit:security
    else
        npm run audit:security
    fi

    log_success "Security scan completed successfully"
}

# Generate documentation
generate_docs() {
    log_info "Generating documentation..."

    if command_exists pnpm; then
        pnpm docs:generate
    else
        npm run docs:generate
    fi

    log_success "Documentation generated successfully"
}

# Check bundle sizes
check_bundle_sizes() {
    log_info "Checking bundle sizes..."

    if command_exists pnpm; then
        pnpm bundle:analyze
    else
        npm run bundle:analyze
    fi

    log_success "Bundle size analysis completed"
}

# Deploy
deploy() {
    log_info "Deploying..."

    # Build packages
    build_packages

    # Deploy to npm
    log_info "Deploying to npm..."
    if command_exists pnpm; then
        pnpm release
    else
        npm run release
    fi

    # Deploy documentation
    log_info "Deploying documentation..."
    if command_exists pnpm; then
        pnpm docs:deploy
    else
        npm run docs:deploy
    fi

    log_success "Deployment completed successfully"
}

# Main function
main() {
    case "${1:-help}" in
        "install")
            install_dependencies
            ;;
        "quality")
            run_quality_gates
            ;;
        "test")
            run_tests
            ;;
        "build")
            build_packages
            ;;
        "e2e")
            run_e2e_tests
            ;;
        "performance")
            run_performance_tests
            ;;
        "security")
            run_security_scan
            ;;
        "docs")
            generate_docs
            ;;
        "bundle")
            check_bundle_sizes
            ;;
        "deploy")
            deploy
            ;;
        "all")
            install_dependencies
            run_quality_gates
            run_tests
            build_packages
            run_e2e_tests
            run_performance_tests
            run_security_scan
            generate_docs
            check_bundle_sizes
            ;;
        "help"|*)
            echo "Usage: $0 {install|quality|test|build|e2e|performance|security|docs|bundle|deploy|all|help}"
            echo ""
            echo "Commands:"
            echo "  install     - Install dependencies"
            echo "  quality     - Run quality gates (lint, typecheck, format, security)"
            echo "  test        - Run unit tests with coverage"
            echo "  build       - Build packages"
            echo "  e2e         - Run E2E tests (including visual, security, browser compatibility, performance)"
            echo "  performance - Run performance tests and generate report"
            echo "  security    - Run security scan"
            echo "  docs        - Generate documentation"
            echo "  bundle      - Check bundle sizes"
            echo "  deploy      - Deploy to npm and documentation"
            echo "  all         - Run all checks and tests"
            echo "  help        - Show this help message"
            ;;
    esac
}

# Run main function with all arguments
main "$@"
