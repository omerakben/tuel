import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { parse } from '@typescript-eslint/typescript-estree';
import { generate } from '@typescript-eslint/typescript-estree';

interface ComponentDoc {
  name: string;
  description: string;
  props: PropDoc[];
  examples: ExampleDoc[];
  category: string;
  package: string;
  filePath: string;
}

interface PropDoc {
  name: string;
  type: string;
  description: string;
  required: boolean;
  defaultValue?: any;
  examples: string[];
}

interface ExampleDoc {
  title: string;
  description: string;
  code: string;
  preview?: string;
}

class APIDocumentationGenerator {
  private packagesDir: string;
  private outputDir: string;
  private components: ComponentDoc[] = [];

  constructor(packagesDir: string, outputDir: string) {
    this.packagesDir = packagesDir;
    this.outputDir = outputDir;
  }

  async generateDocumentation(): Promise<void> {
    console.log('📚 Generating API Documentation...');

    // Scan all packages for components
    await this.scanPackages();

    // Generate documentation for each component
    await this.generateComponentDocs();

    // Generate index file
    await this.generateIndex();

    // Generate search index
    await this.generateSearchIndex();

    console.log('✅ API Documentation generated successfully!');
  }

  private async scanPackages(): Promise<void> {
    const packages = readdirSync(this.packagesDir);

    for (const pkg of packages) {
      const pkgPath = join(this.packagesDir, pkg);
      const srcPath = join(pkgPath, 'src');

      if (existsSync(srcPath)) {
        await this.scanPackage(pkg, srcPath);
      }
    }
  }

  private async scanPackage(packageName: string, srcPath: string): Promise<void> {
    const files = this.getTypeScriptFiles(srcPath);

    for (const file of files) {
      try {
        const content = readFileSync(file, 'utf8');
        const ast = parse(content, {
          loc: true,
          range: true,
          tokens: true,
          comment: true,
          jsx: true
        });

        await this.extractComponentFromAST(packageName, file, ast);
      } catch (error) {
        console.warn(`Failed to parse ${file}:`, error);
      }
    }
  }

  private getTypeScriptFiles(dir: string): string[] {
    const files: string[] = [];
    const items = readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = join(dir, item.name);

      if (item.isDirectory()) {
        files.push(...this.getTypeScriptFiles(fullPath));
      } else if (item.isFile() && (item.name.endsWith('.tsx') || item.name.endsWith('.ts'))) {
        files.push(fullPath);
      }
    }

    return files;
  }

  private async extractComponentFromAST(packageName: string, filePath: string, ast: any): Promise<void> {
    // Extract component information from AST
    const components = this.findComponents(ast);

    for (const component of components) {
      const doc: ComponentDoc = {
        name: component.name,
        description: this.extractDescription(component),
        props: this.extractProps(component),
        examples: this.extractExamples(component),
        category: this.getCategory(packageName),
        package: packageName,
        filePath: filePath.replace(this.packagesDir, '')
      };

      this.components.push(doc);
    }
  }

  private findComponents(ast: any): any[] {
    const components: any[] = [];

    const traverse = (node: any) => {
      if (node.type === 'ExportNamedDeclaration' || node.type === 'ExportDefaultDeclaration') {
        const declaration = node.declaration;

        if (declaration?.type === 'FunctionDeclaration' || declaration?.type === 'VariableDeclaration') {
          const name = declaration.id?.name || declaration.declarations?.[0]?.id?.name;

          if (name && this.isComponentName(name)) {
            components.push({
              name,
              node: declaration,
              comments: node.comments || []
            });
          }
        }
      }

      if (node.body) {
        node.body.forEach(traverse);
      }

      if (node.declarations) {
        node.declarations.forEach(traverse);
      }
    };

    traverse(ast);
    return components;
  }

  private isComponentName(name: string): boolean {
    // Check if it's a React component (starts with uppercase)
    return /^[A-Z]/.test(name) && (
      name.includes('Component') ||
      name.includes('Button') ||
      name.includes('Text') ||
      name.includes('Scroll') ||
      name.includes('Gallery') ||
      name.includes('Canvas') ||
      name.includes('Shape') ||
      name.includes('Object') ||
      name.includes('Carousel') ||
      name.includes('Modal') ||
      name.includes('Tooltip')
    );
  }

  private extractDescription(component: any): string {
    // Extract JSDoc comments
    const comments = component.comments || [];

    for (const comment of comments) {
      if (comment.type === 'Block' && comment.value.includes('*')) {
        const lines = comment.value.split('\n');
        const description = lines
          .map(line => line.replace(/^\s*\*\s?/, '').trim())
          .filter(line => line && !line.startsWith('@'))
          .join(' ');

        if (description) {
          return description;
        }
      }
    }

    return `Interactive ${component.name} component`;
  }

  private extractProps(component: any): PropDoc[] {
    const props: PropDoc[] = [];

    // Look for interface or type definitions
    const traverse = (node: any) => {
      if (node.type === 'TSInterfaceDeclaration' || node.type === 'TSTypeAliasDeclaration') {
        if (node.id?.name === `${component.name}Props` || node.id?.name === `${component.name}Interface`) {
          this.extractPropsFromInterface(node, props);
        }
      }

      if (node.body) {
        node.body.forEach(traverse);
      }
    };

    traverse(component.node);
    return props;
  }

  private extractPropsFromInterface(node: any, props: PropDoc[]): void {
    if (node.body?.properties) {
      for (const prop of node.body.properties) {
        const propDoc: PropDoc = {
          name: prop.key?.name || prop.key?.value,
          type: this.extractTypeString(prop.typeAnnotation?.typeAnnotation),
          description: this.extractPropDescription(prop),
          required: !prop.optional,
          examples: this.generatePropExamples(prop)
        };

        props.push(propDoc);
      }
    }
  }

  private extractTypeString(typeNode: any): string {
    if (!typeNode) return 'any';

    switch (typeNode.type) {
      case 'TSStringKeyword':
        return 'string';
      case 'TSNumberKeyword':
        return 'number';
      case 'TSBooleanKeyword':
        return 'boolean';
      case 'TSArrayType':
        return `${this.extractTypeString(typeNode.elementType)}[]`;
      case 'TSUnionType':
        return typeNode.types.map((t: any) => this.extractTypeString(t)).join(' | ');
      case 'TSTypeReference':
        return typeNode.typeName?.name || 'any';
      case 'TSLiteralType':
        return JSON.stringify(typeNode.literal?.value);
      default:
        return 'any';
    }
  }

  private extractPropDescription(prop: any): string {
    // Look for JSDoc comments
    const comments = prop.comments || [];

    for (const comment of comments) {
      if (comment.type === 'Block' && comment.value.includes('*')) {
        const lines = comment.value.split('\n');
        const description = lines
          .map(line => line.replace(/^\s*\*\s?/, '').trim())
          .filter(line => line && !line.startsWith('@'))
          .join(' ');

        if (description) {
          return description;
        }
      }
    }

    return `The ${prop.key?.name || prop.key?.value} property`;
  }

  private generatePropExamples(prop: any): string[] {
    const examples: string[] = [];
    const type = this.extractTypeString(prop.typeAnnotation?.typeAnnotation);

    switch (type) {
      case 'string':
        examples.push('"Hello World"', '"example"', '""');
        break;
      case 'number':
        examples.push('100', '0', '1.5');
        break;
      case 'boolean':
        examples.push('true', 'false');
        break;
      case 'string[]':
        examples.push('["item1", "item2"]', '[]');
        break;
      case 'number[]':
        examples.push('[1, 2, 3]', '[]');
        break;
      default:
        examples.push('{}', 'null', 'undefined');
    }

    return examples;
  }

  private extractExamples(component: any): ExampleDoc[] {
    // Look for example comments or generate basic examples
    const examples: ExampleDoc[] = [];

    // Basic usage example
    examples.push({
      title: 'Basic Usage',
      description: `Basic example of using ${component.name}`,
      code: this.generateBasicExample(component)
    });

    // Advanced example
    examples.push({
      title: 'Advanced Usage',
      description: `Advanced example with custom props`,
      code: this.generateAdvancedExample(component)
    });

    return examples;
  }

  private generateBasicExample(component: any): string {
    return `import { ${component.name} } from "@tuel/${this.getPackageName(component)}";

export function My${component.name}() {
  return (
    <${component.name}>
      {/* Your content here */}
    </${component.name}>
  );
}`;
  }

  private generateAdvancedExample(component: any): string {
    const props = this.extractProps(component);
    const propString = props
      .slice(0, 3) // Limit to first 3 props
      .map(prop => `      ${prop.name}={${prop.examples[0]}}`)
      .join('\n');

    return `import { ${component.name} } from "@tuel/${this.getPackageName(component)}";

export function My${component.name}() {
  return (
    <${component.name}
${propString}
    >
      {/* Your content here */}
    </${component.name}>
  );
}`;
  }

  private getCategory(packageName: string): string {
    const categories: Record<string, string> = {
      'scroll': 'Scroll Effects',
      'gallery': 'Image Galleries',
      'text-effects': 'Text Effects',
      'three': '3D Components',
      'ui': 'UI Components',
      'interaction': 'Interactions',
      'performance': 'Performance',
      'motion': 'Motion',
      'state': 'State Management',
      'tokens': 'Design Tokens',
      'config': 'Configuration',
      'utils': 'Utilities',
      'gsap': 'GSAP Integration'
    };

    return categories[packageName] || 'Other';
  }

  private getPackageName(component: any): string {
    return component.package || 'utils';
  }

  private async generateComponentDocs(): Promise<void> {
    for (const component of this.components) {
      const docContent = this.generateComponentDocContent(component);
      const outputPath = join(this.outputDir, 'components', `${component.name.toLowerCase()}.md`);

      // Ensure directory exists
      const dir = dirname(outputPath);
      if (!existsSync(dir)) {
        require('fs').mkdirSync(dir, { recursive: true });
      }

      writeFileSync(outputPath, docContent);
    }
  }

  private generateComponentDocContent(component: ComponentDoc): string {
    return `# ${component.name}

${component.description}

## Package

\`@tuel/${component.package}\`

## Props

${component.props.map(prop => this.generatePropDoc(prop)).join('\n\n')}

## Examples

${component.examples.map(example => this.generateExampleDoc(example)).join('\n\n')}

## API Reference

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
${component.props.map(prop =>
  `| \`${prop.name}\` | \`${prop.type}\` | ${prop.required ? 'Yes' : 'No'} | ${prop.defaultValue || '-'} | ${prop.description} |`
).join('\n')}

## Related Components

${this.generateRelatedComponents(component)}

---
*Generated by TUEL API Documentation Generator*
`;
  }

  private generatePropDoc(prop: PropDoc): string {
    return `### ${prop.name}

**Type:** \`${prop.type}\`
**Required:** ${prop.required ? 'Yes' : 'No'}
${prop.defaultValue ? `**Default:** \`${prop.defaultValue}\`` : ''}

${prop.description}

**Examples:**
${prop.examples.map(ex => `- \`${ex}\``).join('\n')}`;
  }

  private generateExampleDoc(example: ExampleDoc): string {
    return `### ${example.title}

${example.description}

\`\`\`tsx
${example.code}
\`\`\``;
  }

  private generateRelatedComponents(component: ComponentDoc): string {
    const related = this.components
      .filter(c => c.package === component.package && c.name !== component.name)
      .slice(0, 3);

    if (related.length === 0) return 'No related components found.';

    return related.map(c => `- [${c.name}](./${c.name.toLowerCase()}.md)`).join('\n');
  }

  private async generateIndex(): Promise<void> {
    const indexContent = `# TUEL API Documentation

Welcome to the TUEL Animation Library API documentation. This comprehensive guide covers all components, their props, and usage examples.

## Components by Category

${this.generateCategoryIndex()}

## Quick Start

\`\`\`bash
npm install @tuel/scroll @tuel/gallery @tuel/ui
\`\`\`

\`\`\`tsx
import { AnimatedText } from "@tuel/text-effects";
import { MagneticButton } from "@tuel/interaction";
import { Carousel } from "@tuel/ui";

export function MyApp() {
  return (
    <div>
      <AnimatedText text="Hello World" variant="fade" />
      <MagneticButton>Click Me</MagneticButton>
      <Carousel slides={slides} />
    </div>
  );
}
\`\`\`

## Packages

${this.generatePackageIndex()}

---
*Generated on ${new Date().toISOString()}*
`;

    writeFileSync(join(this.outputDir, 'README.md'), indexContent);
  }

  private generateCategoryIndex(): string {
    const categories = Array.from(new Set(this.components.map(c => c.category)));

    return categories.map(category => {
      const categoryComponents = this.components.filter(c => c.category === category);

      return `### ${category}

${categoryComponents.map(component =>
  `- [${component.name}](./components/${component.name.toLowerCase()}.md) - ${component.description}`
).join('\n')}`;
    }).join('\n\n');
  }

  private generatePackageIndex(): string {
    const packages = Array.from(new Set(this.components.map(c => c.package)));

    return packages.map(pkg => {
      const packageComponents = this.components.filter(c => c.package === pkg);

      return `### @tuel/${pkg}

${packageComponents.map(component =>
  `- [${component.name}](./components/${component.name.toLowerCase()}.md)`
).join('\n')}`;
    }).join('\n\n');
  }

  private async generateSearchIndex(): Promise<void> {
    const searchIndex = {
      components: this.components.map(component => ({
        name: component.name,
        description: component.description,
        category: component.category,
        package: component.package,
        props: component.props.map(prop => prop.name),
        keywords: this.generateKeywords(component)
      }))
    };

    writeFileSync(join(this.outputDir, 'search-index.json'), JSON.stringify(searchIndex, null, 2));
  }

  private generateKeywords(component: ComponentDoc): string[] {
    const keywords = [component.name.toLowerCase()];

    // Add category keywords
    keywords.push(component.category.toLowerCase());

    // Add prop keywords
    component.props.forEach(prop => {
      keywords.push(prop.name.toLowerCase());
    });

    // Add package keywords
    keywords.push(component.package.toLowerCase());

    return [...new Set(keywords)];
  }
}

// CLI interface
async function main() {
  const packagesDir = process.argv[2] || './packages';
  const outputDir = process.argv[3] || './docs/api';

  const generator = new APIDocumentationGenerator(packagesDir, outputDir);
  await generator.generateDocumentation();
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { APIDocumentationGenerator };
