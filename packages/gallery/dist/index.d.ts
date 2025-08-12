import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

interface GalleryImage {
    id: string;
    src: string;
    alt: string;
    title?: string;
    description?: string;
    width?: number;
    height?: number;
}
interface ImageGalleryProps {
    images: GalleryImage[];
    className?: string;
    layout?: "grid" | "masonry" | "carousel" | "stack" | "justified";
    columns?: number;
    gap?: number;
    animationType?: "fade" | "slide" | "scale" | "flip" | "reveal";
    hoverEffect?: "zoom" | "tilt" | "overlay" | "parallax" | "lift" | "blur";
    lightbox?: boolean;
    lazy?: boolean;
    aspectRatio?: "auto" | "square" | "4/3" | "16/9" | "21/9";
    onClick?: (image: GalleryImage, index: number) => void;
    onImageLoad?: (image: GalleryImage, index: number) => void;
    infinite?: boolean;
    autoPlay?: boolean;
    autoPlayInterval?: number;
}
declare function ImageGallery({ images, className, layout, columns, gap, animationType, hoverEffect, lightbox, lazy, aspectRatio, onClick, onImageLoad, infinite, autoPlay, autoPlayInterval, }: ImageGalleryProps): react_jsx_runtime.JSX.Element;

interface CarouselSlide {
    id: string;
    content: ReactNode;
    image?: string;
    title?: string;
    description?: string;
    href?: string;
}
interface CarouselProps {
    slides: CarouselSlide[];
    className?: string;
    variant?: "fade" | "slide" | "scale" | "3d" | "stack" | "coverflow";
    autoPlay?: boolean;
    autoPlayInterval?: number;
    loop?: boolean;
    showIndicators?: boolean;
    showArrows?: boolean;
    draggable?: boolean;
    direction?: "horizontal" | "vertical";
    slidesPerView?: number;
    spacing?: number;
    pauseOnHover?: boolean;
    effect?: "slide" | "fade" | "cube" | "flip" | "cards";
    onSlideChange?: (index: number) => void;
    onSlideClick?: (slide: CarouselSlide, index: number) => void;
}
declare function Carousel({ slides, className, variant, autoPlay, autoPlayInterval, loop, showIndicators, showArrows, draggable, direction, slidesPerView, spacing, pauseOnHover, effect, onSlideChange, onSlideClick, }: CarouselProps): react_jsx_runtime.JSX.Element;

interface VideoItem {
    id: string;
    src: string;
    poster?: string;
    title?: string;
    description?: string;
    duration?: string;
    type?: "mp4" | "webm" | "ogg" | "youtube" | "vimeo";
    thumbnail?: string;
}
interface VideoGalleryProps {
    videos: VideoItem[];
    className?: string;
    layout?: "grid" | "list" | "carousel";
    columns?: number;
    gap?: number;
    autoPlay?: boolean;
    controls?: boolean;
    muted?: boolean;
    loop?: boolean;
    preload?: "none" | "metadata" | "auto";
    aspectRatio?: "16/9" | "4/3" | "1/1" | "auto";
    showThumbnails?: boolean;
    lightbox?: boolean;
    onVideoSelect?: (video: VideoItem, index: number) => void;
    onVideoPlay?: (video: VideoItem, index: number) => void;
    onVideoEnd?: (video: VideoItem, index: number) => void;
}
declare function VideoGallery({ videos, className, layout, columns, gap, autoPlay, controls, muted, loop, preload, aspectRatio, showThumbnails, lightbox, onVideoSelect, onVideoPlay, onVideoEnd, }: VideoGalleryProps): react_jsx_runtime.JSX.Element;

interface MediaItem {
    id: string;
    type: "image" | "video" | "audio";
    src: string;
    thumbnail?: string;
    poster?: string;
    title?: string;
    description?: string;
    duration?: string;
    size?: {
        width: number;
        height: number;
    };
    alt?: string;
}
interface MediaGridProps {
    media: MediaItem[];
    className?: string;
    layout?: "grid" | "masonry" | "justified" | "pinterest";
    columns?: number;
    gap?: number;
    aspectRatio?: "auto" | "square" | "4/3" | "16/9";
    lightbox?: boolean;
    autoPlay?: boolean;
    lazy?: boolean;
    showOverlay?: boolean;
    filterType?: "all" | "image" | "video" | "audio";
    sortBy?: "none" | "title" | "type" | "date";
    onMediaClick?: (item: MediaItem, index: number) => void;
    onFilterChange?: (filter: "all" | "image" | "video" | "audio") => void;
}
declare function MediaGrid({ media, className, layout, columns, gap, aspectRatio, lightbox, autoPlay, lazy, showOverlay, filterType, sortBy, onMediaClick, onFilterChange, }: MediaGridProps): react_jsx_runtime.JSX.Element;

export { Carousel, type CarouselProps, type CarouselSlide, type GalleryImage, ImageGallery, type ImageGalleryProps, MediaGrid, type MediaGridProps, type MediaItem, VideoGallery, type VideoGalleryProps, type VideoItem };
