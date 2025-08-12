"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface OrkenWorldScrollProps {
  className?: string;
}

interface TriangleState {
  order: number;
  scale: number;
  row: number;
  col: number;
}

interface CardData {
  id: number;
  title: string;
  productCode: string;
  image: string;
}

const defaultCards: CardData[] = [
  {
    id: 1,
    title: "Silent Veil",
    productCode: "PROD8372",
    image:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2NjY2NjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMzMzMzMzMiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+",
  },
  {
    id: 2,
    title: "Crimson Echoes",
    productCode: "PROD4921",
    image:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNkYzI2MjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM5OTE5MTkiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+",
  },
  {
    id: 3,
    title: "Zenith Arc",
    productCode: "PROD7586",
    image:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMyNTYzZWIiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxZTQwYWYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+",
  },
  {
    id: 4,
    title: "Moonspire Dream",
    productCode: "PROD3410",
    image:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2MzY2ZjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM0MzM4Y2EiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+",
  },
  {
    id: 5,
    title: "Ember Flux",
    productCode: "PROD9053",
    image:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmOTc4MTYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlYTU4MDYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+",
  },
];

export function OrkenWorldScroll({ className = "" }: OrkenWorldScrollProps) {
  const stickyRef = useRef<HTMLDivElement>(null);
  const outlineCanvasRef = useRef<HTMLCanvasElement>(null);
  const fillCanvasRef = useRef<HTMLCanvasElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const triangleStatesRef = useRef<Map<string, TriangleState>>(new Map());
  const animationFrameIdRef = useRef<number | null>(null);
  const canvasXPositionRef = useRef(0);

  const TRIANGLE_SIZE = 15;
  const TRIANGLE_ROWS = 100;
  const TRIANGLE_COLS = 200;
  const SCALE_THRESHOLD = 0.1;

  const setCanvasSize = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) => {
    const rect = canvas.getBoundingClientRect();
    const pixelRatio = window.devicePixelRatio || 1;

    canvas.width = rect.width * pixelRatio;
    canvas.height = rect.height * pixelRatio;

    ctx.scale(pixelRatio, pixelRatio);
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
  };

  const drawTriangle = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    flipped: boolean,
    outlineScale: number,
    fillScale: number,
    lineWidth: number
  ) => {
    const halfSize = size * 0.5;

    if (outlineScale >= SCALE_THRESHOLD) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(outlineScale, outlineScale);
      ctx.translate(-x, -y);

      ctx.beginPath();
      if (!flipped) {
        ctx.moveTo(x, y - halfSize);
        ctx.lineTo(x + halfSize, y + halfSize);
        ctx.lineTo(x - halfSize, y + halfSize);
      } else {
        ctx.moveTo(x, y + halfSize);
        ctx.lineTo(x + halfSize, y - halfSize);
        ctx.lineTo(x - halfSize, y - halfSize);
      }
      ctx.closePath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.075)";
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }

    if (fillScale >= SCALE_THRESHOLD) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(fillScale, fillScale);
      ctx.translate(-x, -y);

      ctx.beginPath();
      if (!flipped) {
        ctx.moveTo(x, y - halfSize);
        ctx.lineTo(x + halfSize, y + halfSize);
        ctx.lineTo(x - halfSize, y + halfSize);
      } else {
        ctx.moveTo(x, y + halfSize);
        ctx.lineTo(x + halfSize, y - halfSize);
        ctx.lineTo(x - halfSize, y - halfSize);
      }
      ctx.closePath();
      ctx.fillStyle = "#ff6b00";
      ctx.strokeStyle = "#ff6b00";
      ctx.lineWidth = lineWidth;
      ctx.stroke();
      ctx.fill();
      ctx.restore();
    }
  };

  const drawGrid = (scrollProgress = 0) => {
    const outlineCanvas = outlineCanvasRef.current;
    const fillCanvas = fillCanvasRef.current;

    if (!outlineCanvas || !fillCanvas) return;

    const outlineCtx = outlineCanvas.getContext("2d");
    const fillCtx = fillCanvas.getContext("2d");

    if (!outlineCtx || !fillCtx) return;

    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }

    outlineCtx.clearRect(0, 0, outlineCanvas.width, outlineCanvas.height);
    fillCtx.clearRect(0, 0, fillCanvas.width, fillCanvas.height);

    const animationProgress =
      scrollProgress <= 0.65 ? 0 : (scrollProgress - 0.65) / 0.35;
    let needsUpdate = false;

    const canvasWidth = outlineCanvas.style.width
      ? parseInt(outlineCanvas.style.width.replace("px", ""))
      : outlineCanvas.width;
    const canvasHeight = outlineCanvas.style.height
      ? parseInt(outlineCanvas.style.height.replace("px", ""))
      : outlineCanvas.height;

    for (let row = 0; row < TRIANGLE_ROWS; row++) {
      for (let col = 0; col < TRIANGLE_COLS; col++) {
        const isFlipped = (row + col) % 2 === 1;
        const key = `${row}-${col}`;
        const triangle = triangleStatesRef.current.get(key);

        if (!triangle) continue;

        const targetScale = triangle.order <= animationProgress ? 1 : 0;
        const scaleSpeed = 0.08;

        if (triangle.scale !== targetScale) {
          triangle.scale += (targetScale - triangle.scale) * scaleSpeed;
          needsUpdate = true;
        }

        const x = col * (TRIANGLE_SIZE * 0.75) + canvasXPositionRef.current;
        const y =
          row * (TRIANGLE_SIZE * 0.85) + (isFlipped ? TRIANGLE_SIZE * 0.3 : 0);

        if (x + TRIANGLE_SIZE < 0 || x - TRIANGLE_SIZE > canvasWidth) continue;

        const outlineScale = Math.min(triangle.scale + 0.3, 1);
        const fillScale = Math.max(triangle.scale - 0.2, 0);

        drawTriangle(
          outlineCtx,
          x,
          y,
          TRIANGLE_SIZE,
          isFlipped,
          outlineScale,
          0,
          1
        );

        drawTriangle(fillCtx, x, y, TRIANGLE_SIZE, isFlipped, 0, fillScale, 1);
      }
    }

    if (needsUpdate) {
      animationFrameIdRef.current = requestAnimationFrame(() =>
        drawGrid(scrollProgress)
      );
    }
  };

  const initializeTriangles = () => {
    const positions: { key: string; row: number; col: number }[] = [];

    for (let row = 0; row < TRIANGLE_ROWS; row++) {
      for (let col = 0; col < TRIANGLE_COLS; col++) {
        positions.push({ key: `${row}-${col}`, row, col });
      }
    }

    const totalTriangles = positions.length;

    // Shuffle positions for random animation order
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    triangleStatesRef.current.clear();
    positions.forEach((pos, index) => {
      triangleStatesRef.current.set(pos.key, {
        order: index / totalTriangles,
        scale: 0,
        row: pos.row,
        col: pos.col,
      });
    });
  };

  useEffect(() => {
    const outlineCanvas = outlineCanvasRef.current;
    const fillCanvas = fillCanvasRef.current;
    const stickySection = stickyRef.current;
    const cards = cardsRef.current;

    if (!outlineCanvas || !fillCanvas || !stickySection || !cards) return;

    const outlineCtx = outlineCanvas.getContext("2d");
    const fillCtx = fillCanvas.getContext("2d");

    if (!outlineCtx || !fillCtx) return;

    // Setup canvas
    setCanvasSize(outlineCanvas, outlineCtx);
    setCanvasSize(fillCanvas, fillCtx);

    // Initialize triangles
    initializeTriangles();
    drawGrid();

    const stickyHeight = window.innerHeight * 5;

    // ScrollTrigger animation
    const scrollTrigger = ScrollTrigger.create({
      trigger: stickySection,
      start: "top top",
      end: `+=${stickyHeight}px`,
      pin: true,
      onUpdate: (self: any) => {
        canvasXPositionRef.current = -self.progress * 200;
        drawGrid(self.progress);

        // Move cards horizontally
        const progress = Math.min(self.progress / 0.654, 1);
        const translateX = -progress * 200;
        cards.style.transform = `translateX(${translateX}%)`;
      },
    });

    const handleResize = () => {
      if (outlineCtx && fillCtx) {
        setCanvasSize(outlineCanvas, outlineCtx);
        setCanvasSize(fillCanvas, fillCtx);
        drawGrid();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      scrollTrigger.kill();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className={`min-h-screen ${className}`}
      style={{ height: "800vh", fontFamily: '"PP Neue Montreal", sans-serif' }}
    >
      {/* Hero Section */}
      <section className="relative w-screen h-screen overflow-hidden flex justify-center items-center bg-black text-white">
        <h1 className="text-center text-4xl md:text-6xl lg:text-[80px] uppercase font-light leading-none">
          <span className="text-orange-500">Enter a Universe</span> Powered by
          Imagination
        </h1>
      </section>

      {/* Sticky Section */}
      <section
        ref={stickyRef}
        className="relative w-screen h-screen overflow-hidden"
      >
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>

        <canvas
          ref={outlineCanvasRef}
          className="absolute top-0 left-0 z-[1]"
          style={{ width: "150%", height: "150%" }}
        />

        <div
          ref={cardsRef}
          className="absolute top-0 left-0 w-[300%] h-screen flex justify-around items-center z-[2]"
          style={{ willChange: "transform" }}
        >
          {defaultCards.map((card) => (
            <div
              key={card.id}
              className="relative w-[10%] h-[75%] bg-black rounded-xl overflow-hidden flex flex-col"
            >
              <div className="flex-1 w-full">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-5 left-5 text-white">
                <h1 className="text-2xl mb-1 font-light uppercase">
                  {card.title}
                </h1>
                <p className="text-sm opacity-70 font-medium">
                  {card.productCode}
                </p>
              </div>
            </div>
          ))}
        </div>

        <canvas
          ref={fillCanvasRef}
          className="absolute top-0 left-0 z-[3]"
          style={{ width: "150%", height: "150%" }}
        />
      </section>

      {/* Outro Section */}
      <section className="relative w-screen h-screen overflow-hidden flex justify-center items-center bg-black text-white">
        <h1 className="text-center text-4xl md:text-6xl lg:text-[80px] uppercase font-light leading-none">
          Chase the <span className="text-orange-500">shadows</span> to embrace
          the light
        </h1>
      </section>
    </div>
  );
}
