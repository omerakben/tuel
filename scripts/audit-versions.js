#!/usr/bin/env node

/**
 * Version Audit Script
 * Checks all package versions for consistency
 */

const fs = require("fs");
const path = require("path");

function auditVersions() {
  console.log("🔍 Auditing Package Versions\n");

  // Find all package.json files
  const packagesDir = path.join(__dirname, "..", "packages");
  const packageFiles = fs.readdirSync(packagesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => path.join(packagesDir, dirent.name, "package.json"));

  // Add root package.json
  packageFiles.unshift(path.join(__dirname, "..", "package.json"));

  const versions = [];
  const issues = [];

  // Collect version info
  for (const pkgPath of packageFiles) {
    try {
      const pkgContent = fs.readFileSync(pkgPath, "utf8");
      const pkg = JSON.parse(pkgContent);

      versions.push({
        name: pkg.name || "root",
        version: pkg.version,
        path: path.relative(path.join(__dirname, ".."), pkgPath),
        private: pkg.private || false,
      });

      // Check for version issues
      if (!pkg.version) {
        issues.push(`❌ ${pkg.name}: Missing version field`);
      } else if (pkg.version.startsWith("1.") && !pkg.private) {
        issues.push(
          `⚠️  ${pkg.name}: v${pkg.version} - Should be v0.x.x or v2.x.x+`
        );
      }
    } catch (error) {
      issues.push(`❌ ${pkgPath}: Failed to parse - ${error.message}`);
    }
  }

  // Display results
  console.table(
    versions.map((v) => ({
      Package: v.name,
      Version: v.version,
      Private: v.private ? "✓" : "",
      Status: v.version.startsWith("1.") ? "⚠️  Needs Fix" : "✅ OK",
    }))
  );

  console.log("\n📊 Summary:");
  console.log(`Total packages: ${versions.length}`);
  console.log(
    `Unique versions: ${[...new Set(versions.map((v) => v.version))].length}`
  );

  if (issues.length > 0) {
    console.log("\n🚨 Issues Found:\n");
    issues.forEach((issue) => console.log(issue));
    console.log("\n💡 Recommendation:");
    console.log(
      "1. Run: pnpm changeset add (select major bump to v2.0.0-alpha.1)"
    );
    console.log("2. Run: pnpm changeset version");
    console.log("3. Commit version changes");
    process.exit(1);
  } else {
    console.log("\n✅ All package versions are consistent!");
    process.exit(0);
  }
}

try {
  auditVersions();
} catch (error) {
  console.error("❌ Audit failed:", error);
  process.exit(1);
}
