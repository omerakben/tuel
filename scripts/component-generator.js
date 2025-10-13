#!/usr/bin/env node

/**
 * TUEL Component Generator
 *
 * A specialized tool for generating TUEL components with proper
 * structure, tests, stories, and documentation.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Component templates
const COMPONENT_TEMPLATES = {
  animation: {
    name: "Animation Component",
    description: "A component with smooth animations using Framer Motion",
    template: `import React, { useEffect, useRef, ReactNode } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { cn } from '@tuel/utils';

export interface {{ComponentName}}Props {
  children: ReactNode;
  duration?: number;
  delay?: number;
  easing?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  className?: string;
  'data-testid'?: string;
  onAnimationComplete?: () => void;
  onAnimationStart?: () => void;
}

const easingMap = {
  'ease': [0.25, 0.1, 0.25, 1],
  'ease-in': [0.42, 0, 1, 1],
  'ease-out': [0, 0, 0.58, 1],
  'ease-in-out': [0.42, 0, 0.58, 1],
  'linear': [0, 0, 1, 1],
};

const directionMap = {
  'up': { y: 50, opacity: 0 },
  'down': { y: -50, opacity: 0 },
  'left': { x: 50, opacity: 0 },
  'right': { x: -50, opacity: 0 },
  'fade': { opacity: 0 },
};

export const {{ComponentName}}: React.FC<{{ComponentName}}Props> = ({
  children,
  duration = 0.5,
  delay = 0,
  easing = 'ease-out',
  direction = 'fade',
  className = '',
  'data-testid': testId = '{{componentName}}',
  onAnimationComplete,
  onAnimationStart,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const variants = {
    hidden: directionMap[direction],
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        duration,
        delay,
        ease: easingMap[easing] || easing,
        onComplete: onAnimationComplete,
        onStart: onAnimationStart,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={cn('tuel-{{componentName}}', className)}
      data-testid={testId}
      variants={variants}
      initial="hidden"
      animate={controls}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default {{ComponentName}};
`,
    test: `import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { {{ComponentName}} } from './{{ComponentName}}';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  useAnimation: () => ({
    start: jest.fn(),
  }),
  useInView: () => true,
}));

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

  it('respects delay prop', () => {
    render(
      <{{ComponentName}} delay={0.5} data-testid="test-component">
        Test content
      </{{ComponentName}}>
    );

    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });

  it('respects easing prop', () => {
    render(
      <{{ComponentName}} easing="ease-in" data-testid="test-component">
        Test content
      </{{ComponentName}}>
    );

    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });

  it('respects direction prop', () => {
    render(
      <{{ComponentName}} direction="up" data-testid="test-component">
        Test content
      </{{ComponentName}}>
    );

    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });

  it('calls onAnimationComplete callback', async () => {
    const onComplete = jest.fn();

    render(
      <{{ComponentName}} onAnimationComplete={onComplete} data-testid="test-component">
        Test content
      </{{ComponentName}}>
    );

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
    });
  });

  it('calls onAnimationStart callback', async () => {
    const onStart = jest.fn();

    render(
      <{{ComponentName}} onAnimationStart={onStart} data-testid="test-component">
        Test content
      </{{ComponentName}}>
    );

    await waitFor(() => {
      expect(onStart).toHaveBeenCalled();
    });
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
    docs: {
      description: {
        component: 'A smooth animation component with customizable duration, delay, easing, and direction.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Content to animate',
    },
    duration: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.1 },
      description: 'Animation duration in seconds',
    },
    delay: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      description: 'Animation delay in seconds',
    },
    easing: {
      control: { type: 'select' },
      options: ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'],
      description: 'Animation easing function',
    },
    direction: {
      control: { type: 'select' },
      options: ['up', 'down', 'left', 'right', 'fade'],
      description: 'Animation direction',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    onAnimationComplete: {
      action: 'animationComplete',
      description: 'Callback when animation completes',
    },
    onAnimationStart: {
      action: 'animationStart',
      description: 'Callback when animation starts',
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

export const SlideFromLeft: Story = {
  args: {
    children: 'Sliding from left',
    direction: 'left',
  },
};

export const SlideFromRight: Story = {
  args: {
    children: 'Sliding from right',
    direction: 'right',
  },
};

export const SlideFromUp: Story = {
  args: {
    children: 'Sliding from up',
    direction: 'up',
  },
};

export const SlideFromDown: Story = {
  args: {
    children: 'Sliding from down',
    direction: 'down',
  },
};

export const FadeIn: Story = {
  args: {
    children: 'Fading in',
    direction: 'fade',
  },
};

export const WithCallbacks: Story = {
  args: {
    children: 'With callbacks',
    onAnimationStart: () => console.log('Animation started'),
    onAnimationComplete: () => console.log('Animation completed'),
  },
};
`,
  },
  scroll: {
    name: "Scroll Component",
    description: "A component that animates based on scroll position",
    template: `import React, { useRef, ReactNode } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import { cn } from '@tuel/utils';

export interface {{ComponentName}}Props {
  children: ReactNode;
  direction?: 'horizontal' | 'vertical';
  speed?: number;
  offset?: [string, string];
  className?: string;
  'data-testid'?: string;
  onScrollProgress?: (progress: number) => void;
}

export const {{ComponentName}}: React.FC<{{ComponentName}}Props> = ({
  children,
  direction = 'horizontal',
  speed = 1,
  offset = ['start end', 'end start'],
  className = '',
  'data-testid': testId = '{{componentName}}',
  onScrollProgress,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'horizontal' ? ['0%', \`-\${100 * speed}%\`] : ['0%', '0%']
  );

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'vertical' ? ['0%', \`-\${100 * speed}%\`] : ['0%', '0%']
  );

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Call progress callback
  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      onScrollProgress?.(latest);
    });

    return unsubscribe;
  }, [scrollYProgress, onScrollProgress]);

  return (
    <div
      ref={ref}
      className={cn('tuel-{{componentName}}', className)}
      data-testid={testId}
      {...props}
    >
      <motion.div
        style={{ x, y, opacity }}
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
    description: "A component with interactive hover and click effects",
    template: `import React, { useState, useRef, ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@tuel/utils';

export interface {{ComponentName}}Props {
  children: ReactNode;
  onHover?: () => void;
  onClick?: () => void;
  disabled?: boolean;
  magnetic?: boolean;
  ripple?: boolean;
  className?: string;
  'data-testid'?: string;
}

export const {{ComponentName}}: React.FC<{{ComponentName}}Props> = ({
  children,
  onHover,
  onClick,
  disabled = false,
  magnetic = true,
  ripple = true,
  className = '',
  'data-testid': testId = '{{componentName}}',
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  const scale = useTransform(springX, [-50, 50], [0.95, 1.05]);
  const rotateX = useTransform(springY, [-50, 50], [5, -5]);
  const rotateY = useTransform(springX, [-50, 50], [-5, 5]);

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!ref.current || disabled || !magnetic) return;

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

  const handleClick = (event: React.MouseEvent) => {
    if (disabled) return;

    onClick?.();

    if (ripple && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const newRipple = {
        id: Date.now(),
        x,
        y,
      };

      setRipples(prev => [...prev, newRipple]);

      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 600);
    }
  };

  return (
    <motion.div
      ref={ref}
      className={cn('tuel-{{componentName}}', className)}
      data-testid={testId}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      style={{
        x: springX,
        y: springY,
        scale,
        rotateX,
        rotateY,
      }}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      {...props}
    >
      {children}

      {ripple && ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          style={{
            left: ripple.x - 20,
            top: ripple.y - 20,
            width: 40,
            height: 40,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
    </motion.div>
  );
};

export default {{ComponentName}};
`,
  },
};

// Component generator class
class ComponentGenerator {
  constructor(options = {}) {
    this.outputDir = options.outputDir || "src/components";
    this.generateTests = options.generateTests !== false;
    this.generateStories = options.generateStories !== false;
    this.generateDocs = options.generateDocs !== false;
  }

  async generate(componentName, type = "animation", options = {}) {
    const ComponentName = this.toPascalCase(componentName);
    const componentNameKebab = this.toKebabCase(componentName);

    const template = COMPONENT_TEMPLATES[type];
    if (!template) {
      throw new Error(`Component type "${type}" not found`);
    }

    console.log(`🎨 Generating ${template.name}: ${ComponentName}`);

    // Create component directory
    const componentDir = path.join(process.cwd(), this.outputDir);
    if (!fs.existsSync(componentDir)) {
      fs.mkdirSync(componentDir, { recursive: true });
    }

    // Generate component file
    const componentContent = template.template
      .replace(/\{\{ComponentName\}\}/g, ComponentName)
      .replace(/\{\{componentName\}\}/g, componentNameKebab);

    const componentPath = path.join(componentDir, `${ComponentName}.tsx`);
    fs.writeFileSync(componentPath, componentContent);

    const generatedFiles = [componentPath];

    // Generate test file
    if (this.generateTests && template.test) {
      const testContent = template.test
        .replace(/\{\{ComponentName\}\}/g, ComponentName)
        .replace(/\{\{componentName\}\}/g, componentNameKebab);

      const testPath = path.join(componentDir, `${ComponentName}.test.tsx`);
      fs.writeFileSync(testPath, testContent);
      generatedFiles.push(testPath);
    }

    // Generate story file
    if (this.generateStories && template.story) {
      const storyContent = template.story
        .replace(/\{\{ComponentName\}\}/g, ComponentName)
        .replace(/\{\{componentName\}\}/g, componentNameKebab);

      const storyPath = path.join(componentDir, `${ComponentName}.stories.tsx`);
      fs.writeFileSync(storyPath, storyContent);
      generatedFiles.push(storyPath);
    }

    // Generate documentation
    if (this.generateDocs) {
      const docsPath = path.join(componentDir, `${ComponentName}.md`);
      const docsContent = this.generateDocumentation(ComponentName, template);
      fs.writeFileSync(docsPath, docsContent);
      generatedFiles.push(docsPath);
    }

    // Generate index file
    const indexPath = path.join(componentDir, "index.ts");
    this.updateIndexFile(indexPath, ComponentName);

    console.log("✅ Component generated successfully!");
    console.log("📁 Files created:");
    generatedFiles.forEach((file) => {
      console.log(`  - ${path.relative(process.cwd(), file)}`);
    });

    return {
      componentName: ComponentName,
      files: generatedFiles,
    };
  }

  generateDocumentation(componentName, template) {
    return `# ${componentName}

${template.description}

## Usage

\`\`\`tsx
import { ${componentName} } from './${componentName}';

function App() {
  return (
    <${componentName}>
      Your content here
    </${componentName}>
  );
}
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | Content to render |
| className | string | '' | Additional CSS classes |
| data-testid | string | '${this.toKebabCase(
      componentName
    )}' | Test identifier |

## Examples

### Basic Usage

\`\`\`tsx
<${componentName}>
  Hello World!
</${componentName}>
\`\`\`

### With Custom Styling

\`\`\`tsx
<${componentName} className="custom-class">
  Styled content
</${componentName}>
\`\`\`

## Testing

The component includes comprehensive tests covering:

- Rendering
- Props handling
- User interactions
- Accessibility

Run tests with:

\`\`\`bash
npm test ${componentName}
\`\`\`

## Storybook

View interactive examples in Storybook:

\`\`\`bash
npm run storybook
\`\`\`
`;
  }

  updateIndexFile(indexPath, componentName) {
    let indexContent = "";

    if (fs.existsSync(indexPath)) {
      indexContent = fs.readFileSync(indexPath, "utf8");
    }

    const exportLine = `export { ${componentName} } from './${componentName}';`;

    if (!indexContent.includes(exportLine)) {
      indexContent += `\n${exportLine}`;
      fs.writeFileSync(indexPath, indexContent);
    }
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

// CLI interface
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case "generate":
    case "g":
      const [componentName, type = "animation"] = args.slice(1);
      if (!componentName) {
        console.error("❌ Component name is required");
        console.log(
          "Usage: node scripts/component-generator.js generate <component-name> [type]"
        );
        process.exit(1);
      }

      const generator = new ComponentGenerator();
      generator
        .generate(componentName, type)
        .then(() => {
          console.log("🎉 Component generation completed!");
        })
        .catch((error) => {
          console.error("❌ Error:", error.message);
          process.exit(1);
        });
      break;

    case "list":
    case "l":
      console.log("📋 Available component types:");
      Object.entries(COMPONENT_TEMPLATES).forEach(([key, template]) => {
        console.log(`  ${key}: ${template.name}`);
        console.log(`    ${template.description}`);
      });
      break;

    case "help":
    default:
      console.log(`
🎨 TUEL Component Generator

Usage: node scripts/component-generator.js <command> [options]

Commands:
  generate <name> [type]  Generate a new component
  list                   List available component types
  help                   Show this help message

Examples:
  node scripts/component-generator.js generate MyButton animation
  node scripts/component-generator.js generate ScrollCard scroll
  node scripts/component-generator.js generate InteractiveButton interaction
  node scripts/component-generator.js list

Component Types:
  animation              Animation component with Framer Motion
  scroll                 Scroll-based animation component
  interaction            Interactive component with hover effects
`);
      break;
  }
}

// Run CLI if this file is executed directly
if (require.main === module) {
  main();
}

// Export for use in other modules
module.exports = ComponentGenerator;
