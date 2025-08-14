import { cn, isClient } from "@tuel/utils";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactNode, useEffect, useRef } from "react";

if (isClient) {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ScrollFrameAnimationProps {
  frameCount: number;
  framePath: (index: number) => string;
  className?: string;
  scrollSpeed?: number;
  pinContainer?: boolean;
  startTrigger?: string;
  endTrigger?: string;
  onProgress?: (progress: number) => void;
  children?: ReactNode;
  fallback?: ReactNode;
  preloadFrames?: boolean;
}

export function ScrollFrameAnimation({
  frameCount,
  framePath,
  className,
  scrollSpeed = 1,
  pinContainer = true,
  startTrigger = "top top",
  endTrigger = "bottom top",
  onProgress,
  children,
  fallback,
  preloadFrames = true,
}: ScrollFrameAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameRef = useRef({ current: 0 });
  const isLoadedRef = useRef(false);

  // Set up canvas
  useEffect(() => {
    if (!canvasRef.current || !isClient) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    contextRef.current = context;

    // Set canvas size
    const setCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      context.scale(dpr, dpr);
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    return () => {
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []);

  // Load images
  useEffect(() => {
    if (!preloadFrames || !isClient) return;

    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          isLoadedRef.current = true;
          renderFrame(0);
        }
      };
      img.src = framePath(i);
      images.push(img);
    }

    imagesRef.current = images;
  }, [frameCount, framePath, preloadFrames]);

  const renderFrame = (frameIndex: number) => {
    const context = contextRef.current;
    const canvas = canvasRef.current;
    const images = imagesRef.current;

    if (!context || !canvas || images.length === 0) return;

    const img = images[Math.floor(frameIndex)];
    if (!img || !img.complete) return;

    const canvasWidth = canvas.width / (window.devicePixelRatio || 1);
    const canvasHeight = canvas.height / (window.devicePixelRatio || 1);

    context.clearRect(0, 0, canvasWidth, canvasHeight);

    // Cover fit the image
    const imageAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = canvasWidth / canvasHeight;

    let drawWidth, drawHeight, drawX, drawY;

    if (imageAspect > canvasAspect) {
      drawHeight = canvasHeight;
      drawWidth = drawHeight * imageAspect;
      drawX = (canvasWidth - drawWidth) / 2;
      drawY = 0;
    } else {
      drawWidth = canvasWidth;
      drawHeight = drawWidth / imageAspect;
      drawX = 0;
      drawY = (canvasHeight - drawHeight) / 2;
    }

    context.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  };

  // Set up scroll animation
  useEffect(() => {
    if (!isLoadedRef.current || !isClient || !containerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: startTrigger,
        end: endTrigger,
        scrub: scrollSpeed,
        pin: pinContainer,
        onUpdate: (self: any) => {
          const frame = Math.floor(self.progress * (frameCount - 1));
          frameRef.current.current = frame;
          renderFrame(frame);
          onProgress?.(self.progress);
        },
      },
    });

    return () => {
      tl.kill();
    };
  }, [
    frameCount,
    scrollSpeed,
    pinContainer,
    startTrigger,
    endTrigger,
    onProgress,
    renderFrame,
  ]);

  if (!isClient) {
    return <div className={className}>{fallback}</div>;
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full"
        style={{ zIndex: -1 }}
      />
      {children}
    </div>
  );
}
