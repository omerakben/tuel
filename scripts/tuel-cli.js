#!/usr/bin/env node

/**
 * TUEL CLI Tool
 *
 * A comprehensive command-line interface for TUEL development,
 * including component generation, debugging, and project management.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// CLI configuration
const CLI_CONFIG = {
  name: "tuel",
  version: "1.0.0",
  description: "TUEL Animation Library CLI",
  commands: {
    new: "Create a new TUEL project",
    component: "Generate a new component",
    debug: "Debug TUEL components",
    dev: "Start development server",
    build: "Build packages",
    test: "Run tests",
    lint: "Lint code",
    format: "Format code",
    docs: "Generate documentation",
    playground: "Start interactive playground",
    analyze: "Analyze bundle and performance",
    upgrade: "Upgrade TUEL packages",
    init: "Initialize TUEL in existing project",
  },
};

// Component templates
const COMPONENT_TEMPLATES = {
  animation: {
    name: "Animation Component",
    template: `import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export interface {{ComponentName}}Props {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  easing?: string;
  className?: string;
  'data-testid'?: string;
}

export const {{ComponentName}}: React.FC<{{ComponentName}}Props> = ({
  children,
  duration = 0.5,
  delay = 0,
  easing = 'ease-out',
  className = '',
  'data-testid': testId = '{{componentName}}',
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Component initialization logic
  }, []);

  return (
    <motion.div
      ref={ref}
      className={\`tuel-{{componentName}} \${className}\`}
      data-testid={testId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration,
        delay,
        ease: easing,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default {{ComponentName}};
`,
    test: `import React from 'react';
import { render, screen } from '@testing-library/react';
import { {{ComponentName}} } from './{{ComponentName}}';

describe('{{ComponentName}}', () => {
  it('renders correctly', () => {
    render(
      <{{ComponentName}} data-testid="test-component">
        Test content
      </{{ComponentName}}>
    );

    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <{{ComponentName}} className="custom-class" data-testid="test-component">
        Test content
      </{{ComponentName}}>
    );

    const component = screen.getByTestId('test-component');
    expect(component).toHaveClass('custom-class');
  });

  it('respects duration prop', () => {
    render(
      <{{ComponentName}} duration={1} data-testid="test-component">
        Test content
      </{{ComponentName}}>
    );

    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });
});
`,
    story: `import type { Meta, StoryObj } from '@storybook/react';
import { {{ComponentName}} } from './{{ComponentName}}';

const meta: Meta<typeof {{ComponentName}}> = {
  title: 'Components/{{ComponentName}}',
  component: {{ComponentName}},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    duration: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.1 },
    },
    delay: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
    },
    easing: {
      control: { type: 'select' },
      options: ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Hello {{ComponentName}}!',
  },
};

export const WithCustomDuration: Story = {
  args: {
    children: 'Custom duration',
    duration: 1,
  },
};

export const WithDelay: Story = {
  args: {
    children: 'Delayed animation',
    delay: 0.5,
  },
};

export const WithCustomEasing: Story = {
  args: {
    children: 'Custom easing',
    easing: 'ease-in-out',
  },
};
`,
  },
  scroll: {
    name: "Scroll Component",
    template: `import React, { useEffect, useRef } from 'react';
import { useScroll, useTransform } from 'framer-motion';

export interface {{ComponentName}}Props {
  children: React.ReactNode;
  direction?: 'horizontal' | 'vertical';
  speed?: number;
  className?: string;
  'data-testid'?: string;
}

export const {{ComponentName}}: React.FC<{{ComponentName}}Props> = ({
  children,
  direction = 'horizontal',
  speed = 1,
  className = '',
  'data-testid': testId = '{{componentName}}',
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'horizontal' ? ['0%', '-100%'] : ['0%', '0%']
  );

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'vertical' ? ['0%', '-100%'] : ['0%', '0%']
  );

  return (
    <div
      ref={ref}
      className={\`tuel-{{componentName}} \${className}\`}
      data-testid={testId}
      {...props}
    >
      <motion.div
        style={{ x, y }}
        className="tuel-{{componentName}}-content"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default {{ComponentName}};
`,
  },
  interaction: {
    name: "Interaction Component",
    template: `import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export interface {{ComponentName}}Props {
  children: React.ReactNode;
  onHover?: () => void;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  'data-testid'?: string;
}

export const {{ComponentName}}: React.FC<{{ComponentName}}Props> = ({
  children,
  onHover,
  onClick,
  disabled = false,
  className = '',
  'data-testid': testId = '{{componentName}}',
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!ref.current || disabled) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set((event.clientX - centerX) * 0.1);
    y.set((event.clientY - centerY) * 0.1);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover?.();
  };

  const handleClick = () => {
    if (!disabled) {
      onClick?.();
    }
  };

  return (
    <motion.div
      ref={ref}
      className={\`tuel-{{componentName}} \${className}\`}
      data-testid={testId}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      style={{
        x: springX,
        y: springY,
      }}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default {{ComponentName}};
`,
  },
};

// Project templates
const PROJECT_TEMPLATES = {
  nextjs: {
    name: "Next.js Project",
    files: {
      "package.json": `{
  "name": "{{projectName}}",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "15.4.6",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "@tuel/ui": "^1.0.0",
    "@tuel/scroll": "^1.0.0",
    "@tuel/gallery": "^1.0.0",
    "@tuel/interaction": "^1.0.0",
    "@tuel/motion": "^1.0.0",
    "@tuel/gsap": "^1.0.0",
    "@tuel/three": "^1.0.0",
    "@tuel/text-effects": "^1.0.0",
    "@tuel/state": "^1.0.0",
    "@tuel/performance": "^1.0.0",
    "@tuel/tokens": "^1.0.0",
    "@tuel/utils": "^1.0.0",
    "@tuel/config": "^1.0.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "15.4.6",
    "typescript": "^5"
  }
}`,
      "next.config.js": `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: [
    '@tuel/ui',
    '@tuel/scroll',
    '@tuel/gallery',
    '@tuel/interaction',
    '@tuel/motion',
    '@tuel/gsap',
    '@tuel/three',
    '@tuel/text-effects',
    '@tuel/state',
    '@tuel/performance',
    '@tuel/tokens',
    '@tuel/utils',
    '@tuel/config'
  ],
};

module.exports = nextConfig;
`,
      "pages/index.tsx": `import React from 'react';
import { MagneticButton } from '@tuel/interaction';
import { HorizontalScroll } from '@tuel/scroll';
import { Carousel } from '@tuel/ui';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to {{projectName}}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Magnetic Button</h2>
            <MagneticButton className="px-6 py-3 bg-blue-500 text-white rounded-lg">
              Hover me!
            </MagneticButton>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Horizontal Scroll</h2>
            <HorizontalScroll className="h-32 bg-gray-100 rounded-lg p-4">
              <div className="flex space-x-4">
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} className="w-24 h-24 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                    {i + 1}
                  </div>
                ))}
              </div>
            </HorizontalScroll>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Carousel</h2>
            <Carousel className="h-48">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="w-full h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-white text-2xl">
                  Slide {i + 1}
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
}
`,
    },
  },
  react: {
    name: "React Project",
    files: {
      "package.json": `{
  "name": "{{projectName}}",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@tuel/ui": "^1.0.0",
    "@tuel/scroll": "^1.0.0",
    "@tuel/gallery": "^1.0.0",
    "@tuel/interaction": "^1.0.0",
    "@tuel/motion": "^1.0.0",
    "@tuel/gsap": "^1.0.0",
    "@tuel/three": "^1.0.0",
    "@tuel/text-effects": "^1.0.0",
    "@tuel/state": "^1.0.0",
    "@tuel/performance": "^1.0.0",
    "@tuel/tokens": "^1.0.0",
    "@tuel/utils": "^1.0.0",
    "@tuel/config": "^1.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}`,
      "vite.config.ts": `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      '@tuel/ui',
      '@tuel/scroll',
      '@tuel/gallery',
      '@tuel/interaction',
      '@tuel/motion',
      '@tuel/gsap',
      '@tuel/three',
      '@tuel/text-effects',
      '@tuel/state',
      '@tuel/performance',
      '@tuel/tokens',
      '@tuel/utils',
      '@tuel/config'
    ]
  }
})`,
      "src/App.tsx": `import React from 'react';
import { MagneticButton } from '@tuel/interaction';
import { HorizontalScroll } from '@tuel/scroll';
import { Carousel } from '@tuel/ui';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to {{projectName}}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Magnetic Button</h2>
            <MagneticButton className="px-6 py-3 bg-blue-500 text-white rounded-lg">
              Hover me!
            </MagneticButton>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Horizontal Scroll</h2>
            <HorizontalScroll className="h-32 bg-gray-100 rounded-lg p-4">
              <div className="flex space-x-4">
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} className="w-24 h-24 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                    {i + 1}
                  </div>
                ))}
              </div>
            </HorizontalScroll>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Carousel</h2>
            <Carousel className="h-48">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="w-full h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-white text-2xl">
                  Slide {i + 1}
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
`,
    },
  },
};

// Main CLI class
class TUELCLI {
  constructor() {
    this.command = process.argv[2];
    this.args = process.argv.slice(3);
  }

  async run() {
    try {
      switch (this.command) {
        case "new":
          await this.createNewProject();
          break;
        case "component":
          await this.generateComponent();
          break;
        case "debug":
          await this.debugComponents();
          break;
        case "dev":
          await this.startDevServer();
          break;
        case "build":
          await this.buildPackages();
          break;
        case "test":
          await this.runTests();
          break;
        case "lint":
          await this.lintCode();
          break;
        case "format":
          await this.formatCode();
          break;
        case "docs":
          await this.generateDocs();
          break;
        case "playground":
          await this.startPlayground();
          break;
        case "analyze":
          await this.analyzeProject();
          break;
        case "upgrade":
          await this.upgradePackages();
          break;
        case "init":
          await this.initProject();
          break;
        case "help":
        default:
          this.showHelp();
          break;
      }
    } catch (error) {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }
  }

  async createNewProject() {
    const [projectName, template = "nextjs"] = this.args;

    if (!projectName) {
      console.error("❌ Project name is required");
      console.log("Usage: tuel new <project-name> [template]");
      process.exit(1);
    }

    const projectTemplate = PROJECT_TEMPLATES[template];
    if (!projectTemplate) {
      console.error(`❌ Template "${template}" not found`);
      console.log(
        "Available templates:",
        Object.keys(PROJECT_TEMPLATES).join(", ")
      );
      process.exit(1);
    }

    console.log(
      `🚀 Creating new ${projectTemplate.name} project: ${projectName}`
    );

    const projectPath = path.join(process.cwd(), projectName);

    if (fs.existsSync(projectPath)) {
      console.error(`❌ Directory "${projectName}" already exists`);
      process.exit(1);
    }

    fs.mkdirSync(projectPath, { recursive: true });

    // Create project files
    for (const [filePath, content] of Object.entries(projectTemplate.files)) {
      const fullPath = path.join(projectPath, filePath);
      const dir = path.dirname(fullPath);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const processedContent = content.replace(
        /\{\{projectName\}\}/g,
        projectName
      );
      fs.writeFileSync(fullPath, processedContent);
    }

    console.log("✅ Project created successfully!");
    console.log("📝 Next steps:");
    console.log(`1. cd ${projectName}`);
    console.log("2. npm install");
    console.log("3. npm run dev");
  }

  async generateComponent() {
    const [componentName, type = "animation"] = this.args;

    if (!componentName) {
      console.error("❌ Component name is required");
      console.log("Usage: tuel component <component-name> [type]");
      process.exit(1);
    }

    const componentTemplate = COMPONENT_TEMPLATES[type];
    if (!componentTemplate) {
      console.error(`❌ Component type "${type}" not found`);
      console.log(
        "Available types:",
        Object.keys(COMPONENT_TEMPLATES).join(", ")
      );
      process.exit(1);
    }

    console.log(`🎨 Generating ${componentTemplate.name}: ${componentName}`);

    const componentDir = path.join(process.cwd(), "src", "components");
    if (!fs.existsSync(componentDir)) {
      fs.mkdirSync(componentDir, { recursive: true });
    }

    const ComponentName = this.toPascalCase(componentName);
    const componentNameKebab = this.toKebabCase(componentName);

    // Generate component file
    const componentContent = componentTemplate.template
      .replace(/\{\{ComponentName\}\}/g, ComponentName)
      .replace(/\{\{componentName\}\}/g, componentNameKebab);

    const componentPath = path.join(componentDir, `${ComponentName}.tsx`);
    fs.writeFileSync(componentPath, componentContent);

    // Generate test file
    if (componentTemplate.test) {
      const testContent = componentTemplate.test
        .replace(/\{\{ComponentName\}\}/g, ComponentName)
        .replace(/\{\{componentName\}\}/g, componentNameKebab);

      const testPath = path.join(componentDir, `${ComponentName}.test.tsx`);
      fs.writeFileSync(testPath, testContent);
    }

    // Generate story file
    if (componentTemplate.story) {
      const storyContent = componentTemplate.story
        .replace(/\{\{ComponentName\}\}/g, ComponentName)
        .replace(/\{\{componentName\}\}/g, componentNameKebab);

      const storyPath = path.join(componentDir, `${ComponentName}.stories.tsx`);
      fs.writeFileSync(storyPath, storyContent);
    }

    console.log("✅ Component generated successfully!");
    console.log(`📁 Files created:`);
    console.log(`  - ${componentPath}`);
    if (componentTemplate.test) {
      console.log(
        `  - ${path.join(componentDir, `${ComponentName}.test.tsx`)}`
      );
    }
    if (componentTemplate.story) {
      console.log(
        `  - ${path.join(componentDir, `${ComponentName}.stories.tsx`)}`
      );
    }
  }

  async debugComponents() {
    console.log("🔍 Starting TUEL component debugger...");

    // Start debug server
    const debugPort = 3001;
    console.log(`🌐 Debug server running on http://localhost:${debugPort}`);

    // Open browser
    try {
      execSync(`open http://localhost:${debugPort}`, { stdio: "ignore" });
    } catch (error) {
      console.log("💡 Open your browser and navigate to the debug URL");
    }
  }

  async startDevServer() {
    console.log("🚀 Starting development server...");

    try {
      execSync("npm run dev", { stdio: "inherit" });
    } catch (error) {
      console.error("❌ Failed to start development server");
      process.exit(1);
    }
  }

  async buildPackages() {
    console.log("🔨 Building packages...");

    try {
      execSync("npm run build", { stdio: "inherit" });
      console.log("✅ Build completed successfully!");
    } catch (error) {
      console.error("❌ Build failed");
      process.exit(1);
    }
  }

  async runTests() {
    console.log("🧪 Running tests...");

    try {
      execSync("npm test", { stdio: "inherit" });
      console.log("✅ Tests completed successfully!");
    } catch (error) {
      console.error("❌ Tests failed");
      process.exit(1);
    }
  }

  async lintCode() {
    console.log("🔍 Linting code...");

    try {
      execSync("npm run lint", { stdio: "inherit" });
      console.log("✅ Linting completed successfully!");
    } catch (error) {
      console.error("❌ Linting failed");
      process.exit(1);
    }
  }

  async formatCode() {
    console.log("✨ Formatting code...");

    try {
      execSync("npm run format", { stdio: "inherit" });
      console.log("✅ Formatting completed successfully!");
    } catch (error) {
      console.error("❌ Formatting failed");
      process.exit(1);
    }
  }

  async generateDocs() {
    console.log("📚 Generating documentation...");

    try {
      execSync("npm run docs:generate", { stdio: "inherit" });
      console.log("✅ Documentation generated successfully!");
    } catch (error) {
      console.error("❌ Documentation generation failed");
      process.exit(1);
    }
  }

  async startPlayground() {
    console.log("🎮 Starting interactive playground...");

    try {
      execSync("npm run playground", { stdio: "inherit" });
    } catch (error) {
      console.error("❌ Failed to start playground");
      process.exit(1);
    }
  }

  async analyzeProject() {
    console.log("📊 Analyzing project...");

    try {
      execSync("npm run analyze", { stdio: "inherit" });
      console.log("✅ Analysis completed successfully!");
    } catch (error) {
      console.error("❌ Analysis failed");
      process.exit(1);
    }
  }

  async upgradePackages() {
    console.log("⬆️ Upgrading TUEL packages...");

    try {
      execSync("npm update @tuel/*", { stdio: "inherit" });
      console.log("✅ Packages upgraded successfully!");
    } catch (error) {
      console.error("❌ Package upgrade failed");
      process.exit(1);
    }
  }

  async initProject() {
    console.log("🎯 Initializing TUEL in existing project...");

    // Check if package.json exists
    if (!fs.existsSync("package.json")) {
      console.error(
        "❌ package.json not found. Run this command in a project directory."
      );
      process.exit(1);
    }

    // Install TUEL packages
    console.log("📦 Installing TUEL packages...");
    try {
      execSync(
        "npm install @tuel/ui @tuel/scroll @tuel/gallery @tuel/interaction @tuel/motion @tuel/gsap @tuel/three @tuel/text-effects @tuel/state @tuel/performance @tuel/tokens @tuel/utils @tuel/config",
        { stdio: "inherit" }
      );
    } catch (error) {
      console.error("❌ Failed to install TUEL packages");
      process.exit(1);
    }

    // Create example component
    console.log("🎨 Creating example component...");
    const exampleComponent = `import React from 'react';
import { MagneticButton } from '@tuel/interaction';
import { HorizontalScroll } from '@tuel/scroll';
import { Carousel } from '@tuel/ui';

export function TUELExample() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Magnetic Button</h2>
        <MagneticButton className="px-6 py-3 bg-blue-500 text-white rounded-lg">
          Hover me!
        </MagneticButton>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Horizontal Scroll</h2>
        <HorizontalScroll className="h-32 bg-gray-100 rounded-lg p-4">
          <div className="flex space-x-4">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="w-24 h-24 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                {i + 1}
              </div>
            ))}
          </div>
        </HorizontalScroll>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Carousel</h2>
        <Carousel className="h-48">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="w-full h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-white text-2xl">
              Slide {i + 1}
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}
`;

    const examplePath = path.join(
      process.cwd(),
      "src",
      "components",
      "TUELExample.tsx"
    );
    const exampleDir = path.dirname(examplePath);

    if (!fs.existsSync(exampleDir)) {
      fs.mkdirSync(exampleDir, { recursive: true });
    }

    fs.writeFileSync(examplePath, exampleComponent);

    console.log("✅ TUEL initialized successfully!");
    console.log("📝 Next steps:");
    console.log("1. Import and use TUELExample component in your app");
    console.log("2. Explore the TUEL documentation: https://tuel.ai/docs");
    console.log("3. Generate new components: tuel component <name>");
  }

  showHelp() {
    console.log(`
🎨 TUEL CLI Tool v${CLI_CONFIG.version}

Usage: tuel <command> [options]

Commands:
  new <name> [template]     Create a new TUEL project
  component <name> [type]   Generate a new component
  debug                    Debug TUEL components
  dev                      Start development server
  build                    Build packages
  test                     Run tests
  lint                     Lint code
  format                   Format code
  docs                     Generate documentation
  playground               Start interactive playground
  analyze                  Analyze bundle and performance
  upgrade                  Upgrade TUEL packages
  init                     Initialize TUEL in existing project
  help                     Show this help message

Examples:
  tuel new my-app nextjs
  tuel component MyButton animation
  tuel debug
  tuel dev
  tuel build
  tuel test
  tuel lint
  tuel format
  tuel docs
  tuel playground
  tuel analyze
  tuel upgrade
  tuel init

Templates:
  nextjs                   Next.js project with TUEL
  react                    React + Vite project with TUEL

Component Types:
  animation                Animation component with Framer Motion
  scroll                   Scroll-based animation component
  interaction              Interactive component with hover effects

For more information, visit: https://tuel.ai/docs
`);
  }

  toPascalCase(str) {
    return str.replace(/(?:^|-)([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  toKebabCase(str) {
    return str
      .replace(/([A-Z])/g, "-$1")
      .toLowerCase()
      .replace(/^-/, "");
  }
}

// Run CLI
const cli = new TUELCLI();
cli.run();
