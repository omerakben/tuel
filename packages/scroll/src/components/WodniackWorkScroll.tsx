"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { ReactLenis } from "lenis/react";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";

// Import assets - these would normally be real image paths in production
const defaultImages = [
  "/assets/img1.jpg",
  "/assets/img2.jpg",
  "/assets/img3.jpg",
  "/assets/img4.jpg",
  "/assets/img5.jpg",
  "/assets/img6.jpg",
  "/assets/img7.jpg",
];

gsap.registerPlugin(ScrollTrigger);

// Define the extended Line interface for TypeScript
interface ExtendedLine extends THREE.Line {
  curve: THREE.CatmullRomCurve3;
  letterElements: HTMLDivElement[];
}

export interface WodniackWorkScrollProps {
  /** Array of letters to animate */
  letters?: string[];
  /** Array of image URLs for the card textures */
  images?: string[];
  /** Intro text */
  introText?: string;
  /** Outro text */
  outroText?: string;
  /** Primary color for animations */
  primaryColor?: string;
  /** Background color */
  backgroundColor?: string;
  /** Grid dot size */
  dotSize?: number;
  /** Grid spacing */
  gridSpacing?: number;
  /** Number of letter instances per character */
  letterInstanceCount?: number;
  /** Line speed multipliers for letter animations */
  lineSpeedMultipliers?: number[];
  /** Animation lerp factor */
  lerpFactor?: number;
  /** Enable smooth scrolling with Lenis */
  enableSmoothScroll?: boolean;
  /** Custom className for the container */
  className?: string;
  /** Lenis options for smooth scrolling */
  lenisOptions?: {
    lerp?: number;
    smoothWheel?: boolean;
    duration?: number;
  };
}

interface LetterPosition {
  current: { x: number; y: number };
  target: { x: number; y: number };
}

export function WodniackWorkScroll({
  letters = ["W", "O", "R", "K"],
  images = defaultImages,
  introText = "( Intro )",
  outroText = "( Outro )",
  primaryColor = "#f40c3f",
  backgroundColor = "#000000",
  dotSize = 0.75,
  gridSpacing = 20,
  letterInstanceCount = 15,
  lineSpeedMultipliers = [0.8, 1, 0.7, 0.9],
  lerpFactor = 0.07,
  enableSmoothScroll = true,
  className,
  lenisOptions = {
    lerp: 0.1,
    smoothWheel: true,
    duration: 1.2,
  },
}: WodniackWorkScrollProps) {
  return (
    <div className={`wodniack-work-scroll ${className || ""}`}>
      {enableSmoothScroll ? (
        <ReactLenis root options={lenisOptions}>
          <WodniackWorkScrollContent
            letters={letters}
            images={images}
            introText={introText}
            outroText={outroText}
            primaryColor={primaryColor}
            backgroundColor={backgroundColor}
            dotSize={dotSize}
            gridSpacing={gridSpacing}
            letterInstanceCount={letterInstanceCount}
            lineSpeedMultipliers={lineSpeedMultipliers}
            lerpFactor={lerpFactor}
            className={className}
          />
        </ReactLenis>
      ) : (
        <WodniackWorkScrollContent
          letters={letters}
          images={images}
          introText={introText}
          outroText={outroText}
          primaryColor={primaryColor}
          backgroundColor={backgroundColor}
          dotSize={dotSize}
          gridSpacing={gridSpacing}
          letterInstanceCount={letterInstanceCount}
          lineSpeedMultipliers={lineSpeedMultipliers}
          lerpFactor={lerpFactor}
          className={className}
        />
      )}
    </div>
  );
}

interface WodniackWorkScrollContentProps {
  letters: string[];
  images: string[];
  introText: string;
  outroText: string;
  primaryColor: string;
  backgroundColor: string;
  dotSize: number;
  gridSpacing: number;
  letterInstanceCount: number;
  lineSpeedMultipliers: number[];
  lerpFactor: number;
  className?: string;
}

function WodniackWorkScrollContent({
  letters,
  images,
  introText,
  outroText,
  primaryColor,
  backgroundColor,
  dotSize,
  gridSpacing,
  letterInstanceCount,
  lineSpeedMultipliers,
  lerpFactor,
  className,
}: WodniackWorkScrollContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const workRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  // Canvas refs
  const gridCanvasRef = useRef<HTMLCanvasElement>(null);
  const lettersCanvasRef = useRef<HTMLCanvasElement>(null);
  const cardsCanvasRef = useRef<HTMLCanvasElement>(null);

  // Three.js refs
  const lettersSceneRef = useRef<THREE.Scene | null>(null);
  const cardsSceneRef = useRef<THREE.Scene | null>(null);
  const lettersCameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const cardsCameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const lettersRendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cardsRendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const pathsRef = useRef<
    (THREE.Line & {
      curve: THREE.CatmullRomCurve3;
      letterElements: HTMLDivElement[];
    })[]
  >([]);
  const cardsTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const textureCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animation refs
  const lenisRef = useRef<Lenis | null>(null);
  const letterPositionsRef = useRef<Map<HTMLDivElement, LetterPosition>>(
    new Map()
  );
  const animationIdRef = useRef<number | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  // State
  const [isReady, setIsReady] = useState(false);
  const [loadedTextures, setLoadedTextures] = useState<THREE.Texture[]>([]);

  // Utility functions
  const lerp = useCallback((start: number, end: number, t: number) => {
    return start + (end - start) * t;
  }, []);

  // Initialize grid canvas
  const initGridCanvas = useCallback(() => {
    const canvas = gridCanvasRef.current;
    if (!canvas || !workRef.current) return;

    const ctx = canvas.getContext("2d")!;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  // Draw animated grid
  const drawGrid = useCallback(
    (scrollProgress = 0) => {
      const canvas = gridCanvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = primaryColor;

      const rows = Math.ceil(canvas.height / gridSpacing);
      const cols = Math.ceil(canvas.width / gridSpacing) + 15;
      const offset = (scrollProgress * gridSpacing * 10) % gridSpacing;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          ctx.beginPath();
          ctx.arc(
            x * gridSpacing - offset,
            y * gridSpacing,
            dotSize,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }
    },
    [backgroundColor, primaryColor, gridSpacing, dotSize]
  );

  // Create curved animation paths for letters
  const createTextAnimationPath = useCallback(
    (yPos: number, amplitude: number) => {
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        points.push(
          new THREE.Vector3(
            -25 + 50 * t,
            yPos + Math.sin(t * Math.PI) * -amplitude,
            (1 - Math.pow(Math.abs(t - 0.5) * 2, 2)) * -5
          )
        );
      }

      const curve = new THREE.CatmullRomCurve3(points);
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(curve.getPoints(100)),
        new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1 })
      ) as unknown as ExtendedLine;

      line.curve = curve;
      line.letterElements = [];

      return line;
    },
    []
  );

  // Load images as Three.js textures
  const loadImages = useCallback(async () => {
    const textureLoader = new THREE.TextureLoader();
    const loadPromises = images.map(
      (imageSrc) =>
        new Promise<THREE.Texture>((resolve) => {
          textureLoader.load(imageSrc, (texture: THREE.Texture) => {
            texture.generateMipmaps = true;
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            texture.magFilter = THREE.LinearFilter;
            resolve(texture);
          });
        })
    );

    const textures = await Promise.all(loadPromises);
    setLoadedTextures(textures);
    return textures;
  }, [images]);

  // Initialize Three.js scenes
  const initThreeJS = useCallback(() => {
    if (!workRef.current) return;

    // Create scenes
    const lettersScene = new THREE.Scene();
    const cardsScene = new THREE.Scene();
    lettersSceneRef.current = lettersScene;
    cardsSceneRef.current = cardsScene;

    // Create cameras
    const lettersCamera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const cardsCamera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    lettersCamera.position.setZ(20);
    cardsCamera.position.setZ(20);
    lettersCameraRef.current = lettersCamera;
    cardsCameraRef.current = cardsCamera;

    // Create renderers
    const lettersRenderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    lettersRenderer.setSize(window.innerWidth, window.innerHeight);
    lettersRenderer.setClearColor(0x000000, 0);
    lettersRenderer.setPixelRatio(window.devicePixelRatio);

    const cardsRenderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    cardsRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    cardsRenderer.setSize(window.innerWidth, window.innerHeight);
    cardsRenderer.setClearColor(0x000000, 0);

    lettersRendererRef.current = lettersRenderer;
    cardsRendererRef.current = cardsRenderer;

    // Create letter animation paths
    const paths = [
      createTextAnimationPath(10, 2),
      createTextAnimationPath(3.5, 1),
      createTextAnimationPath(-3.5, -1),
      createTextAnimationPath(-10, -2),
    ];

    paths.forEach((line) => lettersScene.add(line));
    pathsRef.current = paths;

    // Add canvases to DOM
    if (lettersCanvasRef.current) {
      lettersCanvasRef.current.remove();
    }
    if (cardsCanvasRef.current) {
      cardsCanvasRef.current.remove();
    }

    lettersRenderer.domElement.style.position = "absolute";
    lettersRenderer.domElement.style.top = "0";
    lettersRenderer.domElement.style.left = "0";
    lettersRenderer.domElement.style.pointerEvents = "none";

    cardsRenderer.domElement.style.position = "absolute";
    cardsRenderer.domElement.style.top = "0";
    cardsRenderer.domElement.style.left = "0";
    cardsRenderer.domElement.style.pointerEvents = "none";

    workRef.current.appendChild(lettersRenderer.domElement);
    workRef.current.appendChild(cardsRenderer.domElement);

    lettersCanvasRef.current = lettersRenderer.domElement;
    cardsCanvasRef.current = cardsRenderer.domElement;

    return () => {
      // Cleanup renderers
      lettersRenderer.dispose();
      cardsRenderer.dispose();

      // Cleanup scenes
      lettersScene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });
      lettersScene.clear();

      cardsScene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });
      cardsScene.clear();
    };
  }, [createTextAnimationPath]);

  // Create letter elements
  const createLetterElements = useCallback(() => {
    if (!textContainerRef.current || !pathsRef.current.length) return;

    // Clear existing letters safely
    textContainerRef.current.textContent = "";
    letterPositionsRef.current.clear();

    pathsRef.current.forEach((line, pathIndex) => {
      line.letterElements = Array.from({ length: letterInstanceCount }, () => {
        const element = document.createElement("div");
        element.className = "wodniack-letter";
        element.textContent = letters[pathIndex] || "X";
        element.style.position = "absolute";
        element.style.transform = "translate(-50%, -50%)";
        element.style.color = primaryColor;
        element.style.fontSize = "4rem";
        element.style.fontWeight = "bold";
        element.style.pointerEvents = "none";
        element.style.zIndex = "10";

        textContainerRef.current!.appendChild(element);

        letterPositionsRef.current.set(element, {
          current: { x: 0, y: 0 },
          target: { x: 0, y: 0 },
        });

        return element;
      });
    });
  }, [letters, letterInstanceCount, primaryColor]);

  // Initialize cards texture canvas
  const initCardsTexture = useCallback(async () => {
    if (
      !loadedTextures.length ||
      !cardsSceneRef.current ||
      !cardsRendererRef.current
    )
      return;

    // Create texture canvas
    const textureCanvas = document.createElement("canvas");
    textureCanvas.width = 4096;
    textureCanvas.height = 2048;
    textureCanvasRef.current = textureCanvas;

    // Create cards texture
    const cardsTexture = new THREE.CanvasTexture(textureCanvas);
    cardsTexture.generateMipmaps = true;
    cardsTexture.minFilter = THREE.LinearMipmapLinearFilter;
    cardsTexture.magFilter = THREE.LinearFilter;
    cardsTexture.anisotropy =
      cardsRendererRef.current.capabilities.getMaxAnisotropy();
    cardsTexture.wrapS = THREE.RepeatWrapping;
    cardsTexture.wrapT = THREE.RepeatWrapping;
    cardsTextureRef.current = cardsTexture;

    // Create cards plane
    const cardsPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 15, 50, 1),
      new THREE.MeshBasicMaterial({
        map: cardsTexture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1,
        depthTest: false,
        depthWrite: false,
      })
    );

    // Create curved geometry
    const positions = cardsPlane.geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      positions.setZ(i, Math.pow(positions.getX(i) / 15, 2) * 5);
    }
    positions.needsUpdate = true;

    cardsSceneRef.current.add(cardsPlane);
  }, [loadedTextures]);

  // Draw cards on texture canvas
  const drawCardsOnCanvas = useCallback(
    (offset = 0) => {
      const canvas = textureCanvasRef.current;
      if (!canvas || !loadedTextures.length) return;

      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cardWidth = canvas.width / 3;
      const cardHeight = canvas.height / 2;
      const spacing = canvas.width / 2.5;

      loadedTextures.forEach((texture, i) => {
        if (texture.image) {
          ctx.drawImage(
            texture.image,
            i * spacing + (0.35 - offset) * canvas.width * 5 - cardWidth,
            (canvas.height - cardHeight) / 2,
            cardWidth,
            cardHeight
          );
        }
      });

      if (cardsTextureRef.current) {
        cardsTextureRef.current.needsUpdate = true;
      }
    },
    [loadedTextures]
  );

  // Update letter target positions
  const updateTargetPositions = useCallback(
    (scrollProgress = 0) => {
      if (!pathsRef.current.length || !lettersCameraRef.current) return;

      pathsRef.current.forEach((line, lineIndex) => {
        const speedMultiplier = lineSpeedMultipliers[lineIndex] || 1;

        line.letterElements.forEach((element: HTMLDivElement, i: number) => {
          const point = line.curve.getPoint(
            (i / (letterInstanceCount - 1) + scrollProgress * speedMultiplier) %
              1
          );
          const vector = point.clone().project(lettersCameraRef.current!);
          const positions = letterPositionsRef.current.get(element);

          if (positions) {
            positions.target = {
              x: (-vector.x * 0.5 + 0.5) * window.innerWidth,
              y: (-vector.y * 0.5 + 0.5) * window.innerHeight,
            };
          }
        });
      });
    },
    [letterInstanceCount, lineSpeedMultipliers]
  );

  // Update letter positions with lerp
  const updateLetterPositions = useCallback(() => {
    letterPositionsRef.current.forEach((positions, element) => {
      const distX = positions.target.x - positions.current.x;

      if (Math.abs(distX) > window.innerWidth * 0.7) {
        positions.current.x = positions.target.x;
        positions.current.y = positions.target.y;
      } else {
        positions.current.x = lerp(
          positions.current.x,
          positions.target.x,
          lerpFactor
        );
        positions.current.y = lerp(
          positions.current.y,
          positions.target.y,
          lerpFactor
        );
      }

      element.style.transform = `translate(-50%, -50%) translate3d(${positions.current.x}px, ${positions.current.y}px, 0px)`;
    });
  }, [lerp, lerpFactor]);

  // Animation loop
  const animate = useCallback(() => {
    updateLetterPositions();

    if (
      lettersSceneRef.current &&
      lettersCameraRef.current &&
      lettersRendererRef.current
    ) {
      lettersRendererRef.current.render(
        lettersSceneRef.current,
        lettersCameraRef.current
      );
    }

    if (
      cardsSceneRef.current &&
      cardsCameraRef.current &&
      cardsRendererRef.current
    ) {
      cardsRendererRef.current.render(
        cardsSceneRef.current,
        cardsCameraRef.current
      );
    }

    animationIdRef.current = requestAnimationFrame(animate);
  }, [updateLetterPositions]);

  // Initialize ScrollTrigger
  const initScrollTrigger = useCallback(() => {
    if (!workRef.current) return;

    const scrollTrigger = ScrollTrigger.create({
      trigger: workRef.current,
      start: "top top",
      end: "+=700%",
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self: any) => {
        updateTargetPositions(self.progress);
        drawCardsOnCanvas(self.progress);
        drawGrid(self.progress);
      },
    });

    scrollTriggerRef.current = scrollTrigger;
  }, [updateTargetPositions, drawCardsOnCanvas, drawGrid]);

  // Handle window resize
  const handleResize = useCallback(() => {
    if (
      !lettersCameraRef.current ||
      !cardsCameraRef.current ||
      !lettersRendererRef.current ||
      !cardsRendererRef.current
    )
      return;

    // Update cameras
    lettersCameraRef.current.aspect = window.innerWidth / window.innerHeight;
    lettersCameraRef.current.updateProjectionMatrix();
    cardsCameraRef.current.aspect = window.innerWidth / window.innerHeight;
    cardsCameraRef.current.updateProjectionMatrix();

    // Update renderers
    lettersRendererRef.current.setSize(window.innerWidth, window.innerHeight);
    cardsRendererRef.current.setSize(window.innerWidth, window.innerHeight);
    cardsRendererRef.current.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );

    // Update grid canvas
    const canvas = gridCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d")!;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    }

    // Redraw grid and update positions
    const progress = scrollTriggerRef.current?.progress || 0;
    drawGrid(progress);
    updateTargetPositions(progress);
  }, [drawGrid, updateTargetPositions]);

  // Main initialization effect
  useEffect(() => {
    const init = async () => {
      try {
        // Initialize grid canvas
        initGridCanvas();

        // Load images
        await loadImages();

        // Initialize Three.js
        initThreeJS();

        // Create letter elements
        createLetterElements();

        // Initialize cards texture
        await initCardsTexture();

        // Initialize animations
        drawGrid(0);
        updateTargetPositions(0);

        // Start animation loop
        animate();

        // Initialize ScrollTrigger
        initScrollTrigger();

        // Add resize listener
        window.addEventListener("resize", handleResize);

        setIsReady(true);
      } catch (error) {
        console.error("Failed to initialize WodniackWorkScroll:", error);
      }
    };

    init();

    return () => {
      // Cleanup
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }

      if (lenisRef.current) {
        lenisRef.current.destroy();
      }

      window.removeEventListener("resize", handleResize);

      // Cleanup Three.js resources comprehensively
      if (lettersRendererRef.current) {
        lettersRendererRef.current.dispose();
      }
      if (cardsRendererRef.current) {
        cardsRendererRef.current.dispose();
      }

      // Cleanup scenes and remove all objects
      if (lettersSceneRef.current) {
        lettersSceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach((material) => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
        });
        lettersSceneRef.current.clear();
      }

      if (cardsSceneRef.current) {
        cardsSceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach((material) => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
        });
        cardsSceneRef.current.clear();
      }

      // Cleanup textures
      if (cardsTextureRef.current) {
        cardsTextureRef.current.dispose();
      }

      // Cleanup paths and curves
      pathsRef.current.forEach((path) => {
        if (path.geometry) path.geometry.dispose();
        if (path.material) {
          if (Array.isArray(path.material)) {
            path.material.forEach((material) => material.dispose());
          } else {
            path.material.dispose();
          }
        }
      });
      pathsRef.current = [];

      // Cleanup texture canvas
      if (textureCanvasRef.current) {
        textureCanvasRef.current = null;
      }
    };
  }, [
    initGridCanvas,
    loadImages,
    initThreeJS,
    createLetterElements,
    initCardsTexture,
    drawGrid,
    updateTargetPositions,
    animate,
    initScrollTrigger,
    handleResize,
  ]);

  return (
    <div
      className={`wodniack-work-scroll-content ${className || ""}`}
      ref={containerRef}
    >
      <section className="wodniack-intro">
        <h1>{introText}</h1>
      </section>

      <section className="wodniack-work" ref={workRef}>
        <canvas ref={gridCanvasRef} className="wodniack-grid-canvas" />
        <div ref={textContainerRef} className="wodniack-text-container" />
      </section>

      <section className="wodniack-outro">
        <h1>{outroText}</h1>
      </section>

      {!isReady && (
        <div className="wodniack-loading">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
}
