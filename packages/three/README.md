# @tuel/three

Three.js components and utilities for React. Create stunning 3D animations and WebGL experiences.

[![npm version](https://img.shields.io/npm/v/@tuel/three.svg)](https://www.npmjs.com/package/@tuel/three)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎨 **3D Components** - Pre-built Three.js React components
- 🚀 **High Performance** - Optimized WebGL rendering
- 🔧 **React Three Fiber** - Built on @react-three/fiber
- 📦 **Drei Integration** - Includes useful @react-three/drei helpers
- 🎭 **GSAP Support** - Animate 3D objects with GSAP
- 🌳 **Tree-shakeable** - Import only what you need

## Installation

```bash
pnpm add @tuel/three

# Peer dependencies
pnpm add react react-dom three @react-three/fiber @react-three/drei
```

## Quick Start

```tsx
import { Canvas, FloatingObjects } from '@tuel/three';

function App() {
  return (
    <Canvas>
      <FloatingObjects count={50} />
    </Canvas>
  );
}
```

## Components

### Canvas

Wrapper component that sets up Three.js scene.

```tsx
<Canvas
  camera={{ position: [0, 0, 5], fov: 75 }}
  dpr={[1, 2]}
>
  {/* Your 3D content */}
</Canvas>
```

### FloatingObjects

Animated floating 3D objects.

```tsx
<FloatingObjects
  count={30}
  speed={1}
  radius={5}
  colors={['#0070f3', '#7928ca']}
/>
```

### ParticleField

3D particle system with physics.

```tsx
<ParticleField
  count={1000}
  size={0.05}
  color="#ffffff"
  velocity={0.5}
/>
```

### MorphingShapes

Morphing 3D geometry animations.

```tsx
<MorphingShapes
  shapes={['sphere', 'box', 'torus']}
  duration={2}
  color="#ff0080"
/>
```

## Usage Examples

### Basic 3D Scene

```tsx
import { Canvas } from '@tuel/three';
import { OrbitControls } from '@react-three/drei';

function Scene() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <FloatingObjects count={20} />
      <OrbitControls />
    </Canvas>
  );
}
```

### Animated Particles

```tsx
import { Canvas, ParticleField } from '@tuel/three';

function ParticleScene() {
  return (
    <Canvas camera={{ position: [0, 0, 10] }}>
      <ParticleField
        count={5000}
        size={0.02}
        color="#0070f3"
        velocity={0.3}
      />
    </Canvas>
  );
}
```

### Interactive 3D Objects

```tsx
import { Canvas } from '@tuel/three';
import { useState } from 'react';

function InteractiveScene() {
  const [hovered, setHovered] = useState(false);

  return (
    <Canvas>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.5 : 1}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
      </mesh>
    </Canvas>
  );
}
```

### Morphing Animation

```tsx
import { Canvas, MorphingShapes } from '@tuel/three';

function MorphScene() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <MorphingShapes
        shapes={['sphere', 'box', 'torus', 'cone']}
        duration={3}
        color="#7928ca"
      />
    </Canvas>
  );
}
```

### Custom Shader Material

```tsx
import { Canvas } from '@tuel/three';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

const CustomMaterial = shaderMaterial(
  { time: 0, color: new THREE.Color(0.2, 0.0, 0.1) },
  // vertex shader
  `varying vec2 vUv;
   void main() {
     vUv = uv;
     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
   }`,
  // fragment shader
  `uniform float time;
   uniform vec3 color;
   varying vec2 vUv;
   void main() {
     gl_FragColor = vec4(color * vUv.x * sin(time), 1.0);
   }`
);

extend({ CustomMaterial });

function ShaderScene() {
  return (
    <Canvas>
      <mesh>
        <planeGeometry args={[2, 2]} />
        <customMaterial time={0} />
      </mesh>
    </Canvas>
  );
}
```

## Performance Tips

- Use `dpr={[1, 2]}` for responsive pixel ratio
- Implement frustum culling for off-screen objects
- Use instanced meshes for many similar objects
- Enable shadow maps only when needed
- Use lower polygon counts for mobile

## TypeScript Support

Full TypeScript support:

```typescript
import type {
  CanvasProps,
  FloatingObjectsProps,
  ParticleFieldProps,
} from '@tuel/three';
```

## Browser Support

- Chrome/Edge 90+ (WebGL 2.0)
- Firefox 88+
- Safari 14+ (WebGL 2.0)
- Mobile browsers with WebGL support

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for development setup and guidelines.

## License

MIT © [Omer Akben](https://github.com/omerakben)

## Links

- [Documentation](https://tuel.ai/docs/three)
- [Examples](https://tuel.ai/examples/three)
- [Three.js Docs](https://threejs.org/docs/)
- [GitHub](https://github.com/omerakben/tuel)
- [npm](https://www.npmjs.com/package/@tuel/three)
