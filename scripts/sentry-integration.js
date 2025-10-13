#!/usr/bin/env node

/**
 * Sentry Integration Script
 *
 * This script helps integrate TUEL with Sentry for error tracking and monitoring.
 */

const fs = require("fs");
const path = require("path");

// Sentry configuration template
const SENTRY_CONFIG_TEMPLATE = `// Sentry configuration for TUEL
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

// Initialize Sentry
Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  release: process.env.REACT_APP_VERSION || process.env.NEXT_PUBLIC_VERSION,
  integrations: [
    new Integrations.BrowserTracing(),
  ],
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  beforeSend(event, hint) {
    // Filter out non-TUEL errors
    if (event.exception) {
      const error = hint.originalException;
      if (error && error.message && !error.message.includes('TUEL')) {
        return null;
      }
    }
    return event;
  },
  beforeBreadcrumb(breadcrumb) {
    // Filter out noise
    if (breadcrumb.category === 'console' && breadcrumb.level === 'debug') {
      return null;
    }
    return breadcrumb;
  },
});

export default Sentry;
`;

// Sentry webpack plugin configuration
const WEBPACK_CONFIG_TEMPLATE = `// Sentry webpack plugin configuration
const SentryWebpackPlugin = require('@sentry/webpack-plugin');

module.exports = {
  // ... your webpack config
  plugins: [
    // ... other plugins
    new SentryWebpackPlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      release: process.env.SENTRY_RELEASE,
      include: './dist',
      ignore: ['node_modules', 'webpack.config.js'],
    }),
  ],
};
`;

// Environment variables template
const ENV_TEMPLATE = `# Sentry Configuration
SENTRY_DSN=your_sentry_dsn_here
SENTRY_ORG=your_sentry_org
SENTRY_PROJECT=your_sentry_project
SENTRY_AUTH_TOKEN=your_sentry_auth_token
SENTRY_RELEASE=1.0.0
`;

// Package.json scripts template
const PACKAGE_SCRIPTS = {
  "sentry:install":
    "npm install @sentry/react @sentry/tracing @sentry/webpack-plugin",
  "sentry:upload": "sentry-cli releases files upload-sourcemaps dist",
  "sentry:create-release": "sentry-cli releases new $npm_package_version",
  "sentry:finalize-release":
    "sentry-cli releases finalize $npm_package_version",
  "sentry:deploy":
    "sentry-cli releases deploys $npm_package_version new -e production",
};

// Main function
function main() {
  const command = process.argv[2];

  switch (command) {
    case "init":
      initializeSentry();
      break;
    case "config":
      generateConfig();
      break;
    case "scripts":
      addScripts();
      break;
    case "help":
    default:
      showHelp();
      break;
  }
}

function initializeSentry() {
  console.log("🚀 Initializing Sentry integration for TUEL...");

  // Create sentry directory
  const sentryDir = path.join(process.cwd(), "sentry");
  if (!fs.existsSync(sentryDir)) {
    fs.mkdirSync(sentryDir, { recursive: true });
  }

  // Generate configuration files
  generateConfig();
  addScripts();

  console.log("✅ Sentry integration initialized successfully!");
  console.log("📝 Next steps:");
  console.log("1. Install Sentry packages: npm run sentry:install");
  console.log("2. Set up your Sentry project and get the DSN");
  console.log("3. Add your Sentry credentials to .env.local");
  console.log("4. Import and use Sentry in your components");
}

function generateConfig() {
  console.log("📝 Generating Sentry configuration files...");

  // Create sentry config
  const sentryConfigPath = path.join(
    process.cwd(),
    "sentry",
    "sentry.config.js"
  );
  fs.writeFileSync(sentryConfigPath, SENTRY_CONFIG_TEMPLATE);

  // Create webpack config
  const webpackConfigPath = path.join(
    process.cwd(),
    "sentry",
    "webpack.config.js"
  );
  fs.writeFileSync(webpackConfigPath, WEBPACK_CONFIG_TEMPLATE);

  // Create environment template
  const envPath = path.join(process.cwd(), ".env.sentry.example");
  fs.writeFileSync(envPath, ENV_TEMPLATE);

  console.log("✅ Configuration files generated!");
}

function addScripts() {
  console.log("📝 Adding Sentry scripts to package.json...");

  const packageJsonPath = path.join(process.cwd(), "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    console.error("❌ package.json not found!");
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }

  // Add Sentry scripts
  Object.assign(packageJson.scripts, PACKAGE_SCRIPTS);

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  console.log("✅ Sentry scripts added to package.json!");
}

function showHelp() {
  console.log(`
🔧 TUEL Sentry Integration Tool

Usage: node scripts/sentry-integration.js <command>

Commands:
  init     - Initialize Sentry integration
  config   - Generate configuration files
  scripts  - Add Sentry scripts to package.json
  help     - Show this help message

Examples:
  node scripts/sentry-integration.js init
  node scripts/sentry-integration.js config
  node scripts/sentry-integration.js scripts
`);
}

// Run main function
main();
