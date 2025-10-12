#!/bin/bash

# Phase Validation Script
# Runs comprehensive checks after each development phase

set -e  # Exit on error

echo "🔍 Running Phase Validation Checklist..."
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track failures
FAILURES=0

# Function to run check
run_check() {
  local name=$1
  local command=$2

  echo -n "⏳ $name... "

  if eval "$command" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
  else
    echo -e "${RED}✗${NC}"
    FAILURES=$((FAILURES + 1))
    echo "   Command: $command"
  fi
}

# 1. Dependencies installed
run_check "Dependencies installed" "test -d node_modules"

# 2. TypeScript compilation
echo -n "⏳ TypeScript compilation... "
if pnpm typecheck 2>&1 | tee /tmp/typecheck.log; then
  echo -e "${GREEN}✓${NC}"
else
  echo -e "${RED}✗${NC}"
  FAILURES=$((FAILURES + 1))
  echo "   See /tmp/typecheck.log for details"
fi

# 3. Linting
echo -n "⏳ Linting... "
if pnpm lint 2>&1 | tee /tmp/lint.log; then
  echo -e "${GREEN}✓${NC}"
else
  echo -e "${RED}✗${NC}"
  FAILURES=$((FAILURES + 1))
  echo "   See /tmp/lint.log for details"
fi

# 4. Build
echo -n "⏳ Build... "
if pnpm build 2>&1 | tee /tmp/build.log; then
  echo -e "${GREEN}✓${NC}"
else
  echo -e "${RED}✗${NC}"
  FAILURES=$((FAILURES + 1))
  echo "   See /tmp/build.log for details"
fi

# 5. Tests
echo -n "⏳ Unit tests... "
if pnpm test 2>&1 | tee /tmp/test.log; then
  echo -e "${GREEN}✓${NC}"
else
  echo -e "${RED}✗${NC}"
  FAILURES=$((FAILURES + 1))
  echo "   See /tmp/test.log for details"
fi

# 6. Coverage (optional, warn only)
echo -n "⏳ Test coverage... "
if pnpm test:coverage --reporter=json-summary 2>&1 | tee /tmp/coverage.log; then
  if [ -f coverage/coverage-summary.json ]; then
    COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct' 2>/dev/null || echo "0")
    echo -e "${GREEN}✓ ($COVERAGE%)${NC}"

    if (( $(echo "$COVERAGE < 60" | bc -l 2>/dev/null || echo "1") )); then
      echo -e "   ${YELLOW}⚠️  Coverage below 60%${NC}"
    fi
  else
    echo -e "${YELLOW}⚠️  No coverage data${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  Coverage check skipped${NC}"
fi

# 7. Security audit
echo -n "⏳ Security audit... "
if pnpm audit --audit-level=high 2>&1 | tee /tmp/audit.log; then
  echo -e "${GREEN}✓${NC}"
else
  echo -e "${RED}✗${NC}"
  FAILURES=$((FAILURES + 1))
  echo "   See /tmp/audit.log for details"
fi

# 8. Check for XSS vulnerabilities
echo -n "⏳ XSS vulnerability check... "
if grep -r "dangerouslySetInnerHTML" packages/ 2>/dev/null; then
  echo -e "${RED}✗${NC}"
  echo "   Found dangerouslySetInnerHTML usage in codebase"
  FAILURES=$((FAILURES + 1))
else
  echo -e "${GREEN}✓${NC}"
fi

# 9. Version consistency
echo -n "⏳ Version consistency... "
if node scripts/audit-versions.js > /dev/null 2>&1; then
  echo -e "${GREEN}✓${NC}"
else
  echo -e "${YELLOW}⚠️  Version inconsistencies found${NC}"
  echo "   Run: node scripts/audit-versions.js for details"
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $FAILURES -eq 0 ]; then
  echo -e "${GREEN}✅ All validation checks passed!${NC}"
  echo ""
  echo "Ready to proceed to next phase."
  exit 0
else
  echo -e "${RED}❌ Validation failed with $FAILURES issue(s)${NC}"
  echo ""
  echo "Please fix the issues above before proceeding."
  echo "Check log files in /tmp/ for detailed error messages."
  exit 1
fi
