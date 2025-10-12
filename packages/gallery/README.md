# @tuel/gallery

Beautiful gallery, carousel, and media presentation components with rich animations and interaction patterns.

[![npm version](https://img.shields.io/npm/v/@tuel/gallery.svg)](https://www.npmjs.com/package/@tuel/gallery)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🖼️ **Image Gallery** - Responsive grid with lightbox and zoom
- 🎠 **Carousel** - Smooth sliding carousel with autoplay
- 🎬 **Video Gallery** - Video grid with play controls
- 📱 **Responsive** - Mobile-first design with touch support
- 🎨 **Customizable** - Flexible styling and configuration
- 🚀 **Performant** - Optimized rendering and lazy loading
- ♿ **Accessible** - Keyboard navigation and ARIA labels

## Installation

```bash
pnpm add @tuel/gallery

# Peer dependencies
pnpm add react react-dom framer-motion gsap
```

## Components

### ImageGallery

Responsive image gallery with lightbox functionality.

```tsx
import { ImageGallery } from '@tuel/gallery';

const images = [
  { src: '/img1.jpg', alt: 'Image 1', title: 'Beautiful Scene' },
  { src: '/img2.jpg', alt: 'Image 2', title: 'Mountain View' },
  { src: '/img3.jpg', alt: 'Image 3', title: 'Ocean Waves' },
];

function Gallery() {
  return (
    <ImageGallery
      images={images}
      columns={{ sm: 1, md: 2, lg: 3 }}
      gap={16}
      aspectRatio="16/9"
      lightbox={true}
    />
  );
}
```

**Props:**

```typescript
interface ImageGalleryProps {
  images: GalleryImage[];
  columns?: number | { sm?: number; md?: number; lg?: number };
  gap?: number;
  aspectRatio?: string;
  lightbox?: boolean;
  onImageClick?: (image: GalleryImage, index: number) => void;
  className?: string;
}

interface GalleryImage {
  src: string;
  alt: string;
  title?: string;
  description?: string;
}
```

### Carousel

Smooth sliding carousel with customizable options.

```tsx
import { Carousel } from '@tuel/gallery';

const slides = [
  { content: <div>Slide 1</div>, id: '1' },
  { content: <div>Slide 2</div>, id: '2' },
  { content: <div>Slide 3</div>, id: '3' },
];

function MyCarousel() {
  return (
    <Carousel
      slides={slides}
      autoplay={true}
      interval={5000}
      showArrows={true}
      showDots={true}
      loop={true}
    />
  );
}
```

**Props:**

```typescript
interface CarouselProps {
  slides: CarouselSlide[];
  autoplay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  loop?: boolean;
  onSlideChange?: (index: number) => void;
  className?: string;
}

interface CarouselSlide {
  content: ReactNode;
  id: string;
  title?: string;
}
```

### VideoGallery

Video gallery with thumbnail previews and play controls.

```tsx
import { VideoGallery } from '@tuel/gallery';

const videos = [
  {
    src: '/video1.mp4',
    poster: '/poster1.jpg',
    title: 'Video 1',
  },
  {
    src: '/video2.mp4',
    poster: '/poster2.jpg',
    title: 'Video 2',
  },
];

function Videos() {
  return (
    <VideoGallery
      videos={videos}
      columns={2}
      autoplay={false}
      controls={true}
    />
  );
}
```

**Props:**

```typescript
interface VideoGalleryProps {
  videos: VideoItem[];
  columns?: number;
  autoplay?: boolean;
  controls?: boolean;
  muted?: boolean;
  onVideoClick?: (video: VideoItem, index: number) => void;
  className?: string;
}

interface VideoItem {
  src: string;
  poster?: string;
  title?: string;
  duration?: string;
}
```

### MediaGrid

Unified grid for mixed media (images, videos, etc.).

```tsx
import { MediaGrid } from '@tuel/gallery';

const mediaItems = [
  { type: 'image', src: '/img1.jpg', alt: 'Image' },
  { type: 'video', src: '/vid1.mp4', poster: '/poster1.jpg' },
  { type: 'image', src: '/img2.jpg', alt: 'Another Image' },
];

function Media() {
  return (
    <MediaGrid
      items={mediaItems}
      columns={{ sm: 1, md: 2, lg: 3 }}
      gap={20}
    />
  );
}
```

**Props:**

```typescript
interface MediaGridProps {
  items: MediaItem[];
  columns?: number | { sm?: number; md?: number; lg?: number };
  gap?: number;
  onItemClick?: (item: MediaItem, index: number) => void;
  className?: string;
}

interface MediaItem {
  type: 'image' | 'video';
  src: string;
  alt?: string;
  poster?: string;
  title?: string;
}
```

## Usage Examples

### Image Gallery with Lightbox

```tsx
import { ImageGallery } from '@tuel/gallery';
import { useState } from 'react';

function PhotoGallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  const images = [
    { src: '/photos/1.jpg', alt: 'Photo 1', title: 'Sunset' },
    { src: '/photos/2.jpg', alt: 'Photo 2', title: 'Mountains' },
    { src: '/photos/3.jpg', alt: 'Photo 3', title: 'Ocean' },
  ];

  return (
    <ImageGallery
      images={images}
      columns={{ sm: 1, md: 2, lg: 3 }}
      gap={16}
      lightbox={true}
      onImageClick={(image, index) => {
        console.log('Clicked image:', image.title);
      }}
    />
  );
}
```

### Auto-Playing Carousel

```tsx
import { Carousel } from '@tuel/gallery';

function HeroCarousel() {
  const slides = [
    {
      id: '1',
      content: (
        <div className="hero-slide">
          <img src="/hero1.jpg" alt="Hero 1" />
          <h2>Welcome</h2>
        </div>
      ),
    },
    {
      id: '2',
      content: (
        <div className="hero-slide">
          <img src="/hero2.jpg" alt="Hero 2" />
          <h2>Discover</h2>
        </div>
      ),
    },
  ];

  return (
    <Carousel
      slides={slides}
      autoplay={true}
      interval={4000}
      showArrows={true}
      showDots={true}
      loop={true}
    />
  );
}
```

### Video Gallery with Custom Controls

```tsx
import { VideoGallery } from '@tuel/gallery';

function VideoShowcase() {
  const videos = [
    {
      src: '/videos/intro.mp4',
      poster: '/posters/intro.jpg',
      title: 'Introduction',
      duration: '2:30',
    },
    {
      src: '/videos/demo.mp4',
      poster: '/posters/demo.jpg',
      title: 'Product Demo',
      duration: '5:15',
    },
  ];

  return (
    <VideoGallery
      videos={videos}
      columns={2}
      autoplay={false}
      controls={true}
      muted={false}
      onVideoClick={(video) => {
        console.log('Playing:', video.title);
      }}
    />
  );
}
```

## Styling

All components support custom CSS classes:

```tsx
<ImageGallery
  images={images}
  className="my-custom-gallery"
/>
```

Import optional styles:

```tsx
import '@tuel/gallery/styles';
```

## Performance

- Lazy loading for images and videos
- Intersection Observer for viewport detection
- GPU-accelerated animations
- Optimized rendering with React.memo
- Debounced resize handlers

## Accessibility

- Keyboard navigation (arrow keys, Enter, Esc)
- ARIA labels and roles
- Focus management
- Screen reader support
- Alternative text for images

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android 90+)

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for development setup and guidelines.

## License

MIT © [Omer Akben](https://github.com/omerakben)

## Links

- [Documentation](https://tuel.ai/docs/gallery)
- [Examples](https://tuel.ai/examples/gallery)
- [GitHub](https://github.com/omerakben/tuel)
- [npm](https://www.npmjs.com/package/@tuel/gallery)
