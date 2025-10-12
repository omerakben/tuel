# 🎨 TUEL Copy-Paste Examples
**Stunning animations in seconds. Just copy, paste, and customize!**

---

## 🚀 Quick Start

All examples are **production-ready**. Just install the packages and copy the code!

```bash
npm install @tuel/scroll @tuel/text-effects @tuel/gallery @tuel/interaction @tuel/three
```

---

## 📜 Example 1: Parallax Hero Section
**Perfect for landing pages. Smooth parallax with multiple layers.**

```tsx
import { ParallaxScroll } from '@tuel/scroll';
import { AnimatedText } from '@tuel/text-effects';

export function ParallaxHero() {
  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background layer */}
      <ParallaxScroll speed={0.3} className="absolute inset-0">
        <img
          src="/hero-bg.jpg"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </ParallaxScroll>

      {/* Middle layer */}
      <ParallaxScroll speed={0.6} className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white z-10">
          <AnimatedText
            text="Beautiful Animations"
            animation="fadeInUp"
            className="text-6xl font-bold mb-4"
            splitBy="word"
            stagger={0.1}
          />
          <AnimatedText
            text="Made stupidly simple"
            animation="fadeInUp"
            className="text-2xl"
            delay={0.5}
          />
          <button className="mt-8 px-8 py-4 bg-white text-black rounded-full font-bold hover:scale-110 transition-transform">
            Get Started
          </button>
        </div>
      </ParallaxScroll>

      {/* Foreground layer */}
      <ParallaxScroll speed={1.2} className="absolute bottom-0 w-full">
        <div className="h-32 bg-gradient-to-t from-black to-transparent" />
      </ParallaxScroll>
    </div>
  );
}
```

**Live Demo**: [View on CodeSandbox](https://codesandbox.io/s/tuel-parallax-hero)

---

## 🎞️ Example 2: Horizontal Scroll Gallery
**Apple-style horizontal scrolling. Perfect for portfolios.**

```tsx
import { HorizontalScroll, HorizontalScrollItem } from '@tuel/scroll';

export function HorizontalGallery() {
  const projects = [
    { id: 1, title: 'Project Alpha', image: '/project1.jpg', color: '#667eea' },
    { id: 2, title: 'Project Beta', image: '/project2.jpg', color: '#f093fb' },
    { id: 3, title: 'Project Gamma', image: '/project3.jpg', color: '#4facfe' },
    { id: 4, title: 'Project Delta', image: '/project4.jpg', color: '#43e97b' },
  ];

  return (
    <section className="py-20">
      <h2 className="text-4xl font-bold text-center mb-12">Our Work</h2>

      <HorizontalScroll
        speed={1}
        pin={true}
        className="flex gap-8"
      >
        {projects.map((project) => (
          <HorizontalScrollItem
            key={project.id}
            className="flex-shrink-0 w-[80vw] h-[500px] rounded-3xl overflow-hidden"
          >
            <div
              className="relative w-full h-full"
              style={{ backgroundColor: project.color }}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover mix-blend-overlay"
              />
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-4xl font-bold">{project.title}</h3>
                <button className="mt-4 px-6 py-2 bg-white text-black rounded-full">
                  View Case Study
                </button>
              </div>
            </div>
          </HorizontalScrollItem>
        ))}
      </HorizontalScroll>
    </section>
  );
}
```

**Live Demo**: [View on CodeSandbox](https://codesandbox.io/s/tuel-horizontal-gallery)

---

## ✨ Example 3: Animated Text Reveal
**Beautiful typography animations. Perfect for headlines.**

```tsx
import { AnimatedText, SplitText } from '@tuel/text-effects';

export function TextRevealSection() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-black text-white p-8">
      <div className="max-w-4xl">
        {/* Word-by-word reveal */}
        <AnimatedText
          text="Create stunning"
          animation="slideUp"
          splitBy="word"
          stagger={0.05}
          className="text-7xl font-bold mb-4"
        />

        {/* Character-by-character reveal */}
        <AnimatedText
          text="animations with ease"
          animation="fadeIn"
          splitBy="char"
          stagger={0.02}
          delay={0.3}
          className="text-7xl font-bold mb-8"
        />

        {/* Line reveal with different animation */}
        <AnimatedText
          text="TUEL makes complex animations simple. Beautiful defaults, infinite customization."
          animation="fadeInUp"
          splitBy="line"
          delay={0.8}
          className="text-xl text-gray-400"
        />
      </div>
    </section>
  );
}
```

**Variations**:
```tsx
// Gradient text reveal
<AnimatedText
  text="Gradient Animation"
  animation="fadeIn"
  className="text-6xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
/>

// Typewriter effect
<AnimatedText
  text="Type writer effect..."
  animation="typewriter"
  speed={50}
  cursor={true}
/>
```

**Live Demo**: [View on CodeSandbox](https://codesandbox.io/s/tuel-text-reveal)

---

## 🖼️ Example 4: Masonry Gallery with Lightbox
**Pinterest-style gallery. Perfect for photography portfolios.**

```tsx
import { ImageGallery } from '@tuel/gallery';

export function MasonryGallery() {
  const images = [
    { src: '/photo1.jpg', alt: 'Mountain landscape', width: 800, height: 1200 },
    { src: '/photo2.jpg', alt: 'City skyline', width: 1200, height: 800 },
    { src: '/photo3.jpg', alt: 'Ocean waves', width: 800, height: 800 },
    { src: '/photo4.jpg', alt: 'Forest path', width: 800, height: 1000 },
    { src: '/photo5.jpg', alt: 'Desert dunes', width: 1200, height: 900 },
    { src: '/photo6.jpg', alt: 'Northern lights', width: 1600, height: 900 },
  ];

  return (
    <section className="py-20 px-8">
      <h2 className="text-4xl font-bold text-center mb-12">Photography</h2>

      <ImageGallery
        images={images}
        layout="masonry"
        columns={3}
        gap={16}
        lightbox={true}
        animation="fadeIn"
        stagger={0.05}
        className="max-w-7xl mx-auto"
      />
    </section>
  );
}
```

**Responsive**:
```tsx
<ImageGallery
  images={images}
  layout="masonry"
  columns={{ mobile: 1, tablet: 2, desktop: 3 }}
  lightbox={true}
/>
```

**Live Demo**: [View on CodeSandbox](https://codesandbox.io/s/tuel-masonry-gallery)

---

## 🎭 Example 5: Magnetic Button
**Cursor-following button. Perfect for CTAs.**

```tsx
import { MagneticButton } from '@tuel/interaction';

export function CTASection() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900">
      <div className="text-center">
        <h2 className="text-5xl font-bold text-white mb-8">
          Ready to get started?
        </h2>

        <MagneticButton
          strength={0.5}
          className="px-12 py-6 bg-white text-black rounded-full text-xl font-bold"
        >
          Start Building
        </MagneticButton>

        <p className="text-white/60 mt-4">
          Hover over the button to see the magic ✨
        </p>
      </div>
    </section>
  );
}
```

**Customization**:
```tsx
<MagneticButton
  strength={0.3}          // How much it moves (0-1)
  distance={100}          // Magnetic range in pixels
  ease="spring"           // Animation easing
  tilt={true}             // Enable 3D tilt
  ripple={true}           // Click ripple effect
  className="..."
>
  Hover Me!
</MagneticButton>
```

**Live Demo**: [View on CodeSandbox](https://codesandbox.io/s/tuel-magnetic-button)

---

## 🌀 Example 6: 3D Floating Objects
**Three.js made simple. Perfect for modern landing pages.**

```tsx
import { FloatingObjects } from '@tuel/three';

export function ThreeDHero() {
  return (
    <section className="relative h-screen">
      {/* 3D Background */}
      <FloatingObjects
        objects={[
          { position: [-2, 0, 0], color: '#667eea', shape: 'sphere', scale: 1.2 },
          { position: [0, 1, -2], color: '#f093fb', shape: 'torus', scale: 0.8 },
          { position: [2, -1, 0], color: '#4facfe', shape: 'box', scale: 1 },
          { position: [0, -2, -1], color: '#43e97b', shape: 'octahedron', scale: 0.6 },
        ]}
        backgroundColor="#0a0a0a"
        environment="sunset"
        autoRotate={true}
        shadows={true}
      />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white z-10">
          <h1 className="text-7xl font-bold mb-4">
            The Future is 3D
          </h1>
          <p className="text-xl">
            Three.js animations without the complexity
          </p>
        </div>
      </div>
    </section>
  );
}
```

**Pre-built Scenes**:
```tsx
// Morphing shapes
<MorphingShapes
  shapes={[
    { morphTargets: ['sphere', 'box', 'torus'], color: '#667eea' }
  ]}
/>

// Product showcase
<ThreeOrbitScene cameraPosition={[0, 0, 5]} autoRotate={true}>
  <YourProductModel />
</ThreeOrbitScene>
```

**Live Demo**: [View on CodeSandbox](https://codesandbox.io/s/tuel-3d-floating)

---

## 📱 Example 7: Scroll Progress Indicator
**Track scroll progress. Perfect for articles and long pages.**

```tsx
import { useScrollProgress } from '@tuel/scroll';

export function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <>
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-150"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Circular progress indicator */}
      <div className="fixed bottom-8 right-8 z-50">
        <svg className="w-16 h-16 transform -rotate-90">
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="#e5e7eb"
            strokeWidth="4"
            fill="none"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="url(#gradient)"
            strokeWidth="4"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 28}`}
            strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress)}`}
            className="transition-all duration-150"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#667eea" />
              <stop offset="100%" stopColor="#f093fb" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
          {Math.round(progress * 100)}%
        </span>
      </div>
    </>
  );
}
```

**Live Demo**: [View on CodeSandbox](https://codesandbox.io/s/tuel-scroll-progress)

---

## 🎪 Example 8: Bento Grid Layout
**Apple-style grid. Perfect for feature sections.**

```tsx
import { BentoGrid, BentoCard } from '@tuel/ui';
import { AnimatedText } from '@tuel/text-effects';

export function FeaturesGrid() {
  return (
    <section className="py-20 px-8 bg-black">
      <h2 className="text-5xl font-bold text-white text-center mb-16">
        Features
      </h2>

      <BentoGrid className="max-w-7xl mx-auto">
        {/* Large feature card */}
        <BentoCard
          size="large"
          className="col-span-2 row-span-2 bg-gradient-to-br from-purple-600 to-blue-600 p-12"
        >
          <AnimatedText
            text="Lightning Fast"
            animation="fadeInUp"
            className="text-4xl font-bold text-white mb-4"
          />
          <p className="text-white/80 text-lg">
            GPU-accelerated animations running at 60fps
          </p>
        </BentoCard>

        {/* Medium cards */}
        <BentoCard
          size="medium"
          className="bg-gradient-to-br from-pink-600 to-orange-600 p-8"
        >
          <h3 className="text-2xl font-bold text-white mb-2">Easy to Use</h3>
          <p className="text-white/80">Simple, intuitive API</p>
        </BentoCard>

        <BentoCard
          size="medium"
          className="bg-gradient-to-br from-green-600 to-teal-600 p-8"
        >
          <h3 className="text-2xl font-bold text-white mb-2">Accessible</h3>
          <p className="text-white/80">WCAG compliant animations</p>
        </BentoCard>

        {/* Small cards */}
        <BentoCard
          size="small"
          className="bg-gradient-to-br from-yellow-600 to-red-600 p-6"
        >
          <h3 className="text-xl font-bold text-white">TypeScript</h3>
        </BentoCard>

        <BentoCard
          size="small"
          className="bg-gradient-to-br from-indigo-600 to-purple-600 p-6"
        >
          <h3 className="text-xl font-bold text-white">SSR Ready</h3>
        </BentoCard>
      </BentoGrid>
    </section>
  );
}
```

**Auto-responsive**:
```tsx
<BentoGrid
  columns={{ mobile: 1, tablet: 2, desktop: 4 }}
  gap={16}
  animation="stagger"
>
  {/* Cards automatically adjust */}
</BentoGrid>
```

**Live Demo**: [View on CodeSandbox](https://codesandbox.io/s/tuel-bento-grid)

---

## 🎬 Example 9: Video Gallery with Controls
**YouTube-style gallery. Perfect for portfolios.**

```tsx
import { VideoGallery } from '@tuel/gallery';

export function VideoShowcase() {
  const videos = [
    { src: '/demo1.mp4', poster: '/poster1.jpg', title: 'Product Demo' },
    { src: '/demo2.mp4', poster: '/poster2.jpg', title: 'Tutorial' },
    { src: '/demo3.mp4', poster: '/poster3.jpg', title: 'Testimonial' },
  ];

  return (
    <section className="py-20 px-8 bg-gray-100">
      <h2 className="text-4xl font-bold text-center mb-12">Video Demos</h2>

      <VideoGallery
        videos={videos}
        layout="grid"
        columns={3}
        autoPlay={false}
        controls={true}
        muted={true}
        loop={true}
        className="max-w-7xl mx-auto"
        onVideoClick={(video) => console.log('Clicked:', video.title)}
      />
    </section>
  );
}
```

**Live Demo**: [View on CodeSandbox](https://codesandbox.io/s/tuel-video-gallery)

---

## 🎨 Example 10: Infinite Marquee
**Continuous scrolling logos. Perfect for "As Seen On" sections.**

```tsx
import { InfiniteScroll } from '@tuel/scroll';

export function LogoMarquee() {
  const logos = [
    '/logos/company1.svg',
    '/logos/company2.svg',
    '/logos/company3.svg',
    '/logos/company4.svg',
    '/logos/company5.svg',
  ];

  return (
    <section className="py-20 bg-white overflow-hidden">
      <h2 className="text-center text-gray-600 mb-8">Trusted by industry leaders</h2>

      {/* Left-to-right marquee */}
      <InfiniteScroll direction="left" speed={1} pauseOnHover={true}>
        {logos.map((logo, i) => (
          <img
            key={i}
            src={logo}
            alt="Company logo"
            className="h-12 mx-8 grayscale opacity-50 hover:opacity-100 hover:grayscale-0 transition-all"
          />
        ))}
      </InfiniteScroll>

      {/* Right-to-left marquee (opposite direction) */}
      <InfiniteScroll direction="right" speed={0.8} className="mt-8" pauseOnHover={true}>
        {logos.map((logo, i) => (
          <img
            key={i}
            src={logo}
            alt="Company logo"
            className="h-12 mx-8 grayscale opacity-50 hover:opacity-100 hover:grayscale-0 transition-all"
          />
        ))}
      </InfiniteScroll>
    </section>
  );
}
```

**Live Demo**: [View on CodeSandbox](https://codesandbox.io/s/tuel-infinite-scroll)

---

## 🚀 Complete Landing Page
**All components together. Copy this entire page!**

```tsx
import { ParallaxHero } from './examples/ParallaxHero';
import { FeaturesGrid } from './examples/FeaturesGrid';
import { HorizontalGallery } from './examples/HorizontalGallery';
import { LogoMarquee } from './examples/LogoMarquee';
import { CTASection } from './examples/CTASection';

export default function LandingPage() {
  return (
    <>
      <ParallaxHero />
      <LogoMarquee />
      <FeaturesGrid />
      <HorizontalGallery />
      <CTASection />
    </>
  );
}
```

**Result**: A stunning, production-ready landing page in **under 100 lines of code**! 🎉

---

## 📚 More Examples

Visit our [demo site](https://tuel-animation.vercel.app) for 50+ more examples:

- Cursor trails
- Particle effects
- Animated counters
- Scroll-triggered cards
- Sticky sections
- Timeline animations
- And much more!

---

## 💡 Pro Tips

### 1. Combine Components
```tsx
<HorizontalScroll>
  {items.map((item) => (
    <MagneticButton>
      <AnimatedText text={item.title} />
    </MagneticButton>
  ))}
</HorizontalScroll>
```

### 2. Custom Animations
```tsx
<AnimatedText
  text="Custom timing"
  animation="fadeIn"
  duration={1000}
  ease="easeInOutCubic"
  delay={500}
/>
```

### 3. Accessibility First
```tsx
// Automatically respects prefers-reduced-motion
<ParallaxScroll speed={0.5} respectReducedMotion={true}>
  {/* Content */}
</ParallaxScroll>
```

---

## 🤝 Share Your Examples

Built something cool with TUEL? Share it!

- Tweet [@tuel_animations](https://twitter.com/tuel_animations) with #TUELShowcase
- Submit to [tuel.ai/showcase](https://tuel.ai/showcase)
- Open a PR to add your example to this file!

**Best examples win $100 gift cards monthly!** 💰

---

## 🎯 What's Next?

1. Pick an example above
2. Copy-paste into your project
3. Customize colors/content
4. Ship to production
5. Get compliments from users 🎉

Let's make the web more beautiful, one animation at a time! ✨
