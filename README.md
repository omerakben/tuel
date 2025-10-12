# 🎨 TUEL Animation Library

**For**: GitHub Copilot Agent  > **The professional animation library for React developers**

**Purpose**: Begin autonomous improvement of TUEL animation library

**Timeline**: 22 weeks (January 2025 → June 2025)  [![NPM Packages](https://img.shields.io/badge/npm-13%20packages-brightgreen)](https://www.npmjs.com/search?q=%40tuel)

**Goal**: v1.1.2 (6.5/10) → v2.0.0 (9.0/10+)[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://typescriptlang.org)

---[![Demo](https://img.shields.io/badge/demo-live-success)](https://tuel-animation.vercel.app)

[![Version](https://img.shields.io/badge/version-1.1.2-orange)](https://github.com/omerakben/tuel)

## 📋 Pre-Flight Checklist[![Status](https://img.shields.io/badge/status-in%20development-yellow)](PROGRESS.md)

Before starting, verify the environment is ready:**Transform your React applications with beautiful, performant animations**

```bash> ⚠️ **Development Notice**: TUEL is currently in active development (v1.1.2 → v2.0.0). We're working on critical security fixes and achieving 80%+ test coverage. See [PROGRESS.md](PROGRESS.md) for current status.

# 1. Check Node.js version

node --version  # Should output v18.x or v20.x🚀 **[View Live Demo](https://tuel-animation.vercel.app)** | 📚 **[Documentation](https://tuel-lib.vercel.app)** | 📦 **[NPM Packages](https://www.npmjs.com/search?q=%40tuel)** | 📊 **[Progress Tracker](PROGRESS.md)**



# 2. Verify pnpm is installed## ✨ Quick Start

pnpm --version  # Should output 9.x

```bash

# 3. Check current directory# Install core animation packages

pwd  # Should be /Users/ozzy-mac/Projects/tuelnpm install @tuel/motion @tuel/scroll @tuel/gallery



# 4. Verify clean git state# Or install specific packages you need

git status  # Should show clean working tree or expected changesnpm install @tuel/text-effects @tuel/ui @tuel/interaction

npm install @tuel/gsap @tuel/three @tuel/performance

# 5. Check dependencies are installed```

test -d node_modules && echo "✅ Dependencies installed" || echo "❌ Run: pnpm install"

```## 🎭 Simple, Powerful Animations



**If any check fails**, run:```tsx

```bashimport { HorizontalScroll } from '@tuel/scroll';

# Install Node.js 20 (if needed)import { TextReveal } from '@tuel/text-effects';

nvm install 20import { InteractiveGallery } from '@tuel/gallery';

nvm use 20

function MyApp() {

# Install pnpm (if needed)  return (

npm install -g pnpm    <div>

      <TextReveal effect="splitWords" stagger={0.1}>

# Install dependencies        Beautiful typography animations

pnpm install      </TextReveal>

```

      <HorizontalScroll speed={1.2} pin={true}>

---        <Card>Slide 1</Card>

        <Card>Slide 2</Card>

## 🎯 Execution Steps        <Card>Slide 3</Card>

      </HorizontalScroll>

### Step 1: Review Documentation (5 minutes)

      <InteractiveGallery

Read these files in order:        images={images}

        layout="masonry"

1. **COPILOT_EXECUTION_PLAN.md** - Full autonomous execution plan        hover="zoom"

2. **TODO.md** - Detailed task breakdown (1,500+ lines)      />

3. **PROGRESS.md** - Progress tracking template    </div>

4. **ANALYSIS_REPORT.md** - Current codebase assessment  );

}

**Key takeaways**:```

- 9 critical XSS vulnerabilities to fix (Phase 1)

- Memory leaks in Three.js components (Phase 1)## 📦 Complete Package Ecosystem

- Test coverage currently ~5%, target 80% (Phase 2)

- Version strategy: v1.1.2 → v2.0.0| Package              | Description                      | Size    |

| -------------------- | -------------------------------- | ------- |

---| `@tuel/motion`       | Motion primitives and animations | 6.9 kB  |

| `@tuel/scroll`       | Scroll-triggered animations      | 37.7 kB |

### Step 2: Initialize Git Workflow (2 minutes)| `@tuel/gallery`      | Interactive image galleries      | 49.9 kB |

| `@tuel/text-effects` | Typography animations            | 7.2 kB  |

```bash| `@tuel/ui`           | UI animation components          | 6.0 kB  |

# Create development branch| `@tuel/interaction`  | Interactive elements             | 6.0 kB  |

git checkout -b develop| `@tuel/gsap`         | GSAP integration utilities       | 1.8 kB  |

git push -u origin develop| `@tuel/three`        | Three.js animation helpers       | 4.5 kB  |

| `@tuel/performance`  | Performance optimization         | 6.4 kB  |

# Create autonomous work branch| `@tuel/state`        | Animation state management       | 6.0 kB  |

git checkout -b copilot/autonomous-improvement| `@tuel/config`       | Configuration system             | 2.0 kB  |

| `@tuel/tokens`       | Design tokens                    | 4.8 kB  |

# Verify branch| `@tuel/utils`        | Core utilities                   | 1.4 kB  |

git branch --show-current  # Should show: copilot/autonomous-improvement

```## 🛠 Development



---This repository contains the complete TUEL animation library monorepo built with:



### Step 3: Run Version Audit (Phase 0 Task 0.1)- **TypeScript 5** - Type-safe animation development

- **React 19** - Latest React features and optimizations

```bash- **Turborepo** - High-performance build system

# Run version audit script- **Next.js 15** - Demo application framework

node scripts/audit-versions.js

### Local Development

# Expected output:

# - Shows version inconsistencies (most at v1.1.2, gallery at v1.1.3)```bash

# - Recommends version alignment strategy# Clone the repository

```git clone https://github.com/omerakben/tuel.git

cd tuel

**Decision Point**: Choose version strategy from TODO.md section 0.0:

- ✅ **Option 2** (RECOMMENDED): Continue v1.1.2 → v2.0.0# Install dependencies

- Option 1: Deprecate v1.x, restart at v2.0.0pnpm install

- Option 3: Jump to v10.0.0

# Build all packages

**Implementation**:pnpm build

```bash

# Create changeset for major version bump# Run the demo application

pnpm changeset addpnpm dev

# Select: major```

# Packages: Select all @tuel/* packages
# Summary: "feat!: Production-ready release - security fixes, tests, documentation"

# Apply version changes (will bump to v2.0.0)
pnpm changeset version

# Commit
git add .
git commit -m "chore: align all packages to v2.0.0-alpha.1"
```

---

### Step 4: Create VERSIONING.md (Phase 0 Task 0.2)

Create comprehensive versioning guide:

```bash
cat > VERSIONING.md << 'EOF'
# TUEL Versioning Strategy

## Current Situation
Packages were released as v1.1.2 but have critical security issues.
This violates semantic versioning expectations for v1.x.x (stable).

## Solution: v2.0.0 as First Stable Release
- v1.1.2 → v2.0.0-alpha.1 (current, in development)
- v2.0.0-beta.1 (after Phase 1-3)
- v2.0.0-rc.1 (after Phase 9)
- v2.0.0 (final release, Week 22)

## Semantic Versioning Rules
- v0.x.x = Alpha/Beta (unstable API)
- v1.0.0 = First stable release
- v1.x.x = Backward compatible features
- v2.0.0 = Breaking changes

## Changesets Workflow
See .changeset/config.json for configuration.
All @tuel/* packages version together (linked).

...
EOF

# Commit
git add VERSIONING.md
git commit -m "docs: add versioning strategy guide"
```

---

### Step 5: Validate Environment (Phase 0 Task 0.5)

```bash
# Make validation script executable
chmod +x scripts/validate-phase.sh

# Run validation
./scripts/validate-phase.sh

# Expected output:
# ✓ Dependencies installed
# ✓ TypeScript compilation
# ✓ Linting
# ✓ Build
# ✓ Unit tests
# ⚠️ Test coverage (expected low initially)
# ✓ Security audit
# ✓ XSS vulnerability check (will fail until Phase 1)
# ⚠️ Version consistency (should pass after Step 3)
```

**Note**: Some checks will fail (XSS, coverage). This is expected. They'll pass after Phase 1-2.

---

### Step 6: Update Progress Tracker

```bash
# Mark Phase 0 as complete
node scripts/update-progress.js log "✅ Phase 0 complete - Version strategy finalized, environment validated"

# Update PROGRESS.md manually or via script
# Change Phase 0 status from 🟡 In Progress to ✅ Complete
```

---

### Step 7: Begin Phase 1 - Critical Security Fixes

**Objective**: Fix 9 XSS vulnerabilities and memory leaks

#### Task 1.1: Fix XSS in AnimatedText.tsx

```bash
# Open file
code packages/text-effects/src/components/AnimatedText.tsx

# Search for dangerouslySetInnerHTML (5 instances)
# Replace each with safe React rendering
```

**Example Fix**:

```typescript
// BEFORE (line ~145)
<span dangerouslySetInnerHTML={{ __html: char }} />

// AFTER
<span>{char}</span>

// OR with HTML entity decoding
import { decode } from 'he';
<span>{decode(char)}</span>
```

**After each file**:

```bash
# Run tests
pnpm --filter @tuel/text-effects test

# Commit
git add packages/text-effects/
git commit -m "fix(text-effects): remove XSS vulnerability in AnimatedText"
```

#### Task 1.2: Fix Memory Leaks in Three.js Components

**Files to fix**:

1. `packages/three/src/components/FloatingObjects.tsx`
2. `packages/three/src/components/MorphingShapes.tsx`
3. `packages/three/src/components/ParticleField.tsx`
4. `packages/scroll/src/components/WodniackWorkScroll.tsx`

**Pattern to apply**:

```typescript
useEffect(() => {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Add cleanup
  return () => {
    scene.remove(mesh);
    geometry.dispose();
    material.dispose();
    // Dispose textures if any
    if (material.map) material.map.dispose();
  };
}, [scene]);
```

**After each file**:

```bash
git add [file]
git commit -m "fix(three): add cleanup to prevent memory leak in [ComponentName]"
```

---

### Step 8: Continue Through All Phases

**Follow this pattern for each phase**:

1. **Read phase objectives** in COPILOT_EXECUTION_PLAN.md
2. **Execute tasks** in order listed
3. **Run validation** after each task: `./scripts/validate-phase.sh`
4. **Commit frequently** with descriptive messages
5. **Update PROGRESS.md** as tasks complete
6. **Move to next phase** only after current phase passes validation

---

## 📊 Progress Tracking

Update progress regularly:

```bash
# Log a completed task
node scripts/update-progress.js log "Fixed XSS in AnimatedText.tsx"

# Update task percentage
node scripts/update-progress.js update 1 1 100  # Phase 1, Task 1, 100% complete

# View summary
node scripts/update-progress.js summary
```

---

## 🚨 Error Handling

**If build fails**:

```bash
# Capture error
pnpm build 2>&1 | tee build-error.log

# Analyze and fix
# Attempt up to 3 times
# If still failing, document and continue
```

**If tests fail**:

```bash
# Re-run to check for flakiness
pnpm test

# If consistent failure:
# 1. Fix the test or code
# 2. Document if unfixable
# 3. Continue with other tasks
```

**If stuck >2 hours**:

1. Document the blocker
2. Try alternative approach
3. Skip and return later if possible
4. Request manual intervention if critical

---

## ✅ Phase Completion Criteria

**Phase is complete when**:

- ✅ All tasks marked complete in PROGRESS.md
- ✅ `./scripts/validate-phase.sh` passes
- ✅ No new errors introduced
- ✅ Documentation updated
- ✅ Changes committed and pushed

---

## 🎯 Final Deliverable (Week 22)

**v2.0.0 Production Release**:

- Zero critical security issues
- 80%+ test coverage
- Comprehensive documentation
- Published to npm
- Health score 9.0/10+
- Portfolio-ready showcase

---

## 📞 Status Update Template

Provide updates every 10 tasks:

```
🤖 Copilot Status Update

Phase: [number] - [name]
Progress: [percentage]% ([completed]/[total] tasks)

✅ Completed:
- [Task 1]
- [Task 2]

🔄 In Progress:
- [Current task] ([percentage]% complete)

⏭️ Next:
- [Next task]
- [Following task]

Estimated completion: [timeframe]

Blockers: [None / List blockers]
```

---

## 🚀 Ready to Execute

**Everything is prepared**:

- ✅ 1,500+ line TODO.md with complete task breakdown
- ✅ 800+ line COPILOT_EXECUTION_PLAN.md with detailed instructions
- ✅ Automation scripts (audit-versions.js, validate-phase.sh, update-progress.js)
- ✅ Progress tracking (PROGRESS.md)
- ✅ Documentation index (PROJECT_DOCS_INDEX.md)
- ✅ Version strategy documented (in TODO.md)

**Command to begin**:

```bash
# Start from Step 1 above
cat QUICK_START_COPILOT.md

# Or jump directly to version audit
node scripts/audit-versions.js
```

---

**Let's transform TUEL into a production-ready animation library! 🚀**

**Autonomous agent**: You have full authority to execute all tasks without waiting for approval, except:

1. Publishing to npm (final release)
2. Major architectural changes (e.g., removing packages)
3. Breaking changes to public API

For everything else: proceed with confidence. The documentation is comprehensive. Trust the plan. 💪
